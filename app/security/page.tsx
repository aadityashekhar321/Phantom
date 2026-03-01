'use client';

import { GlassCard } from '@/components/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Lock, Key, Shield, FileDigit, ServerOff, Cpu, ArrowRight, Users, Database, Briefcase, Github, CheckCircle } from 'lucide-react';

// ── Interactive Demo Component ────────────────────────────────────────────────
const demoSteps = [
    {
        title: '1. Your Plaintext',
        icon: FileDigit,
        color: 'text-gray-400',
        bg: 'bg-white/5 border-white/10',
        description: 'Your original message is read from memory as UTF-8 encoded bytes. It never touches the network.',
        output: '"Hello, Phantom!"  →  48 65 6c 6c 6f 2c 20 50 68 61 6e 74 6f 6d 21',
    },
    {
        title: '2. Salt Generation',
        icon: Key,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10 border-yellow-500/20',
        description: '16 cryptographically random bytes are generated via crypto.getRandomValues(). Even identical passwords produce different keys.',
        output: 'SALT  →  a3 f9 12 7c 4e 88 b1 d0 52 9a 3f 61 e4 77 c2 8b',
    },
    {
        title: '3. PBKDF2 Key Derivation',
        icon: Cpu,
        color: 'text-red-400',
        bg: 'bg-red-500/10 border-red-500/20',
        description: 'Your password is stretched through PBKDF2-SHA256 with 100,000 iterations into a 256-bit key. Each wrong guess MUST repeat this process.',
        output: 'KEY  →  7f 3c a1 88 ... (32 bytes, AES-256 ready)',
    },
    {
        title: '4. IV Generation',
        icon: Shield,
        color: 'text-violet-400',
        bg: 'bg-violet-500/10 border-violet-500/20',
        description: '12 random bytes form the Initialization Vector. This ensures encrypting the same plaintext twice never produces the same ciphertext.',
        output: 'IV  →  9b 2a e7 31 05 fc 8d 40 6e b3 17 c9',
    },
    {
        title: '5. AES-256-GCM Encryption',
        icon: Lock,
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/20 border-indigo-500/30',
        description: 'AES-GCM simultaneously encrypts and authenticates. A 128-bit GCM tag is appended — any modification to the ciphertext is mathematically detectable.',
        output: 'CIPHERTEXT  →  U2FsdGVkX1+3/A9x...  [IV · SALT · TAG · ENCRYPTED]',
    },
];

function InteractiveDemoSteps() {
    const [activeStep, setActiveStep] = useState(0);
    const [animating, setAnimating] = useState(false);

    const goToStep = (idx: number) => {
        if (animating) return;
        setAnimating(true);
        setTimeout(() => { setActiveStep(idx); setAnimating(false); }, 200);
    };

    const step = demoSteps[activeStep];
    const Icon = step.icon;

    return (
        <div className="space-y-4">
            {/* Step pill selector */}
            <div className="flex flex-wrap gap-2">
                {demoSteps.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => goToStep(i)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${i === activeStep
                            ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-100'
                            : i < activeStep
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                            }`}
                    >
                        {i < activeStep ? <CheckCircle className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-current inline-flex items-center justify-center text-[9px] font-bold leading-none">{i + 1}</span>}
                        <span className="hidden sm:inline">{s.title.split('. ')[1]}</span>
                    </button>
                ))}
            </div>

            {/* Step detail card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: animating ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className={`bg-black/50 border ${step.bg.split(' ')[1]} rounded-2xl p-5 sm:p-6 space-y-4`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${step.bg} flex items-center justify-center border`}>
                            <Icon className={`w-5 h-5 ${step.color}`} />
                        </div>
                        <h3 className="text-base font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                    <div className="bg-black/60 border border-white/5 rounded-xl p-3.5 font-mono text-xs text-emerald-300 break-all leading-relaxed">
                        {step.output}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Prev / Next controls */}
            <div className="flex items-center justify-between pt-1">
                <button
                    onClick={() => goToStep(Math.max(0, activeStep - 1))}
                    disabled={activeStep === 0}
                    className="text-xs font-semibold text-gray-500 hover:text-white disabled:opacity-30 transition-colors px-3 py-1.5 border border-white/5 rounded-xl hover:border-white/20"
                >
                    ← Prev
                </button>
                <span className="text-[11px] text-gray-600 font-mono">Step {activeStep + 1} / {demoSteps.length}</span>
                <button
                    onClick={() => goToStep(Math.min(demoSteps.length - 1, activeStep + 1))}
                    disabled={activeStep === demoSteps.length - 1}
                    className="text-xs font-semibold text-gray-500 hover:text-white disabled:opacity-30 transition-colors px-3 py-1.5 border border-white/5 rounded-xl hover:border-white/20"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}

