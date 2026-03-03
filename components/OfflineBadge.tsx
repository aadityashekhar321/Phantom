'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineBadge() {
    const [online, setOnline] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setOnline(navigator.onLine);

        const handleOnline = () => setOnline(true);
        const handleOffline = () => setOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Avoid hydration mismatch
    if (!mounted) return null;

    return (
        <div
            className={`fixed bottom-[5.5rem] sm:bottom-6 left-4 sm:left-6 z-[80] flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border transition-all duration-500 select-none ${online
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}
            title={online ? 'This app runs fully locally — no internet required' : 'You are offline — Phantom still works!'}
        >
            {online ? (
                <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                    <span>Local · Offline-Ready</span>
                </>
            ) : (
                <>
                    <WifiOff className="w-3 h-3 flex-shrink-0" />
                    <span>Offline Mode</span>
                </>
            )}
        </div>
    );
}
