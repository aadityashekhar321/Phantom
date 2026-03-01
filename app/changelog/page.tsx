'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, Tag, ArrowRight } from 'lucide-react';

const changelog = [
    {
        version: 'v1.4.0',
        date: '2026-03-01',
        tag: 'latest',
        changes: [
            { type: 'feat', text: 'Password generator — instant cryptographically random password creation' },
            { type: 'feat', text: 'Session history panel — browse and restore recent encrypt/decrypt operations' },
            { type: 'feat', text: 'Word-wrap toggle in the output panel for long ciphertext' },
            { type: 'feat', text: 'Batch encrypt — select multiple files and bundle into one .phantom archive' },
            { type: 'feat', text: 'Share expiry links — time-bound secure link sharing' },
            { type: 'feat', text: 'Text diff on decode — highlights changes between consecutive decryptions' },
            { type: 'feat', text: 'Drag-to-reorder output action buttons' },
            { type: 'feat', text: 'Theme switcher — 3 color themes (Phantom, Crimson, Matrix)' },
            { type: 'feat', text: 'Secure Notes Pad — in-session encrypted notepad' },
            { type: 'feat', text: 'Count-up animation for 100,000 PBKDF2 iterations on Architecture page' },
            { type: 'feat', text: 'Interactive Security Demo on Architecture & Trust page' },
            { type: 'feat', text: '"Verified by Math" section with entropy calculations' },
            { type: 'docs', text: 'Complete README.md overhaul with security model, project structure, and contributing guide' },
            { type: 'perf', text: 'Removed infinite hero animations for smoother mobile performance' },
        ],
    },
    {
        version: 'v1.3.0',
        date: '2026-02-27',
        tag: null,
        changes: [
            { type: 'feat', text: 'Architecture & Trust — integrated FAQ accordion and Mission statement (formerly separate About page)' },
            { type: 'feat', text: 'Site footer with brand, navigation, security promises, and GitHub link' },
            { type: 'feat', text: 'Show-password toggle in the Secret Key input' },
            { type: 'feat', text: 'Dynamic output box height using CSS clamp() for TV/large screens' },
            { type: 'fix', text: 'Panic button moved higher on mobile to avoid content overlap' },
            { type: 'fix', text: 'GitHub badge link corrected to the actual repository' },
            { type: 'perf', text: 'Removed mobile-lagging animations on Architecture & Trust hero section' },
        ],
    },
    {
        version: 'v1.2.0',
        date: '2026-02-26',
        tag: null,
        changes: [
            { type: 'feat', text: '.phantom Vault file export and drag-and-drop restore' },
            { type: 'feat', text: 'Live QR code scanner using getUserMedia and jsQR' },
            { type: 'feat', text: 'Panic Wipe — one-click emergency memory clear with red flash overlay' },
            { type: 'feat', text: 'URL hash deep linking — load encrypted payloads directly from URLs' },
            { type: 'feat', text: 'Cryptographic telemetry stats bar (time, algorithm, derivation)' },
            { type: 'feat', text: 'PWA support — installable with offline service worker and manifest' },
            { type: 'feat', text: 'Matrix sequence reveal animation on decrypted output' },
            { type: 'feat', text: 'Password strength indicator bar' },
        ],
    },
    {
        version: 'v1.1.0',
        date: '2026-02-25',
        tag: null,
        changes: [
            { type: 'feat', text: 'Dual Image Encryption Engine: Steganography mode (LSB pixel injection) and Full Encryption mode' },
            { type: 'feat', text: 'Supported formats marquee (animated payload type strip)' },
            { type: 'feat', text: 'Trust badges (Local Process, AES-256-GCM, Open-Source) in the input form' },
            { type: 'feat', text: 'Magnetic hover effect button component' },
            { type: 'refactor', text: 'Merged "How It Works" and "About" into the home page and Security page respectively' },
        ],
    },
    {
        version: 'v1.0.0',
        date: '2026-02-24',
        tag: 'initial',
        changes: [
            { type: 'feat', text: 'Core AES-256-GCM encryption engine via Web Crypto API' },
            { type: 'feat', text: 'PBKDF2 key derivation with SHA-256 and 100,000 iterations' },
            { type: 'feat', text: 'Glassmorphism UI with Framer Motion animations' },
            { type: 'feat', text: 'QR code generation for encrypted output' },
            { type: 'feat', text: 'Copy to clipboard, TXT download, and secure link sharing' },
            { type: 'feat', text: 'Mobile-responsive layout with dark theme' },
        ],
    },
];

const tagColors: Record<string, string> = {
    'feat': 'text-indigo-300 bg-indigo-500/10 border border-indigo-500/20',
    'fix': 'text-yellow-300 bg-yellow-500/10 border border-yellow-500/20',
    'perf': 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/20',
    'docs': 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/20',
    'refactor': 'text-violet-300 bg-violet-500/10 border border-violet-500/20',
};

export default function ChangelogPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl mx-auto pt-8 pb-24 px-4"
        >
            {/* Header */}
            <div className="text-center mb-14">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full mb-5">
                    <Clock className="w-3.5 h-3.5" />
                    Release Notes
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">Changelog</h1>
                <p className="text-gray-400 text-base sm:text-lg max-w-lg mx-auto">
                    A full record of everything that has been built, fixed, and improved in Phantom.
                </p>
            </div>

            {/* Timeline */}
            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-white/10 to-transparent ml-3 sm:ml-4 hidden sm:block" />

                <div className="space-y-12">
                    {changelog.map((release, idx) => (
                        <motion.div
                            key={release.version}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                            className="sm:pl-10 relative"
                        >
                            {/* Version dot */}
                            <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-[#09090b] border border-indigo-500/40 flex items-center justify-center text-indigo-400 hidden sm:flex">
                                <div className="w-2 h-2 rounded-full bg-indigo-400" />
                            </div>

                            {/* Version header */}
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <h2 className="text-xl font-bold text-white font-mono">{release.version}</h2>
                                {release.tag && (
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${release.tag === 'latest' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/5 text-gray-500 border border-white/10'}`}>
                                        {release.tag}
                                    </span>
                                )}
                                <span className="text-sm text-gray-500 flex items-center gap-1.5 font-mono">
                                    <Tag className="w-3 h-3" />{release.date}
                                </span>
                            </div>

                            {/* Changes */}
                            <div className="space-y-2">
                                {release.changes.map((change, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded flex-shrink-0 mt-0.5 ${tagColors[change.type] || 'text-gray-400 bg-white/5'}`}>
                                            {change.type}
                                        </span>
                                        <p className="text-gray-300 text-sm leading-relaxed">{change.text}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="mt-16 text-center">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-5 py-2.5 rounded-full transition-all"
                >
                    Open the Vault
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </motion.div>
    );
}
