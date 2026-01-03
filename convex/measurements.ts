// convex/measurements.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./auth";

export const getMeasurementProfiles = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.clerkId);

    const profiles = await ctx.db
      .query("measurementProfiles")
      .withIndex("by_customer", (q) => q.eq("customerId", user._id))
      .collect();

    return profiles.sort((a, b) => {
      if (a.isDefault) return -1;
      if (b.isDefault) return 1;
      return b.createdAt - a.createdAt;
    });
  },
});

export const createMeasurementProfile = mutation({
  args: {
    clerkId: v.string(),
    profileName: v.string(),
    measurements: v.object({
      neck: v.optional(v.number()),
      chest: v.optional(v.number()),
      waist: v.optional(v.number()),
      hips: v.optional(v.number()),
      shoulderWidth: v.optional(v.number()),
      sleeveLength: v.optional(v.number()),
      armhole: v.optional(v.number()),
      inseam: v.optional(v.number()),
      outseam: v.optional(v.number()),
      thigh: v.optional(v.number()),
      knee: v.optional(v.number()),
      ankle: v.optional(v.number()),
      rise: v.optional(v.number()),
      height: v.optional(v.number()),
      weight: v.optional(v.number()),
    }),
    unit: v.union(v.literal("cm"), v.literal("inch")),
    notes: v.optional(v.string()),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.clerkId);

    // If setting as default, unset other defaults
    if (args.isDefault) {
      const existingProfiles = await ctx.db
        .query("measurementProfiles")
        .withIndex("by_customer", (q) => q.eq("customerId", user._id))
        .collect();

      for (const profile of existingProfiles) {
        if (profile.isDefault) {
          await ctx.db.patch(profile._id, { isDefault: false });
        }
      }
    }

    const { clerkId, ...profileData } = args;

    const profileId = await ctx.db.insert("measurementProfiles", {
      ...profileData,
      customerId: user._id,
      isDefault: args.isDefault || false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await ctx.db.insert("auditLogs", {
      userId: user._id,
      action: "MEASUREMENT_PROFILE_CREATED",
      resource: "measurementProfiles",
      resourceId: profileId,
      timestamp: Date.now(),
    });

    return profileId;
  },
});

export const updateMeasurementProfile = mutation({
  args: {
    clerkId: v.string(),
    profileId: v.id("measurementProfiles"),
    profileName: v.optional(v.string()),
    measurements: v.optional(
      v.object({
        neck: v.optional(v.number()),
        chest: v.optional(v.number()),
        waist: v.optional(v.number()),
        hips: v.optional(v.number()),
        shoulderWidth: v.optional(v.number()),
        sleeveLength: v.optional(v.number()),
        armhole: v.optional(v.number()),
        inseam: v.optional(v.number()),
        outseam: v.optional(v.number()),
        thigh: v.optional(v.number()),
        knee: v.optional(v.number()),
        ankle: v.optional(v.number()),
        rise: v.optional(v.number()),
        height: v.optional(v.number()),
        weight: v.optional(v.number()),
      })
    ),
    notes: v.optional(v.string()),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.clerkId);
    const profile = await ctx.db.get(args.profileId);

    if (!profile) {
      throw new Error("Profile not found");
    }

    if (profile.customerId !== user._id) {
      throw new Error("Unauthorized");
    }

    // If setting as default, unset other defaults
    if (args.isDefault) {
      const existingProfiles = await ctx.db
        .query("measurementProfiles")
        .withIndex("by_customer", (q) => q.eq("customerId", user._id))
        .collect();

      for (const p of existingProfiles) {
        if (p.isDefault && p._id !== args.profileId) {
          await ctx.db.patch(p._id, { isDefault: false });
        }
      }
    }

    await ctx.db.patch(args.profileId, {
      ...(args.profileName && { profileName: args.profileName }),
      ...(args.measurements && { measurements: args.measurements }),
      ...(args.notes !== undefined && { notes: args.notes }),
      ...(args.isDefault !== undefined && { isDefault: args.isDefault }),
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

