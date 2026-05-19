'use client';

import AppLayout from '@/components/AppLayout';
import { AlertTriangle, Code2, Eye, FileCode2, Loader2, Rocket, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';

type GeneratedProject = {
  html: string;
  css: string;
  js: string;
};

type ViewMode = 'preview' | 'html' | 'css' | 'js';

function emptyProject(message = 'Pronto para gerar um novo projeto'): GeneratedProject {
  return {
    html: `<!doctype html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <main class="empty">
    <p>BuildAI</p>
    <h1>${message}</h1>
    <span>Escreve um prompt e clica em Generate Vanilla Project.</span>
  </main>
  <script src="script.js"></script>
</body>
</html>`,
    css: `body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0f172a; color: white; font-family: Arial, Helvetica, sans-serif; }
.empty { text-align: center; max-width: 640px; padding: 48px; }
p { color: #6ee7b7; font-weight: 900; letter-spacing: .18em; text-transform: uppercase; }
h1 { font-size: clamp(36px, 6vw, 72px); line-height: .95; letter-spacing: -.06em; margin: 0 0 18px; }
span { color: #94a3b8; font-size: 18px; }`,
    js: '',
  };
}

function buildPreviewDocument(project: GeneratedProject) {
  const css = `<style>${project.css}</style>`;
  const safeJs = project.js.replace(/<\/script>/g, '<\\/script>');
  const guard = `<script>
    document.addEventListener('click', function(event) {
      var target = event.target.closest && event.target.closest('a');
      if (target) {
        var href = target.getAttribute('href') || '';
        if (href.startsWith('#')) return;
        event.preventDefault();
      }
    }, true);
  </script>`;
  const js = `${guard}<script>${safeJs}</script>`;

  const withCss = project.html.match(/<link[^>]*href=["']style\.css["'][^>]*>/i)
    ? project.html.replace(/<link[^>]*href=["']style\.css["'][^>]*>/i, css)
    : project.html.replace('</head>', `${css}</head>`);

  return withCss.match(/<script[^>]*src=["']script\.js["'][^>]*><\/script>/i)
    ? withCss.replace(/<script[^>]*src=["']script\.js["'][^>]*><\/script>/i, js)
    : withCss.replace('</body>', `${js}</body>`);
}

export default function AiBuilderWorkspacePage() {
  const [prompt, setPrompt] = useState('faz um site ultra premium para um hotel boutique minimalista em lisboa');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('nenhum ainda');
  const [generatedReferenceUrl, setGeneratedReferenceUrl] = useState('');
  const [project, setProject] = useState<GeneratedProject>(() => emptyProject());
  const [view, setView] = useState<ViewMode>('preview');
  const [lastGeneratedAt, setLastGeneratedAt] = useState('');
  const [generationId, setGenerationId] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [source, setSource] = useState<'initial' | 'gemini' | 'fallback'>('initial');
  const [errorMessage, setErrorMessage] = useState('');
  const [geminiError, setGeminiError] = useState('');

  const previewHtml = useMemo(() => buildPreviewDocument(project), [project]);

  async function handleGenerate() {
    setIsGenerating(true);
    setErrorMessage('');
    setGeminiError('');
    setView('preview');
    setSource('initial');
    setGeneratedPrompt(prompt);
    setGeneratedReferenceUrl(referenceUrl);
    setProject(emptyProject('A gerar o teu novo website...'));
    setGenerationId((current) => current + 1);

    try {
      const response = await fetch('/api/generate-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, referenceUrl }),
      });

      const data = await response.json();

      if (!data?.project?.html || !data?.project?.css || !data?.project?.js) {
        throw new Error('A resposta da IA não trouxe os ficheiros esperados.');
      }

      setProject(data.project);
      setSource(data.source === 'gemini' ? 'gemini' : 'fallback');
      setGeminiError(data.error ? String(data.error) : '');
      setGenerationId((current) => current + 1);
      setLastGeneratedAt(new Date().toLocaleTimeString('pt-PT'));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao gerar projeto.');
    } finally {
      setIsGenerating(false);
    }
  }

  const currentCode = view === 'html' ? project.html : view === 'css' ? project.css : project.js;
  const currentFilename = view === 'html' ? 'index.html' : view === 'css' ? 'style.css' : 'script.js';

  return (
    <AppLayout fullHeight>
      <div className="h-[calc(100vh-3.5rem)] grid grid-cols-1 lg:grid-cols-[420px_1fr] overflow-hidden">
        <aside className="border-r border-border bg-card/70 p-5 overflow-y-auto">
          <div className="inline-flex items-center gap-2 badge-green mb-4">
            <Sparkles size={14} />
            Vanilla HTML/CSS/JS Builder
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Gera projetos vanilla com IA</h1>
          <p className="text-sm text-muted-foreground mb-6">
            O Gemini gera ficheiros separados: index.html, style.css e script.js. O preview junta tudo em tempo real.
          </p>

          <label className="text-sm font-medium text-foreground mb-2 block">Pedido</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full min-h-32 resize-none mb-4 rounded-lg border border-border bg-[#0f172a] px-3 py-3 text-sm text-white placeholder:text-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Ex: faz um site premium para um hotel boutique em Lisboa"
          />

          <label className="text-sm font-medium text-foreground mb-2 block">Link de inspiração opcional</label>
          <input
            value={referenceUrl}
            onChange={(e) => setReferenceUrl(e.target.value)}
            className="w-full mb-4 rounded-lg border border-border bg-[#0f172a] px-3 py-3 text-sm text-white placeholder:text-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="https://exemplo.com"
          />

          <button onClick={handleGenerate} disabled={isGenerating} className="btn-primary w-full mb-3 disabled:opacity-60 disabled:cursor-not-allowed">
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />}
            {isGenerating ? 'Generating...' : 'Generate Vanilla Project'}
          </button>

          {errorMessage && (
            <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200">
              {errorMessage}
            </div>
          )}

          <div className="mb-4 rounded-lg border border-border bg-background/60 p-3 text-xs text-muted-foreground">
            <p><strong className="text-foreground">Último prompt:</strong> {generatedPrompt}</p>
            {generatedReferenceUrl && <p className="mt-1"><strong className="text-foreground">Inspiração:</strong> {generatedReferenceUrl}</p>}
            {lastGeneratedAt && <p className="mt-1">Gerado às {lastGeneratedAt}</p>}
            <p className="mt-1"><strong className="text-foreground">Fonte:</strong> {source}</p>
          </div>

          {geminiError && (
            <div className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-100">
              <div className="flex items-center gap-2 font-semibold text-amber-200 mb-2">
                <AlertTriangle size={14} />
                Gemini error
              </div>
              <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed">
                {geminiError}
              </pre>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setView('preview')} className={view === 'preview' ? 'btn-primary' : 'btn-secondary'}>
              <Eye size={16} /> Preview
            </button>
            <button onClick={() => setView('html')} className={view === 'html' ? 'btn-primary' : 'btn-secondary'}>
              <FileCode2 size={16} /> HTML
            </button>
            <button onClick={() => setView('css')} className={view === 'css' ? 'btn-primary' : 'btn-secondary'}>
              <Code2 size={16} /> CSS
            </button>
            <button onClick={() => setView('js')} className={view === 'js' ? 'btn-primary' : 'btn-secondary'}>
              <Code2 size={16} /> JS
            </button>
          </div>
        </aside>

        <main className="bg-background p-4 overflow-hidden">
          {view === 'preview' ? (
            <iframe
              key={`${generationId}-${generatedPrompt}-${generatedReferenceUrl}`}
              title="Live website preview"
              srcDoc={previewHtml}
              sandbox="allow-scripts allow-forms allow-same-origin"
              className="w-full h-full rounded-2xl bg-white border border-border"
            />
          ) : (
            <div className="w-full h-full rounded-2xl border border-border bg-black/40 overflow-hidden flex flex-col">
              <div className="border-b border-border px-4 py-2 text-xs text-muted-foreground flex items-center gap-2">
                <FileCode2 size={14} />
                {currentFilename}
              </div>
              <pre className="flex-1 overflow-auto p-4 text-xs text-foreground whitespace-pre-wrap">
                {currentCode}
              </pre>
            </div>
          )}
        </main>
      </div>
    </AppLayout>
  );
}
