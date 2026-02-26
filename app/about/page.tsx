'use client';

import { GlassCard } from '@/components/GlassCard';
import { Github } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function About() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12 sm:space-y-16"
        >
            <div className="text-center space-y-4 px-4">
                <div className="flex justify-center mb-6 relative w-40 h-40 mx-auto">
                    {/* Ambient Pulse Behind Image */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 blur-2xl rounded-[3rem] opacity-30"
                        animate={{ opacity: [0.15, 0.4, 0.15], scale: [0.85, 1.15, 0.85] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Floating Image Container */}
                    <motion.div
                        animate={{ y: [-8, 8, -8] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10 w-full h-full"
                    >
                        <Image src="/about.webp" alt="Phantom Privacy Core" fill className="rounded-3xl drop-shadow-[0_0_30px_rgba(16,185,129,0.3)] object-cover" priority />
                    </motion.div>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter">About Phantom</h1>
                <p className="text-gray-400 text-base sm:text-lg">Your private gateway to secure communication.</p>
            </div>

            <GlassCard className="max-w-2xl mx-auto space-y-10 text-center px-5 py-8 sm:px-10 sm:py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20 flex flex-col items-center justify-center mb-6">
                    <span className="text-white font-bold text-xl leading-none">P</span>
                    <span className="text-[10px] font-bold opacity-60 text-white mt-1 uppercase tracking-widest">v1.0</span>
                </div>

                <div className="space-y-8">
                    <p className="text-gray-200 text-xl font-medium leading-relaxed">
                        We believe that total privacy shouldn&apos;t require a computer science degree.
                    </p>

                    <p className="text-gray-300 text-lg leading-8 sm:leading-relaxed">
                        Phantom was built with a singular purpose: to give anyone the ability to send messages that are <strong>mathematically impossible to intercept</strong>.
                        We don&apos;t ask for your personal information, we don&apos;t show ads, and most importantly—we never, ever see your messages.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                        <div className="bg-white/[0.03] p-5 sm:p-8 rounded-3xl border border-white/5 text-left h-full">
                            <h3 className="text-white font-bold mb-3">100% Client-Side</h3>
                            <p className="text-sm sm:text-base leading-relaxed text-gray-400">Everything happens securely inside your own web browser. Your data never touches a server.</p>
                        </div>
                        <div className="bg-white/[0.03] p-5 sm:p-8 rounded-3xl border border-white/5 text-left h-full">
                            <h3 className="text-white font-bold mb-3">Zero Storage</h3>
                            <p className="text-sm sm:text-base leading-relaxed text-gray-400">We don&apos;t have a database. We cannot read, store, or recover your messages. Your privacy is absolute.</p>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 mt-10">
                    <a
                        href="https://github.com/vercel/next.js"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors font-medium text-gray-300 hover:text-white"
                    >
                        <Github className="w-5 h-5" /> View on GitHub
                    </a>
                </div>
            </GlassCard>
        </motion.div>
    );
}
