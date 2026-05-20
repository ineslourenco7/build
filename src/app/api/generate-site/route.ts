import { NextRequest, NextResponse } from 'next/server';

type GeneratedProject = { html: string; css: string; js: string };
type Palette = { name: string; accent: string; accent2: string; glow: string };
type ProjectIntelligence = {
  niche: string;
  subniche: string;
  style: string;
  forbidden: string[];
  palettes: Palette[];
  bookingServices: string[];
};

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash-lite'];

function includesAny(input: string, terms: string[]) {
  const lower = input.toLowerCase();
  return terms.some((term) => lower.includes(term));
}

function analyzePrompt(prompt: string, referenceUrl = ''): ProjectIntelligence {
  const source = `${prompt} ${referenceUrl}`.toLowerCase();
  const isCopyTrading = includesAny(source, ['copy trading', 'copytrade', 'copy trader', 'copyedge']);
  const isPropFirm = includesAny(source, ['prop firm', 'propfirm', 'funded', 'funded trader', 'challenge']);
  const isCasino = includesAny(source, ['casino', 'cassino', 'igaming', 'betting', 'apostas', 'sportsbook', 'poker']);
  const isSaas = includesAny(source, ['saas', 'software', 'startup', 'tecnologia', 'tech', 'ai ', ' ia ', 'automação', 'automacao']);
  const isPhoto = includesAny(source, ['fotografo', 'fotógrafo', 'fotografia', 'fotografa', 'fotógrafa', 'photographer', 'photography']);
  const isBeauty = includesAny(source, ['nails', 'unhas', 'estética', 'estetica', 'cabeleireiro', 'barbeiro', 'spa']);

  if (isPhoto) return {
    niche: 'photography',
    subniche: includesAny(source, ['casamento', 'wedding']) ? 'wedding photography' : includesAny(source, ['moda', 'fashion']) ? 'fashion photography' : 'premium photography studio',
    style: 'editorial minimal, large imagery, warm neutrals, luxury portfolio',
    forbidden: ['unhas', 'nail art', 'manicure', 'spa treatment', 'forex', 'casino', 'prop firm'],
    palettes: [
      { name: 'Editorial Warm', accent: '#a47545', accent2: '#e7c8a0', glow: 'rgba(164,117,69,.26)' },
      { name: 'Noir Gallery', accent: '#f5f5f4', accent2: '#a8a29e', glow: 'rgba(245,245,244,.18)' },
      { name: 'Olive Studio', accent: '#9ca36a', accent2: '#d8c7a3', glow: 'rgba(156,163,106,.24)' },
    ],
    bookingServices: ['Sessão Retrato · 180€ · 60min', 'Marca Pessoal · 420€ · 2h', 'Casamento · desde 1450€ · consulta', 'Editorial/Fashion · orçamento · consulta'],
  };

  if (isBeauty) return {
    niche: 'beauty', subniche: 'beauty booking studio', style: 'soft luxury, premium cards, booking first, elegant feminine',
    forbidden: ['forex', 'copy trading', 'casino', 'photography packages'],
    palettes: [
      { name: 'Rose Luxe', accent: '#ec4899', accent2: '#f9a8d4', glow: 'rgba(236,72,153,.26)' },
      { name: 'Champagne Clinic', accent: '#c08457', accent2: '#f5d0ae', glow: 'rgba(192,132,87,.26)' },
      { name: 'Black Blush', accent: '#fb7185', accent2: '#f472b6', glow: 'rgba(251,113,133,.24)' },
    ],
    bookingServices: ['Manicure Gel · 35€ · 60min', 'Nail Art Premium · 55€ · 90min', 'Limpeza de Pele · 70€ · 75min', 'Corte e Styling · 45€ · 60min'],
  };

  if (isCasino) return {
    niche: 'igaming', subniche: 'casino / sportsbook', style: 'dark luxury, neon gold, high-retention entertainment',
    forbidden: ['beauty', 'nails', 'photography', 'wedding'],
    palettes: [
      { name: 'Gold Vegas', accent: '#f59e0b', accent2: '#ec4899', glow: 'rgba(245,158,11,.26)' },
      { name: 'Neon Royale', accent: '#a855f7', accent2: '#22d3ee', glow: 'rgba(168,85,247,.26)' },
      { name: 'Ruby Black', accent: '#ef4444', accent2: '#f97316', glow: 'rgba(239,68,68,.24)' },
    ],
    bookingServices: [],
  };

  if (isCopyTrading) return {
    niche: 'trading', subniche: 'copy trading platform', style: 'dark fintech glass inspired by CopyEdge/Rocket, dashboard-heavy, trust-first',
    forbidden: ['beauty', 'nails', 'spa', 'wedding', 'photography booking'],
    palettes: [
      { name: 'Emerald Edge', accent: '#22c55e', accent2: '#38bdf8', glow: 'rgba(34,197,94,.28)' },
      { name: 'Institutional Blue', accent: '#3b82f6', accent2: '#22d3ee', glow: 'rgba(59,130,246,.26)' },
      { name: 'Quant Purple', accent: '#8b5cf6', accent2: '#06b6d4', glow: 'rgba(139,92,246,.26)' },
    ],
    bookingServices: ['Demo da plataforma · 30min', 'Onboarding para traders · 45min', 'Consulta de automação · 60min'],
  };

  if (isPropFirm) return {
    niche: 'trading', subniche: 'prop firm / funded trader', style: 'dark institutional fintech, risk dashboard, challenge cards',
    forbidden: ['beauty', 'nails', 'spa', 'photography', 'wedding'],
    palettes: [
      { name: 'Funded Green', accent: '#22c55e', accent2: '#38bdf8', glow: 'rgba(34,197,94,.28)' },
      { name: 'Terminal Cyan', accent: '#06b6d4', accent2: '#84cc16', glow: 'rgba(6,182,212,.24)' },
      { name: 'Black Gold Capital', accent: '#f59e0b', accent2: '#22c55e', glow: 'rgba(245,158,11,.22)' },
    ],
    bookingServices: ['Consulta funded account · 30min', 'Sessão risk management · 45min', 'Demo do dashboard · 30min'],
  };

  if (isSaas) return {
    niche: 'technology', subniche: 'AI SaaS / automation', style: 'dark SaaS, glass dashboard, bento systems, clean motion',
    forbidden: ['beauty', 'nails', 'spa', 'wedding', 'casino games'],
    palettes: [
      { name: 'Violet AI', accent: '#8b5cf6', accent2: '#06b6d4', glow: 'rgba(139,92,246,.26)' },
      { name: 'Linear Blue', accent: '#3b82f6', accent2: '#a855f7', glow: 'rgba(59,130,246,.24)' },
      { name: 'Cyber Lime', accent: '#84cc16', accent2: '#22d3ee', glow: 'rgba(132,204,22,.22)' },
    ],
    bookingServices: ['Demo do produto · 30min', 'Auditoria de automações · 45min', 'Call de implementação · 60min'],
  };

  return {
    niche: 'business', subniche: 'premium business website', style: 'dark premium business, conversion focused',
    forbidden: ['nails unless requested', 'forex unless requested', 'casino unless requested'],
    palettes: [
      { name: 'Executive Blue', accent: '#38bdf8', accent2: '#8b5cf6', glow: 'rgba(56,189,248,.24)' },
      { name: 'Black Gold', accent: '#f59e0b', accent2: '#facc15', glow: 'rgba(245,158,11,.22)' },
      { name: 'Emerald Scale', accent: '#10b981', accent2: '#38bdf8', glow: 'rgba(16,185,129,.24)' },
    ],
    bookingServices: ['Call estratégica · 30min', 'Diagnóstico de crescimento · 45min', 'Sessão premium · 60min'],
  };
}

