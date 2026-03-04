'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, Tag, ArrowRight } from 'lucide-react';
import { useT } from '@/components/LanguageProvider';

const changelog = [
    {
        version: 'v2.7.0',
        date: '2026-03-04',
        tag: 'latest',
        changes: [
            { type: 'feat', text: 'QR Identity Card — added responsive 3D tilt interaction to the card preview that fluidly tracks mouse movement using Framer Motion springs' },
            { type: 'feat', text: 'QR Identity Card — added dynamic glossy glare overlay to the canvas that shifts relative to the mouse position for a physical card feel' },
            { type: 'feat', text: 'QR Identity Card — added active theme ambient drop-shadow glow to the 3D card wrapper' },
            { type: 'feat', text: 'QR Identity Card — Download PNG button now transforms into a checkmark icon to provide clear 2-second success feedback after clicking' },
        ],
    },
    {
        version: 'v2.6.0',
        date: '2026-03-04',
        tag: '',

        changes: [
            { type: 'feat', text: 'QR Identity Card — completely redesigned canvas card: double-ring avatar, radial spotlight, multi-ring decorative arcs, and "PHANTOM ENCRYPTED" accent pill badge' },
            { type: 'feat', text: 'QR card enlarged to 800×440 for higher resolution downloads; QR upgraded to error-correction level M for better scan reliability' },
            { type: 'feat', text: 'Theme system expanded from 5 to 7 presets (added Abyss Blue, Obsidian); each theme now propagates its accent color to modal header, preview border, focus rings, download button gradient, and swatch glow' },
            { type: 'feat', text: 'Animated theme swatches with Framer Motion layoutId dot; Prev/Next chevron buttons for keyboard-style theme cycling' },
            { type: 'feat', text: 'Active theme name animates in beside swatches on change' },
            { type: 'feat', text: 'Input fields: live character counters, @ prefix on Handle, themed focus-border highlight matching active theme accent' },
            { type: 'feat', text: 'Copy-to-Clipboard button using Clipboard API (image/png); shows animated checkmark on success' },
            { type: 'feat', text: 'Rendering spinner overlay appears while canvas is generating; prevents stale-frame flash' },
            { type: 'feat', text: 'Download button uses active theme gradient instead of static indigo' },
            { type: 'feat', text: 'Top header glow line adapts to the active theme accent color' },
        ],
    },
    {
        version: 'v2.5.0',
        date: '2026-03-04',
        tag: '',

        changes: [
            { type: 'feat', text: 'Architecture & Trust — all 10 sections now scroll-reveal with a reusable Section wrapper using Framer Motion whileInView' },
            { type: 'feat', text: 'Comparison cards (Phantom vs Signal/WhatsApp) lift and glow on hover with themed box-shadows' },
            { type: 'feat', text: 'Use-case cards (Journalists, Archival, IP) stagger-fade in on scroll; icons rotate + scale on hover' },
            { type: 'feat', text: 'Pipeline nodes pop in sequentially with a 100ms stagger; arrows scale in from origin; nodes lift + scale on hover' },
            { type: 'feat', text: 'Math stat cards (Brute-force, GPU, Time, GCM Tag) lift and brighten border on hover' },
            { type: 'feat', text: 'Threat Model cards lift with emerald/orange glow; inner threat rows slide right on hover' },
            { type: 'feat', text: 'FAQ chevron now animates via Framer Motion rotate instead of CSS class swap; FAQ rows highlight on hover' },
            { type: 'feat', text: 'GitHub CTA button spring-scales on hover and tap' },
            { type: 'feat', text: 'Demo step pills animate with spring scale on hover/tap' },
            { type: 'perf', text: 'All animations GPU-only (opacity, transform) — zero layout shifts, no repaints, glitch-free on all screen sizes' },
        ],
    },
    {
        version: 'v2.4.0',
        date: '2026-03-04',
        tag: '',

        changes: [
            { type: 'feat', text: 'How It Works — scroll-triggered staggered fade-up animations on all 3 step rows using Framer Motion whileInView' },
            { type: 'feat', text: 'Step icon circles now spring-animate on hover with a subtle scale + ring pulse effect' },
            { type: 'feat', text: 'Advanced Image Handling — Steganography and Full Encryption cards animate with lift + glow border + icon shake on hover' },
            { type: 'feat', text: 'Background Shield decoration on Image Handling card now slowly breathes (rotate + scale loop)' },
            { type: 'feat', text: 'Comparison table rows highlight with mode-tinted backgrounds on hover; mobile comparison cards scale on hover' },
            { type: 'perf', text: 'All animations use GPU-only properties (opacity, transform) — zero layout shifts, no repaints, glitch-free on all screen sizes' },
        ],
    },
    {
        version: 'v2.3.0',
        date: '2026-03-04',
        tag: '',

        changes: [
            { type: 'refactor', text: 'Architecture & Trust page — reordered all 10 sections into a logical Why → Mission → Use Cases → Technical Specs → Pipeline → Interactive Demo → Verified by Math → Warnings → Threat Model → FAQ flow' },
            { type: 'feat', text: 'Zero-Knowledge FAQ expanded from 7 to 11 entries with new questions: AES-256-GCM vs other modes, PBKDF2 iteration rationale, Vault vs Steganography comparison, and server-outage resilience' },
            { type: 'docs', text: 'FAQ answers rewritten for greater technical precision — including AEAD explanation, GPU throughput reduction, and LSB platform compatibility details' },
        ],
    },
    {
        version: 'v2.2.0',
        date: '2026-03-04',
        tag: '',
        changes: [
            { type: 'feat', text: 'Multi-Language Support (L10n) — full English and Hindi translations across all pages, components, and UI labels' },
            { type: 'feat', text: 'Language Switcher — added 🇺🇸 / 🇮🇳 language picker to desktop and mobile Navbar, persisted in sessionStorage' },
            { type: 'feat', text: 'Translated Navbar, Footer, Notes, Security, Changelog, and How It Works pages with native Hindi strings' },
        ],
    },

    {
        version: 'v2.1.0',
        date: '2026-03-04',
        tag: '',
        changes: [
            { type: 'feat', text: 'Encrypted QR Identity Cards — generate and download beautiful, shareable profile cards containing your hidden encrypted message' },
            { type: 'feat', text: 'Dynamic Ambient Backgrounds — immersive floating gradient orbs for default themes, and performance-optimized Matrix Rain canvas for the Matrix theme' },
            { type: 'feat', text: 'Offline-Ready Status Badge — real-time PWA connection monitoring badge in the bottom left corner' },
        ],
    },
    {
        version: 'v2.0.0',
        date: '2026-03-04',
        tag: null,
        changes: [
            { type: 'feat', text: 'Deniable Vault (Decoy Mode) — dual-payload AES encryption; revealing the decoy password shows a fake plaintext, protecting under coercion' },
            { type: 'feat', text: 'Self-Destruct Timer — settings gear in Navbar to toggle auto-clear with 30s/60s countdown; output is wiped immediately after the timer expires' },
            { type: 'feat', text: 'Live Entropy Bar — real-time bit-strength calculation displayed alongside the password strength meter' },
            { type: 'feat', text: 'Privacy Threat Model — responsive two-column cards: "What Phantom Protects" vs "What It Cannot Protect" on the Architecture & Trust page' },
            { type: 'feat', text: '"Why Phantom?" Comparison — side-by-side Phantom vs. Signal/WhatsApp feature comparison using responsive cards (no horizontal scroll)' },
            { type: 'fix', text: 'Fixed JSX nesting bug in output panel that caused the build to fail after the Decoy Mode countdown overlay was added' },
            { type: 'fix', text: 'Resolved all ESLint no-explicit-any and no-unused-vars errors in Navbar, SettingsProvider, crypto.ts, and cryptoWorkerClient.ts' },
        ],
    },
    {
        version: 'v1.4.0',
        date: '2026-03-01',
        tag: null,
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
