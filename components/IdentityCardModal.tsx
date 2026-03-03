'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, CreditCard, RefreshCw } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    ciphertext: string;
}

const GRADIENT_PRESETS = [
    ['#312e81', '#4f46e5', '#7c3aed'],   // Phantom (indigo-violet)
    ['#1a1a2e', '#16213e', '#0f3460'],   // Midnight blue
    ['#065f46', '#047857', '#0d9488'],   // Cipher green
    ['#7f1d1d', '#991b1b', '#b91c1c'],   // Crimson
    ['#1e1b4b', '#3730a3', '#6d28d9'],   // Deep violet
];

export function IdentityCardModal({ isOpen, onClose, ciphertext }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [name, setName] = useState('');
    const [handle, setHandle] = useState('');
    const [gradientIdx, setGradientIdx] = useState(0);
    const [rendered, setRendered] = useState(false);

    // Draw the card on canvas whenever inputs change
    useEffect(() => {
        if (!isOpen || !canvasRef.current) return;
        drawCard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, name, handle, gradientIdx, ciphertext]);

    const drawCard = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const W = 700;
        const H = 380;
        canvas.width = W;
        canvas.height = H;

        const [c1, c2, c3] = GRADIENT_PRESETS[gradientIdx];

        // Background gradient
        const bg = ctx.createLinearGradient(0, 0, W, H);
        bg.addColorStop(0, c1);
        bg.addColorStop(0.5, c2);
        bg.addColorStop(1, c3);
        ctx.fillStyle = bg;
        ctx.roundRect(0, 0, W, H, 24);
        ctx.fill();

        // Noise texture overlay (subtle dots)
        ctx.fillStyle = 'rgba(255,255,255,0.025)';
        for (let i = 0; i < 1200; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * W, Math.random() * H, 0.8, 0, Math.PI * 2);
            ctx.fill();
        }

        // Decorative arc in bottom-right
        ctx.beginPath();
        ctx.arc(W + 60, H + 60, 200, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 40;
        ctx.stroke();

        // Avatar circle
        const avatarX = 72, avatarY = H / 2;
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, 48, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Initials
        const initials = (name || 'P').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'P';
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = `bold ${initials.length > 1 ? 26 : 32}px "Outfit", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initials, avatarX, avatarY);

        // Name
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.font = `bold 26px "Outfit", sans-serif`;
        ctx.fillText(name || 'Phantom User', 140, H / 2 - 22);

        // Handle
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.font = `400 15px "JetBrains Mono", monospace`;
        ctx.fillText(handle ? `@${handle}` : '@phantom', 140, H / 2 + 4);

        // Phantom brand label
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.font = `600 11px "Outfit", sans-serif`;
        ctx.letterSpacing = '0.15em';
        ctx.fillText('PHANTOM ENCRYPTED', 140, H / 2 + 30);
        ctx.letterSpacing = '0';

        // Divider
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(32, H / 2 + 52);
        ctx.lineTo(420, H / 2 + 52);
        ctx.stroke();

        // QR code section — draw QR using qrcode library
        try {
            const QRCode = (await import('qrcode')).default;
            const qrDataUrl = await QRCode.toDataURL(ciphertext.slice(0, 300) || 'https://phantom.app', {
                width: 140,
                margin: 1,
                color: { dark: '#FFFFFF', light: '#00000000' },
                errorCorrectionLevel: 'L',
            });
            const img = new Image();
            await new Promise<void>((res) => {
                img.onload = () => res();
                img.src = qrDataUrl;
            });

            // QR background bubble
            ctx.fillStyle = 'rgba(0,0,0,0.25)';
            ctx.roundRect(W - 188, H / 2 - 82, 160, 160, 12);
            ctx.fill();

            ctx.drawImage(img, W - 180, H / 2 - 74, 144, 144);
        } catch {
            // QR fallback
            ctx.fillStyle = 'rgba(255,255,255,0.05)';
            ctx.roundRect(W - 188, H / 2 - 82, 160, 160, 12);
            ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.font = '11px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('QR Unavailable', W - 108, H / 2 + 4);
        }

        // Bottom: "Scan to decrypt" label
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText('Scan QR to decrypt', W - 108, H / 2 + 98);

        // Phantom watermark — bottom-left
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.font = `bold 11px "Outfit", sans-serif`;
        ctx.fillText('Phantom · AES-256-GCM · Zero Knowledge', 32, H - 20);

        setRendered(true);
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `phantom-card-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25 }}
                        className="relative w-full max-w-2xl bg-[#0d0d10] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                    <CreditCard className="w-4 h-4" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-white">QR Identity Card</h2>
                                    <p className="text-[11px] text-gray-500">Your encrypted message embedded in a shareable card</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Inputs */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Your Name</label>
                                    <input
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="e.g. Phantom User"
                                        maxLength={30}
                                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Handle</label>
                                    <input
                                        value={handle}
                                        onChange={e => setHandle(e.target.value.replace('@', ''))}
                                        placeholder="e.g. phantom_user"
                                        maxLength={25}
                                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50"
                                    />
                                </div>
                            </div>

                            {/* Gradient picker */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Card Theme</label>
                                <div className="flex gap-2 flex-wrap">
                                    {GRADIENT_PRESETS.map((g, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setGradientIdx(i)}
                                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${i === gradientIdx ? 'border-white scale-110' : 'border-transparent'}`}
                                            style={{ background: `linear-gradient(135deg, ${g[0]}, ${g[2]})` }}
                                            title={`Theme ${i + 1}`}
                                        />
                                    ))}
                                    <button
                                        onClick={() => setGradientIdx((gradientIdx + 1) % GRADIENT_PRESETS.length)}
                                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                        title="Next theme"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Card Preview */}
                            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                                <canvas
                                    ref={canvasRef}
                                    className="w-full"
                                    style={{ aspectRatio: '700/380', imageRendering: 'auto' }}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDownload}
                                    disabled={!rendered}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-40 disabled:pointer-events-none"
                                >
                                    <Download className="w-4 h-4" />
                                    Download PNG
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white text-sm font-semibold rounded-xl transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
