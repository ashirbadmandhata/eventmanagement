"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    ArrowLeft, 
    Trophy, 
    CheckCircle2, 
    Loader2, 
    Image as ImageIcon,
    ExternalLink,
    Search,
    ChevronRight,
    Zap
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function JudgingPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as any;

    const event = useQuery(api.events.get, { id: eventId });
    const user = useQuery(api.users.current);
    const participants = useQuery(api.registrations.getParticipants, { eventId });
    
    const recordScore = useMutation(api.registrations.recordScore);
    const completeEvent = useMutation(api.events.complete);

    const [searchQuery, setSearchQuery] = useState("");
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [updatingScores, setUpdatingScores] = useState<Record<string, boolean>>({});

    const isAdmin = user?.role === "admin" || user?.role === "faculty";
    const isCompleted = event?.status === "completed";

    const handleScoreChange = async (registrationId: any, score: string) => {
        const numScore = parseInt(score);
        if (isNaN(numScore)) return;

        setUpdatingScores(prev => ({ ...prev, [registrationId]: true }));
        try {
            await recordScore({ id: registrationId, score: numScore });
            toast.success("Score updated");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setUpdatingScores(prev => ({ ...prev, [registrationId]: false }));
        }
    };

    const handleFinalize = async () => {
        if (!confirm("Are you sure you want to finalize results? This will rank participants and close the event.")) return;
        
        setIsFinalizing(true);
        try {
            await completeEvent({ id: eventId });
            toast.success("Event Finalized! Champions crowned.");
            router.push(`/dashboard/events/${eventId}`);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsFinalizing(false);
        }
    };

    if (!event || !user || !participants) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="h-20 w-20 rounded-3xl bg-destructive/10 flex items-center justify-center text-destructive">
                    <Zap className="h-10 w-10" />
                </div>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter">Access Denied</h1>
                <p className="text-muted-foreground font-medium">Only authorized judges can access this arena.</p>
                <Button onClick={() => router.back()} variant="outline" className="rounded-xl">Go Back</Button>
            </div>
        );
    }

    const filteredParticipants = participants.filter(p => 
        p.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const liveWinners = [...participants]
        .filter(p => (p.score || 0) > 0)
        .sort((a, b) => {
            if ((b.score || 0) !== (a.score || 0)) return (b.score || 0) - (a.score || 0);
            return (a as any)._creationTime - (b as any)._creationTime;
        })
        .slice(0, 3);

    return (
        <div className="max-w-[1600px] mx-auto space-y-10 pb-20 relative px-6">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="rounded-xl h-10 px-4 group text-muted-foreground hover:text-foreground border border-border"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-[10px]">
                            <ImageIcon className="h-3 w-3" />
                            Judging Arena
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">
                            {event.title}
                        </h1>
                        <p className="text-muted-foreground text-lg font-bold uppercase tracking-widest italic opacity-60">
                            {participants.length} Entries Registered
                        </p>
                    </div>
                </div>

                {!isCompleted && (
                    <Button
                        onClick={handleFinalize}
                        disabled={isFinalizing}
                        className="h-20 px-10 rounded-[2rem] bg-emerald-500 text-white font-black text-xl transition-all shadow-2xl shadow-emerald-500/20 hover:bg-emerald-600 hover:scale-[1.05] group"
                    >
                        {isFinalizing ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            <>
                                <Trophy className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                                FINALIZE & RANK
                            </>
                        )}
                    </Button>
                )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content Area */}
                <div className="lg:col-span-8 xl:col-span-9 space-y-10">
                    {/* Search and Filters */}
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search participants by name or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-16 pl-14 pr-6 rounded-[2rem] bg-card/60 backdrop-blur-xl border-border/40 text-lg font-bold shadow-xl shadow-foreground/5"
                        />
                    </div>
                    
                    {/* Participant List */}
                    <div className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {filteredParticipants.length > 0 ? (
                                filteredParticipants.map((participant, index) => (
                                    <motion.div
                                        key={participant._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card className="rounded-[2rem] border-border/40 bg-card/40 backdrop-blur-xl hover:bg-card/60 transition-all overflow-hidden group">
                                            <CardContent className="p-8">
                                                <div className="flex flex-col gap-8">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                                        <div className="flex items-center gap-6">
                                                            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-2xl italic">
                                                                {participant.registrationNumber?.slice(-2) || index + 1}
                                                            </div>
                                                            <div>
                                                                <h3 className="text-2xl font-black tracking-tighter uppercase italic">
                                                                    {participant.user?.name}
                                                                </h3>
                                                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                                                                    ID: {participant.registrationNumber} • {participant.branch}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3 bg-foreground/5 p-2 rounded-2xl border border-border/40">
                                                            <div className="pl-4">
                                                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Score</Label>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="00"
                                                                    defaultValue={participant.score || ""}
                                                                    onBlur={(e) => handleScoreChange(participant._id, e.target.value)}
                                                                    className="h-10 w-24 bg-transparent border-none text-2xl font-black p-0 focus-visible:ring-0"
                                                                />
                                                            </div>
                                                            <div className="h-10 w-10 flex items-center justify-center">
                                                                {updatingScores[participant._id] ? (
                                                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                                                ) : (
                                                                    <div className={cn(
                                                                        "h-2 w-2 rounded-full transition-all",
                                                                        (participant.score || 0) > 0 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-muted-foreground/20"
                                                                    )} />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Submission Preview Card */}
                                                    <div className="relative group/submission">
                                                        {participant.submissionUrl ? (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                <div className="aspect-video rounded-[1.5rem] bg-black/5 overflow-hidden border border-border/40 relative group-hover/submission:border-primary/20 transition-colors">
                                                                    {participant.submissionUrl.match(/\.(jpg|jpeg|png|webp|gif)$|storage/i) ? (
                                                                        <img 
                                                                            src={participant.submissionUrl} 
                                                                            alt="Submission" 
                                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover/submission:scale-105"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
                                                                            <ImageIcon className="h-12 w-12 opacity-20" />
                                                                            <span className="text-xs font-bold uppercase tracking-widest">File Preview Restricted</span>
                                                                        </div>
                                                                    )}
                                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/submission:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                                                                        <Button
                                                                            asChild
                                                                            variant="secondary"
                                                                            className="rounded-xl font-bold"
                                                                        >
                                                                            <a href={participant.submissionUrl} target="_blank" rel="noopener noreferrer">
                                                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                                                Full View
                                                                            </a>
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col justify-center space-y-4">
                                                                    <div className="space-y-1">
                                                                        <h4 className="font-black uppercase italic tracking-tighter text-lg">Project Submission</h4>
                                                                        <p className="text-sm text-muted-foreground font-medium italic">Uploaded on {new Date((participant as any)._creationTime).toLocaleDateString()}</p>
                                                                    </div>
                                                                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                                                        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Judge's Note</p>
                                                                        <p className="text-xs font-medium text-muted-foreground leading-relaxed italic">Review the artifacts above for technical proficiency and creative execution before assigning the final score.</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="h-40 w-full rounded-[1.5rem] border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 text-muted-foreground bg-black/[0.02]">
                                                                <ImageIcon className="h-10 w-10 opacity-20" />
                                                                <p className="text-xs font-bold uppercase tracking-widest italic opacity-40">No submission found for this entry</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-20 text-center space-y-4"
                                >
                                    <div className="h-20 w-20 rounded-3xl bg-muted/10 flex items-center justify-center mx-auto text-muted-foreground">
                                        <Search className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tighter uppercase italic">No participants found</h3>
                                    <p className="text-muted-foreground font-medium italic">Adjust your search to find the competitors.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Sidebar: Live Podium */}
                <div className="lg:col-span-4 xl:col-span-3 space-y-6">
                    <Card className="rounded-[2.5rem] border-primary/20 bg-primary/5 shadow-2xl shadow-primary/5 overflow-hidden sticky top-10">
                        <CardHeader className="p-8 border-b border-primary/10">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
                                    <Trophy className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black tracking-tighter uppercase italic">Live Podium</CardTitle>
                                    <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Automatic Ranking</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            {liveWinners.length > 0 ? (
                                <div className="space-y-4">
                                    {liveWinners.map((winner, idx) => (
                                        <motion.div
                                            key={winner._id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className={cn(
                                                "p-4 rounded-2xl border-2 flex items-center justify-between transition-all",
                                                idx === 0 ? "bg-orange-500/10 border-orange-500/20 shadow-lg shadow-orange-500/5" : "bg-card/40 border-border/40"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-xl flex items-center justify-center font-black italic shadow-inner",
                                                    idx === 0 ? "bg-orange-500 text-white" :
                                                    idx === 1 ? "bg-slate-300 text-slate-700" :
                                                    "bg-amber-700/20 text-amber-900"
                                                )}>
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <p className="font-black tracking-tight line-clamp-1">{winner.user?.name}</p>
                                                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                                                        Score: {winner.score}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-10 text-center space-y-4 opacity-40">
                                    <Trophy className="h-12 w-12 mx-auto" />
                                    <p className="text-sm font-bold uppercase tracking-tighter">Enter scores to<br />see ranking</p>
                                </div>
                            )}

                            <div className="pt-6 border-t border-primary/10">
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-primary/10">
                                    <div className="h-8 w-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500">
                                        <Zap className="h-4 w-4" />
                                    </div>
                                    <p className="text-[10px] font-bold leading-tight italic text-muted-foreground">
                                        Ranking is live and automatic. Finalize to crown champions.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
