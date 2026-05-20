import { NextRequest, NextResponse } from 'next/server';
import { motionCss, motionHtml, motionJs } from '@/lib/motionEngine';
import { premiumAssetCss, premiumAssetSection } from '@/lib/visualAssetEngine';
import { generateRealImages } from '@/lib/realImageEngine';

type Project = { html: string; css: string; js: string };
type Niche = 'trading' | 'photography' | 'beauty' | 'technology';
type Intel = { niche: Niche; sub: string; accent: string; accent2: string; glow: string; brand: string };

const MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash-lite'];
const has = (text: string, terms: string[]) => terms.some((term) => text.toLowerCase().includes(term));

function analyze(prompt: string, referenceUrl = ''): Intel {
  const text = `${prompt} ${referenceUrl}`.toLowerCase();
  if (has(text, ['fotografo', 'fotógrafo', 'fotografia', 'photography', 'photographer'])) return { niche: 'photography', sub: 'editorial photography', brand: 'Marta Vale Studio', accent: '#a47545', accent2: '#e7c8a0', glow: 'rgba(164,117,69,.26)' };
  if (has(text, ['nails', 'unhas', 'estética', 'estetica', 'cabeleireiro', 'barbeiro', 'spa'])) return { niche: 'beauty', sub: 'beauty booking studio', brand: 'Aura Beauty Lab', accent: '#ec4899', accent2: '#f9a8d4', glow: 'rgba(236,72,153,.26)' };
  if (has(text, ['copy trading', 'copytrade', 'copy trader'])) return { niche: 'trading', sub: 'copy trading platform', brand: 'CopyEdge Capital', accent: '#22c55e', accent2: '#38bdf8', glow: 'rgba(34,197,94,.28)' };
  if (has(text, ['prop firm', 'propfirm', 'funded', 'challenge', 'trading', 'forex', 'fintech'])) return { niche: 'trading', sub: 'funded trader platform', brand: 'ApexFunded', accent: '#22c55e', accent2: '#38bdf8', glow: 'rgba(34,197,94,.28)' };
  return { niche: 'technology', sub: 'AI SaaS platform', brand: 'Nexora AI', accent: '#8b5cf6', accent2: '#06b6d4', glow: 'rgba(139,92,246,.26)' };
}

function escapeText(value: string) {
  return value.replace(/[<>&]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[char] || char));
}

function fallbackCopy(intel: Intel) {
  if (intel.niche === 'photography') return { eyebrow: 'EDITORIAL PORTFOLIO', title: 'Histórias visuais com ritmo cinematográfico.', sub: 'Uma experiência de portfólio com galerias imersivas, páginas de entrega e reservas pensadas para fotografia premium.', cta: 'Explorar histórias' };
  if (intel.niche === 'beauty') return { eyebrow: 'BEAUTY EXPERIENCE', title: 'Uma agenda elegante para transformar visitas em marcações.', sub: 'Serviços, equipa, calendário e acompanhamento de cliente num fluxo limpo e premium.', cta: 'Marcar visita' };
  if (intel.sub.includes('copy')) return { eyebrow: 'COPY TRADING PLATFORM', title: 'Acompanha traders, risco e execução em tempo real.', sub: 'Uma plataforma visual para apresentar estratégias, histórico, métricas e automações com clareza.', cta: 'Ver painel' };
  if (intel.niche === 'trading') return { eyebrow: 'TRADER FUNDING', title: 'Uma experiência moderna para avaliação e crescimento de traders.', sub: 'Landing, painel de trader, regras, métricas e onboarding organizados numa interface de produto.', cta: 'Ver programas' };
  return { eyebrow: 'AI PRODUCT', title: 'Automação com aparência de software global.', sub: 'Workflows, dados, clientes e operações apresentados numa experiência SaaS clara e envolvente.', cta: 'Ver produto' };
}

