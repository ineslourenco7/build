import { NextRequest, NextResponse } from 'next/server';

type GeneratedProject = {
  html: string;
  css: string;
  js: string;
};

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash-lite'];

function isPropFirmPrompt(prompt: string) {
  const lower = prompt.toLowerCase();
  return (
    lower.includes('prop firm') ||
    lower.includes('propfirm') ||
    lower.includes('funded trader') ||
    lower.includes('funded trading') ||
    lower.includes('forex challenge') ||
    lower.includes('trading challenge') ||
    lower.includes('copy trading') ||
    lower.includes('traders de forex') ||
    lower.includes('trader funding')
  );
}

function propFirmTemplate(prompt: string): GeneratedProject {
  const brandName = prompt.toLowerCase().includes('copy') ? 'CopyVault Markets' : 'ApexFunded';

  return {
    html: `<!doctype html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${brandName}</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header class="topbar">
    <div class="brand"><span class="mark">A</span>${brandName}</div>
    <nav>
      <button data-target="challenges">Challenges</button>
      <button data-target="dashboard">Dashboard</button>
      <button data-target="rules">Regras</button>
      <button data-target="faq">FAQ</button>
    </nav>
    <button class="ghost" data-target="plans">Começar</button>
  </header>

  <main>
    <section id="home" class="hero">
      <div class="hero-copy">
        <p class="eyebrow">PROP FIRM • FOREX • FUTURES • CRYPTO</p>
        <h1>Capital para traders consistentes.</h1>
        <p class="lead">Uma plataforma premium para traders que querem provar disciplina, gerir risco e escalar contas simuladas com regras claras, payouts rápidos e métricas transparentes.</p>
        <div class="hero-actions">
          <button class="primary" data-target="plans">Ver challenges</button>
          <button class="secondary" data-target="dashboard">Ver dashboard</button>
        </div>
        <div class="trust-row">
          <span>✓ Até 90% payout</span>
          <span>✓ Sem tempo mínimo</span>
          <span>✓ Regras transparentes</span>
        </div>
      </div>

      <div class="terminal-card">
        <div class="terminal-head"><span></span><span></span><span></span></div>
        <div class="chart-wrap">
          <svg viewBox="0 0 520 280" aria-label="Equity curve">
            <defs>
              <linearGradient id="glow" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#22c55e" stop-opacity="0.35" />
                <stop offset="100%" stop-color="#22c55e" stop-opacity="0" />
              </linearGradient>
            </defs>
            <path class="area" d="M0 230 C80 190 120 210 170 160 C230 90 280 140 335 80 C390 20 430 70 520 34 L520 280 L0 280 Z" />
            <path class="line" d="M0 230 C80 190 120 210 170 160 C230 90 280 140 335 80 C390 20 430 70 520 34" />
          </svg>
        </div>
        <div class="metric-grid">
          <div><small>Equity</small><strong>$127,840</strong></div>
          <div><small>Profit Split</small><strong>90%</strong></div>
          <div><small>Max DD</small><strong>8%</strong></div>
          <div><small>Payout</small><strong>48h</strong></div>
        </div>
      </div>
    </section>

    <section class="stats-strip">
      <article><strong>$42M+</strong><span>capital simulado atribuído</span></article>
      <article><strong>18k+</strong><span>traders avaliados</span></article>
      <article><strong>92%</strong><span>payout máximo</span></article>
      <article><strong>24/7</strong><span>área de trader</span></article>
    </section>

    <section id="plans" class="section">
      <div class="section-head">
        <p class="eyebrow">CHALLENGES</p>
        <h2>Escolhe a conta e prova a tua consistência.</h2>
      </div>
      <div class="plans">
        <article class="plan">
          <p>Starter</p><h3>$25k</h3><span>Meta 8% • DD 6%</span><strong>€149</strong><button data-target="contact">Começar</button>
        </article>
        <article class="plan featured">
          <div class="badge">Mais popular</div><p>Professional</p><h3>$100k</h3><span>Meta 10% • DD 8%</span><strong>€399</strong><button data-target="contact">Começar Pro</button>
        </article>
        <article class="plan">
          <p>Elite</p><h3>$200k</h3><span>Meta 10% • DD 10%</span><strong>€799</strong><button data-target="contact">Candidatar</button>
        </article>
      </div>
    </section>

    <section id="dashboard" class="dashboard-section">
      <div class="section-head">
        <p class="eyebrow">TRADER DASHBOARD</p>
        <h2>Métricas claras para decisões disciplinadas.</h2>
      </div>
      <div class="dashboard">
        <aside>
          <div class="pill active">Overview</div>
          <div class="pill">Risk Monitor</div>
          <div class="pill">Payouts</div>
          <div class="pill">Certificates</div>
        </aside>
        <div class="dash-main">
          <div class="dash-top">
            <div><small>Balance</small><strong>$103,248</strong></div>
            <div><small>Today's P/L</small><strong class="green">+$1,284</strong></div>
            <div><small>Daily Loss</small><strong>1.2%</strong></div>
          </div>
          <div class="bars">
            <span style="height: 42%"></span><span style="height: 58%"></span><span style="height: 38%"></span><span style="height: 74%"></span><span style="height: 64%"></span><span style="height: 88%"></span><span style="height: 78%"></span>
          </div>
        </div>
      </div>
    </section>

    <section id="rules" class="section rules">
      <div class="section-head"><p class="eyebrow">REGRAS</p><h2>Sem letras pequenas. Só gestão de risco.</h2></div>
      <div class="rules-grid">
        <article><span>01</span><h3>Drawdown diário</h3><p>Limite diário claro para proteger a conta e premiar consistência.</p></article>
        <article><span>02</span><h3>Sem limite de tempo</h3><p>Avança quando a tua estratégia estiver pronta, sem pressões artificiais.</p></article>
        <article><span>03</span><h3>Payout rápido</h3><p>Processamento em até 48h após aprovação e validação da conta.</p></article>
        <article><span>04</span><h3>Trading responsável</h3><p>Regras contra martingale, abuso de latência e excesso de risco.</p></article>
      </div>
    </section>

    <section class="testimonials">
      <div class="section-head"><p class="eyebrow">TRADERS</p><h2>Experiência pensada para performance.</h2></div>
      <div class="quote-grid">
        <blockquote>“O dashboard é muito claro. Consegui acompanhar risco e objetivos sem complicações.”<span>— Miguel R., Forex Trader</span></blockquote>
        <blockquote>“O processo de avaliação é direto e o payout chegou em dois dias.”<span>— Sara L., Futures Trader</span></blockquote>
      </div>
    </section>

    <section id="faq" class="section faq">
      <div class="section-head"><p class="eyebrow">FAQ</p><h2>Perguntas frequentes</h2></div>
      <div class="faq-list">
        <button class="faq-item"><span>Existe tempo mínimo para passar o challenge?</span><strong>+</strong><p>Não. O objetivo é avaliar consistência e gestão de risco, não velocidade.</p></button>
        <button class="faq-item"><span>Posso usar EAs?</span><strong>+</strong><p>Sim, desde que respeitem as regras de risco e não explorem latência ou arbitragem proibida.</p></button>
        <button class="faq-item"><span>Isto é aconselhamento financeiro?</span><strong>+</strong><p>Não. A plataforma é educacional/simulada e trading envolve risco.</p></button>
      </div>
    </section>

    <section id="contact" class="contact">
      <div>
        <p class="eyebrow">COMEÇAR</p>
        <h2>Cria a tua conta de avaliação.</h2>
        <p>Recebe detalhes sobre challenges, regras e próximos passos.</p>
      </div>
      <form id="contactForm">
        <input placeholder="Nome" required />
        <input type="email" placeholder="Email" required />
        <select><option>$25k Challenge</option><option>$100k Challenge</option><option>$200k Challenge</option></select>
        <button class="primary" type="submit">Pedir acesso</button>
        <p id="successMessage" class="success">Pedido recebido. Esta é uma simulação funcional.</p>
      </form>
    </section>

    <footer>
      <strong>${brandName}</strong>
      <p>Disclaimer: trading envolve risco substancial e pode resultar em perdas. Este website é uma simulação de prop firm e não constitui aconselhamento financeiro.</p>
    </footer>
  </main>

  <script src="script.js"></script>
</body>
</html>`,
    css: `:root { --bg:#050816; --panel:#0b1024; --panel2:#101833; --text:#f8fafc; --muted:#94a3b8; --line:rgba(255,255,255,.1); --green:#22c55e; --cyan:#38bdf8; --violet:#8b5cf6; }
* { box-sizing: border-box; }
html { scroll-behavior:smooth; }
body { margin:0; background: radial-gradient(circle at 20% 0%, rgba(56,189,248,.18), transparent 30%), radial-gradient(circle at 80% 10%, rgba(139,92,246,.22), transparent 32%), var(--bg); color:var(--text); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Arial, sans-serif; }
button, input, select { font:inherit; }
.topbar { position:sticky; top:0; z-index:20; display:flex; justify-content:space-between; align-items:center; padding:18px 6vw; background:rgba(5,8,22,.72); backdrop-filter:blur(18px); border-bottom:1px solid var(--line); }
.brand { display:flex; align-items:center; gap:10px; font-weight:900; letter-spacing:-.04em; font-size:20px; }
.mark { width:34px; height:34px; display:grid; place-items:center; border-radius:12px; background:linear-gradient(135deg,var(--cyan),var(--violet)); color:white; }
nav { display:flex; gap:8px; }
nav button, .ghost { border:1px solid transparent; border-radius:999px; background:transparent; color:var(--muted); padding:10px 14px; cursor:pointer; transition:.2s ease; }
nav button:hover, .ghost:hover { color:var(--text); border-color:var(--line); background:rgba(255,255,255,.05); }
.hero { min-height:760px; display:grid; grid-template-columns: .95fr 1.05fr; gap:54px; align-items:center; padding:90px 6vw; }
.eyebrow { color:var(--cyan); font-size:12px; letter-spacing:.18em; font-weight:900; text-transform:uppercase; }
h1 { font-size:clamp(52px,7.5vw,104px); line-height:.86; letter-spacing:-.08em; margin:0 0 24px; max-width:850px; }
h2 { font-size:clamp(34px,5vw,68px); line-height:.92; letter-spacing:-.07em; margin:0; }
h3 { margin:12px 0 8px; font-size:25px; letter-spacing:-.04em; }
p, span { color:var(--muted); line-height:1.7; }
.lead { font-size:20px; max-width:720px; }
.hero-actions, .actions { display:flex; gap:12px; flex-wrap:wrap; margin-top:28px; }
.primary, .secondary { border:0; border-radius:999px; padding:15px 24px; font-weight:900; cursor:pointer; transition:.2s ease; }
.primary { color:#03120b; background:linear-gradient(135deg,#86efac,var(--green)); box-shadow:0 18px 42px rgba(34,197,94,.28); }
.secondary { color:var(--text); background:rgba(255,255,255,.07); border:1px solid var(--line); }
.primary:hover, .secondary:hover, .plan:hover, .rules-grid article:hover { transform:translateY(-3px); }
.trust-row { display:flex; gap:16px; flex-wrap:wrap; margin-top:24px; }
.trust-row span { color:#cbd5e1; font-size:14px; }
.terminal-card { border:1px solid var(--line); background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.03)); border-radius:34px; padding:22px; box-shadow:0 30px 90px rgba(0,0,0,.45); }
.terminal-head { display:flex; gap:8px; padding:6px 0 18px; }
.terminal-head span { width:11px; height:11px; border-radius:999px; background:#ef4444; }
.terminal-head span:nth-child(2) { background:#f59e0b; } .terminal-head span:nth-child(3) { background:#22c55e; }
.chart-wrap { height:300px; border-radius:26px; background:rgba(2,6,23,.74); border:1px solid var(--line); padding:20px; }
.area { fill:url(#glow); } .line { fill:none; stroke:var(--green); stroke-width:6; filter:drop-shadow(0 0 18px rgba(34,197,94,.55)); }
.metric-grid, .stats-strip { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-top:16px; }
.metric-grid div, .stats-strip article { background:rgba(255,255,255,.06); border:1px solid var(--line); border-radius:22px; padding:18px; }
small { color:var(--muted); display:block; margin-bottom:6px; }
strong { font-size:28px; letter-spacing:-.05em; }
.green { color:var(--green); }
.stats-strip { padding:0 6vw 80px; margin-top:0; }
.stats-strip article strong { display:block; font-size:40px; }
.section, .dashboard-section, .testimonials, .contact { padding:95px 6vw; }
.section-head { max-width:760px; margin-bottom:34px; }
.plans, .rules-grid, .quote-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
.plan, .rules-grid article, blockquote { position:relative; background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.035)); border:1px solid var(--line); border-radius:30px; padding:26px; box-shadow:0 20px 60px rgba(0,0,0,.22); transition:.25s ease; }
.plan.featured { border-color:rgba(34,197,94,.55); box-shadow:0 24px 80px rgba(34,197,94,.12); }
.badge { position:absolute; top:18px; right:18px; background:rgba(34,197,94,.14); color:#86efac; border:1px solid rgba(34,197,94,.35); border-radius:999px; padding:8px 12px; font-size:12px; font-weight:900; }
.plan h3 { font-size:54px; margin:8px 0; }
.plan strong { display:block; margin:18px 0; }
.dashboard-section, .rules, .contact { background:rgba(255,255,255,.035); border-top:1px solid var(--line); border-bottom:1px solid var(--line); }
.dashboard { display:grid; grid-template-columns:240px 1fr; gap:20px; background:rgba(255,255,255,.06); border:1px solid var(--line); border-radius:34px; padding:20px; }
.pill { padding:14px 16px; border-radius:18px; color:var(--muted); margin-bottom:8px; }
.pill.active { background:rgba(34,197,94,.14); color:#bbf7d0; }
.dash-main { background:#030712; border:1px solid var(--line); border-radius:26px; padding:24px; }
.dash-top { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
.bars { height:260px; display:flex; align-items:end; gap:16px; padding-top:28px; }
.bars span { flex:1; border-radius:999px 999px 8px 8px; background:linear-gradient(180deg,var(--cyan),var(--violet)); min-height:40px; }
.rules-grid { grid-template-columns:repeat(4,1fr); }
.rules-grid span { color:var(--cyan); font-weight:900; }
.quote-grid { grid-template-columns:repeat(2,1fr); }
blockquote { margin:0; font-size:22px; line-height:1.5; }
blockquote span { display:block; margin-top:18px; font-size:14px; }
.faq-list { display:grid; gap:12px; max-width:900px; }
.faq-item { text-align:left; border:1px solid var(--line); border-radius:22px; background:rgba(255,255,255,.05); color:var(--text); padding:20px; cursor:pointer; }
.faq-item span { color:var(--text); font-weight:900; } .faq-item strong { float:right; font-size:18px; } .faq-item p { display:none; margin-bottom:0; } .faq-item.open p { display:block; }
.contact { display:grid; grid-template-columns:.9fr 1.1fr; gap:40px; align-items:start; }
form { display:grid; gap:12px; }
input, select { border:1px solid var(--line); border-radius:18px; padding:16px 18px; background:rgba(255,255,255,.08); color:var(--text); }
.success { display:none; color:#86efac; font-weight:900; }
footer { padding:38px 6vw; border-top:1px solid var(--line); display:grid; gap:8px; }
footer p { font-size:13px; max-width:900px; }
@media (max-width: 950px) { nav { display:none; } .hero, .dashboard, .contact { grid-template-columns:1fr; } .metric-grid, .stats-strip, .plans, .rules-grid, .quote-grid, .dash-top { grid-template-columns:1fr; } h1 { font-size:56px; } }
`,
    js: `document.querySelectorAll('[data-target]').forEach((button) => {
  button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

document.querySelectorAll('.faq-item').forEach((item) => {
  item.addEventListener('click', () => item.classList.toggle('open'));
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

function detectBusiness(prompt: string) {
  const lower = prompt.toLowerCase();

  if (lower.includes('hotel') || lower.includes('boutique') || lower.includes('alojamento')) {
    return { title: 'Lúmina Lisboa Hotel', accent: '#9f7aea', soft: '#f6f2ff', eyebrow: 'Hotel boutique minimalista em Lisboa', headline: 'Estadia serena, design discreto e Lisboa à porta', description: 'Um refúgio boutique com quartos luminosos, pequeno-almoço artesanal, terraço privado e concierge local para descobrir a cidade com calma.', services: ['Suites minimalistas', 'Terraço com vista', 'Concierge local'], cta: 'Reservar estadia', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80' };
  }

  if (lower.includes('chinês') || lower.includes('chines') || lower.includes('china')) {
    return { title: 'Dragão Dourado', accent: '#b91c1c', soft: '#fff1f2', eyebrow: 'Restaurante chinês tradicional', headline: 'Sabores chineses autênticos no coração da cidade', description: 'Dim sum, noodles, arroz salteado e pratos clássicos preparados com ingredientes frescos.', services: ['Dim Sum artesanal', 'Noodles frescos', 'Reservas para grupos'], cta: 'Reservar mesa', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80' };
  }

  if (lower.includes('italiano') || lower.includes('italiana')) {
    return { title: 'Bella Mesa', accent: '#dc2626', soft: '#fff7ed', eyebrow: 'Restaurante italiano premium', headline: 'Pasta fresca, forno a lenha e sabores de Itália', description: 'Um restaurante italiano moderno com reservas online, menu sazonal e ambiente acolhedor.', services: ['Pasta fresca', 'Pizza artesanal', 'Carta de vinhos'], cta: 'Reservar agora', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80' };
  }

  return { title: 'Marca Aurora', accent: '#6366f1', soft: '#eef2ff', eyebrow: 'Experiência digital premium', headline: 'Uma presença online elegante, clara e preparada para converter', description: 'Landing page moderna com storytelling, serviços, prova social, contacto e uma estética cuidada para apresentar a marca com confiança.', services: ['Experiência premium', 'Serviços personalizados', 'Contacto direto'], cta: 'Pedir contacto', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80' };
}

function fallbackProject(prompt: string): GeneratedProject {
  if (isPropFirmPrompt(prompt)) return propFirmTemplate(prompt);

  const business = detectBusiness(prompt);

  return {
    html: `<!doctype html><html lang="pt"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>${business.title}</title><link rel="stylesheet" href="style.css" /></head><body><header class="site-header"><strong class="logo">${business.title}</strong><nav><button data-target="home">Início</button><button data-target="services">Serviços</button><button data-target="gallery">Galeria</button><button data-target="contact">Contacto</button></nav></header><main><section id="home" class="hero"><div><p class="eyebrow">${business.eyebrow}</p><h1>${business.headline}</h1><p>${business.description}</p><div class="actions"><button class="primary" data-target="contact">${business.cta}</button><button class="secondary" data-target="services">Ver serviços</button></div></div><img src="${business.image}" alt="${business.title}"/></section><section id="services"><h2>Serviços premium</h2><div class="grid">${business.services.map((service) => `<article><h3>${service}</h3><p>Experiência cuidada, pensada para converter visitantes em clientes.</p></article>`).join('')}</div></section><section id="gallery" class="gallery"><h2>Galeria</h2><div class="gallery-grid"><img src="${business.image}" alt="Galeria"/><img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=700&q=80" alt="Detalhe"/><img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=80" alt="Ambiente"/></div></section><section id="contact"><h2>Contacto</h2><form id="contactForm"><input placeholder="Nome" required/><input type="email" placeholder="Email" required/><textarea placeholder="Mensagem" required></textarea><button class="primary" type="submit">Enviar pedido</button><p id="successMessage" class="success">Pedido enviado com sucesso.</p></form></section></main><script src="script.js"></script></body></html>`,
    css: `:root{--accent:${business.accent};--soft:${business.soft};--text:#111827;--muted:#64748b;--bg:#fbfaf8}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--text);font-family:system-ui,Arial,sans-serif}.site-header{position:sticky;top:0;z-index:10;display:flex;justify-content:space-between;align-items:center;padding:18px 7vw;background:rgba(251,250,248,.88);backdrop-filter:blur(16px);border-bottom:1px solid rgba(17,24,39,.08)}.logo{font-weight:900;letter-spacing:-.04em}nav{display:flex;gap:8px}nav button{border:0;border-radius:999px;background:transparent;color:var(--muted);font-weight:800;padding:10px 12px;cursor:pointer}section{padding:86px 7vw}.hero{min-height:680px;display:grid;grid-template-columns:.9fr 1.1fr;gap:54px;align-items:center;background:radial-gradient(circle at top left,var(--soft),transparent 45%)}.hero img,.gallery img{width:100%;height:100%;object-fit:cover;border-radius:34px;box-shadow:0 30px 80px rgba(15,23,42,.16)}.eyebrow{color:var(--accent);font-weight:900;letter-spacing:.14em;text-transform:uppercase;font-size:12px}h1{font-size:clamp(48px,7vw,92px);line-height:.88;letter-spacing:-.075em;margin:0 0 24px}h2{font-size:clamp(34px,5vw,64px);line-height:.95;letter-spacing:-.06em}p{color:var(--muted);font-size:18px;line-height:1.75}.actions{display:flex;gap:12px;margin-top:28px}.primary,.secondary{border:0;border-radius:999px;padding:15px 24px;font-weight:900;cursor:pointer}.primary{background:var(--text);color:white}.secondary{background:white;color:var(--text);border:1px solid rgba(17,24,39,.1)}.grid,.gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}article{background:white;border:1px solid rgba(17,24,39,.08);border-radius:30px;padding:26px;box-shadow:0 18px 50px rgba(15,23,42,.07)}.gallery{background:white}.gallery-grid{height:430px}form{display:grid;gap:12px;max-width:620px}input,textarea{border:1px solid rgba(17,24,39,.12);border-radius:18px;padding:16px 18px;font:inherit}.success{display:none;color:#047857;font-weight:900}@media(max-width:900px){.hero,.grid,.gallery-grid{grid-template-columns:1fr;height:auto}nav{display:none}}`,
    js: `document.querySelectorAll('[data-target]').forEach((button)=>{button.addEventListener('click',()=>{const target=document.getElementById(button.dataset.target);if(target)target.scrollIntoView({behavior:'smooth',block:'start'});});});const form=document.getElementById('contactForm');const success=document.getElementById('successMessage');if(form&&success){form.addEventListener('submit',(event)=>{event.preventDefault();success.style.display='block';form.reset();});}`,
  };
}

function parseProject(text: string, prompt: string): GeneratedProject {
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  try {
    const parsed = JSON.parse(cleaned) as Partial<GeneratedProject>;
    if (parsed.html && parsed.css && parsed.js) return { html: parsed.html, css: parsed.css, js: parsed.js };
  } catch {}
  return fallbackProject(prompt);
}

async function callGemini(model: string, apiKey: string, instruction: string) {
  return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: instruction }] }],
      generationConfig: { temperature: 0.85, maxOutputTokens: 14000, responseMimeType: 'application/json' },
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, referenceUrl } = await request.json();
    const cleanPrompt = prompt || 'site moderno';
    const apiKey = process.env.GEMINI_API_KEY;

    if (isPropFirmPrompt(cleanPrompt)) {
      return NextResponse.json({ project: propFirmTemplate(cleanPrompt), source: 'template', model: 'prop-firm-premium' });
    }

    if (!apiKey) {
      return NextResponse.json({ project: fallbackProject(cleanPrompt), source: 'fallback', error: 'GEMINI_API_KEY missing' });
    }

    const instruction = `Gera um projeto vanilla HTML/CSS/JS completo com qualidade visual premium.
O utilizador pediu: ${cleanPrompt}
Link de inspiração opcional: ${referenceUrl || 'nenhum'}

Responde apenas com JSON válido neste formato exato:
{"html":"conteúdo completo do index.html","css":"conteúdo completo do style.css","js":"conteúdo completo do script.js"}

Regras:
- HTML em português europeu.
- O HTML deve referenciar style.css e script.js.
- Não coloques o prompt bruto dentro da página.
- Site final de cliente, não demo técnica.
- Design premium, responsivo, com imagens reais Unsplash, dados fictícios realistas, FAQ, contacto e interações JS.
- Não uses markdown nem comentários fora do JSON.`;

    const errors: string[] = [];
    for (const model of GEMINI_MODELS) {
      const response = await callGemini(model, apiKey, instruction);
      if (!response.ok) {
        errors.push(`${model}: ${await response.text()}`);
        continue;
      }
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('\n') || '';
      return NextResponse.json({ project: parseProject(text, cleanPrompt), source: 'gemini', model });
    }

    return NextResponse.json({ project: fallbackProject(cleanPrompt), source: 'fallback', error: errors.join('\n\n') }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ project: fallbackProject('site moderno'), source: 'fallback', error: String(error) }, { status: 200 });
  }
}
