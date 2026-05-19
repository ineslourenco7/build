'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  Globe,
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Briefcase,
  Cpu,
} from 'lucide-react';
import { toast } from 'sonner';

type ProjectType = 'Landing Page' | 'Portfolio' | 'Dashboard' | 'E-commerce' | 'Blog' | 'SaaS';

interface Project {
  id: string;
  name: string;
  type: ProjectType;
  description: string;
  lastModified: string;
  status: 'active' | 'draft' | 'published';
  gradientFrom: string;
  gradientTo: string;
  aiGenerations: number;
  previewIcon: React.ComponentType<{ size?: number; className?: string }>;
}

const projects: Project[] = [
  {
    id: 'proj-001',
    name: 'Lumina SaaS Landing',
    type: 'Landing Page',
    description: 'Modern SaaS landing page with hero, features, pricing sections',
    lastModified: '2 hours ago',
    status: 'published',
    gradientFrom: '#6EE7B7',
    gradientTo: '#3B82F6',
    aiGenerations: 18,
    previewIcon: Globe,
  },
  {
    id: 'proj-002',
    name: 'Artes Portfolio',
    type: 'Portfolio',
    description: 'Minimal dark portfolio for a graphic designer with gallery',
    lastModified: '1 day ago',
    status: 'active',
    gradientFrom: '#818CF8',
    gradientTo: '#EC4899',
    aiGenerations: 9,
    previewIcon: Briefcase,
  },
  {
    id: 'proj-003',
    name: 'FinTrack Dashboard',
    type: 'Dashboard',
    description: 'Analytics dashboard with charts, KPIs and data tables',
    lastModified: '3 days ago',
    status: 'active',
    gradientFrom: '#F59E0B',
    gradientTo: '#EF4444',
    aiGenerations: 31,
    previewIcon: LayoutDashboard,
  },
  {
    id: 'proj-004',
    name: 'Bloom E-commerce',
    type: 'E-commerce',
    description: 'Flower shop storefront with product grid and cart UI',
    lastModified: '5 days ago',
    status: 'draft',
    gradientFrom: '#34D399',
    gradientTo: '#10B981',
    aiGenerations: 14,
    previewIcon: ShoppingBag,
  },
  {
    id: 'proj-005',
    name: 'DevNotes Blog',
    type: 'Blog',
    description: 'Technical blog with article listings, tags and dark theme',
    lastModified: '1 week ago',
    status: 'published',
    gradientFrom: '#A78BFA',
    gradientTo: '#7C3AED',
    aiGenerations: 7,
    previewIcon: FileText,
  },
  {
    id: 'proj-006',
    name: 'CloudBase SaaS',
    type: 'SaaS',
    description: 'B2B SaaS app landing with pricing table and testimonials',
    lastModified: '2 weeks ago',
    status: 'active',
    gradientFrom: '#60A5FA',
    gradientTo: '#818CF8',
    aiGenerations: 22,
    previewIcon: Cpu,
  },
  {
    id: 'proj-007',
    name: 'Nomad Agency',
    type: 'Landing Page',
    description: 'Creative agency landing with scroll animations and portfolio',
    lastModified: '3 weeks ago',
    status: 'published',
    gradientFrom: '#F97316',
    gradientTo: '#FBBF24',
    aiGenerations: 11,
    previewIcon: Globe,
  },
  {
    id: 'proj-008',
    name: 'Anya Photography',
    type: 'Portfolio',
    description: 'Full-screen photography portfolio with lightbox gallery',
    lastModified: '1 month ago',
    status: 'draft',
    gradientFrom: '#F43F5E',
    gradientTo: '#EC4899',
    aiGenerations: 5,
    previewIcon: Briefcase,
  },
];

const statusConfig = {
  active: { label: 'Active', className: 'badge-green' },
  draft: { label: 'Draft', className: 'badge-slate' },
  published: { label: 'Published', className: 'badge-purple' },
};

const typeColors: Record<ProjectType, string> = {
  'Landing Page': 'badge-green',
  'Portfolio': 'badge-purple',
  'Dashboard': 'badge-amber',
  'E-commerce': 'badge-amber',
  'Blog': 'badge-slate',
  'SaaS': 'badge-purple',
};

export default function ProjectsGrid() {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [projectList, setProjectList] = useState(projects);

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      setProjectList((prev) => prev.filter((p) => p.id !== id));
      setDeletingId(null);
      toast.success('Project deleted');
    }, 300);
  };

  const handleDuplicate = (project: Project) => {
    const newProject = {
      ...project,
      id: `proj-${Date.now()}`,
      name: `${project.name} (Copy)`,
      status: 'draft' as const,
      lastModified: 'just now',
    };
    setProjectList((prev) => [newProject, ...prev]);
    toast.success('Project duplicated');
    setOpenMenuId(null);
  };

  if (projectList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Cpu size={28} className="text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No projects yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Start by creating your first AI-generated website. Describe what you want and BuildAI will build it.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {projectList.map((project) => {
        const PreviewIcon = project.previewIcon;
        const status = statusConfig[project.status];
        const isDeleting = deletingId === project.id;

        return (
          <div
            key={project.id}
            className={`card-base group overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg ${
              isDeleting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
            style={{ transition: 'opacity 0.3s ease, transform 0.3s ease, border-color 0.15s ease' }}
          >
            {/* Preview thumbnail */}
            <div
              className="relative h-36 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${project.gradientFrom}22, ${project.gradientTo}22)`,
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <PreviewIcon size={40} className="opacity-20 text-foreground" />
              </div>
              {/* Decorative grid lines */}
              <div className="absolute inset-0 bg-grid opacity-30" />
              {/* Glow blob */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full blur-2xl opacity-40"
                style={{ background: project.gradientFrom }}
              />
              {/* Status badge */}
              <div className="absolute top-2 right-2">
                <span className={status.className}>{status.label}</span>
              </div>

              {/* Hover overlay with open button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: 'rgba(10,10,15,0.6)' }}>
                <Link
                  href="/ai-builder-workspace"
                  className="btn-primary text-xs px-3 py-1.5"
                >
                  <ExternalLink size={12} />
                  Open Builder
                </Link>
              </div>
            </div>

            {/* Card content */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-sm text-foreground truncate flex-1">{project.name}</h3>
                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === project.id ? null : project.id)}
                    className="btn-ghost p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal size={14} />
                  </button>
                  {openMenuId === project.id && (
                    <div className="absolute right-0 top-full mt-1 w-40 card-base shadow-xl py-1 z-20 animate-fade-in">
                      <Link
                        href="/ai-builder-workspace"
                        className="flex items-center gap-2 w-full px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        onClick={() => setOpenMenuId(null)}
                      >
                        <ExternalLink size={12} /> Open in Builder
                      </Link>
                      <button
                        onClick={() => { toast.info('Rename coming soon'); setOpenMenuId(null); }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <Pencil size={12} /> Rename
                      </button>
                      <button
                        onClick={() => handleDuplicate(project)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <Copy size={12} /> Duplicate
                      </button>
                      <div className="border-t border-border mt-1 pt-1">
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className={`${typeColors[project.type]} text-xs`}>{project.type}</span>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{project.description}</p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{project.lastModified}</span>
                <span className="flex items-center gap-1">
                  <Cpu size={10} className="text-accent" />
                  {project.aiGenerations} generations
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}