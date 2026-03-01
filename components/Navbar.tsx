'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Palette, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '@/components/ThemeProvider';

type Theme = 'phantom' | 'crimson' | 'matrix';

const themes: { key: Theme; label: string; color: string; dot: string }[] = [
    { key: 'phantom', label: 'Phantom', color: 'hover:text-indigo-300', dot: 'bg-indigo-500' },
    { key: 'crimson', label: 'Crimson', color: 'hover:text-red-300', dot: 'bg-red-500' },
    { key: 'matrix', label: 'Matrix', color: 'hover:text-emerald-300', dot: 'bg-emerald-500' },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showThemePicker, setShowThemePicker] = useState(false);
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    // No need for overflow hack — handled by ThemeProvider scroll lock
    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const navLinks = [
        { href: '/', label: 'The Vault' },
        { href: '/notes', label: 'Secure Notes' },
        { href: '/security', label: 'Architecture & Trust' },
        { href: '/changelog', label: 'Changelog' },
    ];

    return (
        <>
            <nav className="w-full border-b border-white/10 bg-[#09090b]/80 backdrop-blur-xl z-50 sticky top-0">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative z-50">
                    {/* Logo */}
                    <Link href="/" onClick={closeMenu} className="flex items-center gap-3 group z-50 relative">
                        <div className="w-9 h-9 rounded-xl bg-black shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-105 flex items-center justify-center overflow-hidden border border-white/10">
                            <Image src="/logo.png" alt="Phantom Logo" width={36} height={36} className="object-cover" />
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight text-white">
                            Phantom
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6 relative z-50">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:text-white ${pathname === link.href ? 'text-white drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'text-gray-400'}`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Theme Switcher */}
                        <div className="relative">
                            <button
                                onClick={() => setShowThemePicker(!showThemePicker)}
                                className="p-2 text-gray-500 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                                title="Switch theme"
                                aria-label="Switch color theme"
                            >
                                <Palette className="w-4 h-4" />
                            </button>

                            <AnimatePresence>
                                {showThemePicker && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowThemePicker(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 top-10 w-40 bg-[#0d0d10] border border-white/10 rounded-2xl p-2 shadow-2xl z-50"
                                        >
                                            {themes.map(t => (
                                                <button
                                                    key={t.key}
                                                    onClick={() => { setTheme(t.key); setShowThemePicker(false); }}
                                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${t.color} ${theme === t.key ? 'bg-white/5 text-white' : 'text-gray-400'}`}
                                                >
                                                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${t.dot}`} />
                                                    {t.label}
                                                    {theme === t.key && <Check className="w-3.5 h-3.5 ml-auto" />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Mobile controls */}
                    <div className="flex items-center gap-2 md:hidden">
                        {/* Mobile theme picker */}
                        <div className="relative">
                            <button
                                onClick={() => setShowThemePicker(!showThemePicker)}
                                className="p-2 text-gray-500 hover:text-white transition-colors"
                                aria-label="Switch theme"
                            >
                                <Palette className="w-5 h-5" />
                            </button>
                            <AnimatePresence>
                                {showThemePicker && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowThemePicker(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="absolute right-0 top-10 w-36 bg-[#0d0d10] border border-white/10 rounded-2xl p-2 shadow-2xl z-50"
                                        >
                                            {themes.map(t => (
                                                <button
                                                    key={t.key}
                                                    onClick={() => { setTheme(t.key); setShowThemePicker(false); }}
                                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${theme === t.key ? 'text-white bg-white/5' : 'text-gray-400'}`}
                                                >
                                                    <span className={`w-2 h-2 rounded-full ${t.dot}`} />
                                                    {t.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                        <button
                            onClick={toggleMenu}
                            className="p-2 text-gray-400 hover:text-white transition-colors z-50 relative focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="fixed inset-0 bg-[#09090b]/98 backdrop-blur-2xl z-40 md:hidden flex flex-col items-center justify-center gap-8 pt-16"
                    >
                        {navLinks.map((link, i) => (
                            <motion.div
                                key={link.href}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.07 + 0.1 }}
                            >
                                <Link
                                    href={link.href}
                                    onClick={closeMenu}
                                    className={`text-2xl font-bold transition-all duration-200 hover:scale-110 active:scale-95 p-4 ${pathname === link.href ? 'text-white drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'text-gray-400'}`}
                                >
                                    {link.label}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
