'use client';

import { PolicyPage, type PolicySection } from '@/components/PolicyPage';
import { Database, Eye, Lock, Server, Shield, Trash2 } from 'lucide-react';

const sections: PolicySection[] = [
    {
        title: 'What Never Leaves Your Browser',
        icon: Server,
        accent: 'bg-gradient-to-br from-cyan-500 to-blue-500',
        tone: 'border-cyan-500/20',
        points: [
            'Phantom is a client-side application. Encryption, decryption, and QR generation run locally in your browser.',
            'Ciphertexts, passwords, and plaintext are not sent to a backend service because Phantom does not use one.',
            'We do not log content, message metadata, or IP-linked activity. The app has no telemetry pipeline.',
        ],
    },
    {
        title: 'What We Store Locally',
        icon: Database,
        accent: 'bg-gradient-to-br from-amber-500 to-orange-500',
        tone: 'border-amber-500/20',
        points: [
            'Only transient UI preferences are stored in sessionStorage: theme, language, and the default self-destruct timer.',
            'The app does not use a user account system, so there is no profile, inbox, or cloud backup to maintain.',
            'Passwords and generated ciphertext stay in memory while you are using the page and clear with the session.',
        ],
    },
    {
        title: 'Encryption and Retention',
        icon: Lock,
        accent: 'bg-gradient-to-br from-indigo-500 to-violet-500',
        tone: 'border-indigo-500/20',
        points: [
            'Phantom uses AES-256-GCM for authenticated encryption and PBKDF2-SHA256 for password strengthening.',
            'Your password never leaves the device, and Phantom cannot recover it if it is lost.',
            'Closing the tab or triggering Panic Wipe clears the local session state and removes decrypted output from view.',
        ],
    },
    {
        title: 'Cookies, Analytics, and Sharing',
        icon: Eye,
        accent: 'bg-gradient-to-br from-pink-500 to-rose-500',
        tone: 'border-pink-500/20',
        points: [
            'Phantom does not use tracking cookies, ad pixels, or third-party analytics libraries.',
            'Share links place the encrypted payload in the URL fragment so the data stays client-side when the link is copied.',
            'Offline mode uses a service worker for static assets only. It does not cache your messages or passwords.',
        ],
    },
    {
        title: 'Your Rights and Deletion',
        icon: Trash2,
        accent: 'bg-gradient-to-br from-red-500 to-orange-500',
        tone: 'border-red-500/20',
        points: [
            'There is no account deletion flow because Phantom does not create accounts or store user records.',
            'You can delete local data by closing the tab, clearing browser storage, or pressing Panic Wipe.',
            'Any message you intentionally share remains your responsibility after it leaves your browser.',
        ],
    },
    {
        title: 'Policy Updates',
        icon: Shield,
        accent: 'bg-gradient-to-br from-emerald-500 to-teal-500',
        tone: 'border-emerald-500/20',
        points: [
            'This policy will only change if Phantom’s architecture changes in a way that affects how data is handled.',
            'Material updates are documented in the Changelog so the privacy story remains transparent.',
            'If you need a technical trust breakdown, review the Security Policy and Security Architecture pages together.',
        ],
    },
];

export default function Privacy() {
    return (
        <PolicyPage
            eyebrow="Privacy Policy"
            title="Phantom keeps the policy simple: your data stays in your browser."
            description="This page explains what Phantom collects, what it stores locally, and what never leaves the device. The short version is still the real version: no accounts, no telemetry, no server-side storage."
            lastUpdated="May 2026"
            heroAccent="from-cyan-500 via-transparent to-violet-500"
            heroBadge="Browser-first privacy"
            heroNote="No telemetry or server logs"
            stats={[
                { label: 'Accounts', value: '0', detail: 'There is no sign-up, login, or profile layer.' },
                { label: 'Telemetry', value: 'None', detail: 'No analytics, pixels, or session tracking.' },
                { label: 'Stored locally', value: 'Preferences only', detail: 'Theme, language, and timer defaults in sessionStorage.' },
                { label: 'Retention', value: 'Session-based', detail: 'Messages clear when the tab closes or Panic Wipe runs.' },
            ]}
            promiseTitle="Client-side only"
            promiseBody="Phantom is designed so the browser does the work. That means your messages are encrypted, decrypted, and displayed locally without a server seeing the payload."
            promiseIcon={Shield}
            promiseAccent="bg-gradient-to-br from-emerald-500 to-cyan-500"
            summaryTitle="At a glance"
            summaryItems={[
                'No accounts, no cloud vault, and no backend database.',
                'Only transient UI settings are persisted locally.',
                'Ciphertexts stay client-side until you share them intentionally.',
                'Offline mode caches app assets, not your content.',
            ]}
            sections={sections}
            footerTitle="What this means in practice"
            footerBody={
                <>
                    Phantom is built to minimize what can be collected in the first place. If you want a deeper technical explanation of the crypto model, this policy pairs with the Security Policy and the dedicated Security page.
                </>
            }
            footerLinks={[
                { label: 'Security Policy', href: '/security-policy' },
                { label: 'Security Architecture', href: '/security' },
            ]}
        />
    );
}
