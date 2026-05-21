type Niche = 'trading' | 'photography' | 'beauty' | 'technology';

type QualityResult = {
  ok: boolean;
  score: number;
  reasons: string[];
};

const forbiddenText = [
  'gerado para:',
  'site criado para:',
  'visual system',
  'asset engine',
  'motion engine',
  'app engine',
  'component system',
  'ai builder',
  'template',
  'lorem ipsum',
];

const nicheSignals: Record<Niche, string[]> = {
  trading: ['risk', 'trader', 'equity', 'payout', 'dashboard', 'performance', 'funded', 'copy', 'signal', 'challenge'],
  photography: ['portfolio', 'gallery', 'galeria', 'editorial', 'fotografia', 'sessao', 'sessão', 'casamento', 'portrait', 'story'],
  beauty: ['agenda', 'booking', 'marcacao', 'marcação', 'servico', 'serviço', 'cliente', 'beauty', 'estetica', 'estética', 'tratamento', 'spa'],
  technology: ['dashboard', 'workflow', 'automation', 'analytics', 'saas', 'client', 'crm', 'ai', 'produto'],
};

function countMatches(text: string, terms: string[]) {
  return terms.reduce((total, term) => total + (text.includes(term.toLowerCase()) ? 1 : 0), 0);
}

export function checkGenerationQuality(project: { html: string; css: string; js: string }, niche: Niche): QualityResult {
  const html = project.html || '';
  const css = project.css || '';
  const js = project.js || '';
  const combined = `${html}\n${css}\n${js}`.toLowerCase();
  const reasons: string[] = [];
  let score = 100;

  for (const forbidden of forbiddenText) {
    if (combined.includes(forbidden)) {
      score -= 18;
      reasons.push(`forbidden:${forbidden}`);
    }
  }

  const sectionCount = (html.match(/<section/gi) || []).length;
  if (sectionCount < 4) {
    score -= 25;
    reasons.push('too-few-sections');
  }

  if (!html.includes('<nav') && !html.includes('data-target')) {
    score -= 12;
    reasons.push('weak-navigation');
  }

  if (html.length < 2500) {
    score -= 22;
    reasons.push('html-too-short');
  }

  if (css.length < 2500) {
    score -= 18;
    reasons.push('css-too-short');
  }

  if (!combined.includes('reveal') && !combined.includes('animatedborder')) {
    score -= 10;
    reasons.push('missing-motion-hooks');
  }

  const signalCount = countMatches(combined, nicheSignals[niche]);
  if (signalCount < 3) {
    score -= 20;
    reasons.push('weak-niche-specificity');
  }

  if (combined.includes('unhas') && niche === 'photography') {
    score -= 40;
    reasons.push('wrong-niche-beauty-in-photography');
  }

  if ((combined.includes('forex') || combined.includes('trader')) && (niche === 'beauty' || niche === 'photography')) {
    score -= 35;
    reasons.push('wrong-niche-trading-leak');
  }

  return {
    ok: score >= 70,
    score,
    reasons,
  };
}
