export function shaderHtml(){
  return '<div class="shaderAurora"></div><div class="shaderBlob blobOne"></div><div class="shaderBlob blobTwo"></div><div class="shaderDistortion"></div>';
}

export function shaderCss(){
  return `.shaderAurora{position:fixed;inset:-20%;z-index:0;pointer-events:none;opacity:.55;filter:blur(42px) saturate(1.35);background:radial-gradient(circle at 22% 24%,var(--accent),transparent 28%),radial-gradient(circle at 78% 22%,var(--accent2),transparent 24%),radial-gradient(circle at 52% 74%,var(--glow),transparent 32%);animation:auroraFlow 18s ease-in-out infinite alternate;mix-blend-mode:screen}.shaderBlob{position:fixed;z-index:0;pointer-events:none;width:36vw;height:36vw;border-radius:44% 56% 62% 38%/42% 48% 52% 58%;filter:blur(28px);opacity:.28;background:linear-gradient(135deg,var(--accent),var(--accent2));mix-blend-mode:screen;animation:blobMorph 16s ease-in-out infinite}.blobOne{left:-10vw;top:22vh}.blobTwo{right:-12vw;bottom:4vh;animation-delay:-7s;animation-duration:21s}.shaderDistortion{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.09;background-image:linear-gradient(115deg,transparent 0 40%,rgba(255,255,255,.9) 41%,transparent 42% 100%);background-size:220% 220%;mix-blend-mode:overlay;animation:distortionSweep 9s ease-in-out infinite}@keyframes auroraFlow{0%{transform:translate3d(-2vw,-2vh,0) rotate(0deg) scale(1)}50%{transform:translate3d(3vw,2vh,0) rotate(12deg) scale(1.08)}100%{transform:translate3d(-1vw,4vh,0) rotate(-9deg) scale(1.04)}}@keyframes blobMorph{0%,100%{transform:translate3d(0,0,0) rotate(0deg) scale(1);border-radius:44% 56% 62% 38%/42% 48% 52% 58%}33%{transform:translate3d(8vw,-5vh,0) rotate(18deg) scale(1.12);border-radius:61% 39% 45% 55%/55% 35% 65% 45%}66%{transform:translate3d(3vw,7vh,0) rotate(-16deg) scale(.94);border-radius:38% 62% 57% 43%/36% 62% 38% 64%}}@keyframes distortionSweep{0%,100%{background-position:0% 0%;opacity:.04}45%{background-position:100% 100%;opacity:.12}}@media(max-width:900px){.shaderAurora{opacity:.35}.shaderBlob{opacity:.18}.shaderDistortion{display:none}}@media(prefers-reduced-motion:reduce){.shaderAurora,.shaderBlob,.shaderDistortion{animation:none!important}}`;
}

export function shaderJs(){
  return `
(function(){
  const root=document.documentElement;
  let tx=0,ty=0,cx=0,cy=0;
  window.addEventListener('mousemove',(e)=>{tx=(e.clientX/window.innerWidth-.5)*2;ty=(e.clientY/window.innerHeight-.5)*2;});
  function tick(){cx+=(tx-cx)*.04;cy+=(ty-cy)*.04;root.style.setProperty('--shader-x',(50+cx*6)+'%');root.style.setProperty('--shader-y',(50+cy*6)+'%');document.querySelectorAll('.shaderAurora').forEach((el)=>{el.style.transform='translate3d('+cx*18+'px,'+cy*18+'px,0) scale(1.04)';});requestAnimationFrame(tick);}tick();
})();`;
}
