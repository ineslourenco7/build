'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Globe, Briefcase, LayoutDashboard, ShoppingBag, FileText, Cpu, ArrowRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';


interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
}

type Template = {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
};

const templates: Template[] = [
  { id: 'tpl-landing', name: 'Landing Page', description: 'Hero, features, pricing & CTA', icon: Globe, color: 'var(--primary)' },
  { id: 'tpl-portfolio', name: 'Portfolio', description: 'Showcase your work & skills', icon: Briefcase, color: 'var(--accent)' },
  { id: 'tpl-dashboard', name: 'Dashboard', description: 'Charts, KPIs and data tables', icon: LayoutDashboard, color: '#F59E0B' },
  { id: 'tpl-ecommerce', name: 'E-commerce', description: 'Product grid with cart UI', icon: ShoppingBag, color: '#34D399' },
  { id: 'tpl-blog', name: 'Blog', description: 'Articles, tags and categories', icon: FileText, color: '#A78BFA' },
  { id: 'tpl-blank', name: 'Blank', description: 'Start from an empty canvas', icon: Cpu, color: '#64748B' },
];

interface FormValues {
  name: string;
  prompt: string;
}

export default function NewProjectModal({ open, onClose }: NewProjectModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('tpl-landing');
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: { name: '', prompt: '' },
  });

  const onSubmit = async (data: FormValues) => {
    setIsCreating(true);
    // BACKEND INTEGRATION: POST /api/projects { name, template: selectedTemplate, prompt }
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsCreating(false);
    toast.success(`"${data.name}" created — opening builder`);
    reset();
    onClose();
    router.push('/ai-builder-workspace');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div
        className="card-base w-full max-w-lg animate-slide-up shadow-2xl"
        style={{ boxShadow: '0 0 60px rgba(110, 231, 183, 0.08)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h2 className="text-base font-semibold text-foreground">New Project</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Choose a template and describe your site</p>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-5">
          {/* Project name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Project Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Lumina SaaS Landing"
              className="input-base"
              {...register('name', { required: 'Project name is required', minLength: { value: 2, message: 'At least 2 characters' } })}
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Template selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Template
            </label>
            <div className="grid grid-cols-3 gap-2">
              {templates.map((tpl) => {
                const Icon = tpl.icon;
                const isSelected = selectedTemplate === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-center transition-all duration-150 ${
                      isSelected
                        ? 'border-primary/50 bg-primary/8' :'border-border bg-muted/30 hover:border-border hover:bg-muted/50'
                    }`}
                    style={isSelected ? { boxShadow: '0 0 12px rgba(110,231,183,0.1)' } : {}}
                  >
                    <Icon size={18} style={{ color: isSelected ? tpl.color : 'var(--muted-foreground)' }} />
                    <span className={`text-xs font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {tpl.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Prompt */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Describe your website
              <span className="text-muted-foreground font-normal ml-1">(optional — AI will generate from this)</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. A modern SaaS landing page for a project management tool, dark theme, with hero, features section, and a pricing table..."
              className="input-base resize-none"
              {...register('prompt')}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isCreating} className="btn-primary min-w-[130px]">
              {isCreating ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create Project
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}