'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, Shield, Scale, Eye, Database, ArrowRight, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';

const cards = [
    {
        title: 'Privacy Policy',
        href: '/privacy',
        icon: Shield,
        accent: 'from-cyan-500 to-blue-500',
        text: 'What Phantom stores, what it never sends, and how local session data works.',
    },
    {
        title: 'Security Policy',
        href: '/security-policy',
        icon: Scale,
        accent: 'from-indigo-500 to-violet-500',
        text: 'Disclosure, cryptographic standards, threat model, and reporting guidance.',
    },
    {
        title: 'Terms of Service',
        href: '/terms',
        icon: FileText,
        accent: 'from-slate-500 to-slate-700',
        text: 'Usage limits, no-recovery rules, and what responsibility sits with the user.',
    },
    {
        title: 'Accessibility Statement',
        href: '/accessibility',
        icon: Eye,
        accent: 'from-emerald-500 to-teal-500',
        text: 'Keyboard, contrast, responsive layout, and motion comfort expectations.',
    },
    {
        title: 'Data Practices',
        href: '/data-practices',
        icon: Database,
        accent: 'from-pink-500 to-rose-500',
        text: 'What data exists, how erasure works, and where Phantom’s responsibility ends.',
    },
];

export default function Legal() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="space-y-10 sm:space-y-14"
        >
            <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-cyan-500/20" />
                <div className="absolute -left-16 top-0 h-40 w-40 rounded-full bg-cyan-500/15 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-violet-500/15 blur-3xl" />
                <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-gray-300">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
                            Legal hub
                        </div>
                        <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">Everything in one place.</h1>
                        <p className="max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
                            This landing page gathers the policies that explain how Phantom handles privacy, security, accessibility, and data minimization. It is the fastest way to reach the full trust surface of the product.
                        </p>
                    </div>
                    <GlassCard className="border-white/10 bg-black/30 p-5 sm:p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Why this page exists</p>
                        <p className="mt-3 text-sm leading-6 text-gray-300">
                            A legal hub helps users find the right document quickly, especially on mobile. It also keeps the footer cleaner by giving policy pages one shared entry point.
                        </p>
                    </GlassCard>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link key={card.href} href={card.href} className="group">
                            <GlassCard className="relative h-full overflow-hidden border-white/10 p-5 sm:p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-white/20">
                                <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${card.accent} opacity-80`} />
                                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/5 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <div className="relative z-10 flex items-start gap-4">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent}`}>
                                        <Icon className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-xl font-bold text-white">{card.title}</h2>
                                        <p className="mt-2 text-sm leading-6 text-gray-400">{card.text}</p>
                                        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-200 transition-colors group-hover:text-white">
                                            Open page
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </Link>
                    );
                })}
            </section>
        </motion.div>
    );
}
