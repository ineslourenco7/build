type AssetNiche = 'trading' | 'photography' | 'beauty' | 'technology';

const imageSets = {
  photography: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
  ],
  beauty: [
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80',
  ],
  trading: [
    'https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=900&q=80',
  ],
  technology: [
    'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
  ],
};

export function premiumAssetSection(niche: AssetNiche, sub = '') {
  if (niche === 'photography') {
    const imgs = imageSets.photography;
    return `<section id="showcase" class="assetShowcase sectionTransition"><div class="sectionHead reveal"><p class="eyebrow">Experiência visual</p><h2>Galerias com presença editorial.</h2><p>Uma composição visual com histórias, coleções e entregas privadas para elevar a perceção do trabalho fotográfico.</p></div><div class="photoShowcase reveal parallaxLayer animatedBorder" data-parallax="0.05"><article class="photoLarge floatAsset imageTile" style="--asset:url('${imgs[0]}')"><span>01</span><b>Wedding story</b></article><article class="imageTile" style="--asset:url('${imgs[1]}')"><span>02</span><b>Editorial portrait</b></article><article class="imageTile" style="--asset:url('${imgs[2]}')"><span>03</span><b>Brand campaign</b></article><article class="imageTile" style="--asset:url('${imgs[3]}')"><span>04</span><b>Private gallery</b></article></div></section>`;
  }

  if (niche === 'beauty') {
    const imgs = imageSets.beauty;
    return `<section id="showcase" class="assetShowcase sectionTransition"><div class="sectionHead reveal"><p class="eyebrow">Reserva online</p><h2>Uma experiência de marcação simples e elegante.</h2><p>Serviços, disponibilidade, cliente e confirmação organizados para transformar interesse em reserva.</p></div><div class="beautyShowcase reveal parallaxLayer animatedBorder" data-parallax="0.05"><div class="beautyImage imageTile floatAsset" style="--asset:url('${imgs[0]}')"></div><div class="deviceCard floatAsset"><b>Agenda de hoje</b><p>14:30 · Serviço Premium</p><p>16:00 · Consulta inicial</p><p>18:00 · Cliente recorrente</p><button class="magnetic">Confirmar reserva</button></div><div class="serviceStack"><article class="imageTile" style="--asset:url('${imgs[1]}')"><span>Popular</span><b>Tratamento Glow</b><em>75 min</em></article><article class="imageTile" style="--asset:url('${imgs[2]}')"><span>VIP</span><b>Plano mensal</b><em>4 sessões</em></article></div></div></section>`;
  }

  if (niche === 'trading') {
    const isCopy = sub.includes('copy');
    const imgs = imageSets.trading;
    return `<section id="showcase" class="assetShowcase sectionTransition"><div class="sectionHead reveal"><p class="eyebrow">${isCopy ? 'Performance' : 'Trader workspace'}</p><h2>${isCopy ? 'Estratégias, risco e execução num painel credível.' : 'Challenges, regras e payouts com visual institucional.'}</h2><p>Uma área visual com dados, sinais, risco e atividade para transmitir confiança antes da conversão.</p></div><div class="tradingShowcase reveal parallaxLayer animatedBorder" data-parallax="0.05"><div class="terminalPanel"><div class="terminalHeader"><i></i><i></i><i></i><span>${isCopy ? 'copy-signal/live' : 'funded-risk/live'}</span></div><div class="signalRows"><p><b>EURUSD</b><span>Long · +2.4R</span></p><p><b>NAS100</b><span>Risk 0.8%</span></p><p><b>BTCUSD</b><span>Trailing active</span></p></div></div><div class="tradingImage imageTile" style="--asset:url('${imgs[0]}')"></div><div class="floatingMetrics"><article class="floatAsset"><small>Risk</small><strong>A+</strong></article><article class="floatAsset"><small>Equity</small><strong>$184k</strong></article><article class="floatAsset imageTile" style="--asset:url('${imgs[1]}')"><small>Payout</small><strong>€28k</strong></article></div></div></section>`;
  }

  const imgs = imageSets.technology;
  return `<section id="showcase" class="assetShowcase sectionTransition"><div class="sectionHead reveal"><p class="eyebrow">Produto em ação</p><h2>Dashboards e automações com aparência de software real.</h2><p>Interfaces, fluxos e métricas organizados para mostrar como a plataforma funciona no dia a dia.</p></div><div class="saasShowcase reveal parallaxLayer animatedBorder" data-parallax="0.05"><div class="saasImage imageTile floatAsset" style="--asset:url('${imgs[0]}')"></div><div class="workflowCanvas"><article><span>01</span><b>Capture lead</b></article><article><span>02</span><b>Run AI workflow</b></article><article><span>03</span><b>Sync CRM</b></article><article><span>04</span><b>Notify team</b></article></div><div class="insightCard imageTile floatAsset" style="--asset:url('${imgs[1]}')"><small>Automation health</small><strong>94%</strong><p>1.8M tasks processed this month</p></div></div></section>`;
}

