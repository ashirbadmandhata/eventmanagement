"use client";

import { Authenticated, Unauthenticated, AuthLoading, useQuery } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import {
  Calendar,
  Users,
  Trophy,
  ArrowRight,
  TrendingUp,
  Zap,
  Target,
  FlaskConical,
  GraduationCap,
  Globe,
  Star,
  Play,
  Activity
} from "lucide-react";
import AnimatedShinyText from "@/components/magicui/animated-shiny-text";
import { Meteors } from "@/components/magicui/meteors";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { BorderBeam } from "@/components/magicui/border-beam";
import { BentoGrid, BentoCard } from "@/components/magicui/bento-grid";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { HeroVisual } from "@/components/landing/HeroVisual";
import { Partners } from "@/components/landing/Partners";
import { ModeToggle } from "@/components/ModeToggle";

export default function Home() {
  const stats = useQuery(api.stats.getPublicStats);

  const features = [
    {
      Icon: Calendar,
      name: "Event Logistics",
      description: "Smart scheduling system tailored for KIST's academic and event calendar.",
      href: "/dashboard/events",
      cta: "Explore Calendar",
      background: <div className="absolute -right-20 -top-20 opacity-60 bg-blue-500/10 w-40 h-40 blur-3xl rounded-full" />,
      className: "md:col-span-1 border-border/50",
    },
    {
      Icon: Zap,
      name: "Gemini Analysis",
      description: "AI-driven performance insights. Analyze your sketching, mehendi, or contest scores with Gemini 1.5.",
      href: "/dashboard/performance",
      cta: "AI Insights",
      background: <div className="absolute -right-20 -top-20 opacity-60 bg-purple-500/10 w-60 h-60 blur-3xl rounded-full" />,
      className: "md:col-span-2 border-border/50",
    },
    {
      Icon: Trophy,
      name: "Campus Ranking",
      description: "Real-time leaderboards for every department. See where you stand in the KIST hall of fame.",
      href: "/dashboard",
      cta: "Leaderboard",
      background: <div className="absolute -right-20 -top-20 opacity-60 bg-emerald-500/10 w-60 h-60 blur-3xl rounded-full" />,
      className: "md:col-span-2 border-border/50",
    },
    {
      Icon: Users,
      name: "Creative Hub",
      description: "Submit your art, mehendi designs, and sketches for digital evaluation and exhibition.",
      href: "/dashboard/events",
      cta: "View Gallery",
      background: <div className="absolute -right-20 -top-20 opacity-60 bg-amber-500/10 w-40 h-40 blur-3xl rounded-full" />,
      className: "md:col-span-1 border-border/50",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans overflow-x-hidden">
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none h-screen transition-opacity">
        <div className="absolute top-0 left-0 w-full h-full mesh-gradient opacity-30" />
      </div>

      {/* Navbar - High-End Aesthetic */}
      <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-2xl border-b border-border/40 transition-colors">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Logo />

          <nav className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#campus" className="hover:text-primary transition-colors">Campus Pride</Link>
            <Link href="#impact" className="hover:text-primary transition-colors">Real-time stats</Link>
          </nav>

          <div className="flex items-center gap-4">
            <AuthLoading>
              <div className="h-10 w-24 bg-muted/20 animate-pulse rounded-xl" />
            </AuthLoading>
            <Unauthenticated>
              <SignInButton mode="modal">
                <Button variant="ghost" className="hidden sm:inline-flex rounded-xl px-6 font-bold text-sm">Log In</Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 px-8 h-11 font-bold">Get Started</Button>
              </SignInButton>
            </Unauthenticated>
            <Authenticated>
              <div className="flex items-center gap-6">
                <Link href="/dashboard">
                  <Button variant="secondary" className="gap-2 rounded-xl font-bold px-6 h-11 border border-border/40 shadow-sm">
                    Dashboard <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <div className="h-8 w-px bg-border/40 mx-2" />
                <UserButton afterSignOutUrl="/" />
              </div>
            </Authenticated>
            <div className="h-8 w-px bg-border/40 mx-2 hidden sm:block" />
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex-1 pt-48 pb-32 px-6 z-10 overflow-hidden">
        {/* Animated Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[150px] animate-pulse-slow pointer-events-none opacity-40" />

        <div className="container mx-auto max-w-7xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-center lg:justify-start"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-black uppercase tracking-widest shadow-sm backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Architecting KIST Excellence
                </div>
              </motion.div>

              <div className="space-y-8">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.8] lg:leading-[0.85]"
                >
                  BEYOND <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-purple-500 to-emerald-400">
                    LIMITS
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-bold italic uppercase tracking-tighter opacity-80"
                >
                  The unified intelligence layer for KIST. Connect with peers, compete in events, and dominate the arena with AI-driven insights.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-8"
              >
                <Authenticated>
                  <Link href="/dashboard">
                    <Button size="lg" className="rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/30 px-10 h-16 text-lg font-bold group transition-all hover:scale-[1.05]">
                      Go to Dashboard <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </Authenticated>
                <Unauthenticated>
                  <SignInButton mode="modal">
                    <Button size="lg" className="rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/30 px-10 h-16 text-lg font-bold group transition-all hover:scale-[1.05]">
                      Join the Arena <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </SignInButton>
                </Unauthenticated>
                <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl border-border bg-background/50 backdrop-blur-sm text-lg font-bold hover:bg-muted transition-all flex items-center gap-2">
                  <Play className="h-4 w-4 fill-current" /> Watch Intro
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex justify-center items-center"
            >
              <HeroVisual />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-40 relative z-10 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-24 text-center space-y-4">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Everything You Need</h2>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">Integrated tools designed for the modern collegiate experience.</p>
          </div>

          <BentoGrid className="grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div key={feature.name} className={cn(
                "relative group/card overflow-hidden rounded-[2.5rem] border border-border/50 bg-card hover:border-primary/40 transition-all duration-500",
                feature.className
              )}>
                <BentoCard {...feature} />
                {idx === 1 && <BorderBeam size={200} duration={12} delay={9} />}
              </div>
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Campus Pride Section */}
      <section id="campus" className="py-40 relative z-10 overflow-hidden bg-primary shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-20">
            <div className="md:w-1/2 space-y-8">
              <div className="inline-flex items-center gap-2 text-white/60 text-xs font-black uppercase tracking-[0.4em]">
                <GraduationCap className="h-4 w-4" />
                Konark Institute of Science & Technology
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none italic uppercase">
                The KIST <br /> Edge
              </h2>
              <p className="text-xl text-white/80 font-bold leading-relaxed max-w-md">
                We don't just study engineering; we engineer excellence. ActiveIQ is our custom-built platform to bridge the gap between academic rigor and competitive spirit.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                {[
                  { label: "Faculty Hub", icon: FlaskConical },
                  { label: "Student Spirit", icon: Star },
                  { label: "Elite Facilities", icon: Trophy },
                  { label: "Tech Driven", icon: Zap },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/90">
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="aspect-square rounded-[4rem] bg-white/5 border border-white/20 backdrop-blur-3xl p-1 relative overflow-hidden group shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-500/40 to-emerald-500/40 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative h-full w-full rounded-[3.8rem] bg-background/10 border border-white/10 flex flex-col items-center justify-center p-12 text-center">
                  <Logo className="scale-150 mb-8" />
                  <p className="text-white text-3xl font-black tracking-tighter uppercase italic leading-tight">
                    Architecting the <br /> Future of <br /> Student Life
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-32 relative z-10 border-y border-border/40 bg-muted/20 backdrop-blur-md overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <StatItem
              value={stats ? `${stats.userCount}` : "--"}
              label="Active Students"
              icon={<Users className="h-4 w-4 text-primary" />}
            />
            <StatItem
              value={stats ? `${stats.eventCount}` : "--"}
              label="Total Events"
              icon={<Calendar className="h-4 w-4 text-emerald-500" />}
            />
            <StatItem
              value={stats ? `${stats.registrationCount}` : "--"}
              label="Enrollments"
              icon={<Zap className="h-4 w-4 text-amber-500" />}
            />
            <StatItem
              value={stats ? `${stats.onlineNow}` : "--"}
              label="Online Now"
              icon={<Globe className="h-4 w-4 text-blue-500" />}
            />
          </div>
        </div>
      </section>

      <Partners />

      {/* Footer */}
      <footer className="relative pt-32 pb-16 bg-card border-t border-border/40 overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 pb-20">
            {/* Branding Column */}
            <div className="md:col-span-5 space-y-8">
              <Logo />
              <div className="space-y-4 max-w-sm">
                <p className="text-xl font-black tracking-tight leading-tight uppercase">
                  Konark Institute of <br />
                  <span className="text-primary italic">Science and Technology</span>
                </p>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  The official event management platform for KIST. Empowering our students to reach peak performance through technology and data-driven insights.
                </p>
              </div>
              <div className="flex gap-4">
                {[Target, Activity, Zap].map((Icon, i) => (
                  <div key={i} className="h-10 w-10 rounded-xl bg-muted border border-border/40 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer group">
                    <Icon className="h-5 w-5 opacity-60 group-hover:opacity-100" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-2 space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Platform</h4>
              <nav className="flex flex-col gap-4 text-sm font-bold text-muted-foreground">
                <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
                <Link href="/dashboard/events" className="hover:text-foreground transition-colors">Events</Link>
                <Link href="/dashboard/performance" className="hover:text-foreground transition-colors">Performance</Link>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">Leaderboards</Link>
              </nav>
            </div>

            {/* Support */}
            <div className="md:col-span-2 space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Support</h4>
              <nav className="flex flex-col gap-4 text-sm font-bold text-muted-foreground">
                <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
                <Link href="#" className="hover:text-foreground transition-colors">Help Center</Link>
                <Link href="#" className="hover:text-foreground transition-colors">Security</Link>
              </nav>
            </div>

            {/* Campus Info */}
            <div className="md:col-span-3 space-y-6 text-right md:text-left">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Location</h4>
              <div className="text-sm font-bold text-muted-foreground space-y-1">
                <p>Bhubaneswar, Odisha</p>
                <p>Pin: 752050</p>
                <p className="pt-4 text-xs font-black tracking-widest text-foreground">kist.edu.in</p>
              </div>
            </div>
          </div>

          <div className="pt-16 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2 text-center md:text-left">
              <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                © 2026 ACTIVEIQ. ALL RIGHTS RESERVED.
              </p>
              <p className="text-[9px] font-extrabold text-primary/40 uppercase tracking-[0.2em]">
                developed by OdiCoder (hemalata, jyoti, gungun, soumya)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatItem({ value, label, icon }: { value: string; label: string; icon?: React.ReactNode }) {
  return (
    <div className="space-y-4 group">
      <div className="flex items-center justify-center gap-2">
        {icon}
        <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.4em]">{label}</p>
      </div>
      <p className="text-6xl md:text-8xl font-black tracking-tighter text-foreground group-hover:scale-110 transition-transform duration-500">{value}</p>
      <div className="w-12 h-1 bg-primary/20 mx-auto rounded-full group-hover:w-24 group-hover:bg-primary transition-all duration-500" />
    </div>
  );
}
