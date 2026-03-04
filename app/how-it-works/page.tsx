'use client';

import { GlassCard } from '@/components/GlassCard';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Lock, Cpu, Key, Image as ImageIcon, Sparkles, Shield } from 'lucide-react';

// ─── Reusable animation variants ────────────────────────────────────────────

/** Fade up, triggered when the element enters the viewport */
const fadeUpVariant = {
    hidden: { opacity: 0, y: 28 },
    visible: (delay: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay },
    }),
};

/** Horizontal slide-in for the step icon column */
const slideInLeft = {
    hidden: { opacity: 0, x: -20 },
    visible: (delay: number = 0) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay },
    }),
};

// Shared viewport config — triggers once, 10% threshold
const vp = { once: true, amount: 0.1 };

// ─── Reusable Step Card (3D Tilt) ──────────────────────────────────────────────

interface StepCardProps {
    icon: React.ElementType;
    iconColorBg: string;
    iconColorText: string;
    iconBorder: string;
    titleNumber: number;
    title: string;
    children: React.ReactNode;
    delay?: number;
}

function StepCard({
    icon: Icon,
    iconColorBg,
    iconColorText,
    iconBorder,
    titleNumber,
    title,
    children,
    delay = 0,
}: StepCardProps) {
    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);
    const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);
    const rotateX = useTransform(springY, [0, 1], [4, -4]);
    const rotateY = useTransform(springX, [0, 1], [-4, 4]);
    const glareX = useTransform(springX, [0, 1], ['-20%', '120%']);
    const glareY = useTransform(springY, [0, 1], ['-20%', '120%']);
    const glareOpacity = useTransform(springY, [0, 1], [0.1, 0]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width);
        y.set((e.clientY - rect.top) / rect.height);
    };
    const handleMouseLeave = () => { x.set(0.5); y.set(0.5); };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            custom={delay}
            variants={fadeUpVariant}
            style={{ perspective: 1200 }}
            className="w-full"
        >
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY }}
                className="transform-gpu bg-black/50 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start gap-6 relative overflow-hidden group hover:border-white/20 transition-colors"
            >
                {/* Glare */}
                <motion.div
                    className="absolute inset-0 z-0 pointer-events-none rounded-3xl"
                    style={{
                        background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.2) 0%, transparent 60%)`,
                        opacity: glareOpacity
                    }}
                />

                {/* Content */}
                <motion.div
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${iconColorBg} ${iconColorText} flex items-center justify-center border ${iconBorder} flex-shrink-0 relative z-10`}
                    whileHover={{ scale: 1.05, rotate: [-2, 2, -2, 0] }}
                    transition={{ duration: 0.4 }}
                >
                    <Icon className="w-7 h-7 md:w-8 md:h-8" />
                </motion.div>
                <div className="space-y-3 relative z-10 w-full pt-1">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                        <span className="text-xl md:text-2xl font-black text-white/10 font-mono">STEP 0{titleNumber}</span>
                        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{title}</h2>
                    </div>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">{children}</p>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── Image mode card (hover lift + glow) ────────────────────────────────────

interface ImageModeCardProps {
    icon: React.ElementType;
    iconBg: string;
    iconText: string;
    borderHover: string;
    glowColor: string;
    titleNumber: string;
    titleLabel: string;
    subtitle: string;
    subtitleColor: string;
    description: React.ReactNode;
    delay?: number;
}

