'use client';

import { GlassCard } from '@/components/GlassCard';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function SecurityInfo() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            <div className="text-center space-y-4 px-4">
                <div className="flex justify-center mb-6">
                    <Image src="/security.webp" alt="Phantom Security Illustration" width={160} height={160} className="rounded-3xl drop-shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:scale-105 transition-transform duration-700" priority />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter text-red-400">Security Information</h1>
                <p className="text-gray-400 text-base sm:text-lg">Understanding the cryptographic foundation of Phantom.</p>
            </div>

            <GlassCard className="max-w-3xl mx-auto space-y-6">
                <div className="space-y-4">
                    <h2 className="text-xl sm:text-2xl font-bold border-b border-white/10 pb-2">Technical Specifications</h2>
                    <ul className="list-disc list-inside space-y-3 text-gray-300 text-sm sm:text-base">
                        <li>
                            <strong>Algorithm:</strong> AES (Advanced Encryption Standard) in GCM (Galois/Counter Mode).
                        </li>
                        <li>
                            <strong>Key Size:</strong> 256-bit keys, ensuring military-grade encryption.
                        </li>
                        <li>
                            <strong>Key Derivation:</strong> PBKDF2 with SHA-256 hash.
                        </li>
                        <li>
                            <strong>Iterations:</strong> 100,000 iterations to resist parallelized GPU brute-forcing.
                        </li>
                        <li>
                            <strong>Salt Size:</strong> 16 bytes, randomly generated per-message.
                        </li>
                        <li>
                            <strong>IV Size:</strong> 12 bytes, randomly generated per-message.
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg sm:text-xl font-bold text-red-300">Important Warnings</h2>
                    <div className="bg-red-500/10 border border-red-500/20 p-4 sm:p-5 rounded-2xl space-y-3">
                        <p className="text-red-200 text-sm sm:text-base">
                            <strong>1. Lost passwords cannot be recovered.</strong> Phantom is zero-knowledge locally executing software. There is no backend password reset feature.
                        </p>
                        <p className="text-red-200 text-sm sm:text-base">
                            <strong>2. No browser storage.</strong> Everything is stored temporarily in RAM. The keys and plaintexts are cleared when the session closes.
                        </p>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
}