function fallbackHtml(prompt: string, intel: Intel, runtimeImages: Awaited<ReturnType<typeof generateRealImages>>) {
  const c = fallbackCopy(intel);
  const safePrompt = escapeText(prompt);
  const nicheBlock = intel.niche === 'photography'
    ? `<section class="storyRail"><article><span>01</span><h3>Casamentos editoriais</h3></article><article><span>02</span><h3>Retratos de marca</h3></article><article><span>03</span><h3>Galerias privadas</h3></article></section>`
    : intel.niche === 'beauty'
      ? `<section class="bookingBoard"><div><b>Hoje</b><p>10:00 Consulta</p><p>14:30 Serviço premium</p><p>18:00 Plano mensal</p></div><form><input placeholder="Nome"/><input placeholder="Contacto"/><button type="button">Reservar</button></form></section>`
      : intel.niche === 'trading'
        ? `<section class="traderDeck"><article><small>Equity</small><strong>$184k</strong></article><article><small>Drawdown</small><strong>3.1%</strong></article><article><small>Execution</small><strong>32ms</strong></article><div class="terminal"><p>EURUSD · Long · +2.4R</p><p>NAS100 · Risk locked</p><p>XAUUSD · Target reached</p></div></section>`
        : `<section class="workflowDeck"><article>Capture</article><article>Enrich</article><article>Automate</article><article>Report</article></section>`;

  return `<!doctype html><html lang="pt"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>${intel.brand}</title><link rel="stylesheet" href="style.css"/></head><body>${motionHtml()}<header class="nav"><b>${intel.brand}</b><nav><button data-target="product">Produto</button><button data-target="showcase">Showcase</button><button data-target="pricing">Planos</button><button data-target="contact">Contacto</button></nav></header><main><section class="hero"><div class="copy reveal"><p>${c.eyebrow}</p><h1>${c.title}</h1><span>${c.sub}</span><em>Gerado para: ${safePrompt}</em><button class="magnetic" data-target="showcase">${c.cta}</button></div><div class="visual reveal parallaxLayer animatedBorder" data-parallax="0.1">${nicheBlock}</div></section><section id="product" class="split sectionTransition"><h2>${intel.niche === 'trading' ? 'Dados, jornada e confiança no mesmo fluxo.' : intel.niche === 'photography' ? 'Narrativa visual antes de qualquer formulário.' : intel.niche === 'beauty' ? 'Reserva simples com perceção premium.' : 'Fluxos visíveis, operação clara.'}</h2><p>Cada secção foi montada para este nicho, não como uma landing genérica pintada de outra cor.</p></section>${premiumAssetSection(intel.niche, intel.sub, runtimeImages)}<section id="pricing" class="pricing sectionTransition"><article><h3>Launch</h3><b>€490</b></article><article class="featured"><h3>Growth</h3><b>€1.490</b></article><article><h3>Scale</h3><b>Custom</b></article></section><section id="contact" class="contact sectionTransition"><h2>Pronto para lançar?</h2><form><input placeholder="Nome"/><input placeholder="Email"/><textarea placeholder="Mensagem"></textarea><button type="button">Enviar</button></form></section></main><script src="script.js"></script></body></html>`;
}

function fallbackCss(intel: Intel) {
  return `:root{--bg:#050713;--panel:rgba(255,255,255,.075);--panel2:rgba(255,255,255,.12);--text:#f8fafc;--muted:#9aa4b2;--line:rgba(255,255,255,.13);--accent:${intel.accent};--accent2:${intel.accent2};--glow:${intel.glow}}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 10% -10%,var(--glow),transparent 34%),radial-gradient(circle at 90% 10%,rgba(56,189,248,.13),transparent 38%),var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,sans-serif}.nav{position:sticky;top:0;z-index:20;display:flex;justify-content:space-between;align-items:center;padding:20px 5vw;border-bottom:1px solid var(--line);background:rgba(5,7,19,.72);backdrop-filter:blur(18px)}.nav b{font-size:20px;letter-spacing:-.05em}.nav nav{display:flex;gap:8px}.nav button,.hero button,.contact button{border:0;border-radius:999px;padding:12px 17px;background:var(--panel);color:var(--text);font-weight:900;cursor:pointer}.hero{min-height:820px;display:grid;grid-template-columns:${intel.niche === 'photography' ? '1.2fr .8fr' : '.9fr 1.1fr'};gap:50px;align-items:center;padding:95px 5vw}.copy p{color:var(--accent);font-size:12px;font-weight:950;letter-spacing:.18em;text-transform:uppercase}.copy h1{font-size:clamp(58px,8vw,118px);line-height:.82;letter-spacing:-.09em;margin:0 0 26px}.copy span{display:block;max-width:740px;color:var(--muted);font-size:20px;line-height:1.7}.copy em{display:block;margin:24px 0;color:rgba(255,255,255,.38);font-style:normal}.copy button{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#031014}.visual,.pricing article,.split,.contact{border:1px solid var(--line);border-radius:38px;background:linear-gradient(180deg,var(--panel2),rgba(255,255,255,.035));box-shadow:0 34px 100px rgba(0,0,0,.45);padding:24px}.storyRail{display:grid;gap:16px}.storyRail article{min-height:180px;border-radius:30px;padding:24px;background:linear-gradient(135deg,var(--accent),#111827);display:flex;justify-content:space-between;flex-direction:column}.bookingBoard{display:grid;grid-template-columns:1fr;gap:18px}.bookingBoard div,.bookingBoard form,.traderDeck article,.terminal,.workflowDeck article{border:1px solid var(--line);border-radius:26px;background:var(--panel);padding:22px}.bookingBoard input,.contact input,.contact textarea{width:100%;margin-bottom:10px;border:1px solid var(--line);border-radius:16px;background:rgba(255,255,255,.08);color:white;padding:14px}.traderDeck{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.traderDeck strong{font-size:42px;color:var(--accent)}.terminal{grid-column:1/-1}.terminal p{display:flex;justify-content:space-between;border-bottom:1px solid var(--line);padding:12px 0}.workflowDeck{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}.workflowDeck article{min-height:160px;display:grid;place-items:center;font-size:26px;font-weight:950}.split,.pricing,.contact{margin:100px 5vw}.split h2,.contact h2{font-size:clamp(38px,5vw,76px);line-height:.9;letter-spacing:-.075em}.split p{font-size:18px;color:var(--muted)}.pricing{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.pricing h3{font-size:28px}.pricing b{font-size:46px}.featured{background:linear-gradient(180deg,var(--glow),var(--panel))!important}.contact{display:grid;grid-template-columns:1fr 1fr;gap:30px}@media(max-width:900px){.nav nav{display:none}.hero,.pricing,.contact,.traderDeck{grid-template-columns:1fr}.copy h1{font-size:58px}}`;
}

