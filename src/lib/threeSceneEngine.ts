export function threeSceneHtml() {
  return '<canvas class="threeSceneCanvas" id="threeSceneCanvas"></canvas>';
}

export function threeSceneCss() {
  return `.threeSceneCanvas{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:.74;mix-blend-mode:screen}.threeSceneFallback{position:fixed;inset:-10%;z-index:0;pointer-events:none;background:radial-gradient(circle at 35% 30%,var(--accent),transparent 28%),radial-gradient(circle at 70% 65%,var(--accent2),transparent 34%);filter:blur(80px);opacity:.32}@media(max-width:900px){.threeSceneCanvas{opacity:.44}}@media(prefers-reduced-motion:reduce){.threeSceneCanvas{display:none}}`;
}

export function threeSceneJs() {
  return `
(function(){
  const canvas=document.getElementById('threeSceneCanvas');
  if(!canvas) return;
  function fallback(){canvas.insertAdjacentHTML('afterend','<div class="threeSceneFallback"></div>');}
  function loadThree(){return new Promise((resolve,reject)=>{if(window.THREE)return resolve(window.THREE);const s=document.createElement('script');s.src='https://unpkg.com/three@0.160.0/build/three.min.js';s.async=true;s.onload=()=>resolve(window.THREE);s.onerror=reject;document.head.appendChild(s);});}
  loadThree().then((THREE)=>{
    const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    renderer.setClearColor(0x000000,0);
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(55,window.innerWidth/window.innerHeight,.1,100);
    camera.position.set(0,0,8);
    const group=new THREE.Group();scene.add(group);
    const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#8b5cf6';
    const accent2=getComputedStyle(document.documentElement).getPropertyValue('--accent2').trim()||'#06b6d4';
    const lightA=new THREE.PointLight(new THREE.Color(accent),2.8,22);lightA.position.set(-3,2,4);scene.add(lightA);
    const lightB=new THREE.PointLight(new THREE.Color(accent2),2.2,22);lightB.position.set(4,-2,5);scene.add(lightB);
    const ambient=new THREE.AmbientLight(0xffffff,.18);scene.add(ambient);
    const mat=new THREE.MeshStandardMaterial({color:new THREE.Color(accent),emissive:new THREE.Color(accent),emissiveIntensity:.24,roughness:.32,metalness:.72,transparent:true,opacity:.72});
    const wire=new THREE.MeshBasicMaterial({color:new THREE.Color(accent2),wireframe:true,transparent:true,opacity:.26});
    const core=new THREE.Mesh(new THREE.IcosahedronGeometry(1.15,2),mat);core.position.set(2.15,.15,-.8);group.add(core);
    const shell=new THREE.Mesh(new THREE.IcosahedronGeometry(1.75,1),wire);shell.position.copy(core.position);group.add(shell);
    const torus=new THREE.Mesh(new THREE.TorusKnotGeometry(.72,.16,120,12),new THREE.MeshStandardMaterial({color:new THREE.Color(accent2),emissive:new THREE.Color(accent2),emissiveIntensity:.34,roughness:.25,metalness:.6,transparent:true,opacity:.68}));torus.position.set(-2.25,-.55,-.4);group.add(torus);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(2.9,.01,12,160),new THREE.MeshBasicMaterial({color:new THREE.Color(accent),transparent:true,opacity:.22}));ring.rotation.x=Math.PI*.52;ring.position.z=-1.2;group.add(ring);
    const count=850;const positions=new Float32Array(count*3);for(let i=0;i<count;i++){const r=3.2+Math.random()*5.2;const a=Math.random()*Math.PI*2;const h=(Math.random()-.5)*6.5;positions[i*3]=Math.cos(a)*r;positions[i*3+1]=h;positions[i*3+2]=Math.sin(a)*r-1.8;}
    const particleGeo=new THREE.BufferGeometry();particleGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));
    const particleMat=new THREE.PointsMaterial({color:new THREE.Color(accent2),size:.025,transparent:true,opacity:.72,depthWrite:false});
    const particles=new THREE.Points(particleGeo,particleMat);group.add(particles);
    const mouse={x:0,y:0};let scroll=0,scrollTarget=0;
    function updateScroll(){const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);scrollTarget=window.scrollY/max;}
    window.addEventListener('mousemove',e=>{mouse.x=(e.clientX/window.innerWidth-.5)*2;mouse.y=(e.clientY/window.innerHeight-.5)*2;});
    window.addEventListener('scroll',updateScroll,{passive:true});updateScroll();
    function resize(){const w=window.innerWidth,h=window.innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
    window.addEventListener('resize',()=>{resize();updateScroll();});resize();
    const start=performance.now();function tick(){const t=(performance.now()-start)/1000;scroll+=(scrollTarget-scroll)*.055;const sceneIndex=Math.floor(scroll*4);const phase=scroll*4-sceneIndex;
      group.rotation.y=t*.08+mouse.x*.18+scroll*1.4;group.rotation.x=mouse.y*.09-scroll*.22;group.position.y=(scroll-.5)*-1.2;group.position.z=-scroll*1.8;
      core.rotation.x=t*.28+scroll*2.2;core.rotation.y=t*.36+scroll*1.6;core.position.x=2.15-Math.sin(scroll*Math.PI*2)*1.3;core.position.y=.15+Math.cos(scroll*Math.PI*2)*.45;
      shell.rotation.x=-t*.16-scroll*1.5;shell.rotation.y=t*.2+scroll*2.4;shell.position.copy(core.position);
      torus.rotation.x=t*.24+scroll*2.8;torus.rotation.y=-t*.3-scroll*1.9;torus.position.x=-2.25+Math.sin(scroll*Math.PI*2)*1.1;torus.position.y=-.55+Math.sin(scroll*Math.PI)*.8;
      ring.rotation.z=t*.06+scroll*2.6;ring.scale.setScalar(1+scroll*.55);
      particles.rotation.y=t*.035+scroll*.85;particles.rotation.x=scroll*.18;
      lightA.position.x=-3+Math.sin(scroll*Math.PI*2)*4;lightA.position.y=2+Math.cos(scroll*Math.PI*2)*2;lightA.intensity=2.2+Math.sin(scroll*Math.PI*4)*.9;
      lightB.position.x=4+Math.cos(scroll*Math.PI*2)*3;lightB.position.y=-2+Math.sin(scroll*Math.PI*2)*2.2;lightB.intensity=1.8+Math.cos(scroll*Math.PI*3)*.7;
      const targetX=mouse.x*.6+Math.sin(scroll*Math.PI*2)*1.2;const targetY=-mouse.y*.35+Math.cos(scroll*Math.PI*1.5)*.65;const targetZ=8-scroll*2.2+Math.sin(phase*Math.PI)*.45;
      camera.position.x+=(targetX-camera.position.x)*.035;camera.position.y+=(targetY-camera.position.y)*.035;camera.position.z+=(targetZ-camera.position.z)*.04;camera.lookAt(0,0,-scroll*1.2);
      renderer.render(scene,camera);requestAnimationFrame(tick);}tick();
  }).catch(fallback);
})();`;
}
