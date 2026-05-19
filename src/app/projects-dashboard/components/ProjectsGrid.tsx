'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Globe, LayoutDashboard, Briefcase, Cpu } from 'lucide-react';

const projects = [
  { id: '1', name: 'SaaS Landing Page', type: 'Landing Page', description: 'Modern landing page generated with AI.', icon: Globe },
  { id: '2', name: 'Portfolio Website', type: 'Portfolio', description: 'Clean portfolio website for creators.', icon: Briefcase },
  { id: '3', name: 'Admin Dashboard', type: 'Dashboard', description: 'Dashboard UI with cards and metrics.', icon: LayoutDashboard },
  { id: '4', name: 'AI Builder Demo', type: 'Builder', description: 'Start building a new website with AI.', icon: Cpu },
];

export default function ProjectsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {projects.map((project) => {
        const Icon = project.icon;
        return (
          <div key={project.id} className="card-base p-5 hover:border-primary/40 transition-all">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Icon size={22} className="text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">{project.type}</p>
            <h3 className="font-semibold text-foreground mb-2">{project.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
            <Link href="/ai-builder-workspace" className="btn-primary text-xs px-3 py-2">
              <ExternalLink size={12} />
              Open Builder
            </Link>
          </div>
        );
      })}
    </div>
  );
}
