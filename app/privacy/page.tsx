'use client';

import { GlassCard } from '@/components/GlassCard';
import { motion } from 'framer-motion';
import { Shield, Lock, Database, Zap, Server, Eye, Trash2, MapPin } from 'lucide-react';

export default function Privacy() {
    const fadeUp = {
        hidden: { opacity: 0, y: 24 },
        visible: (delay: number = 0) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay },
        }),
    };

    const VP = { once: true, amount: 0.1 } as const;

    const sections = [
        {
            title: 'Zero Servers, Zero Telemetry',
            icon: Server,
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10 border-cyan-500/20',
            points: [
                'Phantom runs entirely in your browser. There are no backend servers storing, logging, or accessing your data.',
                'We collect ZERO telemetry, analytics, or usage metrics. No pixels fired, no requests logged, no profiles built.',
                'All encryption and decryption happens on your device using your browser\'s Web Crypto API. Your password never leaves your computer.',
                'When you close the tab, all data (messages, passwords, settings) vanishes from memory. Permanently.',
            ],
        },
        {
            title: 'What We Store Locally',
            icon: Database,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10 border-amber-500/20',
            points: [
                'Phantom only stores UI preferences in your browser\'s sessionStorage:',
                '• Theme (light/dark mode)',
                '• Language preference (English/Hindi)',
                '• Self-Destruct timer default setting',
                'These preferences expire when you close the tab. They are NEVER transmitted to any server.',
                'Your messages, passwords, and ciphertexts are stored only in active memory and never persisted.',
            ],
        },
        {
            title: 'Ciphertext and Passwords',
            icon: Lock,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10 border-indigo-500/20',
            points: [
                'Your encrypted messages and passwords are secured with AES-256-GCM (NIST-standard authenticated encryption).',
                'Passwords are strengthened via PBKDF2-SHA256 with 100,000 iterations, making brute-force attacks computationally infeasible.',
                'Even if a ciphertext is intercepted or shared, it cannot be decrypted without the correct password.',
                'We cannot access, recover, or reset your passwords. By design. That\'s the entire point.',
            ],
        },
        {
            title: 'Share Links & QR Codes',
            icon: Zap,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10 border-emerald-500/20',
            points: [
                'When you generate a share link, the ciphertext is embedded in the URL fragment (#). The fragment never reaches our server.',
                'QR codes are generated entirely in your browser and remain on your screen. We never see them.',
                'Share links can only be decrypted by recipients who have the password. Even we cannot decrypt them.',
                'Share links automatically expire after 30 days or when self-destruct activates (your choice).',
            ],
        },
        {
            title: 'Service Worker & Offline Mode',
            icon: Shield,
            color: 'text-violet-400',
            bg: 'bg-violet-500/10 border-violet-500/20',
            points: [
                'Phantom is a Progressive Web App (PWA) that caches the UI for offline use.',
                'The Service Worker caches only UI assets (HTML, CSS, JavaScript). It does NOT cache any of your encrypted data or passwords.',
                'You can use Phantom offline to decrypt messages previously shared with you.',
                'Cache is scoped to Phantom\'s domain only and respects your browser\'s cache policies.',
            ],
        },
        {
            title: 'No Tracking or Cookies',
            icon: Eye,
            color: 'text-pink-400',
            bg: 'bg-pink-500/10 border-pink-500/20',
            points: [
                'Phantom uses ZERO cookies (not even session cookies).',
                'We do not use any third-party analytics, ad networks, or tracking libraries.',
                'We do not use localStorage to track sessions (only sessionStorage for transient UI preferences).',
                'We do not have any account or login system. Every session is completely anonymous and isolated.',
            ],
        },
        {
            title: 'Data Deletion & User Rights',
            icon: Trash2,
            color: 'text-red-400',
            bg: 'bg-red-500/10 border-red-500/20',
            points: [
                'To delete your data: Close the tab or press the "Panic Wipe" button.',
                'Since there are no servers or accounts, there is nothing to delete remotely.',
                'Ciphertexts you\'ve shared remain your responsibility. Once a share link is created, it persists until auto-expiration.',
                'You have inherent "right to erasure" — all data self-destructs on tab close by design.',
            ],
        },
        {
            title: 'GDPR & CCPA Compliance',
            icon: MapPin,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10 border-blue-500/20',
            points: [
                'We do not collect or process personal data, so GDPR and CCPA obligations are minimized.',
                'No IP addresses are logged. No geographic profiling occurs.',
                'No data retention policies are needed — data expires immediately upon tab close.',
                'Since Phantom has no backend and no accounts, data portability and erasure are automatic.',
            ],
        },
        {
            title: 'Amendments to This Policy',
            icon: Shield,
            color: 'text-gray-400',
            bg: 'bg-white/5 border-white/10',
            points: [
                'This privacy policy may be updated if Phantom\'s architecture changes significantly.',
                'Material changes will be documented in the Changelog with version numbers.',
                'Continued use of Phantom after amendments constitutes acceptance of the updated policy.',
            ],
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12 sm:space-y-16"
        >
            {/* Header */}
            <div className="text-center space-y-4 px-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter">Privacy Policy</h1>
                <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
                    Complete transparency about how Phantom protects your data. Spoiler: we can&apos;t see any of it.
                </p>
                <p className="text-sm text-gray-500 max-w-2xl mx-auto">Last updated: May 2026</p>
            </div>

            {/* Core Promise */}
            <motion.div
                custom={0}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={VP}
                className="max-w-3xl mx-auto"
            >
                <GlassCard className="px-6 sm:px-8 py-8 sm:py-12 border-t border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-emerald-400" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-emerald-100 mb-3">The Core Guarantee</h2>
                            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                                <strong>No servers. No telemetry. No network requests.</strong> Phantom is client-side only. 
                                Your ciphertexts, passwords, and personal messages never touch our infrastructure because we have none. 
                                The application runs entirely on your device, in your browser. This isn&apos;t a marketing claim — it&apos;s the only way to guarantee true privacy.
                            </p>
                        </div>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Policy Sections */}
            <div className="space-y-6">
                {sections.map((section, i) => {
                    const Icon = section.icon;
                    return (
                        <motion.div
                            key={i}
                            custom={i * 0.1}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={VP}
                        >
                            <GlassCard className={`px-6 sm:px-8 py-8 sm:py-10 border-t ${section.bg}`}>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="flex-shrink-0">
                                        <Icon className={`w-8 h-8 ${section.color}`} />
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-white">{section.title}</h2>
                                </div>
                                <ul className="space-y-3 text-gray-300">
                                    {section.points.map((point, j) => (
                                        <li key={j} className="flex gap-3 text-base sm:text-lg leading-relaxed">
                                            <span className={`flex-shrink-0 w-6 h-6 rounded-full ${section.bg} flex items-center justify-center mt-1`}>
                                                <span className={`w-2 h-2 rounded-full ${section.color.replace('text-', 'bg-')}`}></span>
                                            </span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </GlassCard>
                        </motion.div>
                    );
                })}
            </div>

            {/* FAQ-style Section */}
            <motion.div
                custom={sections.length * 0.1}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={VP}
                className="max-w-3xl mx-auto"
            >
                <GlassCard className="px-6 sm:px-8 py-8 sm:py-12 border-t border-white/10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">Common Questions</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-indigo-100 mb-2">Can Phantom recover a lost password?</h3>
                            <p className="text-gray-300">No. By design, we cannot access or reset passwords. That&apos;s the entire premise: if we can&apos;t access it, neither can hackers. Lose your password, lose the data. This is intentional.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-indigo-100 mb-2">Is my data backed up anywhere?</h3>
                            <p className="text-gray-300">No. Phantom does not back up any of your messages or ciphertexts to cloud storage or external servers. It&apos;s your responsibility to save important encrypted messages locally.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-indigo-100 mb-2">How do you handle IP addresses or browser logs?</h3>
                            <p className="text-gray-300">Phantom does not log IP addresses, User-Agent strings, or any identifying information. If you access Phantom via a server (e.g., Vercel), their infrastructure may log requests per standard server practices, but Phantom itself collects nothing.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-indigo-100 mb-2">Can I request my data?</h3>
                            <p className="text-gray-300">There is no data to request. We don&apos;t store any user profiles, session histories, or analytics. Each session starts completely fresh.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-indigo-100 mb-2">What if you are served a government request or subpoena?</h3>
                            <p className="text-gray-300">We have no data to hand over. There are no user accounts, no logs, and no ciphertexts stored on our infrastructure. A subpoena would return nothing.</p>
                        </div>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Footer Note */}
            <motion.div
                custom={sections.length * 0.15}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={VP}
                className="text-center text-gray-400 text-sm max-w-3xl mx-auto"
            >
                <p>
                    For questions or concerns about this Privacy Policy, review our{' '}
                    <a href="/security-policy" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                        Security Policy
                    </a>{' '}
                    or visit our{' '}
                    <a href="/security" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                        Security Architecture
                    </a>{' '}
                    page for technical details.
                </p>
            </motion.div>
        </motion.div>
    );
}
