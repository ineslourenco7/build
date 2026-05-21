export function webglHtml(){
  return '<canvas class="webglStage" id="webglStage"></canvas>';
}

export function webglCss(){
  return `.webglStage{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:.68;mix-blend-mode:screen}.webglFallbackGlow{position:fixed;inset:-20%;z-index:0;pointer-events:none;background:radial-gradient(circle at 30% 20%,var(--accent),transparent 28%),radial-gradient(circle at 70% 70%,var(--accent2),transparent 32%);filter:blur(70px);opacity:.34}@media(max-width:900px){.webglStage{opacity:.42}}@media(prefers-reduced-motion:reduce){.webglStage{display:none}}`;
}

export function webglJs(){
  return `
(function(){
  const canvas=document.getElementById('webglStage');
  if(!canvas) return;
  const gl=canvas.getContext('webgl',{alpha:true,antialias:false,preserveDrawingBuffer:false});
  if(!gl){canvas.insertAdjacentHTML('afterend','<div class="webglFallbackGlow"></div>');return;}
  const vertex='attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}';
  const fragment='precision highp float;uniform vec2 r;uniform float t;uniform vec2 m;vec3 pal(float x){vec3 a=vec3(.50,.50,.50);vec3 b=vec3(.50,.50,.50);vec3 c=vec3(1.0,1.0,1.0);vec3 d=vec3(.22,.36,.58);return a+b*cos(6.28318*(c*x+d));}float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}float fbm(vec2 p){float v=0.0;float amp=.5;for(int i=0;i<5;i++){v+=amp*noise(p);p*=2.02;p+=vec2(4.7,-2.3);amp*=.5;}return v;}void main(){vec2 uv=(gl_FragCoord.xy-.5*r.xy)/r.y;vec2 mouse=(m-.5)*vec2(r.x/r.y,1.0);float d=length(uv-mouse*.6);vec2 q=uv;q.x+=sin(q.y*3.0+t*.18)*.18;q.y+=cos(q.x*2.4-t*.15)*.16;float n=fbm(q*2.2+t*.06);float n2=fbm(q*5.0-t*.08);float aura=smoothstep(.95,.12,d)*(0.28+0.72*n);float bands=sin((q.x+q.y+n*.7)*7.0+t*.55)*.5+.5;vec3 col=pal(n*.7+bands*.25+t*.035);float alpha=(aura*.55+n2*.14)*smoothstep(1.3,.05,length(uv));col*=1.0+bands*.55;gl_FragColor=vec4(col,alpha);}';
  function compile(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;}
  const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const rLoc=gl.getUniformLocation(program,'r');const tLoc=gl.getUniformLocation(program,'t');const mLoc=gl.getUniformLocation(program,'m');
  let mouse=[.5,.5];window.addEventListener('mousemove',e=>{mouse=[e.clientX/window.innerWidth,1-e.clientY/window.innerHeight];});
  function resize(){const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.floor(innerWidth*d);canvas.height=Math.floor(innerHeight*d);canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';gl.viewport(0,0,canvas.width,canvas.height);}resize();window.addEventListener('resize',resize);
  const start=performance.now();function draw(){gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform2f(rLoc,canvas.width,canvas.height);gl.uniform1f(tLoc,(performance.now()-start)/1000);gl.uniform2f(mLoc,mouse[0],mouse[1]);gl.drawArrays(gl.TRIANGLES,0,6);requestAnimationFrame(draw);}draw();
})();`;
}
