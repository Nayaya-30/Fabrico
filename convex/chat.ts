// convex/chat.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, canChat } from "./auth";

// ============ CHAT QUERIES ============
export const getConversations = query({
	args: { clerkId: v.string() },
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx, args.clerkId);

		const conversations = await ctx.db
			.query("conversations")
			.filter((q) => q.eq(q.field("participants"), user._id))
			.collect();

		// Get conversation details with last message
		const conversationsWithDetails = await Promise.all(
			conversations.map(async (conv) => {
				const lastMessage = await ctx.db
					.query("messages")
					.withIndex("by_conversation_timestamp", (q) => q.eq("conversationId", conv._id))
					.order("desc")
					.first();

				const otherParticipantId = conv.participants.find((p) => p !== user._id);
				const otherParticipant = otherParticipantId
					? await ctx.db.get(otherParticipantId)
					: null;

				const unreadCount = await ctx.db
					.query("messages")
					.withIndex("by_conversation", (q) => q.eq("conversationId", conv._id))
					.filter((q) =>
						q.and(
							q.neq(q.field("senderId"), user._id),
							q.eq(q.field("isRead"), false)
						)
					)
					.collect();

				return {
					...conv,
					lastMessage,
					otherParticipant,
					unreadCount: unreadCount.length,
				};
			})
		);

		// Sort by last message time
		conversationsWithDetails.sort((a, b) => b.lastMessageAt - a.lastMessageAt);

		return conversationsWithDetails;
	},
});

export const getMessages = query({
	args: {
		clerkId: v.string(),
		conversationId: v.id("conversations"),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx, args.clerkId);

		const conversation = await ctx.db.get(args.conversationId);
		if (!conversation) {
			throw new Error("Conversation not found");
		}

		// Check if user is participant
		if (!conversation.participants.includes(user._id)) {
			throw new Error("Access denied");
		}

		let messagesQuery = ctx.db
			.query("messages")
			.withIndex("by_conversation_timestamp", (q) => q.eq("conversationId", args.conversationId))
			.order("desc");

		const messages = await messagesQuery.collect();

		// Limit if specified
		const limited = args.limit ? messages.slice(0, args.limit) : messages;

		// Get sender details
		const messagesWithSenders = await Promise.all(
			limited.map(async (msg) => {
				const sender = await ctx.db.get(msg.senderId);
				return {
					...msg,
					sender,
				};
			})
		);

		return messagesWithSenders.reverse();
	},
});

export const getOrCreateConversation = mutation({
	args: {
		clerkId: v.string(),
		targetUserId: v.id("users"),
	},
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx, args.clerkId);
		const targetUser = await ctx.db.get(args.targetUserId);

		if (!targetUser) {
			throw new Error("Target user not found");
		}

		// Check if chat is allowed
		if (!canChat(user.role, targetUser.role)) {
			throw new Error("Chat not allowed between these roles");
		}

		// Check if conversation exists - Fixed query
		const participants = [user._id, args.targetUserId].sort();

		// Get all conversations and filter in JavaScript instead of in query
		const allConversations = await ctx.db
			.query("conversations")
			.collect();

		const existingConversation = allConversations.find((conv) => {
			const sortedParticipants = [...conv.participants].sort();
			return (
				conv.participants.length === 2 &&
				sortedParticipants[0] === participants[0] &&
				sortedParticipants[1] === participants[1]
			);
		});

		if (existingConversation) {
			return existingConversation._id;
		}

		// Determine conversation type
		let type: "customer_admin" | "worker_manager" | "manager_admin" | "admin_anyone" = "admin_anyone";

		if (user.role === "customer" && targetUser.role === "admin") {
			type = "customer_admin";
		} else if (user.role === "worker" && targetUser.role === "manager") {
			type = "worker_manager";
		} else if (user.role === "manager" && targetUser.role === "admin") {
			type = "manager_admin";
		}

		// Create new conversation
		const conversationId = await ctx.db.insert("conversations", {
			participants,
			type,
			lastMessageAt: Date.now(),
			createdAt: Date.now(),
		});

		return conversationId;
	},
});

export const sendMessage = mutation({
	args: {
		clerkId: v.string(),
		conversationId: v.id("conversations"),
		content: v.string(),
		media: v.optional(v.array(v.string())),
	},
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx, args.clerkId);

		const conversation = await ctx.db.get(args.conversationId);
		if (!conversation) {
			throw new Error("Conversation not found");
		}

		// Check if user is participant
		if (!conversation.participants.includes(user._id)) {
			throw new Error("Access denied");
		}

		// Create message
		const messageId = await ctx.db.insert("messages", {
			conversationId: args.conversationId,
			senderId: user._id,
			content: args.content,
			media: args.media,
			isRead: false,
			timestamp: Date.now(),
		});

		// Update conversation last message time
		await ctx.db.patch(args.conversationId, {
			lastMessageAt: Date.now(),
		});

		// Notify other participants
		const otherParticipants = conversation.participants.filter((p) => p !== user._id);

		for (const participantId of otherParticipants) {
			await ctx.db.insert("notifications", {
				userId: participantId,
				title: "New Message",
				message: `${user.fullName}: ${args.content.substring(0, 50)}${args.content.length > 50 ? "..." : ""}`,
				type: "message",
				relatedId: args.conversationId,
				isRead: false,
				sentVia: ["app"],
				createdAt: Date.now(),
			});
		}

		return messageId;
	},
});

