import { NextRequest, NextResponse } from 'next/server';
import { motionCss, motionHtml, motionJs } from '@/lib/motionEngine';
import { atmosphereCss, atmosphereHtml, atmosphereJs } from '@/lib/atmosphereEngine';
import { shaderCss, shaderHtml, shaderJs } from '@/lib/shaderEngine';
import { webglCss, webglHtml, webglJs } from '@/lib/webglEngine';
import { threeSceneCss, threeSceneHtml, threeSceneJs } from '@/lib/threeSceneEngine';
import { postProcessingCss, postProcessingHtml, postProcessingJs } from '@/lib/postProcessingEngine';
import { artDirectionCss, artDirectionJs, artDirectionPage } from '@/lib/artDirectionEngine';
import { premiumAssetCss } from '@/lib/visualAssetEngine';
import { cinematicCss } from '@/lib/cinematicCompositionEngine';
import { generateRealImages } from '@/lib/realImageEngine';
import { analyzeNiche } from '@/lib/nicheIntelligenceEngine';

type Project = { html: string; css: string; js: string };
type Intel = ReturnType<typeof analyzeNiche>;

const MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash-lite'];

function injectFx(html: string) {
  return html.replace('<body>', `<body>${threeSceneHtml()}${webglHtml()}${motionHtml()}${shaderHtml()}${atmosphereHtml()}${postProcessingHtml()}`);
}

async function buildFallback(prompt: string, referenceUrl = '') {
  const intel = analyzeNiche(prompt, referenceUrl);
  await generateRealImages(intel.niche, intel.sub);
  const html = injectFx(artDirectionPage(intel));

  return {
    project: {
      html,
      css: `${artDirectionCss(intel)}\n${cinematicCss()}\n${premiumAssetCss()}\n${threeSceneCss()}\n${webglCss()}\n${motionCss()}\n${shaderCss()}\n${atmosphereCss()}\n${postProcessingCss()}`,
      js: `${artDirectionJs()}\n${threeSceneJs()}\n${webglJs()}\n${motionJs()}\n${shaderJs()}\n${atmosphereJs()}\n${postProcessingJs()}`,
    },
    intelligence: intel,
    imageSource: 'art-direction',
  };
}

function withEngines(project: Project) {
  let html = project.html;

  if (!html.includes('threeSceneCanvas')) html = html.replace('<body>', `<body>${threeSceneHtml()}`);
  if (!html.includes('webglStage')) html = html.replace('<body>', `<body>${webglHtml()}`);
  if (!html.includes('motionGrid')) html = html.replace('<body>', `<body>${motionHtml()}`);
  if (!html.includes('shaderAurora')) html = html.replace('<body>', `<body>${shaderHtml()}`);
  if (!html.includes('atmosphereCanvas')) html = html.replace('<body>', `<body>${atmosphereHtml()}`);
  if (!html.includes('postVignette')) html = html.replace('<body>', `<body>${postProcessingHtml()}`);

  return {
    html,
    css: `${project.css}\n${cinematicCss()}\n${premiumAssetCss()}\n${threeSceneCss()}\n${webglCss()}\n${motionCss()}\n${shaderCss()}\n${atmosphereCss()}\n${postProcessingCss()}`,
    js: `${project.js}\n${threeSceneJs()}\n${webglJs()}\n${motionJs()}\n${shaderJs()}\n${atmosphereJs()}\n${postProcessingJs()}`,
  };
}

async function parseProject(text: string, prompt: string, referenceUrl = '') {
  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned) as Partial<Project>;

    if (parsed.html && parsed.css && parsed.js) {
      return {
        project: withEngines({ html: parsed.html, css: parsed.css, js: parsed.js }),
        intelligence: analyzeNiche(prompt, referenceUrl),
        imageSource: 'gemini',
      };
    }
  } catch {}

  return buildFallback(prompt, referenceUrl);
}

async function callGemini(model: string, apiKey: string, instruction: string) {
  return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: instruction }] }],
      generationConfig: {
        temperature: 0.94,
        maxOutputTokens: 18000,
        responseMimeType: 'application/json',
      },
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, referenceUrl } = await request.json();

    const clean = prompt || 'site premium de tecnologia';
    const apiKey = process.env.GEMINI_API_KEY;
    const intel = analyzeNiche(clean, referenceUrl || '');

    if (!apiKey) {
      return NextResponse.json({
        ...(await buildFallback(clean, referenceUrl || '')),
        source: 'fallback-no-gemini-key',
        model: 'niche-intelligence-v19',
      });
    }

    const seed = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const instruction = `Gera um WEBSITE NOVO do zero em vanilla HTML/CSS/JS para: ${clean}.
Referência visual opcional: ${referenceUrl || 'nenhuma'}.
Nicho detetado: ${intel.niche}. Subnicho: ${intel.sub}.
Seed criativo obrigatório: ${seed}.

Regras obrigatórias:
- Responde APENAS JSON válido com html, css e js.
- Nunca mostres o prompt bruto do utilizador no site final.
- Não cries cards por cima de texto, overlays ilegíveis ou elementos desalinhados.
- Não cries uma landing plana nem grids genéricas.
- Cria composição editorial/cinemática com zonas claras: hero copy, visual stage, metrics e product panel.
- O 3D/WebGL deve funcionar como atmosfera ou visual stage, nunca como overlay que cobre conteúdo.
- Usa spacing consistente, alinhamento premium e hierarchy clara.
- Para fotografia: usar fullscreen imagery, editorial spacing, layered storytelling, gallery motion e cinematic layout.
- Para trading: usar command center, HUD, metrics, dashboards e financial cockpit.
- Para beauty: usar booking, services, trust blocks e elegant spacing.
- Para SaaS: usar workflow surfaces, product storytelling e dashboards.
- Usa motion classes apenas quando ajudam a composição.
- Inclui CSS completo e JS funcional.
- O resultado tem de parecer diferente a cada nova geração.`;

    const errors: string[] = [];

    for (const model of MODELS) {
      const response = await callGemini(model, apiKey, instruction);

      if (!response.ok) {
        errors.push(`${model}: ${await response.text()}`);
        continue;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('\n') || '';

      return NextResponse.json({
        ...(await parseProject(text, clean, referenceUrl || '')),
        source: 'gemini-niche-intelligence',
        model,
        seed,
      });
    }

    return NextResponse.json({
      ...(await buildFallback(clean, referenceUrl || '')),
      source: 'fallback-after-gemini-error',
      model: 'niche-intelligence-v19',
      error: errors.join('\n\n'),
    });
  } catch (error) {
    return NextResponse.json({
      ...(await buildFallback('site premium de tecnologia')),
      source: 'fallback-error',
      error: String(error),
    });
  }
}
