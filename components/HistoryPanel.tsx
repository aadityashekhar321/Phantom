'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Lock, Unlock, ChevronRight } from 'lucide-react';

export interface HistoryEntry {
    id: string;
    mode: 'encode' | 'decode';
    inputPreview: string;
    outputLength: number;
    timeMs: number;
    timestamp: Date;
}

interface HistoryPanelProps {
    isOpen: boolean;
    onClose: () => void;
    entries: HistoryEntry[];
    onRestore: (entry: HistoryEntry) => void;
}

export function HistoryPanel({ isOpen, onClose, entries, onRestore }: HistoryPanelProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
                    />
                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full max-w-sm bg-[#09090b] border-l border-white/10 z-[90] flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                            <div className="flex items-center gap-2.5">
                                <Clock className="w-4 h-4 text-indigo-400" />
                                <h2 className="font-bold text-white text-base">Session History</h2>
                                <span className="text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded-full">{entries.length}</span>
                            </div>
                            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Entries */}
                        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-2 custom-scrollbar">
                            {entries.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-48 text-gray-600 text-sm text-center px-6">
                                    <Clock className="w-10 h-10 mb-3 opacity-30" />
                                    <p>No operations yet.</p>
                                    <p className="text-xs mt-1 opacity-60">Encrypt or decrypt something to see it here.</p>
                                </div>
                            )}
                            {entries.map((entry) => (
                                <motion.button
                                    key={entry.id}
                                    layout
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={() => onRestore(entry)}
                                    className="w-full text-left p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-white/15 transition-all group"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            {entry.mode === 'encode' ? (
                                                <Lock className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                                            ) : (
                                                <Unlock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                            )}
                                            <span className={`text-xs font-bold uppercase tracking-wider ${entry.mode === 'encode' ? 'text-indigo-400' : 'text-emerald-400'}`}>
                                                {entry.mode === 'encode' ? 'Locked' : 'Unlocked'}
                                            </span>
                                            <span className="text-[10px] text-gray-600 font-mono">·  {entry.timeMs}ms</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-gray-400 transition-colors flex-shrink-0 mt-0.5" />
                                    </div>
                                    <p className="text-sm text-gray-300 truncate font-mono">{entry.inputPreview}</p>
                                    <div className="flex items-center justify-between mt-1.5 text-[11px] text-gray-600">
                                        <span>Output: {entry.outputLength.toLocaleString()} chars</span>
                                        <span>{entry.timestamp.toLocaleTimeString()}</span>
                                    </div>
                                </motion.button>
                            ))}
                        </div>

                        <div className="px-4 py-3 border-t border-white/5 text-[11px] text-gray-700 text-center">
                            History is stored in memory only and clears on tab close.
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
