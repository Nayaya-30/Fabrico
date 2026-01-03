// convex/styles.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requirePermission } from "./auth";

// ============ STYLE QUERIES ============
export const getStyles = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let stylesQuery = ctx.db.query("styles").withIndex("by_active", (q: any) => q.eq("isActive", true));
    
    const styles = await stylesQuery.collect();
    
    // Filter by category if provided
    let filtered = args.category
      ? styles.filter((s) => s.category === args.category)
      : styles;
    
    // Sort by likes and orders
    filtered.sort((a, b) => (b.likes + b.orders) - (a.likes + a.orders));
    
    // Limit results
    if (args.limit) {
      filtered = filtered.slice(0, args.limit);
    }
    
    // If user is logged in, check likes/saves
    if (args.clerkId) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", args.clerkId))
        .first();
      
      if (user) {
        const userLikes = await ctx.db
          .query("styleLikes")
          .withIndex("by_user", (q: any) => q.eq("userId", user._id))
          .collect();
        
        const userSaves = await ctx.db
          .query("styleSaves")
          .withIndex("by_user", (q: any) => q.eq("userId", user._id))
          .collect();
        
        const likedIds = new Set(userLikes.map((l) => l.styleId));
        const savedIds = new Set(userSaves.map((s) => s.styleId));
        
        return filtered.map((style) => ({
          ...style,
          isLiked: likedIds.has(style._id),
          isSaved: savedIds.has(style._id),
        }));
      }
    }
    
    return filtered;
  },
});

export const getStyleById = query({
  args: { styleId: v.id("styles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.styleId);
  },
});

export const getUserSavedStyles = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.clerkId);
    
    const saves = await ctx.db
      .query("styleSaves")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    
    const styles = await Promise.all(
      saves.map((save) => ctx.db.get(save.styleId))
    );
    
    return styles.filter((s) => s !== null);
  },
});

