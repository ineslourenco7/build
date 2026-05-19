'use client';

import AppLayout from '@/components/AppLayout';
import { Code2, Eye, FileCode2, Loader2, Rocket, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';

type GeneratedProject = {
  html: string;
  css: string;
  js: string;
};

type ViewMode = 'preview' | 'html' | 'css' | 'js';

function defaultProject(): GeneratedProject {
  return {
    html: `<!doctype html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Café Aurora</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header class="site-header">
    <strong class="logo">Café Aurora</strong>
    <nav>
      <button data-target="home">Início</button>
      <button data-target="menu">Menu</button>
      <button data-target="about">Sobre</button>
      <button data-target="contact">Contacto</button>
    </nav>
  </header>

  <main>
    <section id="home" class="hero">
      <p class="eyebrow">Café de especialidade</p>
      <h1>Um café acolhedor para começar bem o dia.</h1>
      <p>Preview inicial em HTML/CSS/JS vanilla. Gera um novo projeto para substituir estes ficheiros.</p>
      <button class="primary" data-target="contact">Reservar mesa</button>
    </section>

    <section id="menu">
      <h2>Menu</h2>
      <div class="grid">
        <article><h3>Espresso</h3><p>Café intenso e aromático.</p></article>
        <article><h3>Brunch</h3><p>Opções frescas todos os dias.</p></article>
        <article><h3>Pastelaria</h3><p>Doces artesanais acabados de fazer.</p></article>
      </div>
    </section>

    <section id="about"><h2>Sobre</h2><p>Um espaço criado para encontros, trabalho e bons momentos.</p></section>

    <section id="contact">
      <h2>Contacto</h2>
      <form id="contactForm">
        <input placeholder="Nome" required />
        <input type="email" placeholder="Email" required />
        <textarea placeholder="Mensagem" required></textarea>
        <button class="primary" type="submit">Enviar</button>
      </form>
      <p id="successMessage" class="success">Mensagem enviada com sucesso.</p>
    </section>
  </main>

  <script src="script.js"></script>
</body>
</html>`,
    css: `:root { --accent: #b7791f; --text: #111827; --muted: #64748b; }
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; font-family: Inter, Arial, sans-serif; color: var(--text); background: #fff; }
.site-header { position: sticky; top: 0; z-index: 10; display: flex; justify-content: space-between; align-items: center; padding: 20px 7vw; background: rgba(255,255,255,.92); border-bottom: 1px solid #e5e7eb; backdrop-filter: blur(12px); }
.logo { color: var(--accent); font-size: 22px; font-weight: 900; }
nav { display: flex; gap: 12px; }
nav button { border: 0; background: transparent; color: var(--muted); font-weight: 700; cursor: pointer; }
section { padding: 76px 7vw; }
.hero { min-height: 560px; display: grid; align-content: center; background: linear-gradient(135deg, #fff7ed, #ffffff); }
.eyebrow { color: var(--accent); font-weight: 800; }
h1 { max-width: 850px; font-size: clamp(42px, 7vw, 78px); line-height: .95; letter-spacing: -.07em; margin: 0 0 20px; }
h2 { font-size: clamp(30px, 4vw, 48px); letter-spacing: -.05em; }
p { color: var(--muted); font-size: 18px; line-height: 1.7; }
.primary { border: 0; border-radius: 14px; background: var(--accent); color: white; padding: 14px 22px; font-weight: 900; cursor: pointer; width: fit-content; }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
article { border: 1px solid #e5e7eb; border-radius: 24px; padding: 28px; background: white; box-shadow: 0 16px 40px rgba(15,23,42,.06); }
form { display: grid; gap: 12px; max-width: 560px; }
input, textarea { width: 100%; border: 1px solid #d1d5db; border-radius: 14px; padding: 14px 16px; font: inherit; color: var(--text); }
textarea { min-height: 120px; }
.success { display: none; color: #047857; font-weight: 800; }
@media (max-width: 800px) { .grid { grid-template-columns: 1fr; } nav { display: none; } }`,
    js: `document.querySelectorAll('[data-target]').forEach((button) => {
  button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const form = document.getElementById('contactForm');
const success = document.getElementById('successMessage');

if (form && success) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    success.style.display = 'block';
    form.reset();
  });
}`,
  };
}

function buildPreviewDocument(project: GeneratedProject) {
  const css = `<style>${project.css}</style>`;
  const js = `<script>${project.js.replace(/<\/script>/g, '<\\/script>')}</script>`;

  return project.html
    .replace(/<link[^>]*href=["']style\.css["'][^>]*>/i, css)
    .replace(/<script[^>]*src=["']script\.js["'][^>]*><\/script>/i, js);
}

export default function AiBuilderWorkspacePage() {
  const [prompt, setPrompt] = useState('faz um site para um restaurante italiano');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('preview inicial');
  const [generatedReferenceUrl, setGeneratedReferenceUrl] = useState('');
  const [project, setProject] = useState<GeneratedProject>(() => defaultProject());
  const [view, setView] = useState<ViewMode>('preview');
  const [lastGeneratedAt, setLastGeneratedAt] = useState('');
  const [generationId, setGenerationId] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [source, setSource] = useState<'initial' | 'gemini' | 'fallback'>('initial');
  const [errorMessage, setErrorMessage] = useState('');

  const previewHtml = useMemo(() => buildPreviewDocument(project), [project]);

  async function handleGenerate() {
    setIsGenerating(true);
    setErrorMessage('');
    setView('preview');

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
      setGeneratedPrompt(prompt);
      setGeneratedReferenceUrl(referenceUrl);
      setSource(data.source === 'gemini' ? 'gemini' : 'fallback');
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
            placeholder="Ex: faz um site para um restaurante italiano"
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
            <iframe key={`${generationId}-${generatedPrompt}-${generatedReferenceUrl}`} title="Live website preview" srcDoc={previewHtml} className="w-full h-full rounded-2xl bg-white border border-border" />
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
