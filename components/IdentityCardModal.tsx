'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { X, Download, CreditCard, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    ciphertext: string;
}

// ─── Theme palette — (bg-dark, mid, accent, border-tint, name) ───────────────
const THEMES = [
    { stops: ['#1e1635', '#312e81', '#4f46e5'], accent: '#818cf8', name: 'Phantom' },
    { stops: ['#0d1117', '#161b22', '#1f6feb'], accent: '#60a5fa', name: 'Midnight' },
    { stops: ['#052e16', '#065f46', '#047857'], accent: '#34d399', name: 'Cipher Green' },
    { stops: ['#450a0a', '#7f1d1d', '#b91c1c'], accent: '#f87171', name: 'Crimson' },
    { stops: ['#0f0524', '#2d1d69', '#7c3aed'], accent: '#c084fc', name: 'Deep Violet' },
    { stops: ['#082f49', '#0c4a6e', '#0369a1'], accent: '#38bdf8', name: 'Abyss Blue' },
    { stops: ['#1c1917', '#292524', '#57534e'], accent: '#d4c4a8', name: 'Obsidian' },
] as const;

// ─── Canvas renderer ─────────────────────────────────────────────────────────

async function renderCard(
    canvas: HTMLCanvasElement,
    { name, handle, themeIdx, ciphertext }: {
        name: string; handle: string; themeIdx: number; ciphertext: string;
    }
) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 800, H = 440;
    canvas.width = W;
    canvas.height = H;

    const theme = THEMES[themeIdx];
    const [c1, c2, c3] = theme.stops;

    // ── Background gradient ──
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, c1);
    bg.addColorStop(0.55, c2);
    bg.addColorStop(1, c3);
    ctx.fillStyle = bg;
    roundRect(ctx, 0, 0, W, H, 28);
    ctx.fill();

    // ── Radial spotlight (top-left) ──
    const spotlight = ctx.createRadialGradient(0, 0, 0, 0, 0, W * 0.75);
    spotlight.addColorStop(0, 'rgba(255,255,255,0.07)');
    spotlight.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = spotlight;
    roundRect(ctx, 0, 0, W, H, 28);
    ctx.fill();

    // ── Noise grain ──
    ctx.fillStyle = 'rgba(255,255,255,0.022)';
    for (let i = 0; i < 2400; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * W, Math.random() * H, 0.7, 0, Math.PI * 2);
        ctx.fill();
    }

    // ── Geometric rings (decorative) ──
    const ringX = W - 80, ringY = H + 40;
    for (let r = 80; r <= 240; r += 60) {
        ctx.beginPath();
        ctx.arc(ringX, ringY, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = r === 80 ? 28 : 18;
        ctx.stroke();
    }

    // ── Thin horizontal rule below identity ──
    const ruleY = H / 2 + 68;
    ctx.beginPath();
    ctx.moveTo(36, ruleY);
    ctx.lineTo(W - 220, ruleY);
    const ruleGrad = ctx.createLinearGradient(36, 0, W - 220, 0);
    ruleGrad.addColorStop(0, 'rgba(255,255,255,0.15)');
    ruleGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.strokeStyle = ruleGrad;
    ctx.lineWidth = 1;
    ctx.stroke();

    // ── Avatar (double ring) ──
    const avX = 80, avY = H / 2 - 10;
    // outer ring
    ctx.beginPath();
    ctx.arc(avX, avY, 58, 0, Math.PI * 2);
    ctx.strokeStyle = theme.accent + '50'; // 31% opacity
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // middle ring
    ctx.beginPath();
    ctx.arc(avX, avY, 51, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1;
    ctx.stroke();
    // fill
    const aGrad = ctx.createRadialGradient(avX - 12, avY - 12, 4, avX, avY, 48);
    aGrad.addColorStop(0, 'rgba(255,255,255,0.22)');
    aGrad.addColorStop(1, 'rgba(0,0,0,0.25)');
    ctx.beginPath();
    ctx.arc(avX, avY, 48, 0, Math.PI * 2);
    ctx.fillStyle = aGrad;
    ctx.fill();
    // initials
    const initials = (name || 'P').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'P';
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${initials.length > 1 ? 28 : 34}px "Outfit", "Segoe UI", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, avX, avY);

    // ── Name ──
    const textX = 160;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 30px "Outfit", "Segoe UI", sans-serif`;
    ctx.fillText(name || 'Phantom User', textX, H / 2 - 32);

    // ── Handle ──
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = `400 15px "JetBrains Mono", "Courier New", monospace`;
    ctx.fillText(handle ? `@${handle}` : '@phantom', textX, H / 2);

    // ── "PHANTOM ENCRYPTED" pill badge ──
    const badgeX = textX, badgeY = H / 2 + 18;
    const badgeText = '🔐  PHANTOM ENCRYPTED';
    ctx.font = `600 10px "Outfit", "Segoe UI", sans-serif`;
    const badgeW = ctx.measureText(badgeText).width + 20;
    roundRect(ctx, badgeX - 2, badgeY - 12, badgeW, 20, 6);
    ctx.fillStyle = theme.accent + '22';
    ctx.fill();
    ctx.strokeStyle = theme.accent + '55';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = theme.accent;
    ctx.fillText(badgeText, badgeX + 8, badgeY + 2);

    // ── QR code ──
    const qrSize = 164;
    const qrX = W - qrSize - 36;
    const qrY = H / 2 - qrSize / 2 - 10;

    try {
        const QRCode = (await import('qrcode')).default;
        const qrDataUrl = await QRCode.toDataURL(ciphertext.slice(0, 400) || 'https://phantom.app', {
            width: qrSize,
            margin: 0,
            color: { dark: '#FFFFFF', light: '#00000000' },
            errorCorrectionLevel: 'M',
        });
        const img = new Image();
        await new Promise<void>((res) => { img.onload = () => res(); img.src = qrDataUrl; });

        // QR panel background
        roundRect(ctx, qrX - 12, qrY - 12, qrSize + 24, qrSize + 24, 16);
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

        // ── Phantom logo overlay in center of QR ──
        const logoSize = qrSize * 0.22;
        const lx = qrX + qrSize / 2 - logoSize / 2;
        const ly = qrY + qrSize / 2 - logoSize / 2;

        // Dark background to mask QR noise
        ctx.fillStyle = '#0b0b0e';
        roundRect(ctx, lx - 4, ly - 4, logoSize + 8, logoSize + 8, 8);
        ctx.fill();

        // Colored logo block
        ctx.fillStyle = theme.accent;
        roundRect(ctx, lx, ly, logoSize, logoSize, 6);
        ctx.fill();

        // 'P' init
        ctx.fillStyle = '#ffffff';
        ctx.font = `900 ${logoSize * 0.65}px "Outfit", "Segoe UI", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('P', lx + logoSize / 2, ly + logoSize / 2 + 1);
        ctx.textAlign = 'left'; // reset
    } catch {
        roundRect(ctx, qrX - 12, qrY - 12, qrSize + 24, qrSize + 24, 16);
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('QR Unavailable', qrX + qrSize / 2, qrY + qrSize / 2);
        ctx.textAlign = 'left';
    }

    // ── "Scan to decrypt" label below QR ──
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.font = `400 10px "JetBrains Mono", "Courier New", monospace`;
    ctx.fillText('SCAN TO DECRYPT', qrX + qrSize / 2, qrY + qrSize + 22);

    // ── Bottom watermark ──
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.font = `500 10px "Outfit", "Segoe UI", sans-serif`;
    ctx.fillText('phantom.app  ·  AES-256-GCM  ·  PBKDF2-SHA256  ·  Zero-Knowledge', 36, H - 22);

    // ── Issued Date ──
    const today = new Date().toISOString().split('T')[0];
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillText(`ISSUED: ${today}`, W - 36, H - 22);

    // ── Theme name chip (top-right corner) ──
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.font = `500 10px "Outfit", "Segoe UI", sans-serif`;
    ctx.fillText(theme.name.toUpperCase(), W - 36, 30);
}

