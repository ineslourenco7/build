import { NextRequest, NextResponse } from 'next/server';

type Project = { html: string; css: string; js: string };
type Palette = { name: string; accent: string; accent2: string; glow: string };
type Intel = { niche: 'trading' | 'photography' | 'beauty' | 'technology'; sub: string; palette: Palette[]; layout: 'fintech' | 'editorial' | 'booking' | 'saas' };

const MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash-lite'];
const has = (text: string, terms: string[]) => terms.some((term) => text.toLowerCase().includes(term));

function analyze(prompt: string, referenceUrl = ''): Intel {
  const text = `${prompt} ${referenceUrl}`.toLowerCase();
  if (has(text, ['fotografo', 'fotógrafo', 'fotografia', 'photography', 'photographer'])) {
    return { niche: 'photography', sub: has(text, ['casamento', 'wedding']) ? 'wedding photography' : 'editorial photography', layout: 'editorial', palette: [
      { name: 'Editorial Warm', accent: '#a47545', accent2: '#e7c8a0', glow: 'rgba(164,117,69,.26)' },
      { name: 'Noir Gallery', accent: '#f5f5f4', accent2: '#a8a29e', glow: 'rgba(245,245,244,.18)' },
      { name: 'Olive Studio', accent: '#9ca36a', accent2: '#d8c7a3', glow: 'rgba(156,163,106,.24)' },
    ] };
  }
  if (has(text, ['nails', 'unhas', 'estética', 'estetica', 'cabeleireiro', 'barbeiro', 'spa'])) {
    return { niche: 'beauty', sub: 'beauty studio', layout: 'booking', palette: [
      { name: 'Rose Luxe', accent: '#ec4899', accent2: '#f9a8d4', glow: 'rgba(236,72,153,.26)' },
      { name: 'Champagne Clinic', accent: '#c08457', accent2: '#f5d0ae', glow: 'rgba(192,132,87,.26)' },
      { name: 'Black Blush', accent: '#fb7185', accent2: '#f472b6', glow: 'rgba(251,113,133,.24)' },
    ] };
  }
  if (has(text, ['copy trading', 'copytrade', 'copy trader'])) {
    return { niche: 'trading', sub: 'copy trading platform', layout: 'fintech', palette: [
      { name: 'Emerald Edge', accent: '#22c55e', accent2: '#38bdf8', glow: 'rgba(34,197,94,.28)' },
      { name: 'Institutional Blue', accent: '#3b82f6', accent2: '#22d3ee', glow: 'rgba(59,130,246,.26)' },
      { name: 'Quant Purple', accent: '#8b5cf6', accent2: '#06b6d4', glow: 'rgba(139,92,246,.26)' },
    ] };
  }
  if (has(text, ['prop firm', 'propfirm', 'funded', 'challenge', 'trading', 'forex', 'fintech'])) {
    return { niche: 'trading', sub: 'funded trading platform', layout: 'fintech', palette: [
      { name: 'Funded Green', accent: '#22c55e', accent2: '#38bdf8', glow: 'rgba(34,197,94,.28)' },
      { name: 'Terminal Cyan', accent: '#06b6d4', accent2: '#84cc16', glow: 'rgba(6,182,212,.24)' },
      { name: 'Black Gold Capital', accent: '#f59e0b', accent2: '#22c55e', glow: 'rgba(245,158,11,.22)' },
    ] };
  }
  return { niche: 'technology', sub: 'AI SaaS platform', layout: 'saas', palette: [
    { name: 'Violet AI', accent: '#8b5cf6', accent2: '#06b6d4', glow: 'rgba(139,92,246,.26)' },
    { name: 'Linear Blue', accent: '#3b82f6', accent2: '#a855f7', glow: 'rgba(59,130,246,.24)' },
    { name: 'Cyber Lime', accent: '#84cc16', accent2: '#22d3ee', glow: 'rgba(132,204,22,.22)' },
  ] };
}

