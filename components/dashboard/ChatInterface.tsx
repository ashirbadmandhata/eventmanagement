"use client";

import { useState, useRef, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ChatInterface() {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([
        { role: "assistant", content: "Hello! I am ActiveIQ Core. How can I assist you with your athletic journey today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const chatAction = useAction(api.ai.chat);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await chatAction({
                message: userMessage,
                history: messages
            });
            setMessages(prev => [...prev, { role: "assistant", content: response }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: "assistant", content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="lg:col-span-12 xl:col-span-5 shadow-2xl shadow-foreground/5 border-border/40 bg-card/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden flex flex-col h-[600px]">
            <CardHeader className="p-8 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                        <Bot className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-black tracking-tighter uppercase italic">ActiveIQ Core</CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase tracking-widest text-primary/60">Live Query Support</CardDescription>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase">Online</span>
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide" ref={scrollRef}>
                <AnimatePresence>
                    {messages.map((m, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={i}
                            className={cn(
                                "flex items-start gap-3 max-w-[85%]",
                                m.role === "user" ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            <div className={cn(
                                "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border",
                                m.role === "user" ? "bg-primary border-primary text-primary-foreground" : "bg-muted border-border"
                            )}>
                                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                            </div>
                            <div className={cn(
                                "p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                                m.role === "user"
                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                    : "bg-background border border-border/40 rounded-tl-none"
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
                        className="flex items-center gap-2 text-muted-foreground"
                    >
                        <div className="h-8 w-8 rounded-lg bg-muted border border-border flex items-center justify-center">
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                        <span className="text-xs font-bold animate-pulse">Core is thinking...</span>
                    </motion.div>
                )}
            </CardContent>

            <div className="p-6 bg-muted/20 border-t border-border/40">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="relative"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about events, scores, or campus athletics..."
                        className="h-14 pl-6 pr-16 rounded-2xl bg-background border-border/60 focus:ring-primary shadow-inner font-medium"
                    />
                    <Button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-2 h-10 w-10 rounded-xl p-0 shadow-lg shadow-primary/20"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
                <p className="mt-3 text-[9px] text-center font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">
                    Powered by Gemini 1.5 Flash
                </p>
            </div>
        </Card>
    );
}
