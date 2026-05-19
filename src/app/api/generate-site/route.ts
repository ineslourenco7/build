import { NextRequest, NextResponse } from 'next/server';

type GeneratedProject = { html: string; css: string; js: string };
const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash-lite'];

function isPropFirmPrompt(prompt: string) {
  const lower = prompt.toLowerCase();
  return ['prop firm', 'propfirm', 'funded trader', 'funded trading', 'forex challenge', 'trading challenge', 'copy trading', 'traders de forex', 'trader funding'].some((term) => lower.includes(term));
}

function isPhotographerPrompt(prompt: string) {
  const lower = prompt.toLowerCase();
  return ['fotografo', 'fotógrafo', 'fotografia', 'fotografa', 'fotógrafa', 'photographer', 'photography', 'wedding photographer', 'portfolio fotografico', 'portfólio fotográfico'].some((term) => lower.includes(term));
}

function photographyTemplate(prompt: string): GeneratedProject {
  const lower = prompt.toLowerCase();
  const isWedding = lower.includes('casamento') || lower.includes('wedding');
  const isFashion = lower.includes('moda') || lower.includes('fashion') || lower.includes('editorial');
  const isArchitecture = lower.includes('arquitetura') || lower.includes('interiores') || lower.includes('architecture');
  const brandName = isWedding ? 'Luz & Voto' : isFashion ? 'Noir Frame Studio' : isArchitecture ? 'Forma & Luz' : 'Marta Vale Studio';
  const specialty = isWedding ? 'casamentos editoriais e histórias íntimas' : isFashion ? 'moda, retrato e campanhas editoriais' : isArchitecture ? 'arquitetura, interiores e hospitalidade' : 'retratos, marcas pessoais e eventos';
  const heroImage = isWedding
    ? 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1300&q=80'
    : isFashion
      ? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1300&q=80'
      : isArchitecture
        ? 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1300&q=80'
        : 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1300&q=80';

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
    <div class="brand">${brandName}</div>
    <nav>
      <button data-target="portfolio">Portfólio</button>
      <button data-target="stories">Histórias</button>
      <button data-target="services">Serviços</button>
      <button data-target="booking">Booking</button>
    </nav>
    <button class="nav-cta" data-target="booking">Marcar sessão</button>
  </header>

  <main>
    <section id="home" class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Fotografia premium • ${specialty}</p>
        <h1>Imagens que respiram silêncio, luz e intenção.</h1>
        <p class="lead">Um portfólio editorial para clientes que procuram direção criativa, narrativa visual e uma presença online com impacto imediato.</p>
        <div class="actions">
          <button class="primary" data-target="portfolio">Ver portfólio</button>
          <button class="secondary" data-target="booking">Pedir orçamento</button>
        </div>
      </div>
      <div class="hero-frame">
        <img src="${heroImage}" alt="Fotografia editorial premium" />
        <div class="caption"><span>Featured story</span><strong>Lisboa, 2026</strong></div>
      </div>
    </section>

    <section class="ticker">
      <span>EDITORIAL</span><span>PORTRAIT</span><span>WEDDINGS</span><span>BRANDS</span><span>ARCHITECTURE</span><span>STORYTELLING</span>
    </section>

    <section id="portfolio" class="portfolio">
      <div class="section-head">
        <p class="eyebrow">Portfólio</p>
        <h2>Uma galeria com presença de revista e curadoria visual.</h2>
      </div>
      <div class="filters">
        <button class="filter active" data-filter="all">Tudo</button>
        <button class="filter" data-filter="portrait">Retrato</button>
        <button class="filter" data-filter="wedding">Casamento</button>
        <button class="filter" data-filter="brand">Marca</button>
        <button class="filter" data-filter="space">Espaços</button>
      </div>
      <div class="masonry">
        <img data-category="portrait" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=760&q=80" alt="Retrato editorial" />
        <img data-category="wedding" src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=760&q=80" alt="Detalhe de casamento" />
        <img data-category="brand" src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=760&q=80" alt="Campanha de marca" />
        <img data-category="space" src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=760&q=80" alt="Interior fotografado" />
        <img data-category="portrait" src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=760&q=80" alt="Retrato natural" />
        <img data-category="brand" src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=760&q=80" alt="Editorial de moda" />
        <img data-category="wedding" src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=760&q=80" alt="Casal em sessão" />
        <img data-category="space" src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=760&q=80" alt="Arquitetura e luz" />
      </div>
    </section>

    <section class="stats">
      <article><strong>12</strong><span>anos de direção visual</span></article>
      <article><strong>180+</strong><span>sessões entregues</span></article>
      <article><strong>72h</strong><span>preview gallery</span></article>
    </section>

    <section id="stories" class="stories">
      <div class="story-large">
        <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1100&q=80" alt="Fotógrafa em sessão" />
      </div>
      <div class="story-copy">
        <p class="eyebrow">Processo</p>
        <h2>Antes da fotografia, vem a direção.</h2>
        <p>Cada sessão começa com moodboard, referências, escolha de luz e ritmo. O objetivo é criar imagens bonitas, mas também úteis: para vender, recordar, publicar e construir marca.</p>
        <blockquote>“O processo foi calmo, elegante e incrivelmente profissional.” — Clara Mendes</blockquote>
      </div>
    </section>

    <section id="services" class="services">
      <div class="section-head">
        <p class="eyebrow">Serviços</p>
        <h2>Pacotes pensados para diferentes histórias.</h2>
      </div>
      <div class="cards">
        <article><p>Essencial</p><h3>Retrato</h3><span>1h sessão • 20 fotos editadas</span><strong>desde €180</strong><button data-target="booking">Reservar</button></article>
        <article class="featured"><p>Editorial</p><h3>Marca pessoal</h3><span>Direção criativa • moodboard • 45 fotos</span><strong>desde €420</strong><button data-target="booking">Escolher</button></article>
        <article><p>Premium</p><h3>Casamento</h3><span>Dia completo • galeria online • álbum</span><strong>desde €1450</strong><button data-target="booking">Consultar</button></article>
      </div>
    </section>

    <section id="booking" class="booking">
      <div>
        <p class="eyebrow">Booking</p>
        <h2>Vamos criar uma galeria com identidade?</h2>
        <p>Envia a ideia da sessão e recebe uma proposta com disponibilidade, direção visual e próximos passos.</p>
      </div>
      <form id="contactForm">
        <input placeholder="Nome" required />
        <input type="email" placeholder="Email" required />
        <select><option>Retrato</option><option>Marca pessoal</option><option>Casamento</option><option>Evento</option><option>Arquitetura/interiores</option></select>
        <textarea placeholder="Conta-me a ideia da sessão" required></textarea>
        <button class="primary" type="submit">Pedir proposta</button>
        <p id="successMessage" class="success">Pedido enviado com sucesso. Esta é uma simulação funcional.</p>
      </form>
    </section>

    <footer><strong>${brandName}</strong><span>Fotografia com estética editorial, curadoria e entrega digital premium.</span></footer>
  </main>
  <script src="script.js"></script>
</body>
</html>`,
    css: `:root{--bg:#f4efe7;--ink:#17130f;--muted:#766d63;--paper:#fffaf3;--line:rgba(23,19,15,.12);--accent:#9b7046}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Arial,sans-serif}button,input,select,textarea{font:inherit}.topbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;padding:18px 5vw;background:rgba(244,239,231,.82);backdrop-filter:blur(18px);border-bottom:1px solid var(--line)}.brand{font-weight:950;letter-spacing:-.055em;font-size:22px}nav{display:flex;gap:8px}nav button,.nav-cta{border:0;border-radius:999px;background:transparent;color:var(--muted);font-weight:850;padding:10px 14px;cursor:pointer}.nav-cta{background:var(--ink);color:white}.hero{min-height:780px;display:grid;grid-template-columns:.86fr 1.14fr;gap:58px;align-items:center;padding:88px 5vw}.hero-copy{max-width:720px}.eyebrow{color:var(--accent);font-size:12px;text-transform:uppercase;letter-spacing:.18em;font-weight:950}h1{font-size:clamp(56px,8vw,118px);line-height:.82;letter-spacing:-.09em;margin:0 0 24px}h2{font-size:clamp(38px,5vw,76px);line-height:.9;letter-spacing:-.075em;margin:0}p,span{color:var(--muted);font-size:18px;line-height:1.75}.lead{font-size:20px}.actions{display:flex;gap:12px;margin-top:30px;flex-wrap:wrap}.primary,.secondary{border:0;border-radius:999px;padding:15px 24px;font-weight:950;cursor:pointer;transition:.22s}.primary{background:var(--ink);color:white}.secondary{background:var(--paper);color:var(--ink);border:1px solid var(--line)}.primary:hover,.secondary:hover,.cards article:hover{transform:translateY(-3px)}.hero-frame{position:relative;height:640px;border-radius:44px;overflow:hidden;box-shadow:0 34px 90px rgba(23,19,15,.18)}img{width:100%;height:100%;object-fit:cover;display:block}.caption{position:absolute;left:24px;bottom:24px;padding:18px 20px;border-radius:24px;background:rgba(255,250,243,.86);backdrop-filter:blur(14px);display:grid}.caption span{font-size:12px;text-transform:uppercase;letter-spacing:.12em}.caption strong{font-size:24px;letter-spacing:-.05em}.ticker{display:flex;gap:32px;justify-content:center;padding:22px 5vw;border-top:1px solid var(--line);border-bottom:1px solid var(--line);overflow:hidden}.ticker span{font-size:12px;font-weight:950;letter-spacing:.2em;color:var(--ink)}section{padding:92px 5vw}.section-head{max-width:850px;margin-bottom:36px}.filters{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:26px}.filter{border:1px solid var(--line);border-radius:999px;background:transparent;color:var(--muted);padding:10px 16px;font-weight:850;cursor:pointer}.filter.active{background:var(--ink);color:white}.masonry{columns:3 280px;column-gap:18px}.masonry img{break-inside:avoid;border-radius:30px;margin:0 0 18px;box-shadow:0 22px 60px rgba(23,19,15,.12);transition:.25s}.masonry img:hover{transform:scale(.985);filter:contrast(1.04)}.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;background:var(--ink)}.stats article{border:1px solid rgba(255,255,255,.12);border-radius:28px;padding:28px;background:rgba(255,255,255,.06)}.stats strong{display:block;color:white;font-size:48px;letter-spacing:-.06em}.stats span{color:#d6d0c7}.stories{display:grid;grid-template-columns:1fr 1fr;gap:54px;align-items:center;background:var(--paper)}.story-large{height:620px;border-radius:44px;overflow:hidden;box-shadow:0 30px 80px rgba(23,19,15,.15)}blockquote{font-size:28px;line-height:1.42;letter-spacing:-.045em;border-left:4px solid var(--accent);padding-left:24px;color:var(--ink)}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}.cards article{background:var(--paper);border:1px solid var(--line);border-radius:34px;padding:28px;box-shadow:0 20px 60px rgba(23,19,15,.08);transition:.22s}.cards .featured{background:var(--ink);color:white}.cards .featured span,.cards .featured p{color:#d6d0c7}.cards strong{display:block;font-size:30px;margin:22px 0;letter-spacing:-.04em}.cards button{border:0;border-radius:999px;background:var(--accent);color:white;padding:13px 20px;font-weight:900}.booking{display:grid;grid-template-columns:.9fr 1.1fr;gap:44px;background:white}form{display:grid;gap:12px}input,select,textarea{border:1px solid var(--line);border-radius:18px;padding:16px 18px;background:var(--paper);color:var(--ink)}textarea{min-height:140px}.success{display:none;color:#047857;font-weight:900}footer{padding:34px 5vw;display:flex;justify-content:space-between;border-top:1px solid var(--line)}footer strong{letter-spacing:-.04em}@media(max-width:900px){nav{display:none}.hero,.stories,.booking,.cards,.stats{grid-template-columns:1fr}.hero-frame,.story-large{height:420px}h1{font-size:60px}footer{display:grid;gap:8px}}`,
    js: `document.querySelectorAll('[data-target]').forEach((button)=>{button.addEventListener('click',()=>{const target=document.getElementById(button.dataset.target);if(target)target.scrollIntoView({behavior:'smooth',block:'start'});});});
document.querySelectorAll('.filter').forEach((button)=>{button.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach((b)=>b.classList.remove('active'));button.classList.add('active');const filter=button.dataset.filter;document.querySelectorAll('.masonry img').forEach((img)=>{img.style.display=filter==='all'||img.dataset.category===filter?'block':'none';});});});
const form=document.getElementById('contactForm');const success=document.getElementById('successMessage');if(form&&success){form.addEventListener('submit',(event)=>{event.preventDefault();success.style.display='block';form.reset();});}`,
  };
}