function copy(intel: Intel) {
  if (intel.niche === 'photography') return { brand: 'Marta Vale Studio', eyebrow: 'EDITORIAL PHOTOGRAPHY', title: 'Fotografia com atmosfera, direção e intenção.', sub: 'Portfólio editorial para casamentos, marcas pessoais e campanhas visuais com uma experiência elegante do primeiro contacto à entrega final.', cta: 'Ver portfólio' };
  if (intel.niche === 'beauty') return { brand: 'Aura Beauty Lab', eyebrow: 'BEAUTY STUDIO', title: 'Marcações premium para beleza e cuidado.', sub: 'Serviços, agenda, equipa, preços e reserva online numa experiência suave, elegante e fácil de usar.', cta: 'Marcar horário' };
  if (intel.sub.includes('copy')) return { brand: 'CopyEdge Capital', eyebrow: 'COPY TRADING PLATFORM', title: 'Copy trading com controlo, métricas e confiança.', sub: 'Apresenta traders, performance, risco, subscrições e automações com uma presença fintech institucional.', cta: 'Ver performance' };
  if (intel.niche === 'trading') return { brand: 'ApexFunded', eyebrow: 'FUNDED TRADING', title: 'Capital para traders consistentes.', sub: 'Challenges, regras de risco, payouts e área de trader numa experiência clara, credível e preparada para escala.', cta: 'Ver challenges' };
  return { brand: 'Nexora AI', eyebrow: 'AI SAAS PLATFORM', title: 'Software com estética de produto global.', sub: 'Automatiza operações, acompanha métricas e transforma processos complexos numa experiência SaaS premium.', cta: 'Começar demo' };
}

function paletteButtons(intel: Intel) {
  return `<div class="paletteBox"><span>Escolhe uma paleta</span>${intel.palette.map((p, i) => `<button class="paletteBtn${i === 0 ? ' active' : ''}" data-accent="${p.accent}" data-accent2="${p.accent2}" data-glow="${p.glow}">${p.name}</button>`).join('')}</div>`;
}

function hero(intel: Intel) {
  const c = copy(intel);
  const visual = intel.layout === 'editorial'
    ? `<div class="editorialVisual"><div></div><div></div><div></div><span>Featured stories</span></div>`
    : intel.layout === 'booking'
      ? `<div class="bookingVisual"><div class="phone"><b>Hoje</b><p>14:30 · Serviço Premium</p><p>16:00 · Consulta</p><button>Confirmar</button></div><div class="swatches"><i></i><i></i><i></i></div></div>`
      : `<div class="productVisual"><div class="metric"><small>${intel.niche === 'trading' ? 'Volume mensal' : 'Workflows'}</small><strong>${intel.niche === 'trading' ? '$42.8M' : '1.8M'}</strong><em>+42% crescimento</em></div><div class="chart"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="signal"><b>${intel.niche === 'trading' ? 'Risk score' : 'Automation health'}</b><strong>${intel.niche === 'trading' ? 'A+' : '94%'}</strong></div></div>`;
  return `<section class="hero"><div class="heroCopy reveal"><p class="eyebrow">${c.eyebrow}</p><h1>${c.title}</h1><p class="lead">${c.sub}</p><div class="actions"><button class="primary" data-target="product">${c.cta}</button><button class="secondary" data-target="pricing">Ver planos</button></div>${paletteButtons(intel)}</div><div class="heroCard reveal">${visual}</div></section>`;
}

function features(intel: Intel) {
  const items = intel.niche === 'photography'
    ? ['Galerias editoriais', 'Booking de sessões', 'Entrega privada', 'Pacotes premium']
    : intel.niche === 'beauty'
      ? ['Agenda online', 'Serviços e preços', 'Clientes recorrentes', 'Pagamentos']
      : intel.sub.includes('copy')
        ? ['Perfis de traders', 'Risk score', 'Copy automation', 'Analytics']
        : intel.niche === 'trading'
          ? ['Challenges', 'Risk rules', 'Payouts', 'Trader portal']
          : ['Workflows', 'Client portal', 'Analytics', 'Automations'];
  return `<section id="product" class="section"><div class="sectionHead reveal"><p class="eyebrow">${intel.sub}</p><h2>${intel.niche === 'photography' ? 'Um portfólio que vende antes da primeira chamada.' : intel.niche === 'beauty' ? 'Uma experiência pensada para transformar visitas em marcações.' : intel.niche === 'trading' ? 'Performance, confiança e operação no mesmo produto.' : 'Uma plataforma clara, rápida e pronta para crescer.'}</h2><p>${intel.niche === 'trading' ? 'Dados, risco, perfis e automações apresentados com linguagem visual institucional.' : 'Conteúdo, navegação e interações organizados para criar confiança e conversão.'}</p></div><div class="bento">${items.map((item, index) => `<article class="bentoCard reveal"><div class="icon">${index + 1}</div><h3>${item}</h3><p>${intel.niche === 'trading' ? 'Camada criada para aumentar transparência e reduzir fricção na decisão.' : 'Secção desenhada para dar contexto, clareza e valor percebido.'}</p></article>`).join('')}</div></section>`;
}

