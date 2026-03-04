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
    const [locale, setLocaleState] = useState<Locale>('en');

    useEffect(() => {
        const stored = (sessionStorage.getItem('phantom-locale') as Locale) || 'en';
        setLocaleState(stored in locales ? stored : 'en');
    }, []);

    const setLocale = useCallback((l: Locale) => {
        setLocaleState(l);
        sessionStorage.setItem('phantom-locale', l);
        // Update <html lang="…"> for SEO / a11y
        document.documentElement.setAttribute('lang', l);
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
