'use client';

import { PolicyPage, type PolicySection } from '@/components/PolicyPage';
import { CheckCircle, Clock, Lock, Shield, Users, Zap } from 'lucide-react';

const sections: PolicySection[] = [
    {
        title: 'Acceptance of Terms',
        icon: CheckCircle,
        accent: 'bg-gradient-to-br from-emerald-500 to-teal-500',
        tone: 'border-emerald-500/20',
        points: [
            'By using Phantom, you agree to use the app in a way that is lawful and respectful of others.',
            'If you do not agree with these terms, you should stop using the website and clear any local session data.',
            'These terms apply to the website, the generated files, and any share links created with the app.',
        ],
    },
    {
        title: 'No Recovery, No Backups',
        icon: Lock,
        accent: 'bg-gradient-to-br from-indigo-500 to-violet-500',
        tone: 'border-indigo-500/20',
        points: [
            'Phantom cannot recover passwords, decrypt content without the correct key, or restore deleted local data.',
            'There is no server-side backup, account recovery, or support desk that can reverse user mistakes.',
            'You are responsible for securely saving passwords, files, and any encrypted output you want to keep.',
        ],
    },
    {
        title: 'User Responsibilities',
        icon: Users,
        accent: 'bg-gradient-to-br from-cyan-500 to-blue-500',
        tone: 'border-cyan-500/20',
        points: [
            'Use strong passwords and share them through a channel appropriate to your risk level.',
            'Do not use Phantom for unlawful activity, credential theft, malware delivery, or unauthorized access.',
            'If you share a message, you are responsible for who receives it and how they store it afterward.',
        ],
    },
    {
        title: 'Service Availability',
        icon: Zap,
        accent: 'bg-gradient-to-br from-amber-500 to-orange-500',
        tone: 'border-amber-500/20',
        points: [
            'Phantom is provided as-is and may change without notice as the app evolves.',
            'We do not promise uninterrupted uptime, error-free operation, or compatibility with every browser configuration.',
            'If the static site is unavailable, you may still use your own exported encrypted files and compatible browser tools when possible.',
        ],
    },
    {
        title: 'Intellectual Property',
        icon: Shield,
        accent: 'bg-gradient-to-br from-fuchsia-500 to-pink-500',
        tone: 'border-pink-500/20',
        points: [
            'The Phantom brand, design, and documentation remain protected by applicable intellectual property laws.',
            'Open-source components remain subject to their respective licenses.',
            'You may not remove attribution, misrepresent authorship, or use the project name in a misleading way.',
        ],
    },
    {
        title: 'Changes to the Terms',
        icon: Clock,
        accent: 'bg-gradient-to-br from-slate-500 to-slate-700',
        tone: 'border-white/10',
        points: [
            'We may update these terms to reflect product, legal, or security changes.',
            'Substantial updates should be visible through the Changelog or an announcement on the website.',
            'Continued use of Phantom after an update means you accept the revised terms.',
        ],
    },
];

export default function Terms() {
    return (
        <PolicyPage
            eyebrow="Terms of Service"
            title="Phantom is private by design, but the terms still need to be explicit."
            description="These terms explain the usage boundaries, your responsibilities, and the limits of what Phantom can guarantee."
            lastUpdated="May 2026"
            heroAccent="from-slate-500 via-transparent to-indigo-500"
            heroBadge="Usage and responsibility"
            heroNote="No recovery service"
            stats={[
                { label: 'Recovery', value: 'None', detail: 'Lost passwords cannot be restored.' },
                { label: 'Accounts', value: 'None', detail: 'There is no account layer or subscription plan.' },
                { label: 'Support', value: 'Community', detail: 'Use the repository and documentation for help.' },
                { label: 'Warranty', value: 'As-is', detail: 'No uptime or error-free promise is made.' },
            ]}
            promiseTitle="Use responsibly"
            promiseBody="Phantom is a tool, not a custody service. The app gives you private encryption and local control, while the responsibility for passwords, recipients, and lawful use stays with you."
            promiseIcon={Shield}
            promiseAccent="bg-gradient-to-br from-slate-500 to-indigo-500"
            summaryTitle="Key points"
            summaryItems={[
                'No account or payment system exists.',
                'No server can recover or inspect your content.',
                'You control sharing, retention, and deletion locally.',
                'The app is provided without a recovery guarantee.',
            ]}
            sections={sections}
            footerTitle="In plain language"
            footerBody={
                <>
                    If you lose the password, the data is gone. If you intentionally share a message, Phantom is not responsible for the recipient’s behavior after they receive it. These terms are here to make the limits obvious before something goes wrong.
                </>
            }
            footerLinks={[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Security Policy', href: '/security-policy' },
            ]}
        />
    );
}