function app(intel: Intel) {
  const pages = intel.niche === 'trading' ? ['Dashboard', 'Traders', 'Signals', 'Risk', 'Billing'] : intel.niche === 'beauty' ? ['Agenda', 'Clientes', 'Serviços', 'Pagamentos', 'Settings'] : intel.niche === 'photography' ? ['Portfolio', 'Bookings', 'Clients', 'Delivery', 'Settings'] : ['Dashboard', 'Workflows', 'Clients', 'Analytics', 'Settings'];
  const stats = intel.niche === 'trading' ? ['AUM $42.8M', 'Risk A+', 'Latency 32ms'] : intel.niche === 'beauty' ? ['Bookings 420', 'Show 91%', 'Revenue €24k'] : intel.niche === 'photography' ? ['Galleries 86', 'Bookings 34', 'Delivery 98%'] : ['Users 18k', 'ARR €420k', 'Tasks 1.8M'];
  return `<section id="app" class="appSection"><div class="sectionHead reveal"><p class="eyebrow">Área interna</p><h2>${intel.niche === 'photography' ? 'Gestão de clientes, galerias e entregas.' : intel.niche === 'beauty' ? 'Agenda, clientes e serviços sempre organizados.' : intel.niche === 'trading' ? 'Painel operacional para traders e métricas.' : 'Dashboard para gerir produto, clientes e automações.'}</h2><p>Uma área interna navegável com páginas, dados e estados simulados para mostrar como o produto funcionaria.</p></div><div class="appShell reveal"><aside>${pages.map((page, index) => `<button class="appTab${index === 0 ? ' active' : ''}" data-app-page="${page.toLowerCase()}">${page}</button>`).join('')}</aside><div class="appMain">${pages.map((page, index) => `<section class="appPage${index === 0 ? ' active' : ''}" data-app-view="${page.toLowerCase()}"><div class="appTop"><span>${page}</span><button>Novo</button></div><div class="appStats">${stats.map((stat) => `<article><small>${stat.split(' ')[0]}</small><strong>${stat.split(' ').slice(1).join(' ')}</strong></article>`).join('')}</div><div class="appTable"><div><b>${page} item</b><span>Active</span><em>Updated now</em></div><div><b>${page} flow</b><span>Pending</span><em>12 min ago</em></div><div><b>${page} report</b><span>Synced</span><em>Today</em></div></div></section>`).join('')}</div></div></section>`;
}

function pricing() {
  return `<section id="pricing" class="section"><div class="sectionHead reveal"><p class="eyebrow">Planos</p><h2>Escolhe o nível certo para lançar.</h2></div><div class="pricing"><article class="price reveal"><p>Launch</p><h3>€490</h3><span>Landing premium, analytics e formulário</span><button data-target="contact">Escolher</button></article><article class="price featured reveal"><div class="badge">Popular</div><p>Growth</p><h3>€1.490</h3><span>Website multi-page, área interna e automações</span><button data-target="contact">Começar</button></article><article class="price reveal"><p>Scale</p><h3>Custom</h3><span>Produto completo, integrações e área cliente</span><button data-target="contact">Falar</button></article></div></section>`;
}

function contact() {
  return `<section id="contact" class="contact"><div><p class="eyebrow">Próximo passo</p><h2>Vamos transformar a visão num produto vendável.</h2><p>Envia o objetivo, referências e conteúdos. A experiência pode evoluir para website, dashboard, booking ou produto completo.</p></div><form id="contactForm"><input placeholder="Nome" required/><input type="email" placeholder="Email" required/><textarea placeholder="O que queres construir?" required></textarea><button class="primary" type="submit">Enviar pedido</button><p id="successMessage">Pedido recebido. Entraremos em contacto.</p></form></section>`;
}

