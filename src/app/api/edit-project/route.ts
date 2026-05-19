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

function hasBookingIntent(message: string) {
  const lower = message.toLowerCase();
  return ['booking', 'marcação', 'marcações', 'calendário', 'calendario', 'agenda', 'disponibilidade', 'reservas', 'marcar'].some((term) => lower.includes(term));
}

function fallbackBookingSection() {
  return `
<section id="booking" class="ai-booking-section">
  <div class="ai-booking-copy">
    <p class="ai-kicker">Marcações online</p>
    <h2>Escolhe serviço, dia e hora.</h2>
    <p>Simulação funcional de booking para estética, nails, cabelo ou serviços premium. O cliente escolhe disponibilidade e deixa contacto.</p>
  </div>
  <div class="ai-booking-card">
    <div class="ai-booking-grid">
      <div>
        <label>Serviço</label>
        <select id="aiServiceSelect">
          <option value="Manicure Gel|35€|60min">Manicure Gel · 35€ · 60min</option>
          <option value="Nail Art Premium|55€|90min">Nail Art Premium · 55€ · 90min</option>
          <option value="Limpeza de Pele|70€|75min">Limpeza de Pele · 70€ · 75min</option>
          <option value="Corte e Styling|45€|60min">Corte e Styling · 45€ · 60min</option>
        </select>
      </div>
      <div>
        <label>Contacto</label>
        <input id="aiClientContact" placeholder="Email ou telefone" />
      </div>
    </div>
    <div class="ai-calendar" id="aiCalendar"></div>
    <div class="ai-slots" id="aiSlots"></div>
    <input id="aiClientName" placeholder="Nome completo" />
    <button class="ai-booking-button" id="aiConfirmBooking" type="button">Confirmar marcação</button>
    <p class="ai-booking-summary" id="aiBookingSummary">Seleciona um dia e uma hora para veres o resumo.</p>
  </div>
</section>`;
}

function fallbackBookingCss() {
  return `
.ai-booking-section{padding:90px 6vw;background:linear-gradient(135deg,#fff7fb,#f8fafc);display:grid;grid-template-columns:.8fr 1.2fr;gap:34px;align-items:start;color:#111827}.ai-kicker{text-transform:uppercase;letter-spacing:.16em;font-size:12px;font-weight:900;color:#db2777}.ai-booking-copy h2{font-size:clamp(34px,5vw,68px);line-height:.9;letter-spacing:-.06em;margin:0 0 18px}.ai-booking-card{background:white;border:1px solid rgba(17,24,39,.1);border-radius:32px;padding:24px;box-shadow:0 24px 80px rgba(15,23,42,.12)}.ai-booking-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}.ai-booking-card label{display:block;font-size:12px;font-weight:900;color:#64748b;margin-bottom:6px}.ai-booking-card input,.ai-booking-card select{width:100%;border:1px solid #e5e7eb;border-radius:16px;padding:13px 14px;font:inherit;color:#111827;background:#fff}.ai-calendar{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin:18px 0}.ai-day{border:1px solid #e5e7eb;border-radius:16px;background:#fff;padding:12px 6px;min-height:46px;font-weight:900;cursor:pointer;color:#111827}.ai-day:hover,.ai-day.active{background:#111827;color:#fff}.ai-day.disabled{opacity:.35;cursor:not-allowed;background:#f1f5f9;color:#94a3b8}.ai-slots{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 16px}.ai-slot{border:1px solid #e5e7eb;border-radius:999px;background:#fff;padding:10px 14px;font-weight:900;cursor:pointer;color:#111827}.ai-slot.active{background:#db2777;color:white;border-color:#db2777}.ai-booking-button{width:100%;border:0;border-radius:999px;background:#111827;color:white;padding:15px 20px;font-weight:900;cursor:pointer;margin-top:12px}.ai-booking-summary{color:#475569;font-weight:700;margin-top:14px}@media(max-width:900px){.ai-booking-section,.ai-booking-grid{grid-template-columns:1fr}.ai-calendar{grid-template-columns:repeat(4,1fr)}}`;
}

