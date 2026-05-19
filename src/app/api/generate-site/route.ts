import { NextRequest, NextResponse } from 'next/server';

type GeneratedProject = {
  html: string;
  css: string;
  js: string;
};

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash-lite'];

function detectBusiness(prompt: string) {
  const lower = prompt.toLowerCase();

  if (lower.includes('hotel') || lower.includes('boutique') || lower.includes('alojamento')) {
    return {
      title: 'Lúmina Lisboa Hotel',
      accent: '#9f7aea',
      soft: '#f6f2ff',
      eyebrow: 'Hotel boutique minimalista em Lisboa',
      headline: 'Estadia serena, design discreto e Lisboa à porta',
      description: 'Um refúgio boutique com quartos luminosos, pequeno-almoço artesanal, terraço privado e concierge local para descobrir a cidade com calma.',
      services: ['Suites minimalistas', 'Terraço com vista', 'Concierge local'],
      cta: 'Reservar estadia',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
    };
  }

  if (lower.includes('chinês') || lower.includes('chines') || lower.includes('china')) {
    return {
      title: 'Dragão Dourado',
      accent: '#b91c1c',
      soft: '#fff1f2',
      eyebrow: 'Restaurante chinês tradicional',
      headline: 'Sabores chineses autênticos no coração da cidade',
      description: 'Dim sum, noodles, arroz salteado e pratos clássicos preparados com ingredientes frescos.',
      services: ['Dim Sum artesanal', 'Noodles frescos', 'Reservas para grupos'],
      cta: 'Reservar mesa',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80',
    };
  }

  if (lower.includes('italiano') || lower.includes('italiana')) {
    return {
      title: 'Bella Mesa',
      accent: '#dc2626',
      soft: '#fff7ed',
      eyebrow: 'Restaurante italiano premium',
      headline: 'Pasta fresca, forno a lenha e sabores de Itália',
      description: 'Um restaurante italiano moderno com reservas online, menu sazonal e ambiente acolhedor.',
      services: ['Pasta fresca', 'Pizza artesanal', 'Carta de vinhos'],
      cta: 'Reservar agora',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
    };
  }

  if (lower.includes('restaurante')) {
    return {
      title: 'Mesa Nova',
      accent: '#ea580c',
      soft: '#fff7ed',
      eyebrow: 'Restaurante moderno',
      headline: 'Uma experiência gastronómica criada para receber bem',
      description: 'Menu cuidado, reservas simples e uma presença digital preparada para converter visitantes em clientes.',
      services: ['Menu sazonal', 'Reservas online', 'Eventos privados'],
      cta: 'Reservar mesa',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    };
  }

  return {
    title: 'Marca Aurora',
    accent: '#6366f1',
    soft: '#eef2ff',
    eyebrow: 'Experiência digital premium',
    headline: 'Uma presença online elegante, clara e preparada para converter',
    description: 'Landing page moderna com storytelling, serviços, prova social, contacto e uma estética cuidada para apresentar a marca com confiança.',
    services: ['Experiência premium', 'Serviços personalizados', 'Contacto direto'],
    cta: 'Pedir contacto',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80',
  };
}

