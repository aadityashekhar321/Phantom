import { ReactNode } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
}

export function GlassCard({ children, className = '' }: GlassCardProps) {
    return (
        <div
            className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-8 md:p-10 backdrop-blur-2xl shadow-2xl before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:from-white/5 before:to-transparent ${className}`}
        >
            {/* Subtle glow effect using a radial gradient */}
            <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-indigo-500/20 blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-violet-500/20 blur-[100px] pointer-events-none"></div>

            {/* Content wrapper */}
            <div className="relative z-10">{children}</div>
        </div>
    );
}
