"use client";

import { motion } from "framer-motion";
import { Activity, Trophy, Zap, Users, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroVisual() {
    return (
        <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center">
            {/* Dynamic Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px]" />

            {/* Floating Elements */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0]
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative z-10 w-[80%] aspect-[4/3] rounded-[3rem] border border-white/20 bg-white/5 backdrop-blur-2xl shadow-2xl p-8 flex flex-col justify-between overflow-hidden group"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />

                <div className="relative z-10 flex justify-between items-start">
                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                        <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Live Combat
                    </div>
                </div>

                <div className="relative z-10 space-y-4">
                    <div className="space-y-1">
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">Active Championship</p>
                        <h3 className="text-3xl font-black text-white tracking-tighter italic uppercase">Inter-College <br /> Sprint Finals</h3>
                    </div>

                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" />
                            </div>
                        ))}
                        <div className="h-10 w-10 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[10px] font-bold text-white">
                            +12
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Orbiting Icons */}
            <OrbitingElement delay={0} icon={<Zap className="h-4 w-4" />} className="top-10 left-10" />
            <OrbitingElement delay={2} icon={<Activity className="h-4 w-4" />} className="bottom-20 right-0" />
            <OrbitingElement delay={4} icon={<Users className="h-4 w-4" />} className="top-1/2 -right-10" />
            <OrbitingElement delay={1} icon={<Sparkles className="h-4 w-4 text-amber-400" />} className="bottom-0 left-20" />
        </div>
    );
}

function OrbitingElement({ icon, className, delay }: { icon: React.ReactNode, className?: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: [0, -10, 0]
            }}
            transition={{
                delay,
                y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }
            }}
            className={cn(
                "absolute z-20 h-10 w-10 rounded-xl bg-background/40 backdrop-blur-lg border border-border/50 flex items-center justify-center shadow-lg",
                className
            )}
        >
            {icon}
        </motion.div>
    );
}
