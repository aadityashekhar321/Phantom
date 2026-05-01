'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';

export type Locale = 'en' | 'hi';

const locales: Record<Locale, typeof en> = { en, hi };

interface LanguageContextType {
    locale: Locale;
    setLocale: (l: Locale) => void;
    t: typeof en;
}

const LanguageContext = createContext<LanguageContextType>({
    locale: 'en',
    setLocale: () => {},
    t: en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(() => {
        if (typeof window === 'undefined') return 'en';

        try {
            const stored = sessionStorage.getItem('phantom-locale') as Locale | null;
            return stored && stored in locales ? stored : 'en';
        } catch {
            return 'en';
        }
    });

    useEffect(() => {
        document.documentElement.setAttribute('lang', locale);

        try {
            sessionStorage.setItem('phantom-locale', locale);
        } catch {
            // Ignore storage failures in restricted browsing modes.
        }
    }, [locale]);

    const setLocale = useCallback((l: Locale) => {
        setLocaleState(l);
    }, []);

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t: locales[locale] }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);

/** Short-hand hook — returns the translation object only */
export const useT = () => useContext(LanguageContext).t;
