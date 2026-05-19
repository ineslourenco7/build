'use client';

import AppLayout from '@/components/AppLayout';
import { Code2, Eye, Rocket, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';

type SiteConfig = {
  businessName: string;
  accent: string;
  secondary: string;
  headline: string;
  description: string;
  cta: string;
  secondaryCta: string;
  pages: { id: string; label: string }[];
  services: string[];
};

function getSiteConfig(prompt: string, referenceUrl: string): SiteConfig {
  const cleanPrompt = prompt.trim() || 'um negócio local moderno';
  const lower = cleanPrompt.toLowerCase();
  const isCafe = lower.includes('cafe') || lower.includes('café');
  const isRestaurant = lower.includes('restaurante') || lower.includes('restaurant') || lower.includes('italiano');
  const isAgency = lower.includes('agência') || lower.includes('agencia') || lower.includes('agency');
  const isGym = lower.includes('ginásio') || lower.includes('ginasio') || lower.includes('gym');
  const hasReference = referenceUrl.trim().length > 0;

  const businessName = isCafe
    ? 'Café Aurora'
    : isRestaurant
      ? 'Bella Mesa'
      : isAgency
        ? 'Studio Norte'
        : isGym
          ? 'CoreFit Studio'
          : 'Nova Marca';

  const accent = isCafe ? '#b7791f' : isRestaurant ? '#dc2626' : isAgency ? '#7c3aed' : isGym ? '#16a34a' : '#6366f1';
  const secondary = isCafe ? '#fff7ed' : isRestaurant ? '#fff1f2' : isAgency ? '#f5f3ff' : isGym ? '#f0fdf4' : '#eef2ff';

  const headline = isCafe
    ? 'Café artesanal, ambiente acolhedor e sabores memoráveis'
    : isRestaurant
      ? 'Sabores italianos autênticos, reservas simples e experiência memorável'
      : isAgency
        ? 'Estratégia, design e websites que fazem marcas crescer'
        : isGym
          ? 'Treino inteligente, acompanhamento real e resultados visíveis'
          : `Website profissional para ${cleanPrompt}`;

  const description = isCafe
    ? 'Pequenos-almoços, brunch e café de especialidade no centro da cidade.'
    : isRestaurant
      ? 'Menu italiano moderno, pratos sazonais e uma presença online preparada para receber reservas.'
      : isAgency
        ? 'Uma presença digital clara para apresentar serviços, projetos e captar novos clientes.'
        : isGym
          ? 'Planos flexíveis, aulas de grupo e acompanhamento personalizado para todos os níveis.'
          : 'Uma presença digital moderna, rápida e pensada para converter visitantes em clientes.';

  const services = isCafe
    ? ['Café de especialidade', 'Brunch artesanal', 'Pastelaria fresca']
    : isRestaurant
      ? ['Pasta fresca', 'Reservas online', 'Eventos privados']
      : isAgency
        ? ['Branding', 'Web design', 'Marketing digital']
        : isGym
          ? ['Personal training', 'Aulas de grupo', 'Planos mensais']
          : ['Landing pages', 'Captação de leads', 'Presença online'];

  return {
    businessName,
    accent,
    secondary,
    headline: hasReference ? `${headline} — inspirado na estrutura do link indicado` : headline,
    description,
    cta: isRestaurant || isCafe ? 'Reservar agora' : isGym ? 'Marcar aula grátis' : 'Pedir proposta',
    secondaryCta: isRestaurant || isCafe ? 'Ver menu' : 'Ver serviços',
    pages: [
      { id: 'home', label: 'Início' },
      { id: 'services', label: isCafe || isRestaurant ? 'Menu' : 'Serviços' },
      { id: 'about', label: 'Sobre' },
      { id: 'pricing', label: 'Preços' },
      { id: 'contact', label: 'Contacto' },
    ],
    services,
  };
}

function buildSite(prompt: string, referenceUrl: string) {
  const config = getSiteConfig(prompt, referenceUrl);
  const generatedFrom = prompt.trim() || 'um negócio local moderno';
  const safeReference = referenceUrl.trim();

  return `<!doctype html>
<html lang="pt">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${config.businessName}</title>
  <style>
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { margin: 0; font-family: Inter, system-ui, Arial, sans-serif; color: #111827; background: #ffffff; }
    header { position: sticky; top: 0; z-index: 10; padding: 18px 7vw; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; background: rgba(255,255,255,.92); backdrop-filter: blur(14px); }
    .logo { font-weight: 900; font-size: 22px; color: ${config.accent}; letter-spacing: -.03em; }
    nav { display: flex; gap: 18px; align-items:center; }
    nav button { color: #64748b; font-size: 14px; text-decoration:none; font-weight:700; background: transparent; border: 0; cursor: pointer; }
    nav button:hover { color: ${config.accent}; }
    section { padding: 76px 7vw; }
    .hero { min-height: 560px; display: grid; grid-template-columns: 1.1fr .9fr; gap: 48px; align-items: center; background: linear-gradient(135deg, ${config.secondary}, #ffffff); }
    .badge { display: inline-flex; padding: 8px 12px; border-radius: 999px; background: white; color: ${config.accent}; font-weight: 800; font-size: 13px; box-shadow: 0 8px 24px rgba(15,23,42,.08); }
    h1 { font-size: clamp(42px, 6vw, 76px); line-height: .94; letter-spacing: -0.07em; margin: 22px 0; }
    h2 { font-size: clamp(30px, 4vw, 48px); letter-spacing: -.05em; margin: 0 0 16px; }
    h3 { margin: 0 0 8px; }
    p { color: #475569; font-size: 18px; line-height: 1.7; max-width: 680px; }
    .actions { display: flex; gap: 14px; margin-top: 32px; flex-wrap: wrap; }
    .btn { display:inline-flex; align-items:center; justify-content:center; border: 0; border-radius: 14px; padding: 14px 22px; font-weight: 900; cursor: pointer; text-decoration:none; transition:.18s ease; }
    .btn:hover { transform: translateY(-2px); }
    .primary { background: ${config.accent}; color: white; box-shadow: 0 14px 32px rgba(0,0,0,.16); }
    .secondary { background: white; color: #0f172a; border: 1px solid #e2e8f0; }
    .card { background: white; border-radius: 32px; padding: 28px; box-shadow: 0 24px 70px rgba(15,23,42,.16); }
    .visual { height: 340px; border-radius: 24px; background: radial-gradient(circle at 30% 20%, ${config.accent}, transparent 35%), linear-gradient(135deg, #111827, #334155); display:flex; align-items:end; padding:24px; color:white; font-size:30px; font-weight:950; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .feature, .price { padding: 28px; border: 1px solid #e2e8f0; border-radius: 24px; background:#fff; }
    .price.featured { border-color:${config.accent}; box-shadow:0 18px 45px rgba(15,23,42,.10); }
    .muted { color:#64748b; }
    .about { background:#f8fafc; }
    form { display:grid; gap:12px; max-width:560px; }
    input, textarea { width:100%; border:1px solid #e2e8f0; border-radius:14px; padding:14px 16px; font:inherit; color:#0f172a; }
    textarea { min-height:120px; }
    .notice { display:none; margin-top:14px; padding:12px 14px; border-radius:14px; background:#ecfdf5; color:#047857; font-weight:800; }
    footer { padding: 32px 7vw; color:#64748b; border-top:1px solid #f1f5f9; }
    @media (max-width: 900px) { .hero, .grid { grid-template-columns: 1fr; } nav { display:none; } }
  </style>
</head>
<body>
  <header>
    <div class="logo">${config.businessName}</div>
    <nav>${config.pages.map((page) => `<button type="button" data-target="${page.id}">${page.label}</button>`).join('')}</nav>
  </header>

  <section id="home" class="hero">
    <div>
      <span class="badge">Gerado a partir de: “${generatedFrom}”</span>
      <h1>${config.headline}</h1>
      <p>${config.description}</p>
      ${safeReference ? `<p class="muted" style="font-size:14px">Referência usada como inspiração estrutural: ${safeReference}</p>` : ''}
      <div class="actions">
        <button class="btn primary" type="button" data-target="contact">${config.cta}</button>
        <button class="btn secondary" type="button" data-target="services">${config.secondaryCta}</button>
      </div>
    </div>
    <div class="card"><div class="visual">${config.businessName}</div></div>
  </section>

  <section id="services">
    <h2>${config.pages[1].label}</h2>
    <p>Uma secção criada automaticamente com base no tipo de negócio pedido.</p>
    <div class="grid">
      ${config.services.map((service) => `<div class="feature"><h3>${service}</h3><p>Solução pensada para clientes que procuram qualidade, rapidez e confiança.</p><button class="btn secondary" type="button" data-target="contact">Saber mais</button></div>`).join('')}
    </div>
  </section>

  <section id="about" class="about">
    <h2>Sobre ${config.businessName}</h2>
    <p>${config.businessName} combina uma imagem moderna com uma experiência simples para transformar visitantes em clientes. Esta página inclui navegação funcional, secções completas e botões ligados aos destinos certos.</p>
  </section>

  <section id="pricing">
    <h2>Preços</h2>
    <div class="grid">
      <div class="price"><h3>Starter</h3><p class="muted">Ideal para começar.</p><h2>€29</h2><button class="btn secondary" type="button" data-target="contact">Escolher</button></div>
      <div class="price featured"><h3>Pro</h3><p class="muted">Mais popular.</p><h2>€79</h2><button class="btn primary" type="button" data-target="contact">Escolher Pro</button></div>
      <div class="price"><h3>Premium</h3><p class="muted">Para equipas e marcas.</p><h2>€149</h2><button class="btn secondary" type="button" data-target="contact">Falar connosco</button></div>
    </div>
  </section>

  <section id="contact">
    <h2>Contacto</h2>
    <p>Formulário funcional no preview: ao enviar, mostra confirmação sem sair da página.</p>
    <form onsubmit="event.preventDefault(); document.getElementById('sent').style.display='block';">
      <input placeholder="Nome" required />
      <input type="email" placeholder="Email" required />
      <textarea placeholder="Mensagem" required></textarea>
      <button class="btn primary" type="submit">Enviar pedido</button>
      <div id="sent" class="notice">Pedido enviado com sucesso. Esta é uma simulação funcional.</div>
    </form>
  </section>

  <footer>© ${new Date().getFullYear()} ${config.businessName}. Site gerado automaticamente.</footer>

  <script>
    document.querySelectorAll('[data-target]').forEach(function(button) {
      button.addEventListener('click', function() {
        var target = document.getElementById(button.getAttribute('data-target'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  </script>
</body>
</html>`;
}

export default function AiBuilderWorkspacePage() {
  const [prompt, setPrompt] = useState('faz um site para um café');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('faz um site para um café');
  const [generatedReferenceUrl, setGeneratedReferenceUrl] = useState('');
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [lastGeneratedAt, setLastGeneratedAt] = useState('');
  const [generationId, setGenerationId] = useState(0);

  const html = useMemo(
    () => buildSite(generatedPrompt, generatedReferenceUrl),
    [generatedPrompt, generatedReferenceUrl]
  );

  function handleGenerate() {
    setGeneratedPrompt(prompt);
    setGeneratedReferenceUrl(referenceUrl);
    setGenerationId((current) => current + 1);
    setView('preview');
    setLastGeneratedAt(new Date().toLocaleTimeString('pt-PT'));
  }

  return (
    <AppLayout fullHeight>
      <div className="h-[calc(100vh-3.5rem)] grid grid-cols-1 lg:grid-cols-[420px_1fr] overflow-hidden">
        <aside className="border-r border-border bg-card/70 p-5 overflow-y-auto">
          <div className="inline-flex items-center gap-2 badge-green mb-4">
            <Sparkles size={14} />
            AI Website Builder MVP
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Constrói um site completo com um prompt</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Gera um mini-site multipágina com navegação, botões, formulário e preview live. O link serve como inspiração estrutural; não copia conteúdo de outros sites.
          </p>

          <label className="text-sm font-medium text-foreground mb-2 block">Pedido</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full min-h-32 resize-none mb-4 rounded-lg border border-border bg-[#0f172a] px-3 py-3 text-sm text-white placeholder:text-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Ex: faz um site para um café moderno em Lisboa"
          />

          <label className="text-sm font-medium text-foreground mb-2 block">Link de inspiração opcional</label>
          <input
            value={referenceUrl}
            onChange={(e) => setReferenceUrl(e.target.value)}
            className="w-full mb-4 rounded-lg border border-border bg-[#0f172a] px-3 py-3 text-sm text-white placeholder:text-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="https://exemplo.com"
          />

          <button onClick={handleGenerate} className="btn-primary w-full mb-3">
            <Rocket size={16} />
            Generate Website
          </button>

          <div className="mb-4 rounded-lg border border-border bg-background/60 p-3 text-xs text-muted-foreground">
            <p><strong className="text-foreground">Último prompt:</strong> {generatedPrompt}</p>
            {generatedReferenceUrl && <p className="mt-1"><strong className="text-foreground">Inspiração:</strong> {generatedReferenceUrl}</p>}
            {lastGeneratedAt && <p className="mt-1">Gerado às {lastGeneratedAt}</p>}
          </div>

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
            <iframe key={`${generationId}-${generatedPrompt}-${generatedReferenceUrl}`} title="Live website preview" srcDoc={html} className="w-full h-full rounded-2xl bg-white border border-border" />
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
