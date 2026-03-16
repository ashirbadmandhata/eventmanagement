"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import {
    Calendar,
    MapPin,
    Users,
    Clock,
    ArrowLeft,
    Trophy,
    Activity,
    Sparkles,
    Zap,
    CheckCircle2,
    Loader2,
    Trash2,
    ImagePlus,
    Upload
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EventDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as any;

    const event = useQuery(api.events.get, { id: eventId });
    const user = useQuery(api.users.current);
    const registrations = useQuery(api.registrations.getMyRegistrations);
    const winners = useQuery(api.registrations.getWinners, { eventId });

    const register = useMutation(api.registrations.register);
    const deleteEvent = useMutation(api.events.deleteEvent);
    const completeEvent = useMutation(api.events.complete);
    const submitWork = useMutation(api.registrations.submitWork);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);

    const [isRegistering, setIsRegistering] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showRegForm, setShowRegForm] = useState(false);
    const [regData, setRegData] = useState({
        name: "",
        regNo: "",
        branch: "",
        semester: ""
    });

    const registration = registrations?.find(r => r.eventId === eventId);
    const isRegistered = !!registration;
    const isAdmin = user?.role === "admin";
    const isCompleted = event?.status === "completed";


    const handleRegister = async () => {
        if (!regData.name || !regData.regNo || !regData.branch || !regData.semester) {
            toast.error("Please fill all details");
            return;
        }

        setIsRegistering(true);
        try {
            await register({
                eventId,
                registrantName: regData.name,
                registrationNumber: regData.regNo,
                branch: regData.branch,
                semester: regData.semester
            });
            toast.success("Successfully registered!");
            setShowRegForm(false);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsRegistering(false);
        }
    };

    const handleComplete = async () => {
        if (!confirm("Are you sure you want to resolve this event? This will finalize the winners based on current scores.")) return;
        setIsCompleting(true);
        try {
            await completeEvent({ id: eventId });
            toast.success("Event Resolved Successfully");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsCompleting(false);
        }
    };

    const handleSubmission = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !registration) return;

        setIsSubmitting(true);
        try {
            const postUrl = await generateUploadUrl();
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });
            const { storageId } = await result.json();
            await submitWork({ registrationId: registration._id, submissionStorageId: storageId });
            toast.success("Work submitted successfully!");
        } catch (error: any) {
            toast.error("Submission failed: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            await deleteEvent({ id: eventId });
            toast.success("Event deleted");
            router.push("/dashboard/events");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    if (!event || !user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
            </div>
        );
    }

    const creativeCategories = ["mehendi", "sketching", "art", "creative", "drawing", "painting"];
    const isCreativeEvent = creativeCategories.some(cat => event.category?.toLowerCase().includes(cat));

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20 relative">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="rounded-xl h-10 px-4 group text-muted-foreground hover:text-foreground border border-border"
            >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
            </Button>

            {event.imageUrl && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full h-80 rounded-[3rem] overflow-hidden border-4 border-card shadow-2xl relative group"
                >
                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-10 left-10 text-white">
                        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg">
                            <Zap className="h-6 w-6" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Venue Briefing</p>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-8">
                    {isCompleted && winners && winners.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-1 rounded-[3rem] bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-600 shadow-2xl shadow-orange-500/20"
                        >
                            <div className="bg-card rounded-[2.9rem] p-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Trophy className="h-32 w-32 rotate-12" />
                                </div>
                                <div className="space-y-6 relative">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                                            <Trophy className="h-5 w-5" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">Victory Podium</p>
                                    </div>
                                    <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-none">The Champions</h2>

                                    <div className="grid grid-cols-1 gap-4 pt-6">
                                        {winners.map((winner, idx) => (
                                            <div key={idx} className={cn(
                                                "p-6 rounded-[2rem] border-2 flex items-center justify-between transition-all hover:scale-[1.01]",
                                                idx === 0 ? "bg-orange-500/5 border-orange-500/20 shadow-lg shadow-orange-500/5" : "bg-muted/30 border-border/40"
                                            )}>
                                                <div className="flex items-center gap-6">
                                                    <div className={cn(
                                                        "h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl italic shadow-inner",
                                                        idx === 0 ? "bg-orange-500 text-white" :
                                                            idx === 1 ? "bg-slate-300 text-slate-700" :
                                                                "bg-amber-700/20 text-amber-900"
                                                    )}>
                                                        {idx + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-xl tracking-tight">{winner.name}</p>
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">KIST Event</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-black tracking-tighter text-primary">{winner.score}</p>
                                                    <p className="text-[10px] font-black text-muted-foreground/40 uppercase">Performance Pts</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px]">
                            <Zap className="h-3 w-3" />
                            {event.category}
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter leading-[0.9]">
                            {event.title}
                        </h1>
                    </motion.div>

                    <Card className="rounded-[2.5rem] border-border/40 bg-card/60 backdrop-blur-xl shadow-2xl shadow-foreground/5 overflow-hidden">
                        <CardHeader className="p-10 border-b border-border/40 bg-muted/20">
                            <CardTitle className="text-2xl font-black tracking-tighter uppercase italic">Event Brief</CardTitle>
                        </CardHeader>
                        <CardContent className="p-10">
                            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                                {event.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Logistics</p>
                                    <div className="flex items-center gap-4 text-lg font-bold">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        {event.location}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Starting Point</p>
                                    <div className="flex items-center gap-4 text-lg font-bold">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                        {format(event.date, "PPP")}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {isRegistered && isCreativeEvent && (
                        <Card className="rounded-[2.5rem] border-primary/20 bg-primary/5 shadow-2xl shadow-primary/5 p-10 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <Upload className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black tracking-tighter uppercase italic">Submit Your Work</h3>
                                    <p className="text-muted-foreground font-bold text-sm uppercase tracking-widest">Share your {event.category} masterpiece</p>
                                </div>
                            </div>

                            <div className="relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="work-upload"
                                    onChange={handleSubmission}
                                    disabled={isSubmitting}
                                />
                                <label
                                    htmlFor="work-upload"
                                    className="flex flex-col items-center justify-center w-full h-64 rounded-[2.5rem] border-4 border-dashed border-primary/20 bg-background/50 hover:bg-background/80 transition-all cursor-pointer overflow-hidden p-6 text-center"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
                                    ) : registration.submissionUrl ? (
                                        <div className="space-y-4">
                                            <img src={registration.submissionUrl} alt="Your Submission" className="h-40 w-auto rounded-xl mx-auto shadow-lg" />
                                            <p className="text-sm font-black text-emerald-500 uppercase tracking-widest">Work Submitted - Click to change</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                                <ImagePlus className="h-8 w-8" />
                                            </div>
                                            <p className="text-xl font-black tracking-tight">Upload Your Art</p>
                                            <p className="text-sm text-muted-foreground font-bold mt-2 uppercase tracking-wider italic">Only images (.jpg, .png) are accepted</p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="rounded-[2.5rem] border-border/40 bg-primary/5 shadow-2xl shadow-primary/5 overflow-hidden h-fit">
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Event Status</p>
                                        <p className={cn(
                                            "text-2xl font-black tracking-tighter uppercase",
                                            isCompleted ? "text-emerald-500" : ""
                                        )}>
                                            {event.status || "Upcoming"}
                                        </p>
                                    </div>
                                    <div className={cn(
                                        "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors",
                                        isCompleted ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-primary text-primary-foreground shadow-primary/20"
                                    )}>
                                        {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Trophy className="h-6 w-6" />}
                                    </div>
                                </div>

                                {!isCompleted && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm font-bold">
                                            <span className="text-muted-foreground uppercase tracking-wider">Capacity</span>
                                            <span>{event.capacity} Slots</span>
                                        </div>
                                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[40%]" />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                                        <Clock className="h-4 w-4 text-primary" />
                                        {format(event.date, "p")}
                                        {event.endTime && ` - ${format(event.endTime, "p")}`}
                                    </div>
                                </div>
                            </div>

                            {!isCompleted && !isRegistered && (
                                <div className="space-y-4">
                                    {!showRegForm ? (
                                        <Button
                                            onClick={() => setShowRegForm(true)}
                                            className="w-full h-16 rounded-[1.5rem] bg-primary text-primary-foreground font-black text-lg transition-all shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02]"
                                        >
                                            JOIN THE ARENA
                                        </Button>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="space-y-4 pt-4 border-t border-border/40"
                                        >
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
                                                    <Input
                                                        placeholder="Enter your name"
                                                        value={regData.name}
                                                        onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                                                        className="rounded-xl h-12 bg-background border-border"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registration No.</Label>
                                                    <Input
                                                        placeholder="e.g. 2101234567"
                                                        value={regData.regNo}
                                                        onChange={(e) => setRegData({ ...regData, regNo: e.target.value })}
                                                        className="rounded-xl h-12 bg-background border-border"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Branch</Label>
                                                        <Input
                                                            placeholder="CSE, ECE, etc."
                                                            value={regData.branch}
                                                            onChange={(e) => setRegData({ ...regData, branch: e.target.value })}
                                                            className="rounded-xl h-12 bg-background border-border"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Semester</Label>
                                                        <Input
                                                            placeholder="1 to 8"
                                                            value={regData.semester}
                                                            onChange={(e) => setRegData({ ...regData, semester: e.target.value })}
                                                            className="rounded-xl h-12 bg-background border-border"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 h-12 rounded-xl font-bold"
                                                        onClick={() => setShowRegForm(false)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        className="flex-[2] h-12 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                                                        onClick={handleRegister}
                                                        disabled={isRegistering}
                                                    >
                                                        {isRegistering ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm & Join"}
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            )}

                            {isRegistered && !isCompleted && (
                                <div className="w-full h-16 rounded-[1.5rem] bg-muted/50 border border-border flex items-center justify-center gap-2 text-muted-foreground font-black text-lg">
                                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                    <span className="uppercase tracking-tighter italic">Enlisted</span>
                                </div>
                            )}

                            {isAdmin && !isCompleted && isCreativeEvent && (
                                <Button
                                    onClick={() => router.push(`/dashboard/events/${eventId}/judging`)}
                                    className="w-full h-16 rounded-[1.5rem] bg-orange-500 text-white font-black text-lg transition-all shadow-xl shadow-orange-500/10 hover:bg-orange-600 hover:scale-[1.02]"
                                >
                                    JUDGE ENTRIES
                                </Button>
                            )}

                            {isAdmin && !isCompleted && (
                                <Button
                                    onClick={handleComplete}
                                    disabled={isCompleting}
                                    className="w-full h-16 rounded-[1.5rem] bg-emerald-500 text-white font-black text-lg transition-all shadow-xl shadow-emerald-500/10 hover:bg-emerald-600 hover:scale-[1.02]"
                                >
                                    {isCompleting ? <Loader2 className="h-6 w-6 animate-spin" /> : "RESOLVE & RANK"}
                                </Button>
                            )}

                            {isAdmin && (
                                <Button
                                    variant="outline"
                                    onClick={handleDelete}
                                    className="w-full h-14 rounded-[1.5rem] font-bold border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all outline-none"
                                >
                                    <Trash2 className="h-5 w-5 mr-2" /> Terminate Event
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-border/40 bg-card/60 backdrop-blur-md p-8">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <Activity className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">Event Tip</p>
                                <p className="text-sm font-bold leading-tight line-clamp-2 italic text-muted-foreground">
                                    {isCompleted ? "Great effort to all participants. Review the leaderboard above." : "Hydrate 2 hours before the event for peak performance."}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
