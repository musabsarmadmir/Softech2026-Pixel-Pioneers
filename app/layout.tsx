import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { AppNavigation } from '@/components/navigation/app-navigation';
import { AppStateProvider } from '@/components/shared/app-state-provider';
import './globals.css';

const displayFont = Inter({
  variable: '--font-display',
  subsets: ['latin'],
});

const bodyFont = Plus_Jakarta_Sans({
  variable: '--font-body',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pixel Pioneers',
  description: 'Pixel Pioneers for SOFTEC 2026',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${displayFont.variable} ${bodyFont.variable} bg-background font-body text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AppStateProvider>
            <div className="relative min-h-screen overflow-x-hidden bg-background">
              <AppNavigation />
              <main className="mx-auto w-full max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8">{children}</main>
            </div>
          </AppStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}