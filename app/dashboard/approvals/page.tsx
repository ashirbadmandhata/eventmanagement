"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Check, X, User, Calendar, ShieldCheck, Mail, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ApprovalsPage() {
    const requests = useQuery(api.registrations.getPendingRegistrations);
    const updateStatus = useMutation(api.registrations.updateStatus);

    const handleStatus = async (id: any, status: string) => {
        try {
            await updateStatus({ id, status });
            toast.success(`Request ${status}`);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    if (!requests) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            <header className="space-y-2">
                <h1 className="text-5xl font-black tracking-tighter">Registration Queue</h1>
                <p className="text-muted-foreground text-lg font-medium tracking-tight">Review and process student registration requests.</p>
            </header>

            {requests.length === 0 ? (
                <div className="py-20 text-center space-y-4 bg-emerald-500/5 rounded-[2.5rem] border border-dashed border-emerald-500/20 max-w-2xl mx-auto">
                    <ShieldCheck className="h-12 w-12 mx-auto text-emerald-500/30" />
                    <p className="text-xl font-bold text-muted-foreground">Queue Clear</p>
                    <p className="text-sm text-muted-foreground/60">No pending registrations to review.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {requests.map((req: any) => (
                        <Card key={req._id} className="overflow-hidden rounded-3xl border-white/5 bg-card/40 backdrop-blur-xl group hover:border-primary/20 transition-all">
                            <CardContent className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-secondary to-background border border-white/5 flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <User className="h-8 w-8 text-muted-foreground/50" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-xl font-black tracking-tighter">{req.user?.name}</p>
                                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Student</span>
                                        </div>
                                        <p className="text-sm font-bold text-primary flex items-center gap-2">
                                            <Activity className="h-3.5 w-3.5" />
                                            {req.event?.title}
                                        </p>
                                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                            <Mail className="h-3 w-3" />
                                            {req.user?.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 w-full md:w-auto items-center">
                                    <div className={cn(
                                        "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border",
                                        req.status === 'registered' || req.status === 'approved'
                                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                    )}>
                                        {req.status}
                                    </div>

                                    {(req.status === 'pending') && (
                                        <Button
                                            variant="outline"
                                            className="flex-1 md:flex-none h-12 px-6 rounded-2xl border-emerald-500/20 bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all font-bold gap-2"
                                            onClick={() => handleStatus(req._id, "approved")}
                                        >
                                            <Check className="h-5 w-5" /> Approve
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        className="flex-1 md:flex-none h-12 px-6 rounded-2xl border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold gap-2"
                                        onClick={() => handleStatus(req._id, "rejected")}
                                    >
                                        <X className="h-5 w-5" /> {req.status === 'registered' ? 'Unregister' : 'Decline'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
