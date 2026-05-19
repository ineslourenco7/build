'use client';

import AppLayout from '@/components/AppLayout';
import { AlertTriangle, Code2, Eye, FileCode2, Loader2, Send, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';

type GeneratedProject = { html: string; css: string; js: string };
type ViewMode = 'preview' | 'html' | 'css' | 'js';
type ChatMessage = { role: 'user' | 'assistant'; content: string };

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

export default function AiBuilderWorkspacePage() {
  const [message, setMessage] = useState('faz um portfolio premium para uma fotografa de casamentos em lisboa');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Diz-me que site queres criar. Depois podes pedir alterações como num chat: mudar cores, trocar imagens, adicionar secções, simplificar o hero, etc.' },
  ]);
  const [project, setProject] = useState<GeneratedProject>(() => emptyProject());
  const [view, setView] = useState<ViewMode>('preview');
  const [lastGeneratedAt, setLastGeneratedAt] = useState('');
  const [generationId, setGenerationId] = useState(0);
  const [isWorking, setIsWorking] = useState(false);
  const [source, setSource] = useState<'initial' | 'gemini' | 'fallback' | 'template' | 'gemini-edit'>('initial');
  const [errorMessage, setErrorMessage] = useState('');
  const [geminiError, setGeminiError] = useState('');
  const [hasProject, setHasProject] = useState(false);

  const previewHtml = useMemo(() => buildPreviewDocument(project), [project]);

  async function handleSend() {
    const cleanMessage = message.trim();
    if (!cleanMessage || isWorking) return;

    const nextHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: cleanMessage }];
    setChatHistory(nextHistory);
    setMessage('');
    setIsWorking(true);
    setErrorMessage('');
    setGeminiError('');
    setView('preview');

    try {
      const endpoint = hasProject ? '/api/edit-project' : '/api/generate-site';
      const body = hasProject
        ? { project, message: cleanMessage, chatHistory: nextHistory }
        : { prompt: cleanMessage, referenceUrl };

      if (!hasProject) {
        setProject(emptyProject('A criar o teu website...'));
        setGenerationId((current) => current + 1);
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!data?.project?.html || !data?.project?.css || !data?.project?.js) {
        throw new Error(data?.error || 'A IA não devolveu os ficheiros esperados.');
      }

      setProject(data.project);
      setSource(data.source || (hasProject ? 'gemini-edit' : 'gemini'));
      setGeminiError(data.error ? String(data.error) : '');
      setGenerationId((current) => current + 1);
      setLastGeneratedAt(new Date().toLocaleTimeString('pt-PT'));
      setHasProject(true);
      setChatHistory([
        ...nextHistory,
        { role: 'assistant', content: hasProject ? 'Alteração aplicada ao projeto atual.' : 'Projeto inicial criado. Agora podes pedir alterações no chat.' },
      ]);
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
      <div className="h-[calc(100vh-3.5rem)] grid grid-cols-1 lg:grid-cols-[430px_1fr] overflow-hidden">
        <aside className="border-r border-border bg-card/70 p-5 overflow-hidden flex flex-col">
          <div className="inline-flex items-center gap-2 badge-green mb-4 w-fit"><Sparkles size={14} /> AI Website Chat</div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Constrói e edita por chat</h1>
          <p className="text-sm text-muted-foreground mb-4">Primeiro pedido cria o site. Depois cada mensagem altera o projeto atual sem começar do zero.</p>

          <label className="text-sm font-medium text-foreground mb-2 block">Link de inspiração opcional</label>
          <input value={referenceUrl} onChange={(e) => setReferenceUrl(e.target.value)} disabled={hasProject} className="w-full mb-4 rounded-lg border border-border bg-[#0f172a] px-3 py-3 text-sm text-white placeholder:text-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50" placeholder="https://exemplo.com" />

          <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-background/50 p-3 mb-4 space-y-3">
            {chatHistory.map((chat, index) => (
              <div key={index} className={chat.role === 'user' ? 'ml-8 rounded-2xl bg-primary/20 border border-primary/30 p-3 text-sm text-foreground' : 'mr-8 rounded-2xl bg-muted/20 border border-border p-3 text-sm text-muted-foreground'}>
                <div className="text-[10px] uppercase tracking-wider mb-1 opacity-70">{chat.role === 'user' ? 'Tu' : 'AI'}</div>
                {chat.content}
              </div>
            ))}
            {isWorking && <div className="mr-8 rounded-2xl bg-muted/20 border border-border p-3 text-sm text-muted-foreground flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> A trabalhar no projeto...</div>}
          </div>

          <textarea value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSend(); }} className="w-full min-h-24 resize-none mb-3 rounded-lg border border-border bg-[#0f172a] px-3 py-3 text-sm text-white placeholder:text-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder={hasProject ? 'Ex: deixa o hero mais minimalista e troca a paleta para preto e dourado' : 'Ex: faz um portfolio premium para uma fotógrafa de casamentos'} />

          <div className="grid grid-cols-[1fr_auto] gap-2 mb-3">
            <button onClick={handleSend} disabled={isWorking || !message.trim()} className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"><Send size={16} /> {hasProject ? 'Apply Changes' : 'Create Website'}</button>
            <button onClick={handleReset} className="btn-secondary px-3">Reset</button>
          </div>

          {errorMessage && <div className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200">{errorMessage}</div>}

          <div className="mb-3 rounded-lg border border-border bg-background/60 p-3 text-xs text-muted-foreground">
            {lastGeneratedAt && <p>Atualizado às {lastGeneratedAt}</p>}
            <p><strong className="text-foreground">Fonte:</strong> {source}</p>
          </div>

          {geminiError && <div className="mb-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-100"><div className="flex items-center gap-2 font-semibold text-amber-200 mb-2"><AlertTriangle size={14} /> Gemini error</div><pre className="max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed">{geminiError}</pre></div>}

          <div className="grid grid-cols-4 gap-2">
            <button onClick={() => setView('preview')} className={view === 'preview' ? 'btn-primary' : 'btn-secondary'}><Eye size={16} /></button>
            <button onClick={() => setView('html')} className={view === 'html' ? 'btn-primary' : 'btn-secondary'}>HTML</button>
            <button onClick={() => setView('css')} className={view === 'css' ? 'btn-primary' : 'btn-secondary'}>CSS</button>
            <button onClick={() => setView('js')} className={view === 'js' ? 'btn-primary' : 'btn-secondary'}>JS</button>
          </div>
        </aside>

        <main className="bg-background p-4 overflow-hidden">
          {view === 'preview' ? (
            <iframe key={`${generationId}-${source}`} title="Live website preview" srcDoc={previewHtml} sandbox="allow-scripts allow-forms allow-same-origin" className="w-full h-full rounded-2xl bg-white border border-border" />
          ) : (
            <div className="w-full h-full rounded-2xl border border-border bg-black/40 overflow-hidden flex flex-col">
              <div className="border-b border-border px-4 py-2 text-xs text-muted-foreground flex items-center gap-2"><FileCode2 size={14} />{currentFilename}</div>
              <pre className="flex-1 overflow-auto p-4 text-xs text-foreground whitespace-pre-wrap">{currentCode}</pre>
            </div>
          )}
        </main>
      </div>
    </AppLayout>
  );
}
