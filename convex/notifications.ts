// convex/notifications.ts - COMPLETE
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./auth";

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

export const createNotification = mutation({
	args: {
		userId: v.id("users"),
		title: v.string(),
		message: v.string(),
		type: v.union(
			v.literal("order_update"),
			v.literal("payment"),
			v.literal("assignment"),
			v.literal("deadline"),
			v.literal("delay"),
			v.literal("message"),
			v.literal("huddle")
		),
		relatedId: v.optional(v.string()),
		sentVia: v.array(v.string()),
	},
	handler: async (ctx, args) => {
		const notificationId = await ctx.db.insert("notifications", {
			...args,
			isRead: false,
			createdAt: Date.now(),
		});

		return notificationId;
	},
});
