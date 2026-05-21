export function threeSceneHtml() {
  return '<canvas class="threeSceneCanvas" id="threeSceneCanvas"></canvas>';
}

export function threeSceneCss() {
  return `.threeSceneCanvas{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:.72;mix-blend-mode:screen}.threeSceneFallback{position:fixed;inset:-10%;z-index:0;pointer-events:none;background:radial-gradient(circle at 35% 30%,var(--accent),transparent 28%),radial-gradient(circle at 70% 65%,var(--accent2),transparent 34%);filter:blur(80px);opacity:.32}@media(max-width:900px){.threeSceneCanvas{opacity:.42}}@media(prefers-reduced-motion:reduce){.threeSceneCanvas{display:none}}`;
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
    const lightA=new THREE.PointLight(new THREE.Color(accent),2.8,18);lightA.position.set(-3,2,4);scene.add(lightA);
    const lightB=new THREE.PointLight(new THREE.Color(accent2),2.2,18);lightB.position.set(4,-2,5);scene.add(lightB);
    scene.add(new THREE.AmbientLight(0xffffff,.18));
    const mat=new THREE.MeshStandardMaterial({color:new THREE.Color(accent),emissive:new THREE.Color(accent),emissiveIntensity:.24,roughness:.32,metalness:.72,transparent:true,opacity:.72});
    const wire=new THREE.MeshBasicMaterial({color:new THREE.Color(accent2),wireframe:true,transparent:true,opacity:.26});
    const geo=new THREE.IcosahedronGeometry(1.15,2);
    const core=new THREE.Mesh(geo,mat);core.position.set(2.15,.15,-.8);group.add(core);
    const shell=new THREE.Mesh(new THREE.IcosahedronGeometry(1.75,1),wire);shell.position.copy(core.position);group.add(shell);
    const torus=new THREE.Mesh(new THREE.TorusKnotGeometry(.72,.16,120,12),new THREE.MeshStandardMaterial({color:new THREE.Color(accent2),emissive:new THREE.Color(accent2),emissiveIntensity:.34,roughness:.25,metalness:.6,transparent:true,opacity:.68}));torus.position.set(-2.25,-.55,-.4);group.add(torus);
    const count=650;const positions=new Float32Array(count*3);for(let i=0;i<count;i++){const r=3.2+Math.random()*4.2;const a=Math.random()*Math.PI*2;const h=(Math.random()-.5)*5.5;positions[i*3]=Math.cos(a)*r;positions[i*3+1]=h;positions[i*3+2]=Math.sin(a)*r-1.8;}
    const particleGeo=new THREE.BufferGeometry();particleGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));
    const particleMat=new THREE.PointsMaterial({color:new THREE.Color(accent2),size:.025,transparent:true,opacity:.72,depthWrite:false});
    const particles=new THREE.Points(particleGeo,particleMat);group.add(particles);
    const mouse={x:0,y:0};window.addEventListener('mousemove',e=>{mouse.x=(e.clientX/window.innerWidth-.5)*2;mouse.y=(e.clientY/window.innerHeight-.5)*2;});
    function resize(){const w=window.innerWidth,h=window.innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
    window.addEventListener('resize',resize);resize();
    const start=performance.now();function tick(){const t=(performance.now()-start)/1000;group.rotation.y=t*.08+mouse.x*.18;group.rotation.x=mouse.y*.09;core.rotation.x=t*.28;core.rotation.y=t*.36;shell.rotation.x=-t*.16;shell.rotation.y=t*.2;torus.rotation.x=t*.24;torus.rotation.y=-t*.3;particles.rotation.y=t*.035;camera.position.x+=(mouse.x*.6-camera.position.x)*.035;camera.position.y+=(-mouse.y*.35-camera.position.y)*.035;camera.lookAt(0,0,0);renderer.render(scene,camera);requestAnimationFrame(tick);}tick();
  }).catch(fallback);
})();`;
}
