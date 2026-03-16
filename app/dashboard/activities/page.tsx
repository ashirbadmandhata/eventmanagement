"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Trophy, Clock, CheckCircle2, XCircle, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MyActivitiesPage() {
    const registrations = useQuery(api.registrations.getMyRegistrations);

    if (!registrations) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 rounded-3xl bg-muted animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            <header className="space-y-2">
                <h1 className="text-5xl font-black tracking-tighter">My Activities</h1>
                <p className="text-muted-foreground text-lg font-medium tracking-tight">Track your registrations and performance scores.</p>
            </header>

            {registrations.length === 0 ? (
                <div className="py-20 text-center space-y-6 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10 max-w-2xl mx-auto">
                    <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                        <Activity className="h-10 w-10 text-primary/40" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-2xl font-black tracking-tighter">No Active Pursuits</p>
                        <p className="text-muted-foreground font-medium">You haven't registered for any athletic events yet.</p>
                    </div>
                    <Link href="/dashboard/events">
                        <Button className="rounded-2xl h-12 px-8 font-bold">
                            Explore Events <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {registrations.map((reg: any) => (
                        <Card key={reg._id} className="group relative overflow-hidden rounded-[2rem] border-white/5 bg-card/40 backdrop-blur-xl flex flex-col hover:border-primary/30 transition-all duration-500">
                            <CardHeader className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 rounded-2xl bg-secondary border border-white/5">
                                        <Trophy className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <StatusBadge status={reg.status} />
                                </div>
                                <CardTitle className="text-2xl font-black tracking-tighter mb-1">
                                    {reg.event?.title}
                                </CardTitle>
                                <CardDescription className="text-xs font-black uppercase tracking-[0.2em] text-primary/70">
                                    {reg.event?.category}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-8 pb-8 flex-1">
                                {reg.score ? (
                                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Achievement Score</span>
                                        <span className="text-2xl font-black text-primary">{reg.score}</span>
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                                        <Clock className="h-4 w-4 text-muted-foreground/40" />
                                        <span className="text-sm font-bold text-muted-foreground/60 italic">Score Pending...</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const configs: Record<string, { icon: any, class: string }> = {
        approved: { icon: CheckCircle2, class: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
        registered: { icon: CheckCircle2, class: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
        rejected: { icon: XCircle, class: "bg-red-500/10 text-red-500 border-red-500/20" },
        pending: { icon: Clock, class: "bg-amber-500/10 text-amber-500 border-amber-500/20" }
    };

    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
        <span className={cn(
            "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border flex items-center gap-2",
            config.class
        )}>
            <Icon className="h-3 w-3" />
            {status}
        </span>
    );
}

import { cn } from "@/lib/utils";
