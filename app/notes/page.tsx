'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { processCryptoAsync } from '@/lib/cryptoWorkerClient';
import { Clock, Lock, Unlock, Trash2, Plus, Eye, EyeOff, FileText, Shield, Shuffle } from 'lucide-react';
import { toast } from 'sonner';
import { useT } from '@/components/LanguageProvider';

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
    const t = useT();
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
                    {t.notes.badge}
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{t.notes.title}</h1>
                <p className="text-gray-400 max-w-lg mx-auto text-base">
                    {t.notes.subtitle}
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
                                placeholder={t.notes.noteTitlePlaceholder}
                                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                            />
                            <div className="flex gap-2">
                                <button onClick={addNote} className="flex-1 text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-xl py-1.5 transition-colors">{t.notes.create}</button>
                                <button onClick={() => setShowNewForm(false)} className="text-xs text-gray-500 hover:text-white px-2 transition-colors">{t.notes.cancel}</button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowNewForm(true)}
                            className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl border border-dashed border-white/10 text-gray-500 hover:text-white hover:border-violet-500/40 text-sm transition-all"
                        >
                            <Plus className="w-4 h-4" /> {t.notes.newNote}
                        </button>
                    )}

                    {/* Note list */}
                    <AnimatePresence initial={false}>
                        {notes.map(note => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.2 }}
                                key={note.id}
                                onClick={() => setActiveId(note.id)}
                                className={`group cursor-pointer p-4 rounded-2xl flex items-center justify-between gap-3 transition-all duration-300 relative overflow-hidden ${activeId === note.id ? 'bg-violet-500/10 border border-violet-500/40 shadow-[0_0_20px_rgba(139,92,246,0.15)]' : 'bg-black/40 backdrop-blur-md border border-white/5 hover:bg-white/[0.04] hover:border-white/10'}`}
                            >
                                {/* Active subtle left accent */}
                                {activeId === note.id && (
                                    <motion.div layoutId="activeNoteAccent" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-violet-500 rounded-r-full shadow-[0_0_10px_rgba(139,92,246,0.6)]" />
                                )}
                                <div className="flex items-center gap-3 min-w-0 z-10">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeId === note.id ? 'bg-violet-500/20 text-violet-300' : 'bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-gray-400'}`}>
                                        {note.isLocked ? <Lock className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                    </div>
                                    <span className={`text-sm font-medium truncate transition-colors ${activeId === note.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>{note.title}</span>
                                </div>
                                <button
                                    onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                                    className={`p-1.5 rounded-lg transition-colors flex-shrink-0 z-10 ${activeId === note.id ? 'text-violet-400/50 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-600 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100'}`}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Editor */}
                {activeNote ? (
                    <GlassCard className="h-full min-h-[500px] flex flex-col p-6 sm:p-8 space-y-6 relative overflow-hidden group/editor">
                        {/* Editor ambient glow */}
                        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 opacity-50 group-hover/editor:opacity-100" />

                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${activeNote.isLocked ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
                                    {activeNote.isLocked ? <Lock className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">{activeNote.title}</h2>
                                    <span className="text-[11px] text-gray-500 font-mono flex items-center gap-1.5 mt-0.5">
                                        <Clock className="w-3 h-3" /> {activeNote.createdAt.toLocaleTimeString()} — {activeNote.createdAt.toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {activeNote.isLocked ? (
                                <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-12 relative overflow-hidden rounded-2xl bg-black/40 border border-violet-500/10 backdrop-blur-sm">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15)_0%,transparent_70%)] pointer-events-none" />
                                    <motion.div
                                        initial={{ scale: 0.5, rotate: -20 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        className="relative"
                                    >
                                        <div className="absolute inset-0 bg-violet-500 blur-2xl opacity-20 transform scale-150 rounded-full" />
                                        <div className="w-24 h-24 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center relative z-10 shadow-[inner_0_0_20px_rgba(139,92,246,0.3)]">
                                            <Lock className="w-10 h-10 text-violet-400 drop-shadow-[0_0_15px_rgba(167,139,250,0.8)]" />
                                        </div>
                                    </motion.div>
                                    <div className="space-y-2 relative z-10 max-w-sm px-4">
                                        <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">{t.notes.locked}</p>
                                        <p className="text-gray-400 text-sm leading-relaxed">{t.notes.lockedSub}</p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.textarea
                                    key="editor"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1 min-h-[300px] bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 text-gray-200 text-base leading-relaxed tracking-wide resize-none focus:outline-none focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500/30 custom-scrollbar shadow-inner transition-all z-10 relative"
                                    placeholder={t.notes.writePlaceholder}
                                    value={activeNote.content}
                                    onChange={e => updateContent(e.target.value)}
                                />
                            )}
                        </AnimatePresence>

                        {/* Lock Controls */}
                        <div className="border-t border-white/5 pt-4 space-y-3">
                            <label className="text-xs font-semibold text-violet-200">{t.notes.notePassword}</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type={showPwd ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder={t.notes.passwordPlaceholder}
                                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 pr-20 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50 shadow-inner font-mono"
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
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border border-violet-500/50 text-white text-sm font-bold shadow-[0_0_20px_rgba(139,92,246,0.2)] disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_25px_rgba(139,92,246,0.4)]"
                                >
                                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : activeNote.isLocked ? <><Unlock className="w-4 h-4 text-violet-200" /> {t.notes.unlock}</> : <><Lock className="w-4 h-4 text-violet-200" /> {t.notes.lock}</>}
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                ) : (
                    <div className="flex items-center justify-center min-h-[300px] border border-white/5 rounded-3xl text-gray-600 text-sm">
                        {t.notes.selectNote}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