function propFirmTemplate(prompt: string): GeneratedProject {
  const brandName = prompt.toLowerCase().includes('copy') ? 'CopyVault Markets' : 'ApexFunded';
  return {
    html: `<!doctype html><html lang="pt"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>${brandName}</title><link rel="stylesheet" href="style.css"/></head><body><header class="topbar"><div class="brand"><span class="mark">A</span>${brandName}</div><nav><button data-target="plans">Challenges</button><button data-target="dashboard">Dashboard</button><button data-target="rules">Regras</button><button data-target="faq">FAQ</button></nav><button class="ghost" data-target="plans">Começar</button></header><main><section class="hero"><div><p class="eyebrow">PROP FIRM • FOREX • FUTURES</p><h1>Capital para traders consistentes.</h1><p class="lead">Plataforma premium para traders que querem provar disciplina, gerir risco e escalar contas simuladas com regras claras.</p><div class="actions"><button class="primary" data-target="plans">Ver challenges</button><button class="secondary" data-target="dashboard">Ver dashboard</button></div></div><div class="terminal"><strong>$127,840</strong><span>Equity simulada</span><div class="bars"><i></i><i></i><i></i><i></i><i></i></div></div></section><section id="plans"><h2>Escolhe a tua conta.</h2><div class="cards"><article><h3>$25k</h3><p>Meta 8% • DD 6%</p><strong>€149</strong></article><article class="featured"><h3>$100k</h3><p>Meta 10% • DD 8%</p><strong>€399</strong></article><article><h3>$200k</h3><p>Meta 10% • DD 10%</p><strong>€799</strong></article></div></section><section id="dashboard"><h2>Dashboard trader.</h2><p>Monitoriza balance, drawdown, payouts e objetivos em tempo real.</p></section><section id="rules"><h2>Regras claras.</h2><div class="cards"><article><h3>Drawdown diário</h3><p>Limite claro para proteger risco.</p></article><article><h3>Sem tempo mínimo</h3><p>Avança ao teu ritmo.</p></article><article><h3>Payout 48h</h3><p>Processamento rápido.</p></article></div></section><section id="faq"><h2>FAQ</h2><button class="faq">Isto é aconselhamento financeiro?<p>Não. Trading envolve risco e esta página é uma simulação.</p></button></section><footer>Disclaimer: trading envolve risco substancial e pode resultar em perdas.</footer></main><script src="script.js"></script></body></html>`,
    css: `:root{--bg:#050816;--text:#f8fafc;--muted:#94a3b8;--line:rgba(255,255,255,.1);--green:#22c55e;--cyan:#38bdf8}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 20% 0%,rgba(56,189,248,.2),transparent 30%),var(--bg);color:var(--text);font-family:Inter,system-ui,Arial,sans-serif}.topbar{position:sticky;top:0;z-index:20;display:flex;justify-content:space-between;align-items:center;padding:18px 6vw;background:rgba(5,8,22,.72);backdrop-filter:blur(18px);border-bottom:1px solid var(--line)}.brand{display:flex;gap:10px;font-weight:900}.mark{width:34px;height:34px;display:grid;place-items:center;border-radius:12px;background:linear-gradient(135deg,var(--cyan),var(--green))}nav{display:flex;gap:8px}button{font:inherit}.ghost,nav button{border:1px solid transparent;border-radius:999px;background:transparent;color:var(--muted);padding:10px 14px;cursor:pointer}.hero,section{padding:90px 6vw}.hero{min-height:720px;display:grid;grid-template-columns:.95fr 1.05fr;gap:50px;align-items:center}.eyebrow{color:var(--cyan);font-size:12px;letter-spacing:.18em;font-weight:900}h1{font-size:clamp(52px,7.5vw,104px);line-height:.86;letter-spacing:-.08em;margin:0 0 24px}h2{font-size:clamp(36px,5vw,70px);line-height:.92;letter-spacing:-.07em}.lead{font-size:20px;color:var(--muted);max-width:720px}.actions{display:flex;gap:12px;margin-top:28px}.primary,.secondary{border:0;border-radius:999px;padding:15px 24px;font-weight:900;cursor:pointer}.primary{background:linear-gradient(135deg,#86efac,var(--green));color:#03120b}.secondary{background:rgba(255,255,255,.07);color:white;border:1px solid var(--line)}.terminal,.cards article{background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.035));border:1px solid var(--line);border-radius:34px;padding:28px;box-shadow:0 30px 90px rgba(0,0,0,.35)}.terminal strong{font-size:56px;display:block}.bars{height:260px;display:flex;align-items:end;gap:14px;margin-top:30px}.bars i{flex:1;border-radius:999px 999px 8px 8px;background:linear-gradient(180deg,var(--cyan),var(--green));height:50%}.bars i:nth-child(2){height:70%}.bars i:nth-child(3){height:42%}.bars i:nth-child(4){height:88%}.bars i:nth-child(5){height:76%}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}.featured{border-color:rgba(34,197,94,.5)!important}.faq{display:block;text-align:left;width:100%;background:rgba(255,255,255,.06);border:1px solid var(--line);border-radius:22px;color:white;padding:20px}.faq p{display:none;color:var(--muted)}.faq.open p{display:block}footer{padding:38px 6vw;border-top:1px solid var(--line);color:var(--muted)}@media(max-width:900px){nav{display:none}.hero,.cards{grid-template-columns:1fr}h1{font-size:58px}}`,
    js: `document.querySelectorAll('[data-target]').forEach((button)=>button.addEventListener('click',()=>{const target=document.getElementById(button.dataset.target);if(target)target.scrollIntoView({behavior:'smooth'});}));document.querySelectorAll('.faq').forEach((item)=>item.addEventListener('click',()=>item.classList.toggle('open')));`,
  };
}

