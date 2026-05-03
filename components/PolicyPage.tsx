'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, LucideIcon } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';

const VP = { once: true, amount: 0.12 } as const;

const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    visible: (delay: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay },
    }),
};

export type PolicySection = {
    title: string;
    icon: LucideIcon;
    accent: string;
    tone: string;
    points: string[];
};

type PolicyStat = {
    label: string;
    value: string;
    detail: string;
};

type PolicyLink = {
    label: string;
    href: string;
};

type PolicyPageProps = {
    eyebrow: string;
    title: string;
    description: string;
    lastUpdated: string;
    heroAccent: string;
    heroBadge: string;
    heroNote: string;
    stats: PolicyStat[];
    promiseTitle: string;
    promiseBody: string;
    promiseIcon: LucideIcon;
    promiseAccent: string;
    summaryTitle: string;
    summaryItems: string[];
    sections: PolicySection[];
    footerTitle: string;
    footerBody: ReactNode;
    footerLinks: PolicyLink[];
};

function SectionCard({ section, index }: { section: PolicySection; index: number }) {
    const Icon = section.icon;

    return (
        <motion.div
            custom={index * 0.08}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
        >
            <GlassCard className={`group relative overflow-hidden border-t ${section.tone} p-5 sm:p-6 transition-transform duration-300`}>
                <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${section.accent} opacity-80`} />
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10 mb-5 flex items-start gap-4">
                    <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/35 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${section.accent} opacity-90`} />
                        <Icon className="relative z-10 h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-gray-500">
                            <span>Section</span>
                            <ChevronRight className="h-3 w-3" />
                            <span>{String(index + 1).padStart(2, '0')}</span>
                        </div>
                        <h3 className="text-xl font-bold tracking-tight text-white sm:text-[1.35rem]">{section.title}</h3>
                    </div>
                </div>

                <div className="relative z-10">
                    <ul className="space-y-3 text-gray-300">
                        {section.points.map((point) => (
                            <li key={point} className="flex gap-3 text-sm leading-6 sm:text-[15px]">
                                <span className={`mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-gradient-to-br ${section.accent} shadow-[0_0_18px_rgba(99,102,241,0.35)]`} />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </GlassCard>
        </motion.div>
    );
}

export function PolicyPage({
    eyebrow,
    title,
    description,
    lastUpdated,
    heroAccent,
    heroBadge,
    heroNote,
    stats,
    promiseTitle,
    promiseBody,
    promiseIcon: PromiseIcon,
    promiseAccent,
    summaryTitle,
    summaryItems,
    sections,
    footerTitle,
    footerBody,
    footerLinks,
}: PolicyPageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="space-y-10 sm:space-y-14"
        >
            <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
                <div className={`absolute inset-0 bg-gradient-to-br ${heroAccent} opacity-20`} />
                <div className="absolute -left-20 top-0 h-44 w-44 rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-violet-500/20 blur-3xl" />

                <div className="relative z-10 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
                    <div className="space-y-5">
                        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
                            <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-gray-200">{eyebrow}</span>
                            <span>{heroBadge}</span>
                        </div>
                        <div className="space-y-4">
                            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">{title}</h1>
                            <p className="max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">{description}</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200">{heroNote}</span>
                            <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm font-medium text-gray-300">Last updated {lastUpdated}</span>
                        </div>
                    </div>

                    <GlassCard className="border-white/10 bg-black/30 p-4 sm:p-5 md:p-6">
                        <div className="mb-4 flex items-center gap-3">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${promiseAccent}`}>
                                <PromiseIcon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">Core stance</p>
                                <h2 className="text-lg font-bold text-white">{promiseTitle}</h2>
                            </div>
                        </div>
                        <p className="text-sm leading-6 text-gray-300">{promiseBody}</p>
                    </GlassCard>
                </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        custom={index * 0.08}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={VP}
                    >
                        <GlassCard className="group relative h-full overflow-hidden border-white/10 p-5 sm:p-6 transition-transform duration-300">
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                            <p className="relative z-10 text-[11px] font-semibold uppercase tracking-[0.26em] text-gray-500">{stat.label}</p>
                            <p className="relative z-10 mt-3 text-2xl font-black tracking-tight text-white">{stat.value}</p>
                            <p className="relative z-10 mt-2 text-sm leading-6 text-gray-400">{stat.detail}</p>
                        </GlassCard>
                    </motion.div>
                ))}
            </section>

            <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
                <motion.div
                    custom={0.08}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={VP}
                    className="lg:sticky lg:top-24"
                >
                    <GlassCard className="border-white/10 p-5 sm:p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">{summaryTitle}</p>
                        <ul className="mt-5 space-y-3">
                            {summaryItems.map((item) => (
                                <li key={item} className="flex gap-3 text-sm leading-6 text-gray-300">
                                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-400" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-6 text-gray-300">
                            These pages are intentionally compact. The goal is to explain policy without burying the user in legal noise.
                        </div>
                    </GlassCard>
                </motion.div>

                <div className="space-y-5">
                    {sections.map((section, index) => (
                        <SectionCard key={section.title} section={section} index={index} />
                    ))}
                </div>
            </section>

            <motion.section
                custom={0.16}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={VP}
            >
                <GlassCard className="relative overflow-hidden border-white/10 p-6 sm:p-8 md:p-10">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />
                    <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                        <div className="space-y-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">{footerTitle}</p>
                            <div className="text-sm leading-7 text-gray-300 sm:text-base">{footerBody}</div>
                        </div>
                        <div className="flex flex-wrap gap-3 lg:justify-end">
                            {footerLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-gray-200 transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                                >
                                    {link.label}
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>
                </GlassCard>
            </motion.section>
        </motion.div>
    );
}