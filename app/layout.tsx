import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from 'sonner';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Phantom | Secure & Invisible Communication',
  description: 'Convert messages into unreadable encoded text securely entirely in your browser using AES-256-GCM.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${jetbrainsMono.variable} font-sans min-h-screen bg-black text-white selection:bg-indigo-500/50 overflow-x-hidden flex flex-col`}>
        {/* Background Effects */}
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>
        <div className="fixed bottom-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-[-2]"></div>
        <div className="fixed top-20 left-10 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none z-[-2]"></div>
        <div className="fixed top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none z-[-1]"></div>

        <Navbar />

        {/* Main Content */}
        <main className="flex-1 flex flex-col pt-16 pb-32 items-center w-full px-4 sm:px-6">
          <div className="max-w-4xl w-full">
            {children}
          </div>
        </main>

        <Toaster theme="dark" position="bottom-center" toastOptions={{ className: 'font-sans' }} />
        <Analytics />
      </body>
    </html>
  );
}