function build(prompt: string, referenceUrl = '') {
  const intel = analyze(prompt, referenceUrl);
  const c = copy(intel);
  const html = `<!doctype html><html lang="pt"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>${c.brand}</title><link rel="stylesheet" href="style.css"/></head><body><div class="noise"></div><header class="nav"><div class="brand"><span>${c.brand[0]}</span>${c.brand}</div><nav><button data-target="product">Produto</button><button data-target="app">Área interna</button><button data-target="pricing">Planos</button><button data-target="contact">Contacto</button></nav><button class="navCta" data-target="contact">${c.cta}</button></header><main>${hero(intel)}<section class="logos"><span>Trusted by modern teams</span><b>Stripe</b><b>Vercel</b><b>Analytics</b><b>Cloudflare</b></section>${features(intel)}${app(intel)}${pricing()}${contact()}</main><script src="script.js"></script></body></html>`;
  return { project: { html, css: styles(intel.palette[0], intel.layout), js: scripts() }, intelligence: intel };
}

function styles(p: Palette, layout: Intel['layout']) {
  const editorial = layout === 'editorial';
  const booking = layout === 'booking';
  return `:root{--bg:${editorial ? '#0f0d0b' : booking ? '#130911' : '#050713'};--panel:rgba(255,255,255,.07);--panel2:rgba(255,255,255,.11);--text:#f8fafc;--muted:#9aa4b2;--line:rgba(255,255,255,.12);--accent:${p.accent};--accent2:${p.accent2};--glow:${p.glow}}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 12% -10%,var(--glow),transparent 34%),radial-gradient(circle at 85% 5%,rgba(56,189,248,.14),transparent 36%),var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,Arial,sans-serif}.noise{position:fixed;inset:0;pointer-events:none;opacity:.08;background-image:linear-gradient(90deg,rgba(255,255,255,.2) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.2) 1px,transparent 1px);background-size:${editorial ? '90px 90px' : '60px 60px'};mask-image:radial-gradient(circle,#000,transparent 72%)}button,input,textarea{font:inherit}.nav{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:18px 5vw;border-bottom:1px solid var(--line);background:rgba(5,7,19,.7);backdrop-filter:blur(20px)}.brand{display:flex;gap:10px;align-items:center;font-weight:950;letter-spacing:-.05em}.brand span{width:34px;height:34px;border-radius:${booking ? '999px' : '12px'};display:grid;place-items:center;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#030712}nav{display:flex;gap:8px}nav button,.navCta{border:1px solid transparent;background:transparent;color:var(--muted);padding:10px 14px;border-radius:999px;cursor:pointer;font-weight:800}.navCta{background:var(--text);color:#030712}.hero{min-height:${editorial ? '860px' : '780px'};display:grid;grid-template-columns:${editorial ? '1.15fr .85fr' : '.95fr 1.05fr'};gap:54px;align-items:center;padding:92px 5vw}.eyebrow{color:var(--accent);font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:950}h1{font-size:clamp(58px,8vw,116px);line-height:.82;letter-spacing:-.09em;margin:0 0 24px}h2{font-size:clamp(38px,5vw,76px);line-height:.9;letter-spacing:-.075em;margin:0}h3{font-size:24px;letter-spacing:-.04em;margin:16px 0 10px}p,span{color:var(--muted);line-height:1.7}.lead{font-size:20px;max-width:760px}.actions,.paletteBox{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}.paletteBox{align-items:center;margin-top:22px}.paletteBox>span{font-size:12px;text-transform:uppercase;letter-spacing:.14em}.paletteBtn{border:1px solid var(--line);background:var(--panel);color:var(--text);border-radius:999px;padding:9px 12px;font-weight:800;cursor:pointer}.paletteBtn.active{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#030712}.primary,.secondary{border:0;border-radius:999px;padding:15px 24px;font-weight:950;cursor:pointer;transition:.25s}.primary{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#030712;box-shadow:0 22px 70px var(--glow)}.secondary{background:var(--panel);color:var(--text);border:1px solid var(--line)}.primary:hover,.secondary:hover,.bentoCard:hover,.price:hover,.heroCard:hover{transform:translateY(-4px)}.heroCard,.appShell{border:1px solid var(--line);border-radius:${booking ? '42px' : '36px'};padding:22px;background:linear-gradient(180deg,var(--panel2),rgba(255,255,255,.035));box-shadow:0 34px 100px rgba(0,0,0,.45);position:relative;overflow:hidden}.productVisual .metric,.phone,.bentoCard,.price,.appStats article,.appTable div{border:1px solid var(--line);border-radius:26px;background:var(--panel);padding:18px;backdrop-filter:blur(12px)}.productVisual .metric{padding:26px;background:rgba(0,0,0,.24)}.metric small{color:var(--muted);text-transform:uppercase;letter-spacing:.12em}.metric strong{display:block;font-size:58px;letter-spacing:-.07em}.metric em{color:var(--accent);font-style:normal;font-weight:900}.chart{height:250px;display:flex;align-items:end;gap:14px;padding:28px 10px}.chart i{flex:1;border-radius:999px 999px 8px 8px;background:linear-gradient(180deg,var(--accent2),var(--accent));height:42%;box-shadow:0 0 28px var(--glow)}.chart i:nth-child(2){height:65%}.chart i:nth-child(3){height:48%}.chart i:nth-child(4){height:82%}.chart i:nth-child(5){height:72%}.chart i:nth-child(6){height:92%}.signal{position:absolute;right:28px;bottom:28px;border:1px solid var(--line);border-radius:24px;background:rgba(0,0,0,.42);padding:20px;min-width:190px}.signal strong{display:block;font-size:44px;color:var(--accent)}.editorialVisual{display:grid;grid-template-columns:1.2fr .8fr;grid-auto-rows:190px;gap:14px}.editorialVisual div{border-radius:28px;background:linear-gradient(135deg,var(--accent),#111827)}.editorialVisual div:first-child{grid-row:span 2}.editorialVisual span{position:absolute;left:34px;bottom:34px;color:white;font-weight:900}.bookingVisual{display:grid;grid-template-columns:1fr .7fr;gap:24px}.phone button{border:0;border-radius:999px;background:var(--accent);padding:12px 18px;font-weight:900}.swatches{display:grid;gap:12px}.swatches i{border-radius:26px;background:linear-gradient(135deg,var(--accent),var(--accent2))}.logos{display:flex;gap:28px;align-items:center;justify-content:center;flex-wrap:wrap;padding:24px 5vw;border-block:1px solid var(--line);background:rgba(255,255,255,.03)}.logos span{font-size:12px;text-transform:uppercase;letter-spacing:.18em}.section,.appSection,.contact{padding:100px 5vw}.sectionHead{max-width:820px;margin-bottom:34px}.bento{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}.icon{width:42px;height:42px;border-radius:16px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:grid;place-items:center;color:#030712;font-weight:950}.appShell{display:grid;grid-template-columns:220px 1fr;gap:18px;min-height:520px}.appShell aside{border-right:1px solid var(--line);padding-right:18px;display:grid;align-content:start;gap:10px}.appTab{border:1px solid transparent;border-radius:16px;background:transparent;color:var(--muted);padding:13px 14px;text-align:left;font-weight:900;cursor:pointer}.appTab.active{background:var(--panel);border-color:var(--line);color:var(--text)}.appPage{display:none}.appPage.active{display:block}.appTop{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}.appTop span{font-size:28px;font-weight:950;color:var(--text)}.appTop button{border:0;border-radius:999px;background:linear-gradient(135deg,var(--accent),var(--accent2));padding:11px 16px;font-weight:950}.appStats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:18px}.appStats small{display:block;color:var(--muted)}.appStats strong{font-size:30px;color:var(--text)}.appTable{display:grid;gap:10px}.appTable div{display:grid;grid-template-columns:1fr auto auto;gap:14px;align-items:center}.appTable span{color:var(--accent);font-weight:900}.pricing{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.price{position:relative;padding:28px}.price h3{font-size:52px;margin:8px 0}.price button{margin-top:24px;width:100%;border:0;border-radius:999px;padding:14px;background:var(--text);color:#030712;font-weight:950}.featured{background:linear-gradient(180deg,var(--glow),var(--panel))}.badge{position:absolute;right:20px;top:20px;border:1px solid var(--line);border-radius:999px;padding:7px 10px;color:var(--accent);font-weight:900}.contact{display:grid;grid-template-columns:.9fr 1.1fr;gap:44px;background:rgba(255,255,255,.04);border-top:1px solid var(--line)}form{display:grid;gap:12px}input,textarea{border:1px solid var(--line);border-radius:18px;padding:16px;background:rgba(255,255,255,.08);color:var(--text)}textarea{min-height:140px}#successMessage{display:none;color:var(--accent);font-weight:900}.reveal{opacity:0;transform:translateY(18px);transition:.7s ease}.reveal.visible{opacity:1;transform:none}@media(max-width:1000px){nav{display:none}.hero,.contact,.pricing,.bento,.bookingVisual,.editorialVisual,.appShell{grid-template-columns:1fr}.appStats{grid-template-columns:1fr}h1{font-size:58px}.heroCard{order:-1}.appShell aside{border-right:0;border-bottom:1px solid var(--line);padding-right:0;padding-bottom:16px}}`;
}

