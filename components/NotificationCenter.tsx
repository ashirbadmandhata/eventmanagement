"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Bell, BellDot, Check, CheckCheck, Clock, Trash2, X, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { urlBase64ToUint8Array } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export default function NotificationCenter() {
    const userNotifications = useQuery(api.notifications_db.getMyNotifications);
    const markAsRead = useMutation(api.notifications_db.markAsRead);
    const markAllAsRead = useMutation(api.notifications_db.markAllAsRead);
    const saveSubscription = useMutation(api.subscriptions.saveSubscription);
    const user = useQuery(api.users.current);

    const [open, setOpen] = useState(false);

    const unreadCount = userNotifications?.filter(n => !n.read).length || 0;

    const subscribeToPush = async () => {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
            toast.error("Push notifications are not supported.");
            return;
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            let subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
                if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
                    toast.error("VAPID Key not set.");
                    return;
                }
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
                });
            }

            await saveSubscription({ subscription: subscription.toJSON() });
            toast.success("Push notifications enabled!");
        } catch (error: any) {
            toast.error("Subscription failed: " + error.message);
        }
    };

    const handleMarkAsRead = async (id: any) => {
        await markAsRead({ id });
    };

    const handleMarkAllRead = async () => {
        await markAllAsRead();
        toast.success("All notifications marked as read");
    };

    if (!user) return null;

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl hover:bg-muted transition-colors">
                    {unreadCount > 0 ? (
                        <>
                            <BellDot className="h-5 w-5 text-primary animate-pulse" />
                            <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-primary rounded-full border-2 border-background" />
                        </>
                    ) : (
                        <Bell className="h-5 w-5 text-muted-foreground" />
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full bg-background border-l border-border">
                <SheetHeader className="p-6 border-b border-border bg-muted/20 shrink-0">
                    <div className="flex items-center justify-between mb-2">
                        <SheetTitle className="text-2xl font-black tracking-tighter">Notifications</SheetTitle>
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleMarkAllRead}
                                className="text-[10px] font-bold uppercase tracking-wider text-primary hover:text-primary/80"
                            >
                                <CheckCheck className="h-3.5 w-3.5 mr-1.5" /> Mark all read
                            </Button>
                        )}
                    </div>
                    <SheetDescription className="font-medium text-muted-foreground italic">
                        Stay updated with the latest campus athletic engagements.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {userNotifications === undefined ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-24 rounded-2xl bg-muted/50 animate-pulse" />
                            ))}
                        </div>
                    ) : userNotifications.length === 0 ? (
                        <div className="py-32 text-center space-y-4 opacity-30">
                            <Bell className="h-12 w-12 mx-auto" />
                            <p className="font-bold text-sm uppercase tracking-widest">No notifications yet</p>
                        </div>
                    ) : (
                        userNotifications.map((notif) => (
                            <div
                                key={notif._id}
                                className={cn(
                                    "p-5 rounded-2xl border transition-all duration-300 relative group",
                                    notif.read ? "bg-card border-border/50 text-muted-foreground" : "bg-primary/5 border-primary/20 text-foreground"
                                )}
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-1">
                                        <p className={cn("font-bold text-sm", !notif.read && "text-primary")}>
                                            {notif.title}
                                        </p>
                                        <p className="text-xs leading-relaxed font-medium">
                                            {notif.message}
                                        </p>
                                        <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground mt-3">
                                            <Clock className="h-3 w-3" />
                                            {formatDistanceToNow(notif.timestamp, { addSuffix: true })}
                                        </div>
                                    </div>

                                    {!notif.read && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleMarkAsRead(notif._id)}
                                            className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10 shrink-0"
                                        >
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 border-t border-border bg-muted/20">
                    <Button
                        onClick={subscribeToPush}
                        className="w-full h-12 rounded-xl bg-background border border-border text-foreground font-bold text-xs hover:bg-muted gap-2 shadow-sm"
                    >
                        <Zap className="h-4 w-4 text-amber-500" />
                        Enable Browser Notifications
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
