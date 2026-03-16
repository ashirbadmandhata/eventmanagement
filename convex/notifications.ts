"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import webpush from "web-push";
import { api, internal } from "./_generated/api";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const sendPush = action({
    args: {
        userId: v.id("users"),
        title: v.string(),
        body: v.string(),
        url: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const subscription = await ctx.runQuery(api.subscriptions.getSubscription, { userId: args.userId });

        if (!subscription) return;

        if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
            console.error("VAPID keys not set");
            return;
        }

        webpush.setVapidDetails(
            "mailto:admin@activeiq.com",
            process.env.VAPID_PUBLIC_KEY,
            process.env.VAPID_PRIVATE_KEY
        );

        try {
            await webpush.sendNotification(
                subscription,
                JSON.stringify({
                    title: args.title,
                    body: args.body,
                    url: args.url,
                })
            );
        } catch (error) {
            console.error("Error sending push notification:", error);
        }
    },
});

export const notifyAllUsers = action({
    args: {
        title: v.string(),
        message: v.string(),
        url: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const users = await ctx.runQuery(api.users.list);
        if (!users) return;

        for (const user of users) {
            // 1. Send Push Notification
            const subscription = await ctx.runQuery(api.subscriptions.getSubscription, { userId: user._id });
            if (subscription && process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
                webpush.setVapidDetails(
                    "mailto:admin@activeiq.com",
                    process.env.VAPID_PUBLIC_KEY,
                    process.env.VAPID_PRIVATE_KEY
                );
                try {
                    await webpush.sendNotification(
                        subscription,
                        JSON.stringify({
                            title: args.title,
                            body: args.message,
                            url: args.url,
                        })
                    );
                } catch (e) {
                    console.error(`Failed to send push to ${user.name}`);
                }
            }

            // 2. Send Email
            if (resend && user.email) {
                try {
                    await resend.emails.send({
                        from: "ActiveIQ <notifications@activeiq.com>",
                        to: [user.email],
                        subject: args.title,
                        html: `
                            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                                <h1 style="color: #007bff;">${args.title}</h1>
                                <p style="font-size: 16px; line-height: 1.5;">${args.message}</p>
                                ${args.url ? `<a href="${process.env.NEXT_PUBLIC_APP_URL}${args.url}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px;">View Event Details</a>` : ""}
                                <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;" />
                                <p style="font-size: 12px; color: #777;">You are receiving this because you are a member of ActiveIQ.</p>
                            </div>
                        `,
                    });
                } catch (e) {
                    console.error(`Failed to send email to ${user.email}`);
                }
            }
        }
    },
});
