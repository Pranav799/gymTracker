"use client";

import React, { useState } from 'react';
import { Home, Dumbbell, Trophy, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const NAV_ITEMS = [
    { label: 'Planner', icon: Home, path: '/' },
    { label: 'Workouts', icon: Dumbbell, path: '/workouts' },
    { label: 'Social', icon: Trophy, path: '/social' },
    { label: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto relative bg-background">
      {/* Main Content Area (Scrollable) */}
      <main className="flex-1 overflow-y-auto w-full pb-24 scrollbar-hide">
        {children}
      </main>

      {/* iOS Style Bottom Tab Navigation */}
      <nav className="absolute bottom-0 w-full bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 pb-safe shadow-lg z-50">
        <div className="flex justify-around items-center h-16">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/');
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.path)}
                className="flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform"
              >
                <item.icon 
                  className={`w-6 h-6 ${isActive ? 'text-black dark:text-white stroke-[2.5px]' : 'text-gray-400 stroke-[2px]'}`}
                />
                <span className={`text-[10px] font-semibold ${isActive ? 'text-black dark:text-white' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        {/* iOS safe area spacing, optionally using env(safe-area-inset-bottom) if defined in global CSS */}
        <div className="h-6 w-full" /> 
      </nav>
    </div>
  );
}
