'use client';

import { GlassCard } from '@/components/GlassCard';
import { motion } from 'framer-motion';
import {
    AlertTriangle, Mail, Shield, Github, Clock,
    CheckCircle, Code, Users, Zap, Lock, Eye
} from 'lucide-react';

export default function SecurityPolicy() {
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
            title: 'Responsible Disclosure',
            icon: AlertTriangle,
            color: 'text-yellow-400',
            bg: 'bg-yellow-500/10 border-yellow-500/20',
            points: [
                'If you discover a security vulnerability in Phantom, please report it responsibly.',
                'Do NOT publicly disclose the vulnerability in GitHub issues, social media, or public forums.',
                'Instead, email security details to: aadityashekhar321@gmail.com with subject "SECURITY: [Phantom Vulnerability]"',
                'Include: vulnerability description, affected version(s), proof-of-concept if available, and your name/affiliation.',
                'We will acknowledge your report within 48 hours and provide an estimated timeline for patch deployment.',
                'We ask for a grace period of 90 days before public disclosure to allow for analysis, patch development, and user updates.',
            ],
        },
        {
            title: 'Cryptographic Standards',
            icon: Lock,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10 border-indigo-500/20',
            points: [
                'AES-256-GCM: Industry-standard authenticated encryption (NIST approved).',
                'PBKDF2-SHA256: 100,000 iterations for password-based key derivation. Slow-hash by design to resist brute-force.',
                'crypto.getRandomValues(): Browser-native cryptographically secure random number generation for salts and IVs.',
                'All cryptographic operations use the Web Crypto API (no external crypto libraries with supply-chain risk).',
                'No proprietary or non-standard cryptography is used. Phantom relies on proven, peer-reviewed algorithms.',
            ],
        },
        {
            title: 'Known Limitations',
            icon: Eye,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10 border-amber-500/20',
            points: [
                'LSB Steganography: Invisible mode requires uncompressed PNG images. JPEG compression destroys embedded data.',
                'QR Overlay Mode: Slower on large ciphertexts; scanning QR codes may fail in low light or with motion blur.',
                'Client-Side Only: If your device is compromised with malware, keyloggers, or screen recorders, encryption cannot protect against local threats.',
                'Password Strength: Weak passwords (< 12 characters, common patterns) are vulnerable to dictionary attacks despite PBKDF2 strengthening.',
                'Share Link Duration: Share links remain valid until expiration. If a link is leaked, the recipient can decrypt the message.',
                'Browser Security: Phantom depends on browser security. Older browser versions with outdated crypto APIs may be at risk.',
                'No Mobile App: Phantom runs only in web browsers. Desktop and mobile browsers have different security guarantees.',
            ],
        },
        {
            title: 'Security Audits',
            icon: Code,
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10 border-cyan-500/20',
            points: [
                'Phantom is open-source under the MIT License. The complete source code is available on GitHub for independent audits.',
                'We encourage security researchers, cryptographers, and developers to review the code.',
                'Third-party audits are welcome. Please disclose findings responsibly per the Responsible Disclosure section.',
                'Audit reports (with permission) may be published on this page to build community trust.',
                'We maintain a public GitHub repository where security-related PRs and issues are tracked transparently.',
            ],
        },
        {
            title: 'Browser & Platform Requirements',
            icon: Zap,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10 border-emerald-500/20',
            points: [
                'Phantom requires a modern browser with Web Crypto API support (Chrome 37+, Firefox 34+, Safari 11+, Edge 79+).',
                'Older browsers without WebCrypto are not supported and should not be used for encryption.',
                'Users should keep their browser updated to receive the latest security patches from their vendor.',
                'Mobile browsers (Safari iOS 11+, Chrome Mobile 37+) are fully supported with the same security guarantees.',
                'Phantom works as a Progressive Web App (PWA) and can be installed on iOS and Android for quicker access.',
            ],
        },
        {
            title: 'Dependency Security',
            icon: Users,
            color: 'text-violet-400',
            bg: 'bg-violet-500/10 border-violet-500/20',
            points: [
                'Phantom uses minimal production dependencies to reduce supply-chain risk.',
                'Key dependencies: Next.js (framework), Tailwind CSS (styling), Framer Motion (animations), lucide-react (icons).',
                'All dependencies are regularly updated and scanned for known vulnerabilities using npm audit.',
                'Critical dependencies are pinned to specific versions to prevent unexpected breaking changes.',
                'Development dependencies are separate and never bundled into production code.',
            ],
        },
        {
            title: 'Data Integrity & Authenticity',
            icon: CheckCircle,
            color: 'text-green-400',
            bg: 'bg-green-500/10 border-green-500/20',
            points: [
                'AES-256-GCM uses authenticated encryption. Any tampering with the ciphertext is mathematically detectable.',
                'If decryption fails, a GCM authentication tag mismatch is raised. Corrupted or modified ciphertexts cannot be decrypted.',
                'This ensures end-to-end integrity: if a message reaches the recipient without modification, it must be from the sender.',
                'No need for separate integrity checks (e.g., HMAC) — GCM provides both encryption and authentication in one operation.',
            ],
        },
        {
            title: 'Code Review & Best Practices',
            icon: Github,
            color: 'text-gray-300',
            bg: 'bg-white/5 border-white/10',
            points: [
                'All code changes go through pull request review before merging to main.',
                'Security-sensitive changes (crypto logic, data handling) receive stricter scrutiny.',
                'ESLint and TypeScript enforce code quality and catch common mistakes at compile time.',
                'No hardcoded secrets, API keys, or credentials are committed to the repository.',
                'Commit history is preserved for audit trails and accountability.',
            ],
        },
        {
            title: 'Incident Response',
            icon: Clock,
            color: 'text-red-400',
            bg: 'bg-red-500/10 border-red-500/20',
            points: [
                'If a critical security vulnerability is discovered, we will release a patch as quickly as possible.',
                'Users will be notified via the Changelog and security announcements.',
                'Previous versions will be marked as deprecated in version history.',
                'Patch deployment: Users must manually refresh the browser to receive the update (PWA cache busting).',
                'Since Phantom has no user database, we cannot forcibly push updates. Users must choose to upgrade.',
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
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter">Security Policy</h1>
                <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
                    Transparency, cryptographic standards, and responsible disclosure for Phantom.
                </p>
                <p className="text-sm text-gray-500 max-w-2xl mx-auto">Last updated: May 2026</p>
            </div>

            {/* Core Principles */}
            <motion.div
                custom={0}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={VP}
                className="max-w-3xl mx-auto"
            >
                <GlassCard className="px-6 sm:px-8 py-8 sm:py-12 border-t border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-transparent">
                    <div className="space-y-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-cyan-100 flex items-center gap-3">
                            <Shield className="w-8 h-8" />
                            Our Security Commitment
                        </h2>
                        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                            Phantom prioritizes cryptographic correctness, transparency, and responsible vulnerability disclosure. 
                            We use only peer-reviewed, NIST-approved cryptographic algorithms. We welcome security audits and publish 
                            known limitations to help users make informed decisions. We ask researchers to disclose vulnerabilities 
                            responsibly before public release.
                        </p>
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

            {/* Contact & Resources */}
            <motion.div
                custom={sections.length * 0.1}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={VP}
                className="max-w-3xl mx-auto space-y-6"
            >
                <GlassCard className="px-6 sm:px-8 py-8 sm:py-12 border-t border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-transparent">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <Mail className="w-8 h-8 text-indigo-400" />
                        Security Contact
                    </h2>
                    <div className="space-y-4 text-gray-300">
                        <p>
                            <strong className="text-indigo-100">For security vulnerabilities:</strong><br />
                            Email:{' '}
                            <a
                                href="mailto:aadityashekhar321@gmail.com?subject=SECURITY:%20[Phantom%20Vulnerability]"
                                className="text-indigo-400 hover:text-indigo-300 transition-colors font-mono"
                            >
                                aadityashekhar321@gmail.com
                            </a>
                        </p>
                        <p>
                            <strong className="text-indigo-100">Subject line format:</strong><br />
                            <span className="font-mono text-sm bg-white/5 px-3 py-1 rounded inline-block">
                                SECURITY: [Brief vulnerability title]
                            </span>
                        </p>
                        <p>
                            <strong className="text-indigo-100">Source code & issue tracking:</strong><br />
                            <a
                                href="https://github.com/aadityashekhar321/Phantom"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                github.com/aadityashekhar321/Phantom
                            </a>
                        </p>
                    </div>
                </GlassCard>

                <GlassCard className="px-6 sm:px-8 py-8 sm:py-12 border-t border-violet-500/20">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Cryptographic Details</h2>
                    <div className="space-y-4 text-gray-300 text-base sm:text-lg">
                        <div>
                            <p className="font-semibold text-violet-100 mb-1">Encryption Algorithm:</p>
                            <p className="text-gray-400">AES-256-GCM (Advanced Encryption Standard, 256-bit key, Galois/Counter Mode)</p>
                        </div>
                        <div>
                            <p className="font-semibold text-violet-100 mb-1">Key Derivation:</p>
                            <p className="text-gray-400">PBKDF2-SHA256 with 100,000 iterations (approved by NIST SP 800-132)</p>
                        </div>
                        <div>
                            <p className="font-semibold text-violet-100 mb-1">Random Number Generation:</p>
                            <p className="text-gray-400">crypto.getRandomValues() — cryptographically secure RNG from the browser</p>
                        </div>
                        <div>
                            <p className="font-semibold text-violet-100 mb-1">Salt Size:</p>
                            <p className="text-gray-400">16 bytes (128 bits)</p>
                        </div>
                        <div>
                            <p className="font-semibold text-violet-100 mb-1">Initialization Vector (IV) Size:</p>
                            <p className="text-gray-400">12 bytes (96 bits) — recommended for GCM mode</p>
                        </div>
                        <div>
                            <p className="font-semibold text-violet-100 mb-1">Authentication Tag Size:</p>
                            <p className="text-gray-400">128 bits (16 bytes) — ensures authenticated encryption</p>
                        </div>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Footer Navigation */}
            <motion.div
                custom={sections.length * 0.15}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={VP}
                className="text-center text-gray-400 text-sm max-w-3xl mx-auto"
            >
                <p>
                    For privacy details, see our{' '}
                    <a href="/privacy" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                        Privacy Policy
                    </a>
                    . For technical deep-dive, visit{' '}
                    <a href="/security" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                        Security Architecture
                    </a>
                    .
                </p>
            </motion.div>
        </motion.div>
    );
}
