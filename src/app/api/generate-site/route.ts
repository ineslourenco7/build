import { NextRequest, NextResponse } from 'next/server';

type GeneratedProject = {
  html: string;
  css: string;
  js: string;
};

function detectBusiness(prompt: string) {
  const lower = prompt.toLowerCase();

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
    };
  }

  return {
    title: 'Nova Marca',
    accent: '#6366f1',
    soft: '#eef2ff',
    eyebrow: 'Projeto vanilla gerado',
    headline: `Site criado para: ${prompt}`,
    description: 'Projeto em HTML, CSS e JavaScript separados, com preview funcional.',
    services: ['Landing page', 'Contacto', 'Conversão'],
    cta: 'Pedir contacto',
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
      <button data-target="services">Menu</button>
      <button data-target="about">Sobre</button>
      <button data-target="pricing">Preços</button>
      <button data-target="contact">Contacto</button>
    </nav>
  </header>

  <main>
    <section id="home" class="hero">
      <p class="eyebrow">${business.eyebrow}</p>
      <h1>${business.headline}</h1>
      <p>${business.description}</p>
      <button class="primary" data-target="contact">${business.cta}</button>
    </section>

    <section id="services">
      <h2>Menu e serviços</h2>
      <div class="grid">
        ${business.services.map((service) => `<article><h3>${service}</h3><p>Opção criada para responder ao pedido: ${prompt}</p><button data-target="contact">Saber mais</button></article>`).join('')}
      </div>
    </section>

    <section id="about" class="about">
      <h2>Sobre ${business.title}</h2>
      <p>Este é um fallback local. Se estás a ver isto, o Gemini ainda não respondeu corretamente ou a API key não está ativa no servidor.</p>
    </section>

    <section id="pricing">
      <h2>Preços</h2>
      <div class="grid">
        <article><h3>Almoço</h3><p>desde €14</p></article>
        <article class="featured"><h3>Jantar</h3><p>desde €24</p></article>
        <article><h3>Grupo</h3><p>sob orçamento</p></article>
      </div>
    </section>

    <section id="contact">
      <h2>Contacto</h2>
      <form id="contactForm">
        <input placeholder="Nome" required />
        <input type="email" placeholder="Email" required />
        <textarea placeholder="Mensagem" required></textarea>
        <button class="primary" type="submit">Enviar</button>
      </form>
      <p id="successMessage" class="success">Pedido enviado com sucesso.</p>
    </section>
  </main>

  <script src="script.js"></script>
</body>
</html>`,
    css: `:root { --accent: ${business.accent}; --soft: ${business.soft}; --bg: #ffffff; --text: #111827; --muted: #64748b; }
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: var(--text); background: var(--bg); }
.site-header { position: sticky; top: 0; z-index: 10; display: flex; justify-content: space-between; align-items: center; padding: 20px 7vw; background: rgba(255,255,255,.94); border-bottom: 1px solid #e5e7eb; backdrop-filter: blur(12px); }
.logo { color: var(--accent); font-size: 22px; font-weight: 900; }
nav { display: flex; gap: 12px; }
nav button, article button { border: 0; background: transparent; color: var(--muted); font-weight: 700; cursor: pointer; }
nav button:hover, article button:hover { color: var(--accent); }
section { padding: 76px 7vw; }
.hero { min-height: 560px; display: grid; align-content: center; background: linear-gradient(135deg, var(--soft), #ffffff); }
.eyebrow { color: var(--accent); font-weight: 800; }
h1 { max-width: 920px; font-size: clamp(42px, 7vw, 78px); line-height: .95; letter-spacing: -.06em; margin: 0 0 20px; }
h2 { font-size: clamp(30px, 4vw, 48px); letter-spacing: -.04em; }
p { color: var(--muted); font-size: 18px; line-height: 1.7; }
.primary { border: 0; border-radius: 14px; background: var(--accent); color: white; padding: 14px 22px; font-weight: 900; cursor: pointer; width: fit-content; }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
article { border: 1px solid #e5e7eb; border-radius: 24px; padding: 28px; background: white; box-shadow: 0 16px 40px rgba(15,23,42,.06); }
.featured { border-color: var(--accent); }
.about { background: #f8fafc; }
form { display: grid; gap: 12px; max-width: 560px; }
input, textarea { width: 100%; border: 1px solid #d1d5db; border-radius: 14px; padding: 14px 16px; font: inherit; color: var(--text); }
textarea { min-height: 120px; }
.success { display: none; color: #047857; font-weight: 800; }
@media (max-width: 800px) { .grid { grid-template-columns: 1fr; } nav { display: none; } }`,
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

export async function POST(request: NextRequest) {
  try {
    const { prompt, referenceUrl } = await request.json();
    const cleanPrompt = prompt || 'site moderno';
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ project: fallbackProject(cleanPrompt), source: 'fallback', error: 'GEMINI_API_KEY missing' });
    }

    const instruction = `Gera um projeto vanilla HTML/CSS/JS completo.
O utilizador pediu: ${cleanPrompt}
Link de inspiração opcional: ${referenceUrl || 'nenhum'}

Responde apenas com JSON válido neste formato exato:
{
  "html": "conteúdo completo do index.html",
  "css": "conteúdo completo do style.css",
  "js": "conteúdo completo do script.js"
}

Regras obrigatórias:
- O HTML deve referenciar <link rel="stylesheet" href="style.css"> e <script src="script.js"></script>.
- O site deve estar em português europeu.
- Respeita exatamente o tipo de negócio pedido. Se o utilizador pedir chinês, cria restaurante chinês; se pedir italiano, cria italiano; não troques o nicho.
- Deve ter várias secções/páginas: Início, Serviços/Menu, Sobre, Preços e Contacto.
- Todos os botões e navegação devem funcionar com JavaScript vanilla.
- O formulário deve mostrar uma mensagem de sucesso sem backend.
- Design moderno, responsivo e visualmente forte.
- Não escrevas que é um site para gerar sites. O site gerado deve parecer o site final do negócio.
- Não copies texto, imagens, marcas ou código de sites existentes. Usa link só como inspiração estrutural.
- Não uses bibliotecas externas obrigatórias.
- Usa fontes seguras como Arial, Inter fallback, system-ui ou Helvetica.
- Não incluas markdown, comentários fora do JSON, nem blocos de código.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: instruction }] }],
          generationConfig: {
            temperature: 0.65,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { project: fallbackProject(cleanPrompt), source: 'fallback', error: errorText },
        { status: 200 }
      );
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('\n') || '';
    const project = parseProject(text, cleanPrompt);

    return NextResponse.json({ project, source: 'gemini' });
  } catch (error) {
    return NextResponse.json({ project: fallbackProject('site moderno'), source: 'fallback', error: String(error) }, { status: 200 });
  }
}
