// convex/workers.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requirePermission } from "./auth";

export const getWorkers = query({
  args: {
    clerkId: v.string(),
    isAvailable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.clerkId);
    requirePermission(user.role, "VIEW_WORKER_PROFILES");

    let workersQuery = ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "worker"));

    const workers = await workersQuery.collect();

    const workersWithProfiles = await Promise.all(
      workers.map(async (worker) => {
        const profile = await ctx.db
          .query("workerProfiles")
          .withIndex("by_user", (q) => q.eq("userId", worker._id))
          .first();

        return {
          ...worker,
          profile,
        };
      })
    );

    // Filter by availability if specified
    if (args.isAvailable !== undefined) {
      return workersWithProfiles.filter(
        (w) => w.profile?.isAvailable === args.isAvailable
      );
    }

    return workersWithProfiles;
  },
});

export const assignWorkerToOrder = mutation({
  args: {
    clerkId: v.string(),
    orderId: v.id("orders"),
    workerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.clerkId);
    requirePermission(user.role, "ASSIGN_WORKER");

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    const worker = await ctx.db.get(args.workerId);
    if (!worker || worker.role !== "worker") {
      throw new Error("Invalid worker");
    }

    const workerProfile = await ctx.db
      .query("workerProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.workerId))
      .first();

    if (!workerProfile) {
      throw new Error("Worker profile not found");
    }

    // Check workload
    if (workerProfile.currentWorkload >= workerProfile.maxWorkload) {
      throw new Error("Worker has reached maximum workload");
    }

    // Update order
    await ctx.db.patch(args.orderId, {
      assignedWorkerId: args.workerId,
      assignedManagerId: user.role === "manager" ? user._id : undefined,
      updatedAt: Date.now(),
    });

    // Update worker workload
    await ctx.db.patch(workerProfile._id, {
      currentWorkload: workerProfile.currentWorkload + 1,
    });

    // Notify worker
    await ctx.db.insert("notifications", {
      userId: args.workerId,
      title: "New Assignment",
      message: `You've been assigned to order ${order.orderNumber}`,
      type: "assignment",
      relatedId: args.orderId,
      isRead: false,
      sentVia: ["app", "sms"],
      createdAt: Date.now(),
    });

    // Audit log
    await ctx.db.insert("auditLogs", {
      userId: user._id,
      action: "WORKER_ASSIGNED",
      resource: "orders",
      resourceId: args.orderId,
      changes: { workerId: args.workerId },
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

export const getWorkerWorkload = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.clerkId);
    requirePermission(user.role, "VIEW_WORKLOAD");

    const workers = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "worker"))
      .collect();

    const workloadData = await Promise.all(
      workers.map(async (worker) => {
        const profile = await ctx.db
          .query("workerProfiles")
          .withIndex("by_user", (q) => q.eq("userId", worker._id))
          .first();

        const activeOrders = await ctx.db
          .query("orders")
          .withIndex("by_worker", (q) => q.eq("assignedWorkerId", worker._id))
          .filter((q) =>
            q.and(
              q.neq(q.field("status"), "delivered"),
              q.neq(q.field("status"), "cancelled")
            )
          )
          .collect();

        return {
          worker: {
            id: worker._id,
            name: worker.fullName,
            avatar: worker.avatar,
          },
          currentWorkload: profile?.currentWorkload || 0,
          maxWorkload: profile?.maxWorkload || 5,
          activeOrders: activeOrders.length,
          rating: profile?.rating || 0,
          isAvailable: profile?.isAvailable || false,
        };
      })
    );

    return workloadData.sort((a, b) => b.currentWorkload - a.currentWorkload);
  },
});

export const updateWorkerRating = mutation({
  args: {
    clerkId: v.string(),
    orderId: v.id("orders"),
    workerId: v.id("users"),
    rating: v.number(),
    accuracy: v.number(),
    timeliness: v.number(),
    quality: v.number(),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.clerkId);

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // Only customer who placed the order can rate
    if (order.customerId !== user._id) {
      throw new Error("Unauthorized");
    }

    // Check if already rated
    const existingRating = await ctx.db
      .query("workerRatings")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .first();

    if (existingRating) {
      throw new Error("Order already rated");
    }

    // Create rating
    await ctx.db.insert("workerRatings", {
      orderId: args.orderId,
      workerId: args.workerId,
      customerId: user._id,
      rating: args.rating,
      accuracy: args.accuracy,
      timeliness: args.timeliness,
      quality: args.quality,
      comment: args.comment,
      createdAt: Date.now(),
    });

    // Update worker profile rating
    const workerProfile = await ctx.db
      .query("workerProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.workerId))
      .first();

    if (workerProfile) {
      const allRatings = await ctx.db
        .query("workerRatings")
        .withIndex("by_worker", (q) => q.eq("workerId", args.workerId))
        .collect();

      const avgRating =
        allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

      await ctx.db.patch(workerProfile._id, {
        rating: avgRating,
        totalCompletedOrders: workerProfile.totalCompletedOrders + 1,
      });

      // Award badges
      const badges = [...workerProfile.badges];
      if (avgRating >= 4.5 && !badges.includes("customer_favorite")) {
        badges.push("customer_favorite");
      }
      if (
        allRatings.filter((r) => r.timeliness >= 4.5).length >= 10 &&
        !badges.includes("fastest")
      ) {
        badges.push("fastest");
      }
      if (
        allRatings.filter((r) => r.accuracy >= 4.5).length >= 10 &&
        !badges.includes("most_accurate")
      ) {
        badges.push("most_accurate");
      }

      await ctx.db.patch(workerProfile._id, { badges });
    }

    return { success: true };
  },
});

// convex/workers.ts (Additional query)
export const getWorkerProfile = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.clerkId);
    
    const profile = await ctx.db
      .query("workerProfiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    
    return profile;
  },
});