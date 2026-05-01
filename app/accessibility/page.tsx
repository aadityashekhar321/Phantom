'use client';

import { PolicyPage, type PolicySection } from '@/components/PolicyPage';
import { Keyboard, Eye, Gauge, Languages, MonitorSmartphone, Shield, Type } from 'lucide-react';

const sections: PolicySection[] = [
    {
        title: 'Keyboard Access',
        icon: Keyboard,
        accent: 'bg-gradient-to-br from-cyan-500 to-blue-500',
        tone: 'border-cyan-500/20',
        points: [
            'Core actions are designed to be reachable with the keyboard, including navigation, modal controls, and primary action buttons.',
            'Focus styles should remain visible so users can see where they are while moving through the app.',
            'Complex interactions should have an accessible fallback or a clearly labeled alternative control.',
        ],
    },
    {
        title: 'Readable Typography',
        icon: Type,
        accent: 'bg-gradient-to-br from-indigo-500 to-violet-500',
        tone: 'border-indigo-500/20',
        points: [
            'The interface uses large headings, readable line lengths, and sufficient spacing for comfortable scanning.',
            'Text should maintain strong contrast against the dark glass background treatment used throughout the site.',
            'Users can zoom the page with browser controls without breaking the core workflow.',
        ],
    },
    {
        title: 'Language Support',
        icon: Languages,
        accent: 'bg-gradient-to-br from-emerald-500 to-teal-500',
        tone: 'border-emerald-500/20',
        points: [
            'Phantom currently supports English and Hindi in the main interface.',
            'Language choice is persisted locally so users do not need to reset their preference on every visit.',
            'Pages should keep the language switcher easy to reach from both desktop and mobile layouts.',
        ],
    },
    {
        title: 'Responsive Layout',
        icon: MonitorSmartphone,
        accent: 'bg-gradient-to-br from-pink-500 to-rose-500',
        tone: 'border-pink-500/20',
        points: [
            'The UI is built to adapt to mobile, tablet, and desktop screens without hiding core actions behind complex gestures.',
            'Card-based sections and fluid grids help keep content readable on smaller viewports.',
            'Interactive elements should remain large enough for touch interaction on phones and tablets.',
        ],
    },
    {
        title: 'Motion and Comfort',
        icon: Gauge,
        accent: 'bg-gradient-to-br from-amber-500 to-orange-500',
        tone: 'border-amber-500/20',
        points: [
            'Animations are decorative and should never be the only way to understand the page.',
            'Motion should feel calm and purposeful, with no essential information hidden behind animation timing.',
            'If you are sensitive to movement, reduce-motion settings in the browser should still leave the content usable.',
        ],
    },
    {
        title: 'Known Limitations',
        icon: Eye,
        accent: 'bg-gradient-to-br from-slate-500 to-slate-700',
        tone: 'border-white/10',
        points: [
            'Canvas-based steganography previews and QR flows are less accessible than text-only content.',
            'Highly visual background effects can be distracting if used too aggressively, so they should stay subtle.',
            'Some advanced crypto interactions may still benefit from more concise error messaging in future iterations.',
        ],
    },
];

export default function Accessibility() {
    return (
        <PolicyPage
            eyebrow="Accessibility Statement"
            title="Phantom should feel usable, legible, and calm across devices and input methods."
            description="This statement describes the accessibility features already in place, the design goals behind them, and the current limitations that still need attention."
            lastUpdated="May 2026"
            heroAccent="from-emerald-500 via-transparent to-cyan-500"
            heroBadge="Keyboard, screen, and mobile friendly"
            heroNote="Accessibility is part of trust"
            stats={[
                { label: 'Supported languages', value: '2', detail: 'English and Hindi are available in the current UI.' },
                { label: 'Navigation', value: 'Keyboard ready', detail: 'Core flows should remain operable without a mouse.' },
                { label: 'Layout', value: 'Responsive', detail: 'The design adapts across mobile and desktop sizes.' },
                { label: 'Motion', value: 'Controlled', detail: 'Animations are decorative rather than required.' },
            ]}
            promiseTitle="Clear over clever"
            promiseBody="Accessibility is not an optional polish pass for Phantom. A privacy tool should still be usable by people who rely on keyboards, readers, zoom, and smaller screens."
            promiseIcon={Shield}
            promiseAccent="bg-gradient-to-br from-emerald-500 to-cyan-500"
            summaryTitle="Accessibility goals"
            summaryItems={[
                'Keep essential actions visible and keyboard reachable.',
                'Maintain strong contrast and readable type across the app.',
                'Support both languages without making the interface harder to navigate.',
                'Avoid motion that interferes with understanding or comfort.',
            ]}
            sections={sections}
            footerTitle="Reporting accessibility issues"
            footerBody={
                <>
                    If something is hard to use, say so directly in a bug report or feature request. Include the browser, device, and the step that blocked you so the issue can be reproduced and improved.
                </>
            }
            footerLinks={[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Data Practices', href: '/data-practices' },
            ]}
        />
    );
}