function scripts() {
  return `document.querySelectorAll('[data-target]').forEach((button)=>button.addEventListener('click',()=>{const target=document.getElementById(button.dataset.target);if(target)target.scrollIntoView({behavior:'smooth',block:'start'});}));document.querySelectorAll('.paletteBtn').forEach((button)=>button.addEventListener('click',()=>{document.querySelectorAll('.paletteBtn').forEach((b)=>b.classList.remove('active'));button.classList.add('active');document.documentElement.style.setProperty('--accent',button.dataset.accent);document.documentElement.style.setProperty('--accent2',button.dataset.accent2);document.documentElement.style.setProperty('--glow',button.dataset.glow);}));document.querySelectorAll('.appTab').forEach((tab)=>tab.addEventListener('click',()=>{const page=tab.dataset.appPage;document.querySelectorAll('.appTab').forEach((x)=>x.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.appPage').forEach((view)=>view.classList.toggle('active',view.dataset.appView===page));}));const observer=new IntersectionObserver((entries)=>{entries.forEach((entry)=>{if(entry.isIntersecting)entry.target.classList.add('visible');});},{threshold:.16});document.querySelectorAll('.reveal').forEach((el)=>observer.observe(el));const form=document.getElementById('contactForm');const success=document.getElementById('successMessage');if(form&&success){form.addEventListener('submit',(event)=>{event.preventDefault();success.style.display='block';form.reset();});}`;
}

