'use client';

import { GlassCard } from '@/components/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown, Lock, Key, Shield, FileDigit, ServerOff, Cpu, ArrowRight, Users, Database, Briefcase, Github } from 'lucide-react';

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
    },
    {
        question: "Why did my Steganography Image fail to decode?",
        answer: "If you send a steganography image over WhatsApp, X (Twitter), Discord, or iMessage, those platforms aggressively compress the image to save space. This compression permanently destroys the hidden pixel data. You must send Carrier Images as 'Files' or via platforms that do not compress (like Signal, Telegram uncompressed, or email attachments)."
    },
    {
        question: "How do I install Phantom as an app?",
        answer: "Phantom is a Progressive Web App (PWA). On mobile Safari, tap 'Share' then 'Add to Home Screen'. On Android Chrome or Desktop Chrome/Edge, click the install icon in your URL address bar. Once installed, it works 100% completely offline."
    },
    {
        question: "What is a .phantom Vault file?",
        answer: "When you lock data, you can export it instantly as a .phantom file to store on a USB drive or local hard drive. To decode it, simply drag and drop the .phantom file into the home page and provide the password."
    }
];

// Pipeline step data extracted to prevent re-render overhead
const pipelineSteps = [
    { icon: FileDigit, label: 'Raw Data', sub: 'Text or Image', color: 'bg-white/5 border-white/10 text-gray-400', tooltip: 'The original unprotected data' },
    { icon: Key, label: 'PBKDF2', sub: '100,000 Iterations', color: 'bg-red-500/20 border-red-500/30 text-red-400', tooltip: 'Derives a master key via 100k hashes' },
    { icon: Shield, label: 'AES-256-GCM', sub: 'Military Grade', color: 'bg-rose-500/20 border-rose-500/30 text-rose-400', tooltip: 'Scrambles data with authenticated math' },
    { icon: Lock, label: 'Ciphertext', sub: 'Secure Payload', color: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400', tooltip: 'The fully locked, unreadable output' },
];

export default function SecurityInfo() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-12 sm:gap-16 pt-4 pb-20"
        >
            {/* Hero Header — simplified for mobile perf */}
            <div className="text-center space-y-4 px-4">
                <div className="flex justify-center mb-6 relative w-36 h-36 mx-auto">
                    {/* Static gradient ring instead of animated blur (mobile-friendly) */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 rounded-[3rem] opacity-20" />
                    <div className="relative z-10 w-full h-full">
                        <Image
                            src="/security.webp"
                            alt="Phantom Security Illustration"
                            fill
                            className="rounded-3xl drop-shadow-[0_0_20px_rgba(248,113,113,0.25)] object-cover"
                            priority
                        />
                    </div>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter text-red-400">Architecture &amp; Trust</h1>
                <p className="text-gray-400 text-base sm:text-lg">The mathematical foundation and mission of Phantom.</p>
            </div>

            <GlassCard className="max-w-3xl mx-auto px-5 py-8 sm:px-10 sm:py-12">
                <div className="flex flex-col gap-12 sm:gap-16">
                    {/* Technical Specs */}
                    <div className="space-y-8 sm:space-y-10">
                        <h2 className="text-xl sm:text-2xl font-bold border-b border-white/10 pb-6">Technical Specifications</h2>
                        <ul className="list-disc list-inside space-y-5 sm:space-y-6 text-gray-300 text-base leading-relaxed">
                            <li><strong>Algorithm:</strong> AES (Advanced Encryption Standard) in GCM (Galois/Counter Mode).</li>
                            <li><strong>Key Size:</strong> 256-bit keys, ensuring military-grade encryption.</li>
                            <li><strong>Key Derivation:</strong> PBKDF2 with SHA-256 hash.</li>
                            <li><strong>Iterations:</strong> 100,000 iterations to resist parallelized GPU brute-forcing.</li>
                            <li><strong>Salt Size:</strong> 16 bytes, randomly generated per-message.</li>
                            <li><strong>IV Size:</strong> 12 bytes, randomly generated per-message.</li>
                        </ul>
                    </div>

                    {/* Cryptographic Pipeline — rewritten for performance */}
                    <div className="space-y-8 sm:space-y-10">
                        <h2 className="text-xl sm:text-2xl font-bold border-b border-white/10 pb-6 flex items-center gap-2">
                            <Cpu className="w-6 h-6 text-red-400" />
                            The Cryptographic Pipeline
                        </h2>
                        <div className="bg-black/40 border border-white/5 p-5 sm:p-8 rounded-3xl">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-4">
                                {pipelineSteps.map((step, idx) => {
                                    const Icon = step.icon;
                                    return (
                                        <>
                                            {/* Step card — tooltip removed on mobile, shown only on desktop via group-hover */}
                                            <div key={step.label} className="group flex flex-col items-center text-center space-y-2 w-full sm:w-auto relative">
                                                {/* Desktop-only tooltip (hidden on mobile via sm:block) */}
                                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 hidden sm:block opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50 pointer-events-none">
                                                    <div className="bg-black/90 border border-white/20 text-xs text-gray-300 px-3 py-1.5 rounded-lg whitespace-nowrap">
                                                        {step.tooltip}
                                                    </div>
                                                </div>
                                                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${step.color}`}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <div className="text-xs font-bold text-white uppercase tracking-wider">{step.label}</div>
                                                <div className="text-[10px] text-gray-500">{step.sub}</div>
                                            </div>
                                            {idx < pipelineSteps.length - 1 && (
                                                <ArrowRight key={`arrow-${idx}`} className="w-5 h-5 text-red-500/40 hidden sm:block flex-shrink-0" />
                                            )}
                                        </>
                                    );
                                })}
                            </div>
                            {/* Mobile: simple linear label instead of arrows */}
                            <p className="text-center text-xs text-gray-600 mt-5 sm:hidden">Raw Data → PBKDF2 → AES-256-GCM → Ciphertext</p>
                        </div>
                    </div>

                    {/* Warnings */}
                    <div className="space-y-8 sm:space-y-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-red-300 border-b border-white/10 pb-6">Important Warnings</h2>
                        <div className="bg-red-500/10 border border-red-500/20 p-6 sm:p-10 rounded-3xl space-y-6">
                            <p className="text-red-200 text-base leading-relaxed">
                                <strong>1. Lost passwords cannot be recovered.</strong><br />
                                Phantom is zero-knowledge locally executing software. There is no backend password reset feature.
                            </p>
                            <p className="text-red-200 text-base leading-relaxed">
                                <strong>2. No browser storage.</strong><br />
                                Everything is stored temporarily in RAM. The keys and plaintexts are cleared when the session closes.
                            </p>
                        </div>
                    </div>

                    {/* Threat Model */}
                    <div className="space-y-8 sm:space-y-10 pt-4">
                        <h2 className="text-xl sm:text-2xl font-bold border-b border-white/10 pb-6 flex items-center gap-2">
                            <Shield className="w-6 h-6 text-orange-400" />
                            Threat Model &amp; Limitations
                        </h2>
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-6 sm:p-8 space-y-4">
                            <p className="text-orange-200/80 text-sm sm:text-base leading-relaxed mb-4">
                                While Phantom mathematically guarantees your data is secure in transit and at rest, it <strong>cannot</strong> protect against endpoint compromise:
                            </p>
                            <ul className="list-disc list-inside space-y-3 text-orange-200/60 text-sm sm:text-base">
                                <li><strong>Keyloggers:</strong> If your OS is infected with malware, attackers can capture your Secret Key as you type it.</li>
                                <li><strong>Screen Grabbers:</strong> Malicious background apps could record your screen before you click &quot;Lock&quot;.</li>
                                <li><strong>Physical Access:</strong> Phantom does not protect you if someone physically looks over your shoulder.</li>
                            </ul>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="space-y-8 sm:space-y-10 pt-4">
                        <h2 className="text-xl sm:text-2xl font-bold border-b border-white/10 pb-6 flex items-center gap-2">
                            <ServerOff className="w-6 h-6 text-gray-400" />
                            Zero-Knowledge FAQ
                        </h2>
                        <div className="space-y-3">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full flex items-center justify-between p-5 text-left focus:outline-none active:bg-white/[0.04]"
                                    >
                                        <span className="font-semibold text-gray-200 pr-4">{faq.question}</span>
                                        <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {openFaq === idx && (
                                            <motion.div
                                                key="answer"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                                className="overflow-hidden"
                                            >
                                                <p className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Merged Mission & Use Cases */}
                    <div className="space-y-8 sm:space-y-10 pt-4 border-t border-white/10 mt-10">
                        <div className="flex flex-col items-center text-center pb-4 pt-4">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20 flex flex-col items-center justify-center">
                                <span className="text-white font-bold text-xl leading-none">P</span>
                                <span className="text-[10px] font-bold opacity-60 text-white mt-1 uppercase tracking-widest">v1.0</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">The Phantom Mission</h2>
                            <p className="text-gray-300 text-lg font-medium leading-relaxed max-w-2xl">
                                We believe that total privacy shouldn&apos;t require a computer science degree.
                            </p>
                            <p className="text-gray-400 text-base leading-relaxed mt-4 max-w-2xl mx-auto">
                                Phantom was built to give anyone the ability to send messages that are mathematically impossible to intercept.
                                Privacy is a fundamental human right. We don&apos;t ask for data, don&apos;t show ads, and never see your messages.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 border-b border-white/10 pb-6">Built For Absolute Privacy</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 space-y-2 hover:border-white/10 transition-colors">
                                    <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-base font-bold text-white">Journalists</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">Protecting anonymous sources and transmitting sensitive data without digital footprints.</p>
                                </div>
                                <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 space-y-2 hover:border-white/10 transition-colors">
                                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                                        <Database className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-base font-bold text-white">Personal Archival</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">Encrypting crypto seed phrases or private passwords offline before cloud storage.</p>
                                </div>
                                <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 space-y-2 hover:border-white/10 transition-colors">
                                    <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-base font-bold text-white">IP Protection</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">Sharing proprietary code, trade secrets, or unreleased assets with business partners.</p>
                                </div>
                            </div>
                        </div>

                        {/* Open Source Action */}
                        <div className="pt-6 border-t border-white/10 text-center">
                            <a
                                href="https://github.com/aadityashekhar321/Phantom"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors font-medium text-gray-300 hover:text-white"
                            >
                                <Github className="w-5 h-5" /> View Open Source Engine on GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
}
