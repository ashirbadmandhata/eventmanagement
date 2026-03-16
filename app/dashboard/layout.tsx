"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Home,
    Calendar,
    Users,
    Settings,
    Trophy,
    Activity,
    Loader2,
    Menu,
    ChevronLeft,
    ChevronRight,
    PanelLeftClose,
    PanelLeftOpen,
    LayoutDashboard,
    ListTodo,
    ClipboardList,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import NotificationCenter from "@/components/NotificationCenter";
import { ModeToggle } from "@/components/ModeToggle";
import Logo from "@/components/Logo";
import { useState } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = useQuery(api.users.current);
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    if (user === undefined) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (user === null) {
        return (
            <div className="flex h-screen items-center justify-center flex-col gap-6 bg-background">
                <Logo className="scale-110" />
                <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading Profile...</p>
            </div>
        )
    }

    const role = user.role;

    const links = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Events", href: "/dashboard/events", icon: Calendar },
        { name: "Performance", href: "/dashboard/performance", icon: Trophy },
        ...(role === "student" ? [
            { name: "My Activities", href: "/dashboard/activities", icon: ListTodo },
        ] : []),
        ...(role === "faculty" || role === "admin" ? [
            { name: "Registrations", href: "/dashboard/approvals", icon: ClipboardList },
        ] : []),
        ...(role === "admin" ? [
            { name: "Admin Panels", href: "/dashboard/admin", icon: Settings },
        ] : [])
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-card border-r border-border">
            <div className={cn(
                "h-20 flex items-center px-6 border-b border-border",
                isCollapsed && "px-0 justify-center"
            )}>
                <Logo iconOnly={isCollapsed} />
            </div>

            <div className={cn("px-4 py-6", isCollapsed && "px-2")}>
                <div className={cn(
                    "px-4 py-3 rounded-xl bg-muted/50 border border-border transition-all duration-300",
                    isCollapsed && "px-2 rounded-lg"
                )}>
                    {!isCollapsed && <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">User Role</p>}
                    <div className={cn(
                        "text-xs font-bold capitalize text-foreground flex items-center gap-2",
                        isCollapsed && "justify-center"
                    )}>
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        {!isCollapsed && <span>{role}</span>}
                    </div>
                </div>
            </div>

            <nav className={cn("flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar", isCollapsed && "px-2")}>
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link key={link.href} href={link.href}>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-3 h-11 px-3 rounded-lg font-medium transition-all group",
                                    isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
                                    !isActive && "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                <Icon className={cn("h-4.5 w-4.5 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                                {!isCollapsed && <span className="text-sm">{link.name}</span>}
                            </Button>
                        </Link>
                    )
                })}
            </nav>

            <div className={cn("p-4 border-t border-border mt-auto", isCollapsed && "p-2")}>
                <div className={cn(
                    "flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border",
                    isCollapsed && "p-0 justify-center bg-transparent border-none"
                )}>
                    <UserButton afterSignOutUrl="/" />
                    {!isCollapsed && (
                        <div className="flex flex-col overflow-hidden text-left">
                            <span className="text-sm font-bold truncate text-foreground leading-none">{user.name}</span>
                            <span className="text-[10px] font-medium text-muted-foreground/60 truncate mt-1">Logged In</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-screen bg-background text-foreground flex overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className={cn(
                "hidden md:flex flex-col h-full z-40 transition-all duration-300 ease-in-out",
                isCollapsed ? "w-16" : "w-64"
            )}>
                <SidebarContent />
            </aside>

            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="h-16 flex px-6 items-center justify-between bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-30 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-4 md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon" className="h-10 w-10">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="p-0 w-72">
                                    <SheetHeader className="sr-only">
                                        <SheetTitle>Navigation</SheetTitle>
                                    </SheetHeader>
                                    <SidebarContent />
                                </SheetContent>
                            </Sheet>
                            <Logo className="md:hidden scale-90" />
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="hidden md:flex h-9 w-9 border border-border bg-background"
                        >
                            {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                        </Button>
                    </div>

                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <div className="h-8 w-px bg-border hidden sm:block" />
                        <NotificationCenter />
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">System Online</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="container max-w-7xl mx-auto p-6 md:p-10">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
