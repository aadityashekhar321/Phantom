'use client';

import { PolicyPage, type PolicySection } from '@/components/PolicyPage';
import { Database, Eye, Lock, MinusCircle, Shield, Trash2, UserCheck } from 'lucide-react';

const sections: PolicySection[] = [
    {
        title: 'What Data Exists',
        icon: Database,
        accent: 'bg-gradient-to-br from-cyan-500 to-blue-500',
        tone: 'border-cyan-500/20',
        points: [
            'Phantom only keeps the data needed for the current browser session and the UI preferences you choose to save locally.',
            'There is no account database, user profile table, or message archive on the server side.',
            'If you close the tab, the encrypted workspace and decrypted output disappear with it.',
        ],
    },
    {
        title: 'Local Storage Rules',
        icon: Lock,
        accent: 'bg-gradient-to-br from-indigo-500 to-violet-500',
        tone: 'border-indigo-500/20',
        points: [
            'Only transient preferences like theme, language, and the self-destruct timer default are saved in browser storage.',
            'Those preferences are meant to improve convenience, not to track identity or behavior.',
            'Phantom does not write message content, passwords, or ciphertext archives into persistent storage.',
        ],
    },
    {
        title: 'Deletion and Erasure',
        icon: Trash2,
        accent: 'bg-gradient-to-br from-red-500 to-orange-500',
        tone: 'border-red-500/20',
        points: [
            'You can clear local data by closing the tab, clearing site storage, or using Panic Wipe if available.',
            'Because Phantom has no account system, there is nothing to request from a support queue or deletion mailbox.',
            'Shared links and exported files remain under your control after you intentionally create them.',
        ],
    },
    {
        title: 'Profiling and Tracking',
        icon: Eye,
        accent: 'bg-gradient-to-br from-pink-500 to-rose-500',
        tone: 'border-pink-500/20',
        points: [
            'Phantom does not build user profiles, behavioral segments, or usage funnels.',
            'There are no ad trackers, analytics scripts, or cross-site identifiers in the app.',
            'The goal is to make passive data collection impossible, not just minimized.',
        ],
    },
    {
        title: 'User Rights',
        icon: UserCheck,
        accent: 'bg-gradient-to-br from-emerald-500 to-teal-500',
        tone: 'border-emerald-500/20',
        points: [
            'Your practical right to access is built into the app: you can open, use, and leave without creating an account.',
            'Your practical right to erasure is built in: local data disappears when the session ends.',
            'If you share ciphertext with someone else, their copy is independent of your local browser state.',
        ],
    },
    {
        title: 'Limits of Control',
        icon: MinusCircle,
        accent: 'bg-gradient-to-br from-slate-500 to-slate-700',
        tone: 'border-white/10',
        points: [
            'Once a message or file leaves your browser, Phantom cannot force deletion on the recipient’s device.',
            'Browser vendors and operating systems still control the underlying storage and cache behavior.',
            'Users handling sensitive data should understand that endpoint security matters as much as the app itself.',
        ],
    },
];

export default function DataPractices() {
    return (
        <PolicyPage
            eyebrow="Data Practices / User Rights"
            title="Phantom stores almost nothing, and that is intentional."
            description="This page explains what data exists in practice, how to erase it, and where the app’s responsibility ends once something leaves your browser."
            lastUpdated="May 2026"
            heroAccent="from-cyan-500 via-transparent to-emerald-500"
            heroBadge="Minimal storage model"
            heroNote="No profiles, no dashboards"
            stats={[
                { label: 'Profiles', value: '0', detail: 'No account graph or identity database exists.' },
                { label: 'Tracking', value: 'None', detail: 'No analytics, ads, or cross-site identifiers.' },
                { label: 'Persistent data', value: 'Preferences only', detail: 'Theme, language, and timer defaults are local.' },
                { label: 'Erasure', value: 'Built in', detail: 'Closing the tab clears the active session.' },
            ]}
            promiseTitle="Data minimization by architecture"
            promiseBody="The best privacy practice is to avoid collecting data in the first place. Phantom keeps the runtime small, local, and disposable so users do not have to file deletion requests for data that never existed on a server."
            promiseIcon={Shield}
            promiseAccent="bg-gradient-to-br from-cyan-500 to-emerald-500"
            summaryTitle="What this page clarifies"
            summaryItems={[
                'What is stored locally versus what is never persisted.',
                'How to delete browser-held data quickly.',
                'Why there is no support queue for user data requests.',
                'What happens after you intentionally share something.',
            ]}
            sections={sections}
            footerTitle="Practical user-rights summary"
            footerBody={
                <>
                    If you want to reduce or remove your local footprint, simply clear site storage or close the tab. If you want to prevent future sharing, avoid generating a link or export in the first place. Phantom is built so the control stays with you.
                </>
            }
            footerLinks={[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Accessibility', href: '/accessibility' },
            ]}
        />
    );
}
