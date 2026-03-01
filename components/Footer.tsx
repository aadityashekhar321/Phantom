import Link from 'next/link';
import Image from 'next/image';
import { Github, Shield, Lock } from 'lucide-react';

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-white/5 bg-[#09090b]/60 backdrop-blur-sm mt-auto">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 mb-10">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-3 group w-fit">
                            <div className="w-9 h-9 rounded-xl bg-black shadow-lg shadow-indigo-500/20 flex items-center justify-center overflow-hidden border border-white/10">
                                <Image src="/logo.png" alt="Phantom Logo" width={36} height={36} className="object-cover" />
                            </div>
                            <span className="font-extrabold text-xl tracking-tight text-white">Phantom</span>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                            Military-grade AES-256-GCM encryption in your browser. Zero servers. Zero databases. Zero trace.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-500">Navigate</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                                    <Lock className="w-3.5 h-3.5 text-indigo-500" />
                                    The Vault
                                </Link>
                            </li>
                            <li>
                                <Link href="/security" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                                    <Shield className="w-3.5 h-3.5 text-red-500" />
                                    Architecture &amp; Trust
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Trust Signals */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-500">Security Promises</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span> No data ever leaves your device</li>
                            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span> No accounts, no tracking, no analytics</li>
                            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span> 100% open-source and auditable</li>
                            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span> Works fully offline (PWA)</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
                    <span>&copy; {year} Phantom. Zero-Knowledge. Zero Compromises.</span>
                    <a
                        href="https://github.com/aadityashekhar321/Phantom"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
                    >
                        <Github className="w-4 h-4" />
                        View Source on GitHub
                    </a>
                </div>
            </div>
        </footer>
    );
}
