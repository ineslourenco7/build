type ImageNiche = 'trading' | 'photography' | 'beauty' | 'technology';

type ImagePromptSet = {
  hero: string;
  showcase: string;
  background: string;
  mockup: string;
};

export function imagePromptSet(niche: ImageNiche, sub = ''): ImagePromptSet {
  if (niche === 'photography') {
    return {
      hero: 'cinematic editorial photography portfolio hero image, luxury wedding and fashion photography atmosphere, warm film tones, dramatic natural light, refined composition, premium website hero, no text, no logo, 16:9',
      showcase: 'high-end photography gallery mosaic, editorial portraits, wedding details, soft grain, museum-like spacing, luxury visual storytelling, no text, no logo, 16:9',
      background: 'abstract dark editorial studio background, warm shadows, subtle film grain, premium photography website texture, no text, no logo',
      mockup: 'private client gallery interface on elegant laptop screen, photography delivery dashboard, warm neutral palette, premium UI mockup, no readable text, 16:9',
    };
  }

  if (niche === 'beauty') {
    return {
      hero: 'luxury beauty clinic website hero image, soft skincare textures, elegant treatment room, champagne and blush tones, minimal premium aesthetic, no text, no logo, 16:9',
      showcase: 'premium beauty booking app mockup, appointment calendar, service cards, soft glass UI, blush pink luxury palette, no readable text, no logo, 16:9',
      background: 'soft luxury beauty background, silk texture, cosmetic reflections, warm studio light, minimal high-end spa feeling, no text',
      mockup: 'smartphone beauty booking interface mockup, calendar slots, service selection, elegant rounded UI, no readable text, no logo, 16:9',
    };
  }

  if (niche === 'trading') {
    const copyTrading = sub.includes('copy');
    return {
      hero: `${copyTrading ? 'copy trading platform' : 'funded trader prop firm'} cinematic fintech dashboard hero, dark institutional interface, emerald glow, live performance metrics, risk panels, premium SaaS product render, no readable text, no logo, 16:9`,
      showcase: 'advanced trading terminal UI mockup, equity curve, risk dashboard, position cards, dark glassmorphism, institutional fintech design, emerald and cyan accents, no readable text, no logo, 16:9',
      background: 'dark fintech abstract background, trading chart lines, subtle grid, emerald glow, premium financial product atmosphere, no text, no logo',
      mockup: 'multi-screen fintech product mockup, trader dashboard on laptop and mobile, dark mode, glass cards, premium prop firm platform, no readable text, 16:9',
    };
  }

  return {
    hero: 'premium AI SaaS product hero render, dark glassmorphism dashboard, workflow automation nodes, violet and cyan glow, modern startup website, no readable text, no logo, 16:9',
    showcase: 'AI automation dashboard mockup, workflow builder canvas, analytics cards, CRM sync panels, premium SaaS interface, no readable text, no logo, 16:9',
    background: 'abstract AI technology background, flowing gradient mesh, subtle grid, violet cyan light, premium SaaS atmosphere, no text',
    mockup: 'multi-device SaaS application mockup, dashboard on laptop and mobile, automation workflow UI, dark premium design, no readable text, 16:9',
  };
}

export function imagePromptMeta(niche: ImageNiche, sub = '') {
  const prompts = imagePromptSet(niche, sub);
  return {
    imagePrompts: prompts,
    imagePromptList: [prompts.hero, prompts.showcase, prompts.background, prompts.mockup],
  };
}