function copyFor(intel: ProjectIntelligence) {
  const p = intel.palettes[0];
  const isCopy = intel.subniche.includes('copy trading');
  const isProp = intel.subniche.includes('prop firm');
  const isCasino = intel.niche === 'igaming';
  const isPhoto = intel.niche === 'photography';
  const isBeauty = intel.niche === 'beauty';

  return {
    brand: isCopy ? 'CopyEdge Capital' : isProp ? 'ApexFunded' : isCasino ? 'NovaPlay Studio' : isPhoto ? 'Marta Vale Studio' : isBeauty ? 'Aura Beauty Lab' : intel.niche === 'technology' ? 'Nexora AI' : 'ScaleEdge Labs',
    eyebrow: isCopy ? 'COPY TRADING • AUTOMATION • SIGNALS' : isProp ? 'PROP FIRM • RISK • FUNDED ACCOUNTS' : isCasino ? 'IGAMING • CASINO • PLAYER EXPERIENCE' : isPhoto ? 'EDITORIAL PHOTOGRAPHY • PORTFOLIO • BOOKING' : isBeauty ? 'BEAUTY • BOOKINGS • PREMIUM CARE' : intel.niche === 'technology' ? 'AI SAAS • AUTOMATION • GROWTH' : 'BUSINESS • STRATEGY • SYSTEMS',
    headline: isCopy ? 'Copy trading com controlo, métricas e confiança.' : isProp ? 'Capital para traders consistentes.' : isCasino ? 'Uma experiência igaming premium, rápida e envolvente.' : isPhoto ? 'Fotografia com direção, atmosfera e intenção.' : isBeauty ? 'Marcações premium para beleza, estética e cuidado.' : intel.niche === 'technology' ? 'Software com estética de produto global.' : 'Sistemas digitais para negócios que querem escalar.',
    sub: isCopy ? 'Uma plataforma para apresentar estratégias, performance, risco, subscrições e automações de copy trading com visual fintech premium.' : isProp ? 'Uma experiência institucional para challenges, métricas de risco, payouts, regras transparentes e onboarding de traders.' : isCasino ? 'Plataforma dark premium para casino, sportsbook ou entretenimento digital com lobby, bónus, segurança, pagamentos e retenção.' : isPhoto ? 'Portfólio editorial com galerias, histórias, pacotes e booking adequado a fotografia — sem parecer estética, spa ou clínica.' : isBeauty ? 'Website elegante com serviços, galeria, equipa, preços e calendário de marcações contextual para o negócio.' : intel.niche === 'technology' ? 'Uma presença SaaS com produto claro, integrações, automações, analytics, pricing e uma narrativa preparada para converter.' : 'Uma presença digital high-ticket para consultoria, agência ou negócio B2B com narrativa, métricas e conversão.',
    primary: isPhoto ? 'Ver portfólio' : isBeauty ? 'Marcar horário' : isCasino ? 'Explorar plataforma' : isCopy ? 'Ver performance' : isProp ? 'Ver challenges' : 'Começar demo',
    sectionTitle: isCopy ? 'Tudo para transformar performance em produto.' : isProp ? 'Ferramentas criadas para avaliação e confiança.' : isCasino ? 'Tudo o que uma plataforma de jogo precisa para converter.' : isPhoto ? 'Galeria, narrativa e booking no mesmo fluxo.' : isBeauty ? 'Serviços, disponibilidade e reserva sem fricção.' : 'Funcionalidades que transformam operações em automações.',
    sectionDescription: isCopy ? 'Perfis de traders, estatísticas, risco, subscrições e sinais são apresentados com clareza para aumentar confiança.' : isProp ? 'Challenges, regras, payouts e dashboards reduzem dúvidas e tornam a proposta mais credível.' : isCasino ? 'Lobby, bónus, pagamentos, segurança e retenção trabalham juntos para criar uma experiência fluida e credível.' : isPhoto ? 'A experiência valoriza imagens grandes, textos curtos, curadoria e uma reserva adequada a sessões fotográficas.' : isBeauty ? 'O cliente escolhe serviço, dia e hora com uma experiência visual elegante e simples.' : 'Workflows, portal cliente, analytics e integrações reduzem trabalho manual e aumentam velocidade.',
    accent: p.accent,
    accent2: p.accent2,
    glow: p.glow,
  };
}