export const markMessagesAsRead = mutation({
	args: {
		clerkId: v.string(),
		conversationId: v.id("conversations"),
	},
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx, args.clerkId);

		const conversation = await ctx.db.get(args.conversationId);
		if (!conversation) {
			throw new Error("Conversation not found");
		}

		if (!conversation.participants.includes(user._id)) {
			throw new Error("Access denied");
		}

		// Get unread messages
		const unreadMessages = await ctx.db
			.query("messages")
			.withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
			.filter((q) =>
				q.and(
					q.neq(q.field("senderId"), user._id),
					q.eq(q.field("isRead"), false)
				)
			)
			.collect();

		// Mark as read
		for (const message of unreadMessages) {
			await ctx.db.patch(message._id, { isRead: true });
		}

		return { updated: unreadMessages.length };
	},
});

// convex/notifications.ts
export const getNotifications = query({
	args: {
		clerkId: v.string(),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx, args.clerkId);

		let notificationsQuery = ctx.db
			.query("notifications")
			.withIndex("by_user", (q) => q.eq("userId", user._id))
			.order("desc");

		const notifications = await notificationsQuery.collect();

		return args.limit ? notifications.slice(0, args.limit) : notifications;
	},
});

export const getUnreadNotificationCount = query({
	args: { clerkId: v.string() },
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx, args.clerkId);

		const unread = await ctx.db
			.query("notifications")
			.withIndex("by_user_unread", (q) => q.eq("userId", user._id).eq("isRead", false))
			.collect();

		return unread.length;
	},
});

export const markNotificationAsRead = mutation({
	args: {
		clerkId: v.string(),
		notificationId: v.id("notifications"),
	},
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx, args.clerkId);

		const notification = await ctx.db.get(args.notificationId);
		if (!notification) {
			throw new Error("Notification not found");
		}

		if (notification.userId !== user._id) {
			throw new Error("Access denied");
		}

		await ctx.db.patch(args.notificationId, { isRead: true });

		return { success: true };
	},
});

export const markAllNotificationsAsRead = mutation({
	args: { clerkId: v.string() },
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx, args.clerkId);

		const unread = await ctx.db
			.query("notifications")
			.withIndex("by_user_unread", (q) => q.eq("userId", user._id).eq("isRead", false))
			.collect();

		for (const notification of unread) {
			await ctx.db.patch(notification._id, { isRead: true });
		}

		return { updated: unread.length };
	},
});

// convex/huddles.ts
export const getHuddles = query({
	args: {
		clerkId: v.string(),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx, args.clerkId);

		// Only workers, managers, and admins can view huddles
		if (!["worker", "manager", "admin"].includes(user.role)) {
			throw new Error("Access denied");
		}

		const huddles = await ctx.db
			.query("huddles")
			.withIndex("by_created")
			.order("desc")
			.filter((q) => q.eq(q.field("targetRoles"), user.role))
			.collect();

		// Get pinned huddles
		const pinned = huddles.filter((h) => h.isPinned);
		const unpinned = huddles.filter((h) => !h.isPinned);

		const sorted = [...pinned, ...unpinned];

		// Add poster details
		const huddlesWithPosters = await Promise.all(
			sorted.map(async (huddle) => {
				const poster = await ctx.db.get(huddle.postedByUserId);
				return {
					...huddle,
					poster,
				};
			})
		);

		return args.limit ? huddlesWithPosters.slice(0, args.limit) : huddlesWithPosters;
	},
});

export const createHuddle = mutation({
  args: {
    clerkId: v.string(),
    title: v.string(),
    content: v.string(),
    type: v.union(
      v.literal("announcement"),
      v.literal("briefing"),
      v.literal("urgent"),
      v.literal("delay_notice")
    ),
    targetRoles: v.array(v.string()),
    isPinned: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.clerkId);
    
    if (!["manager", "admin"].includes(user.role)) {
      throw new Error("Access denied");
    }
    
    const { clerkId, ...huddleData } = args;
    
    const huddleId = await ctx.db.insert("huddles", {
      ...huddleData,
      postedByUserId: user._id,
      isPinned: args.isPinned || false,
      createdAt: Date.now(),
    });
    
    // Notify target users - Fixed filter
    const allUsers = await ctx.db.query("users").collect();
    const filteredUsers = allUsers.filter((u) => args.targetRoles.includes(u.role));
    
    for (const targetUser of filteredUsers) {
      await ctx.db.insert("notifications", {
        userId: targetUser._id,
        title: "Workshop Huddle",
        message: args.title,
        type: "huddle",
        relatedId: huddleId,
        isRead: false,
        sentVia: ["app"],
        createdAt: Date.now(),
      });
    }
    
    await ctx.db.insert("auditLogs", {
      userId: user._id,
      action: "HUDDLE_CREATED",
      resource: "huddles",
      resourceId: huddleId,
      timestamp: Date.now(),
    });
    
    return huddleId;
  },
});