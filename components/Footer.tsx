'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Github, Shield, Lock, FileText, Clock, Star } from 'lucide-react';
import { useT } from '@/components/LanguageProvider';

export function Footer() {
    const year = new Date().getFullYear();
    const t = useT();

    return (
        <footer className="w-full relative mt-auto border-t border-white/5 bg-black/60 backdrop-blur-xl overflow-hidden group">
            {/* Dynamic glowing top border */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Ambient background glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/5 blur-[100px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-8 mb-12">
                    {/* Brand & Mission (Spans 5 cols on lg screens) */}
                    <div className="space-y-6 md:col-span-12 lg:col-span-5">
                        <Link href="/" className="flex items-center gap-3 w-fit group/logo">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)] flex items-center justify-center overflow-hidden border border-indigo-500/30 group-hover/logo:border-indigo-400/50 transition-colors">
                                <Image src="/logo.png" alt="Phantom Logo" width={32} height={32} className="object-cover group-hover/logo:scale-110 transition-transform duration-500" />
                            </div>
                            <span className="font-extrabold text-2xl tracking-tighter text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Phantom</span>
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-sm font-medium">
                            {t.footer.tagline}
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <a
                                href="https://github.com/aadityashekhar321/Phantom"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-0.5"
                            >
                                <Github className="w-4 h-4" />
                                GitHub
                            </a>
                            <a
                                href="https://github.com/aadityashekhar321/Phantom"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-500/30 transition-all hover:-translate-y-0.5"
                            >
                                <Star className="w-4 h-4 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                                {t.footer.starOnGitHub || "Star"}
                            </a>
                        </div>
                    </div>

                    {/* Navigation (3 cols) */}
                    <div className="space-y-5 md:col-span-4 lg:col-span-3">
                        <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-gray-500">{t.footer.navigate}</h3>
                        <ul className="space-y-3">
                            {[
                                { href: "/", icon: <Lock className="w-4 h-4 text-indigo-400" />, label: t.nav.vault },
                                { href: "/notes", icon: <FileText className="w-4 h-4 text-violet-400" />, label: t.nav.notes },
                                { href: "/security", icon: <Shield className="w-4 h-4 text-rose-400" />, label: t.nav.security },
                                { href: "/changelog", icon: <Clock className="w-4 h-4 text-cyan-400" />, label: t.nav.changelog },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-3 w-fit group/link">
                                        <span className="p-1 rounded-md bg-white/5 opacity-70 group-hover/link:opacity-100 group-hover/link:bg-white/10 transition-all">{link.icon}</span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Trust Signals & Tech Stack (4 cols) */}
                    <div className="space-y-5 md:col-span-8 lg:col-span-4">
                        <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-gray-500">{t.footer.securityPromises}</h3>
                        <ul className="space-y-2.5 text-sm text-gray-400">
                            {t.footer.promises.map((promise, i) => (
                                <li key={i} className="flex items-start gap-2.5 group/promise">
                                    <span className="text-emerald-400/70 mt-0.5 flex-shrink-0 group-hover/promise:text-emerald-400 transition-colors">✓</span>
                                    <span className="group-hover/promise:text-gray-300 transition-colors">{promise}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="pt-4 border-t border-white/5 mt-4">
                            <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-2">Powered By</p>
                            <div className="flex flex-wrap gap-2">
                                {['Next.js 14', 'Web Crypto API', 'AES-256-GCM', 'PBKDF2'].map(tech => (
                                    <span key={tech} className="text-[10px] font-semibold text-gray-500 bg-white/5 px-2 py-1 rounded-md border border-white/5 cursor-default hover:text-gray-300 hover:border-white/10 transition-colors">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-500">
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
                        <span>&copy; {year} Phantom. {t.footer.copyright}</span>
                        <span className="hidden sm:inline text-white/20">|</span>
                        <span className="flex items-center gap-1.5 hover:text-gray-300 transition-colors cursor-default"><Shield className="w-3.5 h-3.5 text-emerald-500/70" /> 100% Client-Side</span>
                    </div>

                    <a
                        href="https://github.com/aadityashekhar321/Phantom"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-transparent hover:border-white/10"
                    >
                        <Github className="w-4 h-4" />
                        {t.footer.viewSource || "View Source"}
                    </a>
                </div>
            </div>
        </footer>
    );
}
