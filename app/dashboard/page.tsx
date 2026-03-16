"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Calendar,
    Users,
    Trophy,
    Activity,
    ArrowUpRight,
    Sparkles,
    RefreshCw,
    TrendingUp,
    Clock,
    MapPin,
    ChevronRight,
    ClipboardList,
    TrendingDown,
    ActivitySquare,
    Zap,
    Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ChatInterface } from "@/components/dashboard/ChatInterface";
import { AIChatEventGenerator } from "../../components/dashboard/AIChatEventGenerator";

export default function DashboardPage() {
    const router = useRouter();
    const user = useQuery(api.users.current);
    const registrations = useQuery(api.registrations.getMyRegistrations);
    const allEvents = useQuery(api.events.list);
    const allRegistrations = useQuery(api.stats.getAllRegistrations);
    const allUsersList = useQuery(api.stats.getAllUsers);
    const latestInsight = useQuery(api.stats.getLatestInsight, { type: "global" });
    const generateInsights = useAction(api.ai.generateInsights);
    const cancelRegistration = useMutation(api.registrations.cancelRegistration);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleRefreshInsights = async () => {
        setIsGenerating(true);
        try {
            await generateInsights();
            toast.success("AI Insights updated");
        } catch (error) {
            console.error(error);
            toast.error("Update failed");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCancel = async (e: any, registrationId: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm("Confirm cancellation? This cannot be undone.")) return;

        try {
            await cancelRegistration({ registrationId });
            toast.success("Activity removed from history");
        } catch (error: any) {
            toast.error("Failed to remove activity");
        }
    };

    if (!user || !registrations || !allEvents || !allRegistrations || !allUsersList) {
        return <DashboardSkeleton />;
    }

    const isAdminType = user.role === 'admin' || user.role === 'faculty';

    // For students, show their registrations. For admins, show ALL upcoming events.
    const upcomingActivities = isAdminType
        ? allEvents
            .filter(event => event.date > Date.now())
            .sort((a, b) => a.date - b.date)
            .slice(0, 4)
            .map(event => ({ _id: event._id, event, status: event.status }))
        : registrations
            .filter(reg => reg.event && reg.event.date > Date.now())
            .sort((a, b) => (a.event?.date || 0) - (b.event?.date || 0))
            .slice(0, 4);

    return (
        <div className="space-y-12 pb-20 relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px]">
                        <Zap className="h-3 w-3" />
                        Event Intelligence Hub
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-foreground leading-none">
                        Welcome, {user.name.split(' ')[0]}
                    </h1>
                    <p className="text-muted-foreground text-lg font-medium max-w-xl leading-tight">
                        Your central command for performance at <span className="text-foreground font-bold">Konark Institute</span>.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {isAdminType && (
                        <Button
                            onClick={handleRefreshInsights}
                            disabled={isGenerating}
                            variant="outline"
                            className="gap-2 rounded-2xl border-primary/20 bg-primary/5 text-primary font-bold h-12 px-6 hover:bg-primary/10 transition-all shadow-sm"
                        >
                            <RefreshCw className={cn("h-4 w-4", isGenerating && "animate-spin")} />
                            {isGenerating ? "Analyzing..." : "Re-Sync AI"}
                        </Button>
                    )}
                    <Link href="/dashboard/events">
                        <Button className="rounded-2xl bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20 h-12 px-8 hover:scale-[1.02] transition-transform">
                            Join Event
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title={isAdminType ? "Campus Events" : "Live Activities"}
                    value={allEvents.filter(e => e.date > Date.now()).length.toString()}
                    icon={<Calendar className="h-5 w-5" />}
                    description={isAdminType ? "Active schedule" : "Available to join"}
                    trend="+12%"
                    color="blue"
                />
                <StatCard
                    title={isAdminType ? "Registrations" : "My Entries"}
                    value={isAdminType ? allRegistrations.length.toString() : registrations.length.toString()}
                    icon={<ClipboardList className="h-5 w-5" />}
                    description={isAdminType ? "KIST Participants" : "Confirmed slots"}
                    trend="+5%"
                    color="emerald"
                />
                <StatCard
                    title={isAdminType ? "Student Reach" : "IQ Score"}
                    value={isAdminType ? allUsersList.length.toString() : (registrations.length > 0 ? (Math.min(100, 60 + registrations.length * 5)).toString() : "0")}
                    icon={<ActivitySquare className="h-5 w-5" />}
                    description={isAdminType ? "Total impact" : "Dynamic metric"}
                    trend="+1.2"
                    color="orange"
                />
                <StatCard
                    title={isAdminType ? "Capacity" : "Global Rank"}
                    value={isAdminType ? (allEvents.reduce((acc, curr) => acc + curr.capacity, 0)).toString() : (registrations.length > 5 ? "#12" : registrations.length > 0 ? "#88" : "N/A")}
                    icon={<Trophy className="h-5 w-5" />}
                    description={isAdminType ? "Venue limit" : "KIST leaderboard"}
                    trend="TOP 5%"
                    color="purple"
                />
            </div>

            <div className="grid gap-10 grid-cols-1 lg:grid-cols-12">
                {/* Schedule Card */}
                <Card className="lg:col-span-12 xl:col-span-7 shadow-2xl shadow-foreground/5 border-border/40 bg-card/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-10 border-b border-border/40 bg-muted/20">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-3xl font-black tracking-tighter uppercase italic">Event Log</CardTitle>
                                <CardDescription className="font-semibold text-muted-foreground/60 italic">Your upcoming event timeline.</CardDescription>
                            </div>
                            <ActivitySquare className="h-8 w-8 text-primary/20" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {upcomingActivities.length > 0 ? (
                            <div className="divide-y divide-border/40">
                                {upcomingActivities.map((reg: any) => (
                                    <motion.div
                                        key={reg._id}
                                        onClick={() => router.push(`/dashboard/events/${reg.event?._id}`)}
                                        whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                                        className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                                                <Zap className="h-8 w-8" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-black text-2xl tracking-tighter leading-tight line-clamp-1 group-hover:text-primary transition-colors">{reg.event?.title}</p>
                                                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                    <span className="flex items-center gap-1.5 p-1 rounded-lg bg-muted border border-border/40"><Clock className="h-3.5 w-3.5 text-primary" /> {format(reg.event?.date || 0, "MMM d")}</span>
                                                    <span className="flex items-center gap-1.5 p-1 rounded-lg bg-muted border border-border/40"><MapPin className="h-3.5 w-3.5 text-primary" /> {reg.event?.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 self-end sm:self-center">
                                            <div className={cn(
                                                "text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl border-2",
                                                (reg.status === 'approved' || reg.status === 'registered')
                                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-lg shadow-emerald-500/5"
                                                    : "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-lg shadow-amber-500/5"
                                            )}>
                                                {reg.status}
                                            </div>

                                            {!isAdminType && (
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 z-10"
                                                    onClick={(e) => handleCancel(e, reg._id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}

                                            <ChevronRight className="h-5 w-5 text-muted-foreground/30 hidden sm:block group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </motion.div>
                                ))}
                                <div className="p-8 bg-muted/10 border-t border-border/40">
                                    <Link href="/dashboard/activities" className="block">
                                        <Button variant="ghost" className="w-full h-14 rounded-2xl text-base font-black uppercase tracking-tighter border border-border hover:bg-background transition-all group">
                                            Explore Complete Archive <ArrowUpRight className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="py-32 text-center space-y-6">
                                <div className="h-24 w-24 bg-muted/50 rounded-[2rem] flex items-center justify-center mx-auto border border-dashed border-border/60">
                                    <Calendar className="h-10 w-10 text-muted-foreground/30" />
                                </div>
                                <div className="space-y-1 text-center">
                                    <p className="text-xl font-bold text-muted-foreground">No Events Scheduled</p>
                                    <p className="text-sm font-medium text-muted-foreground/60 italic">Browse the arena to find your next opportunity.</p>
                                </div>
                                <Link href="/dashboard/events">
                                    <Button className="rounded-2xl px-10 h-14 text-base font-bold shadow-xl shadow-primary/20">Explore Events</Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Insights / Chat Card */}
                {isAdminType ? (
                    <AIChatEventGenerator />
                ) : (
                    <ChatInterface />
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, description, trend, color }: { title: string, value: string, icon: React.ReactNode, description: string, trend?: string, color: string }) {
    const colorMap: any = {
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-blue-500/5",
        emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5",
        orange: "text-orange-500 bg-orange-500/10 border-orange-500/20 shadow-orange-500/5",
        purple: "text-purple-500 bg-purple-500/10 border-purple-500/20 shadow-purple-500/5"
    };

    return (
        <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="shadow-2xl shadow-foreground/5 border-border/40 bg-card/60 backdrop-blur-md rounded-3xl overflow-hidden group hover:border-primary/20 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 p-8">
                    <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                        {title}
                    </CardTitle>
                    <div className={cn("p-3 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg", colorMap[color])}>
                        {icon}
                    </div>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                    <div className="flex items-end justify-between gap-2">
                        <div className="text-5xl font-black tracking-tighter leading-none">{value}</div>
                        {trend && (
                            <div className={cn("text-[10px] font-black px-2 py-1 rounded-lg border", colorMap[color])}>
                                {trend}
                            </div >
                        )}
                    </div>
                    <div className="text-xs text-muted-foreground/60 mt-4 font-bold flex items-center gap-2 italic uppercase tracking-tight">
                        <div className={cn("h-1 w-1 rounded-full", colorMap[color].split(' ')[1])} />
                        {description}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

function DashboardSkeleton() {
    return (
        <div className="space-y-10">
            <div className="space-y-4">
                <Skeleton className="h-12 w-[350px] rounded-xl" />
                <Skeleton className="h-6 w-[500px] rounded-lg" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
            </div>
            <div className="grid gap-8 lg:grid-cols-12">
                <Skeleton className="lg:col-span-7 h-[500px] rounded-xl" />
                <Skeleton className="lg:col-span-5 h-[500px] rounded-xl" />
            </div>
        </div>
    )
}