function premiumTemplate(prompt: string, referenceUrl = ''): { project: GeneratedProject; intelligence: ProjectIntelligence } {
  const intel = analyzePrompt(prompt, referenceUrl);
  const c = copyFor(intel);
  const paletteButtons = intel.palettes.map((p, i) => `<button class="paletteBtn${i === 0 ? ' active' : ''}" data-accent="${p.accent}" data-accent2="${p.accent2}" data-glow="${p.glow}">${p.name}</button>`).join('');
  const features = intel.niche === 'photography'
    ? ['Portfólio editorial', 'Galerias filtráveis', 'Booking de sessões', 'Entrega digital']
    : intel.niche === 'beauty'
      ? ['Calendário de marcações', 'Serviços e preços', 'Galeria social', 'Confirmação rápida']
      : intel.subniche.includes('copy trading')
        ? ['Perfis de traders', 'Risk score', 'Copy automation', 'Performance analytics']
        : intel.subniche.includes('prop firm')
          ? ['Challenge cards', 'Risk rules', 'Payout flow', 'Trader dashboard']
          : intel.niche === 'igaming'
            ? ['Lobby inteligente', 'Bónus e loyalty', 'Pagamentos e KYC', 'Retenção por segmentos']
            : ['AI workflows', 'Client portal', 'Analytics suite', 'Automations hub'];

  const html = `<!doctype html><html lang="pt"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>${c.brand}</title><link rel="stylesheet" href="style.css"/></head><body><div class="noise"></div><header class="nav"><div class="brand"><span>${c.brand[0]}</span>${c.brand}</div><nav><button data-target="platform">Plataforma</button><button data-target="proof">Resultados</button><button data-target="pricing">Planos</button><button data-target="contact">Contacto</button></nav><button class="navCta" data-target="contact">${c.primary}</button></header><main><section class="hero" id="home"><div class="heroCopy reveal"><p class="eyebrow">${c.eyebrow}</p><h1>${c.headline}</h1><p class="lead">${c.sub}</p><div class="actions"><button class="primary" data-target="platform">${c.primary}</button><button class="secondary" data-target="pricing">Ver opções</button></div><div class="paletteBox"><span>Variações de cor</span>${paletteButtons}</div></div><div class="heroVisual reveal"><div class="dashTop"><span></span><span></span><span></span></div><div class="metricHero"><small>${intel.niche === 'photography' ? 'Sessões entregues' : intel.niche === 'beauty' ? 'Reservas mensais' : 'Volume mensal'}</small><strong>${intel.niche === 'photography' ? '180+' : intel.niche === 'beauty' ? '420' : intel.niche === 'igaming' ? '€8.4M' : intel.niche === 'trading' ? '$42.8M' : '1.8M'}</strong><em>+${intel.niche === 'photography' ? '37' : '42'}% crescimento</em></div><div class="chart"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="miniGrid"><div><b>${intel.niche === 'photography' ? 'Rating' : intel.niche === 'beauty' ? 'Show rate' : intel.niche === 'trading' ? 'Risk score' : 'Retention'}</b><span>${intel.niche === 'photography' ? '4.9★' : intel.niche === 'beauty' ? '91%' : intel.niche === 'trading' ? 'A+' : '74%'}</span></div><div><b>Users</b><span>${intel.niche === 'photography' ? '1.2k' : intel.niche === 'beauty' ? '3.8k' : '24k'}</span></div><div><b>Latency</b><span>32ms</span></div></div></div></section><section class="logos"><span>Stack confiável</span><b>Stripe</b><b>Vercel</b><b>Analytics</b><b>Automations</b><b>Cloudflare</b></section><section id="platform" class="section"><div class="sectionHead reveal"><p class="eyebrow">${intel.subniche}</p><h2>${c.sectionTitle}</h2><p>${c.sectionDescription}</p></div><div class="bento">${features.map((f, i) => `<article class="bentoCard reveal"><div class="icon">${i + 1}</div><h3>${f}</h3><p>${intel.niche === 'photography' ? 'Pensado para valorizar imagem, curadoria e confiança antes da reserva.' : intel.niche === 'beauty' ? 'Pensado para reduzir fricção e transformar visitantes em marcações.' : intel.niche === 'trading' ? 'Pensado para transmitir transparência, performance e controlo de risco.' : 'Pensado para tornar a experiência mais clara, rápida e rentável.'}</p></article>`).join('')}</div></section><section id="proof" class="proof"><div class="panel reveal"><p class="eyebrow">Operação</p><h2>${intel.niche === 'photography' ? 'Uma experiência visual preparada para vender sessões.' : intel.niche === 'beauty' ? 'Agenda, serviços e contacto num fluxo simples.' : intel.niche === 'trading' ? 'Métricas que inspiram confiança.' : 'Visibilidade total sobre crescimento.'}</h2><div class="rows"><div><span>Conversão</span><b>12.8%</b></div><div><span>Retenção</span><b>74%</b></div><div><span>Pipeline</span><b>${intel.niche === 'photography' ? '€18k' : intel.niche === 'beauty' ? '€24k' : intel.niche === 'igaming' ? '€2.1M' : '€310k'}</b></div></div></div><div class="testimonial reveal"><blockquote>“A experiência parece específica para o negócio, com detalhes visuais e copy que transmitem confiança.”</blockquote><span>— Cliente beta</span></div></section><section id="pricing" class="section"><div class="sectionHead reveal"><p class="eyebrow">Planos</p><h2>Escolhe o nível certo para lançar.</h2></div><div class="pricing"><article class="price reveal"><p>Launch</p><h3>€490</h3><span>Landing premium, analytics e formulário</span><button data-target="contact">Escolher</button></article><article class="price featured reveal"><div class="badge">Popular</div><p>Growth</p><h3>€1.490</h3><span>Multi-page, booking/dashboard e automações</span><button data-target="contact">Começar</button></article><article class="price reveal"><p>Scale</p><h3>Custom</h3><span>Produto completo, integrações e área cliente</span><button data-target="contact">Falar</button></article></div></section><section id="contact" class="contact"><div><p class="eyebrow">Próximo passo</p><h2>Vamos transformar a visão num produto vendável.</h2><p>Envia o objetivo, referências e conteúdos. O sistema mantém o nicho e evita misturar contextos errados.</p></div><form id="contactForm"><input placeholder="Nome" required/><input type="email" placeholder="Email" required/><textarea placeholder="O que queres construir?" required></textarea><button class="primary" type="submit">Enviar pedido</button><p id="successMessage">Pedido recebido. Entraremos em contacto.</p></form></section></main><script src="script.js"></script></body></html>`;

  const css = `:root{--bg:#050713;--panel:rgba(255,255,255,.07);--panel2:rgba(255,255,255,.11);--text:#f8fafc;--muted:#9aa4b2;--line:rgba(255,255,255,.12);--accent:${c.accent};--accent2:${c.accent2};--glow:${c.glow}}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 12% -10%,var(--glow),transparent 34%),radial-gradient(circle at 85% 5%,rgba(56,189,248,.18),transparent 36%),var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,Arial,sans-serif}.noise{position:fixed;inset:0;pointer-events:none;opacity:.08;background-image:linear-gradient(90deg,rgba(255,255,255,.2) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.2) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(circle,#000,transparent 72%)}button,input,textarea{font:inherit}.nav{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:18px 5vw;border-bottom:1px solid var(--line);background:rgba(5,7,19,.7);backdrop-filter:blur(20px)}.brand{display:flex;gap:10px;align-items:center;font-weight:950;letter-spacing:-.05em}.brand span{width:34px;height:34px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#030712}nav{display:flex;gap:8px}nav button,.navCta{border:1px solid transparent;background:transparent;color:var(--muted);padding:10px 14px;border-radius:999px;cursor:pointer;font-weight:800}.navCta{background:var(--text);color:#030712}.hero{min-height:780px;display:grid;grid-template-columns:.95fr 1.05fr;gap:54px;align-items:center;padding:92px 5vw}.eyebrow{color:var(--accent);font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:950}h1{font-size:clamp(58px,8vw,116px);line-height:.82;letter-spacing:-.09em;margin:0 0 24px}h2{font-size:clamp(38px,5vw,76px);line-height:.9;letter-spacing:-.075em;margin:0}h3{font-size:24px;letter-spacing:-.04em;margin:16px 0 10px}p,span{color:var(--muted);line-height:1.7}.lead{font-size:20px;max-width:760px}.actions,.paletteBox{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}.paletteBox{align-items:center;margin-top:22px}.paletteBox>span{font-size:12px;text-transform:uppercase;letter-spacing:.14em}.paletteBtn{border:1px solid var(--line);background:var(--panel);color:var(--text);border-radius:999px;padding:9px 12px;font-weight:800;cursor:pointer}.paletteBtn.active{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#030712}.primary,.secondary{border:0;border-radius:999px;padding:15px 24px;font-weight:950;cursor:pointer;transition:.25s}.primary{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#030712;box-shadow:0 22px 70px var(--glow)}.secondary{background:var(--panel);color:var(--text);border:1px solid var(--line)}.primary:hover,.secondary:hover,.bentoCard:hover,.price:hover{transform:translateY(-4px)}.heroVisual{border:1px solid var(--line);border-radius:36px;padding:22px;background:linear-gradient(180deg,var(--panel2),rgba(255,255,255,.035));box-shadow:0 34px 100px rgba(0,0,0,.45);position:relative;overflow:hidden}.dashTop{display:flex;gap:8px;margin-bottom:22px}.dashTop span{width:11px;height:11px;border-radius:99px;background:#ef4444}.dashTop span:nth-child(2){background:#f59e0b}.dashTop span:nth-child(3){background:#22c55e}.metricHero{padding:26px;border:1px solid var(--line);border-radius:28px;background:rgba(0,0,0,.24)}.metricHero small{color:var(--muted);text-transform:uppercase;letter-spacing:.12em}.metricHero strong{display:block;font-size:58px;letter-spacing:-.07em}.metricHero em{color:var(--accent);font-style:normal;font-weight:900}.chart{height:250px;display:flex;align-items:end;gap:14px;padding:28px 10px}.chart i{flex:1;border-radius:999px 999px 8px 8px;background:linear-gradient(180deg,var(--accent2),var(--accent));height:42%;box-shadow:0 0 28px var(--glow)}.chart i:nth-child(2){height:65%}.chart i:nth-child(3){height:48%}.chart i:nth-child(4){height:82%}.chart i:nth-child(5){height:72%}.chart i:nth-child(6){height:92%}.chart i:nth-child(7){height:78%}.miniGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.miniGrid div,.bentoCard,.price,.panel,.testimonial{border:1px solid var(--line);border-radius:26px;background:var(--panel);padding:18px;backdrop-filter:blur(12px)}.miniGrid b{display:block;color:var(--text)}.logos{display:flex;gap:28px;align-items:center;justify-content:center;flex-wrap:wrap;padding:24px 5vw;border-block:1px solid var(--line);background:rgba(255,255,255,.03)}.logos span{font-size:12px;text-transform:uppercase;letter-spacing:.18em}.section,.contact,.proof{padding:100px 5vw}.sectionHead{max-width:820px;margin-bottom:34px}.bento{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}.icon{width:42px;height:42px;border-radius:16px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:grid;place-items:center;color:#030712;font-weight:950}.proof{display:grid;grid-template-columns:1.1fr .9fr;gap:22px;background:rgba(255,255,255,.035);border-block:1px solid var(--line)}.rows{display:grid;gap:12px;margin-top:24px}.rows div{display:flex;justify-content:space-between;border-bottom:1px solid var(--line);padding:16px 0}.rows b{font-size:28px}.testimonial blockquote{font-size:28px;line-height:1.4;letter-spacing:-.04em;color:var(--text);margin:0 0 18px}.pricing{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.price{position:relative;padding:28px}.price h3{font-size:52px;margin:8px 0}.price button{margin-top:24px;width:100%;border:0;border-radius:999px;padding:14px;background:var(--text);color:#030712;font-weight:950}.featured{background:linear-gradient(180deg,var(--glow),var(--panel))}.badge{position:absolute;right:20px;top:20px;border:1px solid var(--line);border-radius:999px;padding:7px 10px;color:var(--accent);font-weight:900}.contact{display:grid;grid-template-columns:.9fr 1.1fr;gap:44px;background:rgba(255,255,255,.04);border-top:1px solid var(--line)}form{display:grid;gap:12px}input,textarea{border:1px solid var(--line);border-radius:18px;padding:16px;background:rgba(255,255,255,.08);color:var(--text)}textarea{min-height:140px}#successMessage{display:none;color:var(--accent);font-weight:900}.reveal{opacity:0;transform:translateY(18px);transition:.7s ease}.reveal.visible{opacity:1;transform:none}@media(max-width:1000px){nav{display:none}.hero,.proof,.contact,.pricing,.bento{grid-template-columns:1fr}.miniGrid{grid-template-columns:1fr}h1{font-size:58px}.heroVisual{order:-1}}`;

  const js = `document.querySelectorAll('[data-target]').forEach((button)=>button.addEventListener('click',()=>{const target=document.getElementById(button.dataset.target);if(target)target.scrollIntoView({behavior:'smooth',block:'start'});}));
document.querySelectorAll('.paletteBtn').forEach((button)=>button.addEventListener('click',()=>{document.querySelectorAll('.paletteBtn').forEach((b)=>b.classList.remove('active'));button.classList.add('active');document.documentElement.style.setProperty('--accent',button.dataset.accent);document.documentElement.style.setProperty('--accent2',button.dataset.accent2);document.documentElement.style.setProperty('--glow',button.dataset.glow);}));
const observer=new IntersectionObserver((entries)=>{entries.forEach((entry)=>{if(entry.isIntersecting)entry.target.classList.add('visible');});},{threshold:.16});document.querySelectorAll('.reveal').forEach((el)=>observer.observe(el));
const form=document.getElementById('contactForm');const success=document.getElementById('successMessage');if(form&&success){form.addEventListener('submit',(event)=>{event.preventDefault();success.style.display='block';form.reset();});}`;

  return { project: { html, css, js }, intelligence: intel };
}

