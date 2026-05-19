import { NextRequest, NextResponse } from 'next/server';

type GeneratedProject = {
  html: string;
  css: string;
  js: string;
};

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash-lite'];

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
      <button data-target="gallery">Galeria</button>
      <button data-target="about">Sobre</button>
      <button data-target="contact">Contacto</button>
    </nav>
  </header>

  <main>
    <section id="home" class="hero">
      <div>
        <p class="eyebrow">${business.eyebrow}</p>
        <h1>${business.headline}</h1>
        <p>${business.description}</p>
        <div class="actions"><button class="primary" data-target="contact">${business.cta}</button><button class="secondary" data-target="services">Ver menu</button></div>
      </div>
      <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80" alt="Restaurante" />
    </section>

    <section class="stats">
      <article><strong>4.8★</strong><span>avaliação média</span></article>
      <article><strong>12 anos</strong><span>de experiência</span></article>
      <article><strong>+18k</strong><span>clientes servidos</span></article>
    </section>

    <section id="services">
      <h2>Menu e especialidades</h2>
      <div class="grid">
        ${business.services.map((service, index) => `<article><img src="https://images.unsplash.com/photo-${index === 0 ? '1563245372-f21724e3856d' : index === 1 ? '1551183053-bf91a1d81141' : '1517248135467-4c7edcad34c4'}?auto=format&fit=crop&w=600&q=80" alt="${service}"/><h3>${service}</h3><p>Opção criada para responder ao pedido: ${prompt}</p><button data-target="contact">Saber mais</button></article>`).join('')}
      </div>
    </section>

    <section id="gallery" class="gallery"><h2>Galeria</h2><div class="gallery-grid"><img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80"/><img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80"/><img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80"/></div></section>

    <section id="about" class="about">
      <h2>Sobre ${business.title}</h2>
      <p>Este fallback já inclui dados e imagens realistas. Quando o Gemini estiver disponível, a IA cria variações completas e específicas para cada prompt.</p>
      <blockquote>“Excelente experiência, pratos incríveis e atendimento impecável.” — Mariana Costa</blockquote>
    </section>

    <section id="contact">
      <h2>Contacto</h2>
      <p>Rua das Flores, 128, Lisboa · Aberto todos os dias das 12:00 às 23:00</p>
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
.hero { min-height: 620px; display: grid; grid-template-columns: 1.05fr .95fr; gap: 48px; align-items: center; background: linear-gradient(135deg, var(--soft), #ffffff); }
.hero img, article img, .gallery img { width: 100%; height: 100%; object-fit: cover; border-radius: 28px; box-shadow: 0 24px 70px rgba(15,23,42,.16); }
.eyebrow { color: var(--accent); font-weight: 800; }
h1 { max-width: 920px; font-size: clamp(42px, 7vw, 78px); line-height: .95; letter-spacing: -.06em; margin: 0 0 20px; }
h2 { font-size: clamp(30px, 4vw, 48px); letter-spacing: -.04em; }
p { color: var(--muted); font-size: 18px; line-height: 1.7; }
.actions { display:flex; gap:12px; flex-wrap:wrap; }
.primary, .secondary { border: 0; border-radius: 14px; padding: 14px 22px; font-weight: 900; cursor: pointer; width: fit-content; }
.primary { background: var(--accent); color: white; }
.secondary { background: white; color: var(--text); border: 1px solid #e5e7eb; }
.grid, .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
article { border: 1px solid #e5e7eb; border-radius: 28px; padding: 24px; background: white; box-shadow: 0 16px 40px rgba(15,23,42,.06); }
article img { height: 190px; margin-bottom: 18px; }
.stats { background:#111827; color:white; }
.stats article { background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.12); }
.stats strong { display:block; font-size:36px; }
.stats span { color:#cbd5e1; }
.gallery, .about { background: #f8fafc; }
.gallery-grid { display:grid; grid-template-columns:1.2fr .8fr 1fr; gap:20px; height:360px; }
blockquote { font-size:24px; line-height:1.5; border-left:4px solid var(--accent); padding-left:22px; color:#111827; }
form { display: grid; gap: 12px; max-width: 560px; }
input, textarea { width: 100%; border: 1px solid #d1d5db; border-radius: 14px; padding: 14px 16px; font: inherit; color: var(--text); }
textarea { min-height: 120px; }
.success { display: none; color: #047857; font-weight: 800; }
@media (max-width: 900px) { .hero, .grid, .stats, .gallery-grid { grid-template-columns: 1fr; height:auto; } nav { display: none; } }`,
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
          temperature: 0.8,
          maxOutputTokens: 12000,
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

    const instruction = `Gera um projeto vanilla HTML/CSS/JS completo e com aparência realista de produto final.
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
- O site gerado deve parecer um site real pronto a apresentar a um cliente, não uma demo técnica.
- Cria dados fictícios realistas e específicos para o negócio: nome de marca, morada, horário, telefone, email, preços, estatísticas, menus/produtos/serviços, equipa ou chef/fundador, avaliações de clientes, perguntas frequentes e chamadas à ação.
- Inclui várias páginas/secções: Início, Serviços/Menu, Galeria/Portfólio, Sobre, Testemunhos, Preços/Planos, FAQ e Contacto.
- Inclui imagens realistas nas várias secções usando URLs públicas de Unsplash Source ou imagens diretas Unsplash com query adequada ao nicho. Usa alt text descritivo.
- Não uses imagens quebradas. Usa URLs com https://images.unsplash.com/ ou https://source.unsplash.com/.
- Todos os botões e navegação devem funcionar com JavaScript vanilla: scroll para secções, tabs, acordeão FAQ, formulário com mensagem de sucesso, botões de filtro se fizer sentido.
- O formulário deve mostrar uma mensagem de sucesso sem backend.
- Design moderno, responsivo e visualmente forte: hero com imagem, cards, galeria, microinterações, sombras, espaçamento consistente, mobile-first, boa tipografia e paleta adaptada ao negócio.
- Não escrevas que é um site para gerar sites. O site gerado deve parecer o site final do negócio.
- Não copies texto, imagens, marcas ou código de sites existentes. Usa link só como inspiração estrutural.
- Não uses bibliotecas externas obrigatórias.
- Usa fontes seguras como Arial, Inter fallback, system-ui ou Helvetica.
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
