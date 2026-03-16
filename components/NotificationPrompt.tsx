"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { urlBase64ToUint8Array } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is used for toast notifications, or standard window.alert/console for now if not set up

export default function NotificationPrompt() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission>("default");
    const saveSubscription = useMutation(api.subscriptions.saveSubscription);

    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window) {
            // Register service worker
            navigator.serviceWorker.register("/sw.js")
                .then(registration => {
                    console.log("Service Worker registered with scope:", registration.scope);
                    return registration.pushManager.getSubscription();
                })
                .then(subscription => {
                    setIsSubscribed(!!subscription);
                    setPermission(Notification.permission);
                })
                .catch(error => {
                    console.error("Service Worker registration failed:", error);
                });
        }
    }, []);

    const subscribeToNotifications = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
            });

            // Save subscription to backend
            await saveSubscription({ subscription: sub.toJSON() });

            setIsSubscribed(true);
            setPermission("granted");
            toast.success("Notifications enabled!");
        } catch (error) {
            console.error("Failed to subscribe:", error);
            toast.error("Failed to enable notifications.");
        }
    };

    if (permission === "granted" || isSubscribed) {
        return null; // Don't show anything if already subscribed
    }

    if (permission === "denied") {
        return null; // Don't annoy user if they explicitly blocked
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-700">
            <div className="bg-background/40 backdrop-blur-2xl border border-white/5 p-6 rounded-[2rem] shadow-2xl flex items-center gap-6 max-w-sm ring-1 ring-white/10 group">
                <div className="bg-primary/20 p-3 rounded-2xl border border-primary/20 group-hover:scale-110 transition-transform shadow-lg shadow-primary/10">
                    <Bell className="h-6 w-6 text-primary animate-ring" />
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-black tracking-tight text-foreground">Stay Informed</h4>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Never miss an arena alert.</p>
                </div>
                <Button
                    size="sm"
                    onClick={subscribeToNotifications}
                    className="rounded-xl h-10 px-6 font-black bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                    Enable
                </Button>
            </div>
        </div>
    );
}

// Add CSS for animate-ring if possible or just use pulse. I'll use simple styles.
