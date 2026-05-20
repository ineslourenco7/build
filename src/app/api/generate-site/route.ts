import { NextRequest, NextResponse } from 'next/server';

type GeneratedProject = { html: string; css: string; js: string };

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash-lite'];

function includesAny(input: string, terms: string[]) {
  const lower = input.toLowerCase();
  return terms.some((term) => lower.includes(term));
}

function isHighTicketPrompt(prompt: string) {
  return includesAny(prompt, [
    'tecnologia', 'tech', 'software', 'saas', 'startup', 'ai', 'ia', 'automação', 'automacao',
    'trading', 'forex', 'prop firm', 'propfirm', 'funded', 'copy trading', 'crypto', 'fintech',
    'negócio', 'negocio', 'business', 'agency', 'consultoria', 'consulting',
    'casino', 'cassino', 'igaming', 'betting', 'apostas', 'sportsbook', 'poker'
  ]);
}

function isPhotographerPrompt(prompt: string) {
  return includesAny(prompt, ['fotografo', 'fotógrafo', 'fotografia', 'fotografa', 'fotógrafa', 'photographer', 'photography', 'wedding photographer', 'portfolio fotografico', 'portfólio fotográfico']);
}

function highTicketTemplate(prompt: string): GeneratedProject {
  const lower = prompt.toLowerCase();
  const isCasino = includesAny(lower, ['casino', 'cassino', 'igaming', 'betting', 'apostas', 'sportsbook', 'poker']);
  const isTrading = includesAny(lower, ['trading', 'forex', 'prop firm', 'propfirm', 'funded', 'copy trading', 'crypto']);
  const isSaas = includesAny(lower, ['saas', 'software', 'startup', 'tecnologia', 'tech', 'ai', 'ia', 'automação', 'automacao']);

  const brand = isCasino ? 'NovaPlay Studio' : isTrading ? 'CopyEdge Capital' : isSaas ? 'Nexora AI' : 'ScaleEdge Labs';
  const eyebrow = isCasino ? 'IGAMING • CASINO • PLAYER EXPERIENCE' : isTrading ? 'TRADING • DATA • AUTOMATION' : isSaas ? 'AI SAAS • AUTOMATION • GROWTH' : 'BUSINESS • STRATEGY • SYSTEMS';
  const headline = isCasino ? 'Uma experiência igaming premium, rápida e envolvente.' : isTrading ? 'Infraestrutura premium para traders, sinais e capital.' : isSaas ? 'Software com estética de produto global.' : 'Sistemas digitais para negócios que querem escalar.';
  const sub = isCasino ? 'Plataforma dark premium para casino, sportsbook ou entretenimento digital com lobby, bónus, segurança, pagamentos e retenção.' : isTrading ? 'Uma experiência fintech com dashboards, métricas, pricing, prova social, automações e confiança visual para produtos de trading.' : isSaas ? 'Uma presença SaaS com produto claro, integrações, automações, analytics, pricing e uma narrativa preparada para converter.' : 'Uma presença digital high-ticket para consultoria, agência ou negócio B2B com narrativa, métricas e conversão.';
  const primary = isCasino ? 'Explorar plataforma' : isTrading ? 'Ver sistema' : isSaas ? 'Começar demo' : 'Agendar estratégia';
  const accent = isCasino ? '#f59e0b' : isTrading ? '#22c55e' : isSaas ? '#8b5cf6' : '#38bdf8';
  const accent2 = isCasino ? '#ec4899' : isTrading ? '#38bdf8' : isSaas ? '#06b6d4' : '#8b5cf6';
  const sectionTitle = isCasino ? 'Tudo o que uma plataforma de jogo precisa para converter.' : isTrading ? 'Ferramentas criadas para performance e confiança.' : isSaas ? 'Funcionalidades que transformam operações em automações.' : 'Sistemas para captar, vender e entregar melhor.';
  const sectionDescription = isCasino ? 'Lobby, bónus, pagamentos, segurança e retenção trabalham juntos para criar uma experiência fluida e credível.' : isTrading ? 'Sinais, gestão de risco, analytics e automações dão aos utilizadores uma visão clara da operação.' : isSaas ? 'Workflows, portal cliente, analytics e integrações reduzem trabalho manual e aumentam velocidade.' : 'Estratégia, aquisição, operações e autoridade digital reunidas numa experiência premium.';
  const proofTitle = isCasino ? 'Operação preparada para escala.' : isTrading ? 'Métricas que inspiram confiança.' : isSaas ? 'Visibilidade total sobre crescimento.' : 'Decisões apoiadas por dados.';
  const testimonial = isCasino ? '“A experiência parece rápida, segura e premium desde o primeiro clique.”' : isTrading ? '“Finalmente uma presença fintech que transmite confiança antes mesmo do onboarding.”' : isSaas ? '“O produto ficou claro, moderno e muito mais fácil de vender.”' : '“A marca passou a parecer maior, mais clara e mais preparada para fechar clientes.”';
  const cards = isCasino
    ? ['Lobby inteligente', 'Bónus e loyalty', 'Pagamentos e KYC', 'Retenção por segmentos']
    : isTrading
      ? ['Copy trading engine', 'Risk dashboard', 'Payout automation', 'TradingView signals']
      : isSaas
        ? ['AI workflows', 'Client portal', 'Analytics suite', 'Automations hub']
        : ['Revenue systems', 'Client acquisition', 'Operations dashboard', 'Brand authority'];

  return {
    html: `<!doctype html>
<html lang="pt">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>${brand}</title><link rel="stylesheet" href="style.css"/></head>
<body>
  <div class="noise"></div>
  <header class="nav">
    <div class="brand"><span>${brand.slice(0, 1)}</span>${brand}</div>
    <nav>
      <button data-target="platform">Plataforma</button>
      <button data-target="proof">Resultados</button>
      <button data-target="pricing">Planos</button>
      <button data-target="faq">FAQ</button>
    </nav>
    <button class="navCta" data-target="contact">${primary}</button>
  </header>
  <main>
    <section class="hero" id="home">
      <div class="heroCopy reveal">
        <p class="eyebrow">${eyebrow}</p>
        <h1>${headline}</h1>
        <p class="lead">${sub}</p>
        <div class="actions"><button class="primary" data-target="pricing">${primary}</button><button class="secondary" data-target="platform">Ver funcionalidades</button></div>
        <div class="trust"><span>99.9% uptime</span><span>Live analytics</span><span>Premium UX</span></div>
      </div>
      <div class="heroVisual reveal">
        <div class="dashTop"><span></span><span></span><span></span></div>
        <div class="metricHero"><small>Volume mensal</small><strong>${isCasino ? '€8.4M' : isTrading ? '$42.8M' : '1.8M'}</strong><em>+${isCasino ? '31' : isTrading ? '24' : '42'}% crescimento</em></div>
        <div class="chart"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
        <div class="miniGrid"><div><b>${isCasino ? 'RTP' : isTrading ? 'Win rate' : 'ARR'}</b><span>${isCasino ? '97.2%' : isTrading ? '68%' : '€420k'}</span></div><div><b>Utilizadores</b><span>${isCasino ? '128k' : isTrading ? '24k' : '18k'}</span></div><div><b>Latência</b><span>32ms</span></div></div>
      </div>
    </section>

    <section class="logos"><span>STACK CONFIÁVEL</span><b>Stripe</b><b>Vercel</b><b>TradingView</b><b>OpenAI</b><b>Cloudflare</b></section>

    <section id="platform" class="section">
      <div class="sectionHead reveal"><p class="eyebrow">PLATAFORMA</p><h2>${sectionTitle}</h2><p>${sectionDescription}</p></div>
      <div class="bento">
        ${cards.map((card, index) => `<article class="bentoCard reveal"><div class="icon">${index + 1}</div><h3>${card}</h3><p>${isCasino ? 'Módulo pensado para aumentar confiança, retenção e valor por utilizador.' : isTrading ? 'Camada operacional para dar clareza, velocidade e controlo à experiência de trading.' : isSaas ? 'Funcionalidade preparada para reduzir fricção e acelerar adoção do produto.' : 'Sistema pensado para melhorar aquisição, entrega e percepção de valor.'}</p></article>`).join('')}
      </div>
    </section>

    <section id="proof" class="proof">
      <div class="panel reveal"><p class="eyebrow">OPERAÇÃO</p><h2>${proofTitle}</h2><div class="rows"><div><span>Conversão</span><b>12.8%</b></div><div><span>Retenção</span><b>74%</b></div><div><span>Pipeline</span><b>${isCasino ? '€2.1M' : isTrading ? '$870k' : '€310k'}</b></div></div></div>
      <div class="testimonial reveal"><blockquote>${testimonial}</blockquote><span>— Cliente beta</span></div>
    </section>

    <section id="pricing" class="section">
      <div class="sectionHead reveal"><p class="eyebrow">PLANOS</p><h2>Escolhe o nível certo para lançar.</h2></div>
      <div class="pricing">
        <article class="price reveal"><p>Launch</p><h3>€490</h3><span>Landing premium, analytics e formulário</span><button data-target="contact">Escolher</button></article>
        <article class="price featured reveal"><div class="badge">Popular</div><p>Growth</p><h3>€1.490</h3><span>Multi-page, dashboard e automações</span><button data-target="contact">Começar</button></article>
        <article class="price reveal"><p>Scale</p><h3>Custom</h3><span>Produto completo, integrações e área cliente</span><button data-target="contact">Falar</button></article>
      </div>
    </section>

    <section id="faq" class="faqWrap"><div class="sectionHead reveal"><p class="eyebrow">FAQ</p><h2>Perguntas rápidas.</h2></div><div class="faqList"><button class="faq">Quanto tempo demora a lançar?<p>Uma primeira versão pode ficar pronta rapidamente e evoluir por fases com integrações reais.</p></button><button class="faq">Pode ter várias páginas?<p>Sim. A experiência pode incluir home, sobre, serviços, pricing, booking, dashboard e contacto.</p></button><button class="faq">Pode integrar backend?<p>Sim. Depois podem ser ligados pagamentos, base de dados, autenticação e automações.</p></button></div></section>

    <section id="contact" class="contact"><div><p class="eyebrow">PRÓXIMO PASSO</p><h2>Vamos transformar a visão num produto vendável.</h2><p>Conta-nos o objetivo da plataforma e recebemos o briefing para preparar uma experiência com estratégia, design e conversão.</p></div><form id="contactForm"><input placeholder="Nome" required/><input type="email" placeholder="Email" required/><textarea placeholder="O que queres construir?" required></textarea><button class="primary" type="submit">Enviar pedido</button><p id="successMessage">Pedido recebido. Entraremos em contacto.</p></form></section>
  </main>
  <script src="script.js"></script>
</body></html>`,
    css: `:root{--bg:#050713;--panel:rgba(255,255,255,.07);--panel2:rgba(255,255,255,.11);--text:#f8fafc;--muted:#9aa4b2;--line:rgba(255,255,255,.12);--accent:${accent};--accent2:${accent2}}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 12% -10%,color-mix(in srgb,var(--accent) 32%,transparent),transparent 34%),radial-gradient(circle at 85% 5%,color-mix(in srgb,var(--accent2) 25%,transparent),transparent 36%),var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Arial,sans-serif}.noise{position:fixed;inset:0;pointer-events:none;opacity:.08;background-image:linear-gradient(90deg,rgba(255,255,255,.2) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.2) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(circle,#000,transparent 72%)}button,input,textarea{font:inherit}.nav{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:18px 5vw;border-bottom:1px solid var(--line);background:rgba(5,7,19,.7);backdrop-filter:blur(20px)}.brand{display:flex;gap:10px;align-items:center;font-weight:950;letter-spacing:-.05em}.brand span{width:34px;height:34px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#030712}nav{display:flex;gap:8px}nav button,.navCta{border:1px solid transparent;background:transparent;color:var(--muted);padding:10px 14px;border-radius:999px;cursor:pointer;font-weight:800}.navCta{background:var(--text);color:#030712}.hero{min-height:780px;display:grid;grid-template-columns:.95fr 1.05fr;gap:54px;align-items:center;padding:92px 5vw}.eyebrow{color:var(--accent);font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:950}h1{font-size:clamp(58px,8vw,116px);line-height:.82;letter-spacing:-.09em;margin:0 0 24px}h2{font-size:clamp(38px,5vw,76px);line-height:.9;letter-spacing:-.075em;margin:0}h3{font-size:24px;letter-spacing:-.04em;margin:16px 0 10px}p,span{color:var(--muted);line-height:1.7}.lead{font-size:20px;max-width:760px}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}.primary,.secondary{border:0;border-radius:999px;padding:15px 24px;font-weight:950;cursor:pointer;transition:.25s}.primary{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#030712;box-shadow:0 22px 70px color-mix(in srgb,var(--accent) 28%,transparent)}.secondary{background:var(--panel);color:var(--text);border:1px solid var(--line)}.primary:hover,.secondary:hover,.bentoCard:hover,.price:hover{transform:translateY(-4px)}.trust{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}.trust span{border:1px solid var(--line);background:var(--panel);border-radius:999px;padding:8px 12px;font-size:13px}.heroVisual{border:1px solid var(--line);border-radius:36px;padding:22px;background:linear-gradient(180deg,var(--panel2),rgba(255,255,255,.035));box-shadow:0 34px 100px rgba(0,0,0,.45);position:relative;overflow:hidden}.heroVisual:before{content:'';position:absolute;inset:-40%;background:radial-gradient(circle,var(--accent),transparent 35%);opacity:.12;animation:spin 12s linear infinite}.dashTop,.metricHero,.chart,.miniGrid{position:relative}.dashTop{display:flex;gap:8px;margin-bottom:22px}.dashTop span{width:11px;height:11px;border-radius:99px;background:#ef4444}.dashTop span:nth-child(2){background:#f59e0b}.dashTop span:nth-child(3){background:#22c55e}.metricHero{padding:26px;border:1px solid var(--line);border-radius:28px;background:rgba(0,0,0,.24)}.metricHero small{color:var(--muted);text-transform:uppercase;letter-spacing:.12em}.metricHero strong{display:block;font-size:58px;letter-spacing:-.07em}.metricHero em{color:var(--accent);font-style:normal;font-weight:900}.chart{height:250px;display:flex;align-items:end;gap:14px;padding:28px 10px}.chart i{flex:1;border-radius:999px 999px 8px 8px;background:linear-gradient(180deg,var(--accent2),var(--accent));height:42%;box-shadow:0 0 28px color-mix(in srgb,var(--accent) 32%,transparent)}.chart i:nth-child(2){height:65%}.chart i:nth-child(3){height:48%}.chart i:nth-child(4){height:82%}.chart i:nth-child(5){height:72%}.chart i:nth-child(6){height:92%}.chart i:nth-child(7){height:78%}.miniGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.miniGrid div,.bentoCard,.price,.panel,.testimonial,.faq{border:1px solid var(--line);border-radius:26px;background:var(--panel);padding:18px;backdrop-filter:blur(12px)}.miniGrid b{display:block;color:var(--text)}.logos{display:flex;gap:28px;align-items:center;justify-content:center;flex-wrap:wrap;padding:24px 5vw;border-block:1px solid var(--line);background:rgba(255,255,255,.03)}.logos span{font-size:12px;text-transform:uppercase;letter-spacing:.18em}.logos b{color:#dbeafe}.section,.faqWrap,.contact{padding:100px 5vw}.sectionHead{max-width:820px;margin-bottom:34px}.bento{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}.icon{width:42px;height:42px;border-radius:16px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:grid;place-items:center;color:#030712;font-weight:950}.proof{display:grid;grid-template-columns:1.1fr .9fr;gap:22px;padding:100px 5vw;background:rgba(255,255,255,.035);border-block:1px solid var(--line)}.rows{display:grid;gap:12px;margin-top:24px}.rows div{display:flex;justify-content:space-between;border-bottom:1px solid var(--line);padding:16px 0}.rows b{font-size:28px}.testimonial blockquote{font-size:28px;line-height:1.4;letter-spacing:-.04em;color:var(--text);margin:0 0 18px}.pricing{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.price{position:relative;padding:28px}.price h3{font-size:52px;margin:8px 0}.price button{margin-top:24px;width:100%;border:0;border-radius:999px;padding:14px;background:var(--text);color:#030712;font-weight:950}.featured{background:linear-gradient(180deg,color-mix(in srgb,var(--accent) 18%,transparent),var(--panel))}.badge{position:absolute;right:20px;top:20px;border:1px solid var(--line);border-radius:999px;padding:7px 10px;color:var(--accent);font-weight:900}.faqList{display:grid;gap:12px;max-width:900px}.faq{width:100%;text-align:left;color:var(--text);cursor:pointer}.faq p{display:none}.faq.open p{display:block}.contact{display:grid;grid-template-columns:.9fr 1.1fr;gap:44px;background:rgba(255,255,255,.04);border-top:1px solid var(--line)}form{display:grid;gap:12px}input,textarea{border:1px solid var(--line);border-radius:18px;padding:16px;background:rgba(255,255,255,.08);color:var(--text)}textarea{min-height:140px}#successMessage{display:none;color:var(--accent);font-weight:900}@keyframes spin{to{transform:rotate(360deg)}}.reveal{opacity:0;transform:translateY(18px);transition:.7s ease}.reveal.visible{opacity:1;transform:none}@media(max-width:1000px){nav{display:none}.hero,.proof,.contact,.pricing,.bento{grid-template-columns:1fr}.miniGrid{grid-template-columns:1fr}h1{font-size:58px}.heroVisual{order:-1}.bento{grid-template-columns:1fr}.pricing{grid-template-columns:1fr}}`,
    js: `document.querySelectorAll('[data-target]').forEach((button)=>button.addEventListener('click',()=>{const target=document.getElementById(button.dataset.target);if(target)target.scrollIntoView({behavior:'smooth',block:'start'});}));
document.querySelectorAll('.faq').forEach((item)=>item.addEventListener('click',()=>item.classList.toggle('open')));
const observer=new IntersectionObserver((entries)=>{entries.forEach((entry)=>{if(entry.isIntersecting)entry.target.classList.add('visible');});},{threshold:.16});document.querySelectorAll('.reveal').forEach((el)=>observer.observe(el));
const form=document.getElementById('contactForm');const success=document.getElementById('successMessage');if(form&&success){form.addEventListener('submit',(event)=>{event.preventDefault();success.style.display='block';form.reset();});}`,
  };
}

