import { NextRequest, NextResponse } from 'next/server';
import { motionCss, motionHtml, motionJs } from '@/lib/motionEngine';
import { premiumAssetCss } from '@/lib/visualAssetEngine';
import { checkGenerationQuality } from '@/lib/qualityGate';

type Project = { html: string; css: string; js: string };
type Niche = 'trading' | 'photography' | 'beauty' | 'technology';

const MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash-lite'];
const has = (text: string, terms: string[]) => terms.some((term) => text.toLowerCase().includes(term));

function detectNiche(text = ''): Niche {
  const lower = text.toLowerCase();
  if (has(lower, ['fotografo', 'fotógrafo', 'fotografia', 'photography', 'photographer', 'portfolio', 'gallery'])) return 'photography';
  if (has(lower, ['nails', 'unhas', 'estética', 'estetica', 'cabeleireiro', 'barbeiro', 'spa', 'booking', 'agenda'])) return 'beauty';
  if (has(lower, ['copy trading', 'prop firm', 'propfirm', 'funded', 'challenge', 'trading', 'forex', 'fintech', 'trader'])) return 'trading';
  return 'technology';
}

function withEngines(project: Project): Project {
  let html = project.html || '';
  if (!html.includes('motionGrid')) html = html.replace('<body>', `<body>${motionHtml()}`);
  const css = `${project.css || ''}\n${project.css?.includes('assetShowcase') ? '' : premiumAssetCss()}\n${project.css?.includes('motionGrid') ? '' : motionCss()}`;
  const js = `${project.js || ''}\n${project.js?.includes('runParallax') ? '' : motionJs()}`;
  return { html, css, js };
}

function safeText(value: unknown) {
  return typeof value === 'string' ? value.slice(0, 120000) : '';
}

function localPatch(project: Project, instruction: string): Project {
  const lower = instruction.toLowerCase();
  let html = project.html || '';
  let css = project.css || '';
  const js = project.js || '';

  if (has(lower, ['cor', 'cores', 'color', 'palette', 'paleta'])) {
    if (has(lower, ['dourado', 'gold'])) {
      css = css.replace(/--accent:[^;]+;/, '--accent:#f59e0b;').replace(/--accent2:[^;]+;/, '--accent2:#facc15;').replace(/--glow:[^;]+;/, '--glow:rgba(245,158,11,.26);');
    } else if (has(lower, ['azul', 'blue'])) {
      css = css.replace(/--accent:[^;]+;/, '--accent:#3b82f6;').replace(/--accent2:[^;]+;/, '--accent2:#22d3ee;').replace(/--glow:[^;]+;/, '--glow:rgba(59,130,246,.26);');
    } else if (has(lower, ['rosa', 'pink'])) {
      css = css.replace(/--accent:[^;]+;/, '--accent:#ec4899;').replace(/--accent2:[^;]+;/, '--accent2:#f9a8d4;').replace(/--glow:[^;]+;/, '--glow:rgba(236,72,153,.26);');
    } else if (has(lower, ['verde', 'green'])) {
      css = css.replace(/--accent:[^;]+;/, '--accent:#22c55e;').replace(/--accent2:[^;]+;/, '--accent2:#38bdf8;').replace(/--glow:[^;]+;/, '--glow:rgba(34,197,94,.28);');
    }
  }

  if (has(lower, ['botao', 'botão', 'cta']) && has(lower, ['contacto', 'contato', 'marcar'])) {
    html = html.replace(/(<button[^>]*data-target="contact"[^>]*>)(.*?)(<\/button>)/gi, '$1Contactar$3');
  }

  if (has(lower, ['mais premium', 'premium', 'luxo', 'luxury'])) {
    css += '\n.hero,.visual,.assetShowcase,.appShell{filter:saturate(1.08)}.hero h1,.copy h1{letter-spacing:-.1em}.visual,.assetShowcase,.pricing article{box-shadow:0 44px 140px rgba(0,0,0,.58),0 0 80px var(--glow)}';
  }

  return withEngines({ html, css, js });
}

async function callGemini(model: string, apiKey: string, prompt: string) {
  return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.45, maxOutputTokens: 18000, responseMimeType: 'application/json' },
    }),
  });
}

function parseJsonProject(text: string): Project | null {
  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned) as Partial<Project>;
    if (parsed.html && parsed.css && parsed.js) return { html: parsed.html, css: parsed.css, js: parsed.js };
  } catch {}
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const currentProject: Project = {
      html: safeText(body?.project?.html || body?.html),
      css: safeText(body?.project?.css || body?.css),
      js: safeText(body?.project?.js || body?.js),
    };
    const instruction = safeText(body?.instruction || body?.message || body?.prompt);
    const history = Array.isArray(body?.history) ? JSON.stringify(body.history).slice(0, 12000) : '';
    const niche = detectNiche(`${instruction}\n${currentProject.html}`);

    if (!currentProject.html || !currentProject.css) {
      return NextResponse.json({ error: 'Missing current project html/css/js', source: 'edit-site-error' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ project: localPatch(currentProject, instruction), source: 'local-patch-no-gemini', niche });
    }

    const editPrompt = `Edita o projeto existente SEM o reconstruir do zero.

PEDIDO DO UTILIZADOR:
${instruction}

NICHO DETETADO: ${niche}

HISTÓRICO RECENTE:
${history}

REGRAS CRÍTICAS:
- Responde APENAS JSON válido com html, css e js.
- Preserva a identidade visual, estrutura principal, motion classes, assets e layout atual.
- Altera só o necessário para cumprir o pedido.
- Não voltes para template/fallback/café/outro nicho.
- Não mostres o prompt bruto do utilizador no site.
- Não uses textos internos como engine, template, AI builder, component system, visual system ou motion system.
- Mantém botões e navegação funcionais.
- Se criares nova secção, usa classes: reveal, animatedBorder, parallaxLayer, floatAsset, magnetic, sectionTransition.

HTML ATUAL:
${currentProject.html}

CSS ATUAL:
${currentProject.css}

JS ATUAL:
${currentProject.js}`;

    const errors: string[] = [];
    for (const model of MODELS) {
      const response = await callGemini(model, apiKey, editPrompt);
      if (!response.ok) {
        errors.push(`${model}: ${await response.text()}`);
        continue;
      }
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('\n') || '';
      const parsed = parseJsonProject(text);
      if (!parsed) continue;

      const project = withEngines(parsed);
      const quality = checkGenerationQuality(project, niche);
      if (!quality.ok) {
        return NextResponse.json({ project: localPatch(currentProject, instruction), source: 'local-patch-quality-fallback', niche, quality });
      }

      return NextResponse.json({ project, source: 'gemini-smart-edit', model, niche, quality });
    }

    return NextResponse.json({ project: localPatch(currentProject, instruction), source: 'local-patch-after-gemini-error', niche, error: errors.join('\n\n') });
  } catch (error) {
    return NextResponse.json({ error: String(error), source: 'edit-site-error' }, { status: 500 });
  }
}
