'use client';

import { GlassCard } from '@/components/GlassCard';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HowItWorks() {
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
                        className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 blur-2xl rounded-[3rem] opacity-30"
                        animate={{ opacity: [0.15, 0.4, 0.15], scale: [0.85, 1.15, 0.85] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Floating Image Container */}
                    <motion.div
                        animate={{ y: [-8, 8, -8] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10 w-full h-full"
                    >
                        <Image src="/flow.webp" alt="Phantom Workflow Illustration" fill className="rounded-3xl drop-shadow-[0_0_30px_rgba(99,102,241,0.3)] object-cover" priority />
                    </motion.div>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter">How It Works</h1>
                <p className="text-gray-400 text-base sm:text-lg">Three simple steps to absolute privacy.</p>
            </div>

            <GlassCard className="max-w-3xl mx-auto space-y-12 px-5 py-8 sm:px-10 sm:py-12">
                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">
                    <div className="hidden md:flex flex-col items-center mt-2">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xl border border-indigo-500/30">1</div>
                        <div className="w-0.5 h-24 bg-gradient-to-b from-indigo-500/30 to-transparent mt-4"></div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-4 md:hidden mb-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/30">1</div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white">Write & Lock</h2>
                        </div>
                        <h2 className="hidden md:block text-2xl font-bold text-white mb-2">Write & Lock</h2>
                        <p className="text-gray-300 text-base leading-8 sm:leading-relaxed">
                            Type the message you want to keep secret. Then, enter a <strong>Secret Key</strong> (password).
                            <br className="hidden sm:block" />
                            Think of this key as the unique physical key to an indestructible digital safe.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">
                    <div className="hidden md:flex flex-col items-center mt-2">
                        <div className="w-12 h-12 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-xl border border-violet-500/30">2</div>
                        <div className="w-0.5 h-24 bg-gradient-to-b from-violet-500/30 to-transparent mt-4"></div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-4 md:hidden mb-4">
                            <div className="w-10 h-10 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold border border-violet-500/30">2</div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white">The Scramble</h2>
                        </div>
                        <h2 className="hidden md:block text-2xl font-bold text-white mb-2">The Scramble</h2>
                        <p className="text-gray-300 text-base leading-8 sm:leading-relaxed">
                            When you click Lock, Phantom instantly scrambles your message using military-grade math.
                            The result is a random block of text that looks like absolute nonsense.
                            <br className="hidden sm:block" />
                            <br className="hidden sm:block" />
                            <strong>Without your exact Secret Key, no human or AI in the world can read it.</strong>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">
                    <div className="hidden md:flex flex-col items-center mt-2">
                        <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xl border border-cyan-500/30">3</div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-4 md:hidden mb-4">
                            <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold border border-cyan-500/30">3</div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white">Send & Unlock</h2>
                        </div>
                        <h2 className="hidden md:block text-2xl font-bold text-white mb-2">Send & Unlock</h2>
                        <p className="text-gray-300 text-base leading-8 sm:leading-relaxed">
                            Copy that scrambled text and send it to your friend anywhere—via iMessage, WhatsApp, or email.
                            <br className="hidden sm:block" />
                            They simply paste it back into Phantom, enter the Secret Key you gave them, and the original message is instantly restored.
                        </p>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
}