function fallbackProject(prompt: string, referenceUrl = '') {
  return premiumTemplate(prompt, referenceUrl);
}

function parseProject(text: string, prompt: string, referenceUrl = '') {
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  try {
    const parsed = JSON.parse(cleaned) as Partial<GeneratedProject>;
    if (parsed.html && parsed.css && parsed.js) return { project: { html: parsed.html, css: parsed.css, js: parsed.js }, intelligence: analyzePrompt(prompt, referenceUrl) };
  } catch {}
  return fallbackProject(prompt, referenceUrl);
}

async function callGemini(model: string, apiKey: string, instruction: string) {
  return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: instruction }] }], generationConfig: { temperature: 0.65, maxOutputTokens: 14000, responseMimeType: 'application/json' } }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, referenceUrl } = await request.json();
    const cleanPrompt = prompt || 'site premium de tecnologia';
    const apiKey = process.env.GEMINI_API_KEY;
    const intelligence = analyzePrompt(cleanPrompt, referenceUrl || '');

    if (!apiKey || isHighTicketPrompt(cleanPrompt) || isPhotographerPrompt(cleanPrompt)) {
      const result = fallbackProject(cleanPrompt, referenceUrl || '');
      return NextResponse.json({ ...result, source: 'design-engine', model: 'niche-intelligence-v1' });
    }

    const instruction = `Gera um projeto vanilla HTML/CSS/JS premium em português europeu para: ${cleanPrompt}. Referência opcional: ${referenceUrl || 'nenhuma'}.
Nicho: ${intelligence.niche}. Subnicho: ${intelligence.subniche}. Estilo: ${intelligence.style}.
Contextos proibidos: ${intelligence.forbidden.join(', ')}.
Usa estas paletas como opções clicáveis no site: ${intelligence.palettes.map((p) => `${p.name} ${p.accent}/${p.accent2}`).join(' | ')}.
Responde só JSON válido com html, css e js. O texto deve falar do negócio do cliente, nunca do builder, do template ou de componentes internos. Não mistures nichos.`;

    const errors: string[] = [];
    for (const model of GEMINI_MODELS) {
      const response = await callGemini(model, apiKey, instruction);
      if (!response.ok) { errors.push(`${model}: ${await response.text()}`); continue; }
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('\n') || '';
      const parsed = parseProject(text, cleanPrompt, referenceUrl || '');
      return NextResponse.json({ ...parsed, source: 'gemini', model });
    }

    const result = fallbackProject(cleanPrompt, referenceUrl || '');
    return NextResponse.json({ ...result, source: 'fallback', error: errors.join('\n\n') });
  } catch (error) {
    const result = fallbackProject('site premium de tecnologia');
    return NextResponse.json({ ...result, source: 'fallback', error: String(error) });
  }
}
