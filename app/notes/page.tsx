'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { processCryptoAsync } from '@/lib/cryptoWorkerClient';
import { Lock, Unlock, Trash2, Plus, Eye, EyeOff, FileText, Shield, Shuffle } from 'lucide-react';
import { toast } from 'sonner';

interface Note {
    id: string;
    title: string;
    content: string;
    isLocked: boolean;
    lockedContent?: string;
    createdAt: Date;
}

function generatePassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const arr = new Uint8Array(18);
    crypto.getRandomValues(arr);
    return Array.from(arr, (b) => chars[b % chars.length]).join('');
}

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([
        { id: '1', title: 'Welcome Note', content: 'This is your private, in-session encrypted notepad. Notes are stored only in memory and are permanently deleted when you close this tab.', isLocked: false, createdAt: new Date() }
    ]);
    const [activeId, setActiveId] = useState<string>('1');
    const [password, setPassword] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [showNewForm, setShowNewForm] = useState(false);

    const activeNote = notes.find(n => n.id === activeId);

    const addNote = () => {
        if (!newTitle.trim()) return;
        const note: Note = {
            id: Date.now().toString(),
            title: newTitle.trim(),
            content: '',
            isLocked: false,
            createdAt: new Date()
        };
        setNotes(prev => [note, ...prev]);
        setActiveId(note.id);
        setNewTitle('');
        setShowNewForm(false);
    };

    const updateContent = (content: string) => {
        setNotes(prev => prev.map(n => n.id === activeId ? { ...n, content } : n));
    };

    const deleteNote = (id: string) => {
        setNotes(prev => prev.filter(n => n.id !== id));
        if (activeId === id) setActiveId(notes.find(n => n.id !== id)?.id || '');
        toast.success('Note deleted.');
    };

    const lockNote = useCallback(async () => {
        if (!activeNote || !password) { toast.error('Enter a password to lock this note.'); return; }
        setLoading(true);
        try {
            const encrypted = await processCryptoAsync('encode', activeNote.content, password);
            setNotes(prev => prev.map(n =>
                n.id === activeId ? { ...n, isLocked: true, lockedContent: encrypted, content: '' } : n
            ));
            setPassword('');
            toast.success('Note locked with AES-256-GCM.');
        } catch {
            toast.error('Encryption failed.');
        } finally { setLoading(false); }
    }, [activeNote, password, activeId]);

    const unlockNote = useCallback(async () => {
        if (!activeNote?.lockedContent || !password) { toast.error('Enter the password to unlock.'); return; }
        setLoading(true);
        try {
            const decrypted = await processCryptoAsync('decode', activeNote.lockedContent, password);
            setNotes(prev => prev.map(n =>
                n.id === activeId ? { ...n, isLocked: false, content: decrypted, lockedContent: undefined } : n
            ));
            setPassword('');
            toast.success('Note unlocked.');
        } catch {
            toast.error('Wrong password or corrupted note.');
        } finally { setLoading(false); }
    }, [activeNote, password, activeId]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full pt-4 pb-24"
        >
            {/* Header */}
            <div className="text-center mb-10 space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-full">
                    <Shield className="w-3.5 h-3.5" />
                    In-Memory Only · Cleared on Tab Close
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Secure Notes</h1>
                <p className="text-gray-400 max-w-lg mx-auto text-base">
                    An encrypted, private notepad. Each note can be individually locked with its own password. Nothing is saved to disk.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 max-w-5xl mx-auto">
                {/* Sidebar */}
                <div className="space-y-2">
                    {/* New Note */}
                    {showNewForm ? (
                        <div className="bg-black/60 border border-white/10 rounded-2xl p-3 space-y-2">
                            <input
                                autoFocus
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addNote()}
                                placeholder="Note title..."
                                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                            />
                            <div className="flex gap-2">
                                <button onClick={addNote} className="flex-1 text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-xl py-1.5 transition-colors">Create</button>
                                <button onClick={() => setShowNewForm(false)} className="text-xs text-gray-500 hover:text-white px-2 transition-colors">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowNewForm(true)}
                            className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl border border-dashed border-white/10 text-gray-500 hover:text-white hover:border-violet-500/40 text-sm transition-all"
                        >
                            <Plus className="w-4 h-4" /> New Note
                        </button>
                    )}

                    {/* Note list */}
                    {notes.map(note => (
                        <div
                            key={note.id}
                            onClick={() => setActiveId(note.id)}
                            className={`cursor-pointer p-3 rounded-2xl flex items-center justify-between gap-2 transition-all ${activeId === note.id ? 'bg-violet-500/15 border border-violet-500/30' : 'bg-black/30 border border-white/5 hover:bg-white/5'}`}
                        >
                            <div className="flex items-center gap-2.5 min-w-0">
                                {note.isLocked ? <Lock className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" /> : <FileText className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />}
                                <span className="text-sm font-medium text-white truncate">{note.title}</span>
                            </div>
                            <button
                                onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                                className="text-gray-600 hover:text-red-400 transition-colors p-1 rounded flex-shrink-0"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Editor */}
                {activeNote ? (
                    <GlassCard className="h-full min-h-[500px] flex flex-col p-5 sm:p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {activeNote.isLocked ? <Lock className="w-4 h-4 text-violet-400" /> : <FileText className="w-4 h-4 text-gray-500" />}
                                <h2 className="text-base font-bold text-white">{activeNote.title}</h2>
                            </div>
                            <span className="text-[11px] text-gray-600 font-mono">{activeNote.createdAt.toLocaleDateString()}</span>
                        </div>

                        <AnimatePresence mode="wait">
                            {activeNote.isLocked ? (
                                <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-center space-y-3 py-12">
                                    <Lock className="w-12 h-12 text-violet-400/40" />
                                    <p className="text-gray-500 text-sm">This note is locked with AES-256-GCM.</p>
                                    <p className="text-gray-600 text-xs">Enter the password below to reveal its contents.</p>
                                </motion.div>
                            ) : (
                                <motion.textarea
                                    key="editor"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-1 min-h-[300px] bg-black/50 border border-white/5 rounded-2xl p-4 text-gray-200 text-sm leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-violet-500/40 custom-scrollbar"
                                    placeholder="Start writing your secret note here..."
                                    value={activeNote.content}
                                    onChange={e => updateContent(e.target.value)}
                                />
                            )}
                        </AnimatePresence>

                        {/* Lock Controls */}
                        <div className="border-t border-white/5 pt-4 space-y-3">
                            <label className="text-xs font-semibold text-violet-200">Note Password</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type={showPwd ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Password for this note..."
                                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 pr-20 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500/40 font-mono"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        <button type="button" onClick={() => setPassword(generatePassword())} title="Generate password" className="text-gray-500 hover:text-violet-300 transition-colors p-1">
                                            <Shuffle className="w-3.5 h-3.5" />
                                        </button>
                                        <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-gray-500 hover:text-violet-300 transition-colors p-1">
                                            {showPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={activeNote.isLocked ? unlockNote : lockNote}
                                    disabled={loading || !password}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold disabled:opacity-40 transition-colors"
                                >
                                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : activeNote.isLocked ? <><Unlock className="w-4 h-4" /> Unlock</> : <><Lock className="w-4 h-4" /> Lock</>}
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                ) : (
                    <div className="flex items-center justify-center min-h-[300px] border border-white/5 rounded-3xl text-gray-600 text-sm">
                        Select or create a note to get started.
                    </div>
                )}
            </div>
        </motion.div>
    );
}
