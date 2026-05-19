import { NextRequest, NextResponse } from 'next/server';

function fallbackSite(prompt: string) {
  const title = prompt.toLowerCase().includes('restaurante') ? 'Bella Mesa' : 'Nova Marca';
  return `<!doctype html><html lang="pt"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>${title}</title><style>body{font-family:Arial,sans-serif;margin:0;color:#111827}section{padding:64px 8vw}.hero{background:#fff7ed}a,button{background:#dc2626;color:white;border:0;border-radius:12px;padding:12px 18px;font-weight:700}nav{display:flex;gap:16px;padding:20px 8vw;border-bottom:1px solid #eee}nav a{background:transparent;color:#111;text-decoration:none;padding:0}</style></head><body><nav><strong>${title}</strong><a href="#servicos">Serviços</a><a href="#contacto">Contacto</a></nav><section class="hero"><h1>Site gerado para: ${prompt}</h1><p>Esta é uma versão fallback porque a IA não respondeu.</p><a href="#contacto">Contactar</a></section><section id="servicos"><h2>Serviços</h2><p>Secções, botões e navegação funcionais.</p></section><section id="contacto"><h2>Contacto</h2><form onsubmit="event.preventDefault();alert('Pedido enviado!')"><input placeholder="Nome"/><button>Enviar</button></form></section></body></html>`;
}

function extractHtml(text: string) {
  const cleaned = text.replace(/```html/g, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('<!doctype html');
  const altStart = cleaned.indexOf('<html');
  const htmlStart = start >= 0 ? start : altStart;
  if (htmlStart < 0) return cleaned;
  return cleaned.slice(htmlStart);
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, referenceUrl } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ html: fallbackSite(prompt || 'site moderno'), source: 'fallback' });
    }

    const instruction = `Gera apenas um ficheiro HTML completo, sem markdown, sem explicações.
O site deve estar em português europeu.
Pedido do utilizador: ${prompt || 'site moderno'}
Link de inspiração opcional: ${referenceUrl || 'nenhum'}
Regras:
- Cria um site completo com secções/páginas: Início, Serviços/Menu, Sobre, Preços e Contacto.
- Todos os botões devem funcionar dentro do HTML, usando âncoras ou JavaScript simples.
- O formulário deve mostrar uma mensagem de sucesso sem backend.
- O design deve ser moderno, responsivo e visualmente bom.
- Não copies texto, imagens, marcas ou código de sites existentes. Usa o link só como inspiração estrutural.
- Usa CSS dentro de <style> e JavaScript dentro de <script> se necessário.
- Não uses recursos externos obrigatórios.
- Devolve só HTML.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: instruction }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { html: fallbackSite(prompt || 'site moderno'), source: 'fallback', error: errorText },
        { status: 200 }
      );
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('\n') || '';
    const html = extractHtml(text) || fallbackSite(prompt || 'site moderno');

    return NextResponse.json({ html, source: 'gemini' });
  } catch (error) {
    return NextResponse.json({ html: fallbackSite('site moderno'), source: 'fallback', error: String(error) }, { status: 200 });
  }
}
