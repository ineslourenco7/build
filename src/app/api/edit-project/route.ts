import { NextRequest, NextResponse } from 'next/server';

type GeneratedProject = { html: string; css: string; js: string };
type ChatAttachment = { name: string; type: string; size: number; dataUrl?: string };

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash-lite'];

function sameProject(a: GeneratedProject, b: GeneratedProject) {
  return a.html === b.html && a.css === b.css && a.js === b.js;
}

function hasAny(message: string, words: string[]) {
  const lower = message.toLowerCase();
  return words.some((word) => lower.includes(word));
}

function fallbackPages(project: GeneratedProject): GeneratedProject {
  if (project.html.includes('data-page-view=')) return {
    html: project.html,
    css: `${project.css}\n.ai-page{outline:2px solid rgba(99,102,241,.22)}\n/* multi-page refreshed ${Date.now()} */`,
    js: project.js,
  };

  const pagesHtml = `
<section class="ai-pages-app">
  <nav class="ai-pages-menu">
    <button class="ai-page-link active" data-page="home">Home</button>
    <button class="ai-page-link" data-page="about">Sobre</button>
    <button class="ai-page-link" data-page="services">Serviços</button>
    <button class="ai-page-link" data-page="gallery">Galeria</button>
    <button class="ai-page-link" data-page="booking">Marcações</button>
    <button class="ai-page-link" data-page="contact">Contacto</button>
  </nav>

  <section class="ai-page active" data-page-view="home"><p class="ai-kicker">Home</p><h2>Entrada principal do website</h2><p>Apresenta a marca, a promessa principal e uma chamada à ação clara.</p></section>
  <section class="ai-page" data-page-view="about"><p class="ai-kicker">Sobre</p><h2>História, equipa e diferenciação</h2><p>Conta a história do negócio, os valores e o processo de trabalho.</p></section>
  <section class="ai-page" data-page-view="services"><p class="ai-kicker">Serviços</p><h2>Serviços e pacotes</h2><div class="ai-cards"><article><h3>Essencial</h3><p>Serviço de entrada para novos clientes.</p></article><article><h3>Premium</h3><p>Experiência completa com mais detalhe.</p></article><article><h3>Personalizado</h3><p>Solução adaptada ao cliente.</p></article></div></section>
  <section class="ai-page" data-page-view="gallery"><p class="ai-kicker">Galeria</p><h2>Galeria visual</h2><div class="ai-gallery"><span></span><span></span><span></span><span></span></div></section>
  <section class="ai-page" data-page-view="booking"><p class="ai-kicker">Marcações</p><h2>Reserva online</h2><p>Página preparada para calendário, serviços, horas disponíveis e confirmação.</p><button class="ai-cta" data-target="booking">Ver booking</button></section>
  <section class="ai-page" data-page-view="contact"><p class="ai-kicker">Contacto</p><h2>Fala connosco</h2><form class="ai-form"><input placeholder="Nome"/><input placeholder="Email ou telefone"/><textarea placeholder="Mensagem"></textarea><button type="button">Enviar</button></form></section>
</section>`;

  const css = `
.ai-pages-app{padding:90px 6vw;background:#f8fafc;color:#111827}.ai-pages-menu{position:sticky;top:74px;z-index:5;display:flex;gap:8px;flex-wrap:wrap;margin-bottom:28px;padding:10px;border:1px solid rgba(15,23,42,.1);border-radius:999px;background:rgba(255,255,255,.9);backdrop-filter:blur(14px)}.ai-page-link{border:0;border-radius:999px;background:transparent;color:#64748b;padding:11px 16px;font-weight:900;cursor:pointer}.ai-page-link.active{background:#111827!important;color:#fff!important}.ai-page{display:none;min-height:460px;border:1px solid rgba(15,23,42,.1);border-radius:34px;background:white;padding:44px;box-shadow:0 22px 70px rgba(15,23,42,.1)}.ai-page.active{display:block;animation:aiPageIn .25s ease}.ai-kicker{text-transform:uppercase;letter-spacing:.16em;font-size:12px;font-weight:900;color:#6366f1}.ai-page h2{font-size:clamp(34px,5vw,72px);line-height:.9;letter-spacing:-.07em;margin:0 0 18px}.ai-page p{font-size:18px;color:#64748b;line-height:1.7}.ai-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:26px}.ai-cards article{border:1px solid #e5e7eb;border-radius:24px;padding:22px;background:#f8fafc}.ai-gallery{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:24px}.ai-gallery span{height:190px;border-radius:24px;background:linear-gradient(135deg,#111827,#94a3b8)}.ai-form{display:grid;gap:12px;max-width:620px}.ai-form input,.ai-form textarea{border:1px solid #e5e7eb;border-radius:16px;padding:14px 16px;font:inherit}.ai-form textarea{min-height:130px}.ai-form button,.ai-cta{border:0;border-radius:999px;background:#111827;color:white;padding:14px 20px;font-weight:900;cursor:pointer}@keyframes aiPageIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@media(max-width:900px){.ai-pages-menu{border-radius:24px}.ai-cards,.ai-gallery{grid-template-columns:1fr}.ai-page{padding:28px}}`;

  const js = `
(function(){
  function showAiPage(page){
    document.querySelectorAll('.ai-page-link').forEach(function(button){button.classList.toggle('active',button.dataset.page===page)});
    document.querySelectorAll('.ai-page').forEach(function(section){section.classList.toggle('active',section.dataset.pageView===page)});
    if(location.hash !== '#'+page) history.replaceState(null,'','#'+page);
  }
  document.querySelectorAll('.ai-page-link').forEach(function(button){button.addEventListener('click',function(){showAiPage(button.dataset.page)})});
  var initial=(location.hash||'#home').replace('#','');
  if(document.querySelector('[data-page-view="'+initial+'"]')) showAiPage(initial);
})();`;

  const html = project.html.includes('</main>')
    ? project.html.replace('</main>', `${pagesHtml}\n</main>`)
    : project.html.replace('</body>', `${pagesHtml}\n</body>`);

  return { html, css: `${project.css}\n${css}`, js: `${project.js}\n${js}` };
}

