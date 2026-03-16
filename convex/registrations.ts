import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const register = mutation({
    args: {
        eventId: v.id("events"),
        registrantName: v.optional(v.string()),
        registrationNumber: v.optional(v.string()),
        branch: v.optional(v.string()),
        semester: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        // Check if already registered
        const existing = await ctx.db
            .query("registrations")
            .withIndex("by_event_user", (q) => q.eq("eventId", args.eventId).eq("userId", user._id))
            .unique();

        if (existing) throw new Error("Already registered");

        // Check capacity
        const event = await ctx.db.get(args.eventId);
        if (!event) throw new Error("Event not found");

        // Count current registrations
        const registrationCount = await ctx.db
            .query("registrations")
            .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
            .collect();

        if (registrationCount.length >= event.capacity) {
            throw new Error("Event full");
        }

        if (event.status === "completed" || event.status === "cancelled") {
            throw new Error("Event registration is closed");
        }

        return await ctx.db.insert("registrations", {
            eventId: args.eventId,
            userId: user._id,
            status: "registered", // Auto-approved
            registrantName: args.registrantName ?? user.name,
            registrationNumber: args.registrationNumber,
            branch: args.branch,
            semester: args.semester,
        });
    },
});

export const cancelRegistration = mutation({
    args: { registrationId: v.id("registrations") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        const registration = await ctx.db.get(args.registrationId);
        if (!registration) throw new Error("Registration not found");

        if (registration.userId !== user._id) throw new Error("Unauthorized");

        await ctx.db.delete(args.registrationId);
    },
});

export const getMyRegistrations = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) return [];

        const registrations = await ctx.db
            .query("registrations")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();

        // Fetch event details and submission URLs
        const events = await Promise.all(registrations.map(async (reg) => {
            const event = await ctx.db.get(reg.eventId);
            const submissionUrl = reg.submissionStorageId ? await ctx.storage.getUrl(reg.submissionStorageId) : null;
            return {
                ...reg,
                event: event ? {
                    ...event,
                    imageUrl: event.imageStorageId ? await ctx.storage.getUrl(event.imageStorageId) : null,
                } : null,
                submissionUrl
            };
        }));

        return events;
    }
});

// For Faculty/Admin: Get pending registrations for events created by them or all events if admin
export const getPendingRegistrations = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user || user.role === "student") throw new Error("Unauthorized");

        // Fetch all registrations
        // Optimized: In a real app, strict filtering by created events.
        // Here, fetching all pending for simplicity, can filter in memory or add index.
        const registrations = await ctx.db.query("registrations").collect();

        // Enrich with user and event details
        const enriched = await Promise.all(registrations.map(async (reg) => {
            if (reg.status === "rejected") return null;

            const event = await ctx.db.get(reg.eventId);
            if (!event) return null;

            // Filter: only show if user is admin OR creator of event
            if (user.role !== "admin" && event.creatorId !== user._id) return null;

            const registrant = await ctx.db.get(reg.userId);
            return { ...reg, event, user: registrant };
        }));

        return enriched.filter((r) => r !== null);
    },
});

export const updateStatus = mutation({
    args: { id: v.id("registrations"), status: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user || user.role === "student") throw new Error("Unauthorized");

        await ctx.db.patch(args.id, { status: args.status });
    },
});
export const getParticipants = query({
    args: { eventId: v.id("events") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user || user.role === "student") throw new Error("Unauthorized");

        const registrations = await ctx.db
            .query("registrations")
            .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
            .collect();

        const participants = await Promise.all(registrations.map(async (reg) => {
            const registrant = await ctx.db.get(reg.userId);
            const submissionUrl = reg.submissionStorageId ? await ctx.storage.getUrl(reg.submissionStorageId) : null;
            return { ...reg, user: registrant, submissionUrl };
        }));

        return participants;
    },
});

export const submitWork = mutation({
    args: { registrationId: v.id("registrations"), submissionStorageId: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        const registration = await ctx.db.get(args.registrationId);
        if (!registration || registration.userId !== user._id) {
            throw new Error("Unauthorized");
        }

        await ctx.db.patch(args.registrationId, { submissionStorageId: args.submissionStorageId });
    },
});
export const recordScore = mutation({
    args: { id: v.id("registrations"), score: v.number() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user || (user.role !== "admin" && user.role !== "faculty")) throw new Error("Unauthorized");

        await ctx.db.patch(args.id, { score: args.score });
    },
});
export const getWinners = query({
    args: { eventId: v.id("events") },
    handler: async (ctx, args) => {
        const registrations = await ctx.db
            .query("registrations")
            .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
            .collect();

        const participantsWithScores = await Promise.all(registrations.map(async (reg) => {
            const user = await ctx.db.get(reg.userId);
            return { 
                name: user?.name, 
                score: reg.score || 0,
                registrationTime: reg._creationTime
            };
        }));

        return participantsWithScores
            .filter(p => p.score > 0)
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return a.registrationTime - b.registrationTime; // Tiebreaker: earlier registration
            })
            .slice(0, 3);
    },
});
