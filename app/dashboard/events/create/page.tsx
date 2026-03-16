"use client";

import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Calendar, MapPin, Users, Activity, Sparkles, Zap, Loader2, Trophy, Clock, ImagePlus } from "lucide-react";

export default function CreateEventPage() {
    const createEvent = useMutation(api.events.create);
    const suggestAI = useAction(api.ai.suggestEventDetails);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        endTime: "",
        category: "",
        location: "",
        capacity: "",
    });

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAIGenerate = async () => {
        if (!formData.title && !formData.description) {
            toast.error("Please provide a title or topic first");
            return;
        }
        setAiLoading(true);
        try {
            const result = await suggestAI({ topic: formData.title || formData.description });

            let suggestedEndTime = formData.endTime;
            if (result.durationInMinutes && formData.date) {
                const start = new Date(formData.date).getTime();
                suggestedEndTime = new Date(start + result.durationInMinutes * 60000).toISOString().slice(0, 16);
            }

            setFormData({
                ...formData,
                title: result.title || formData.title,
                description: result.description || formData.description,
                category: result.category || formData.category,
                capacity: result.capacity?.toString() || formData.capacity,
                location: result.location || formData.location,
                endTime: suggestedEndTime
            });
            toast.success("AI Generation Complete!");
        } catch (error: any) {
            toast.error("AI Generation failed: " + error.message);
        } finally {
            setAiLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let imageStorageId = undefined;
            if (selectedImage) {
                const postUrl = await generateUploadUrl();
                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: { "Content-Type": selectedImage.type },
                    body: selectedImage,
                });
                const { storageId } = await result.json();
                imageStorageId = storageId;
            }

            await createEvent({
                title: formData.title,
                description: formData.description,
                date: new Date(formData.date).getTime(),
                endTime: new Date(formData.endTime).getTime(),
                category: formData.category,
                location: formData.location,
                capacity: parseInt(formData.capacity),
                imageStorageId
            });
            toast.success("Event Created Successfully!");
            router.push("/dashboard/events");
        } catch (error: any) {
            toast.error("Failed to create event: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-10 pb-20 mt-10">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="rounded-xl h-10 px-4 group text-muted-foreground hover:text-foreground border border-border"
            >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Events
            </Button>

            <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px]">
                    <Sparkles className="h-3 w-3" />
                    New Athletic Event
                </div>
                <h1 className="text-5xl font-black tracking-tighter">Create Event</h1>
                <p className="text-muted-foreground text-lg font-medium tracking-tight">Set up a new sports activity for the campus community.</p>
            </div>

            <Card className="rounded-[2.5rem] border-border bg-card shadow-xl overflow-hidden relative">
                <CardHeader className="p-10 border-b border-border bg-muted/20">
                    <CardTitle className="text-2xl font-black tracking-tighter">Event Details</CardTitle>
                    <CardDescription className="font-semibold italic">Fill in the core parameters for the event.</CardDescription>
                </CardHeader>
                <CardContent className="p-10">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="grid gap-3">
                                <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Event Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Annual Football Championship"
                                    className="h-14 rounded-2xl bg-background border-border px-6 font-bold"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="category" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Category</Label>
                                    <Input
                                        id="category"
                                        name="category"
                                        required
                                        value={formData.category}
                                        onChange={handleChange}
                                        placeholder="e.g. Football"
                                        className="h-14 rounded-2xl bg-background border-border px-6 font-bold"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="capacity" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Capacity Limit</Label>
                                    <div className="relative">
                                        <Users className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                        <Input
                                            id="capacity"
                                            name="capacity"
                                            type="number"
                                            required
                                            value={formData.capacity}
                                            onChange={handleChange}
                                            placeholder="50"
                                            className="h-14 rounded-2xl bg-background border-border pl-14 pr-6 font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="date" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Starting Time</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                        <Input
                                            id="date"
                                            name="date"
                                            type="datetime-local"
                                            required
                                            value={formData.date}
                                            onChange={handleChange}
                                            className="h-14 rounded-2xl bg-background border-border pl-14 pr-6 font-bold"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="endTime" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Ending Time</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                        <Input
                                            id="endTime"
                                            name="endTime"
                                            type="datetime-local"
                                            required
                                            value={formData.endTime}
                                            onChange={handleChange}
                                            className="h-14 rounded-2xl bg-background border-border pl-14 pr-6 font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid gap-3">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Event Banner</Label>
                                <div className="relative group">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="flex flex-col items-center justify-center w-full h-48 rounded-[2rem] border-2 border-dashed border-border bg-muted/20 hover:bg-muted/30 transition-all cursor-pointer overflow-hidden"
                                    >
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                    <ImagePlus className="h-6 w-6" />
                                                </div>
                                                <p className="text-sm font-bold text-muted-foreground">Click to upload event banner</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="location" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                    <Input
                                        id="location"
                                        name="location"
                                        required
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. Sports Complex A"
                                        className="h-14 rounded-2xl bg-background border-border pl-14 pr-6 font-bold"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Event Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                required
                                value={formData.description}
                                onChange={handleChange}
                                rows={5}
                                placeholder="Provide detailed information about the event..."
                                className="rounded-3xl bg-background border-border p-6 font-bold min-h-[160px]"
                            />
                        </div>

                        <div className="pt-6 flex flex-col sm:flex-row gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAIGenerate}
                                disabled={aiLoading || loading}
                                className="h-16 rounded-2xl border-primary/20 bg-primary/5 text-primary font-black hover:bg-primary/10 transition-all shadow-lg shadow-primary/5 gap-2 text-lg sm:w-1/3"
                            >
                                {aiLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                                AI Fill
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading || aiLoading}
                                className="flex-1 h-16 rounded-2xl bg-primary text-primary-foreground font-black hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 gap-2 text-lg"
                            >
                                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Trophy className="h-5 w-5" />}
                                Create Event
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div >
    );
}
