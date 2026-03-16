import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const store = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called storeUser without authentication present");
        }

        // Check if we've already stored this identity before.
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (user !== null) {
            // If we've seen this identity before but the name or email has changed, patch the value.
            const updates: any = {};
            if (user.name !== identity.name) updates.name = identity.name;
            if (user.email !== identity.email) updates.email = identity.email;

            // Enforce admin role for specific user if lost or not set correctly
            if (identity.email === "ajedutalk@gmail.com" && user.role !== "admin") {
                updates.role = "admin";
            }

            if (Object.keys(updates).length > 0) {
                await ctx.db.patch(user._id, updates);
            }
            return user._id;
        }

        // If it's a new identity, create a new `User`.
        const existingUsers = await ctx.db.query("users").first();
        let role = existingUsers === null ? "admin" : "student";

        if (identity.email === "ajedutalk@gmail.com") {
            role = "admin";
        }

        return await ctx.db.insert("users", {
            name: identity.name!,
            email: identity.email!,
            clerkId: identity.subject,
            role: role,
        });
    },
});

export const list = query({
    args: {},
    handler: async (ctx) => {
        // In a real app, this should be restricted to admins
        return await ctx.db.query("users").collect();
    },
});

export const current = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }
        return await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();
    },
});
export const updateRole = mutation({
    args: { userId: v.id("users"), role: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user || user.role !== "admin") throw new Error("Unauthorized");

        await ctx.db.patch(args.userId, { role: args.role });
    },
});
