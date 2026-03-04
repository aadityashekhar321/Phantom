'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Zap } from 'lucide-react';
import { useT } from '@/components/LanguageProvider';

// localStorage keys
const LS_KEY_ENABLED = 'phantom_selfDestruct_enabled';
const LS_KEY_DURATION = 'phantom_selfDestruct_duration';

interface SettingsContextType {
    selfDestructEnabled: boolean;
    setSelfDestructEnabled: (val: boolean) => void;
    selfDestructDuration: number;
    setSelfDestructDuration: (val: number) => void;
    showSettings: boolean;
    setShowSettings: (val: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    // Initialise from localStorage (falls back to defaults during SSR)
    const [selfDestructEnabled, _setSelfDestructEnabled] = useState(false);
    const [selfDestructDuration, _setSelfDestructDuration] = useState(30);
    const [showSettings, setShowSettings] = useState(false);
    const [hydrated, setHydrated] = useState(false);

    // Hydrate on mount (client-only)
    useEffect(() => {
        try {
            const storedEnabled = localStorage.getItem(LS_KEY_ENABLED);
            const storedDuration = localStorage.getItem(LS_KEY_DURATION);
            if (storedEnabled !== null) _setSelfDestructEnabled(storedEnabled === 'true');
            if (storedDuration !== null) _setSelfDestructDuration(Number(storedDuration));
        } catch {
            // localStorage unavailable (private browsing, etc.) — silently ignore
        }
        setHydrated(true);
    }, []);

    // Persist whenever the value changes (skip initial render to avoid double-write)
    const setSelfDestructEnabled = (val: boolean) => {
        _setSelfDestructEnabled(val);
        try { localStorage.setItem(LS_KEY_ENABLED, String(val)); } catch { /* ignore */ }
    };

    const setSelfDestructDuration = (val: number) => {
        _setSelfDestructDuration(val);
        try { localStorage.setItem(LS_KEY_DURATION, String(val)); } catch { /* ignore */ }
    };

    // Expose toggle to window for Navbar access (shortcut)
    useEffect(() => {
        type PhantomWindow = Window & { _phantomToggleSettings?: () => void };
        (window as PhantomWindow)._phantomToggleSettings = () => setShowSettings(prev => !prev);
        return () => {
            delete (window as PhantomWindow)._phantomToggleSettings;
        };
    }, []);

    // Avoid rendering the modal before hydration to prevent mismatch
    if (!hydrated) {
        return (
            <SettingsContext.Provider value={{
                selfDestructEnabled,
                setSelfDestructEnabled,
                selfDestructDuration,
                setSelfDestructDuration,
                showSettings,
                setShowSettings
            }}>
                {children}
            </SettingsContext.Provider>
        );
    }

    return (
        <SettingsContext.Provider value={{
            selfDestructEnabled,
            setSelfDestructEnabled,
            selfDestructDuration,
            setSelfDestructDuration,
            showSettings,
            setShowSettings
        }}>
            {children}
            <SettingsModal />
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('useSettings must be used within SettingsProvider');
    return context;
}

function SettingsModal() {
    const { showSettings, setShowSettings, selfDestructEnabled, setSelfDestructEnabled, selfDestructDuration, setSelfDestructDuration } = useSettings();
    const t = useT();

    return (
        <AnimatePresence>
            {showSettings && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowSettings(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-[#0d0d10] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
                    >
                        <div className="p-8 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">{t.settings.title}</h2>
                                </div>
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="p-2 text-gray-500 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Self-Destruct Feature */}
                                <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-indigo-400" />
                                            <div>
                                                <h3 className="font-bold text-white text-sm">{t.settings.selfDestruct}</h3>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-0.5">{t.settings.burnAfterReading}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelfDestructEnabled(!selfDestructEnabled)}
                                            className={`w-12 h-6 rounded-full transition-all relative ${selfDestructEnabled ? 'bg-indigo-600' : 'bg-white/10'}`}
                                            aria-label="Toggle Self-Destruct Timer"
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${selfDestructEnabled ? 'left-7' : 'left-1'}`} />
                                        </button>
                                    </div>

                                    {selfDestructEnabled && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="pt-2 space-y-3"
                                        >
                                            <p className="text-xs text-gray-400">{t.settings.selfDestructDesc}</p>
                                            <div className="flex gap-2">
                                                {[30, 60].map(sec => (
                                                    <button
                                                        key={sec}
                                                        onClick={() => setSelfDestructDuration(sec)}
                                                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${selfDestructDuration === sec ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-black/40 border-white/5 text-gray-500'}`}
                                                    >
                                                        {sec} {t.settings.seconds}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Placeholder for other settings */}
                                <div className="p-4 rounded-2xl border border-dashed border-white/5 flex items-center justify-center">
                                    <p className="text-[10px] text-gray-600 font-mono tracking-tighter">{t.settings.comingSoon}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-indigo-500/5 p-4 text-center border-t border-white/5">
                            <p className="text-[10px] text-indigo-400/60 font-medium">{t.settings.sessionNote}</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
