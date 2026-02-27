'use client';

import { GlassCard } from '@/components/GlassCard';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Lock, Cpu, Key, Image as ImageIcon, Sparkles, Shield } from 'lucide-react';

export default function HowItWorks() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12 sm:space-y-16"
        >
            <div className="text-center space-y-4 px-4">
                <div className="flex justify-center mb-6 relative w-40 h-40 mx-auto">
                    {/* Ambient Pulse Behind Image */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 blur-2xl rounded-[3rem] opacity-30"
                        animate={{ opacity: [0.15, 0.4, 0.15], scale: [0.85, 1.15, 0.85] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Floating Image Container */}
                    <motion.div
                        animate={{ y: [-8, 8, -8] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10 w-full h-full"
                    >
                        <Image src="/flow.webp" alt="Phantom Workflow Illustration" fill className="rounded-3xl drop-shadow-[0_0_30px_rgba(99,102,241,0.3)] object-cover" priority />
                    </motion.div>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter">How It Works</h1>
                <p className="text-gray-400 text-base sm:text-lg">Three simple steps to absolute privacy.</p>
            </div>

            <GlassCard className="max-w-3xl mx-auto px-5 py-8 sm:px-10 sm:py-12">
                <div className="flex flex-col gap-16">
                    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 sm:gap-12 items-start">
                        <div className="hidden md:flex flex-col items-center mt-2">
                            <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/30">
                                <Lock className="w-6 h-6" />
                            </div>
                            <div className="w-0.5 h-24 bg-gradient-to-b from-indigo-500/30 to-transparent mt-4"></div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-4 md:hidden mb-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/30">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-white">Write & Lock</h2>
                            </div>
                            <h2 className="hidden md:block text-2xl font-bold text-white mb-2">Write & Lock</h2>
                            <p className="text-gray-300 text-base leading-8 sm:leading-relaxed">
                                Type the message you want to keep secret. Then, enter a <strong>Secret Key</strong> (password).
                                <br className="hidden sm:block" />
                                Think of this key as the unique physical key to an indestructible digital safe.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 sm:gap-12 items-start">
                        <div className="hidden md:flex flex-col items-center mt-2">
                            <div className="w-12 h-12 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold border border-violet-500/30">
                                <Cpu className="w-6 h-6" />
                            </div>
                            <div className="w-0.5 h-24 bg-gradient-to-b from-violet-500/30 to-transparent mt-4"></div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-4 md:hidden mb-4">
                                <div className="w-10 h-10 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold border border-violet-500/30">
                                    <Cpu className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-white">The Scramble</h2>
                            </div>
                            <h2 className="hidden md:block text-2xl font-bold text-white mb-2">The Scramble</h2>
                            <p className="text-gray-300 text-base leading-8 sm:leading-relaxed">
                                When you click Lock, Phantom instantly scrambles your message using military-grade math.
                                The result is a random block of text that looks like absolute nonsense.
                                <br className="hidden sm:block" />
                                <br className="hidden sm:block" />
                                <strong>Without your exact Secret Key, no human or AI in the world can read it.</strong>
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 sm:gap-12 items-start">
                        <div className="hidden md:flex flex-col items-center mt-2">
                            <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold border border-cyan-500/30">
                                <Key className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-4 md:hidden mb-4">
                                <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold border border-cyan-500/30">
                                    <Key className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-white">Send & Unlock</h2>
                            </div>
                            <h2 className="hidden md:block text-2xl font-bold text-white mb-2">Send & Unlock</h2>
                            <p className="text-gray-300 text-base leading-8 sm:leading-relaxed">
                                Copy that scrambled text and send it to your friend anywhere—via iMessage, WhatsApp, or email.
                                <br className="hidden sm:block" />
                                They simply paste it back into Phantom, enter the Secret Key you gave them, and the original message is instantly restored.
                            </p>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* NEW: Dual Image Encryption Section */}
            <div className="text-center space-y-6 pt-16 sm:pt-20 px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-white flex justify-center items-center gap-3">
                    <ImageIcon className="text-indigo-400 w-8 h-8" />
                    Advanced Image Handling
                </h2>
                <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
                    Phantom features a powerful Dual Image Encryption Engine. When you upload an image to the Vault, you control exactly how it is secured.
                </p>
            </div>

            <GlassCard className="max-w-3xl mx-auto px-5 py-8 sm:px-10 sm:py-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none text-white">
                    <Shield className="w-48 h-48" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                    <div className="bg-black/50 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-indigo-500/30 transition-colors">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white">1. Steganography</h3>
                        <p className="text-indigo-300 font-semibold text-sm uppercase tracking-wider">Hide Text Inside an Image</p>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Phantom injects your scrambled secret message directly into the pixel data of an innocent-looking picture (like a photo of your cat).
                            The image looks 100% normal to the human eye, but acts as a carrier for your secret.
                        </p>
                    </div>

                    <div className="bg-black/50 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-cyan-500/30 transition-colors">
                        <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white">2. Full Encryption</h3>
                        <p className="text-cyan-300 font-semibold text-sm uppercase tracking-wider">Lock the Image Itself</p>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Phantom converts the entire image file into a massive string of data and encrypts the whole thing using AES-256-GCM.
                            The picture is completely destroyed until the correct Secret Key reconstructs it on the other side.
                        </p>
                    </div>
                </div>

                {/* Feature Comparison Table */}
                <div className="mt-12 overflow-x-auto bg-black/40 border border-white/10 rounded-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="p-4 text-sm font-semibold text-gray-300">Mode</th>
                                <th className="p-4 text-sm font-semibold text-gray-300 hidden sm:table-cell">How it Works</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Visual Output</th>
                                <th className="p-4 text-sm font-semibold text-gray-300 hidden md:table-cell">Best For</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-sm">
                            <tr className="hover:bg-white/[0.02] transition-colors">
                                <td className="p-4 font-semibold text-indigo-400">Steganography</td>
                                <td className="p-4 text-gray-400 hidden sm:table-cell">Hides text mathematically in pixel LSBs</td>
                                <td className="p-4 text-gray-300">Looks identical to original</td>
                                <td className="p-4 text-gray-400 hidden md:table-cell">Passing messages in plain sight</td>
                            </tr>
                            <tr className="hover:bg-white/[0.02] transition-colors">
                                <td className="p-4 font-semibold text-cyan-400">Full Encryption</td>
                                <td className="p-4 text-gray-400 hidden sm:table-cell">Scrambles the entire raw file into ciphertext</td>
                                <td className="p-4 text-gray-300">Unreadable text block (.txt)</td>
                                <td className="p-4 text-gray-400 hidden md:table-cell">Archiving or locking images completely</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </motion.div>
    );
}
