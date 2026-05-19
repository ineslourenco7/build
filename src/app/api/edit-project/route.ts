import { NextRequest, NextResponse } from 'next/server';

type GeneratedProject = {
  html: string;
  css: string;
  js: string;
};

type ChatAttachment = {
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
};

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash-lite'];

function fallbackEdit(project: GeneratedProject, message: string): GeneratedProject {
  const note = `\n/* Last requested edit: ${message.replace(/\*\//g, '')} */`;
  return {
    html: project.html,
    css: project.css.includes('/* Last requested edit:') ? project.css : `${project.css}${note}`,
    js: project.js,
  };
}

function parseProject(text: string, currentProject: GeneratedProject, message: string): GeneratedProject {
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();

  try {
    const parsed = JSON.parse(cleaned) as Partial<GeneratedProject>;
    if (parsed.html && parsed.css && parsed.js) {
      return { html: parsed.html, css: parsed.css, js: parsed.js };
    }
  } catch {
    // fallback below
  }

  return fallbackEdit(currentProject, message);
}

function attachmentSummary(attachments: ChatAttachment[]) {
  if (!attachments?.length) return 'Nenhum anexo.';
  return attachments.map((file) => `- ${file.name} (${file.type || 'tipo desconhecido'}, ${Math.round((file.size || 0) / 1024)}KB)`).join('\n');
}

function inlineImageParts(attachments: ChatAttachment[]) {
  return (attachments || [])
    .filter((file) => file.type?.startsWith('image/') && file.dataUrl?.includes(','))
    .slice(0, 4)
    .map((file) => {
      const base64 = file.dataUrl?.split(',')[1] || '';
      return {
        inlineData: {
          mimeType: file.type,
          data: base64,
        },
      };
    });
}

async function callGemini(model: string, apiKey: string, instruction: string, attachments: ChatAttachment[]) {
  const parts = [{ text: instruction }, ...inlineImageParts(attachments)];

  return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        temperature: 0.45,
        maxOutputTokens: 14000,
        responseMimeType: 'application/json',
      },
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { project, message, chatHistory, attachments = [] } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!project?.html || !project?.css || !project?.js) {
      return NextResponse.json({ error: 'Missing current project.' }, { status: 400 });
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Missing edit message.' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ project: fallbackEdit(project, message), source: 'fallback', error: 'GEMINI_API_KEY missing' });
    }

    const instruction = `És um editor de websites dentro de um AI website builder.
Recebes um projeto existente com index.html, style.css e script.js.
O utilizador pediu uma alteração incremental.

ALTERAÇÃO PEDIDA:
${message}

ANEXOS DO UTILIZADOR:
${attachmentSummary(attachments)}

Se forem enviadas imagens, usa-as como referência visual: estilo, cores, composição, logotipo, produtos ou fotografias do cliente.
Se o utilizador pedir para usar as imagens no site, podes inserir a própria imagem como data URL no HTML apenas quando fizer sentido. Caso contrário, usa-as como referência de design.
Para PDFs/docs, considera apenas o nome/tipo como contexto nesta versão.

HISTÓRICO RESUMIDO DO CHAT:
${JSON.stringify(chatHistory || []).slice(0, 6000)}

PROJETO ATUAL:
index.html:
${project.html}

style.css:
${project.css}

script.js:
${project.js}

TAREFA:
- Edita o projeto atual para aplicar a alteração pedida.
- Mantém tudo o que não foi pedido para alterar.
- Não voltes para templates antigos.
- Não coloques o prompt bruto na página.
- Preserva HTML/CSS/JS vanilla separados.
- Garante que botões, navegação e formulário continuam funcionais.
- Se o utilizador pedir mudança visual, altera principalmente CSS e só muda HTML se necessário.
- Se pedir nova secção, adiciona HTML, CSS e JS se necessário.

BOOKING / MARCAÇÕES:
Se o utilizador pedir marcações, booking, agenda, calendário, disponibilidade, estética, nails, cabeleireiro, barbeiro, spa, clínica, tratamentos ou serviços com reserva, adiciona uma secção de booking funcional.
Essa secção deve incluir obrigatoriamente:
- Calendário visual mensal simples em HTML/CSS/JS vanilla.
- Dias disponíveis e indisponíveis com estilos diferentes.
- Seleção de dia.
- Horários disponíveis que mudam conforme o dia selecionado.
- Seleção de serviço/tipo de serviço com preço e duração, por exemplo Manicure Gel, Nail Art, Corte, Coloração, Limpeza de Pele, Massagem.
- Campos Nome, Email ou Telefone.
- Botão Confirmar marcação.
- Resumo da marcação escolhida.
- Mensagem de confirmação sem backend.
- JavaScript robusto para atualizar seleção, impedir submissão sem dia/hora/serviço e mostrar confirmação.
- Design premium adequado ao nicho, especialmente beleza/estética: cards suaves, calendário elegante, botões claros e mobile friendly.
Não uses bibliotecas externas nem APIs externas.

- Responde apenas com JSON válido neste formato exato:
{
  "html": "conteúdo completo atualizado do index.html",
  "css": "conteúdo completo atualizado do style.css",
  "js": "conteúdo completo atualizado do script.js"
}`;

    const errors: string[] = [];

    for (const model of GEMINI_MODELS) {
      const response = await callGemini(model, apiKey, instruction, attachments);

      if (!response.ok) {
        errors.push(`${model}: ${await response.text()}`);
        continue;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('\n') || '';
      return NextResponse.json({ project: parseProject(text, project, message), source: 'gemini-edit', model });
    }

    return NextResponse.json({ project: fallbackEdit(project, message), source: 'fallback', error: errors.join('\n\n') });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
