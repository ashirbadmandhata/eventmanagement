import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        clerkId: v.string(),
        email: v.string(),
        name: v.string(),
        role: v.string(), // "student", "faculty", "admin"
        subscription: v.optional(v.any()), // Web Push subscription object
    }).index("by_clerk_id", ["clerkId"]),

    events: defineTable({
        title: v.string(),
        description: v.string(),
        date: v.number(), // Start Time
        endTime: v.optional(v.number()),
        location: v.string(),
        category: v.string(),
        capacity: v.number(),
        creatorId: v.id("users"),
        status: v.optional(v.string()), // "upcoming", "completed", "cancelled"
        imageStorageId: v.optional(v.string()),
    }).index("by_date", ["date"]),

    registrations: defineTable({
        eventId: v.id("events"),
        userId: v.id("users"),
        status: v.string(), // "pending", "approved", "rejected"
        attendance: v.optional(v.boolean()),
        score: v.optional(v.number()), // For competitive events
        submissionStorageId: v.optional(v.string()),
        // Registration details
        registrantName: v.optional(v.string()),
        registrationNumber: v.optional(v.string()),
        branch: v.optional(v.string()),
        semester: v.optional(v.string()),
    })
        .index("by_event", ["eventId"])
        .index("by_user", ["userId"])
        .index("by_event_user", ["eventId", "userId"]),

    notifications: defineTable({
        userId: v.id("users"),
        title: v.string(),
        message: v.string(),
        read: v.boolean(),
        timestamp: v.number(),
        link: v.optional(v.string()),
    }).index("by_user", ["userId"]),

    ai_insights: defineTable({
        targetType: v.string(), // "user", "event", "global"
        targetId: v.optional(v.string()), // ID of the target
        insightType: v.string(), // "performance", "recommendation", "trend"
        content: v.string(),
        data: v.any(), // JSON data for charts/graphs
        generatedAt: v.number(),
    }).index("by_type", ["targetType"]),
});
