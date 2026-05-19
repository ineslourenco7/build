'use client';
import React, { Suspense, lazy } from 'react';
import { Monitor, Tablet, Smartphone, RefreshCw, ExternalLink } from 'lucide-react';
import type { DeviceMode, FileState } from './WorkspaceLayout';
import Icon from '@/components/ui/AppIcon';


// Lazy load Sandpack to prevent SSR issues
const SandpackPreview = lazy(() => import('./SandpackPreviewWrapper'));

interface PreviewPanelProps {
  files: FileState;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
}

const deviceConfig: Record<DeviceMode, { width: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  desktop: { width: '100%', icon: Monitor },
  tablet: { width: '768px', icon: Tablet },
  mobile: { width: '390px', icon: Smartphone },
};

const DEVICE_BUTTONS: { mode: DeviceMode; label: string }[] = [
  { mode: 'desktop', label: 'Desktop' },
  { mode: 'tablet', label: 'Tablet' },
  { mode: 'mobile', label: 'Mobile' },
];

function PreviewSkeleton() {
  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-muted-foreground">Loading preview...</p>
      </div>
    </div>
  );
}

export default function PreviewPanel({ files, deviceMode, setDeviceMode }: PreviewPanelProps) {
  const { width } = deviceConfig[deviceMode];
  const hasContent = files['/index.html'].trim().length > 0;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Preview header */}
      <div
        className="flex items-center justify-between px-3 py-2.5 border-b border-border flex-shrink-0"
        style={{ background: 'var(--card)' }}
      >
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
        </div>

        {/* URL bar */}
        <div
          className="flex-1 mx-3 px-3 py-1 rounded text-xs text-muted-foreground flex items-center gap-2"
          style={{ background: 'var(--input)', border: '1px solid var(--border)' }}
        >
          <div className="w-3 h-3 rounded-full bg-green-400/70 flex-shrink-0" />
          <span className="truncate">localhost:3000</span>
        </div>

        {/* Device toggle */}
        <div className="flex items-center gap-0.5">
          {DEVICE_BUTTONS.map(({ mode, label }) => {
            const Icon = deviceConfig[mode].icon;
            return (
              <button
                key={`device-${mode}`}
                onClick={() => setDeviceMode(mode)}
                title={label}
                className={`p-1.5 rounded-md transition-all duration-150 ${
                  deviceMode === mode
                    ? 'bg-primary/15 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon size={13} />
              </button>
            );
          })}
          <div className="w-px h-4 bg-border mx-1" />
          <button className="btn-ghost p-1.5">
            <RefreshCw size={13} />
          </button>
          <button className="btn-ghost p-1.5">
            <ExternalLink size={13} />
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto flex justify-center bg-zinc-950 scrollbar-thin">
        {!hasContent ? (
          <div className="flex flex-col items-center justify-center text-center p-8 h-full">
            <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
              <Monitor size={28} className="text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-2">No preview yet</h3>
            <p className="text-xs text-muted-foreground max-w-xs">
              Ask the AI to generate a website or start typing in the editor. Your site will appear here instantly.
            </p>
          </div>
        ) : (
          <div
            className="h-full transition-all duration-300"
            style={{ width, minWidth: '320px' }}
          >
            <Suspense fallback={<PreviewSkeleton />}>
              <SandpackPreview files={files} />
            </Suspense>
          </div>
        )}
      </div>

      {/* Preview footer */}
      <div
        className="flex items-center justify-between px-4 py-1.5 border-t border-border flex-shrink-0 text-xs text-muted-foreground"
        style={{ background: 'var(--card)' }}
      >
        <span className="capitalize">{deviceMode} view</span>
        <span>{width === '100%' ? 'Fluid' : width}</span>
      </div>
    </div>
  );
}