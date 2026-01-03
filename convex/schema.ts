// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ============ USER MANAGEMENT ============
  users: defineTable({
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
    status: v.union(v.literal("active"), v.literal("suspended"), v.literal("inactive")),
    avatar: v.optional(v.string()),
    preferences: v.object({
      theme: v.union(v.literal("light"), v.literal("dark")),
      language: v.string(),
      notifications: v.object({
        email: v.boolean(),
        sms: v.boolean(),
        whatsapp: v.boolean(),
      }),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_status", ["status"]),

  // Worker-specific profile
  workerProfiles: defineTable({
    userId: v.id("users"),
    specializations: v.array(v.string()), // ["suits", "dresses", "alterations"]
    experienceYears: v.number(),
    rating: v.number(), // 0-5
    totalCompletedOrders: v.number(),
    averageCompletionTime: v.optional(v.number()), // in hours
    badges: v.array(v.string()), // ["fastest", "most_accurate", "customer_favorite"]
    assignedManagerId: v.optional(v.id("users")),
    isAvailable: v.boolean(),
    currentWorkload: v.number(), // count of active assignments
    maxWorkload: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_manager", ["assignedManagerId"])
    .index("by_availability", ["isAvailable"]),

  // ============ STYLE & INSPIRATION ============
  styles: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(), // "suit", "dress", "shirt", "pants", "traditional"
    tags: v.array(v.string()),
    images: v.array(v.string()), // URLs
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    estimatedHours: v.number(),
    basePrice: v.number(),
    createdByAdminId: v.id("users"),
    attributedWorkerId: v.optional(v.id("users")), // credit tailor for completed work
    likes: v.number(),
    orders: v.number(), // how many times ordered
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_created_by", ["createdByAdminId"])
    .index("by_worker", ["attributedWorkerId"])
    .index("by_active", ["isActive"]),

  styleLikes: defineTable({
    styleId: v.id("styles"),
    userId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_style", ["styleId"])
    .index("by_user", ["userId"])
    .index("by_user_and_style", ["userId", "styleId"]),

  styleSaves: defineTable({
    styleId: v.id("styles"),
    userId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_style", ["styleId"])
    .index("by_user", ["userId"])
    .index("by_user_and_style", ["userId", "styleId"]),

  // ============ MEASUREMENTS ============
  measurementProfiles: defineTable({
    customerId: v.id("users"),
    profileName: v.string(), // "Default", "Formal Events", "Casual"
    measurements: v.object({
      // Upper body
      neck: v.optional(v.number()),
      chest: v.optional(v.number()),
      waist: v.optional(v.number()),
      hips: v.optional(v.number()),
      shoulderWidth: v.optional(v.number()),
      sleeveLength: v.optional(v.number()),
      armhole: v.optional(v.number()),
      
      // Lower body
      inseam: v.optional(v.number()),
      outseam: v.optional(v.number()),
      thigh: v.optional(v.number()),
      knee: v.optional(v.number()),
      ankle: v.optional(v.number()),
      rise: v.optional(v.number()),
      
      // Full body
      height: v.optional(v.number()),
      weight: v.optional(v.number()),
    }),
    unit: v.union(v.literal("cm"), v.literal("inch")),
    notes: v.optional(v.string()),
    isDefault: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_customer", ["customerId"])
    .index("by_customer_default", ["customerId", "isDefault"]),

  // ============ FABRIC MANAGEMENT ============
  fabricInventory: defineTable({
    name: v.string(),
    type: v.string(), // "cotton", "silk", "wool", "polyester", "linen"
    color: v.string(),
    pattern: v.optional(v.string()),
    images: v.array(v.string()),
    quantityInMeters: v.number(),
    pricePerMeter: v.number(),
    supplier: v.optional(v.string()),
    dateAdded: v.number(),
    isAvailable: v.boolean(),
  })
    .index("by_type", ["type"])
    .index("by_availability", ["isAvailable"]),

  // ============ ORDERS ============
  orders: defineTable({
    orderNumber: v.string(), // "ORD-2025-001234"
    customerId: v.id("users"),
    
    // Style selection
    styleId: v.optional(v.id("styles")),
    customStyleImages: v.optional(v.array(v.string())), // if customer uploads custom design
    
    // Fabric
    fabricSource: v.union(v.literal("inventory"), v.literal("customer_provided")),
    fabricInventoryId: v.optional(v.id("fabricInventory")),
    fabricImages: v.optional(v.array(v.string())), // if customer provides
    
    // Measurements
    measurementProfileId: v.id("measurementProfiles"),
    
    // Pricing
    basePrice: v.number(),
    fabricCost: v.number(),
    additionalCharges: v.number(),
    discount: v.number(),
    totalAmount: v.number(),
    amountPaid: v.number(),
    balance: v.number(),
    
    // Timeline
    urgency: v.union(v.literal("standard"), v.literal("rush"), v.literal("express")),
    estimatedCompletionDate: v.number(),
    actualCompletionDate: v.optional(v.number()),
    
    // Status
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("fabric_received"),
      v.literal("cutting"),
      v.literal("sewing"),
      v.literal("fitting"),
      v.literal("finishing"),
      v.literal("ready"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    
    // Assignment
    assignedWorkerId: v.optional(v.id("users")),
    assignedManagerId: v.optional(v.id("users")),
    
    // Additional info
    customerNotes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    
    // Tracking
    createdAt: v.number(),
    updatedAt: v.number(),
    confirmedAt: v.optional(v.number()),
    deliveredAt: v.optional(v.number()),
  })
    .index("by_customer", ["customerId"])
    .index("by_order_number", ["orderNumber"])
    .index("by_worker", ["assignedWorkerId"])
    .index("by_manager", ["assignedManagerId"])
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"]),

  // Order progress tracking
  orderProgress: defineTable({
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
    completedByUserId: v.optional(v.id("users")),
    images: v.optional(v.array(v.string())), // work-in-progress photos
    notes: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_order", ["orderId"])
    .index("by_order_stage", ["orderId", "stage"]),

  // ============ PAYMENTS ============
  payments: defineTable({
    orderId: v.id("orders"),
    customerId: v.id("users"),
    amount: v.number(),
    provider: v.union(v.literal("paystack"), v.literal("flutterwave"), v.literal("stripe")),
    transactionId: v.string(),
    reference: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    paymentType: v.union(v.literal("deposit"), v.literal("balance"), v.literal("full")),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_order", ["orderId"])
    .index("by_customer", ["customerId"])
    .index("by_reference", ["reference"])
    .index("by_status", ["status"]),

  paymentProviders: defineTable({
    provider: v.union(v.literal("paystack"), v.literal("flutterwave"), v.literal("stripe")),
    isEnabled: v.boolean(),
    publicKey: v.string(),
    secretKey: v.string(), // encrypted
    webhookSecret: v.optional(v.string()),
    testMode: v.boolean(),
    updatedByAdminId: v.id("users"),
    updatedAt: v.number(),
  }).index("by_provider", ["provider"]),

  // ============ CHAT SYSTEM ============
  conversations: defineTable({
    participants: v.array(v.id("users")),
    type: v.union(
      v.literal("customer_admin"),
      v.literal("worker_manager"),
      v.literal("manager_admin"),
      v.literal("admin_anyone")
    ),
    lastMessageAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_participants", ["participants"])
    .index("by_last_message", ["lastMessageAt"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
    media: v.optional(v.array(v.string())),
    isRead: v.boolean(),
    timestamp: v.number(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_conversation_timestamp", ["conversationId", "timestamp"]),

  // ============ WORKSHOP HUDDLE ============
  huddles: defineTable({
    title: v.string(),
    content: v.string(),
    type: v.union(
      v.literal("announcement"),
      v.literal("briefing"),
      v.literal("urgent"),
      v.literal("delay_notice")
    ),
    postedByUserId: v.id("users"),
    targetRoles: v.array(v.string()), // ["worker", "manager", "admin"]
    isPinned: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_created", ["createdAt"])
    .index("by_pinned", ["isPinned"]),

  // ============ NOTIFICATIONS ============
  notifications: defineTable({
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
    relatedId: v.optional(v.string()), // orderId, messageId, etc
    isRead: v.boolean(),
    sentVia: v.array(v.string()), // ["app", "email", "sms", "whatsapp"]
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_unread", ["userId", "isRead"])
    .index("by_created", ["createdAt"]),

  // ============ WORKER RATINGS ============
  workerRatings: defineTable({
    orderId: v.id("orders"),
    workerId: v.id("users"),
    customerId: v.id("users"),
    rating: v.number(), // 1-5
    accuracy: v.number(), // 1-5
    timeliness: v.number(), // 1-5
    quality: v.number(), // 1-5
    comment: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_worker", ["workerId"])
    .index("by_order", ["orderId"])
    .index("by_customer", ["customerId"]),

  // ============ DELIVERY TRACKING ============
  deliveries: defineTable({
    orderId: v.id("orders"),
    trackingNumber: v.optional(v.string()),
    provider: v.optional(v.string()), // "DHL", "FedEx", etc
    status: v.union(
      v.literal("pending"),
      v.literal("picked_up"),
      v.literal("in_transit"),
      v.literal("out_for_delivery"),
      v.literal("delivered"),
      v.literal("failed")
    ),
    address: v.string(),
    recipientName: v.string(),
    recipientPhone: v.string(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_order", ["orderId"])
    .index("by_status", ["status"]),

  // ============ AUDIT LOGS ============
  auditLogs: defineTable({
    userId: v.id("users"),
    action: v.string(),
    resource: v.string(),
    resourceId: v.optional(v.string()),
    changes: v.optional(v.any()),
    ipAddress: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_resource", ["resource", "resourceId"]),
});

export type User = {
  _id: string;
  clerkId: string;
  email: string;
  fullName: string;
  phone?: string;
  role: "customer" | "worker" | "manager" | "admin";
  status: "active" | "suspended" | "inactive";
  avatar?: string;
  preferences: {
    theme: "light" | "dark";
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      whatsapp: boolean;
    };
  };
  createdAt: number;
  updatedAt: number;
};

export type OrderStatus = 
  | "pending"
  | "confirmed"
  | "fabric_received"
  | "cutting"
  | "sewing"
  | "fitting"
  | "finishing"
  | "ready"
  | "delivered"
  | "cancelled";

export type UserRole = "customer" | "worker" | "manager" | "admin";