"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { useState, useEffect } from "react";

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2500); // 2.5 seconds duration

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }
                    }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]"
                >
                    {/* Background Ambient Glow */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-50" />
                    </div>

                    <div className="relative flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                transition: { duration: 0.5, ease: "easeOut" }
                            }}
                            className="relative"
                        >
                            {/* Animated Logo Ring */}
                            <motion.div
                                animate={{
                                    rotate: 360,
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                className="absolute -inset-8 border border-primary/20 rounded-full border-dashed"
                            />

                            <motion.div
                                animate={{
                                    rotate: -360,
                                }}
                                transition={{
                                    duration: 12,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                className="absolute -inset-12 border border-primary/10 rounded-full border-dashed"
                            />

                            {/* Logo Icon */}
                            <div className="bg-primary rounded-[2rem] p-6 shadow-2xl shadow-primary/40 relative z-10">
                                <Zap className="h-16 w-16 text-primary-foreground fill-current" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{
                                y: 0,
                                opacity: 1,
                                transition: { delay: 0.3, duration: 0.5 }
                            }}
                            className="mt-10 text-center"
                        >
                            <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
                                ACTIVE<span className="text-primary">IQ</span>
                            </h1>
                            <div className="flex items-center gap-3 overflow-hidden">
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="h-[2px] w-24 bg-gradient-to-r from-transparent via-primary to-transparent"
                                />
                                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60 whitespace-nowrap">
                                    Initializing Athletic Protocol
                                </span>
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                                    className="h-[2px] w-24 bg-gradient-to-r from-transparent via-primary to-transparent"
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom Status Branding */}
                    <div className="absolute bottom-12 flex flex-col items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
                            developed by OdiCoder
                        </span>
                        <span className="text-[9px] font-bold text-muted-foreground/40 tracking-wider">
                            hemalata, jyoti, gungun, soumya
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