function ImageModeCard({
    icon: Icon,
    iconBg,
    iconText,
    borderHover,
    glowColor,
    titleNumber,
    titleLabel,
    subtitle,
    subtitleColor,
    description,
    delay = 0,
}: ImageModeCardProps) {
    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);
    const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);
    const rotateX = useTransform(springY, [0, 1], [6, -6]);
    const rotateY = useTransform(springX, [0, 1], [-6, 6]);
    const glareX = useTransform(springX, [0, 1], ['-20%', '120%']);
    const glareY = useTransform(springY, [0, 1], ['-20%', '120%']);
    const glareOpacity = useTransform(springY, [0, 1], [0.12, 0]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width);
        y.set((e.clientY - rect.top) / rect.height);
    };
    const handleMouseLeave = () => { x.set(0.5); y.set(0.5); };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            custom={delay}
            variants={fadeUpVariant}
            style={{ perspective: 1200 }}
            className="h-full w-full"
        >
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY }}
                className={`bg-black/50 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 cursor-default relative overflow-hidden h-full flex flex-col`}
                whileHover={{
                    y: -6,
                    borderColor: borderHover,
                    boxShadow: `0 16px 48px -8px ${glowColor}`,
                }}
                transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            >
                {/* Glare Overlay */}
                <motion.div
                    className="absolute inset-0 z-0 pointer-events-none rounded-3xl"
                    style={{
                        background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.2) 0%, transparent 60%)`,
                        opacity: glareOpacity
                    }}
                />

                <div className="relative z-10 flex-1 space-y-4">
                    <motion.div
                        className={`w-12 h-12 ${iconBg} rounded-2xl flex items-center justify-center ${iconText}`}
                        whileHover={{ rotate: [0, -8, 8, -4, 0], scale: 1.1 }}
                        transition={{ duration: 0.45 }}
                    >
                        <Icon className="w-6 h-6" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white">{titleNumber}. {titleLabel}</h3>
                    <p className={`${subtitleColor} font-semibold text-sm uppercase tracking-wider`}>{subtitle}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HowItWorks() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12 sm:space-y-16"
        >
            {/* ── Hero ── */}
            <div className="text-center space-y-4 px-4">
                <div className="flex justify-center mb-6 relative w-40 h-40 mx-auto">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 blur-2xl rounded-[3rem] opacity-30"
                        animate={{ opacity: [0.15, 0.4, 0.15], scale: [0.85, 1.15, 0.85] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        animate={{ y: [-8, 8, -8] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        className="relative z-10 w-full h-full"
                    >
                        <Image
                            src="/flow.webp"
                            alt="Phantom Workflow Illustration"
                            fill
                            className="rounded-3xl drop-shadow-[0_0_30px_rgba(99,102,241,0.3)] object-cover"
                            priority
                        />
                    </motion.div>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter">How It Works</h1>
                <p className="text-gray-400 text-base sm:text-lg">Three simple steps to absolute privacy.</p>
            </div>

            {/* ── 3-step Cards ── */}
            <div className="max-w-3xl mx-auto space-y-6">
                <StepCard
                    icon={Lock}
                    iconColorBg="bg-indigo-500/20"
                    iconColorText="text-indigo-400"
                    iconBorder="border-indigo-500/30"
                    titleNumber={1}
                    title="Write & Lock"
                    delay={0}
                >
                    Type the message you want to keep secret. Then, enter a{' '}
                    <strong>Secret Key</strong> (password).
                    <br className="hidden sm:block" />
                    Think of this key as the unique physical key to an indestructible digital safe.
                </StepCard>

                <StepCard
                    icon={Cpu}
                    iconColorBg="bg-violet-500/20"
                    iconColorText="text-violet-400"
                    iconBorder="border-violet-500/30"
                    titleNumber={2}
                    title="The Scramble"
                    delay={0.08}
                >
                    When you click Lock, Phantom instantly scrambles your message using military-grade math.
                    The result is a random block of text that looks like absolute nonsense.
                    <br className="hidden sm:block" />
                    <br className="hidden sm:block" />
                    <strong>Without your exact Secret Key, no human or AI in the world can read it.</strong>
                </StepCard>

                <StepCard
                    icon={Key}
                    iconColorBg="bg-cyan-500/20"
                    iconColorText="text-cyan-400"
                    iconBorder="border-cyan-500/30"
                    titleNumber={3}
                    title="Send & Unlock"
                    delay={0.16}
                >
                    Copy that scrambled text and send it to your friend anywhere — via iMessage, WhatsApp, or email.
                    <br className="hidden sm:block" />
                    They simply paste it back into Phantom, enter the Secret Key you gave them, and the original
                    message is instantly restored.
                </StepCard>
            </div>

            {/* ── Advanced Image Handling header ── */}
            <motion.div
                className="text-center space-y-6 pt-16 sm:pt-20 px-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={vp}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-2xl sm:text-3xl font-bold text-white flex justify-center items-center gap-3">
                    <motion.span
                        animate={{ rotate: [0, -8, 8, -4, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
                        className="inline-flex"
                    >
                        <ImageIcon className="text-indigo-400 w-8 h-8" />
                    </motion.span>
                    Advanced Image Handling
                </h2>
                <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
                    Phantom features a powerful Dual Image Encryption Engine. When you upload an image to the Vault,
                    you control exactly how it is secured.
                </p>
            </motion.div>

            {/* ── Dual Image GlassCard ── */}
            <GlassCard className="max-w-3xl mx-auto px-5 py-8 sm:px-10 sm:py-12 relative overflow-hidden">
                {/* Decorative background shield */}
                <motion.div
                    className="absolute top-0 right-0 p-6 pointer-events-none text-white/[0.06]"
                    animate={{ rotate: [0, 6, 0], scale: [1, 1.04, 1] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <Shield className="w-48 h-48" />
                </motion.div>

                {/* Mode cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                    <ImageModeCard
                        icon={Sparkles}
                        iconBg="bg-indigo-500/20"
                        iconText="text-indigo-400"
                        borderHover="rgba(99,102,241,0.4)"
                        glowColor="rgba(99,102,241,0.18)"
                        titleNumber="1"
                        titleLabel="Steganography"
                        subtitle="Hide Text Inside an Image"
                        subtitleColor="text-indigo-300"
                        description={
                            <>
                                Phantom injects your scrambled secret message directly into an innocent-looking picture.
                                You can choose <strong>Invisible Mode</strong> for perfect secrecy (send as a file only),
                                or <strong>QR Overlay Mode</strong> which adds a visible QR code that safely survives
                                WhatsApp and Telegram photo compression.
                            </>
                        }
                        delay={0}
                    />

                    <ImageModeCard
                        icon={Lock}
                        iconBg="bg-cyan-500/20"
                        iconText="text-cyan-400"
                        borderHover="rgba(34,211,238,0.4)"
                        glowColor="rgba(34,211,238,0.15)"
                        titleNumber="2"
                        titleLabel="Full Encryption"
                        subtitle="Lock the Image Itself"
                        subtitleColor="text-cyan-300"
                        description={
                            <>
                                Phantom converts the entire image file into a massive string of data and encrypts the
                                whole thing using AES-256-GCM. The picture is completely destroyed until the correct
                                Secret Key reconstructs it on the other side.
                            </>
                        }
                        delay={0.1}
                    />
                </div>

                {/* Feature Comparison */}
                <div className="mt-12 space-y-4 md:space-y-0">

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                        {[
                            {
                                mode: 'Steganography',
                                color: 'text-indigo-400',
                                border: 'border-indigo-500/20',
                                bg: 'bg-indigo-500/5',
                                how: 'Hides text mathematically in pixel LSBs',
                                visual: 'Looks identical to original',
                                best: 'Passing messages in plain sight',
                                delay: 0,
                            },
                            {
                                mode: 'Full Encryption',
                                color: 'text-cyan-400',
                                border: 'border-cyan-500/20',
                                bg: 'bg-cyan-500/5',
                                how: 'Scrambles the entire raw file into ciphertext',
                                visual: 'Unreadable text block (.txt)',
                                best: 'Archiving or locking images completely',
                                delay: 0.08,
                            },
                        ].map(row => (
                            <motion.div
                                key={row.mode}
                                className={`rounded-2xl border ${row.border} ${row.bg} p-4 space-y-2`}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={vp}
                                transition={{ duration: 0.4, delay: row.delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <p className={`font-bold text-base ${row.color}`}>{row.mode}</p>
                                <div className="text-sm text-gray-400 space-y-1.5">
                                    <p><span className="text-gray-500 font-semibold">Method: </span>{row.how}</p>
                                    <p><span className="text-gray-500 font-semibold">Output: </span>{row.visual}</p>
                                    <p><span className="text-gray-500 font-semibold">Best for: </span>{row.best}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <motion.div
                        className="hidden md:block overflow-hidden bg-black/40 border border-white/10 rounded-2xl"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={vp}
                        transition={{ duration: 0.45, delay: 0.1 }}
                    >
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="p-4 font-semibold text-gray-300">Mode</th>
                                    <th className="p-4 font-semibold text-gray-300">How it Works</th>
                                    <th className="p-4 font-semibold text-gray-300">Visual Output</th>
                                    <th className="p-4 font-semibold text-gray-300">Best For</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                <motion.tr
                                    className="hover:bg-white/[0.03] transition-colors"
                                    whileHover={{ backgroundColor: 'rgba(99,102,241,0.04)' }}
                                >
                                    <td className="p-4 font-semibold text-indigo-400">Steganography</td>
                                    <td className="p-4 text-gray-400">Hides text mathematically in pixel LSBs</td>
                                    <td className="p-4 text-gray-300">Looks identical to original</td>
                                    <td className="p-4 text-gray-400">Passing messages in plain sight</td>
                                </motion.tr>
                                <motion.tr
                                    className="hover:bg-white/[0.03] transition-colors"
                                    whileHover={{ backgroundColor: 'rgba(34,211,238,0.04)' }}
                                >
                                    <td className="p-4 font-semibold text-cyan-400">Full Encryption</td>
                                    <td className="p-4 text-gray-400">Scrambles the entire raw file into ciphertext</td>
                                    <td className="p-4 text-gray-300">Unreadable text block (.txt)</td>
                                    <td className="p-4 text-gray-400">Archiving or locking images completely</td>
                                </motion.tr>
                            </tbody>
                        </table>
                    </motion.div>
                </div>
            </GlassCard>
        </motion.div>
    );
}
