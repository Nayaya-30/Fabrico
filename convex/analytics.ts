import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requirePermission } from "./auth";

export const getAdminAnalytics = query({
	args: {
		clerkId: v.string(),
		startDate: v.optional(v.number()),
		endDate: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx, args.clerkId);
		requirePermission(user.role, "VIEW_ANALYTICS");

		const now = Date.now();
		const start = args.startDate || now - 30 * 24 * 60 * 60 * 1000; // 30 days ago
		const end = args.endDate || now;

		// Get all orders in date range
		const orders = await ctx.db
			.query("orders")
			.withIndex("by_created")
			.filter((q) =>
				q.and(q.gte(q.field("createdAt"), start), q.lte(q.field("createdAt"), end))
			)
			.collect();

		// Calculate metrics
		const totalOrders = orders.length;
		const totalRevenue = orders.reduce((sum, o) => sum + o.amountPaid, 0);
		const pendingRevenue = orders.reduce((sum, o) => sum + o.balance, 0);

		const completedOrders = orders.filter((o) => o.status === "delivered").length;
		const activeOrders = orders.filter(
			(o) => o.status !== "delivered" && o.status !== "cancelled"
		).length;
		const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;

		// Orders by status
		const ordersByStatus = orders.reduce((acc, order) => {
			acc[order.status] = (acc[order.status] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		// Revenue by day
		const revenueByDay = orders.reduce((acc, order) => {
			const day = new Date(order.createdAt).toISOString().split("T")[0];
			acc[day] = (acc[day] || 0) + order.totalAmount;
			return acc;
		}, {} as Record<string, number>);

		// Top workers
		const workerPerformance = await Promise.all(
			(
				await ctx.db
					.query("users")
					.withIndex("by_role", (q) => q.eq("role", "worker"))
					.collect()
			).map(async (worker) => {
				const workerOrders = orders.filter((o) => o.assignedWorkerId === worker._id);
				const profile = await ctx.db
					.query("workerProfiles")
					.withIndex("by_user", (q) => q.eq("userId", worker._id))
					.first();

				return {
					name: worker.fullName,
					ordersCompleted: workerOrders.filter((o) => o.status === "delivered").length,
					rating: profile?.rating || 0,
					revenue: workerOrders.reduce((sum, o) => sum + o.totalAmount, 0),
				};
			})
		);

		// Average order value
		const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

		// Completion rate
		const completionRate =
			totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

		return {
			summary: {
				totalOrders,
				totalRevenue,
				pendingRevenue,
				completedOrders,
				activeOrders,
				cancelledOrders,
				avgOrderValue,
				completionRate,
			},
			ordersByStatus,
			revenueByDay,
			workerPerformance: workerPerformance.sort((a, b) => b.ordersCompleted - a.ordersCompleted),
		};
	},
});