function fallbackJs() {
  return `document.querySelectorAll('[data-target]').forEach((button)=>button.addEventListener('click',()=>{document.getElementById(button.dataset.target)?.scrollIntoView({behavior:'smooth'});}));`;
}

async function buildFallback(prompt: string, referenceUrl = '') {
  const intel = analyze(prompt, referenceUrl);
  const runtimeImages = await generateRealImages(intel.niche, intel.sub);
  return { project: { html: fallbackHtml(prompt, intel, runtimeImages), css: `${fallbackCss(intel)}\n${premiumAssetCss()}\n${motionCss()}`, js: `${fallbackJs()}\n${motionJs()}` }, intelligence: intel, imageSource: runtimeImages.source, imageError: runtimeImages.error };
}

function withEngines(project: Project) {
  let html = project.html;
  if (!html.includes('motionGrid')) html = html.replace('<body>', `<body>${motionHtml()}`);
  return { html, css: `${project.css}\n${premiumAssetCss()}\n${motionCss()}`, js: `${project.js}\n${motionJs()}` };
}

async function parseProject(text: string, prompt: string, referenceUrl = '') {
  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned) as Partial<Project>;
    if (parsed.html && parsed.css && parsed.js) return { project: withEngines({ html: parsed.html, css: parsed.css, js: parsed.js }), intelligence: analyze(prompt, referenceUrl), imageSource: 'gemini' };
  } catch {}
  return buildFallback(prompt, referenceUrl);
}

async function callGemini(model: string, apiKey: string, instruction: string) {
  return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: instruction }] }], generationConfig: { temperature: 0.94, maxOutputTokens: 18000, responseMimeType: 'application/json' } }) });
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, referenceUrl } = await request.json();
    const clean = prompt || 'site premium de tecnologia';
    const apiKey = process.env.GEMINI_API_KEY;
    const intel = analyze(clean, referenceUrl || '');

    if (!apiKey) return NextResponse.json({ ...(await buildFallback(clean, referenceUrl || '')), source: 'fallback-no-gemini-key', model: 'fallback-variant-v10' });

    const seed = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const instruction = `Gera um WEBSITE NOVO do zero em vanilla HTML/CSS/JS para: ${clean}.
Referência visual opcional: ${referenceUrl || 'nenhuma'}.
Nicho detetado: ${intel.niche}. Subnicho: ${intel.sub}.
Seed criativo obrigatório: ${seed}.

Regras obrigatórias:
- Responde APENAS JSON válido com html, css e js.
- Não uses frases genéricas como "visual institucional", "produto real", "engine", "template", "AI builder", "component system" ou "showcase" como texto de marketing.
- Não reutilizes estrutura fixa: muda composição, ordem de secções, hero, grids, navegação, spacing e blocos conforme o nicho.
- Para prop firm/trading: criar visual de produto financeiro com hero próprio, painel de trader, tabelas, métricas, planos e fluxo de onboarding. Não usar copy genérica.
- Para fotografia: criar portfólio editorial com galerias grandes, narrativa visual e pacotes.
- Para beauty: criar agenda/booking, serviços e prova social.
- Para SaaS: criar dashboard/workflows e landing de produto.
- Usa motion classes disponíveis: reveal, animatedBorder, parallaxLayer, floatAsset, magnetic, sectionTransition.
- Inclui CSS completo e JS funcional para botões, navegação, tabs ou interações.
- O resultado tem de parecer diferente a cada nova geração.`;

    const errors: string[] = [];
    for (const model of MODELS) {
      const response = await callGemini(model, apiKey, instruction);
      if (!response.ok) { errors.push(`${model}: ${await response.text()}`); continue; }
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('\n') || '';
      return NextResponse.json({ ...(await parseProject(text, clean, referenceUrl || '')), source: 'gemini-variable', model, seed });
    }

    return NextResponse.json({ ...(await buildFallback(clean, referenceUrl || '')), source: 'fallback-after-gemini-error', model: 'fallback-variant-v10', error: errors.join('\n\n') });
  } catch (error) {
    return NextResponse.json({ ...(await buildFallback('site premium de tecnologia')), source: 'fallback-error', error: String(error) });
  }
}
