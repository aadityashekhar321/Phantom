'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'phantom' | 'crimson' | 'matrix';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'phantom',
    setTheme: () => { },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('phantom');

    useEffect(() => {
        const stored = (sessionStorage.getItem('phantom-theme') as Theme) || 'phantom';
        setThemeState(stored);
        document.documentElement.setAttribute('data-theme', stored);
    }, []);

    const setTheme = (t: Theme) => {
        setThemeState(t);
        document.documentElement.setAttribute('data-theme', t);
        sessionStorage.setItem('phantom-theme', t);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
