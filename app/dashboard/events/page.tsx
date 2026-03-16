"use client";

import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import {
    Calendar,
    MapPin,
    Users,
    Plus,
    ArrowRight,
    Activity,
    Trophy,
    Zap,
    Trash2,
    CheckCircle2,
    XCircle,
    Clock,
    User,
    Sparkles,
    Navigation,
    Layers,
    LayoutGrid,
    Search,
    Eye,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";

export default function EventsPage() {
    const events = useQuery(api.events.list);
    const user = useQuery(api.users.current);
    const myRegistrations = useQuery(api.registrations.getMyRegistrations);
    const register = useMutation(api.registrations.register);
    const deleteEvent = useMutation(api.events.deleteEvent);
    const completeEvent = useMutation(api.events.complete);

    const handleRegister = async (eventId: any) => {
        try {
            await register({ eventId });
            toast.success("Successfully registered for the event");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (eventId: any) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            await deleteEvent({ id: eventId });
            toast.success("Event deleted");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleComplete = async (eventId: any) => {
        if (!confirm("End this event? No further registrations will be allowed.")) return;
        try {
            await completeEvent({ id: eventId });
            toast.success("Event marked as completed");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    if (!events || !user || !myRegistrations) {
        return (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-[400px] rounded-2xl bg-muted/50 animate-pulse border border-border" />
                ))}
            </div>
        );
    }

    const canCreate = user.role === "faculty" || user.role === "admin";
    const isAdmin = user.role === "admin";

    return (
        <div className="space-y-10 pb-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">Athletic Events</h1>
                    <p className="text-muted-foreground text-lg">Browse and register for upcoming sports activities on campus.</p>
                </div>
                {canCreate && (
                    <Link href="/dashboard/events/create">
                        <Button className="rounded-xl h-12 px-6 gap-2 shadow-sm font-bold">
                            <Plus className="h-4.5 w-4.5" /> Create Event
                        </Button>
                    </Link>
                )}
            </div>

            {/* Content Area */}
            {events.length === 0 ? (
                <div className="py-32 text-center border-2 border-dashed border-border rounded-3xl bg-muted/10 space-y-4">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30" />
                    <p className="text-xl font-bold text-muted-foreground italic">No events found at the moment.</p>
                </div>
            ) : (
                <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => {
                        const registration = myRegistrations.find(r => r.eventId === event._id);
                        const isRegistered = !!registration;

                        return (
                            <Card key={event._id} className="flex flex-col shadow-sm border-border hover:shadow-md transition-shadow rounded-2xl overflow-hidden group">
                                {event.imageUrl && (
                                    <div className="h-48 w-full overflow-hidden">
                                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                )}
                                <CardHeader className="p-6 pb-4 bg-muted/20 border-b border-border">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2.5 rounded-xl bg-background border border-border text-primary shadow-sm group-hover:scale-105 transition-transform">
                                            {event.imageUrl ? <Zap className="h-5 w-5" /> : (event.category === 'Football' ? <Activity className="h-5 w-5" /> : <Trophy className="h-5 w-5" />)}
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-background",
                                                event.status === 'upcoming' ? "text-emerald-600 border-emerald-200" : "text-primary border-primary/20"
                                            )}>
                                                {event.status}
                                            </div>
                                            {isRegistered && <StatusBadge status={registration.status} />}
                                        </div>
                                    </div>
                                    <Link href={`/dashboard/events/${event._id}`} className="group/title">
                                        <CardTitle className="text-2xl font-black leading-[1.1] tracking-tighter line-clamp-2 group-hover/title:text-primary transition-colors cursor-pointer">
                                            {event.title}
                                        </CardTitle>
                                    </Link>
                                    <CardDescription className="text-xs font-bold text-muted-foreground/60 mt-3 line-clamp-2 italic uppercase tracking-wider">
                                        {event.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="p-6 pb-2 flex-1 space-y-4">
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="flex items-center gap-3 text-sm text-foreground/80">
                                            <Calendar className="h-4 w-4 text-primary/60" />
                                            <span className="font-medium">
                                                {format(new Date(event.date), "MMM d, h:mm a")}
                                                {event.endTime && ` - ${format(new Date(event.endTime), "h:mm a")}`}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-foreground/80">
                                            <MapPin className="h-4 w-4 text-primary/60" />
                                            <span className="truncate font-medium">{event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-foreground/80">
                                            <Users className="h-4 w-4 text-primary/60" />
                                            <span className="font-medium">{event.capacity} Slots Available</span>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="p-6 pt-4 mt-auto flex flex-col gap-4 border-t border-border bg-muted/5">
                                    <div className="flex w-full gap-3">
                                        {isAdmin && (
                                            <>
                                                <EventParticipants eventId={event._id} />
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    disabled={event.status === 'completed'}
                                                    className="h-11 w-11 rounded-xl text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all shrink-0"
                                                    onClick={() => handleComplete(event._id)}
                                                    title="Mark as Completed"
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-11 w-11 rounded-xl text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all shrink-0"
                                                    onClick={() => handleDelete(event._id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>

                                    <Button
                                        className={cn(
                                            "w-full h-12 rounded-xl font-bold transition-all text-sm",
                                            isRegistered
                                                ? "bg-muted text-muted-foreground border border-border cursor-auto"
                                                : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                                        )}
                                        disabled={isRegistered}
                                        onClick={() => handleRegister(event._id)}
                                    >
                                        {isRegistered ? (
                                            <span className="flex items-center gap-2 italic"><CheckCircle2 className="h-4 w-4" /> Registered</span>
                                        ) : (
                                            <span className="flex items-center gap-2">Register Now <ArrowRight className="h-4 w-4" /></span>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const configs: any = {
        approved: { class: "bg-emerald-50 text-emerald-600 border-emerald-200" },
        rejected: { class: "bg-red-50 text-red-600 border-red-200" },
        pending: { class: "bg-amber-50 text-amber-600 border-amber-200" }
    };
    const config = configs[status] || configs.pending;

    return (
        <span className={cn(
            "text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-sm",
            config.class
        )}>
            {status}
        </span>
    );
}

function EventParticipants({ eventId }: { eventId: any }) {
    const participants = useQuery(api.registrations.getParticipants, { eventId });
    const recordScore = useMutation(api.registrations.recordScore);
    const analyzeSubmissions = useAction(api.ai.analyzeSubmissions);
    const analyzeCreative = useAction(api.ai.analyzeCreativeSubmission);
    const event = useQuery(api.events.get, { id: eventId });

    const [scoringId, setScoringId] = useState<string | null>(null);
    const [scoreInput, setScoreInput] = useState("");
    const [analysis, setAnalysis] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isAiJudging, setIsAiJudging] = useState<string | null>(null);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            const result = await analyzeSubmissions({ eventId });
            setAnalysis(result);
            toast.success("AI Analysis Complete");
        } catch (error: any) {
            toast.error("Analysis failed: " + error.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAIScore = async (registrationId: any, submissionUrl: string) => {
        if (!event) return;
        setIsAiJudging(registrationId);
        try {
            const result = await analyzeCreative({
                submissionUrl,
                category: event.category
            });
            await recordScore({ id: registrationId, score: result.score });
            toast.success(`AI Judge Score: ${result.score}. Critique: ${result.critique}`);
        } catch (error: any) {
            toast.error("AI Judging failed: " + error.message);
        } finally {
            setIsAiJudging(null);
        }
    };

    const handleSetScore = async (id: any) => {
        if (!scoreInput || isNaN(parseInt(scoreInput))) {
            toast.error("Please enter a valid numeric score");
            return;
        }
        try {
            await recordScore({ id, score: parseInt(scoreInput) });
            toast.success("Score recorded");
            setScoringId(null);
            setScoreInput("");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    className="flex-1 h-11 rounded-xl font-bold text-xs"
                >
                    <Users className="mr-2 h-4 w-4" /> Participants List
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full bg-background border-l border-border">
                <SheetHeader className="p-8 border-b border-border bg-muted/20 shrink-0">
                    <SheetTitle className="text-3xl font-black tracking-tighter">Participants Manifest</SheetTitle>
                    <p className="text-sm font-medium text-muted-foreground mt-2 italic">Review enrollment and log performance metrics for this activity.</p>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
                        <Button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !participants || participants.length === 0}
                            className="w-full h-12 rounded-xl bg-primary shadow-lg shadow-primary/20 font-black gap-2 transition-all"
                        >
                            {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                            Analyze with Gemini
                        </Button>

                        {analysis && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4 pt-2"
                            >
                                <p className="text-sm font-bold leading-relaxed text-foreground italic">
                                    "{analysis.summary}"
                                </p>
                                <div className="space-y-2">
                                    {analysis.highlights.map((h: string, i: number) => (
                                        <div key={i} className="flex gap-2 items-start text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-normal">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1 shrink-0" />
                                            {h}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {!participants ? (
                        [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)
                    ) : participants.length === 0 ? (
                        <div className="py-24 text-center space-y-4 opacity-30">
                            <Layers className="h-12 w-12 mx-auto" />
                            <p className="font-bold text-sm uppercase tracking-widest">No active enrollments</p>
                        </div>
                    ) : (
                        participants.map((p: any) => (
                            <div key={p._id} className="p-5 rounded-2xl border border-border bg-card/50 flex flex-col gap-4 group hover:border-primary/40 transition-all shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary shadow-inner">
                                            <User className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-base leading-none tracking-tight">{p.user?.name}</p>
                                            <p className="text-[10px] font-medium text-muted-foreground mt-1.5 truncate max-w-[150px] uppercase tracking-wider">{p.user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <StatusBadge status={p.status} />
                                        {p.score !== undefined && (
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                                                <Trophy className="h-3 w-3" />
                                                <span className="text-[10px] font-black">{p.score} pts</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2 w-full pt-4 border-t border-border">
                                    {p.submissionUrl && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 h-9 rounded-lg text-[10px] font-black uppercase tracking-widest gap-2 bg-muted/20"
                                            onClick={() => window.open(p.submissionUrl, '_blank')}
                                        >
                                            <Eye className="h-3 w-3" /> View Work
                                        </Button>
                                    )}
                                    {p.submissionUrl && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={isAiJudging === p._id}
                                            className="flex-1 h-9 rounded-lg text-[10px] font-black uppercase tracking-widest gap-2 bg-primary/5 text-primary border-primary/20 hover:bg-primary hover:text-white transition-all"
                                            onClick={() => handleAIScore(p._id, p.submissionUrl)}
                                        >
                                            {isAiJudging === p._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                                            AI Judge
                                        </Button>
                                    )}
                                    {scoringId === p._id ? (
                                        <div className="flex-1 flex gap-2 items-center slide-in-from-left duration-300">
                                            <input
                                                autoFocus
                                                type="number"
                                                placeholder="Score"
                                                value={scoreInput}
                                                onChange={(e) => setScoreInput(e.target.value)}
                                                className="flex-1 h-9 rounded-lg bg-muted border border-border px-3 text-sm font-bold shadow-inner outline-none focus:ring-1 focus:ring-primary/40"
                                            />
                                            <Button
                                                size="sm"
                                                className="h-9 px-3 rounded-lg"
                                                onClick={() => handleSetScore(p._id)}
                                            >
                                                Log
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 rounded-lg transition-colors"
                                                onClick={() => {
                                                    setScoringId(null);
                                                    setScoreInput("");
                                                }}
                                            >
                                                <XCircle className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={cn(
                                                "h-9 rounded-lg text-[10px] font-black uppercase tracking-widest gap-2 hover:bg-primary/5 hover:text-primary border border-transparent hover:border-primary/20 transition-all",
                                                p.submissionUrl ? "w-1/3 px-0 translate-x-1" : "w-full"
                                            )}
                                            onClick={() => setScoringId(p._id)}
                                        >
                                            <Plus className="h-3 w-3" /> {p.submissionUrl ? "Score" : "Log Performance"}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