export function premiumAssetCss() {
  return `.assetShowcase{padding:110px 5vw}.photoShowcase,.beautyShowcase,.tradingShowcase,.saasShowcase{border:1px solid var(--line);border-radius:38px;background:linear-gradient(180deg,var(--panel2),rgba(255,255,255,.035));box-shadow:0 34px 100px rgba(0,0,0,.45);padding:22px;position:relative;overflow:hidden}.imageTile{position:relative;overflow:hidden;background-image:linear-gradient(180deg,rgba(0,0,0,.08),rgba(0,0,0,.74)),var(--asset);background-size:cover;background-position:center}.imageTile:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 20% 10%,var(--glow),transparent 42%);opacity:.55;pointer-events:none}.imageTile>*{position:relative;z-index:1}.photoShowcase{display:grid;grid-template-columns:1.2fr .8fr .8fr;grid-auto-rows:210px;gap:16px}.photoShowcase article{border-radius:30px;padding:22px;display:flex;flex-direction:column;justify-content:space-between;min-height:210px}.photoShowcase .photoLarge{grid-row:span 2}.photoShowcase span,.serviceStack span,.workflowCanvas span{color:rgba(255,255,255,.72);font-size:12px;letter-spacing:.16em;text-transform:uppercase}.photoShowcase b,.serviceStack b,.workflowCanvas b{color:var(--text);font-size:22px}.beautyShowcase{display:grid;grid-template-columns:.9fr .9fr 1fr;gap:20px}.beautyImage{min-height:420px;border-radius:34px}.deviceCard{border:1px solid var(--line);border-radius:34px;background:rgba(255,255,255,.075);padding:26px}.deviceCard b{font-size:28px;color:var(--text)}.deviceCard p{border-bottom:1px solid var(--line);padding:12px 0;margin:0}.deviceCard button{margin-top:18px;border:0;border-radius:999px;background:linear-gradient(135deg,var(--accent),var(--accent2));padding:13px 18px;font-weight:950;color:#030712}.serviceStack{display:grid;gap:14px}.serviceStack article,.workflowCanvas article,.floatingMetrics article,.insightCard{border:1px solid var(--line);border-radius:26px;background:var(--panel);padding:20px;backdrop-filter:blur(12px)}.serviceStack em{display:block;color:var(--accent);font-style:normal;font-weight:900;margin-top:8px}.tradingShowcase{display:grid;grid-template-columns:1.15fr .85fr .7fr;gap:20px}.tradingImage{border-radius:30px;min-height:360px}.terminalPanel{border:1px solid var(--line);border-radius:30px;background:rgba(0,0,0,.42);padding:22px;min-height:360px}.terminalHeader{display:flex;gap:8px;align-items:center;border-bottom:1px solid var(--line);padding-bottom:14px;margin-bottom:18px}.terminalHeader i{width:10px;height:10px;border-radius:99px;background:var(--accent)}.terminalHeader span{margin-left:auto;font-size:12px;text-transform:uppercase;letter-spacing:.14em}.signalRows{display:grid;gap:12px}.signalRows p{display:flex;justify-content:space-between;border:1px solid var(--line);border-radius:18px;padding:16px;margin:0;background:rgba(255,255,255,.04)}.signalRows b{color:var(--text)}.signalRows span{color:var(--accent);font-weight:900}.floatingMetrics{display:grid;gap:14px}.floatingMetrics strong,.insightCard strong{display:block;color:var(--accent);font-size:46px;letter-spacing:-.06em}.saasShowcase{display:grid;grid-template-columns:1fr 1.1fr .8fr;gap:20px}.saasImage{border-radius:30px;min-height:360px}.workflowCanvas{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.workflowCanvas article{min-height:150px}.insightCard{align-self:stretch;display:flex;flex-direction:column;justify-content:center;min-height:360px}.insightCard small{color:var(--muted);text-transform:uppercase;letter-spacing:.14em}@media(max-width:1000px){.photoShowcase,.beautyShowcase,.tradingShowcase,.saasShowcase,.workflowCanvas{grid-template-columns:1fr}.photoShowcase .photoLarge{grid-row:auto}.beautyImage,.tradingImage,.saasImage,.insightCard{min-height:260px}}`;
}
