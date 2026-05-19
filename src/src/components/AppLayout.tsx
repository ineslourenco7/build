import React from 'react';
import AppTopbar from './AppTopbar';

interface AppLayoutProps {
  children: React.ReactNode;
  fullHeight?: boolean;
}

export default function AppLayout({ children, fullHeight = false }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background bg-grid">
      <AppTopbar />
      <main className={`pt-14 ${fullHeight ? 'h-screen overflow-hidden' : ''}`}>
        {children}
      </main>
    </div>
  );
}