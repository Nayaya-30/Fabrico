// convex/huddles.ts - COMPLETE
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requirePermission } from "./auth";

export const getHuddles = query({
	args: {
		clerkId: v.string(),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx, args.clerkId);

		if (!["worker", "manager", "admin"].includes(user.role)) {
			throw new Error("Access denied");
		}

		const allHuddles = await ctx.db
			.query("huddles")
			.withIndex("by_created")
			.order("desc")
			.collect();

		// Filter huddles by target roles
		const huddles = allHuddles.filter((h) => h.targetRoles.includes(user.role));

		const pinned = huddles.filter((h) => h.isPinned);
		const unpinned = huddles.filter((h) => !h.isPinned);

		const sorted = [...pinned, ...unpinned];

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

export const getHuddleById = query({
	args: {
		clerkId: v.string(),
		huddleId: v.id("huddles"),
	},
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx, args.clerkId);

		const huddle = await ctx.db.get(args.huddleId);
		if (!huddle) {
			throw new Error("Huddle not found");
		}

		if (!huddle.targetRoles.includes(user.role)) {
			throw new Error("Access denied");
		}

		const poster = await ctx.db.get(huddle.postedByUserId);

		return {
			...huddle,
			poster,
		};
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

		// Notify target users
		const targetUsers = await ctx.db.query("users").collect();
		const filteredUsers = targetUsers.filter((u) => args.targetRoles.includes(u.role));

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

export const updateHuddle = mutation({
	args: {
		clerkId: v.string(),
		huddleId: v.id("huddles"),
		title: v.optional(v.string()),
		content: v.optional(v.string()),
		isPinned: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx, args.clerkId);

		if (!["manager", "admin"].includes(user.role)) {
			throw new Error("Access denied");
		}

		const huddle = await ctx.db.get(args.huddleId);
		if (!huddle) {
			throw new Error("Huddle not found");
		}

		await ctx.db.patch(args.huddleId, {
			...(args.title && { title: args.title }),
			...(args.content && { content: args.content }),
			...(args.isPinned !== undefined && { isPinned: args.isPinned }),
		});

		return { success: true };
	},
});

export const deleteHuddle = mutation({
	args: {
		clerkId: v.string(),
		huddleId: v.id("huddles"),
	},
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx, args.clerkId);

		if (user.role !== "admin") {
			throw new Error("Access denied");
		}

		await ctx.db.delete(args.huddleId);

		return { success: true };
	},
});
