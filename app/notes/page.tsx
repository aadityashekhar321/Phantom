'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { processCryptoAsync } from '@/lib/cryptoWorkerClient';
import { Lock, Unlock, Trash2, Plus, Eye, EyeOff, FileText, Shield, Shuffle, PenSquare, Sparkles, KeyRound } from 'lucide-react';
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
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const [password, setPassword] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [showNewForm, setShowNewForm] = useState(false);

    // Determine screen size for sidebar collapsing
    const [isMobile, setIsMobile] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);

    useEffect(() => {
        // Initialize Welcome Note only on client to avoid hydration issues
        setNotes([
            { id: '1', title: 'Welcome to Secure Notes', content: 'This is your private, in-session encrypted notepad. \n\n• Notes are stored strictly in your browser\'s temporary memory.\n• Each note can be individually locked with its own unique AES-256-GCM password.\n• Everything is permanently destroyed the moment you close this tab.\n\nTry locking this note to see how it works!', isLocked: false, createdAt: new Date() }
        ]);
        setActiveId('1');

        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024) setShowSidebar(false);
            else setShowSidebar(true);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
        if (isMobile) setShowSidebar(false);
    };

    const updateContent = (content: string) => {
        setNotes(prev => prev.map(n => n.id === activeId ? { ...n, content } : n));
    };

    const deleteNote = (id: string) => {
        setNotes(prev => prev.filter(n => n.id !== id));
        if (activeId === id) setActiveId(notes.find(n => n.id !== id)?.id || '');
        toast.success('Note permanently deleted.');
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
            toast.success('Note securely locked.');
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
            toast.success('Note unlocked & restored.');
        } catch {
            toast.error('Access Denied: Incorrect password.');
        } finally { setLoading(false); }
    }, [activeNote, password, activeId]);

    // Handle pressing enter inside password input
    const handlePasswordKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (activeNote?.isLocked) unlockNote();
            else lockNote();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full pt-4 pb-24 px-4 sm:px-6 relative"
        >
            {/* Header Area */}
            <div className="text-center mb-12 space-y-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-violet-300 bg-violet-500/10 border border-violet-500/20 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                >
                    <Shield className="w-3.5 h-3.5" />
                    In-Memory Storage Only
                </motion.div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight drop-shadow-sm">
                    Secure Notes
                </h1>
                <p className="text-indigo-200/70 max-w-xl mx-auto text-base leading-relaxed">
                    A zero-knowledge cryptographic notepad. Lock individual thoughts with AES-256-GCM.
                    <strong className="text-white/90 font-semibold block mt-1">Nothing touches the hard drive. Survives only while this tab is open.</strong>
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 max-w-6xl mx-auto relative z-10">
                {/* Mobile Sidebar Toggle */}
                {isMobile && (
                    <div className="flex justify-between items-center bg-black/40 border border-white/10 p-4 rounded-3xl backdrop-blur-xl shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-white">{notes.length} Active Notes</span>
                        </div>
                        <button
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 text-violet-300 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                        >
                            {showSidebar ? 'Hide List' : 'Show List'}
                        </button>
                    </div>
                )}

                {/* Sidebar (Note List) */}
                <AnimatePresence>
                    {showSidebar && (
                        <motion.div
                            initial={{ opacity: 0, x: -20, height: 0 }}
                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                            exit={{ opacity: 0, x: -20, height: 0 }}
                            className="flex flex-col space-y-3"
                        >
                            {/* New Note Button / Form */}
                            <GlassCard className="p-2 sm:p-3 shadow-lg hover:shadow-indigo-500/5 transition-shadow">
                                <AnimatePresence mode="wait">
                                    {showNewForm ? (
                                        <motion.div
                                            key="form"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="space-y-2"
                                        >
                                            <input
                                                autoFocus
                                                value={newTitle}
                                                onChange={e => setNewTitle(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && addNote()}
                                                placeholder="Enter note title..."
                                                className="w-full bg-black/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 shadow-inner"
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={addNote} disabled={!newTitle.trim()} className="flex-1 text-xs font-bold uppercase tracking-wider bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl py-2.5 transition-colors shadow-[0_0_15px_rgba(139,92,246,0.2)]">Create</button>
                                                <button onClick={() => setShowNewForm(false)} className="text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white rounded-xl px-4 transition-colors">Cancel</button>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.button
                                            key="button"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => setShowNewForm(true)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/20 bg-white/[0.02] text-gray-400 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/5 text-sm font-semibold transition-all group"
                                        >
                                            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" /> Compose Note
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </GlassCard>

                            {/* Note List Iteration */}
                            <div className="space-y-2 pb-4">
                                <AnimatePresence>
                                    {notes.map(note => (
                                        <motion.div
                                            key={note.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                            onClick={() => {
                                                setActiveId(note.id);
                                                if (isMobile) setShowSidebar(false);
                                            }}
                                            className={`cursor-pointer p-0.5 rounded-2xl transition-all group relative overflow-hidden ${activeId === note.id ? 'bg-gradient-to-r from-violet-500 to-indigo-500 shadow-[0_0_20px_rgba(139,92,246,0.2)]' : 'bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10'}`}
                                        >
                                            <div className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-[14px] ${activeId === note.id ? 'bg-black/40 backdrop-blur-md' : 'bg-transparent'}`}>
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${activeId === note.id ? 'bg-white/10' : 'bg-black/50 border border-white/5 group-hover:bg-white/5'} transition-colors`}>
                                                        {note.isLocked ? <Lock className={`w-4 h-4 ${activeId === note.id ? 'text-violet-200' : 'text-violet-400'}`} /> : <FileText className={`w-4 h-4 ${activeId === note.id ? 'text-white' : 'text-gray-500'}`} />}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className={`text-sm font-bold truncate ${activeId === note.id ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{note.title}</span>
                                                        <span className="text-[10px] uppercase tracking-wider text-gray-500 mt-0.5">{note.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                                                    className={`shrink-0 p-1.5 rounded-lg transition-colors ${activeId === note.id ? 'text-white/40 hover:text-white hover:bg-white/20' : 'text-gray-600 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100'}`}
                                                    title="Permanently Delete Note"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {notes.length === 0 && (
                                    <div className="text-center p-8 border border-white/5 border-dashed rounded-3xl bg-black/20">
                                        <Sparkles className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                                        <p className="text-sm text-gray-500 font-medium">Your vault is empty</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Editor Area */}
                {activeNote ? (
                    <GlassCard className="h-full min-h-[600px] flex flex-col xl:p-8 p-5 sm:p-6 relative overflow-hidden shadow-2xl">
                        {/* Title Bar - Simplified */}
                        <div className="flex items-center justify-between pb-4 sm:pb-5 mb-2 shrink-0 z-10 border-b border-white/5">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{activeNote.title}</h2>
                                <p className="text-xs text-gray-500 font-mono">Note ID: {activeNote.id} • {activeNote.createdAt.toLocaleDateString()}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-2xl hidden sm:flex items-center justify-center ${activeNote.isLocked ? 'bg-violet-500/10 text-violet-400' : 'bg-white/5 text-gray-400'}`}>
                                {activeNote.isLocked ? <Lock className="w-6 h-6" /> : <PenSquare className="w-6 h-6" />}
                            </div>
                        </div>

                        {/* Text Editor OR Lock Screen */}
                        <div className="flex-1 relative z-10 flex flex-col pt-2">
                            <AnimatePresence mode="wait">
                                {activeNote.isLocked ? (
                                    <motion.div
                                        key="locked-screen"
                                        initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
                                        animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                                        exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex-1 flex flex-col items-center justify-center text-center px-4"
                                    >
                                        <div className="relative mb-6">
                                            <div className="absolute inset-0 bg-violet-500/20 blur-[40px] rounded-full scale-150 animate-pulse" />
                                            <div className="w-20 h-20 bg-black/60 border border-violet-500/30 rounded-2xl flex items-center justify-center relative z-10 shadow-2xl backdrop-blur-md">
                                                <Lock className="w-8 h-8 text-violet-400" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">Note Locked</h3>
                                        <p className="text-gray-400 max-w-sm mb-6 leading-relaxed text-sm sm:text-base">
                                            Provide the exact AES-256-GCM key below to decrypt and reveal this payload.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.textarea
                                        key="unlocked-editor"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex-1 w-full h-full bg-transparent text-gray-200 text-base leading-relaxed resize-none focus:outline-none custom-scrollbar"
                                        placeholder="Start typing your highly sensitive thoughts here..."
                                        value={activeNote.content}
                                        onChange={e => updateContent(e.target.value)}
                                    />
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Lock / Unlock Controls Footer - Clean flat inputs */}
                        <div className="mt-4 pt-4 border-t border-white/5 shrink-0 z-10 flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <div className="relative flex items-center bg-white/5 focus-within:bg-white/10 hover:bg-white/10 rounded-xl transition-colors border border-transparent focus-within:border-white/10">
                                    <div className="pl-4 pr-2 text-gray-500">
                                        <KeyRound className="w-4 h-4" />
                                    </div>
                                    <input
                                        type={showPwd ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        onKeyDown={handlePasswordKeyDown}
                                        placeholder={activeNote.isLocked ? "Enter decryption key..." : "Assign an encryption key..."}
                                        className="w-full bg-transparent py-4 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none font-mono tracking-wider"
                                    />
                                    <div className="pr-3 flex items-center gap-1">
                                        {!activeNote.isLocked && (
                                            <button type="button" onClick={() => setPassword(generatePassword())} title="Generate strong random password" className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg">
                                                <Shuffle className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button type="button" onClick={() => setShowPwd(!showPwd)} title="Toggle visibility" className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg">
                                            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={activeNote.isLocked ? unlockNote : lockNote}
                                disabled={loading || !password}
                                className={`shrink-0 w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all text-sm disabled:opacity-50 disabled:pointer-events-none ${activeNote.isLocked ? 'bg-violet-600 hover:bg-violet-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : activeNote.isLocked ? (
                                    <><Unlock className="w-4 h-4" /> Decrypt Note</>
                                ) : (
                                    <><Lock className="w-4 h-4" /> Secure & Lock</>
                                )}
                            </button>
                        </div>
                    </GlassCard>
                ) : (
                    <GlassCard className="flex flex-col items-center justify-center min-h-[600px] text-center p-8 border border-white/5 border-dashed bg-black/20">
                        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <FileText className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Note Selected</h3>
                        <p className="text-gray-500 max-w-sm leading-relaxed">
                            Create a new note from the sidebar or select an existing one to view and edit its securely encrypted contents.
                        </p>
                    </GlassCard>
                )}
            </div>
        </motion.div>
    );
}