function fallbackBookingJs() {
  return `
(function(){
  var calendar=document.getElementById('aiCalendar');
  var slots=document.getElementById('aiSlots');
  var service=document.getElementById('aiServiceSelect');
  var name=document.getElementById('aiClientName');
  var contact=document.getElementById('aiClientContact');
  var summary=document.getElementById('aiBookingSummary');
  var confirm=document.getElementById('aiConfirmBooking');
  if(!calendar||!slots||!service||!summary||!confirm)return;
  var selectedDay='';
  var selectedSlot='';
  var slotMap={0:['10:00','12:00','15:30'],1:['09:30','11:00','16:00'],2:['10:30','14:00','17:00'],3:['09:00','13:00','18:00']};
  function updateSummary(done){
    var parts=service.value.split('|');
    if(done){summary.textContent='Marcação confirmada para '+name.value+' · '+parts[0]+' · '+selectedDay+' às '+selectedSlot+' · contacto: '+contact.value;summary.style.color='#047857';return;}
    summary.textContent=selectedDay&&selectedSlot?'Resumo: '+parts[0]+' · '+parts[1]+' · '+parts[2]+' · '+selectedDay+' às '+selectedSlot:'Seleciona um dia e uma hora para veres o resumo.';
  }
  function renderSlots(index){
    selectedSlot='';
    slots.innerHTML='';
    (slotMap[index%4]||slotMap[0]).forEach(function(hour){
      var button=document.createElement('button');button.type='button';button.className='ai-slot';button.textContent=hour;button.onclick=function(){document.querySelectorAll('.ai-slot').forEach(function(item){item.classList.remove('active')});button.classList.add('active');selectedSlot=hour;updateSummary(false)};slots.appendChild(button);
    });
    updateSummary(false);
  }
  for(var i=1;i<=21;i++){
    var button=document.createElement('button');button.type='button';button.className='ai-day'+(i%6===0?' disabled':'');button.textContent=String(i).padStart(2,'0');
    button.onclick=(function(day,index){return function(){if(this.classList.contains('disabled'))return;document.querySelectorAll('.ai-day').forEach(function(item){item.classList.remove('active')});this.classList.add('active');selectedDay=day+'/06';renderSlots(index);};})(button.textContent,i);
    calendar.appendChild(button);
  }
  service.onchange=function(){updateSummary(false)};
  confirm.onclick=function(){if(!selectedDay||!selectedSlot||!name.value||!contact.value){summary.textContent='Preenche nome, contacto, dia e hora para confirmar.';summary.style.color='#dc2626';return;}updateSummary(true)};
})();`;
}

function fallbackEdit(project: GeneratedProject, message: string): GeneratedProject {
  const stamp = Date.now();
  const lower = message.toLowerCase();
  let html = project.html;
  let css = project.css;
  let js = project.js;

  if (hasBookingIntent(message) && !html.includes('ai-booking-section')) {
    html = html.includes('</main>')
      ? html.replace('</main>', `${fallbackBookingSection()}\n</main>`)
      : html.replace('</body>', `${fallbackBookingSection()}\n</body>`);
    css = `${css}\n${fallbackBookingCss()}`;
    js = `${js}\n${fallbackBookingJs()}`;
  } else if (lower.includes('preto') || lower.includes('dark') || lower.includes('escuro')) {
    css = `${css}\n:root{--ai-edit-bg:#050505;--ai-edit-text:#f8fafc}\nbody{background:#050505!important;color:#f8fafc!important}\nsection{background-color:transparent}\n/* ai-edit-${stamp}: dark mode */`;
  } else if (lower.includes('rosa') || lower.includes('pink')) {
    css = `${css}\n:root{--ai-edit-accent:#ec4899}\nbutton,.primary,.nav-cta{background:#ec4899!important;color:white!important;border-color:#ec4899!important}\n/* ai-edit-${stamp}: pink accent */`;
  } else if (lower.includes('minimalista') || lower.includes('minimal')) {
    css = `${css}\n*{letter-spacing:-.02em} section{padding-top:72px!important;padding-bottom:72px!important} .hero{gap:32px!important} img{filter:saturate(.88) contrast(1.04)}\n/* ai-edit-${stamp}: minimal spacing */`;
  } else {
    html = html.includes('</body>')
      ? html.replace('</body>', `\n<div data-ai-edit="${stamp}" hidden>${message.replace(/</g, '&lt;')}</div>\n</body>`)
      : `${html}\n<div data-ai-edit="${stamp}" hidden>${message.replace(/</g, '&lt;')}</div>`;
    css = `${css}\n/* ai-edit-${stamp}: ${message.replace(/\*\//g, '')} */`;
  }

  return { html, css, js };
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
