'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const navLinks = [
        { href: '/', label: 'The Vault' },
        { href: '/security', label: 'Architecture & Trust' },
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
                    <div className="hidden md:flex items-center gap-8 relative z-50">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:text-white ${pathname === link.href ? 'text-white drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'text-gray-400'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-2 text-gray-400 hover:text-white transition-colors z-50 relative focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
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
                        className="fixed inset-0 bg-[#09090b]/98 backdrop-blur-2xl z-40 md:hidden flex flex-col items-center justify-center gap-10 pt-16"
                    >
                        {navLinks.map((link, i) => (
                            <motion.div
                                key={link.href}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.1 + 0.1 }}
                            >
                                <Link
                                    href={link.href}
                                    onClick={closeMenu}
                                    className={`text-2xl font-bold transition-all duration-200 hover:scale-110 active:scale-95 p-4 ${pathname === link.href ? 'text-white drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'text-gray-400'
                                        }`}
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
