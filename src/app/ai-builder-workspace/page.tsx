'use client';

import AppLayout from '@/components/AppLayout';
import { AlertTriangle, Eye, FileCode2, ImageIcon, Loader2, Paperclip, Send, Sparkles, X } from 'lucide-react';
import { ChangeEvent, useMemo, useRef, useState } from 'react';

type GeneratedProject = { html: string; css: string; js: string };
type ViewMode = 'preview' | 'html' | 'css' | 'js';
type ChatAttachment = { name: string; type: string; size: number; dataUrl?: string };
type ChatMessage = { role: 'user' | 'assistant'; content: string; attachments?: ChatAttachment[] };

function emptyProject(message = 'Pronto para criar um novo projeto'): GeneratedProject {
  return {
    html: `<!doctype html><html lang="pt"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Preview</title><link rel="stylesheet" href="style.css" /></head><body><main class="empty"><p>BuildAI</p><h1>${message}</h1><span>Escreve no chat o que queres criar ou alterar.</span></main><script src="script.js"></script></body></html>`,
    css: `body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0f172a;color:white;font-family:Arial,Helvetica,sans-serif}.empty{text-align:center;max-width:680px;padding:48px}p{color:#6ee7b7;font-weight:900;letter-spacing:.18em;text-transform:uppercase}h1{font-size:clamp(36px,6vw,72px);line-height:.95;letter-spacing:-.06em;margin:0 0 18px}span{color:#94a3b8;font-size:18px}`,
    js: '',
  };
}