function fallbackProject(prompt: string): GeneratedProject {
  const business = detectBusiness(prompt);

  return {
    html: `<!doctype html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${business.title}</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header class="site-header">
    <strong class="logo">${business.title}</strong>
    <nav>
      <button data-target="home">Início</button>
      <button data-target="services">Experiências</button>
      <button data-target="gallery">Galeria</button>
      <button data-target="about">Sobre</button>
      <button data-target="contact">Contacto</button>
    </nav>
  </header>

  <main>
    <section id="home" class="hero">
      <div class="hero-copy">
        <p class="eyebrow">${business.eyebrow}</p>
        <h1>${business.headline}</h1>
        <p>${business.description}</p>
        <div class="actions"><button class="primary" data-target="contact">${business.cta}</button><button class="secondary" data-target="services">Ver experiências</button></div>
      </div>
      <div class="hero-image"><img src="${business.image}" alt="${business.title}" /></div>
    </section>

    <section class="stats">
      <article><strong>4.9★</strong><span>avaliação média</span></article>
      <article><strong>24h</strong><span>assistência dedicada</span></article>
      <article><strong>+12k</strong><span>clientes recebidos</span></article>
    </section>

    <section id="services">
      <div class="section-head"><p class="eyebrow">Experiências</p><h2>Detalhes pensados para uma experiência memorável</h2></div>
      <div class="grid">
        ${business.services.map((service, index) => `<article><img src="https://images.unsplash.com/photo-${index === 0 ? '1566073771259-6a8506099945' : index === 1 ? '1542314831-068cd1dbfeeb' : '1571896349842-33c89424de2d'}?auto=format&fit=crop&w=700&q=80" alt="${service}"/><h3>${service}</h3><p>Uma proposta cuidada, com apresentação premium e detalhes realistas para ajudar o cliente a imaginar o resultado final.</p><button data-target="contact">Saber mais</button></article>`).join('')}
      </div>
    </section>

    <section id="gallery" class="gallery"><div class="section-head"><p class="eyebrow">Ambiente</p><h2>Galeria visual</h2></div><div class="gallery-grid"><img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=700&q=80" alt="Interior premium"/><img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=700&q=80" alt="Quarto elegante"/><img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=700&q=80" alt="Hotel boutique"/></div></section>

    <section id="about" class="about">
      <div><p class="eyebrow">Sobre</p><h2>Um espaço criado para receber com calma, beleza e atenção ao detalhe.</h2></div>
      <blockquote>“Uma experiência impecável, elegante e profundamente confortável.” — Mariana Costa</blockquote>
    </section>

    <section id="contact">
      <div class="section-head"><p class="eyebrow">Contacto</p><h2>Reserva e pedidos especiais</h2></div>
      <p>Rua das Janelas Verdes, 128, Lisboa · Aberto todos os dias · reservas@luminalisboa.pt · +351 210 000 128</p>
      <form id="contactForm">
        <input placeholder="Nome" required />
        <input type="email" placeholder="Email" required />
        <textarea placeholder="Mensagem" required></textarea>
        <button class="primary" type="submit">Enviar pedido</button>
      </form>
      <p id="successMessage" class="success">Pedido enviado com sucesso.</p>
    </section>
  </main>

  <script src="script.js"></script>
</body>
</html>`,
    css: `:root { --accent: ${business.accent}; --soft: ${business.soft}; --bg: #fbfaf8; --text: #111827; --muted: #64748b; --card: #ffffff; }
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, Arial, sans-serif; color: var(--text); background: var(--bg); }
.site-header { position: sticky; top: 0; z-index: 10; display: flex; justify-content: space-between; align-items: center; padding: 18px 7vw; background: rgba(251,250,248,.86); border-bottom: 1px solid rgba(17,24,39,.08); backdrop-filter: blur(16px); }
.logo { color: var(--text); font-size: 20px; font-weight: 900; letter-spacing:-.03em; }
nav { display: flex; gap: 8px; }
nav button, article button { border: 0; border-radius:999px; background: transparent; color: var(--muted); font-weight: 750; cursor: pointer; padding:10px 12px; transition:.2s ease; }
nav button:hover, article button:hover { color: var(--text); background:rgba(17,24,39,.06); }
section { padding: 86px 7vw; }
.hero { min-height: 690px; display: grid; grid-template-columns: .9fr 1.1fr; gap: 54px; align-items: center; background: radial-gradient(circle at top left, var(--soft), transparent 42%), var(--bg); }
.hero-copy { max-width:720px; }
.hero-image { height:560px; border-radius:38px; overflow:hidden; box-shadow:0 34px 90px rgba(15,23,42,.18); }
.hero img, article img, .gallery img { width: 100%; height: 100%; object-fit: cover; display:block; }
.eyebrow { color: var(--accent); font-weight: 900; letter-spacing:.14em; text-transform:uppercase; font-size:12px; }
h1 { font-size: clamp(48px, 7vw, 92px); line-height: .88; letter-spacing: -.075em; margin: 0 0 24px; }
h2 { font-size: clamp(34px, 5vw, 64px); line-height:.95; letter-spacing: -.06em; margin:0; }
h3 { font-size:24px; letter-spacing:-.04em; margin:14px 0 8px; }
p { color: var(--muted); font-size: 18px; line-height: 1.75; }
.actions { display:flex; gap:12px; flex-wrap:wrap; margin-top:28px; }
.primary, .secondary { border: 0; border-radius: 999px; padding: 15px 24px; font-weight: 900; cursor: pointer; width: fit-content; transition:.2s ease; }
.primary { background: var(--text); color: white; box-shadow:0 16px 34px rgba(17,24,39,.2); }
.primary:hover { transform: translateY(-2px); }
.secondary { background: white; color: var(--text); border: 1px solid rgba(17,24,39,.1); }
.section-head { max-width:760px; margin-bottom:32px; }
.grid, .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
article { border: 1px solid rgba(17,24,39,.08); border-radius: 32px; padding: 22px; background: var(--card); box-shadow: 0 18px 50px rgba(15,23,42,.07); transition:.25s ease; }
article:hover { transform: translateY(-5px); box-shadow:0 26px 70px rgba(15,23,42,.12); }
article img { height: 210px; border-radius:24px; margin-bottom: 18px; }
.stats { background:#111827; color:white; }
.stats article { background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.12); box-shadow:none; }
.stats strong { display:block; font-size:42px; letter-spacing:-.05em; }
.stats span { color:#cbd5e1; }
.gallery, .about { background: #ffffff; }
.gallery-grid { display:grid; grid-template-columns:1.2fr .8fr 1fr; gap:22px; height:430px; }
.gallery img { border-radius:32px; box-shadow:0 24px 70px rgba(15,23,42,.12); }
.about { display:grid; grid-template-columns:1fr .9fr; gap:40px; align-items:center; }
blockquote { font-size:30px; line-height:1.35; letter-spacing:-.04em; border-left:4px solid var(--accent); padding-left:24px; color:#111827; }
form { display: grid; gap: 12px; max-width: 620px; margin-top:22px; }
input, textarea { width: 100%; border: 1px solid rgba(17,24,39,.12); border-radius: 18px; padding: 16px 18px; font: inherit; color: var(--text); background:white; }
textarea { min-height: 130px; }
.success { display: none; color: #047857; font-weight: 900; }
@media (max-width: 900px) { .hero, .grid, .stats, .gallery-grid, .about { grid-template-columns: 1fr; height:auto; } nav { display: none; } .hero-image { height:360px; } }`,
    js: `document.querySelectorAll('[data-target]').forEach((button) => {
  button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
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

function parseProject(text: string, prompt: string): GeneratedProject {
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();

  try {
    const parsed = JSON.parse(cleaned) as Partial<GeneratedProject>;
    if (parsed.html && parsed.css && parsed.js) {
      return { html: parsed.html, css: parsed.css, js: parsed.js };
    }
  } catch {
    // fall through to fallback
  }

  return fallbackProject(prompt);
}

async function callGemini(model: string, apiKey: string, instruction: string) {
  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: instruction }] }],
        generationConfig: {
          temperature: 0.85,
          maxOutputTokens: 14000,
          responseMimeType: 'application/json',
        },
      }),
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, referenceUrl } = await request.json();
    const cleanPrompt = prompt || 'site moderno';
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ project: fallbackProject(cleanPrompt), source: 'fallback', error: 'GEMINI_API_KEY missing' });
    }

    const instruction = `Gera um projeto vanilla HTML/CSS/JS completo com qualidade visual premium.
O utilizador pediu: ${cleanPrompt}
Link de inspiração opcional: ${referenceUrl || 'nenhum'}

Responde apenas com JSON válido neste formato exato:
{
  "html": "conteúdo completo do index.html",
  "css": "conteúdo completo do style.css",
  "js": "conteúdo completo do script.js"
}

OBJETIVO VISUAL:
O resultado deve parecer uma landing page premium criada por um bom designer frontend, pronta para mostrar a um cliente. Evita aparência básica, genérica, académica ou de template antigo.

Regras obrigatórias:
- O HTML deve referenciar <link rel="stylesheet" href="style.css"> e <script src="script.js"></script>.
- O site deve estar em português europeu.
- Respeita exatamente o tipo de negócio pedido. Se o utilizador pedir hotel, cria hotel; se pedir restaurante chinês, cria restaurante chinês; se pedir italiano, cria italiano; não troques o nicho.
- Nunca uses frases como "Site criado para:" nem coloques o prompt bruto do utilizador dentro da landing page.
- Não escrevas que é um site para gerar sites. O site gerado deve parecer o site final do negócio.

DIREÇÃO DE DESIGN PREMIUM:
- Usa uma estrutura visual forte: header sticky elegante, hero editorial split-screen ou fullscreen, imagem grande, badge, título curto e memorável, subtítulo claro e CTA principal/secundário.
- Usa no máximo 2 fontes fallback: system-ui, Inter, Arial, Helvetica. Cria hierarquia com peso, tamanho, letter-spacing e line-height, não com fontes estranhas.
- Usa uma paleta sofisticada adaptada ao nicho: fundo claro premium ou dark premium, uma cor principal, uma cor secundária suave e tons neutros. Evita cores primárias demasiado básicas.
- Usa CSS moderno: CSS variables, clamp(), grid, flex, border-radius 20-32px, sombras suaves, glassmorphism leve se fizer sentido, gradientes subtis, overlays sobre imagens.
- Layout com bom espaçamento: max-width centralizado, secções com padding generoso, cards alinhados, imagens consistentes, sem blocos de texto enormes.
- Cria pelo menos uma secção visual diferenciadora: galeria masonry, cards com imagens, menu em tabs, timeline, stats strip, pricing cards, testemunhos em cards, FAQ accordion.
- Adiciona microinterações: hover states, active states, transitions, animação suave de entrada com CSS, botões com feedback.
- Mobile responsivo: navegação compacta, grids a 1 coluna, imagens adaptáveis, texto legível.

CONTEÚDO REALISTA:
- Cria dados fictícios realistas e específicos para o negócio: nome de marca, morada, horário, telefone, email, preços, estatísticas, menus/produtos/serviços, equipa ou chef/fundador, avaliações de clientes, perguntas frequentes e chamadas à ação.
- Inclui várias secções: Início, Serviços/Menu, Galeria/Portfólio, Sobre, Testemunhos, Preços/Planos, FAQ e Contacto.
- O conteúdo deve parecer escrito para vender o negócio, não apenas descrever secções.

IMAGENS:
- Inclui imagens realistas nas várias secções usando URLs públicas diretas de Unsplash.
- Usa URLs no formato https://images.unsplash.com/... com parâmetros ?auto=format&fit=crop&w=...&q=80.
- Usa alt text descritivo.
- Não uses imagens quebradas, placeholders cinzentos, emojis como substitutos de imagens ou URLs inventadas.

INTERATIVIDADE JS:
- Todos os botões e navegação devem funcionar com JavaScript vanilla: scroll para secções, tabs de menu/serviços, acordeão FAQ, formulário com mensagem de sucesso, filtros se fizer sentido.
- O formulário deve mostrar uma mensagem de sucesso sem backend.
- O JavaScript deve ser robusto e não dar erro se um elemento não existir.

LIMITAÇÕES:
- Não copies texto, imagens, marcas ou código de sites existentes. Usa link só como inspiração estrutural.
- Não uses bibliotecas externas obrigatórias.
- Não incluas markdown, comentários fora do JSON, nem blocos de código.`;

    const errors: string[] = [];

    for (const model of GEMINI_MODELS) {
      const response = await callGemini(model, apiKey, instruction);

      if (!response.ok) {
        const errorText = await response.text();
        errors.push(`${model}: ${errorText}`);
        continue;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('\n') || '';
      const project = parseProject(text, cleanPrompt);

      return NextResponse.json({ project, source: 'gemini', model });
    }

    return NextResponse.json(
      { project: fallbackProject(cleanPrompt), source: 'fallback', error: errors.join('\n\n') },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ project: fallbackProject('site moderno'), source: 'fallback', error: String(error) }, { status: 200 });
  }
}
