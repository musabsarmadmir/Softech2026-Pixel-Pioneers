'use client';

import Link from 'next/link';
import { Menu, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Profile', href: '/profile' },
  { label: 'Inbox', href: '/inbox' },
  { label: 'Results', href: '/results' },
] as const;

export function AppNavigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const desktopItems = useMemo(() => {
    return navItems.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className="rounded-full px-3 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800/80 hover:text-zinc-100"
      >
        {item.label}
      </Link>
    ));
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-50">
          <span className="rounded-lg bg-blue-500/15 p-1.5 text-blue-300">
            <Sparkles className="h-4 w-4" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-wide">Pixel Pioneers</span>
            <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-400">SOFTEC 2026</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">{desktopItems}</nav>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex rounded-lg border border-white/10 p-2 text-zinc-200 transition-colors hover:bg-zinc-900 md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <nav
        className={cn(
          'overflow-hidden border-t border-white/10 bg-zinc-950/95 px-4 transition-all duration-200 md:hidden',
          mobileOpen ? 'max-h-72 py-3' : 'max-h-0 py-0',
        )}
      >
        <div className="grid gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800/80 hover:text-zinc-100"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}