import { ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    interactive?: boolean;
}

export function GlassCard({ children, className = '', interactive = true }: GlassCardProps) {
    const prefersReducedMotion = useReducedMotion();
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);

    // Smooth the motion values with springs for a natural feel
    const springX = useSpring(rotateX, { stiffness: 300, damping: 30 });
    const springY = useSpring(rotateY, { stiffness: 300, damping: 30 });

    function handleMove(e: React.MouseEvent<HTMLElement>) {
        if (!interactive) return;
        const el = e.currentTarget as HTMLElement;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 -> 0.5
        const py = (e.clientY - rect.top) / rect.height - 0.5;

        const maxDeg = 12; // max tilt degrees
        rotateY.set(px * maxDeg);
        rotateX.set(-py * maxDeg);
    }

    function handleLeave() {
        rotateX.set(0);
        rotateY.set(0);
    }

    return (
        <motion.div
            onMouseMove={prefersReducedMotion ? undefined : handleMove}
            onMouseLeave={prefersReducedMotion ? undefined : handleLeave}
            whileTap={interactive && !prefersReducedMotion ? { scale: 0.995 } : undefined}
            style={prefersReducedMotion ? undefined : { rotateX: springX, rotateY: springY, transformPerspective: 1000 }}
            className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-8 md:p-10 backdrop-blur-2xl shadow-2xl before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:from-white/5 before:to-transparent ${className}`}
        >
            {/* Subtle glow effect using a radial gradient */}
            <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-indigo-500/20 blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-violet-500/20 blur-[100px] pointer-events-none"></div>

            {/* Content wrapper */}
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}
