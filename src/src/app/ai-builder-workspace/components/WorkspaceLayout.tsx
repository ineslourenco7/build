'use client';
import React, { useState, useCallback } from 'react';
import WorkspaceHeader from './WorkspaceHeader';
import ChatPanel from './ChatPanel';
import EditorPanel from './EditorPanel';
import PreviewPanel from './PreviewPanel';

export type FileKey = '/index.html' | '/style.css' | '/script.js';

export interface FileState {
  '/index.html': string;
  '/style.css': string;
  '/script.js': string;
}

const initialFiles: FileState = {
  '/index.html': '',
  '/style.css': '',
  '/script.js': '',
};

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export default function WorkspaceLayout() {
  const [files, setFiles] = useState<FileState>(initialFiles);
  const [activeFile, setActiveFile] = useState<FileKey>('/index.html');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const updateFile = useCallback((key: FileKey, code: string) => {
    setFiles((prev) => ({ ...prev, [key]: code }));
    // Auto-save simulation
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved('just now');
    }, 800);
  }, []);

  const handleAIGenerate = useCallback((newFiles: Partial<FileState>) => {
    setFiles((prev) => ({ ...prev, ...newFiles }));
    setActiveFile('/index.html');
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved('just now');
    }, 800);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <WorkspaceHeader
        isSaving={isSaving}
        lastSaved={lastSaved}
        isStreaming={isStreaming}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Panel */}
        <div className="w-80 xl:w-96 flex-shrink-0 border-r border-border flex flex-col overflow-hidden">
          <ChatPanel
            onGenerate={handleAIGenerate}
            isStreaming={isStreaming}
            setIsStreaming={setIsStreaming}
          />
        </div>

        {/* Editor Panel */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-border min-w-0">
          <EditorPanel
            files={files}
            activeFile={activeFile}
            setActiveFile={setActiveFile}
            updateFile={updateFile}
          />
        </div>

        {/* Preview Panel */}
        <div className="w-[40%] xl:w-[42%] flex-shrink-0 flex flex-col overflow-hidden">
          <PreviewPanel
            files={files}
            deviceMode={deviceMode}
            setDeviceMode={setDeviceMode}
          />
        </div>
      </div>
    </div>
  );
}