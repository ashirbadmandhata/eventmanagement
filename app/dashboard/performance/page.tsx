"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, Target, Zap, ArrowUp, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { BorderBeam } from "@/components/magicui/border-beam";

export default function PerformancePage() {
    const user = useQuery(api.users.current);

    if (!user) return null;

    const metrics = [
        { label: "Stamina", value: 85, color: "bg-blue-500", icon: Activity },
        { label: "Strength", value: 72, color: "bg-emerald-500", icon: Zap },
        { label: "Agility", value: 94, color: "bg-purple-500", icon: TrendingUp },
        { label: "Focus", value: 88, color: "bg-amber-500", icon: Target },
    ];

    return (
        <div className="space-y-10 pb-10">
            <header className="space-y-2">
                <h1 className="text-4xl font-black tracking-tighter">Performance Analysis</h1>
                <p className="text-muted-foreground text-lg font-medium">Deep dive into your athletic metrics and growth.</p>
            </header>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="relative overflow-hidden group bg-card/50 backdrop-blur-sm border-border/40">
                    <BorderBeam size={200} duration={12} delay={9} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-amber-500" />
                            Current Tier: Elite
                        </CardTitle>
                        <CardDescription>Based on your last 30 days of activity.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="flex items-end justify-between">
                            <div className="text-6xl font-black tracking-tighter">Gold II</div>
                            <div className="flex flex-col items-end text-sm font-bold text-emerald-500">
                                <span className="flex items-center gap-1"><ArrowUp className="h-4 w-4" /> 12%</span>
                                <span className="text-muted-foreground/60 tracking-widest uppercase text-[10px]">vs Last Month</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {metrics.map((m) => (
                                <div key={m.label} className="space-y-1.5">
                                    <div className="flex justify-between text-sm font-bold uppercase tracking-tight">
                                        <span className="flex items-center gap-2">
                                            <m.icon className="h-4 w-4 text-muted-foreground" />
                                            {m.label}
                                        </span>
                                        <span>{m.value}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${m.value}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className={cn("h-full rounded-full transition-all", m.color)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-card/50 backdrop-blur-sm border-border/40">
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Achievements</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { title: "Early Bird", desc: "Completed 5 sessions before 7AM", icon: "🌅" },
                                { title: "Iron Lung", desc: "Ran 10km in under 45 minutes", icon: "🫁" },
                                { title: "Team Player", desc: "Participated in 3 group events", icon: "🤝" },
                            ].map((a, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 group hover:border-primary/50 transition-colors">
                                    <span className="text-2xl">{a.icon}</span>
                                    <div>
                                        <p className="font-bold">{a.title}</p>
                                        <p className="text-sm text-muted-foreground">{a.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-primary/20">
                                    <TrendingUp className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-black text-xl tracking-tight">Path to Platinum</p>
                                    <p className="text-sm text-muted-foreground">Complete 2 more events to rank up!</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

import { cn } from "@/lib/utils";
