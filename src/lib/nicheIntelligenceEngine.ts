export type Niche = 'trading' | 'photography' | 'beauty' | 'technology';

export type NicheIntel = {
  niche: Niche;
  sub: string;
  accent: string;
  accent2: string;
  glow: string;
  brand: string;
  confidence: number;
  signals: string[];
};

const normalize = (value = '') => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function score(text: string, terms: string[]) {
  const found = terms.filter((term) => text.includes(normalize(term)));
  return { points: found.length, found };
}

export function analyzeNiche(prompt: string, referenceUrl = ''): NicheIntel {
  const text = normalize(`${prompt} ${referenceUrl}`);

  const photography = score(text, [
    'fotografa', 'fotografo', 'fotografia', 'portfolio', 'casamento', 'casamentos', 'wedding', 'weddings',
    'ensaio', 'sessao', 'editorial', 'galeria', 'gallery', 'photography', 'photographer', 'portrait',
    'retrato', 'eventos', 'event photographer', 'destination wedding', 'lisboa wedding'
  ]);

  const beauty = score(text, [
    'nails', 'unhas', 'estetica', 'esteticista', 'cabeleireiro', 'cabeleireira', 'barbeiro', 'barbearia',
    'spa', 'clinica estetica', 'beleza', 'beauty', 'hair', 'salon', 'lashes', 'sobrancelhas', 'laser', 'facial'
  ]);

  const trading = score(text, [
    'prop firm', 'propfirm', 'funded', 'challenge', 'copy trading', 'copytrade', 'forex', 'trading',
    'trader', 'payout', 'drawdown', 'nas100', 'eurusd', 'xauusd', 'fintech', 'broker', 'signals'
  ]);

  const technology = score(text, [
    'saas', 'software', 'ai', 'ia', 'automation', 'automacao', 'crm', 'dashboard', 'startup',
    'api', 'workflow', 'analytics', 'platform', 'app', 'produto digital'
  ]);

  const weighted = [
    { niche: 'photography' as const, score: photography.points + (text.includes('casamento') ? 3 : 0) + (text.includes('portfolio') ? 2 : 0), signals: photography.found },
    { niche: 'beauty' as const, score: beauty.points, signals: beauty.found },
    { niche: 'trading' as const, score: trading.points + (text.includes('prop firm') ? 3 : 0) + (text.includes('copy trading') ? 3 : 0), signals: trading.found },
    { niche: 'technology' as const, score: technology.points, signals: technology.found },
  ].sort((a, b) => b.score - a.score);

  const winner = weighted[0];

  if (winner.niche === 'photography' && winner.score > 0) {
    return { niche: 'photography', sub: text.includes('casamento') || text.includes('wedding') ? 'luxury wedding photography portfolio' : 'editorial photography portfolio', brand: 'Luz & Voto Studio', accent: '#d6a35f', accent2: '#fff1d6', glow: 'rgba(214,163,95,.26)', confidence: winner.score, signals: winner.signals };
  }

  if (winner.niche === 'beauty' && winner.score > 0) {
    return { niche: 'beauty', sub: 'beauty booking studio', brand: 'Aura Beauty Lab', accent: '#ec4899', accent2: '#f9a8d4', glow: 'rgba(236,72,153,.26)', confidence: winner.score, signals: winner.signals };
  }

  if (winner.niche === 'trading' && winner.score > 0) {
    const isCopy = text.includes('copy trading') || text.includes('copytrade');
    return { niche: 'trading', sub: isCopy ? 'copy trading platform' : 'funded trader platform', brand: isCopy ? 'CopyEdge Capital' : 'ApexFunded', accent: '#22c55e', accent2: '#38bdf8', glow: 'rgba(34,197,94,.28)', confidence: winner.score, signals: winner.signals };
  }

  return { niche: 'technology', sub: 'AI SaaS platform', brand: 'Nexora AI', accent: '#8b5cf6', accent2: '#06b6d4', glow: 'rgba(139,92,246,.26)', confidence: winner.score, signals: winner.signals };
}
