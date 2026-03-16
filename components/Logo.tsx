"use client";

import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface LogoProps {
    className?: string;
    iconOnly?: boolean;
}

export default function Logo({ className, iconOnly = false }: LogoProps) {
    return (
        <Link href="/" className={cn("flex items-center gap-3 group shrink-0", className)}>
            <div className="bg-primary rounded-xl p-2 shadow-md shadow-primary/10">
                <Zap className="h-6 w-6 text-primary-foreground fill-current" />
            </div>
            {!iconOnly && (
                <div className="flex flex-col">
                    <span className="font-bold text-2xl tracking-tighter text-foreground leading-none">
                        KIST<span className="text-primary italic">IQ</span>
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60 mt-0.5">Event Management</span>
                </div>
            )}
        </Link>
    );
}
