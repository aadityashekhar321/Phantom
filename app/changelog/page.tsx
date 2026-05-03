'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, Tag, ArrowRight } from 'lucide-react';
import { useT } from '@/components/LanguageProvider';

const changelog = [
    {
        version: 'v2.6.0',
        date: '2026-05-03',
        tag: 'latest',
        changes: [
            { type: 'feat', text: 'Server-Backed Share Link Revocation — added persistent share-link management with register, revoke, and status endpoints so expired links can be invalidated server-side' },
            { type: 'feat', text: 'Encrypted Attachments Vault — introduced batch file encryption with bundled .phantom archive export plus unlock-and-restore flow for individual files' },
            { type: 'feat', text: 'Reduced Motion Accessibility — expanded prefers-reduced-motion support across animated components for a safer, calmer experience' },
            { type: 'refactor', text: 'Share Vault UI — consolidated revocation controls into a cleaner single-panel layout' },
            { type: 'fix', text: 'Share Link Validation — now checks link status before payload loading so revoked or expired links are rejected immediately' },
            { type: 'fix', text: 'Archive Restore Flow — fixed .phantom restore so bundled files unlock and download correctly' },
        ],
    },
    {
        version: 'v2.5.0',
        date: '2026-05-01',
        tag: '',
        changes: [
            { type: 'fix', text: 'Removed the analytics dependency so the app matches its zero-telemetry and no-network claims' },
            { type: 'fix', text: 'Fixed locale hydration so stored language preferences update the document language consistently' },
            { type: 'fix', text: 'Restored a browser-safe rounded-rectangle helper for QR steganography rendering' },
            { type: 'fix', text: 'Reworked password generation to avoid modulo bias in both Vault and Notes generators' },
            { type: 'fix', text: 'Added a share-link size guard to prevent brittle oversized URL hashes' },
        ],
    },
    {
        version: 'v2.4.0',
        date: '2026-03-04',
        tag: '',
        changes: [
            { type: 'feat', text: 'Immersive Identity Cards — upgraded card previews with 3D physical-tilt physics, dynamic ambient shadows, and mouse-tracking glossy glare overlays' },
            { type: 'feat', text: 'QR Branding & Verification — embedded the Phantom "P" logo natively into the QR matrix and added an auto-generated "ISSUED: YYYY-MM-DD" stamp' },
            { type: 'feat', text: 'UI Modernization — replaced static "How It Works" and "Image Handling" sections with interactive, glossy 3D components' },
            { type: 'feat', text: 'Secure Notes Overhaul — refined the sidebar with fluid slide-in layouts and a vibrant spring-bounce radial animation during locking' },
            { type: 'fix', text: 'Improved mobile scroll behavior for short viewports and ensured PWA Service Worker payloads are correctly deployed for total offline support' },
        ],
    },
    {
        version: 'v2.3.0',
        date: '2026-03-04',
        tag: '',
        changes: [
            { type: 'feat', text: 'Identity Card Redesign — completely revamped canvas featuring a double-ring avatar, radial spotlight, and a "PHANTOM ENCRYPTED" pill badge' },
            { type: 'feat', text: 'High-Res Output — increased card rendering to 800×440 with upgraded Error-Correction Level M for flawless scanning' },
            { type: 'feat', text: 'Extended Theme Engine — added 4 new presets (now 7 total), propagating accent colors to modal headers, borders, input rings, and buttons' },
            { type: 'feat', text: 'Input Enhancements — added live character counters, dynamic "@" prefix anchors, and themed focus-highlights' },
            { type: 'feat', text: 'Clipboard Integration — hooked directly into the native Clipboard API for one-click image transfers with animated success feedback' },
        ],
    },
    {
        version: 'v2.2.0',
        date: '2026-03-04',
        tag: '',
        changes: [
            { type: 'feat', text: 'Scroll-Reveal Engine — applied a unified Framer Motion whileInView wrapper across the entirely of the Architecture & Trust page' },
            { type: 'feat', text: 'Interactive Hover States — added themed box-shadows, z-axis lifts, and dynamic glows to all comparison, use-case, and threat model cards' },
            { type: 'feat', text: 'Pipeline Visualization — cryptographic steps now load sequentially with a 100ms stagger, connecting arrows scale dynamically from their origin' },
            { type: 'perf', text: 'Hardware Acceleration — engineered all visual transitions exclusively through GPU properties (opacity, transform) to guarantee zero layout shifts' },
        ],
    },
    {
        version: 'v2.1.0',
        date: '2026-03-04',
        tag: '',
        changes: [
            { type: 'refactor', text: 'Architecture & Trust page — restructured into a logical Why → Mission → Specs → Pipeline → Demo → Threat Model → FAQ flow' },
            { type: 'feat', text: 'Zero-Knowledge FAQ — substantially expanded with explicit technical explanations on AEAD, GPU hashing throughput, and PWA logic' },
            { type: 'feat', text: 'Instructional Flow Motion — added scroll-triggered staggered fade-up patterns and spring-scale hover effects to UI navigation nodes' },
            { type: 'feat', text: 'Image Handling Upgrades — Steganography and Full Encryption panels now react with border glows, breathing shields, and lift physics' },
        ],
    },
    {
        version: 'v2.0.0',
        date: '2026-03-04',
        tag: '',
        changes: [
            { type: 'feat', text: 'Multi-Language Support (L10n) — introduced a full language switching architecture across all pages with complete English and Hindi translations' },
            { type: 'feat', text: 'Deniable Vault (Decoy Mode) — dual-payload AES encryption allowing users to reveal a fake plaintext to an adversary under coercion' },
            { type: 'feat', text: 'Encrypted Identity Cards — generate, preview, and download custom visual profile cards that contain hidden ciphertext payloads' },
            { type: 'feat', text: 'Self-Destruct Protocol — a toggleable auto-clear countdown (30s/60s) prioritizing physical device-level security' },
            { type: 'feat', text: 'Dynamic Ambient Environments — unlocked floating gradient orbs and a performance-optimized Matrix Rain canvas for specific themes' },
            { type: 'feat', text: 'Live Telemetry — added a real-time cryptographic bit-strength entropy calculation and an offline-ready PWA status badge' },
        ],
    },
    {
        version: 'v1.2.0',
        date: '2026-03-01',
        tag: '',
        changes: [
            { type: 'feat', text: 'Secure Notes Pad — in-session encrypted notepad integrated directly into the workspace layout' },
            { type: 'feat', text: 'Batch Cryptography — select multiple files and bundle them cleanly into a single .phantom encrypted archive' },
            { type: 'feat', text: 'Session History & Diffing — browse recent cryptographic operations, instantly restore them, and view real-time text diffs' },
            { type: 'feat', text: 'Cryptographic Tooling — instant cryptographically secure password generation and shareable time-bound expiry links' },
            { type: 'feat', text: 'Interface Flexibility — added word-wrap toggles, drag-to-reorder output action buttons, and a global theme switcher' },
        ],
    },
    {
        version: 'v1.1.0',
        date: '2026-02-27',
        tag: '',
        changes: [
            { type: 'feat', text: '.phantom Vault Files — native file export format allowing offline archiving and drag-and-drop restoration' },
            { type: 'feat', text: 'Live Optics — integrated the device camera to scan and parse encrypted QR payloads directly inside the browser' },
            { type: 'feat', text: 'Emergency Protocols — inserted a Panic Wipe sequence designed for immediate one-click memory erasure' },
            { type: 'feat', text: 'URL Intelligence — hash-fragment deep linking capability designed to load payloads purely client-side without logging' },
            { type: 'feat', text: 'PWA Integration — deployed offline service workers and a manifest permitting Phantom to operate completely without internet' },
            { type: 'feat', text: 'Documentation & UI Polish — established the Architecture & Trust foundation, updated password toggles, and added interactive visual matrix outputs' },
        ],
    },
    {
        version: 'v1.0.0',
        date: '2026-02-25',
        tag: 'initial',
        changes: [
            { type: 'feat', text: 'Core Foundation — AES-256-GCM encryption architecture powered exclusively using the native Web Crypto API' },
            { type: 'feat', text: 'Steganography Engine — LSB (Least Significant Bit) pixel injection for hiding secure payloads invisibly inside generic carrier images' },
            { type: 'feat', text: 'Key Derivation — PBKDF2 with SHA-256 running 100,000 algorithmic strength iterations per operation' },
            { type: 'feat', text: 'Data Portability — offline operations, QR code payload generation, standard TXT downloads, and seamless copy-to-clipboard functionality' },
            { type: 'feat', text: 'Premium Styling — responsive Glassmorphism design system integrated with smooth Framer Motion kinematics' },
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
    const t = useT();
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
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">{t.changelog.title}</h1>
                <p className="text-gray-400 text-base sm:text-lg max-w-lg mx-auto">
                    {t.changelog.subtitle}
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
                    {t.nav.vault}
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </motion.div>
    );
}
