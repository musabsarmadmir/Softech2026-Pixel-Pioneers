import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Space_Grotesk, Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { AppNavigation } from '@/components/navigation/app-navigation';
import { AppStateProvider } from '@/components/shared/app-state-provider';
import './globals.css';

const displayFont = Space_Grotesk({
  variable: '--font-display',
  subsets: ['latin'],
});

const bodyFont = Plus_Jakarta_Sans({
  variable: '--font-body',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'OppuCopilot AI',
  description: 'Opportunity Inbox Copilot for SOFTEC 2026',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${displayFont.variable} ${bodyFont.variable} bg-background font-body text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AppStateProvider>
            <div className="relative min-h-screen overflow-x-hidden">
              <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(56,189,248,0.15),transparent_25%),radial-gradient(circle_at_85%_15%,rgba(192,132,252,0.12),transparent_25%),radial-gradient(circle_at_50%_80%,rgba(45,212,191,0.1),transparent_30%),linear-gradient(180deg,#09090b_0%,#020617_100%)]" />
              <AppNavigation />
              <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">{children}</main>
            </div>
          </AppStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}