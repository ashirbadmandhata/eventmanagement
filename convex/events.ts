import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { api } from "./_generated/api";

// Helper to check role
async function checkRole(ctx: QueryCtx | any, roles: string[]) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", identity.subject))
        .unique();
    if (!user || !roles.includes(user.role)) throw new Error("Unauthorized");
    return user;
}

export const list = query({
    args: {},
    handler: async (ctx) => {
        const events = await ctx.db.query("events").order("desc").take(50);
        return await Promise.all(events.map(async (event) => ({
            ...event,
            imageUrl: event.imageStorageId ? await ctx.storage.getUrl(event.imageStorageId) : null,
        })));
    },
});

export const get = query({
    args: { id: v.id("events") },
    handler: async (ctx, args) => {
        const event = await ctx.db.get(args.id);
        if (!event) return null;
        return {
            ...event,
            imageUrl: event.imageStorageId ? await ctx.storage.getUrl(event.imageStorageId) : null,
        };
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        date: v.number(),
        endTime: v.number(),
        category: v.string(),
        location: v.string(),
        capacity: v.number(),
        imageStorageId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await checkRole(ctx, ["faculty", "admin"]);
        const eventId = await ctx.db.insert("events", {
            ...args,
            creatorId: user._id,
            status: "upcoming",
        });

        // 1. Create In-App Notifications for all users (database storage)
        const allUsers = await ctx.db.query("users").collect();
        for (const recipient of allUsers) {
            // We notify everyone including the creator, or exclude creator if preferred
            await ctx.db.insert("notifications", {
                userId: recipient._id,
                title: "New Event: " + args.title,
                message: `A new athletic event "${args.title}" has been scheduled at ${args.location}.`,
                read: false,
                timestamp: Date.now(),
                link: `/dashboard/events`,
            });
        }

        // 2. Schedule Action for Push & Email (Handled in background)
        await ctx.scheduler.runAfter(0, api.notifications.notifyAllUsers, {
            title: "New Event: " + args.title,
            message: `Checkout the new event "${args.title}" happening at ${args.location}. See you there!`,
            url: "/dashboard/events",
        });

        return eventId;
    },
});

export const deleteEvent = mutation({
    args: { id: v.id("events") },
    handler: async (ctx, args) => {
        const user = await checkRole(ctx, ["admin"]);
        await ctx.db.delete(args.id);
    },
});
export const complete = mutation({
    args: { id: v.id("events") },
    handler: async (ctx, args) => {
        const user = await checkRole(ctx, ["faculty", "admin"]);
        const event = await ctx.db.get(args.id);
        if (!event) throw new Error("Event not found");

        if (user.role !== "admin" && event.creatorId !== user._id) {
            throw new Error("Unauthorized");
        }

        await ctx.db.patch(args.id, { status: "completed" });
    },
});
