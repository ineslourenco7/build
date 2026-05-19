'use client';
import React from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview as SandpackPreviewComponent,
} from '@codesandbox/sandpack-react';
import type { FileState } from './WorkspaceLayout';

interface SandpackPreviewWrapperProps {
  files: FileState;
}

export default function SandpackPreviewWrapper({ files }: SandpackPreviewWrapperProps) {
  // BACKEND INTEGRATION: files are passed from editor state — connect to project file storage here
  return (
    <SandpackProvider
      template="static"
      files={{
        '/index.html': { code: files['/index.html'] || '' },
        '/style.css': { code: files['/style.css'] || '' },
        '/script.js': { code: files['/script.js'] || '' },
      }}
      options={{
        recompileDelay: 500,
        recompileMode: 'delayed',
      }}
      theme="dark"
    >
      <SandpackLayout
        style={{
          height: '100%',
          border: 'none',
          borderRadius: 0,
          background: '#ffffff',
        }}
      >
        <SandpackPreviewComponent
          style={{ height: '100%' }}
          showNavigator={false}
          showOpenInCodeSandbox={false}
          showRefreshButton={false}
        />
      </SandpackLayout>
    </SandpackProvider>
  );
}