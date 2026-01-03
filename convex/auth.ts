// convex/auth.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { UserRole } from "./schema";

// ============ PERMISSION DEFINITIONS ============
export const PERMISSIONS = {
  // Style permissions
  VIEW_STYLES: ["customer", "worker", "manager", "admin"],
  CREATE_STYLE: ["admin"],
  EDIT_STYLE: ["admin"],
  DELETE_STYLE: ["admin"],
  LIKE_STYLE: ["customer", "worker", "manager", "admin"],
  
  // Order permissions
  CREATE_ORDER: ["customer"],
  VIEW_OWN_ORDERS: ["customer"],
  VIEW_ALL_ORDERS: ["manager", "admin"],
  VIEW_ASSIGNED_ORDERS: ["worker"],
  EDIT_ORDER: ["admin"],
  CANCEL_ORDER: ["customer", "admin"],
  ASSIGN_WORKER: ["manager", "admin"],
  UPDATE_ORDER_PROGRESS: ["worker", "manager", "admin"],
  
  // Payment permissions
  MAKE_PAYMENT: ["customer"],
  VIEW_OWN_PAYMENTS: ["customer"],
  VIEW_PAYMENT_AMOUNTS: ["manager", "admin"],
  VIEW_FULL_FINANCIALS: ["admin"],
  MANAGE_PAYMENT_PROVIDERS: ["admin"],
  
  // Chat permissions
  CHAT_WITH_ADMIN: ["customer", "manager"],
  CHAT_WITH_MANAGER: ["worker"],
  CHAT_WITH_WORKER: ["manager"],
  CHAT_WITH_ANYONE: ["admin"],
  
  // User management
  MANAGE_USERS: ["admin"],
  ASSIGN_MANAGER: ["admin"],
  VIEW_WORKER_PROFILES: ["manager", "admin"],
  RATE_WORKER: ["customer"],
  
  // Workshop permissions
  VIEW_HUDDLES: ["worker", "manager", "admin"],
  CREATE_HUDDLE: ["manager", "admin"],
  
  // Analytics
  VIEW_ANALYTICS: ["admin"],
  VIEW_WORKLOAD: ["manager", "admin"],
};

// ============ ROLE CHECKER ============
export function hasPermission(userRole: UserRole, permission: keyof typeof PERMISSIONS): boolean {
  return PERMISSIONS[permission].includes(userRole);
}

export function requirePermission(userRole: UserRole | undefined, permission: keyof typeof PERMISSIONS) {
  if (!userRole) {
    throw new Error("Authentication required");
  }
  
  if (!hasPermission(userRole, permission)) {
    throw new Error(`Insufficient permissions. Required: ${permission}`);
  }
}

// ============ AUTH QUERIES ============
export const getCurrentUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    
    return user;
  },
});

export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// ============ USER MUTATIONS ============
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    fullName: v.string(),
    phone: v.optional(v.string()),
    role: v.union(
      v.literal("customer"),
      v.literal("worker"),
      v.literal("manager"),
      v.literal("admin")
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    
    if (existing) {
      throw new Error("User already exists");
    }
    
    const userId = await ctx.db.insert("users", {
      ...args,
      status: "active",
      preferences: {
        theme: "light",
        language: "en",
        notifications: {
          email: true,
          sms: true,
          whatsapp: true,
        },
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    // Create worker profile if role is worker
    if (args.role === "worker") {
      await ctx.db.insert("workerProfiles", {
        userId,
        specializations: [],
        experienceYears: 0,
        rating: 0,
        totalCompletedOrders: 0,
        badges: [],
        isAvailable: true,
        currentWorkload: 0,
        maxWorkload: 5,
      });
    }
    
    // Audit log
    await ctx.db.insert("auditLogs", {
      userId,
      action: "USER_CREATED",
      resource: "users",
      resourceId: userId,
      timestamp: Date.now(),
    });
    
    return userId;
  },
});

export const updateUserRole = mutation({
  args: {
    currentUserClerkId: v.string(),
    targetUserId: v.id("users"),
    newRole: v.union(
      v.literal("customer"),
      v.literal("worker"),
      v.literal("manager"),
      v.literal("admin")
    ),
  },
  handler: async (ctx, args) => {
    // Get current user
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.currentUserClerkId))
      .first();
    
    if (!currentUser) {
      throw new Error("User not found");
    }
    
    // Only admins can change roles
    requirePermission(currentUser.role, "MANAGE_USERS");
    
    const targetUser = await ctx.db.get(args.targetUserId);
    if (!targetUser) {
      throw new Error("Target user not found");
    }
    
    const oldRole = targetUser.role;
    
    await ctx.db.patch(args.targetUserId, {
      role: args.newRole,
      updatedAt: Date.now(),
    });
    
    // Create worker profile if changing to worker
    if (args.newRole === "worker" && oldRole !== "worker") {
      await ctx.db.insert("workerProfiles", {
        userId: args.targetUserId,
        specializations: [],
        experienceYears: 0,
        rating: 0,
        totalCompletedOrders: 0,
        badges: [],
        isAvailable: true,
        currentWorkload: 0,
        maxWorkload: 5,
      });
    }
    
    // Audit log
    await ctx.db.insert("auditLogs", {
      userId: currentUser._id,
      action: "USER_ROLE_CHANGED",
      resource: "users",
      resourceId: args.targetUserId,
      changes: { oldRole, newRole: args.newRole },
      timestamp: Date.now(),
    });
    
    return { success: true };
  },
});

