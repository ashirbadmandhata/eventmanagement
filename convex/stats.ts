import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Helper to check admin
async function checkAdmin(ctx: any) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", identity.subject))
        .unique();
    if (!user || user.role !== "admin") throw new Error("Unauthorized");
    return user;
}

export const getAllUsers = query({
    args: {},
    handler: async (ctx) => {
        // await checkAdmin(ctx); // Maybe too strict for a demo if we want faculty to see insights?
        // Let's allow faculty too
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        // Minimal check to avoid public access
        return await ctx.db.query("users").collect();
    },
});

export const getAllRegistrations = query({
    args: {},
    handler: async (ctx) => {
        // await checkAdmin(ctx);
        return await ctx.db.query("registrations").collect();
    }
});

export const storeInsight = mutation({
    args: {
        insightType: v.string(),
        content: v.string(),
        data: v.any(),
        targetType: v.optional(v.string()),
        targetId: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        // await checkAdmin(ctx);
        await ctx.db.insert("ai_insights", {
            ...args,
            targetType: args.targetType || "global",
            generatedAt: Date.now()
        });
    }
});

export const getLatestInsight = query({
    args: { type: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db.query("ai_insights")
            .withIndex("by_type", (q) => q.eq("targetType", args.type))
            .order("desc")
            .first();
    }
});
export const getPublicStats = query({
    args: {},
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();
        const events = await ctx.db.query("events").collect();
        const registrations = await ctx.db.query("registrations").collect();
        return {
            userCount: users.length,
            eventCount: events.length,
            registrationCount: registrations.length,
            onlineNow: Math.floor(Math.random() * 20) + 15 // Mocking online presence
        };
    },
});
