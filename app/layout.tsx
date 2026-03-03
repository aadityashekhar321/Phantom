import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SettingsProvider } from '@/components/SettingsProvider';
import { AmbientBackground } from '@/components/AmbientBackground';
import { OfflineBadge } from '@/components/OfflineBadge';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from 'sonner';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Phantom | Secure & Invisible Communication',
  description: 'Convert messages into unreadable encoded text securely entirely in your browser using AES-256-GCM.',
  manifest: '/manifest.json',
  keywords: ['encryption', 'AES-256', 'privacy', 'steganography', 'zero knowledge', 'secure messaging'],
  openGraph: {
    title: 'Phantom | Military-Grade Encryption',
    description: 'Lock messages with AES-256-GCM. Zero servers. Zero trace. Runs entirely in your browser.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${jetbrainsMono.variable} font-sans min-h-screen bg-black text-white selection:bg-indigo-500/50 overflow-x-hidden flex flex-col`}>
        <ThemeProvider>
          <SettingsProvider>
            {/* Dynamic Ambient Background (theme-aware) */}
            <AmbientBackground />

            <Navbar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col pt-16 pb-32 items-center w-full px-4 sm:px-6">
              <div className="max-w-5xl w-full">
                {children}
              </div>
            </main>

            <Footer />

            <OfflineBadge />
            <Toaster theme="dark" position="bottom-center" toastOptions={{ className: 'font-sans' }} />
            <Analytics />
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
