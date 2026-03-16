"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Sparkles, Send, Loader2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function AIChatEventGenerator() {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([
        { role: "assistant", content: "Hello Admin! I can help you generate creative event ideas for KIST. Try asking: 'Suggest a tech-themed hackathon' or 'Plan a weekend sports tournament'." }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // We'll reuse the chat action for now, but in a real scenario you might want a specialized 
    // "admin_event_storming" action that has different system prompts.
    const chatAction = useAction(api.ai.chat);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            // We prepend context to the history if it's the first message, or just rely on the system prompt if we modified the backend.
            // For now, let's just send the message.
            const response = await chatAction({
                message: userMessage,
                history: messages,
                persona: "admin"
            });

            setMessages(prev => [...prev, { role: "assistant", content: response }]);
        } catch (error) {
            console.error("AI Error:", error);
            toast.error("Failed to generate ideas. Please try again.");
            setMessages(prev => [...prev, { role: "assistant", content: "I encountered an error connecting to the creative engine. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="lg:col-span-12 xl:col-span-5 shadow-2xl shadow-foreground/5 border-border/40 bg-primary/5 rounded-[2.5rem] overflow-hidden relative flex flex-col h-[600px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />

            <CardHeader className="p-8 border-b border-primary/10 backdrop-blur-sm z-10">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/25">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-black tracking-tighter uppercase italic">Event Architect AI</CardTitle>
                        <CardDescription className="font-bold text-primary/60 text-xs">Generate & Refine Campus Events</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide z-10">
                <AnimatePresence mode="popLayout">
                    {messages.map((m, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            key={i}
                            className={cn(
                                "flex gap-4 max-w-[90%]",
                                m.role === "user" ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            <div className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm mt-1",
                                m.role === "user" ? "bg-primary border-primary text-primary-foreground" : "bg-card border-border text-primary"
                            )}>
                                {m.role === "user" ? <div className="h-2 w-2 rounded-full bg-current" /> : <Bot className="h-4 w-4" />}
                            </div>

                            <div className={cn(
                                "p-5 rounded-3xl text-sm font-medium leading-relaxed shadow-sm",
                                m.role === "user"
                                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                                    : "bg-background/80 border border-primary/10 backdrop-blur-md rounded-tl-sm text-foreground/90"
                            )}>
                                {m.content}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-start gap-4"
                    >
                        <div className="h-8 w-8 rounded-full bg-card border border-border flex items-center justify-center shrink-0 shadow-sm mt-1">
                            <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-background/50 border border-primary/5 rounded-3xl rounded-tl-sm p-4 flex items-center gap-3">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            <span className="text-xs font-bold text-primary/60 uppercase tracking-wider">Brainstorming...</span>
                        </div>
                    </motion.div>
                )}
            </CardContent>

            <div className="p-6 bg-background/30 backdrop-blur-md border-t border-primary/10 z-10">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="relative flex items-center gap-2"
                >
                    <div className="relative flex-1">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Describe an event idea..."
                            className="h-14 pl-6 pr-4 rounded-2xl bg-background/80 border-primary/10 hover:border-primary/30 focus:border-primary/50 focus:ring-primary/20 shadow-inner transition-all font-medium"
                        />
                    </div>
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || !input.trim()}
                        className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-105 transition-all sticky right-0"
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </form>
            </div>
        </Card>
    );
}