export const updateUserPreferences = mutation({
  args: {
    clerkId: v.string(),
    preferences: v.object({
      theme: v.optional(v.union(v.literal("light"), v.literal("dark"))),
      language: v.optional(v.string()),
      notifications: v.optional(v.object({
        email: v.boolean(),
        sms: v.boolean(),
        whatsapp: v.boolean(),
      })),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    
    if (!user) {
      throw new Error("User not found");
    }
    
    await ctx.db.patch(user._id, {
      preferences: {
        ...user.preferences,
        ...args.preferences,
        notifications: {
          ...user.preferences.notifications,
          ...(args.preferences.notifications || {}),
        },
      },
      updatedAt: Date.now(),
    });
    
    return { success: true };
  },
});

// ============ AUTHORIZATION HELPERS ============
export async function getUserRole(ctx: any, clerkId: string): Promise<UserRole | undefined> {
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", clerkId))
    .first();
  
  return user?.role;
}

export async function requireAuth(ctx: any, clerkId: string) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", clerkId))
    .first();
  
  if (!user) {
    throw new Error("Authentication required");
  }
  
  if (user.status !== "active") {
    throw new Error("Account is not active");
  }
  
  return user;
}

export async function requireRole(
  ctx: any,
  clerkId: string,
  allowedRoles: UserRole[]
) {
  const user = await requireAuth(ctx, clerkId);
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Access denied. Required roles: ${allowedRoles.join(", ")}`);
  }
  
  return user;
}

// ============ CHAT AUTHORIZATION ============
export function canChat(userRole: UserRole, targetUserRole: UserRole): boolean {
  // Admin can chat with anyone
  if (userRole === "admin") return true;
  
  // Customer can only chat with admin
  if (userRole === "customer" && targetUserRole === "admin") return true;
  
  // Worker can only chat with manager
  if (userRole === "worker" && targetUserRole === "manager") return true;
  
  // Manager can chat with workers and admin
  if (userRole === "manager" && (targetUserRole === "worker" || targetUserRole === "admin")) {
    return true;
  }
  
  return false;
}

// ============ ORDER AUTHORIZATION ============
export async function canViewOrder(ctx: any, user: any, orderId: string) {
  const order = await ctx.db.get(orderId);
  if (!order) return false;
  
  // Admin and managers can view all orders
  if (user.role === "admin" || user.role === "manager") return true;
  
  // Customers can view their own orders
  if (user.role === "customer" && order.customerId === user._id) return true;
  
  // Workers can view assigned orders
  if (user.role === "worker" && order.assignedWorkerId === user._id) return true;
  
  return false;
}

export async function canEditOrder(ctx: any, user: any, orderId: string) {
  const order = await ctx.db.get(orderId);
  if (!order) return false;
  
  // Only admin can edit orders
  return user.role === "admin";
}

export async function canUpdateOrderProgress(ctx: any, user: any, orderId: string) {
  const order = await ctx.db.get(orderId);
  if (!order) return false;
  
  // Admin can always update
  if (user.role === "admin") return true;
  
  // Manager can update any order
  if (user.role === "manager") return true;
  
  // Worker can only update assigned orders
  if (user.role === "worker" && order.assignedWorkerId === user._id) return true;
  
  return false;
}

// ============ PAYMENT AUTHORIZATION ============
export function canViewFullFinancials(userRole: UserRole): boolean {
  return userRole === "admin";
}

export function canViewPaymentAmounts(userRole: UserRole): boolean {
  return userRole === "manager" || userRole === "admin";
}

// ============ MIDDLEWARE HELPER ============
export function createAuthorizedMutation<Args, Output>(
  allowedRoles: UserRole[],
  handler: (ctx: any, args: Args & { clerkId: string }, user: any) => Promise<Output>
) {
  return mutation({
    args: {
      clerkId: v.string(),
      // Additional args will be merged
    } as any,
    handler: async (ctx, args: any) => {
      const user = await requireRole(ctx, args.clerkId, allowedRoles);
      return handler(ctx, args, user);
    },
  });
}