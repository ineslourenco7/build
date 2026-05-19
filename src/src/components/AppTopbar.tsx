'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutGrid,
  Cpu,
  Bell,
  ChevronDown,
  User,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const navItems = [
  { label: 'Projects', href: '/', icon: LayoutGrid },
  { label: 'AI Builder', href: '/ai-builder-workspace', icon: Cpu },
];

export default function AppTopbar() {
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 glass border-b border-border">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <AppLogo size={28} />
            <span className="font-semibold text-base tracking-tight text-gradient-primary hidden sm:block">
              BuildAI
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems?.map((item) => {
              const Icon = item?.icon;
              const isActive = pathname === item?.href || (item?.href !== '/' && pathname?.startsWith(item?.href));
              return (
                <Link
                  key={`nav-${item?.label?.toLowerCase()}`}
                  href={item?.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon size={14} />
                  {item?.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="btn-ghost relative p-2 rounded-lg">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-all duration-150"
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}>
                M
              </div>
              <span className="hidden sm:block text-sm font-medium text-foreground">Miguel</span>
              <ChevronDown size={14} className="text-muted-foreground" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 card-base shadow-xl py-1 animate-fade-in z-50">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm font-medium text-foreground">Miguel Santos</p>
                  <p className="text-xs text-muted-foreground">miguel@buildai.dev</p>
                </div>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <User size={14} /> Profile
                </button>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Settings size={14} /> Settings
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 glass border-b border-border py-2 px-4 animate-slide-up">
          {navItems?.map((item) => {
            const Icon = item?.icon;
            const isActive = pathname === item?.href;
            return (
              <Link
                key={`mobile-nav-${item?.label?.toLowerCase()}`}
                href={item?.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1 ${
                  isActive
                    ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon size={16} />
                {item?.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}