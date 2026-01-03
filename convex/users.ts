// convex/users.ts - COMPLETE
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./auth";

export const getAllUsers = query({
	args: { clerkId: v.string() },
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx, args.clerkId);

		if (user.role !== "admin") {
			throw new Error("Access denied");
		}

		const users = await ctx.db.query("users").collect();
		return users.sort((a, b) => b.createdAt - a.createdAt);
	},
});

export const getUserById = query({
	args: {
		clerkId: v.string(),
		userId: v.id("users"),
	},
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx, args.clerkId);

		if (user.role !== "admin") {
			throw new Error("Access denied");
		}

		return await ctx.db.get(args.userId);
	},
});

export const updateUserStatus = mutation({
	args: {
		clerkId: v.string(),
		userId: v.id("users"),
		status: v.union(v.literal("active"), v.literal("suspended"), v.literal("inactive")),
	},
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx, args.clerkId);

		if (user.role !== "admin") {
			throw new Error("Access denied");
		}

		await ctx.db.patch(args.userId, {
			status: args.status,
			updatedAt: Date.now(),
		});

		await ctx.db.insert("auditLogs", {
			userId: user._id,
			action: "USER_STATUS_CHANGED",
			resource: "users",
			resourceId: args.userId,
			changes: { status: args.status },
			timestamp: Date.now(),
		});

		return { success: true };
	},
});

export const getUsersByRole = query({
	args: {
		clerkId: v.string(),
		role: v.union(
			v.literal("customer"),
			v.literal("worker"),
			v.literal("manager"),
			v.literal("admin")
		),
	},
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx, args.clerkId);

		if (!["manager", "admin"].includes(user.role)) {
			throw new Error("Access denied");
		}

		const users = await ctx.db
			.query("users")
			.withIndex("by_role", (q) => q.eq("role", args.role))
			.collect();

		return users;
	},
});

export const searchUsers = query({
	args: {
		clerkId: v.string(),
		query: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx, args.clerkId);

		if (user.role !== "admin") {
			throw new Error("Access denied");
		}

		const allUsers = await ctx.db.query("users").collect();

		const searchTerm = args.query.toLowerCase();
		return allUsers.filter(
			(u) =>
				u.fullName.toLowerCase().includes(searchTerm) ||
				u.email.toLowerCase().includes(searchTerm) ||
				(u.phone && u.phone.includes(searchTerm))
		);
	},
});

// convex/users.ts (Additional queries)
// export const getAllUsers = query({
//	args: { clerkId: v.string() },
//	handler: async (ctx, args) => {
//		const user = await requireAuth(ctx, args.clerkId);

//		if (user.role !== "admin") {
//			throw new Error("Access denied");
//		}

//		const users = await ctx.db.query("users").collect();
//		return users.sort((a, b) => b.createdAt - a.createdAt);
//	},
// });