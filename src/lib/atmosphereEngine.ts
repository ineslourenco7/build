export function atmosphereHtml() {
  return '<canvas class="atmosphereCanvas" id="atmosphereCanvas"></canvas><div class="lightBeam beamA"></div><div class="lightBeam beamB"></div>';
}

export function atmosphereCss() {
  return `.atmosphereCanvas{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;opacity:.72;mix-blend-mode:screen}.lightBeam{position:fixed;pointer-events:none;z-index:1;width:44vw;height:44vw;border-radius:999px;filter:blur(80px);opacity:.22;background:radial-gradient(circle,var(--accent),transparent 64%);animation:beamDrift 18s ease-in-out infinite}.beamA{left:-12vw;top:8vh}.beamB{right:-14vw;bottom:-8vh;background:radial-gradient(circle,var(--accent2),transparent 64%);animation-delay:-7s}@keyframes beamDrift{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(8vw,-6vh,0) scale(1.18)}}@media(max-width:900px){.atmosphereCanvas{opacity:.42}.lightBeam{opacity:.16}}@media(prefers-reduced-motion:reduce){.atmosphereCanvas,.lightBeam{display:none}}`;
}

export function atmosphereJs() {
  return `
(function(){
  const canvas=document.getElementById('atmosphereCanvas');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  if(!ctx) return;
  let width=0,height=0,mouse={x:0,y:0,active:false};
  const particles=[];
  const count=Math.min(90,Math.max(42,Math.floor(window.innerWidth/18)));
  function resize(){width=canvas.width=window.innerWidth*devicePixelRatio;height=canvas.height=window.innerHeight*devicePixelRatio;canvas.style.width=window.innerWidth+'px';canvas.style.height=window.innerHeight+'px';}
  function makeParticle(){return{x:Math.random()*width,y:Math.random()*height,z:.35+Math.random()*1.4,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,r:1+Math.random()*2.6,life:Math.random()*Math.PI*2};}
  function init(){particles.length=0;for(let i=0;i<count;i++)particles.push(makeParticle());}
  function color(){const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#8b5cf6';return accent;}
  function tick(){ctx.clearRect(0,0,width,height);const c=color();for(const p of particles){p.life+=.012;p.x+=p.vx*p.z*devicePixelRatio;p.y+=p.vy*p.z*devicePixelRatio;if(mouse.active){const mx=mouse.x*devicePixelRatio,my=mouse.y*devicePixelRatio,dx=mx-p.x,dy=my-p.y,d=Math.sqrt(dx*dx+dy*dy)||1;if(d<220*devicePixelRatio){p.x-=dx/d*.34*p.z;p.y-=dy/d*.34*p.z;}}if(p.x<0)p.x=width;if(p.x>width)p.x=0;if(p.y<0)p.y=height;if(p.y>height)p.y=0;const alpha=(.16+.18*Math.sin(p.life))*p.z;ctx.beginPath();ctx.fillStyle=c.replace(')',','+alpha+')').replace('rgb','rgba');ctx.arc(p.x,p.y,p.r*p.z*devicePixelRatio,0,Math.PI*2);ctx.fill();}for(let i=0;i<particles.length;i+=3){for(let j=i+1;j<particles.length;j+=9){const a=particles[i],b=particles[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy);if(d<150*devicePixelRatio){ctx.globalAlpha=(1-d/(150*devicePixelRatio))*.16;ctx.strokeStyle=c;ctx.lineWidth=.7*devicePixelRatio;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.globalAlpha=1;}}}requestAnimationFrame(tick);}
  window.addEventListener('resize',()=>{resize();init();});
  window.addEventListener('mousemove',(e)=>{mouse.x=e.clientX;mouse.y=e.clientY;mouse.active=true;});
  window.addEventListener('mouseleave',()=>{mouse.active=false;});
  resize();init();tick();
})();`;
}