function fallbackProject(prompt: string): GeneratedProject {
  if (isPropFirmPrompt(prompt)) return propFirmTemplate(prompt);
  if (isPhotographerPrompt(prompt)) return photographyTemplate(prompt);
  return photographyTemplate('fotógrafo premium editorial');
}

function parseProject(text: string, prompt: string): GeneratedProject {
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  try { const parsed = JSON.parse(cleaned) as Partial<GeneratedProject>; if (parsed.html && parsed.css && parsed.js) return { html: parsed.html, css: parsed.css, js: parsed.js }; } catch {}
  return fallbackProject(prompt);
}

async function callGemini(model: string, apiKey: string, instruction: string) {
  return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: instruction }] }], generationConfig: { temperature: 0.8, maxOutputTokens: 14000, responseMimeType: 'application/json' } }) });
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, referenceUrl } = await request.json();
    const cleanPrompt = prompt || 'site moderno';
    const apiKey = process.env.GEMINI_API_KEY;
    if (isPropFirmPrompt(cleanPrompt)) return NextResponse.json({ project: propFirmTemplate(cleanPrompt), source: 'template', model: 'prop-firm-premium' });
    if (isPhotographerPrompt(cleanPrompt)) return NextResponse.json({ project: photographyTemplate(cleanPrompt), source: 'template', model: 'photography-editorial-premium' });
    if (!apiKey) return NextResponse.json({ project: fallbackProject(cleanPrompt), source: 'fallback', error: 'GEMINI_API_KEY missing' });
    const instruction = `Gera um projeto vanilla HTML/CSS/JS premium em português europeu para: ${cleanPrompt}. Referência opcional: ${referenceUrl || 'nenhuma'}. Responde só JSON válido com html, css e js. Não coloques o prompt bruto na página. Usa design premium, responsivo, dados realistas, imagens Unsplash e interações JS.`;
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
    return NextResponse.json({ project: fallbackProject('fotógrafo premium editorial'), source: 'fallback', error: String(error) });
  }
}
