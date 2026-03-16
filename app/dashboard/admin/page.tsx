"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Users, Shield, UserCog, Mail, ShieldAlert, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function AdminPage() {
    const users = useQuery(api.users.list);
    const currentUser = useQuery(api.users.current);
    const updateRole = useMutation(api.users.updateRole);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const handleRoleChange = async (userId: any, newRole: string) => {
        setUpdatingId(userId);
        try {
            await updateRole({ userId, role: newRole });
            toast.success(`Access level updated to ${newRole}`);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setUpdatingId(null);
        }
    };

    if (!users || !currentUser) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
            </div>
        );
    }

    if (currentUser.role !== "admin") {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
                <div className="h-20 w-20 rounded-[2rem] bg-destructive/10 flex items-center justify-center text-destructive border border-destructive/20 shadow-2xl shadow-destructive/20">
                    <ShieldAlert className="h-10 w-10" />
                </div>
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">Access Denied</h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Security Clearance Level 1 Required</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 relative px-4">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Header - Compact */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-foreground">User Management</h1>
                    <p className="text-muted-foreground text-sm font-medium">
                        Manage capabilities and permissions for <span className="text-foreground font-bold">{users.length}</span> active accounts.
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-wide">
                    <Shield className="h-3 w-3" />
                    Admin Console
                </div>
            </div>

            {/* Users List - Sleek Table Design */}
            <div className="rounded-xl border border-border/40 bg-card/60 backdrop-blur-md overflow-hidden shadow-sm">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 border-b border-border/40 bg-muted/30 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                    <div className="col-span-4 md:col-span-5">Identity</div>
                    <div className="col-span-3 md:col-span-2 text-center">Status</div>
                    <div className="col-span-5 md:col-span-5 text-right">Access Level</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-border/40">
                    {users.map((user) => (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            key={user._id}
                            className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-muted/30 transition-colors group"
                        >
                            {/* Identity Column */}
                            <div className="col-span-4 md:col-span-5 flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold truncate leading-none mb-1">{user.name}</p>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate font-medium">
                                        <Mail className="h-3 w-3" />
                                        {user.email}
                                    </div>
                                </div>
                            </div>

                            {/* Status Column */}
                            <div className="col-span-3 md:col-span-2 flex justify-center">
                                <div className={cn(
                                    "inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border",
                                    user.role === 'admin' ? "bg-primary/10 text-primary border-primary/20" :
                                        user.role === 'faculty' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                            "bg-muted text-muted-foreground border-border"
                                )}>
                                    {user.role}
                                </div>
                            </div>

                            {/* Access Level Controls */}
                            <div className="col-span-5 md:col-span-5 flex justify-end gap-1">
                                {user._id === currentUser._id ? (
                                    <div className="px-4 py-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest italic border border-dashed border-border rounded-lg">
                                        Locked
                                    </div>
                                ) : (
                                    <div className="flex bg-muted/30 rounded-lg p-1 border border-border/40">
                                        {["student", "faculty", "admin"].map((role) => (
                                            <button
                                                key={role}
                                                disabled={updatingId === user._id}
                                                onClick={() => handleRoleChange(user._id, role)}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                                                    user.role === role
                                                        ? "bg-background shadow-sm text-foreground ring-1 ring-border"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                                )}
                                            >
                                                {role.slice(0, 3)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
