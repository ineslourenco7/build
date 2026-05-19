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
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <AppLogo size={28} />
            <span className="font-semibold text-base tracking-tight text-gradient-primary hidden sm:block">
              BuildAI
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}