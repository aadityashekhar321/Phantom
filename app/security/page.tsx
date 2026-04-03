'use client';

import { GlassCard } from '@/components/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import {
    ChevronDown, Lock, Key, Shield, FileDigit, ServerOff,
    Cpu, Users, Database, Briefcase, Github, CheckCircle,
} from 'lucide-react';
import { useT } from '@/components/LanguageProvider';

// ─── Shared animation helpers ────────────────────────────────────────────────

/** Viewport config — fires once when 10 % is visible */
const VP = { once: true, amount: 0.1 } as const;

/** Standard fade-up variant used by every section heading / container */
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay },
    }),
};

// ─── Interactive Demo ────────────────────────────────────────────────────────

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
            {/* Pill selector */}
            <div className="flex flex-wrap gap-2">
                {demoSteps.map((s, i) => (
                    <motion.button
                        key={i}
                        onClick={() => goToStep(i)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${i === activeStep
                            ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-100'
                            : i < activeStep
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                            }`}
                    >
                        {i < activeStep
                            ? <CheckCircle className="w-3 h-3" />
                            : <span className="w-3 h-3 rounded-full border border-current inline-flex items-center justify-center text-[9px] font-bold leading-none">{i + 1}</span>
                        }
                        <span className="hidden sm:inline">{s.title.split('. ')[1]}</span>
                    </motion.button>
                ))}
            </div>

            {/* Step detail card */}
            <div style={{ perspective: '1000px' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, x: animating ? -10 : 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2, zIndex: 10, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                        className={`bg-black/50 border ${step.bg.split(' ')[1]} rounded-2xl p-5 sm:p-6 space-y-4`}
                        style={{ transformStyle: 'preserve-3d' }}
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
            </div>

            {/* Prev / Next */}
            <div className="flex items-center justify-between pt-1">
                <motion.button
                    onClick={() => goToStep(Math.max(0, activeStep - 1))}
                    disabled={activeStep === 0}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="text-xs font-semibold text-gray-500 hover:text-white disabled:opacity-30 transition-colors px-3 py-1.5 border border-white/5 rounded-xl hover:border-white/20"
                >
                    ← Prev
                </motion.button>
                <span className="text-[11px] text-gray-600 font-mono">Step {activeStep + 1} / {demoSteps.length}</span>
                <motion.button
                    onClick={() => goToStep(Math.min(demoSteps.length - 1, activeStep + 1))}
                    disabled={activeStep === demoSteps.length - 1}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="text-xs font-semibold text-gray-500 hover:text-white disabled:opacity-30 transition-colors px-3 py-1.5 border border-white/5 rounded-xl hover:border-white/20"
                >
                    Next →
                </motion.button>
            </div>
        </div>
    );
}

// ─── FAQ data ────────────────────────────────────────────────────────────────

const faqs = [
    { question: "Can Phantom recover my password if I forget it?", answer: "No — by design. Phantom is a zero-knowledge, stateless client. There are no servers, no databases, and no password-reset mechanism. Your Secret Key is the only mathematical path to your ciphertext. If you lose it, the data remains permanently and irreversibly locked. This is not a limitation — it is the security guarantee." },
    { question: "Does Phantom track me or log my usage?", answer: "Never. Phantom uses zero analytics, zero cookies, zero IP logging, and zero telemetry of any kind. Once the static page loads into your browser, no further outbound network requests are made. The app has no backend to send data to — there is nothing to track because nothing is transmitted." },
    { question: "Are my files or messages uploaded to a server for encryption?", answer: "No. Every cryptographic operation — key derivation, encryption, decryption — runs entirely inside your browser's RAM using the native Web Crypto API. Your plaintext never crosses the network boundary. You can verify this yourself: open Phantom, disconnect from the internet, and use it normally. It is identical." },
    { question: "What makes AES-256-GCM better than other encryption modes?", answer: "AES-256-GCM is an Authenticated Encryption with Associated Data (AEAD) cipher. Unlike AES-CBC, it simultaneously encrypts and authenticates the ciphertext using a 128-bit GCM authentication tag. This means any single-bit tampering of the ciphertext — by an attacker or file corruption — is detected mathematically before decryption even begins. You get both confidentiality and integrity in one cryptographic operation." },
    { question: "Why does Phantom use 100,000 PBKDF2 iterations?", answer: "PBKDF2 forces each password-guess attempt to repeat the same 100,000 SHA-256 hash computations. A modern GPU that could try 10¹³ raw SHA-256 guesses per second is reduced to roughly 10⁸ effective guesses per second after PBKDF2. Combined with the 2²⁵⁶ AES key space, this makes brute-force attacks computationally infeasible even against nation-state adversaries with GPU clusters." },
    { question: "Why does my Steganography image fail to decode on other platforms?", answer: "Platforms like WhatsApp, Twitter/X, Discord, and iMessage aggressively re-compress and re-encode images to reduce file sizes. This permanently destroys the LSB (Least Significant Bit) pixel data where the hidden message is stored. Always share steganography carrier images as raw Files — not photos — using platforms that preserve binary data losslessly: Signal ('Send as File'), Telegram ('Send as File'), or direct email attachments." },
    { question: "What is Deniable Vault (Decoy Mode)?", answer: "Deniable Vault allows you to encode a harmless fake message alongside your real secret. If you are under physical duress and forced to reveal your password, you provide the 'Decoy Password', which decrypts the fake message while keeping the main secret mathematically hidden." },
    { question: "How does the Self-Destruct Timer work offline?", answer: "The timer operates entirely in your browser's RAM. It simply clears the decrypted output from the UI automatically after the selected duration, preventing someone from reading it if they physically access your device later." },
    { question: "Is my encrypted data safe if Phantom's servers go down?", answer: "Yes, completely. Phantom has no servers. The application is a static client-side website. Your encrypted output is a self-contained string or .phantom file you hold locally. Even if the Phantom website ceased to exist tomorrow, the Web Crypto API used to decrypt your data is built into every modern browser — permanently and natively. You can decrypt your data with any browser, forever." },
    { question: "What is the difference between the Vault and Steganography tools?", answer: "The Vault tool encrypts plaintext or files into opaque ciphertext — the output is unreadable and obviously protected. Steganography hides a message inside an innocent-looking carrier image at the pixel level, so that no one looking at the image can tell a secret is present. For maximum security, combine both: encrypt your message in the Vault, then hide the ciphertext inside an image using Steganography. An attacker would need to detect the hidden channel and then break AES-256-GCM." },
    { question: "How do I install Phantom as an offline app?", answer: "Phantom is a Progressive Web App (PWA). On iOS: open in Safari → tap 'Share' → 'Add to Home Screen'. On Android: open in Chrome → menu → 'Add to Home Screen'. On Desktop Chrome or Edge: click the install icon in the address bar. Once installed, Phantom works 100% offline — no internet connection is ever required for cryptographic operations." },
    { question: "What is a .phantom Vault file?", answer: "A .phantom file is a self-contained encrypted bundle produced by the Vault tool. It packages the ciphertext, IV (Initialization Vector), and salt metadata into a single portable file you can store on a USB drive, encrypted hard disk, or offline archive. To decrypt, drag the .phantom file back into the Vault and provide the original password. The file format is open and inspectable." },
    { question: "Is Phantom open source? Can I audit the code?", answer: "Yes. Phantom is fully open source on GitHub. You can read every line of cryptographic logic, verify that no network requests are made, inspect the key derivation parameters, and confirm the entire security model independently. Trust should never be assumed — it should be verified. The GitHub link is at the bottom of this page." },
];

// ─── Pipeline steps ──────────────────────────────────────────────────────────

const pipelineSteps = [
    { icon: FileDigit, label: 'Raw Data', sub: 'Text or Image', color: 'bg-white/5 border-white/10 text-gray-400', tooltip: 'The original unprotected data' },
    { icon: Key, label: 'PBKDF2', sub: '100,000 Iterations', color: 'bg-red-500/20 border-red-500/30 text-red-400', tooltip: 'Derives a master key via 100k hashes' },
    { icon: Shield, label: 'AES-256-GCM', sub: 'Military Grade', color: 'bg-rose-500/20 border-rose-500/30 text-rose-400', tooltip: 'Scrambles data with authenticated math' },
    { icon: Lock, label: 'Ciphertext', sub: 'Secure Payload', color: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400', tooltip: 'The fully locked, unreadable output' },
];

// ─── Section wrapper — scroll reveal ────────────────────────────────────────

function Section({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={fadeUp}
            custom={delay}
        >
            {children}
        </motion.div>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SecurityInfo() {
    const t = useT();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Count-up for 100,000 iterations
    const [iterCount, setIterCount] = useState(0);
    const iterRef = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                observer.disconnect();
                const target = 100000, duration = 1200, step = 16;
                const increment = Math.ceil(target / (duration / step));
                let current = 0;
                const timer = setInterval(() => {
                    current = Math.min(current + increment, target);
                    setIterCount(current);
                    if (current >= target) clearInterval(timer);
                }, step);
            }
        }, { threshold: 0.3 });
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
            {/* ── Hero ── */}
            <div className="text-center space-y-4 px-4">
                <div className="flex justify-center mb-6 relative w-36 h-36 mx-auto">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 blur-2xl rounded-[3rem] opacity-25"
                        animate={{ opacity: [0.15, 0.35, 0.15], scale: [0.88, 1.12, 0.88] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        animate={{ y: [-6, 6, -6] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        className="relative z-10 w-full h-full"
                    >
                        <Image src="/security.webp" alt="Phantom Security Illustration" fill className="rounded-3xl drop-shadow-[0_0_24px_rgba(248,113,113,0.3)] object-cover" priority />
                    </motion.div>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter text-red-400">{t.security.title}</h1>
                <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">{t.security.subtitle}</p>
            </div>

            <GlassCard className="max-w-3xl mx-auto px-5 py-8 sm:px-10 sm:py-12">
                <div className="flex flex-col gap-12 sm:gap-16">

                    {/* ── 1. Why Phantom? ── */}
                    <Section className="space-y-8 sm:space-y-10">
                        <h2 className="text-xl sm:text-2xl font-bold border-b border-white/10 pb-6 flex items-center gap-2">
                            <Shield className="w-6 h-6 text-indigo-400" />
                            Why Phantom?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Phantom Card — hover lift + glow */}
                            <motion.div
                                className="bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 space-y-6 cursor-default"
                                whileHover={{ y: -5, boxShadow: '0 20px 50px -12px rgba(99,102,241,0.25)', borderColor: 'rgba(99,102,241,0.45)' }}
                                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                            >
                                <h3 className="text-xl font-bold text-indigo-300 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-indigo-500" />
                                    Phantom Vault
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Metadata Stored', value: 'Absolutely Zero' },
                                        { label: 'User Identity', value: '100% Anonymous' },
                                        { label: 'Data Persistence', value: 'Volatile (In-Memory)' },
                                        { label: 'Steganography Support', value: 'Yes (LSB & QR)' },
                                    ].map((row, i, arr) => (
                                        <div key={row.label} className={`flex items-center justify-between ${i < arr.length - 1 ? 'border-b border-indigo-500/10 pb-3' : 'pt-1'}`}>
                                            <span className="text-sm text-gray-400">{row.label}</span>
                                            <span className="text-sm font-bold text-emerald-400">{row.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Mainstream Card — hover dim-lift */}
                            <motion.div
                                className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 opacity-80 cursor-default"
                                whileHover={{ y: -5, opacity: 1, borderColor: 'rgba(255,255,255,0.15)' }}
                                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                            >
                                <h3 className="text-xl font-bold text-gray-300 flex items-center gap-2">
                                    <Database className="w-5 h-5 text-gray-500" />
                                    Mainstream (Signal/WhatsApp)
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Metadata Stored', value: 'Logs & Timestamps' },
                                        { label: 'User Identity', value: 'Linked to Phone #' },
                                        { label: 'Data Persistence', value: 'Saved on Servers' },
                                        { label: 'Steganography Support', value: 'No' },
                                    ].map((row, i, arr) => (
                                        <div key={row.label} className={`flex items-center justify-between ${i < arr.length - 1 ? 'border-b border-white/5 pb-3' : 'pt-1'}`}>
                                            <span className="text-sm text-gray-500">{row.label}</span>
                                            <span className="text-sm font-bold text-red-400">{row.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </Section>

                    {/* ── 2. Technical Specifications ── */}
                    <Section delay={0.04} className="space-y-8 sm:space-y-10 border-t border-white/10 pt-4">
                        <h2 className="text-xl sm:text-2xl font-bold border-b border-white/10 pb-6 text-white">Technical Specifications</h2>
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
                    </Section>

                    {/* ── 3. Cryptographic Pipeline ── */}
                    <Section delay={0.04} className="space-y-8 sm:space-y-10">
                        <h2 className="text-xl sm:text-2xl font-bold border-b border-white/10 pb-6 flex items-center gap-2">
                            <Cpu className="w-6 h-6 text-red-400" />
                            The Cryptographic Pipeline
                        </h2>
                        <div className="bg-black/40 border border-white/5 p-5 sm:p-8 rounded-3xl">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-4">
                                {pipelineSteps.map((step, idx) => {
                                    const Icon = step.icon;
                                    return (
                                        <motion.div
                                            key={step.label}
                                            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-0"
                                            style={{ display: 'contents' }}
                                        >
                                            {/* Node */}
                                            <motion.div
                                                className="group flex flex-col items-center text-center space-y-2 w-full sm:w-auto relative"
                                                initial={{ opacity: 0, y: 16 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={VP}
                                                transition={{ duration: 0.4, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                                            >
                                                {/* Desktop tooltip */}
                                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 hidden sm:block opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50 pointer-events-none">
                                                    <div className="bg-black/90 border border-white/20 text-xs text-gray-300 px-3 py-1.5 rounded-lg whitespace-nowrap">
                                                        {step.tooltip}
                                                    </div>
                                                </div>
                                                <motion.div
                                                    className={`w-12 h-12 rounded-xl border flex items-center justify-center ${step.color}`}
                                                    whileHover={{ scale: 1.18, y: -3 }}
                                                    transition={{ type: 'spring', stiffness: 340, damping: 20 }}
                                                >
                                                    <Icon className="w-6 h-6" />
                                                </motion.div>
                                                <div className="text-xs font-bold text-white uppercase tracking-wider">{step.label}</div>
                                                <div className="text-[10px] text-gray-500">{step.sub}</div>
                                            </motion.div>
                                            {/* Arrow */}
                                            {idx < pipelineSteps.length - 1 && (
                                                <div className="hidden sm:flex relative items-center justify-center w-12 flex-shrink-0">
                                                    <motion.div
                                                        initial={{ scaleX: 0 }}
                                                        whileInView={{ scaleX: 1 }}
                                                        viewport={VP}
                                                        transition={{ duration: 0.35, delay: idx * 0.1 + 0.12 }}
                                                        className="w-full h-0.5 bg-red-500/20 absolute"
                                                        style={{ originX: 0 }}
                                                    />
                                                    <motion.div
                                                        animate={{ x: [0, 48] }}
                                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: idx * 0.5 }}
                                                        className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)] absolute left-0"
                                                    />
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                            <p className="text-center text-xs text-gray-600 mt-5 sm:hidden">Raw Data → PBKDF2 → AES-256-GCM → Ciphertext</p>
                        </div>
                    </Section>

                    {/* ── 4. Interactive Security Demo ── */}
                    <Section delay={0.04} className="space-y-6 pt-4 border-t border-white/10">
                        <h2 className="text-xl sm:text-2xl font-bold border-b border-white/10 pb-6 flex items-center gap-2">
                            <Cpu className="w-6 h-6 text-red-400" />
                            Interactive Security Demo
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Step through the AES-256-GCM pipeline to see exactly how your message is transformed.
                        </p>
                        <InteractiveDemoSteps />
                    </Section>

                    {/* ── 5. Verified by Math ── */}
                    <Section delay={0.04} className="space-y-6 pt-4 border-t border-white/10 mt-4">
                        <h2 className="text-xl sm:text-2xl font-bold border-b border-white/10 pb-6 flex items-center gap-2">
                            <Shield className="w-6 h-6 text-indigo-400" />
                            Verified by Math
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Security is not a claim — it is a provable property. Here is what the mathematics guarantees:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { label: 'Brute-force search space', value: '2²⁵⁶', sub: '≈ 1.16 × 10⁷⁷ possible keys', note: 'More than the number of atoms in the observable universe.', color: 'text-indigo-300', glow: 'rgba(99,102,241,0.25)' },
                                { label: 'GPU guesses per second', value: '~10¹³', sub: 'PBKDF2 reduces GPU throughput to ~10⁵', note: 'Each guess requires 100,000 hash iterations.', color: 'text-violet-300', glow: 'rgba(139,92,246,0.25)' },
                                { label: 'Time to brute-force', value: '≫ 10⁵⁴ years', sub: 'Universe age: 1.38 × 10¹⁰ years', note: 'Even with all the energy in the universe.', color: 'text-cyan-300', glow: 'rgba(34,211,238,0.25)' },
                                { label: 'Authentication guarantee', value: 'GCM Tag', sub: '128-bit authentication tag per message', note: 'Tampered ciphertext is detected before decryption.', color: 'text-emerald-300', glow: 'rgba(52,211,153,0.25)' },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-1.5 cursor-default"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={VP}
                                    variants={fadeUp}
                                    custom={i * 0.07}
                                    whileHover={{ y: -4, borderColor: item.glow.replace('0.25)', '0.5)'), boxShadow: `0 12px 32px -8px ${item.glow}` }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                                >
                                    <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">{item.label}</p>
                                    <p className={`text-2xl font-mono font-bold ${item.color}`}>{item.value}</p>
                                    <p className="text-xs text-gray-400 font-mono">{item.sub}</p>
                                    <p className="text-xs text-gray-600 leading-relaxed">{item.note}</p>
                                </motion.div>
                            ))}
                        </div>
                    </Section>

                    {/* ── 6. Privacy Threat Model ── */}
                    <Section delay={0.04} className="space-y-8 sm:space-y-10 pt-4">
                        <h2 className="text-xl sm:text-2xl font-bold border-b border-white/10 pb-6 flex items-center gap-2">
                            <Shield className="w-6 h-6 text-orange-400" />
                            Privacy Threat Model
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                            {/* Protects card */}
                            <motion.div
                                className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 space-y-4 shadow-inner shadow-emerald-500/10 cursor-default"
                                whileHover={{ y: -5, borderColor: 'rgba(52,211,153,0.45)', boxShadow: '0 20px 50px -12px rgba(52,211,153,0.18)' }}
                                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                            >
                                <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                                    What Phantom Protects
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { title: 'ISP / Network Snooping', sub: 'Traffic is encrypted locally. Network sees only random noise.' },
                                        { title: 'Cloud Storage Hacks', sub: 'Stolen Ciphertext means nothing without your Secret Key.' },
                                    ].map(item => (
                                        <motion.div
                                            key={item.title}
                                            className="bg-black/40 p-3 rounded-xl border border-white/5"
                                            whileHover={{ borderColor: 'rgba(52,211,153,0.2)', x: 3 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <p className="text-sm font-bold text-emerald-300">{item.title}</p>
                                            <p className="text-xs text-emerald-400/70 mt-1">{item.sub}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Cannot protect card */}
                            <motion.div
                                className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-6 space-y-4 shadow-inner shadow-orange-500/10 cursor-default"
                                whileHover={{ y: -5, borderColor: 'rgba(251,146,60,0.45)', boxShadow: '0 20px 50px -12px rgba(251,146,60,0.18)' }}
                                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                            >
                                <h3 className="text-lg font-bold text-orange-400 flex items-center gap-2">
                                    <ServerOff className="w-5 h-5 text-orange-500" />
                                    What It Cannot Protect
                                </h3>
                                <div className="space-y-3">
                                    <motion.div
                                        className="bg-black/40 p-3 rounded-xl border border-white/5"
                                        whileHover={{ borderColor: 'rgba(251,146,60,0.2)', x: 3 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <p className="text-sm font-bold text-orange-300 mb-1">Local OS Keyloggers</p>
                                        <span className="text-[10px] uppercase font-bold tracking-widest bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full inline-block mb-1">Hardware Level</span>
                                        <p className="text-xs text-orange-400/70">Browser software cannot stop OS-level keyloggers.</p>
                                    </motion.div>
                                    <motion.div
                                        className="bg-black/40 p-3 rounded-xl border border-white/5"
                                        whileHover={{ borderColor: 'rgba(251,146,60,0.2)', x: 3 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <p className="text-sm font-bold text-orange-300 mb-1">Physical Coercion</p>
                                        <span className="text-[10px] uppercase font-bold tracking-widest bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full inline-block mb-1">Mitigated by Decoy Mode</span>
                                        <p className="text-xs text-orange-400/70">Someone looking over your shoulder. Use Self-Destruct to minimize exposure window.</p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </Section>

                    {/* ── 7. Important Warnings ── */}
                    <Section delay={0.04} className="space-y-8 sm:space-y-10 border-t border-white/10 pt-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-red-300 border-b border-white/10 pb-6">Important Warnings</h2>
                        <motion.div
                            className="bg-red-500/10 border border-red-500/20 p-6 sm:p-10 rounded-3xl space-y-6"
                            whileHover={{ borderColor: 'rgba(239,68,68,0.4)', boxShadow: '0 0 0 4px rgba(239,68,68,0.06)' }}
                            transition={{ duration: 0.3 }}
                        >
                            <p className="text-red-200 text-base leading-relaxed">
                                <strong>1. Lost passwords cannot be recovered.</strong><br />
                                Phantom is zero-knowledge locally executing software. There is no backend password reset feature.
                            </p>
                            <p className="text-red-200 text-base leading-relaxed">
                                <strong>2. No browser storage.</strong><br />
                                Everything is stored temporarily in RAM. The keys and plaintexts are cleared when the session closes.
                            </p>
                        </motion.div>
                    </Section>

                    {/* ── 8. Zero-Knowledge FAQ ── */}
                    <Section delay={0.04} className="space-y-8 sm:space-y-10 pt-4 border-t border-white/10">
                        <h2 className="text-xl sm:text-2xl font-bold border-b border-white/10 pb-6 flex items-center gap-2">
                            <ServerOff className="w-6 h-6 text-gray-400" />
                            Zero-Knowledge FAQ
                        </h2>
                        <div className="space-y-3">
                            {faqs.map((faq, idx) => (
                                <motion.div
                                    key={idx}
                                    className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden"
                                    whileHover={{ borderColor: 'rgba(255,255,255,0.1)' }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full flex items-center justify-between p-5 text-left focus:outline-none active:bg-white/[0.04]"
                                    >
                                        <span className="font-semibold text-gray-200 pr-4">{faq.question}</span>
                                        <motion.span
                                            animate={{ rotate: openFaq === idx ? 180 : 0 }}
                                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                                            className="flex-shrink-0"
                                        >
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        </motion.span>
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {openFaq === idx && (
                                            <motion.div
                                                key="answer"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                                                className="overflow-hidden"
                                            >
                                                <p className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </Section>

                    {/* ── 9. Phantom Mission + Use Cases ── */}
                    <Section delay={0.05} className="space-y-8 sm:space-y-10 pt-4 border-t border-white/10">
                        {/* Mission badge */}
                        <div className="flex flex-col items-center text-center pb-4 pt-4">
                            <motion.div
                                className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20 flex flex-col items-center justify-center"
                                whileHover={{ scale: 1.1, rotate: 4, boxShadow: '0 0 0 8px rgba(99,102,241,0.15)' }}
                                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                            >
                                <span className="text-white font-bold text-xl leading-none">P</span>
                                <span className="text-[10px] font-bold opacity-60 text-white mt-1 uppercase tracking-widest">v2.4.0</span>
                            </motion.div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">The Phantom Mission</h2>
                            <p className="text-gray-300 text-lg font-medium leading-relaxed max-w-2xl">
                                We believe that total privacy shouldn&apos;t require a computer science degree.
                            </p>
                            <p className="text-gray-400 text-base leading-relaxed mt-4 max-w-2xl mx-auto">
                                Phantom was built to give anyone the ability to send messages that are mathematically impossible to intercept.
                                Privacy is a fundamental human right. We don&apos;t ask for data, don&apos;t show ads, and never see your messages.
                            </p>
                        </div>

                        {/* Use-case cards */}
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 border-b border-white/10 pb-6">Built For Absolute Privacy</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { icon: Users, iconBg: 'bg-indigo-500/20', iconText: 'text-indigo-400', glow: 'rgba(99,102,241,0.18)', border: 'rgba(99,102,241,0.35)', title: 'Journalists', desc: 'Protecting anonymous sources and transmitting sensitive data without digital footprints.' },
                                    { icon: Database, iconBg: 'bg-emerald-500/20', iconText: 'text-emerald-400', glow: 'rgba(52,211,153,0.15)', border: 'rgba(52,211,153,0.30)', title: 'Personal Archival', desc: 'Encrypting crypto seed phrases or private passwords offline before cloud storage.' },
                                    { icon: Briefcase, iconBg: 'bg-amber-500/20', iconText: 'text-amber-400', glow: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.30)', title: 'IP Protection', desc: 'Sharing proprietary code, trade secrets, or unreleased assets with business partners.' },
                                ].map(({ icon: Icon, iconBg, iconText, glow, border, title, desc }, i) => (
                                    <motion.div
                                        key={title}
                                        className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 space-y-2 cursor-default"
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={VP}
                                        variants={fadeUp}
                                        custom={i * 0.07}
                                        whileHover={{ y: -5, borderColor: border, boxShadow: `0 16px 40px -8px ${glow}` }}
                                        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                                    >
                                        <motion.div
                                            className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center ${iconText}`}
                                            whileHover={{ scale: 1.15, rotate: -6 }}
                                            transition={{ type: 'spring', stiffness: 360, damping: 20 }}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </motion.div>
                                        <h3 className="text-base font-bold text-white">{title}</h3>
                                        <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </Section>

                    {/* ── 10. GitHub CTA ── */}
                    <Section delay={0.04} className="pt-6 border-t border-white/10 text-center">
                        <motion.a
                            href="https://github.com/aadityashekhar321/Phantom"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-medium text-gray-300 relative overflow-hidden group"
                            whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.09)', borderColor: 'rgba(255,255,255,0.2)', color: '#ffffff', boxShadow: '0 0 20px rgba(255,255,255,0.1)' }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 340, damping: 22 }}
                        >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:animate-[shimmer_1.5s_infinite]" />
                            <Github className="w-5 h-5 relative z-10" /> <span className="relative z-10">View Open Source Engine on GitHub</span>
                        </motion.a>
                    </Section>

                </div>
            </GlassCard>
        </motion.div>
    );
}