function fallbackBooking(project: GeneratedProject): GeneratedProject {
  const htmlBlock = `<section id="booking" class="ai-booking-section"><h2>Marcações online</h2><p>Escolhe serviço, dia e hora.</p><select id="aiService"><option>Manicure Gel · 35€</option><option>Nail Art · 55€</option><option>Limpeza de Pele · 70€</option></select><div id="aiBookingDays" class="ai-booking-days"></div><div id="aiBookingHours" class="ai-booking-hours"></div><input id="aiBookingName" placeholder="Nome"/><input id="aiBookingContact" placeholder="Email ou telefone"/><button id="aiBookingConfirm" type="button">Confirmar marcação</button><p id="aiBookingResult"></p></section>`;
  const css = `.ai-booking-section{padding:80px 6vw;background:#fff7fb;color:#111827}.ai-booking-section h2{font-size:clamp(34px,5vw,64px);letter-spacing:-.06em}.ai-booking-section select,.ai-booking-section input{display:block;width:100%;max-width:560px;margin:10px 0;border:1px solid #e5e7eb;border-radius:16px;padding:14px}.ai-booking-days,.ai-booking-hours{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}.ai-booking-days button,.ai-booking-hours button,#aiBookingConfirm{border:0;border-radius:999px;background:#111827;color:white;padding:12px 16px;font-weight:900}.ai-booking-days button.active,.ai-booking-hours button.active{background:#db2777}`;
  const js = `(function(){var days=document.getElementById('aiBookingDays'),hours=document.getElementById('aiBookingHours'),result=document.getElementById('aiBookingResult'),name=document.getElementById('aiBookingName'),contact=document.getElementById('aiBookingContact'),confirm=document.getElementById('aiBookingConfirm');if(!days||!hours||!confirm)return;var d='',h='';['12','13','14','15','16','17'].forEach(function(day){var b=document.createElement('button');b.type='button';b.textContent=day+'/06';b.onclick=function(){d=b.textContent;document.querySelectorAll('#aiBookingDays button').forEach(function(x){x.classList.remove('active')});b.classList.add('active')};days.appendChild(b)});['10:00','12:00','15:30','17:00'].forEach(function(hour){var b=document.createElement('button');b.type='button';b.textContent=hour;b.onclick=function(){h=hour;document.querySelectorAll('#aiBookingHours button').forEach(function(x){x.classList.remove('active')});b.classList.add('active')};hours.appendChild(b)});confirm.onclick=function(){result.textContent=d&&h&&name.value&&contact.value?'Marcação confirmada para '+name.value+' em '+d+' às '+h:'Preenche nome, contacto, dia e hora.'}})();`;
  if (project.html.includes('ai-booking-section')) return { html: project.html, css: `${project.css}\n/* booking refreshed ${Date.now()} */`, js: project.js };
  const html = project.html.includes('</main>') ? project.html.replace('</main>', `${htmlBlock}\n</main>`) : project.html.replace('</body>', `${htmlBlock}\n</body>`);
  return { html, css: `${project.css}\n${css}`, js: `${project.js}\n${js}` };
}

