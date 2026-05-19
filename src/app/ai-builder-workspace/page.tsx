'use client';

import AppLayout from '@/components/AppLayout';
import { Code2, Eye, Rocket, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';

function buildSite(prompt: string) {
  const cleanPrompt = prompt.trim() || 'um negócio local moderno';
  const isCafe = cleanPrompt.toLowerCase().includes('cafe') || cleanPrompt.toLowerCase().includes('café');
  const businessName = isCafe ? 'Café Aurora' : 'Nova Marca';
  const accent = isCafe ? '#b7791f' : '#6366f1';
  const secondary = isCafe ? '#fff7ed' : '#eef2ff';
  const headline = isCafe
    ? 'Café artesanal, ambiente acolhedor e sabores memoráveis'
    : `Website profissional para ${cleanPrompt}`;
  const description = isCafe
    ? 'Pequenos-almoços, brunch e café de especialidade no centro da cidade.'
    : 'Uma presença digital moderna, rápida e pensada para converter visitantes em clientes.';

  return `<!doctype html>
<html lang="pt">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${businessName}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, system-ui, Arial, sans-serif; color: #111827; background: #ffffff; }
    header { padding: 24px 7vw; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; }
    .logo { font-weight: 800; font-size: 22px; color: ${accent}; }
    nav { display: flex; gap: 20px; color: #64748b; font-size: 14px; }
    .hero { min-height: 520px; padding: 80px 7vw; display: grid; grid-template-columns: 1.1fr .9fr; gap: 48px; align-items: center; background: linear-gradient(135deg, ${secondary}, #ffffff); }
    .badge { display: inline-flex; padding: 8px 12px; border-radius: 999px; background: white; color: ${accent}; font-weight: 700; font-size: 13px; box-shadow: 0 8px 24px rgba(15,23,42,.08); }
    h1 { font-size: clamp(40px, 6vw, 72px); line-height: .95; letter-spacing: -0.06em; margin: 22px 0; }
    p { color: #475569; font-size: 18px; line-height: 1.7; max-width: 640px; }
    .actions { display: flex; gap: 14px; margin-top: 32px; flex-wrap: wrap; }
    .btn { border: 0; border-radius: 14px; padding: 14px 22px; font-weight: 800; cursor: pointer; }
    .primary { background: ${accent}; color: white; box-shadow: 0 14px 32px rgba(0,0,0,.16); }
    .secondary { background: white; color: #0f172a; border: 1px solid #e2e8f0; }
    .card { background: white; border-radius: 32px; padding: 28px; box-shadow: 0 24px 70px rgba(15,23,42,.16); }
    .image { height: 320px; border-radius: 24px; background: radial-gradient(circle at 30% 20%, ${accent}, transparent 35%), linear-gradient(135deg, #111827, #334155); display:flex; align-items:end; padding:24px; color:white; font-size:28px; font-weight:900; }
    .features { padding: 64px 7vw; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .feature { padding: 26px; border: 1px solid #e2e8f0; border-radius: 24px; background:#fff; }
    .feature h3 { margin: 0 0 8px; }
    footer { padding: 32px 7vw; color:#64748b; border-top:1px solid #f1f5f9; }
    @media (max-width: 800px) { .hero, .features { grid-template-columns: 1fr; } nav { display:none; } }
  </style>
</head>
<body>
  <header>
    <div class="logo">${businessName}</div>
    <nav><span>Início</span><span>Serviços</span><span>Preços</span><span>Contacto</span></nav>
  </header>
  <section class="hero">
    <div>
      <span class="badge">Gerado a partir de: “${cleanPrompt}”</span>
      <h1>${headline}</h1>
      <p>${description}</p>
      <div class="actions">
        <button class="btn primary">Reservar agora</button>
        <button class="btn secondary">Ver menu</button>
      </div>
    </div>
    <div class="card"><div class="image">${businessName}</div></div>
  </section>
  <section class="features">
    <div class="feature"><h3>Design moderno</h3><p>Layout responsivo e preparado para mobile.</p></div>
    <div class="feature"><h3>Conversão</h3><p>Chamadas à ação claras para gerar contactos.</p></div>
    <div class="feature"><h3>Rápido</h3><p>Estrutura simples, leve e pronta para publicar.</p></div>
  </section>
  <footer>© ${new Date().getFullYear()} ${businessName}. Todos os direitos reservados.</footer>
</body>
</html>`;
}

export default function AiBuilderWorkspacePage() {
  const [prompt, setPrompt] = useState('faz um site para um café');
  const [generatedPrompt, setGeneratedPrompt] = useState('faz um site para um café');
  const [view, setView] = useState<'preview' | 'code'>('preview');

  const html = useMemo(() => buildSite(generatedPrompt), [generatedPrompt]);

  return (
    <AppLayout fullHeight>
      <div className="h-[calc(100vh-3.5rem)] grid grid-cols-1 lg:grid-cols-[420px_1fr] overflow-hidden">
        <aside className="border-r border-border bg-card/70 p-5 overflow-y-auto">
          <div className="inline-flex items-center gap-2 badge-green mb-4">
            <Sparkles size={14} />
            AI Website Builder MVP
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Constrói um site com um prompt</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Escreve o que queres criar. Por agora gera um template local funcional; no próximo passo ligamos a uma API de IA real.
          </p>

          <label className="text-sm font-medium text-foreground mb-2 block">Pedido</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="input-base min-h-36 resize-none mb-4"
            placeholder="Ex: faz um site para um café moderno em Lisboa"
          />

          <button onClick={() => setGeneratedPrompt(prompt)} className="btn-primary w-full mb-4">
            <Rocket size={16} />
            Generate Website
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setView('preview')} className={view === 'preview' ? 'btn-primary' : 'btn-secondary'}>
              <Eye size={16} /> Preview
            </button>
            <button onClick={() => setView('code')} className={view === 'code' ? 'btn-primary' : 'btn-secondary'}>
              <Code2 size={16} /> Code
            </button>
          </div>
        </aside>

        <main className="bg-background p-4 overflow-hidden">
          {view === 'preview' ? (
            <iframe title="Live website preview" srcDoc={html} className="w-full h-full rounded-2xl bg-white border border-border" />
          ) : (
            <pre className="w-full h-full overflow-auto rounded-2xl border border-border bg-black/40 p-4 text-xs text-foreground whitespace-pre-wrap">
              {html}
            </pre>
          )}
        </main>
      </div>
    </AppLayout>
  );
}