const faqs = [
    {
        question: "Can Phantom recover my password?",
        answer: "No — by design. Phantom is a zero-knowledge stateless client. No servers, no databases, no password reset. Your Secret Key holds the only mathematical path to your data. Lose the key and the ciphertext remains permanently locked. This is not a limitation — it is the entire point."
    },
    {
        question: "Does Phantom track me or log my usage?",
        answer: "Never. Phantom uses zero analytics, zero cookies, zero IP logging, and zero telemetry. Once the static page loads, no outbound network requests are made. There is nothing to track because nothing is transmitted."
    },
    {
        question: "Are my files uploaded to a server for encryption?",
        answer: "No. Every cryptographic operation runs entirely inside your browser's RAM using the native Web Crypto API. Your data never crosses the network boundary. Not even a single byte. You can verify this by disconnecting from the internet and using Phantom — it works identically."
    },
    {
        question: "Why does my Steganography image fail to decode?",
        answer: "Platforms like WhatsApp, Twitter/X, Discord, and iMessage aggressively re-compress and re-encode images to reduce file size. This process permanently destroys the LSB pixel data where your hidden message is stored. Always share steganography carrier images as Files (not photos) via platforms that preserve binary losslessly: Signal, Telegram (with 'Send as File'), or direct email attachments."
    },
    {
        question: "How do I install Phantom as an offline app?",
        answer: "Phantom is a Progressive Web App (PWA). On iOS, open it in Safari → tap 'Share' → 'Add to Home Screen'. On Android, open it in Chrome → tap the menu → 'Add to Home Screen'. On Desktop Chrome or Edge, click the install icon in the address bar. Once installed, Phantom works 100% offline — no network connection required."
    },
    {
        question: "What is a .phantom Vault file?",
        answer: "A .phantom file is a self-contained encrypted bundle. When you lock data, you can export everything (ciphertext, IV, and salt metadata) into a single .phantom file for offline storage on a USB drive, hard disk, or secure archive. To decrypt, drag the .phantom file back into the Vault and provide the password."
    },
    {
        question: "Is Phantom open source? Can I audit the code?",
        answer: "Yes. Phantom is fully open source on GitHub. You can read every line of the cryptographic logic, verify no network calls are made, and confirm the security model for yourself. Trust shouldn't be assumed — it should be verified."
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

    // Count-up animation for the 100,000 iterations figure
    const [iterCount, setIterCount] = useState(0);
    const iterRef = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    observer.disconnect();
                    const target = 100000;
                    const duration = 1200;
                    const step = 16;
                    const increment = Math.ceil(target / (duration / step));
                    let current = 0;
                    const timer = setInterval(() => {
                        current = Math.min(current + increment, target);
                        setIterCount(current);
                        if (current >= target) clearInterval(timer);
                    }, step);
                }
            },
            { threshold: 0.3 }
        );
        if (iterRef.current) observer.observe(iterRef.current);
        return () => observer.disconnect();
    }, []);

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
                <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                    The mathematics, design decisions, and security guarantees that make Phantom trustworthy by construction — not by promise.
                </p>
            </div>

            <GlassCard className="max-w-3xl mx-auto px-5 py-8 sm:px-10 sm:py-12">
                <div className="flex flex-col gap-12 sm:gap-16">
                    {/* Technical Specs */}
                    <div className="space-y-8 sm:space-y-10">
                        <h2 className="text-xl sm:text-2xl font-bold border-b border-white/10 pb-6">Technical Specifications</h2>
                        <ul className="list-disc list-inside space-y-5 sm:space-y-6 text-gray-300 text-base leading-relaxed">
                            <li><strong>Algorithm:</strong> AES-256 in GCM (Galois/Counter Mode) — authenticated encryption that simultaneously provides confidentiality and tamper-detection.</li>
                            <li><strong>Key Size:</strong> 256-bit keys. At current compute speeds, a brute-force attack would require more energy than exists in the observable universe.</li>
                            <li><strong>Key Derivation:</strong> PBKDF2 with SHA-256 — makes each attempt at guessing your password computationally expensive.</li>
                            <li>
                                <strong>Iterations:</strong>{' '}
                                <span ref={iterRef} className="tabular-nums font-bold text-white">
                                    {iterCount.toLocaleString()}
                                </span>{' '}iterations. Each wrong password guess must repeat this entire process — making parallelized GPU attacks orders of magnitude slower.
                            </li>
                            <li><strong>Salt:</strong> 16 bytes, randomly generated per-message — ensures that identical passwords produce entirely different keys each time.</li>
                            <li><strong>IV (Initialization Vector):</strong> 12 bytes, randomly generated per-message — guarantees that encrypting the same plaintext twice never produces the same ciphertext.</li>
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

                    {/* ── Verified by Math ─────────────────────────────── */}
                    <div className="space-y-6 pt-4 border-t border-white/10 mt-4">
                        <h2 className="text-xl sm:text-2xl font-bold border-b border-white/10 pb-6 flex items-center gap-2">
                            <Shield className="w-6 h-6 text-indigo-400" />
                            Verified by Math
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Security is not a claim — it is a provable property. Here is what the mathematics guarantees:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                {
                                    label: 'Brute-force search space',
                                    value: '2²⁵⁶',
                                    sub: '≈ 1.16 × 10⁷⁷ possible keys',
                                    note: 'More than the number of atoms in the observable universe.',
                                    color: 'text-indigo-300',
                                },
                                {
                                    label: 'GPU guesses per second',
                                    value: '~10¹³',
                                    sub: 'PBKDF2 reduces GPU throughput to ~10⁵',
                                    note: 'Each guess requires 100,000 hash iterations.',
                                    color: 'text-violet-300',
                                },
                                {
                                    label: 'Time to brute-force',
                                    value: '≫ 10⁵⁴ years',
                                    sub: 'Universe age: 1.38 × 10¹⁰ years',
                                    note: 'Even with all the energy in the universe.',
                                    color: 'text-cyan-300',
                                },
                                {
                                    label: 'Authentication guarantee',
                                    value: 'GCM Tag',
                                    sub: '128-bit authentication tag per message',
                                    note: 'Tampered ciphertext is detected before decryption.',
                                    color: 'text-emerald-300',
                                },
                            ].map((item) => (
                                <div key={item.label} className="bg-black/40 border border-white/5 p-5 rounded-2xl hover:border-white/10 transition-colors space-y-1.5">
                                    <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">{item.label}</p>
                                    <p className={`text-2xl font-mono font-bold ${item.color}`}>{item.value}</p>
                                    <p className="text-xs text-gray-400 font-mono">{item.sub}</p>
                                    <p className="text-xs text-gray-600 leading-relaxed">{item.note}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Interactive Security Demo ─────────────────────── */}
                    <div className="space-y-6 pt-4 border-t border-white/10">
                        <h2 className="text-xl sm:text-2xl font-bold border-b border-white/10 pb-6 flex items-center gap-2">
                            <Cpu className="w-6 h-6 text-red-400" />
                            Interactive Security Demo
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Step through the AES-256-GCM pipeline to see exactly how your message is transformed.
                        </p>
                        <InteractiveDemoSteps />
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
