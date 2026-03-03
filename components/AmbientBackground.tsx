'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/components/ThemeProvider';

// ── Matrix Rain Canvas ──────────────────────────────────────────────────────
function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId: number;
        let cols: number[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            cols = Array.from({ length: Math.floor(canvas.width / 18) }, () =>
                Math.floor(Math.random() * canvas.height)
            );
        };
        resize();

        const CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';
        let frameCount = 0;

        const draw = () => {
            // Pause when tab is hidden to save battery
            if (document.hidden) { animId = requestAnimationFrame(draw); return; }

            frameCount++;
            // Throttle to ~20fps
            if (frameCount % 3 !== 0) { animId = requestAnimationFrame(draw); return; }

            ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = '14px "JetBrains Mono", monospace';
            cols.forEach((y, i) => {
                const char = CHARS[Math.floor(Math.random() * CHARS.length)];
                const x = i * 18;
                // Bright lead character
                ctx.fillStyle = `rgba(0, 255, 70, ${0.7 + Math.random() * 0.3})`;
                ctx.fillText(char, x, y);
                // Tail fades
                if (y > canvas.height && Math.random() > 0.975) {
                    cols[i] = 0;
                } else {
                    cols[i] = y + 18;
                }
            });

            animId = requestAnimationFrame(draw);
        };

        animId = requestAnimationFrame(draw);
        window.addEventListener('resize', resize);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-1] pointer-events-none opacity-20"
            aria-hidden="true"
        />
    );
}

// ── Animated Gradient Orbs (default / crimson themes) ───────────────────────
function GradientOrbs({ theme }: { theme: string }) {
    const isCrimson = theme === 'crimson';

    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden" aria-hidden="true">
            {/* Primary orb — bottom-right */}
            <div
                className="absolute rounded-full blur-[140px] opacity-25 ambient-orb-1"
                style={{
                    width: '70vw',
                    height: '70vw',
                    maxWidth: 800,
                    maxHeight: 800,
                    bottom: '-20%',
                    right: '-15%',
                    background: isCrimson
                        ? 'radial-gradient(circle, rgba(220,38,38,0.8), rgba(239,68,68,0.2))'
                        : 'radial-gradient(circle, rgba(99,102,241,0.8), rgba(139,92,246,0.2))',
                }}
            />
            {/* Secondary orb — top-left */}
            <div
                className="absolute rounded-full blur-[120px] opacity-20 ambient-orb-2"
                style={{
                    width: '50vw',
                    height: '50vw',
                    maxWidth: 600,
                    maxHeight: 600,
                    top: '-10%',
                    left: '-10%',
                    background: isCrimson
                        ? 'radial-gradient(circle, rgba(239,68,68,0.6), rgba(220,38,38,0.1))'
                        : 'radial-gradient(circle, rgba(56,189,248,0.6), rgba(99,102,241,0.1))',
                }}
            />
            {/* Subtle accent — center */}
            <div
                className="absolute rounded-full blur-[180px] opacity-10 ambient-orb-3"
                style={{
                    width: '40vw',
                    height: '40vw',
                    maxWidth: 500,
                    maxHeight: 500,
                    top: '30%',
                    left: '30%',
                    background: isCrimson
                        ? 'radial-gradient(circle, rgba(251,113,133,0.5), transparent)'
                        : 'radial-gradient(circle, rgba(168,85,247,0.5), transparent)',
                }}
            />
        </div>
    );
}

// ── Main Export ──────────────────────────────────────────────────────────────
export function AmbientBackground() {
    const { theme } = useTheme();

    if (theme === 'matrix') {
        return <MatrixRain />;
    }

    return <GradientOrbs theme={theme} />;
}
