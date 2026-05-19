'use client';
import React, { useState, Suspense, lazy } from 'react';
import { FileCode, FileType, FileCode2, ChevronRight } from 'lucide-react';
import type { FileKey, FileState } from './WorkspaceLayout';
import Icon from '@/components/ui/AppIcon';


// Lazy load Monaco editor to prevent blocking render
const MonacoEditorWrapper = lazy(() => import('./MonacoEditorWrapper'));

interface EditorPanelProps {
  files: FileState;
  activeFile: FileKey;
  setActiveFile: (key: FileKey) => void;
  updateFile: (key: FileKey, code: string) => void;
}

const FILE_TABS: { key: FileKey; label: string; language: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { key: '/index.html', label: 'index.html', language: 'html', icon: FileCode },
  { key: '/style.css', label: 'style.css', language: 'css', icon: FileType },
  { key: '/script.js', label: 'script.js', language: 'javascript', icon: FileCode2 },
];

const languageColors: Record<string, string> = {
  html: '#F97316',
  css: '#818CF8',
  javascript: '#FBBF24',
};

function EditorSkeleton() {
  return (
    <div className="flex-1 bg-background animate-pulse">
      <div className="p-4 space-y-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`skel-line-${i + 1}`}
            className="h-4 rounded bg-muted/40"
            style={{ width: `${30 + (i % 7) * 10}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function EditorPanel({ files, activeFile, setActiveFile, updateFile }: EditorPanelProps) {
  const activeTab = FILE_TABS.find((t) => t.key === activeFile)!;
  const lineCount = files[activeFile].split('\n').length || 1;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* File tabs */}
      <div className="flex items-center border-b border-border flex-shrink-0" style={{ background: 'var(--card)' }}>
        <div className="flex items-center">
          {FILE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFile === tab.key;
            return (
              <button
                key={`tab-${tab.key}`}
                onClick={() => setActiveFile(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-r border-border transition-all duration-150 relative ${
                  isActive
                    ? 'bg-background text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                <Icon size={12} style={{ color: isActive ? languageColors[tab.language] : undefined }} />
                {tab.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: languageColors[tab.language] }}
                  />
                )}
              </button>
            );
          })}
        </div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 px-3 text-xs text-muted-foreground ml-auto">
          <span>project</span>
          <ChevronRight size={10} />
          <span style={{ color: languageColors[activeTab.language] }}>{activeTab.label}</span>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<EditorSkeleton />}>
          <MonacoEditorWrapper
            value={files[activeFile]}
            language={activeTab.language}
            onChange={(val) => updateFile(activeFile, val ?? '')}
          />
        </Suspense>
      </div>

      {/* Status bar */}
      <div
        className="flex items-center justify-between px-4 py-1.5 text-xs border-t border-border flex-shrink-0"
        style={{ background: 'var(--card)' }}
      >
        <div className="flex items-center gap-3 text-muted-foreground">
          <span
            className="flex items-center gap-1 font-medium"
            style={{ color: languageColors[activeTab.language] }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: languageColors[activeTab.language] }} />
            {activeTab.language.toUpperCase()}
          </span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <span>{lineCount} lines</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </div>
  );
}