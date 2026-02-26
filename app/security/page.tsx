'use client';

import { GlassCard } from '@/components/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown, Lock, Key, Shield, FileDigit, ServerOff, Cpu, ArrowRight } from 'lucide-react';

const faqs = [
    {
        question: "Can Phantom recover my password?",
        answer: "No. Phantom is a zero-knowledge local client. We do not have servers, databases, or password reset capabilities. If you lose your Secret Key, your data is mathematically impossible to recover."
    },
    {
        question: "Does Phantom track my IP or usage?",
        answer: "Never. We do not use analytics, we do not track IP addresses, and we do not store cookies. Your privacy is absolute."
    },
    {
        question: "Are my files uploaded to a server for encryption?",
        answer: "No. 100% of the cryptographic lifting happens entirely within your device's RAM (Random Access Memory) using your browser's native Web Crypto API. Nothing is ever sent over the network."
    }
];

export default function SecurityInfo() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-12 sm:gap-16 pt-4 pb-20"
        >
            <div className="text-center space-y-4 px-4">
                <div className="flex justify-center mb-6 relative w-40 h-40 mx-auto">
                    {/* Ambient Pulse Behind Image */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 blur-2xl rounded-[3rem] opacity-30"
                        animate={{ opacity: [0.15, 0.4, 0.15], scale: [0.85, 1.15, 0.85] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Floating Image Container */}
                    <motion.div
                        animate={{ y: [-8, 8, -8] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10 w-full h-full"
                    >
                        <Image src="/security.webp" alt="Phantom Security Illustration" fill className="rounded-3xl drop-shadow-[0_0_30px_rgba(248,113,113,0.3)] object-cover" priority />
                    </motion.div>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter text-red-400">Security Information</h1>
                <p className="text-gray-400 text-base sm:text-lg">Understanding the cryptographic foundation of Phantom.</p>
            </div>

            <GlassCard className="max-w-3xl mx-auto px-5 py-8 sm:px-10 sm:py-12">
                <div className="flex flex-col gap-12 sm:gap-16">
                    <div className="space-y-8 sm:space-y-10">
                        <h2 className="text-xl sm:text-2xl font-bold border-b border-white/10 pb-6">Technical Specifications</h2>
                        <ul className="list-disc list-inside space-y-5 sm:space-y-6 text-gray-300 text-base leading-relaxed">
                            <li>
                                <strong>Algorithm:</strong> AES (Advanced Encryption Standard) in GCM (Galois/Counter Mode).
                            </li>
                            <li>
                                <strong>Key Size:</strong> 256-bit keys, ensuring military-grade encryption.
                            </li>
                            <li>
                                <strong>Key Derivation:</strong> PBKDF2 with SHA-256 hash.
                            </li>
                            <li>
                                <strong>Iterations:</strong> 100,000 iterations to resist parallelized GPU brute-forcing.
                            </li>
                            <li>
                                <strong>Salt Size:</strong> 16 bytes, randomly generated per-message.
                            </li>
                            <li>
                                <strong>IV Size:</strong> 12 bytes, randomly generated per-message.
                            </li>
                        </ul>
                    </div>

                    {/* Cryptographic Pipeline Section */}
                    <div className="space-y-8 sm:space-y-10">
                        <h2 className="text-xl sm:text-2xl font-bold border-b border-white/10 pb-6 flex items-center gap-2">
                            <Cpu className="w-6 h-6 text-red-400" />
                            The Cryptographic Pipeline
                        </h2>
                        <div className="bg-black/40 border border-white/5 p-6 sm:p-8 rounded-3xl relative overflow-hidden">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                                {/* Step 1 */}
                                <div className="flex flex-col items-center text-center space-y-2 w-full sm:w-1/4">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                                        <FileDigit className="w-6 h-6" />
                                    </div>
                                    <div className="text-xs font-bold text-white uppercase tracking-wider">Raw Data</div>
                                    <div className="text-[10px] text-gray-500">Text or Image</div>
                                </div>

                                <ArrowRight className="w-6 h-6 text-red-500/50 hidden sm:block flex-shrink-0" />
                                <ArrowRight className="w-6 h-6 text-red-500/50 sm:hidden rotate-90" />

                                {/* Step 2 */}
                                <div className="flex flex-col items-center text-center space-y-2 w-full sm:w-1/4">
                                    <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
                                        <Key className="w-6 h-6" />
                                    </div>
                                    <div className="text-xs font-bold text-white uppercase tracking-wider">PBKDF2</div>
                                    <div className="text-[10px] text-gray-500">100,000 Iterations</div>
                                </div>

                                <ArrowRight className="w-6 h-6 text-red-500/50 hidden sm:block flex-shrink-0" />
                                <ArrowRight className="w-6 h-6 text-red-500/50 sm:hidden rotate-90" />

                                {/* Step 3 */}
                                <div className="flex flex-col items-center text-center space-y-2 w-full sm:w-1/4">
                                    <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <div className="text-xs font-bold text-white uppercase tracking-wider">AES-256-GCM</div>
                                    <div className="text-[10px] text-gray-500">Military Grade</div>
                                </div>

                                <ArrowRight className="w-6 h-6 text-red-500/50 hidden sm:block flex-shrink-0" />
                                <ArrowRight className="w-6 h-6 text-red-500/50 sm:hidden rotate-90" />

                                {/* Step 4 */}
                                <div className="flex flex-col items-center text-center space-y-2 w-full sm:w-1/4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                                        <Lock className="w-6 h-6" />
                                    </div>
                                    <div className="text-xs font-bold text-white uppercase tracking-wider">Ciphertext</div>
                                    <div className="text-[10px] text-gray-500">Secure Payload</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 sm:space-y-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-red-300 border-b border-white/10 pb-6">Important Warnings</h2>
                        <div className="bg-red-500/10 border border-red-500/20 p-6 sm:p-10 rounded-3xl space-y-6">
                            <p className="text-red-200 text-base leading-relaxed">
                                <strong>1. Lost passwords cannot be recovered.</strong>
                                <br className="hidden sm:block" />
                                Phantom is zero-knowledge locally executing software. There is no backend password reset feature.
                            </p>
                            <p className="text-red-200 text-base leading-relaxed">
                                <strong>2. No browser storage.</strong>
                                <br className="hidden sm:block" />
                                Everything is stored temporarily in RAM. The keys and plaintexts are cleared when the session closes.
                            </p>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="space-y-8 sm:space-y-10 pt-4">
                        <h2 className="text-xl sm:text-2xl font-bold border-b border-white/10 pb-6 flex items-center gap-2">
                            <ServerOff className="w-6 h-6 text-gray-400" />
                            Zero-Knowledge FAQ
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden transition-colors hover:bg-white/[0.05]">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                                    >
                                        <span className="font-bold text-gray-200">{faq.question}</span>
                                        <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === idx && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="px-5 pb-5 text-gray-400 text-sm leading-relaxed"
                                            >
                                                {faq.answer}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
}
