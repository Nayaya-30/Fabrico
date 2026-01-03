// convex/orders.ts (Additional queries)
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requirePermission } from "./auth";

export const getWorkerAssignedOrders = query({
	args: { clerkId: v.string() },
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx, args.clerkId);

		if (user.role !== "worker") {
			throw new Error("Access denied");
		}

		const orders = await ctx.db
			.query("orders")
			.withIndex("by_worker", (q) => q.eq("assignedWorkerId", user._id))
			.collect();

		return orders.sort((a, b) => b.createdAt - a.createdAt);
	},
});

export const getAllOrders = query({
	args: { clerkId: v.string() },
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx, args.clerkId);

		if (!["manager", "admin"].includes(user.role)) {
			throw new Error("Access denied");
		}

		const orders = await ctx.db.query("orders").collect();
		return orders.sort((a, b) => b.createdAt - a.createdAt);
	},
});