function fallbackEdit(project: GeneratedProject, message: string): GeneratedProject {
  const lower = message.toLowerCase();
  if (hasAny(lower, ['pagina', 'página', 'paginas', 'páginas', 'menu', 'navegação', 'navegacao'])) return fallbackPages(project);
  if (hasAny(lower, ['booking', 'marcação', 'marcações', 'calendário', 'agenda', 'reservas'])) return fallbackBooking(project);
  if (hasAny(lower, ['preto', 'dark', 'escuro'])) return { ...project, css: `${project.css}\nbody{background:#050505!important;color:#f8fafc!important} header,.topbar{background:rgba(0,0,0,.85)!important;color:white!important}\n/* dark edit ${Date.now()} */` };
  if (hasAny(lower, ['rosa', 'pink'])) return { ...project, css: `${project.css}\nbutton,.primary,.nav-cta{background:#ec4899!important;color:white!important} h1,h2{color:#ec4899!important}\n/* pink edit ${Date.now()} */` };
  return { html: project.html.replace('</body>', `<div hidden data-ai-edit="${Date.now()}">${message.replace(/</g, '&lt;')}</div></body>`), css: `${project.css}\n/* edit ${Date.now()} */`, js: project.js };
}

function parseProject(text: string, currentProject: GeneratedProject, message: string) {
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  try {
    const parsed = JSON.parse(cleaned) as Partial<GeneratedProject>;
    if (parsed.html && parsed.css && parsed.js) {
      const next = { html: parsed.html, css: parsed.css, js: parsed.js };
      if (!sameProject(currentProject, next)) return { project: next, source: 'gemini-edit' };
    }
  } catch {}
  return { project: fallbackEdit(currentProject, message), source: 'fallback' };
}

function attachmentSummary(attachments: ChatAttachment[]) {
  return attachments?.length ? attachments.map((f) => `${f.name} (${f.type})`).join(', ') : 'Nenhum anexo.';
}

function inlineImageParts(attachments: ChatAttachment[]) {
  return (attachments || []).filter((f) => f.type?.startsWith('image/') && f.dataUrl?.includes(',')).slice(0, 4).map((f) => ({ inlineData: { mimeType: f.type, data: f.dataUrl?.split(',')[1] || '' } }));
}

async function callGemini(model: string, apiKey: string, instruction: string, attachments: ChatAttachment[]) {
  return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: instruction }, ...inlineImageParts(attachments)] }], generationConfig: { temperature: 0.45, maxOutputTokens: 14000, responseMimeType: 'application/json' } }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { project, message, chatHistory, attachments = [] } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!project?.html || !project?.css || !project?.js) return NextResponse.json({ error: 'Missing current project.' }, { status: 400 });
    if (!message || typeof message !== 'string') return NextResponse.json({ error: 'Missing edit message.' }, { status: 400 });
    if (!apiKey) return NextResponse.json({ project: fallbackEdit(project, message), source: 'fallback', error: 'GEMINI_API_KEY missing' });

    const instruction = `Edita este projeto vanilla HTML/CSS/JS. Responde só JSON válido com html, css e js.
Pedido: ${message}
Anexos: ${attachmentSummary(attachments)}
Histórico: ${JSON.stringify(chatHistory || []).slice(0, 5000)}

Projeto atual HTML:\n${project.html}\n\nCSS:\n${project.css}\n\nJS:\n${project.js}

Regras importantes:
- Não devolvas o projeto igual.
- Mantém o que não foi pedido.
- Se pedirem mais páginas ou menu entre páginas, cria SPA no mesmo index.html: botões data-page, secções data-page-view, JS para mostrar/esconder páginas e hash #home/#about/#services/#gallery/#booking/#contact. Não cries ficheiros separados.
- Se pedirem booking, cria calendário/reserva funcional em JS vanilla.
- Garante que menu, botões e formulários funcionam.`;

    const errors: string[] = [];
    for (const model of GEMINI_MODELS) {
      const response = await callGemini(model, apiKey, instruction, attachments);
      if (!response.ok) { errors.push(`${model}: ${await response.text()}`); continue; }
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('\n') || '';
      const parsed = parseProject(text, project, message);
      return NextResponse.json({ project: parsed.project, source: parsed.source, model });
    }
    return NextResponse.json({ project: fallbackEdit(project, message), source: 'fallback', error: errors.join('\n\n') });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
