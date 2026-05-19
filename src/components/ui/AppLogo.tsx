'use client';

import React from 'react';

interface AppLogoProps {
  size?: number;
  className?: string;
  onClick?: () => void;
}

export default function AppLogo({ size = 28, className = '', onClick }: AppLogoProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold ${className}`}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      B
    </div>
  );
}