function parseProject(text: string, prompt: string, referenceUrl = '') {
  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned) as Partial<Project>;
    if (parsed.html && parsed.css && parsed.js) return { project: { html: parsed.html, css: parsed.css, js: parsed.js }, intelligence: analyze(prompt, referenceUrl) };
  } catch {}
  return build(prompt, referenceUrl);
}

async function callGemini(model: string, apiKey: string, instruction: string) {
  return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: instruction }] }], generationConfig: { temperature: 0.78, maxOutputTokens: 15000, responseMimeType: 'application/json' } }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, referenceUrl } = await request.json();
    const clean = prompt || 'site premium de tecnologia';
    const apiKey = process.env.GEMINI_API_KEY;
    const intel = analyze(clean, referenceUrl || '');
    const safeDirect = has(clean, ['trading', 'forex', 'prop firm', 'propfirm', 'funded', 'copy trading', 'fintech', 'fotografo', 'fotógrafo', 'fotografia', 'photographer', 'nails', 'unhas', 'estética', 'estetica', 'saas', 'software', 'startup', 'automação', 'automacao']);

    if (!apiKey || safeDirect) {
      return NextResponse.json({ ...build(clean, referenceUrl || ''), source: 'layout-variant-engine', model: 'variant-v6' });
    }

    const instruction = `Gera um projeto vanilla HTML/CSS/JS premium para: ${clean}. Referência: ${referenceUrl || 'nenhuma'}. Nicho: ${intel.niche}. Subnicho: ${intel.sub}. Usa layout próprio do nicho, não genérico. Cria HTML/CSS/JS com copy final de cliente. Não mostres texto interno sobre engine, DNA, builder, template, visual system ou app engine. Inclui variações de cor clicáveis e navegação funcional. Responde só JSON válido com html, css e js.`;
    const errors: string[] = [];
    for (const model of MODELS) {
      const response = await callGemini(model, apiKey, instruction);
      if (!response.ok) { errors.push(`${model}: ${await response.text()}`); continue; }
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('\n') || '';
      return NextResponse.json({ ...parseProject(text, clean, referenceUrl || ''), source: 'gemini', model });
    }
    return NextResponse.json({ ...build(clean, referenceUrl || ''), source: 'fallback', error: errors.join('\n\n') });
  } catch (error) {
    return NextResponse.json({ ...build('site premium de tecnologia'), source: 'fallback', error: String(error) });
  }
}