// ============ STYLE MUTATIONS ============
export const createStyle = mutation({
  args: {
    clerkId: v.string(),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    images: v.array(v.string()),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    estimatedHours: v.number(),
    basePrice: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.clerkId);
    requirePermission(user.role, "CREATE_STYLE");
    
    const { clerkId, ...styleData } = args;
    
    const styleId = await ctx.db.insert("styles", {
      ...styleData,
      createdByAdminId: user._id,
      likes: 0,
      orders: 0,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    await ctx.db.insert("auditLogs", {
      userId: user._id,
      action: "STYLE_CREATED",
      resource: "styles",
      resourceId: styleId,
      timestamp: Date.now(),
    });
    
    return styleId;
  },
});

export const likeStyle = mutation({
  args: {
    clerkId: v.string(),
    styleId: v.id("styles"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.clerkId);
    
    const existing = await ctx.db
      .query("styleLikes")
      .withIndex("by_user_and_style", (q) =>
        q.eq("userId", user._id).eq("styleId", args.styleId)
      )
      .first();
    
    if (existing) {
      // Unlike
      await ctx.db.delete(existing._id);
      
      const style = await ctx.db.get(args.styleId);
      if (style) {
        await ctx.db.patch(args.styleId, {
          likes: Math.max(0, style.likes - 1),
        });
      }
      
      return { liked: false };
    } else {
      // Like
      await ctx.db.insert("styleLikes", {
        styleId: args.styleId,
        userId: user._id,
        createdAt: Date.now(),
      });
      
      const style = await ctx.db.get(args.styleId);
      if (style) {
        await ctx.db.patch(args.styleId, {
          likes: style.likes + 1,
        });
      }
      
      return { liked: true };
    }
  },
});

export const saveStyle = mutation({
  args: {
    clerkId: v.string(),
    styleId: v.id("styles"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.clerkId);
    
    const existing = await ctx.db
      .query("styleSaves")
      .withIndex("by_user_and_style", (q) =>
        q.eq("userId", user._id).eq("styleId", args.styleId)
      )
      .first();
    
    if (existing) {
      // Unsave
      await ctx.db.delete(existing._id);
      return { saved: false };
    } else {
      // Save
      await ctx.db.insert("styleSaves", {
        styleId: args.styleId,
        userId: user._id,
        createdAt: Date.now(),
      });
      return { saved: true };
    }
  },
});

// convex/orders.ts
export const createOrder = mutation({
  args: {
    clerkId: v.string(),
    styleId: v.optional(v.id("styles")),
    customStyleImages: v.optional(v.array(v.string())),
    fabricSource: v.union(v.literal("inventory"), v.literal("customer_provided")),
    fabricInventoryId: v.optional(v.id("fabricInventory")),
    fabricImages: v.optional(v.array(v.string())),
    measurementProfileId: v.id("measurementProfiles"),
    urgency: v.union(v.literal("standard"), v.literal("rush"), v.literal("express")),
    customerNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.clerkId);
    requirePermission(user.role, "CREATE_ORDER");
    
    // Calculate pricing
    let basePrice = 0;
    let fabricCost = 0;
    
    if (args.styleId) {
      const style = await ctx.db.get(args.styleId);
      if (style) {
        basePrice = style.basePrice;
        
        // Increment order count
        await ctx.db.patch(args.styleId, {
          orders: style.orders + 1,
        });
      }
    } else if (args.customStyleImages) {
      basePrice = 5000; // Default custom price
    }
    
    if (args.fabricInventoryId) {
      const fabric = await ctx.db.get(args.fabricInventoryId);
      if (fabric) {
        fabricCost = fabric.pricePerMeter * 2.5; // Assume 2.5m avg
      }
    }
    
    // Urgency multiplier
    const urgencyMultiplier = {
      standard: 1,
      rush: 1.5,
      express: 2,
    };
    
    const totalAmount = (basePrice + fabricCost) * urgencyMultiplier[args.urgency];
    
    // Generate order number
    const orderCount = await ctx.db.query("orders").collect();
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(orderCount.length + 1).padStart(6, "0")}`;
    
    // Calculate estimated completion
    const daysToComplete = {
      standard: 14,
      rush: 7,
      express: 3,
    };
    
    const estimatedCompletionDate = Date.now() + daysToComplete[args.urgency] * 24 * 60 * 60 * 1000;
    
    const { clerkId, ...orderData } = args;
    
    const orderId = await ctx.db.insert("orders", {
      ...orderData,
      orderNumber,
      customerId: user._id,
      basePrice,
      fabricCost,
      additionalCharges: 0,
      discount: 0,
      totalAmount,
      amountPaid: 0,
      balance: totalAmount,
      estimatedCompletionDate,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    // Create initial progress entry
    await ctx.db.insert("orderProgress", {
      orderId,
      stage: "confirmed",
      timestamp: Date.now(),
    });
    
    // Create notification for customer
    await ctx.db.insert("notifications", {
      userId: user._id,
      title: "Order Created",
      message: `Your order ${orderNumber} has been created successfully`,
      type: "order_update",
      relatedId: orderId,
      isRead: false,
      sentVia: ["app"],
      createdAt: Date.now(),
    });
    
    // Audit log
    await ctx.db.insert("auditLogs", {
      userId: user._id,
      action: "ORDER_CREATED",
      resource: "orders",
      resourceId: orderId,
      timestamp: Date.now(),
    });
    
    return { orderId, orderNumber };
  },
});

export const getCustomerOrders = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.clerkId);
    
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_customer", (q) => q.eq("customerId", user._id))
      .collect();
    
    return orders.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getOrderById = query({
  args: {
    clerkId: v.string(),
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.clerkId);
    const order = await ctx.db.get(args.orderId);
    
    if (!order) {
      throw new Error("Order not found");
    }
    
    // Authorization check
    const canView =
      user.role === "admin" ||
      user.role === "manager" ||
      (user.role === "customer" && order.customerId === user._id) ||
      (user.role === "worker" && order.assignedWorkerId === user._id);
    
    if (!canView) {
      throw new Error("Access denied");
    }
    
    // Get progress history
    const progress = await ctx.db
      .query("orderProgress")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .collect();
    
    return {
      ...order,
      progress: progress.sort((a, b) => a.timestamp - b.timestamp),
    };
  },
});

export const updateOrderProgress = mutation({
  args: {
    clerkId: v.string(),
    orderId: v.id("orders"),
    stage: v.union(
      v.literal("confirmed"),
      v.literal("fabric_received"),
      v.literal("cutting"),
      v.literal("sewing"),
      v.literal("fitting"),
      v.literal("finishing"),
      v.literal("ready"),
      v.literal("delivered")
    ),
    notes: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.clerkId);
    const order = await ctx.db.get(args.orderId);
    
    if (!order) {
      throw new Error("Order not found");
    }
    
    // Authorization check
    const canUpdate =
      user.role === "admin" ||
      user.role === "manager" ||
      (user.role === "worker" && order.assignedWorkerId === user._id);
    
    if (!canUpdate) {
      throw new Error("Access denied");
    }
    
    // Create progress entry
    await ctx.db.insert("orderProgress", {
      orderId: args.orderId,
      stage: args.stage,
      completedByUserId: user._id,
      notes: args.notes,
      images: args.images,
      timestamp: Date.now(),
    });
    
    // Update order status
    await ctx.db.patch(args.orderId, {
      status: args.stage,
      updatedAt: Date.now(),
    });
    
    // Notify customer
    await ctx.db.insert("notifications", {
      userId: order.customerId,
      title: "Order Update",
      message: `Your order has been updated to: ${args.stage}`,
      type: "order_update",
      relatedId: args.orderId,
      isRead: false,
      sentVia: ["app", "sms"],
      createdAt: Date.now(),
    });
    
    return { success: true };
  },
});