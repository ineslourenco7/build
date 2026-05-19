'use client';
import React, { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';

interface MonacoEditorWrapperProps {
  value: string;
  language: string;
  onChange: (value: string | undefined) => void;
}

export default function MonacoEditorWrapper({ value, language, onChange }: MonacoEditorWrapperProps) {
  const editorRef = useRef<unknown>(null);

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;
    // BACKEND INTEGRATION: Editor is mounted — connect to collaborative editing websocket here
  };

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      theme="vs-dark"
      onChange={onChange}
      onMount={handleMount}
      options={{
        fontSize: 13,
        fontFamily: "'JetBrains Mono', 'Cascadia Code', 'Fira Code', monospace",
        fontLigatures: true,
        lineHeight: 22,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        padding: { top: 16, bottom: 16 },
        renderLineHighlight: 'gutter',
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        tabSize: 2,
        automaticLayout: true,
        formatOnPaste: true,
        formatOnType: true,
        suggestOnTriggerCharacters: true,
        quickSuggestions: { other: true, comments: false, strings: true },
        acceptSuggestionOnEnter: 'on',
        bracketPairColorization: { enabled: true },
        guides: {
          bracketPairs: true,
          indentation: true,
        },
        scrollbar: {
          verticalScrollbarSize: 4,
          horizontalScrollbarSize: 4,
        },
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
        glyphMargin: false,
        folding: true,
        lineNumbers: 'on',
        lineNumbersMinChars: 3,
      }}
      loading={
        <div className="flex items-center justify-center h-full bg-background">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-muted-foreground">Loading editor...</p>
          </div>
        </div>
      }
    />
  );
}