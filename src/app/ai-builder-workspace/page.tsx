import AppLayout from '@/components/AppLayout';
import { Cpu, Sparkles, Code2, Eye, Rocket } from 'lucide-react';

export default function AiBuilderWorkspacePage() {
  return (
    <AppLayout>
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16 py-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 badge-green mb-4">
            <Sparkles size={14} />
            AI Builder
          </div>
          <h1 className="text-3xl font-semibold text-foreground tracking-tight mb-2">
            AI Builder Workspace
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            This is the workspace where your AI website builder will live. The project is now routed correctly and ready for the next development step.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="card-base p-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Cpu size={20} className="text-primary" />
            </div>
            <h2 className="font-semibold text-foreground mb-2">Prompt</h2>
            <p className="text-sm text-muted-foreground">
              Describe the website you want to generate.
            </p>
          </div>

          <div className="card-base p-5">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <Code2 size={20} className="text-accent" />
            </div>
            <h2 className="font-semibold text-foreground mb-2">Code</h2>
            <p className="text-sm text-muted-foreground">
              Generated code and components will appear here.
            </p>
          </div>

          <div className="card-base p-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center mb-4">
              <Eye size={20} className="text-emerald-400" />
            </div>
            <h2 className="font-semibold text-foreground mb-2">Preview</h2>
            <p className="text-sm text-muted-foreground">
              Preview the generated website before publishing.
            </p>
          </div>
        </div>

        <div className="card-base p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Ready for the next step</h2>
              <p className="text-sm text-muted-foreground">
                The workspace route exists now. Next we can connect the real AI generation flow, templates, editor and live preview.
              </p>
            </div>
            <button className="btn-primary self-start lg:self-auto">
              <Rocket size={16} />
              Start Building
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
