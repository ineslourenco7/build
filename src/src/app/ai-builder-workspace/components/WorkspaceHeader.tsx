'use client';
import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { ChevronLeft, Download, Rocket, Loader2, CheckCircle2, Wifi,  } from 'lucide-react';
import { toast } from 'sonner';

interface WorkspaceHeaderProps {
  isSaving: boolean;
  lastSaved: string | null;
  isStreaming: boolean;
}

export default function WorkspaceHeader({ isSaving, lastSaved, isStreaming }: WorkspaceHeaderProps) {
  const handleDeploy = () => {
    toast.success('Deploy initiated — your site will be live in ~30 seconds');
  };

  const handleExport = () => {
    toast.info('ZIP export coming soon in Pro plan');
  };

  return (
    <header className="h-12 flex items-center justify-between px-4 border-b border-border glass z-10 flex-shrink-0">
      {/* Left: back + project name */}
      <div className="flex items-center gap-3">
        <Link href="/" className="btn-ghost p-1.5 flex items-center gap-1 text-xs">
          <ChevronLeft size={14} />
          <span className="hidden sm:inline">Projects</span>
        </Link>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2">
          <AppLogo size={20} />
          <span className="text-sm font-medium text-foreground">Lumina SaaS Landing</span>
          <span className="badge-green">Active</span>
        </div>
      </div>

      {/* Center: save status */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {isStreaming && (
          <span className="flex items-center gap-1.5 text-accent">
            <Wifi size={12} className="animate-pulse" />
            AI generating...
          </span>
        )}
        {!isStreaming && isSaving && (
          <span className="flex items-center gap-1.5">
            <Loader2 size={12} className="animate-spin" />
            Saving...
          </span>
        )}
        {!isStreaming && !isSaving && lastSaved && (
          <span className="flex items-center gap-1.5 text-primary">
            <CheckCircle2 size={12} />
            Saved {lastSaved}
          </span>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <button onClick={handleExport} className="btn-secondary text-xs px-3 py-1.5 hidden sm:flex">
          <Download size={13} />
          Export
        </button>
        <button onClick={handleDeploy} className="btn-primary text-xs px-3 py-1.5">
          <Rocket size={13} />
          Deploy
        </button>
      </div>
    </header>
  );
}