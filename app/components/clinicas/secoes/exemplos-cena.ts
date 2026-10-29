// Cena 3D da seção exemplos: núcleo luminoso (a IA) + anel inclinado com 6 nós de vidro.
// Este módulo só é carregado com import() dinâmico dentro do useEffect (nunca no SSR).
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

export type ItemCena = {rotulo: string; path: string};
export type OpcoesCena = {
  itens: ItemCena[];
  ativo: number;
  celular: boolean;
  aoEscolher: (i: number) => void;
  aoInteragir: () => void;
  aoPronto: () => void;
};
export type Cena = {ativar: (i: number) => void; rodar: (sim: boolean) => void; dispose: () => void};

const ROSA = new THREE.Color('#ff2d78');
const CORAL = new THREE.Color('#ff8a5c');
const TAU = Math.PI * 2;

function texturaBrilho() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,255,255,1)');
  r.addColorStop(0.18, 'rgba(255,190,215,.85)');
  r.addColorStop(0.45, 'rgba(255,45,120,.28)');
  r.addColorStop(1, 'rgba(255,45,120,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function texturaIcone(path: string) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  g.translate(128, 128);
  g.scale(0.62, 0.62);
  g.translate(-128, -128);
  const p = new Path2D(path);
  g.shadowColor = 'rgba(255,45,120,.9)';
  g.shadowBlur = 26;
  g.fillStyle = '#ffd6e6';
  g.fill(p);
  g.shadowBlur = 0;
  g.fillStyle = '#fff6fa';
  g.fill(p);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function texturaRotulo(texto: string) {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 128;
  const g = c.getContext('2d')!;
  g.font = '600 50px "Bricolage Grotesque Variable", "Segoe UI", sans-serif';
  const larg = Math.min(600, g.measureText(texto).width + 76);
  const x0 = (640 - larg) / 2;
  g.fillStyle = 'rgba(20,7,15,.78)';
  g.strokeStyle = 'rgba(255,45,120,.55)';
  g.lineWidth = 3;
  g.beginPath();
  g.roundRect(x0, 18, larg, 92, 46);
  g.fill();
  g.stroke();
  g.fillStyle = '#fbeff4';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(texto, 320, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

const nucleoVert = /* glsl */ `
uniform float uT;
varying vec3 vN;
varying vec3 vV;
varying float vD;
void main(){
  vec3 p = position;
  float d = sin(p.x*3.1 + uT*1.3) * sin(p.y*3.7 + uT*1.1) * sin(p.z*2.9 + uT*.9);
  p += normal * d * .07;
  vD = d;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vN = normalize(normalMatrix * normal);
  vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;
const nucleoFrag = /* glsl */ `
uniform float uT;
uniform float uPulso;
varying vec3 vN;
varying vec3 vV;
varying float vD;
void main(){
  float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.2);
  vec3 fundo = vec3(.42, .02, .16);
  vec3 rosa = vec3(1.0, .18, .47);
  vec3 quente = vec3(1.0, .78, .88);
  vec3 c = mix(fundo, rosa, clamp(.62 + vD * 1.6, 0.0, 1.0));
  c = mix(c, quente, f);
  c += rosa * (.18 + .12 * sin(uT * 2.0)) * uPulso;
  gl_FragColor = vec4(c, 1.0);
}`;

export async function criarCena(host: HTMLElement, op: OpcoesCena): Promise<Cena> {
  const renderer = new THREE.WebGLRenderer({antialias: !op.celular, alpha: true, powerPreference: 'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, op.celular ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.className = 'ex-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const sala = new RoomEnvironment();
  const env = pmrem.fromScene(sala, 0.04).texture;
  scene.environment = env;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 1.1, 12);

  const texturas: THREE.Texture[] = [];
  const brilhoTex = texturaBrilho();
  texturas.push(brilhoTex);

  // Espera as fontes para os rótulos (com limite de tempo)
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load('600 50px "Bricolage Grotesque Variable"'),
      ]),
      new Promise((r) => setTimeout(r, 1200)),
    ]);
  } catch { /* segue com fonte de sistema */ }

  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const luzRosa = new THREE.PointLight(0xff2d78, 26, 14, 1.6);
  scene.add(luzRosa);
  const luzFrente = new THREE.DirectionalLight(0xffe9f2, 1.1);
  luzFrente.position.set(2, 4, 6);
  scene.add(luzFrente);

  const mundo = new THREE.Group();
  scene.add(mundo);

  // Núcleo
  const nucleoMat = new THREE.ShaderMaterial({
    uniforms: {uT: {value: 0}, uPulso: {value: 0}},
    vertexShader: nucleoVert,
    fragmentShader: nucleoFrag,
  });
  nucleoMat.toneMapped = false;
  const nucleo = new THREE.Mesh(new THREE.IcosahedronGeometry(0.74, 5), nucleoMat);
  mundo.add(nucleo);

  const halo = new THREE.Sprite(new THREE.SpriteMaterial({map: brilhoTex, color: ROSA, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.9}));
  halo.scale.setScalar(4.6);
  mundo.add(halo);

  const casca = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.98, 1),
    new THREE.MeshBasicMaterial({color: 0xff6fa3, wireframe: true, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false}),
  );
  mundo.add(casca);

  const orbitas: THREE.Mesh[] = [];
  for (let k = 0; k < 2; k++) {
    const o = new THREE.Mesh(
      new THREE.TorusGeometry(1.18 + k * 0.2, 0.01, 8, 160),
      new THREE.MeshBasicMaterial({color: k ? CORAL : ROSA, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false}),
    );
    o.rotation.set(1.1 + k * 0.7, 0.4 - k * 0.9, 0);
    orbitas.push(o);
    mundo.add(o);
  }

  // Anel inclinado
  const R = 3.4;
  const anelPai = new THREE.Group();
  anelPai.rotation.set(0.4, 0, -0.05);
  mundo.add(anelPai);
  const anel = new THREE.Group();
  anelPai.add(anel);

  const trilhaPts: THREE.Vector3[] = [];
  for (let k = 0; k <= 160; k++) {
    const a = (k / 160) * TAU;
    trilhaPts.push(new THREE.Vector3(Math.sin(a) * R, 0, Math.cos(a) * R));
  }
  const trilha = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(trilhaPts),
    new THREE.LineBasicMaterial({color: ROSA, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false}),
  );
  anel.add(trilha);

  // pontos ao longo do anel externo
  const nPts = 120;
  const pts = new Float32Array(nPts * 3);
  for (let k = 0; k < nPts; k++) {
    const a = (k / nPts) * TAU;
    const rr = R * 1.22 + (k % 3) * 0.05;
    pts.set([Math.sin(a) * rr, 0, Math.cos(a) * rr], k * 3);
  }
  const pontosGeo = new THREE.BufferGeometry();
  pontosGeo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
  const pontosAnel = new THREE.Points(pontosGeo, new THREE.PointsMaterial({map: brilhoTex, color: 0xff8fb6, size: 0.09, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false}));
  anel.add(pontosAnel);

  // Poeira de fundo
  const nPoeira = op.celular ? 140 : 260;
  const poeira = new Float32Array(nPoeira * 3);
  for (let k = 0; k < nPoeira; k++) {
    const raio = 5 + Math.random() * 7;
    const th = Math.random() * TAU;
    const ph = Math.acos(2 * Math.random() - 1);
    poeira.set([raio * Math.sin(ph) * Math.cos(th), raio * Math.cos(ph) * 0.6, raio * Math.sin(ph) * Math.sin(th) - 3], k * 3);
  }
  const poeiraGeo = new THREE.BufferGeometry();
  poeiraGeo.setAttribute('position', new THREE.BufferAttribute(poeira, 3));
  const nuvem = new THREE.Points(poeiraGeo, new THREE.PointsMaterial({map: brilhoTex, color: 0xffb3cf, size: 0.12, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false}));
  mundo.add(nuvem);

  // Nós
  type No = {
    grupo: THREE.Group; face: THREE.Group; disco: THREE.Mesh; borda: THREE.Mesh; brilho: THREE.Sprite;
    rotuloMat: THREE.MeshBasicMaterial; iconeMat: THREE.MeshBasicMaterial; discoMat: THREE.MeshStandardMaterial; bordaMat: THREE.MeshBasicMaterial;
    escala: number; ang: number;
    linhaMat: THREE.MeshBasicMaterial; pulsos: number[];
  };
  const nos: No[] = [];
  const alvosClique: THREE.Object3D[] = [];
  const discoGeo = new THREE.CylinderGeometry(0.47, 0.47, 0.12, 64, 1);
  discoGeo.rotateX(Math.PI / 2);
  const bordaGeo = new THREE.TorusGeometry(0.47, 0.022, 12, 72);
  const iconeGeo = new THREE.PlaneGeometry(0.58, 0.58);
  const rotuloGeo = op.celular ? new THREE.PlaneGeometry(2.8, 0.56) : new THREE.PlaneGeometry(2.5, 0.5);
  const n = op.itens.length;

  op.itens.forEach((it, i) => {
    const ang = (i / n) * TAU;
    const grupo = new THREE.Group();
    grupo.position.set(Math.sin(ang) * R, 0, Math.cos(ang) * R);
    anel.add(grupo);
    const face = new THREE.Group();
    grupo.add(face);

    // Vidro com clearcoat só no desktop; no celular, material padrão (mais leve)
    const baseDisco = {color: 0x2a0b20, metalness: 0.1, roughness: 0.14, transparent: true, opacity: 0.9, emissive: ROSA, emissiveIntensity: 0.04, envMapIntensity: 1.1};
    const discoMat: THREE.MeshStandardMaterial = op.celular
      ? new THREE.MeshStandardMaterial(baseDisco)
      : new THREE.MeshPhysicalMaterial({...baseDisco, clearcoat: 1, clearcoatRoughness: 0.06});
    const disco = new THREE.Mesh(discoGeo, discoMat);
    disco.userData.i = i;
    face.add(disco);
    alvosClique.push(disco);

    const bordaMat = new THREE.MeshBasicMaterial({color: ROSA, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false});
    const borda = new THREE.Mesh(bordaGeo, bordaMat);
    borda.position.z = 0.02;
    face.add(borda);

    const iconeTex = texturaIcone(it.path);
    texturas.push(iconeTex);
    const iconeMat = new THREE.MeshBasicMaterial({map: iconeTex, transparent: true, depthWrite: false, toneMapped: false});
    const icone = new THREE.Mesh(iconeGeo, iconeMat);
    icone.position.z = 0.075;
    face.add(icone);

    const rotTex = texturaRotulo(it.rotulo);
    texturas.push(rotTex);
    const rotuloMat = new THREE.MeshBasicMaterial({map: rotTex, transparent: true, depthWrite: false, toneMapped: false});
    const rotulo = new THREE.Mesh(rotuloGeo, rotuloMat);
    rotulo.position.set(0, op.celular ? -0.86 : -0.84, 0.05);
    rotulo.userData.i = i;
    face.add(rotulo);
    alvosClique.push(rotulo);

    const brilho = new THREE.Sprite(new THREE.SpriteMaterial({map: brilhoTex, color: ROSA, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0}));
    brilho.scale.setScalar(2.2);
    brilho.position.z = -0.12;
    face.add(brilho);

    // Ligação núcleo → nó
    const comp = R - 1.4;
    const linhaGeo = new THREE.CylinderGeometry(0.014, 0.014, comp, 6, 1, true);
    const linhaMat = new THREE.MeshBasicMaterial({color: ROSA, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false});
    const linha = new THREE.Mesh(linhaGeo, linhaMat);
    const meio = (0.9 + comp / 2);
    linha.position.set(Math.sin(ang) * meio, 0, Math.cos(ang) * meio);
    linha.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(Math.sin(ang), 0, Math.cos(ang)));
    anel.add(linha);

    const pulsos = [0, 1 / 3, 2 / 3];

    nos.push({grupo, face, disco, borda, brilho, rotuloMat, iconeMat, discoMat, bordaMat, escala: 1, ang, linhaMat, pulsos});
  });

  // Pulsos de luz: um único Points (1 draw call) com tamanho e brilho por vértice
  const nPulsos = n * 3;
  const pulsoPos = new Float32Array(nPulsos * 3);
  const pulsoCor = new Float32Array(nPulsos * 3);
  const pulsoTam = new Float32Array(nPulsos);
  for (let k = 0; k < nPulsos; k++) (k % 3 === 1 ? CORAL : ROSA).toArray(pulsoCor, k * 3);
  const pulsoGeo = new THREE.BufferGeometry();
  pulsoGeo.setAttribute('position', new THREE.BufferAttribute(pulsoPos, 3));
  pulsoGeo.setAttribute('aCor', new THREE.BufferAttribute(pulsoCor, 3));
  pulsoGeo.setAttribute('aTam', new THREE.BufferAttribute(pulsoTam, 1));
  const pulsoMat = new THREE.ShaderMaterial({
    uniforms: {uMapa: {value: brilhoTex}, uEscala: {value: 400}},
    vertexShader: `attribute vec3 aCor; attribute float aTam; uniform float uEscala; varying vec3 vCor;
      void main(){ vCor = aCor; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = aTam * uEscala / -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform sampler2D uMapa; varying vec3 vCor;
      void main(){ vec4 t = texture2D(uMapa, gl_PointCoord); gl_FragColor = vec4(vCor * t.rgb, t.a); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  pulsoMat.toneMapped = false;
  const pulsosPts = new THREE.Points(pulsoGeo, pulsoMat);
  pulsosPts.frustumCulled = false;
  anel.add(pulsosPts);

  // Estado
  let ativo = op.ativo;
  let rot = -nos[ativo].ang;
  let rotAlvo = rot;
  let vel = 0;
  let hover = -1;
  let ultimaAcao = performance.now();
  let rodando = false;
  let raf = 0;
  let destruido = false;
  const ponteiro = new THREE.Vector2();
  const ponteiroSuave = new THREE.Vector2();
  const ray = new THREE.Raycaster();
  const relogio = new THREE.Clock();
  let tempo = 0;

  const norm = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

  function ajustar() {
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const meiaL = R + (op.celular ? 0.62 : 1.5);
    const meiaA = op.celular ? 2.9 : 3.3;
    const dist = Math.max(meiaL / (tanV * camera.aspect), meiaA / tanV);
    camera.position.set(0, dist * 0.1, dist);
    camera.lookAt(0, op.celular ? -1.45 : -0.98, 0); // no celular, sobe a cena para dar respiro à dica
    camera.updateProjectionMatrix();
    pulsoMat.uniforms.uEscala.value = (h * renderer.getPixelRatio()) / (2 * tanV);
    render(0);
  }

  function acharNo(ev: PointerEvent) {
    const r = canvas.getBoundingClientRect();
    const v = new THREE.Vector2(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(v, camera);
    const hit = ray.intersectObjects(alvosClique, false)[0];
    return hit ? (hit.object.userData.i as number) : -1;
  }

  // Arrastar
  let arrastando = false;
  let arrastou = false;
  let x0 = 0;
  let rot0 = 0;
  let ultX = 0;
  let ultT = 0;
  const sensib = op.celular ? 0.012 : 0.008;

  const onDown = (ev: PointerEvent) => {
    arrastando = true;
    arrastou = false;
    x0 = ultX = ev.clientX;
    ultT = performance.now();
    rot0 = rotAlvo;
    vel = 0;
    ultimaAcao = performance.now();
  };
  const onMove = (ev: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    ponteiro.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    if (arrastando) {
      const dx = ev.clientX - x0;
      if (!arrastou && Math.abs(dx) > 6) {
        arrastou = true;
        try { canvas.setPointerCapture(ev.pointerId); } catch { /* ok */ }
        op.aoInteragir();
      }
      if (arrastou) {
        rotAlvo = rot0 + dx * sensib;
        const agora = performance.now();
        const dt = Math.max(1, agora - ultT);
        vel = ((ev.clientX - ultX) * sensib) / (dt / 1000);
        ultX = ev.clientX;
        ultT = agora;
        ultimaAcao = agora;
      }
      return;
    }
    if (ev.pointerType === 'mouse') {
      const i = acharNo(ev);
      if (i !== hover) {
        hover = i;
        canvas.style.cursor = i >= 0 ? 'pointer' : 'grab';
      }
    }
  };
  const onUp = (ev: PointerEvent) => {
    if (!arrastando) return;
    arrastando = false;
    try { canvas.releasePointerCapture(ev.pointerId); } catch { /* ok */ }
    if (!arrastou) {
      const i = acharNo(ev);
      if (i >= 0) op.aoEscolher(i);
      vel = 0;
    } else {
      vel = THREE.MathUtils.clamp(vel, -6, 6);
      if (performance.now() - ultT > 80) vel = 0;
    }
    ultimaAcao = performance.now();
  };
  const onCancel = () => { arrastando = false; vel = 0; };
  const onLeave = () => { hover = -1; ponteiro.set(0, 0); };

  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onCancel);
  canvas.addEventListener('pointerleave', onLeave);
  canvas.style.cursor = 'grab';

  const tmp = new THREE.Vector3();
  const camLocal = new THREE.Vector3();

  function render(dt: number) {
    tempo += dt;
    const agora = performance.now();

    // rotação do anel
    if (!arrastando) {
      if (Math.abs(vel) > 0.001) {
        rotAlvo += vel * dt;
        vel *= Math.pow(0.04, dt);
      }
      if (agora - ultimaAcao > 4200) rotAlvo += 0.07 * dt; // giro ocioso, devagar
    }
    rot += (rotAlvo - rot) * (1 - Math.exp(-dt * (arrastando ? 14 : 4.2)));
    anel.rotation.y = rot;

    // inclinação pelo ponteiro
    ponteiroSuave.lerp(ponteiro, 1 - Math.exp(-dt * 3));
    mundo.rotation.x = -ponteiroSuave.y * 0.08;
    mundo.rotation.y = ponteiroSuave.x * 0.12;

    nucleo.rotation.y += dt * 0.25;
    casca.rotation.y -= dt * 0.18;
    casca.rotation.x += dt * 0.07;
    orbitas[0].rotation.z += dt * 0.5;
    orbitas[1].rotation.z -= dt * 0.35;
    nuvem.rotation.y += dt * 0.012;
    nucleoMat.uniforms.uT.value = tempo;
    nucleoMat.uniforms.uPulso.value += ((hover >= 0 ? 1 : 0.4) - nucleoMat.uniforms.uPulso.value) * (1 - Math.exp(-dt * 3));
    const resp = 1 + Math.sin(tempo * 1.6) * 0.035;
    nucleo.scale.setScalar(resp);
    halo.scale.setScalar(4.6 * (1 + Math.sin(tempo * 1.6) * 0.06));

    mundo.updateMatrixWorld(true);
    camLocal.copy(camera.position);

    for (let i = 0; i < nos.length; i++) {
      const no = nos[i];
      const eAtivo = i === ativo;
      const alvo = eAtivo ? 1.32 : i === hover ? 1.14 : 1;
      no.escala += (alvo - no.escala) * (1 - Math.exp(-dt * 6));
      no.grupo.scale.setScalar(no.escala);
      no.grupo.position.y = Math.sin(tempo * 1.1 + i * 1.7) * 0.07;
      no.face.lookAt(camLocal);

      // profundidade: nós de trás ficam mais apagados
      no.grupo.getWorldPosition(tmp);
      const frente = THREE.MathUtils.clamp((tmp.z + R) / (2 * R), 0, 1);
      const luz = 0.35 + 0.65 * frente;
      no.iconeMat.opacity = 0.5 + 0.5 * luz;
      no.rotuloMat.opacity = eAtivo ? 1 : op.celular ? 0 : 0.2 + 0.65 * luz;
      no.discoMat.opacity = 0.7 + 0.25 * luz;
      no.discoMat.emissiveIntensity += ((eAtivo ? 0.2 : i === hover ? 0.14 : 0.03) - no.discoMat.emissiveIntensity) * (1 - Math.exp(-dt * 5));
      no.bordaMat.opacity = eAtivo ? 1 : 0.25 + 0.4 * luz;
      const bm = no.brilho.material as THREE.SpriteMaterial;
      bm.opacity += ((eAtivo ? 0.75 + Math.sin(tempo * 2.4) * 0.15 : i === hover ? 0.35 : 0) - bm.opacity) * (1 - Math.exp(-dt * 5));
      no.linhaMat.opacity = eAtivo ? 0.75 : 0.18 + 0.12 * luz;

      // pulsos viajando do núcleo até o nó
      const velP = eAtivo ? 0.62 : 0.24;
      const ini = 0.9;
      const fim = R - 0.5;
      for (let k = 0; k < 3; k++) {
        let t = no.pulsos[k] + dt * velP;
        if (t > 1) t -= 1;
        no.pulsos[k] = t;
        const d = ini + (fim - ini) * t;
        const idx = i * 3 + k;
        pulsoPos[idx * 3] = Math.sin(no.ang) * d;
        pulsoPos[idx * 3 + 1] = 0;
        pulsoPos[idx * 3 + 2] = Math.cos(no.ang) * d;
        // brilho embutido no tamanho (a mistura é aditiva)
        pulsoTam[idx] = (eAtivo ? 0.42 : 0.26) * Math.sin(t * Math.PI) * (eAtivo ? 1 : 0.5 * luz + 0.35);
      }
    }

    (pulsoGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (pulsoGeo.attributes.aTam as THREE.BufferAttribute).needsUpdate = true;
    renderer.render(scene, camera);
  }

  function loop() {
    if (!rodando || destruido) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(relogio.getDelta(), 0.05);
    render(dt);
  }

  const ro = new ResizeObserver(() => ajustar());
  ro.observe(host);
  ajustar();
  op.aoPronto();

  return {
    ativar(i: number) {
      if (i === ativo && Math.abs(norm(rotAlvo + nos[i].ang)) < 0.01) return;
      ativo = i;
      const alvo = -nos[i].ang;
      rotAlvo = rot + norm(alvo - rot);
      vel = 0;
      ultimaAcao = performance.now();
      if (!rodando) render(0);
    },
    rodar(sim: boolean) {
      if (sim === rodando || destruido) return;
      rodando = sim;
      if (sim) {
        relogio.getDelta();
        loop();
      } else cancelAnimationFrame(raf);
    },
    dispose() {
      destruido = true;
      rodando = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onCancel);
      canvas.removeEventListener('pointerleave', onLeave);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else if (mat) mat.dispose();
      });
      texturas.forEach((t) => t.dispose());
      env.dispose();
      pmrem.dispose();
      sala.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