function photographyTemplate(prompt: string): GeneratedProject {
  return highTicketTemplate(`tech editorial ${prompt}`);
}

function fallbackProject(prompt: string): GeneratedProject {
  if (isHighTicketPrompt(prompt)) return highTicketTemplate(prompt);
  if (isPhotographerPrompt(prompt)) return photographyTemplate(prompt);
  return highTicketTemplate(prompt);
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
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: instruction }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 14000, responseMimeType: 'application/json' } }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, referenceUrl } = await request.json();
    const cleanPrompt = prompt || 'site premium de tecnologia';
    const apiKey = process.env.GEMINI_API_KEY;

    if (isHighTicketPrompt(cleanPrompt)) {
      return NextResponse.json({ project: highTicketTemplate(cleanPrompt), source: 'design-engine', model: 'high-ticket-v1' });
    }

    if (!apiKey) return NextResponse.json({ project: fallbackProject(cleanPrompt), source: 'fallback', error: 'GEMINI_API_KEY missing' });

    const instruction = `Gera um projeto vanilla HTML/CSS/JS premium em português europeu para: ${cleanPrompt}. Referência opcional: ${referenceUrl || 'nenhuma'}.
Responde só JSON válido com html, css e js. Não coloques o prompt bruto na página.
Usa estilo high-ticket moderno: dark premium, bento grid, glassmorphism, dashboards, microinterações, spacing profissional, dados realistas, pricing, FAQ, CTA e animações subtis. O texto deve falar do negócio do cliente, nunca do builder, do template ou de componentes internos.`;

    const errors: string[] = [];
    for (const model of GEMINI_MODELS) {
      const response = await callGemini(model, apiKey, instruction);
      if (!response.ok) { errors.push(`${model}: ${await response.text()}`); continue; }
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('\n') || '';
      return NextResponse.json({ project: parseProject(text, cleanPrompt), source: 'gemini', model });
    }
    return NextResponse.json({ project: fallbackProject(cleanPrompt), source: 'fallback', error: errors.join('\n\n') });
  } catch (error) {
    return NextResponse.json({ project: fallbackProject('site premium de tecnologia'), source: 'fallback', error: String(error) });
  }
}
