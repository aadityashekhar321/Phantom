'use client';

import { PolicyPage, type PolicySection } from '@/components/PolicyPage';
import { AlertTriangle, CheckCircle, Clock, Eye, Github, Lock, Mail, Shield, Zap } from 'lucide-react';

const sections: PolicySection[] = [
    {
        title: 'Responsible Disclosure',
        icon: AlertTriangle,
        accent: 'bg-gradient-to-br from-yellow-500 to-orange-500',
        tone: 'border-yellow-500/20',
        points: [
            'If you find a security issue, report it privately instead of opening a public issue or posting it on social media.',
            'Email aadityashekhar321@gmail.com with a concise description, reproduction steps, impact, and version details.',
            'We aim to acknowledge reports quickly and coordinate a fix before public disclosure whenever possible.',
        ],
    },
    {
        title: 'Cryptographic Standards',
        icon: Lock,
        accent: 'bg-gradient-to-br from-indigo-500 to-violet-500',
        tone: 'border-indigo-500/20',
        points: [
            'Phantom uses AES-256-GCM for authenticated encryption and PBKDF2-SHA256 with 100,000 iterations for key derivation.',
            'Salts and IVs are produced with crypto.getRandomValues(), the browser’s cryptographically secure random source.',
            'The implementation stays inside the Web Crypto API to avoid unnecessary crypto dependencies.',
        ],
    },
    {
        title: 'Known Limits and Threat Model',
        icon: Eye,
        accent: 'bg-gradient-to-br from-amber-500 to-yellow-500',
        tone: 'border-amber-500/20',
        points: [
            'Local malware, screen recording, or keylogging can still compromise data on the device itself.',
            'LSB steganography only survives lossless image handling; re-compression can destroy hidden payloads.',
            'Weak passwords reduce the effectiveness of even a strong crypto stack, so password quality still matters.',
        ],
    },
    {
        title: 'Data Integrity',
        icon: CheckCircle,
        accent: 'bg-gradient-to-br from-emerald-500 to-teal-500',
        tone: 'border-emerald-500/20',
        points: [
            'AES-GCM authenticates ciphertext as well as encrypting it, so tampering is detected during decryption.',
            'If the payload was altered or corrupted, Phantom should fail closed rather than display unsafe output.',
            'Share links are only as secure as the password used to protect them.',
        ],
    },
    {
        title: 'Auditability',
        icon: Github,
        accent: 'bg-gradient-to-br from-slate-500 to-slate-700',
        tone: 'border-white/10',
        points: [
            'The codebase is open source, so the crypto flow and UI behavior can be reviewed independently.',
            'Security-sensitive changes should be treated as review-heavy and regression-tested carefully.',
            'We prefer transparent fixes over hidden mitigations so trust can be verified in the repository history.',
        ],
    },
    {
        title: 'Browser Requirements',
        icon: Zap,
        accent: 'bg-gradient-to-br from-cyan-500 to-blue-500',
        tone: 'border-cyan-500/20',
        points: [
            'Phantom expects a modern browser with Web Crypto API support and current security patches from the vendor.',
            'Outdated browsers or restricted webviews may break encryption, file handling, or offline behavior.',
            'Users should keep their browser updated and avoid installing untrusted extensions on sensitive machines.',
        ],
    },
    {
        title: 'Incident Response',
        icon: Clock,
        accent: 'bg-gradient-to-br from-red-500 to-orange-500',
        tone: 'border-red-500/20',
        points: [
            'Critical issues should be patched quickly, then documented through the Changelog and repository history.',
            'Because Phantom has no backend user database, users receive fixes by refreshing to the updated build.',
            'If a vulnerability affects message confidentiality, the public disclosure window should stay conservative.',
        ],
    },
    {
        title: 'Contact and Follow-up',
        icon: Mail,
        accent: 'bg-gradient-to-br from-fuchsia-500 to-pink-500',
        tone: 'border-pink-500/20',
        points: [
            'Security reports should be private, concrete, and reproducible wherever possible.',
            'Please include the affected flow, screenshot or proof of concept, and the browser/platform you used.',
            'If you want to discuss broader architecture choices, the Security page remains the best public overview.',
        ],
    },
];

export default function SecurityPolicy() {
    return (
        <PolicyPage
            eyebrow="Security Policy"
            title="Phantom’s security policy focuses on disclosure, verification, and limits."
            description="The goal is to make the threat model explicit: what Phantom protects, where the boundaries are, and how to report problems responsibly."
            lastUpdated="May 2026"
            heroAccent="from-indigo-500 via-transparent to-cyan-500"
            heroBadge="Disclosure and crypto policy"
            heroNote="Open-source and audit-friendly"
            stats={[
                { label: 'Encryption', value: 'AES-256-GCM', detail: 'Authenticated encryption for confidential payloads.' },
                { label: 'Key derivation', value: 'PBKDF2', detail: '100,000 iterations with SHA-256.' },
                { label: 'Randomness', value: 'Secure RNG', detail: 'Salts and IVs come from crypto.getRandomValues().' },
                { label: 'Response path', value: 'Private email', detail: 'Responsible disclosure via direct contact.' },
            ]}
            promiseTitle="Fail closed, stay auditable"
            promiseBody="Phantom is designed to prefer verifiable, browser-native cryptography and transparent disclosure over cleverness. If the policy changes, the code and the changelog should make that obvious."
            promiseIcon={Shield}
            promiseAccent="bg-gradient-to-br from-indigo-500 to-violet-500"
            summaryTitle="Security posture"
            summaryItems={[
                'Browser-native crypto keeps the implementation surface smaller.',
                'Authenticated encryption detects tampering instead of hiding it.',
                'The app is open source, so security behavior can be inspected.',
                'Public guidance includes known limitations, not just benefits.',
            ]}
            sections={sections}
            footerTitle="What to do if you find a problem"
            footerBody={
                <>
                    Contact the maintainer privately, include concrete reproduction steps, and avoid public disclosure until there is time to assess and fix the issue. If you are looking for the architecture overview, the Security page is the companion document.
                </>
            }
            footerLinks={[
                { label: 'Email security', href: 'mailto:aadityashekhar321@gmail.com?subject=SECURITY:%20[Phantom%20Vulnerability]' },
                { label: 'Security page', href: '/security' },
            ]}
        />
    );
}
