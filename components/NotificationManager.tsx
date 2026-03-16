"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { urlBase64ToUint8Array } from "@/lib/utils";

// This is a placeholder for VAPID key. In production, use process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BMj...";

export default function NotificationManager() {
    const saveSubscription = useMutation(api.subscriptions.saveSubscription);
    const user = useQuery(api.users.current);

    const subscribeToPush = async () => {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
            toast.error("Push notifications are not supported directly in this browser.");
            return;
        }

        try {
            const registration = await navigator.serviceWorker.ready;

            // Check if already subscribed
            let subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
                if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
                    toast.error("VAPID Public Key not configured.");
                    return;
                }

                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
                });
            }

            await saveSubscription({ subscription: subscription.toJSON() });
            toast.success("Notifications enabled!");
        } catch (error: any) {
            console.error("Failed to subscribe to push", error);
            toast.error("Failed to enable notifications: " + error.message);
        }
    };

    if (!user) return null;

    return (
        <Button variant="outline" size="sm" onClick={subscribeToPush} className="gap-2">
            <Bell className="h-4 w-4" />
            Enable Notifications
        </Button>
    );
}