function buildPreviewDocument(project: GeneratedProject) {
  const css = `<style>${project.css}</style>`;
  const safeJs = project.js.replace(/<\/script>/g, '<\\/script>');
  const guard = `<script>document.addEventListener('click',function(event){var target=event.target.closest&&event.target.closest('a');if(target){var href=target.getAttribute('href')||'';if(href.startsWith('#'))return;event.preventDefault();}},true);</script>`;
  const js = `${guard}<script>${safeJs}</script>`;
  const withCss = project.html.match(/<link[^>]*href=["']style\.css["'][^>]*>/i)
    ? project.html.replace(/<link[^>]*href=["']style\.css["'][^>]*>/i, css)
    : project.html.replace('</head>', `${css}</head>`);
  return withCss.match(/<script[^>]*src=["']script\.js["'][^>]*><\/script>/i)
    ? withCss.replace(/<script[^>]*src=["']script\.js["'][^>]*><\/script>/i, js)
    : withCss.replace('</body>', `${js}</body>`);
}

function readFileAsAttachment(file: File): Promise<ChatAttachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, type: file.type, size: file.size, dataUrl: typeof reader.result === 'string' ? reader.result : undefined });
    reader.onerror = () => reject(new Error(`Não consegui ler ${file.name}`));
    reader.readAsDataURL(file);
  });
}

export default function AiBuilderWorkspacePage() {
  const [message, setMessage] = useState('faz um portfolio premium para uma fotografa de casamentos em lisboa');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Diz-me que site queres criar. Depois podes continuar a conversa: mudar cores, trocar imagens, adicionar booking, melhorar secções, anexar fotos ou pedir ajustes específicos.' },
  ]);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [project, setProject] = useState<GeneratedProject>(() => emptyProject());
  const [view, setView] = useState<ViewMode>('preview');
  const [lastGeneratedAt, setLastGeneratedAt] = useState('');
  const [generationId, setGenerationId] = useState(0);
  const [isWorking, setIsWorking] = useState(false);
  const [isReadingFiles, setIsReadingFiles] = useState(false);
  const [source, setSource] = useState<'initial' | 'gemini' | 'fallback' | 'template' | 'gemini-edit'>('initial');
  const [errorMessage, setErrorMessage] = useState('');
  const [geminiError, setGeminiError] = useState('');
  const [hasProject, setHasProject] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const previewHtml = useMemo(() => buildPreviewDocument(project), [project]);

  async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setIsReadingFiles(true);
    setErrorMessage('');
    try {
      const accepted = files.slice(0, 6).filter((file) => file.size <= 4 * 1024 * 1024);
      const rejected = files.filter((file) => file.size > 4 * 1024 * 1024);
      const nextAttachments = await Promise.all(accepted.map(readFileAsAttachment));
      setAttachments((current) => [...current, ...nextAttachments].slice(0, 8));
      if (rejected.length) setErrorMessage('Alguns ficheiros foram ignorados porque têm mais de 4MB.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao carregar ficheiros.');
    } finally {
      setIsReadingFiles(false);
      event.target.value = '';
    }
  }

  function removeAttachment(index: number) {
    setAttachments((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  async function handleSend() {
    const cleanMessage = message.trim();
    if ((!cleanMessage && attachments.length === 0) || isWorking || isReadingFiles) return;
    const messageText = cleanMessage || 'Usa os anexos enviados como referência para melhorar o projeto.';
    const sentAttachments = attachments;
    const nextHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: messageText, attachments: sentAttachments }];
    setChatHistory(nextHistory);
    setMessage('');
    setAttachments([]);
    setIsWorking(true);
    setErrorMessage('');
    setGeminiError('');
    setView('preview');
    try {
      const endpoint = hasProject ? '/api/edit-project' : '/api/generate-site';
      const body = hasProject ? { project, message: messageText, chatHistory: nextHistory, attachments: sentAttachments } : { prompt: messageText, referenceUrl };
      if (!hasProject) {
        setProject(emptyProject('A criar o teu website...'));
        setGenerationId((current) => current + 1);
      }
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await response.json();
      if (!data?.project?.html || !data?.project?.css || !data?.project?.js) throw new Error(data?.error || 'A IA não devolveu os ficheiros esperados.');
      setProject(data.project);
      setSource(data.source || (hasProject ? 'gemini-edit' : 'gemini'));
      setGeminiError(data.error ? String(data.error) : '');
      setGenerationId((current) => current + 1);
      setLastGeneratedAt(new Date().toLocaleTimeString('pt-PT'));
      setHasProject(true);
      setChatHistory([...nextHistory, { role: 'assistant', content: hasProject ? 'Alteração aplicada. Podes continuar a pedir ajustes.' : 'Projeto inicial criado. Agora podes continuar a conversa e pedir alterações.' }]);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao processar pedido.');
      setChatHistory([...nextHistory, { role: 'assistant', content: 'Não consegui aplicar o pedido. Vê o erro abaixo e tenta novamente.' }]);
    } finally {
      setIsWorking(false);
    }
  }

  function handleReset() {
    setProject(emptyProject());
    setHasProject(false);
    setSource('initial');
    setAttachments([]);
    setGeminiError('');
    setErrorMessage('');
    setLastGeneratedAt('');
    setGenerationId((current) => current + 1);
    setChatHistory([{ role: 'assistant', content: 'Projeto reiniciado. Diz-me o que queres criar.' }]);
  }

  const currentCode = view === 'html' ? project.html : view === 'css' ? project.css : project.js;
  const currentFilename = view === 'html' ? 'index.html' : view === 'css' ? 'style.css' : 'script.js';

  return (
    <AppLayout fullHeight>
      <div className="h-[calc(100vh-3.5rem)] grid grid-cols-1 xl:grid-cols-[620px_1fr] lg:grid-cols-[560px_1fr] overflow-hidden">
        <aside className="border-r border-border bg-card/70 overflow-hidden flex flex-col min-h-0">
          <div className="border-b border-border p-5 shrink-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 badge-green mb-3 w-fit"><Sparkles size={14} /> AI Agent Chat</div>
                <h1 className="text-2xl font-semibold text-foreground mb-1">Conversa com o agente</h1>
                <p className="text-sm text-muted-foreground">Histórico completo, anexos e espaço para continuar a criação do site passo a passo.</p>
              </div>
              <button onClick={handleReset} className="btn-secondary px-3 shrink-0">Reset</button>
            </div>
            <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
              <input value={referenceUrl} onChange={(e) => setReferenceUrl(e.target.value)} disabled={hasProject} className="w-full rounded-lg border border-border bg-[#0f172a] px-3 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50" placeholder="Link de inspiração opcional" />
              <div className="rounded-lg border border-border bg-background/60 px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">Fonte: <strong className="text-foreground">{source}</strong></div>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4 bg-background/30">
            {chatHistory.map((chat, index) => (
              <div key={index} className={chat.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div className={chat.role === 'user' ? 'max-w-[82%] rounded-2xl bg-primary/20 border border-primary/30 p-4 text-sm text-foreground shadow-sm' : 'max-w-[86%] rounded-2xl bg-card border border-border p-4 text-sm text-muted-foreground shadow-sm'}>
                  <div className="text-[10px] uppercase tracking-wider mb-1 opacity-70">{chat.role === 'user' ? 'Tu' : 'Agente'}</div>
                  <div className="whitespace-pre-wrap leading-relaxed">{chat.content}</div>
                  {!!chat.attachments?.length && <div className="mt-3 flex flex-wrap gap-2">{chat.attachments.map((file, fileIndex) => <span key={fileIndex} className="rounded-full bg-background/80 border border-border px-2 py-1 text-[10px]">{file.type?.startsWith('image/') ? 'Imagem' : 'Ficheiro'} · {file.name}</span>)}</div>}
                </div>
              </div>
            ))}
            {isWorking && <div className="flex justify-start"><div className="rounded-2xl bg-card border border-border p-4 text-sm text-muted-foreground flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> A trabalhar no projeto...</div></div>}
          </div>

          <div className="border-t border-border p-4 bg-card/90 shrink-0">
            {!!attachments.length && <div className="mb-3 grid grid-cols-4 gap-2">{attachments.map((file, index) => <div key={`${file.name}-${index}`} className="relative rounded-lg border border-border bg-background/70 p-2 text-xs text-muted-foreground overflow-hidden">{file.type.startsWith('image/') && file.dataUrl ? <img src={file.dataUrl} alt={file.name} className="h-16 w-full rounded-md object-cover mb-1" /> : <div className="h-16 rounded-md bg-muted/20 grid place-items-center mb-1"><FileCode2 size={18} /></div>}<button onClick={() => removeAttachment(index)} className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white"><X size={11} /></button><div className="truncate">{file.name}</div></div>)}</div>}

            <textarea value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSend(); }} className="w-full min-h-28 max-h-44 resize-y rounded-xl border border-border bg-[#0f172a] px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder={hasProject ? 'Continua a conversa: adiciona booking, muda cores, usa estas fotos, melhora o hero...' : 'Ex: faz um site premium para estética com calendário de marcações'} />

            <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.txt,.doc,.docx" onChange={handleFiles} className="hidden" />
            <div className="mt-3 grid grid-cols-[auto_1fr] gap-2">
              <button onClick={() => fileInputRef.current?.click()} disabled={isReadingFiles || isWorking} className="btn-secondary px-4 disabled:opacity-60">{isReadingFiles ? <Loader2 size={16} className="animate-spin" /> : <Paperclip size={16} />}</button>
              <button onClick={handleSend} disabled={isWorking || isReadingFiles || (!message.trim() && attachments.length === 0)} className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"><Send size={16} /> {hasProject ? 'Enviar alteração' : 'Criar website'}</button>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground"><ImageIcon size={13} /> Ctrl+Enter envia · até 8 ficheiros, máx. 4MB cada</div>
            {errorMessage && <div className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200">{errorMessage}</div>}
            {geminiError && <div className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-100"><div className="flex items-center gap-2 font-semibold text-amber-200 mb-2"><AlertTriangle size={14} /> Gemini error</div><pre className="max-h-28 overflow-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed">{geminiError}</pre></div>}
          </div>
        </aside>

        <main className="bg-background p-4 overflow-hidden flex flex-col min-h-0">
          <div className="mb-3 flex items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-muted-foreground">{lastGeneratedAt ? `Atualizado às ${lastGeneratedAt}` : 'Preview em tempo real'}</div>
            <div className="grid grid-cols-4 gap-2 w-fit">
              <button onClick={() => setView('preview')} className={view === 'preview' ? 'btn-primary' : 'btn-secondary'}><Eye size={16} /></button>
              <button onClick={() => setView('html')} className={view === 'html' ? 'btn-primary' : 'btn-secondary'}>HTML</button>
              <button onClick={() => setView('css')} className={view === 'css' ? 'btn-primary' : 'btn-secondary'}>CSS</button>
              <button onClick={() => setView('js')} className={view === 'js' ? 'btn-primary' : 'btn-secondary'}>JS</button>
            </div>
          </div>
          {view === 'preview' ? (
            <iframe key={`${generationId}-${source}`} title="Live website preview" srcDoc={previewHtml} sandbox="allow-scripts allow-forms allow-same-origin" className="w-full flex-1 rounded-2xl bg-white border border-border" />
          ) : (
            <div className="w-full flex-1 rounded-2xl border border-border bg-black/40 overflow-hidden flex flex-col">
              <div className="border-b border-border px-4 py-2 text-xs text-muted-foreground flex items-center gap-2"><FileCode2 size={14} />{currentFilename}</div>
              <pre className="flex-1 overflow-auto p-4 text-xs text-foreground whitespace-pre-wrap">{currentCode}</pre>
            </div>
          )}
        </main>
      </div>
    </AppLayout>
  );
}