// Helper to draw rounded rects without the non-standard CanvasRenderingContext2D.roundRect (fallback)
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
}

// ─── Modal ───────────────────────────────────────────────────────────────────

export function IdentityCardModal({ isOpen, onClose, ciphertext }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [name, setName] = useState('');
    const [handle, setHandle] = useState('');
    const [themeIdx, setThemeIdx] = useState(0);
    const [rendered, setRendered] = useState(false);
    const [copied, setCopied] = useState(false);
    const [downloaded, setDownloaded] = useState(false);

    // ── 3D Tilt & Glare setup ──
    const rectRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0.5); // 0 to 1 relative
    const mouseY = useMotionValue(0.5);

    // Spring physics for smooth return
    const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Map 0-1 relative positions to rotation degrees (-6 to +6)
    const rotateX = useTransform(springY, [0, 1], [6, -6]);
    const rotateY = useTransform(springX, [0, 1], [-6, 6]);

    // Map to glare position/intensity
    const glareX = useTransform(springX, [0, 1], ['-100%', '200%']);
    const glareY = useTransform(springY, [0, 1], ['-100%', '200%']);
    const glareOpacity = useTransform(springY, [0, 1], [0.1, 0.5]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!rectRef.current) return;
        const rect = rectRef.current.getBoundingClientRect();
        // Calculate relative position 0..1
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        // Reset to center
        mouseX.set(0.5);
        mouseY.set(0.5);
    };

    const draw = useCallback(async () => {
        if (!canvasRef.current) return;
        setRendered(false);
        await renderCard(canvasRef.current, { name, handle, themeIdx, ciphertext });
        setRendered(true);
    }, [name, handle, themeIdx, ciphertext]);

    useEffect(() => {
        if (isOpen) draw();
    }, [isOpen, draw]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `phantom-card-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 2000);
    };

    const handleCopy = async () => {
        try {
            const canvas = canvasRef.current;
            if (!canvas) return;
            canvas.toBlob(async (blob) => {
                if (!blob) return;
                await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        } catch { /* clipboard API unavailable */ }
    };

    const prevTheme = () => setThemeIdx(i => (i - 1 + THEMES.length) % THEMES.length);
    const nextTheme = () => setThemeIdx(i => (i + 1) % THEMES.length);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex justify-center items-start sm:items-center p-4 sm:p-6 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.93, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.93, y: 24 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full max-w-2xl bg-[#0b0b0e] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/60 my-8 sm:my-auto flex-shrink-0"
                    >
                        {/* Ambient top-glow */}
                        <div
                            className="absolute top-0 left-0 right-0 h-px"
                            style={{ background: `linear-gradient(90deg, transparent, ${THEMES[themeIdx].accent}60, transparent)` }}
                        />

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                                    style={{ background: `${THEMES[themeIdx].accent}22`, color: THEMES[themeIdx].accent }}
                                >
                                    <CreditCard className="w-4 h-4" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-white">QR Identity Card</h2>
                                    <p className="text-[11px] text-gray-500">Generate · Customise · Share</p>
                                </div>
                            </div>
                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.92 }}
                                className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </motion.button>
                        </div>

                        <div className="p-5 space-y-4">

                            {/* ── Inputs row ── */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Display Name</label>
                                        <span className="text-[10px] text-gray-600">{name.length}/30</span>
                                    </div>
                                    <input
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="e.g. Phantom User"
                                        maxLength={30}
                                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
                                        style={{ '--tw-ring-color': THEMES[themeIdx].accent } as React.CSSProperties}
                                        onFocus={e => (e.target.style.borderColor = THEMES[themeIdx].accent + '60')}
                                        onBlur={e => (e.target.style.borderColor = '')}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Handle</label>
                                        <span className="text-[10px] text-gray-600">{handle.length}/25</span>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm select-none">@</span>
                                        <input
                                            value={handle}
                                            onChange={e => setHandle(e.target.value.replace('@', ''))}
                                            placeholder="phantom_user"
                                            maxLength={25}
                                            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
                                            onFocus={e => (e.target.style.borderColor = THEMES[themeIdx].accent + '60')}
                                            onBlur={e => (e.target.style.borderColor = '')}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ── Theme picker ── */}
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex-shrink-0">Theme</span>

                                {/* Prev */}
                                <motion.button
                                    onClick={prevTheme}
                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                    className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors flex-shrink-0"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                </motion.button>

                                {/* Swatches */}
                                <div className="flex gap-2 flex-1 flex-wrap">
                                    {THEMES.map((g, i) => (
                                        <motion.button
                                            key={i}
                                            onClick={() => setThemeIdx(i)}
                                            whileHover={{ scale: 1.18 }}
                                            whileTap={{ scale: 0.9 }}
                                            title={g.name}
                                            className="relative w-7 h-7 rounded-full border-2 transition-all flex-shrink-0"
                                            style={{
                                                background: `linear-gradient(135deg, ${g.stops[0]}, ${g.stops[2]})`,
                                                borderColor: i === themeIdx ? g.accent : 'transparent',
                                                boxShadow: i === themeIdx ? `0 0 0 2px ${g.accent}40` : 'none',
                                            }}
                                        >
                                            {i === themeIdx && (
                                                <motion.div
                                                    layoutId="activeThemeDot"
                                                    className="absolute inset-0.5 rounded-full"
                                                    style={{ background: g.accent + '30' }}
                                                />
                                            )}
                                        </motion.button>
                                    ))}
                                </div>

                                {/* Next */}
                                <motion.button
                                    onClick={nextTheme}
                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                    className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors flex-shrink-0"
                                >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </motion.button>

                                {/* Active theme name */}
                                <motion.span
                                    key={themeIdx}
                                    initial={{ opacity: 0, x: 6 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-xs font-semibold flex-shrink-0"
                                    style={{ color: THEMES[themeIdx].accent }}
                                >
                                    {THEMES[themeIdx].name}
                                </motion.span>
                            </div>

                            {/* ── Card preview (3D Tilt Container) ── */}
                            <div className="perspective-[1200px] w-full relative">
                                <motion.div
                                    ref={rectRef}
                                    onMouseMove={handleMouseMove}
                                    onMouseLeave={handleMouseLeave}
                                    style={{
                                        rotateX,
                                        rotateY,
                                        transformStyle: 'preserve-3d',
                                        borderColor: THEMES[themeIdx].accent + '40',
                                        boxShadow: `0 20px 40px -10px rgba(0,0,0,0.8), 0 0 40px -10px ${THEMES[themeIdx].accent}30`
                                    }}
                                    className="rounded-2xl overflow-hidden border bg-black/50 relative cursor-crosshair transition-all duration-300"
                                >
                                    {/* Shading/Glare Layer */}
                                    <motion.div
                                        className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay"
                                        style={{
                                            background: 'radial-gradient(circle at center, white 0%, transparent 60%)',
                                            opacity: glareOpacity,
                                            left: glareX,
                                            top: glareY,
                                            width: '200%',
                                            height: '200%',
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                    />

                                    {/* Rendering shimmer overlay */}
                                    <AnimatePresence>
                                        {!rendered && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                                            >
                                                <div className="flex items-center gap-2 text-gray-400 text-xs shadow-black drop-shadow-md">
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                                                    />
                                                    Rendering…
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <canvas
                                        ref={canvasRef}
                                        className="w-full relative z-10"
                                        style={{ aspectRatio: '800/440', imageRendering: 'auto' }}
                                    />
                                </motion.div>
                            </div>

                            {/* ── Actions ── */}
                            <div className="flex gap-2.5">
                                <motion.button
                                    onClick={handleDownload}
                                    disabled={!rendered}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-40 disabled:pointer-events-none"
                                    style={{ background: `linear-gradient(135deg, ${THEMES[themeIdx].stops[1]}, ${THEMES[themeIdx].stops[2]})` }}
                                >
                                    <AnimatePresence mode="wait">
                                        {downloaded
                                            ? <motion.span key="check" initial={{ scale: 0.7 }} animate={{ scale: 1 }} className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Downloaded!</motion.span>
                                            : <motion.span key="dl" initial={{ scale: 0.7 }} animate={{ scale: 1 }} className="flex items-center gap-1.5"><Download className="w-4 h-4" /> Download PNG</motion.span>
                                        }
                                    </AnimatePresence>
                                </motion.button>

                                <motion.button
                                    onClick={handleCopy}
                                    disabled={!rendered}
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                    className="flex items-center gap-1.5 px-4 py-2.5 bg-white/5 hover:bg-white/8 border border-white/10 text-gray-300 hover:text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-40 disabled:pointer-events-none"
                                >
                                    <AnimatePresence mode="wait">
                                        {copied
                                            ? <motion.span key="check" initial={{ scale: 0.7 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-emerald-400"><Check className="w-4 h-4" /> Copied!</motion.span>
                                            : <motion.span key="copy" initial={{ scale: 0.7 }} animate={{ scale: 1 }} className="flex items-center gap-1"><Copy className="w-4 h-4" /></motion.span>
                                        }
                                    </AnimatePresence>
                                </motion.button>

                                <motion.button
                                    onClick={onClose}
                                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                    className="px-4 py-2.5 bg-white/5 hover:bg-white/8 border border-white/10 text-gray-400 hover:text-white text-sm font-semibold rounded-xl transition-all"
                                >
                                    Close
                                </motion.button>
                            </div>

                            {/* Tip */}
                            <p className="text-[10px] text-gray-600 text-center leading-relaxed">
                                The QR encodes up to 400 chars of your ciphertext. Share as a file — do not screenshot — to preserve quality.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
