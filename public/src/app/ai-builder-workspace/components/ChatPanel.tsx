'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Send, Cpu, User, Sparkles, RotateCcw, Copy, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { useChat } from '@/lib/hooks/useChat';
import type { FileState } from './WorkspaceLayout';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

interface ChatPanelProps {
  onGenerate: (files: Partial<FileState>) => void;
  isStreaming: boolean;
  setIsStreaming: (v: boolean) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-001',
    role: 'assistant',
    content: "Hi! I'm BuildAI. Describe the website you want to build and I'll generate the HTML, CSS and JavaScript for you instantly.",
    timestamp: '10:31 AM',
  },
];

const PROMPT_SUGGESTIONS = [
  'Modern SaaS landing page with hero and pricing',
  'Dark portfolio for a UI/UX designer',
  'E-commerce product page with cart',
  'Analytics dashboard with charts',
];

const SYSTEM_PROMPT = `You are BuildAI, an expert web developer AI. When the user describes a website, you MUST respond with ONLY a valid JSON object (no markdown, no explanation, no code fences) in this exact format:
{
  "message": "Brief description of what you built",
  "files": {
    "/index.html": "full HTML content here",
    "/style.css": "full CSS content here",
    "/script.js": "full JS content here"
  }
}

Rules:
- Always generate complete, production-quality HTML/CSS/JS
- Use modern dark themes with CSS variables
- Make it visually impressive and responsive
- index.html must link to style.css and script.js
- Return ONLY the JSON object, nothing else`;

function parseAIFiles(raw: string): { message: string; files: Partial<FileState> } | null {
  try {
    // Strip markdown code fences if present
    const cleaned = raw.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
    const parsed = JSON.parse(cleaned);
    if (parsed.files && typeof parsed.files === 'object') {
      return { message: parsed.message || 'Website generated!', files: parsed.files };
    }
    return null;
  } catch {
    return null;
  }
}

export default function ChatPanel({ onGenerate, isStreaming, setIsStreaming }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pendingPromptRef = useRef<string>('');

  const { response, isLoading, error, sendMessage } = useChat('GEMINI', 'gemini/gemini-2.5-flash', false);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
      setIsStreaming(false);
      setStreamingText('');
    }
  }, [error, setIsStreaming]);

  useEffect(() => {
    if (response && !isLoading && pendingPromptRef.current) {
      const parsed = parseAIFiles(response);

      let assistantContent: string;
      if (parsed) {
        assistantContent = parsed.message + '\n\n**Files updated:**\n- `index.html` — Full HTML structure\n- `style.css` — Modern dark theme with responsive layout\n- `script.js` — Interactive JavaScript\n\nThe preview updates automatically. Edit files in Monaco or ask me to change anything!';
        onGenerate(parsed.files);
        toast.success('Website generated successfully!');
      } else {
        assistantContent = response;
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setConversationHistory((prev) => [
        ...prev,
        { role: 'user', content: pendingPromptRef.current },
        { role: 'assistant', content: response },
      ]);
      pendingPromptRef.current = '';
      setStreamingText('');
      setIsStreaming(false);
    }
  }, [response, isLoading, onGenerate, setIsStreaming]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming || isLoading) return;

    const promptText = input.trim();

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);
    setStreamingText('Generating your website...');
    pendingPromptRef.current = promptText;

    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: promptText },
    ];

    sendMessage(apiMessages, { temperature: 0.7, max_tokens: 8192 });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
    setConversationHistory([]);
    pendingPromptRef.current = '';
    toast.info('Chat history cleared');
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
            <Sparkles size={12} className="text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">AI Chat</span>
          <span className="text-xs text-primary/70 font-medium">Gemini</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleReset} className="btn-ghost p-1.5" title="Clear chat">
            <RotateCcw size={13} />
          </button>
          <button className="btn-ghost p-1.5">
            <ChevronDown size={13} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}>
            {/* Avatar */}
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              msg.role === 'assistant' ? 'bg-primary/20' : 'bg-accent/20'
            }`}>
              {msg.role === 'assistant' ? (
                <Cpu size={12} className="text-primary" />
              ) : (
                <User size={12} className="text-accent" />
              )}
            </div>

            {/* Bubble */}
            <div className={`flex-1 ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
              <div className={`group relative inline-block max-w-full rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                msg.role === 'user' ?'bg-accent/15 text-foreground border border-accent/20' :'bg-muted/40 text-foreground border border-border'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <button
                  onClick={() => handleCopy(msg.content)}
                  className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-muted"
                >
                  <Copy size={10} className="text-muted-foreground" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1 px-1">{msg.timestamp}</p>
            </div>
          </div>
        ))}

        {/* Streaming indicator */}
        {(isStreaming || isLoading) && (
          <div className="flex gap-2.5 animate-fade-in">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Cpu size={12} className="text-primary" />
            </div>
            <div className="flex-1">
              {streamingText ? (
                <div className="bg-muted/40 border border-border rounded-xl px-3.5 py-2.5 text-xs leading-relaxed">
                  <p className="whitespace-pre-wrap">{streamingText}<span className="animate-blink ml-0.5 text-primary">|</span></p>
                </div>
              ) : (
                <div className="bg-muted/40 border border-border rounded-xl px-3.5 py-3 inline-flex items-center gap-1.5">
                  <span className="streaming-dot w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="streaming-dot w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="streaming-dot w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && !isStreaming && !isLoading && (
        <div className="px-4 pb-2 flex-shrink-0">
          <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
          <div className="space-y-1.5">
            {PROMPT_SUGGESTIONS.map((suggestion) => (
              <button
                key={`sugg-${suggestion.slice(0, 20).replace(/\s/g, '-')}`}
                onClick={() => { setInput(suggestion); inputRef.current?.focus(); }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs text-muted-foreground border border-border hover:border-primary/30 hover:text-foreground hover:bg-primary/5 transition-all duration-150"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="p-3 border-t border-border flex-shrink-0">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your website..."
            rows={3}
            disabled={isStreaming || isLoading}
            className="input-base resize-none pr-12 text-xs leading-relaxed scrollbar-thin disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming || isLoading}
            className="absolute right-2.5 bottom-2.5 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            style={{
              background: input.trim() && !isStreaming && !isLoading ? 'var(--primary)' : 'var(--muted)',
              color: input.trim() && !isStreaming && !isLoading ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
            }}
          >
            <Send size={13} />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}