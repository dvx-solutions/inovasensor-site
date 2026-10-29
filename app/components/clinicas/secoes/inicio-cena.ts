// Cena 3D do hero (seção inicio). Carregada só no navegador, por import() dinâmico.
// Núcleo luminoso (a IA) + cartões de vidro em órbita bagunçada (o caos da recepção).
// A cada ~4 s um cartão é puxado pelo núcleo e sai arrumado na pilha, com selo verde.
import * as THREE from 'three';

// Ícones Phosphor (regular, MIT), copiados como path.
const P = {
  whatsapp: 'M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z',
  agenda: 'M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-38.34-85.66a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L116,164.69l42.34-42.35A8,8,0,0,1,169.66,122.34Z',
  orcamento: 'M72,104a8,8,0,0,1,8-8h96a8,8,0,0,1,0,16H80A8,8,0,0,1,72,104Zm8,40h96a8,8,0,0,0,0-16H80a8,8,0,0,0,0,16ZM232,56V208a8,8,0,0,1-11.58,7.15L192,200.94l-28.42,14.21a8,8,0,0,1-7.16,0L128,200.94,99.58,215.15a8,8,0,0,1-7.16,0L64,200.94,35.58,215.15A8,8,0,0,1,24,208V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56Zm-16,0H40V195.06l20.42-10.22a8,8,0,0,1,7.16,0L96,199.06l28.42-14.22a8,8,0,0,1,7.16,0L160,199.06l28.42-14.22a8,8,0,0,1,7.16,0L216,195.06Z',
  volta: 'M224,128a96,96,0,0,1-94.71,96H128A95.38,95.38,0,0,1,62.1,197.8a8,8,0,0,1,11-11.63A80,80,0,1,0,71.43,71.39a3.07,3.07,0,0,1-.26.25L44.59,96H72a8,8,0,0,1,0,16H24a8,8,0,0,1-8-8V56a8,8,0,0,1,16,0V85.8L60.25,60A96,96,0,0,1,224,128Z',
  estrela: 'M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z',
  numeros: 'M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z',
  check: 'M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z',
};

export const TIPOS = [
  {rotulo: 'WhatsApp', sub: 'esperando resposta', legenda: 'WhatsApp · resposta sobre horários pronta para a Júlia revisar e enviar', icone: P.whatsapp},
  {rotulo: 'Agenda', sub: 'amanhã sem confirmar', legenda: 'Agenda · lembretes de amanhã prontos para a recepção aprovar', icone: P.agenda},
  {rotulo: 'Orçamento', sub: 'sem retorno', legenda: 'Orçamento · texto claro montado a partir das anotações do doutor', icone: P.orcamento},
  {rotulo: 'Pacientes sumidos', sub: 'há 6 ou 12 meses', legenda: 'Pacientes sumidos · lista de quem não vem há 6 ou 12 meses, com mensagem pronta', icone: P.volta},
  {rotulo: 'Pós-consulta', sub: 'cuidados para enviar', legenda: 'Pós-consulta · cuidados e lembrete do retorno prontos para enviar', icone: P.estrela},
  {rotulo: 'Resumo da semana', sub: 'planilha parada', legenda: 'Resumo da semana · consultas, faltas e orçamentos num resumo simples', icone: P.numeros},
];

export interface OpcoesCena {
  pai: HTMLElement;          // onde o canvas entra (ocupa 100%)
  area: HTMLElement;         // onde o mouse/toque inclina a cena
  legenda: HTMLElement | null;
  celular: boolean;
  aoPronto?: () => void;
}
export interface Cena {ligar(v: boolean): void; destruir(): void}

type Estado = 'orbita' | 'entrando' | 'saindo-nucleo' | 'pilha' | 'deixando' | 'voltando' | 'foco';
interface Pose {p: THREE.Vector3; q: THREE.Quaternion; s: number; o: number}
interface Anim {t0: number; dur: number; de: Pose; alvo: () => Pose; ease: (x: number) => number; arco: number; fim?: () => void}
interface Cartao {
  g: THREE.Group; matCorpo: THREE.MeshStandardMaterial; matFace: THREE.MeshBasicMaterial; matBrilho: THREE.SpriteMaterial;
  tipo: number; estado: Estado; anim: Anim | null; antes: Estado;
  r: number; vel: number; fase: number; eixo: THREE.Quaternion; tumble: THREE.Vector3; opac: number;
}

const easeIn = (x: number) => x * x * x;
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const easeIO = (x: number) => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function rr(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}

const FD = '"Bricolage Grotesque Variable", "Segoe UI", sans-serif';
const FM = '"Cl Mono", ui-monospace, monospace';
const FT = '"Cl Plex", "Segoe UI", sans-serif';

function texturaCartao(t: typeof TIPOS[number], pronto: boolean, aniso: number) {
  const W = 640, H = 400, c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d')!;
  // vidro
  rr(g, 3, 3, W - 6, H - 6, 46);
  const fundo = g.createLinearGradient(0, 0, W * .4, H);
  if (pronto) { fundo.addColorStop(0, '#2e1628'); fundo.addColorStop(1, '#140911'); }
  else { fundo.addColorStop(0, '#561c40'); fundo.addColorStop(1, '#220b1b'); }
  g.fillStyle = fundo; g.fill();
  g.save(); g.clip();
  const brilho = g.createLinearGradient(0, 0, 0, H * .5);
  brilho.addColorStop(0, 'rgba(255,255,255,.13)'); brilho.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = brilho; g.fillRect(0, 0, W, H * .5);
  const luz = g.createRadialGradient(W * .9, H * .05, 0, W * .9, H * .05, W * .6);
  luz.addColorStop(0, pronto ? 'rgba(47,211,138,.20)' : 'rgba(255,45,120,.28)'); luz.addColorStop(1, 'rgba(255,45,120,0)');
  g.fillStyle = luz; g.fillRect(0, 0, W, H);
  g.restore();
  rr(g, 3, 3, W - 6, H - 6, 46);
  g.lineWidth = 4; g.strokeStyle = pronto ? 'rgba(47,211,138,.75)' : 'rgba(255,170,205,.35)'; g.stroke();
  // ícone
  const cx = 92, cy = 96;
  g.beginPath(); g.arc(cx, cy, 50, 0, Math.PI * 2);
  g.fillStyle = pronto ? 'rgba(47,211,138,.14)' : 'rgba(255,45,120,.2)'; g.fill();
  g.lineWidth = 3; g.strokeStyle = pronto ? 'rgba(47,211,138,.6)' : 'rgba(255,45,120,.7)'; g.stroke();
  g.save(); g.translate(cx - 32, cy - 32); g.scale(64 / 256, 64 / 256);
  g.fillStyle = pronto ? '#7ff0bd' : '#ff8fb8'; g.fill(new Path2D(t.icone)); g.restore();
  // etiqueta de estado (canto)
  const etq = pronto ? 'pronto' : 'pendente';
  g.font = `400 26px ${FM}`;
  const ew = g.measureText(etq).width + 40;
  rr(g, W - 44 - ew, 72, ew, 48, 24);
  g.fillStyle = pronto ? 'rgba(47,211,138,.14)' : 'rgba(255,45,120,.16)'; g.fill();
  g.lineWidth = 2; g.strokeStyle = pronto ? 'rgba(47,211,138,.55)' : 'rgba(255,120,170,.55)'; g.stroke();
  g.fillStyle = pronto ? '#8ff5c6' : '#ffa3c4'; g.textBaseline = 'middle'; g.fillText(etq, W - 44 - ew + 20, 97);
  // rótulo
  g.textBaseline = 'alphabetic';
  let tam = 72; g.font = `700 ${tam}px ${FD}`;
  while (g.measureText(t.rotulo).width > W - 96 && tam > 40) { tam -= 2; g.font = `700 ${tam}px ${FD}`; }
  g.fillStyle = '#fbeff4'; g.fillText(t.rotulo, 48, 240);
  if (pronto) {
    // selo verde: aprovado pela recepção
    g.font = `600 34px ${FT}`;
    const txt = 'Aprovado pela recepção';
    const sw = Math.min(W - 80, g.measureText(txt).width + 100);
    rr(g, 40, 280, sw, 80, 40);
    g.fillStyle = 'rgba(47,211,138,.18)'; g.fill();
    g.lineWidth = 3; g.strokeStyle = 'rgba(47,211,138,.85)'; g.stroke();
    g.beginPath(); g.arc(84, 320, 23, 0, Math.PI * 2); g.fillStyle = '#2fd38a'; g.fill();
    g.save(); g.translate(84 - 14, 320 - 14); g.scale(28 / 256, 28 / 256); g.fillStyle = '#0d2a1d'; g.fill(new Path2D(P.check)); g.restore();
    g.fillStyle = '#c9f9e2'; g.textBaseline = 'middle'; g.fillText(txt, 122, 322);
  } else {
    g.font = `400 34px ${FM}`; g.fillStyle = '#e2c6d4'; g.fillText(t.sub, 48, 300);
    // linhas de "trabalho por fazer"
    g.fillStyle = 'rgba(255,255,255,.10)';
    rr(g, 48, 336, 300, 14, 7); g.fill();
    rr(g, 364, 336, 140, 14, 7); g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = aniso;
  return tex;
}

// Versão do celular: menos detalhe, letras bem maiores (o cartão ocupa ~130px na tela).
function texturaCompacta(t: typeof TIPOS[number], pronto: boolean, aniso: number) {
  const W = 640, H = 400, c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d')!;
  rr(g, 3, 3, W - 6, H - 6, 46);
  const fundo = g.createLinearGradient(0, 0, W * .4, H);
  if (pronto) { fundo.addColorStop(0, '#2e1628'); fundo.addColorStop(1, '#140911'); }
  else { fundo.addColorStop(0, '#561c40'); fundo.addColorStop(1, '#220b1b'); }
  g.fillStyle = fundo; g.fill();
  rr(g, 3, 3, W - 6, H - 6, 46);
  g.lineWidth = 6; g.strokeStyle = pronto ? 'rgba(47,211,138,.85)' : 'rgba(255,170,205,.45)'; g.stroke();
  // ícone + rótulo grandes
  const cx = 86, cy = 100;
  g.beginPath(); g.arc(cx, cy, 52, 0, Math.PI * 2);
  g.fillStyle = pronto ? 'rgba(47,211,138,.16)' : 'rgba(255,45,120,.22)'; g.fill();
  g.save(); g.translate(cx - 34, cy - 34); g.scale(68 / 256, 68 / 256);
  g.fillStyle = pronto ? '#7ff0bd' : '#ff8fb8'; g.fill(new Path2D(t.icone)); g.restore();
  let tam = 88; g.font = `700 ${tam}px ${FD}`;
  const maxW = W - 176;
  while (g.measureText(t.rotulo).width > maxW && tam > 50) { tam -= 2; g.font = `700 ${tam}px ${FD}`; }
  g.fillStyle = '#fbeff4'; g.textBaseline = 'middle';
  if (g.measureText(t.rotulo).width > maxW) {
    // rótulo longo em duas linhas
    const [a, ...b] = t.rotulo.split(' ');
    g.fillText(a, 160, 70); g.fillText(b.join(' '), 160, 70 + tam * .95);
  } else g.fillText(t.rotulo, 160, 102);
  if (pronto) {
    rr(g, 30, 214, W - 60, 156, 40);
    g.fillStyle = 'rgba(47,211,138,.2)'; g.fill();
    g.lineWidth = 5; g.strokeStyle = '#2fd38a'; g.stroke();
    g.beginPath(); g.arc(100, 292, 40, 0, Math.PI * 2); g.fillStyle = '#2fd38a'; g.fill();
    g.save(); g.translate(100 - 24, 292 - 24); g.scale(48 / 256, 48 / 256); g.fillStyle = '#0d2a1d'; g.fill(new Path2D(P.check)); g.restore();
    g.fillStyle = '#d6fbe9'; g.font = `600 56px ${FT}`;
    g.fillText('Aprovado pela', 166, 258); g.fillText('recepção', 166, 326);
  } else {
    g.font = `400 50px ${FM}`; g.fillStyle = '#f0d4e2';
    let ts = 50; while (g.measureText(t.sub).width > W - 80 && ts > 34) { ts -= 2; g.font = `400 ${ts}px ${FM}`; }
    g.fillText(t.sub, 44, 262);
    g.fillStyle = 'rgba(255,255,255,.12)';
    rr(g, 44, 320, 330, 20, 10); g.fill();
    rr(g, 392, 320, 160, 20, 10); g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = aniso;
  return tex;
}

function texturaBrilho(cor: string) {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, cor); gr.addColorStop(.25, cor.replace(/[\d.]+\)$/, '.45)')); gr.addColorStop(.6, cor.replace(/[\d.]+\)$/, '.08)')); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const VERT = /* glsl */`
uniform float uT;
varying vec3 vN; varying vec3 vV; varying float vD; varying vec3 vP;
void main(){
  vec3 p = position;
  float d = sin(p.x*3.1+uT*1.3)*sin(p.y*2.7+uT*1.1)*sin(p.z*3.3+uT*.9);
  p += normal*d*.05;
  vD = d; vP = position;
  vec4 mv = modelViewMatrix*vec4(p,1.);
  vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix*mv;
}`;
const FRAG = /* glsl */`
uniform float uT; uniform float uPulso;
varying vec3 vN; varying vec3 vV; varying float vD; varying vec3 vP;
void main(){
  float ndv = max(dot(vN,vV),0.);
  float aro = pow(1.-ndv, 3.2);
  float plasma = sin(vP.y*6.+uT*1.6+sin(vP.x*4.+uT*.8)*2.)*sin(vP.z*5.-uT*1.1+vP.y*2.);
  plasma = plasma*.5+.5;
  vec3 fundo = vec3(.72,.03,.30);
  vec3 rosa = vec3(1.,.12,.45);
  vec3 coral = vec3(1.,.5,.34);
  vec3 quente = vec3(1.,.9,.95);
  vec3 c = mix(fundo, rosa, smoothstep(.15,.95,plasma)*.85+.1+vD*2.5);
  c = mix(c, coral, smoothstep(.75,1.,plasma)*.35);
  c += quente*pow(ndv,6.)*.35;
  c = mix(c, quente, aro*.9);
  c += rosa*uPulso*.8;
  gl_FragColor = vec4(c,1.);
}`;

export async function criarCena(o: OpcoesCena): Promise<Cena> {
  // espera as fontes para desenhar as texturas com a tipografia certa (sem travar se demorar)
  try {
    await Promise.race([
      Promise.all([document.fonts.load(`700 60px ${FD}`), document.fonts.load(`400 30px ${FM}`), document.fonts.load(`600 27px ${FT}`)]),
      new Promise(r => setTimeout(r, 1500)),
    ]);
  } catch { /* segue com fonte do sistema */ }

  const mob = o.celular;
  const renderer = new THREE.WebGLRenderer({antialias: !mob || devicePixelRatio < 2, alpha: true, powerPreference: 'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio, mob ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const canvas = renderer.domElement;
  canvas.className = 'ini-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  o.pai.appendChild(canvas);

  const cena = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 60);
  camera.position.set(0, 0, 11);

  const raiz = new THREE.Group(); cena.add(raiz);
  const mira = new THREE.Object3D(); raiz.add(mira);

  // luz
  cena.add(new THREE.AmbientLight(0xffd6e6, .55));
  const dir = new THREE.DirectionalLight(0xffffff, 1.4); dir.position.set(-4, 6, 8); cena.add(dir);
  const ponto = new THREE.PointLight(0xff2d78, 40, 14, 1.6); raiz.add(ponto);

  const descartar: {dispose(): void}[] = [];
  const guarda = <T extends {dispose(): void}>(x: T) => { descartar.push(x); return x; };

  // ---------- núcleo (a IA) ----------
  const nucleo = new THREE.Group(); raiz.add(nucleo);
  const uni = {uT: {value: 0}, uPulso: {value: 0}};
  const esfera = new THREE.Mesh(
    guarda(new THREE.IcosahedronGeometry(.82, mob ? 4 : 5)),
    guarda(new THREE.ShaderMaterial({uniforms: uni, vertexShader: VERT, fragmentShader: FRAG})),
  );
  nucleo.add(esfera);
  const texHalo = guarda(texturaBrilho('rgba(255,45,120,1)'));
  const texQuente = guarda(texturaBrilho('rgba(255,220,235,1)'));
  const halo = new THREE.Sprite(guarda(new THREE.SpriteMaterial({map: texHalo, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: .6})));
  halo.scale.setScalar(5.2); nucleo.add(halo);
  const haloLongo = new THREE.Sprite(guarda(new THREE.SpriteMaterial({map: texHalo, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: .28})));
  haloLongo.scale.setScalar(11); nucleo.add(haloLongo);
  const miolo = new THREE.Sprite(guarda(new THREE.SpriteMaterial({map: texQuente, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: .22})));
  miolo.scale.setScalar(2.1); nucleo.add(miolo);

  const matAnel = guarda(new THREE.MeshBasicMaterial({color: 0xff4d8d, transparent: true, opacity: .75, blending: THREE.AdditiveBlending, depthWrite: false}));
  const anel1 = new THREE.Mesh(guarda(new THREE.TorusGeometry(1.32, .012, 8, 160)), matAnel);
  anel1.rotation.set(1.2, .25, 0); nucleo.add(anel1);
  const matAnel2 = guarda(new THREE.MeshBasicMaterial({color: 0xff9a74, transparent: true, opacity: .45, blending: THREE.AdditiveBlending, depthWrite: false}));
  const anel2 = new THREE.Mesh(guarda(new THREE.TorusGeometry(1.62, .007, 6, 180)), matAnel2);
  anel2.rotation.set(1.75, -.5, .3); nucleo.add(anel2);
  // marcas em volta do anel (pontinhos)
  const nMarcas = 72, posM = new Float32Array(nMarcas * 3);
  for (let i = 0; i < nMarcas; i++) { const a = i / nMarcas * Math.PI * 2; posM[i * 3] = Math.cos(a) * 1.95; posM[i * 3 + 1] = Math.sin(a) * 1.95; }
  const geoM = guarda(new THREE.BufferGeometry()); geoM.setAttribute('position', new THREE.BufferAttribute(posM, 3));
  const texPonto = guarda(texturaBrilho('rgba(255,190,215,1)'));
  const marcas = new THREE.Points(geoM, guarda(new THREE.PointsMaterial({size: .07, map: texPonto, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffb3cd})));
  marcas.rotation.set(1.2, .25, 0); nucleo.add(marcas);
  // onda de choque quando um cartão passa pelo núcleo
  const matOnda = guarda(new THREE.MeshBasicMaterial({color: 0xff6fa3, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide}));
  const onda = new THREE.Mesh(guarda(new THREE.RingGeometry(.96, 1, 96)), matOnda);
  nucleo.add(onda);

  // poeira de luz
  const nP = mob ? 160 : 320, posP = new Float32Array(nP * 3);
  for (let i = 0; i < nP; i++) {
    const r = 1.3 + Math.pow(Math.random(), .7) * 4.8, a = Math.random() * Math.PI * 2, y = (Math.random() - .5) * 4.2;
    posP[i * 3] = Math.cos(a) * r; posP[i * 3 + 1] = y * (.4 + r * .1); posP[i * 3 + 2] = Math.sin(a) * r * .8;
  }
  const geoP = guarda(new THREE.BufferGeometry()); geoP.setAttribute('position', new THREE.BufferAttribute(posP, 3));
  const poeira = new THREE.Points(geoP, guarda(new THREE.PointsMaterial({size: .06, map: texPonto, transparent: true, opacity: .7, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xff9cc0})));
  raiz.add(poeira);

  // ---------- cartões ----------
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const tx = mob ? texturaCompacta : texturaCartao;
  const texCaos = TIPOS.map(t => guarda(tx(t, false, aniso)));
  const texOk = TIPOS.map(t => guarda(tx(t, true, aniso)));
  const CW = 1.6, CH = 1.0, CR = .15;
  const forma = new THREE.Shape();
  forma.moveTo(-CW / 2 + CR, -CH / 2); forma.lineTo(CW / 2 - CR, -CH / 2); forma.quadraticCurveTo(CW / 2, -CH / 2, CW / 2, -CH / 2 + CR);
  forma.lineTo(CW / 2, CH / 2 - CR); forma.quadraticCurveTo(CW / 2, CH / 2, CW / 2 - CR, CH / 2);
  forma.lineTo(-CW / 2 + CR, CH / 2); forma.quadraticCurveTo(-CW / 2, CH / 2, -CW / 2, CH / 2 - CR);
  forma.lineTo(-CW / 2, -CH / 2 + CR); forma.quadraticCurveTo(-CW / 2, -CH / 2, -CW / 2 + CR, -CH / 2);
  const geoCorpo = guarda(new THREE.ExtrudeGeometry(forma, {depth: .035, bevelEnabled: true, bevelThickness: .018, bevelSize: .018, bevelSegments: 3, curveSegments: 8}));
  geoCorpo.translate(0, 0, -.0175);
  const geoFace = guarda(new THREE.PlaneGeometry(CW, CH));
  const texBrilhoCartao = guarda(texturaBrilho('rgba(255,45,120,1)'));

  // um de cada tipo: nunca dois iguais na tela. No celular, 5 cartões maiores.
  const ordemTipos = mob ? [0, 1, 2, 3, 4] : [0, 1, 2, 3, 4, 5];
  const cartoes: Cartao[] = ordemTipos.map((tipo, i) => {
    const g = new THREE.Group();
    const matCorpo = guarda(new THREE.MeshStandardMaterial({color: 0x3c1430, roughness: .28, metalness: .15, emissive: 0x2a0a1e, emissiveIntensity: .6, transparent: true, opacity: .96}));
    const corpo = new THREE.Mesh(geoCorpo, matCorpo);
    const matFace = guarda(new THREE.MeshBasicMaterial({map: texCaos[tipo], transparent: true, toneMapped: false}));
    const face = new THREE.Mesh(geoFace, matFace); face.position.z = .041;
    const matBrilho = guarda(new THREE.SpriteMaterial({map: texBrilhoCartao, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: .0}));
    const brilho = new THREE.Sprite(matBrilho); brilho.scale.set(3.4, 2.4, 1); brilho.position.z = -.2;
    g.add(brilho, corpo, face);
    g.userData.i = i;
    raiz.add(g);
    const eixo = new THREE.Quaternion().setFromEuler(new THREE.Euler((Math.random() - .5) * .9, 0, (Math.random() - .5) * .8));
    return {
      g, matCorpo, matFace, matBrilho, tipo, estado: 'orbita' as Estado, anim: null, antes: 'orbita' as Estado,
      r: 2.3 + (i % 3) * .5 + Math.random() * .2, vel: (.16 + Math.random() * .1) * (i % 2 ? 1 : -1), fase: i / ordemTipos.length * Math.PI * 2,
      eixo, tumble: new THREE.Vector3(Math.random() * 6, Math.random() * 6, Math.random() * 6), opac: 1,
    };
  });

  // ---------- layout responsivo ----------
  const lay = {nucleo: new THREE.Vector3(), pilha: new THREE.Vector3(), passo: new THREE.Vector3(), foco: new THREE.Vector3(), escPilha: .8, escOrb: .82, orb: 1};
  let largura = 1, altura = 1;
  function layout() {
    const asp = largura / altura;
    camera.aspect = asp;
    if (mob) {
      camera.position.z = asp < .8 ? 11 : 9.4;
      lay.nucleo.set(-.4, .05, 0);
      lay.pilha.set(1.2, -1.5, 1.2); lay.passo.set(-.08, .36, -.3);
      lay.foco.set(0, .05, 3.2); lay.escPilha = 1.42; lay.escOrb = 1.3; lay.orb = .82;
    } else {
      // coluna da cena mais estreita: afasta a câmera para caber tudo
      camera.position.z = asp < 1.15 ? 11 * (1.15 / asp) : 11;
      lay.nucleo.set(.2, .75, 0);
      lay.pilha.set(1.85, -1.7, 1.7); lay.passo.set(-.1, .62, -.36);
      lay.foco.set(.3, .35, 4.4); lay.escPilha = .95; lay.escOrb = .86; lay.orb = 1;
    }
    camera.updateProjectionMatrix();
    nucleo.position.copy(lay.nucleo); ponto.position.copy(lay.nucleo); poeira.position.copy(lay.nucleo);
  }

  // ---------- poses ----------
  const tmpV = new THREE.Vector3(), tmpQ = new THREE.Quaternion(), tmpE = new THREE.Euler();
  function olhar(p: THREE.Vector3, q: THREE.Quaternion) {
    mira.position.copy(p); mira.lookAt(camera.position); q.copy(mira.quaternion);
  }
  let tempo = 0;
  function poseOrbita(c: Cartao, t: number, out: Pose) {
    const a = c.fase + t * c.vel;
    out.p.set(Math.cos(a) * c.r * lay.orb, Math.sin(t * .7 + c.fase * 2) * .3, Math.sin(a) * c.r * .75 * lay.orb).applyQuaternion(c.eixo).add(lay.nucleo);
    olhar(out.p, out.q);
    tmpE.set(Math.sin(t * .6 + c.tumble.x) * .45, Math.sin(t * .5 + c.tumble.y) * .55, Math.sin(t * .4 + c.tumble.z) * .35);
    out.q.multiply(tmpQ.setFromEuler(tmpE));
    // cartões atrás do núcleo ficam um pouco menores/mais fracos (profundidade)
    const z = out.p.z - lay.nucleo.z;
    out.s = lay.escOrb * (1 + z * .04);
    // só a camada da frente tem texto legível; atrás do núcleo os cartões viram vulto
    out.o = .3 + .7 * THREE.MathUtils.smoothstep(z, -.5, .5);
    return out;
  }
  function posePilha(k: number, out: Pose) {
    out.p.copy(lay.pilha).addScaledVector(lay.passo, k);
    olhar(out.p, out.q);
    tmpE.set(0, -.18, .02); out.q.multiply(tmpQ.setFromEuler(tmpE));
    out.s = lay.escPilha * (1 - k * .04); out.o = 1;
    return out;
  }
  const novaPose = (): Pose => ({p: new THREE.Vector3(), q: new THREE.Quaternion(), s: 1, o: 1});
  const poseAtual = (c: Cartao): Pose => ({p: c.g.position.clone(), q: c.g.quaternion.clone(), s: c.g.scale.x, o: c.opac});

  const pilha: Cartao[] = [];
  function animar(c: Cartao, alvo: () => Pose, dur: number, ease: (x: number) => number, arco = 0, fim?: () => void) {
    c.anim = {t0: tempo, dur, de: poseAtual(c), alvo, ease, arco, fim};
  }
  const pNucleo = (): Pose => { const r = novaPose(); r.p.copy(lay.nucleo); olhar(r.p, r.q); r.s = .12; r.o = 1; return r; };
  const tmpPose = novaPose();
  const poseSlot = (c: Cartao) => () => posePilha(pilha.indexOf(c), novaPose());
  const poseOrb = (c: Cartao) => () => poseOrbita(c, tempo, novaPose());
  let pulso = 0, onda_t = -1;

  function puxar() {
    const livres = cartoes.filter(c => c.estado === 'orbita' && !c.anim);
    if (!livres.length) return;
    // prefere um cartão da frente (mais visível)
    livres.sort((a, b) => b.g.position.z - a.g.position.z);
    const c = livres[Math.floor(Math.random() * Math.min(3, livres.length))];
    c.estado = 'entrando';
    animar(c, pNucleo, 1.05, easeIn, .6, () => {
      c.matFace.map = texOk[c.tipo]; c.matFace.needsUpdate = true;
      pulso = 1; onda_t = tempo;
      c.estado = 'saindo-nucleo';
      pilha.unshift(c);
      // os outros descem um degrau
      pilha.forEach((o2, k) => { if (k > 0 && o2.estado === 'pilha') animar(o2, poseSlot(o2), .7, easeIO); });
      animar(c, poseSlot(c), 1.1, easeOut, -.4, () => { c.estado = 'pilha'; });
      c.matBrilho.opacity = .55;
      if (pilha.length > 2) deixar(pilha[pilha.length - 1]);
    });
  }
  function deixar(c: Cartao) {
    pilha.splice(pilha.indexOf(c), 1);
    c.estado = 'deixando';
    const saida = () => { const r = poseAtual(c); r.p.add(tmpV.set(.25, .5, -1.6)); r.o = 0; r.s *= .6; return r; };
    const fixo = saida();
    animar(c, () => fixo, .6, easeIn, 0, () => {
      c.matFace.map = texCaos[c.tipo]; c.matFace.needsUpdate = true; c.matBrilho.opacity = 0;
      c.fase = Math.random() * Math.PI * 2 - tempo * c.vel;
      c.estado = 'voltando';
      const ini = poseOrbita(c, tempo, novaPose()); ini.s = 0; ini.o = 0;
      c.g.position.copy(ini.p); c.g.quaternion.copy(ini.q); c.g.scale.setScalar(0); c.opac = 0;
      animar(c, poseOrb(c), 1.2, easeOut, 0, () => { c.estado = 'orbita'; });
    });
  }

  // ---------- foco (clique/toque) ----------
  let foco: Cartao | null = null, focoAte = 0;
  const leg = o.legenda;
  const legTexto = leg?.querySelector('[data-legenda-texto]') as HTMLElement | null;
  const legPadrao = legTexto?.innerHTML ?? '';
  function focar(c: Cartao) {
    if (foco === c) { soltar(); return; }
    if (foco) soltar();
    if (c.estado === 'entrando' || c.estado === 'saindo-nucleo' || c.estado === 'deixando') return;
    foco = c; c.antes = c.estado === 'voltando' ? 'orbita' : c.estado; c.estado = 'foco';
    focoAte = tempo + 5;
    animar(c, () => { const r = novaPose(); r.p.copy(lay.foco); olhar(r.p, r.q); r.s = 1.15; r.o = 1; return r; }, .7, easeOut);
    c.matBrilho.opacity = .7;
    if (legTexto && leg) { legTexto.textContent = TIPOS[c.tipo].legenda; leg.classList.add('is-on'); }
  }
  function soltar() {
    const c = foco; if (!c) return;
    foco = null;
    if (c.antes === 'pilha' && pilha.includes(c)) { c.estado = 'pilha'; animar(c, poseSlot(c), .8, easeIO); c.matBrilho.opacity = .55; }
    else { c.estado = 'voltando'; c.matBrilho.opacity = 0; animar(c, poseOrb(c), 1, easeIO, 0, () => { c.estado = 'orbita'; }); }
    if (legTexto && leg) { legTexto.innerHTML = legPadrao; leg.classList.remove('is-on'); }
    proxPuxao = Math.max(proxPuxao, tempo + 1.5);
  }

  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  function acertar(x: number, y: number): Cartao | null {
    const r = canvas.getBoundingClientRect();
    ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(cartoes.map(c => c.g), true);
    for (const h of hits) {
      if ((h.object as THREE.Sprite).isSprite) continue;
      let ob: THREE.Object3D | null = h.object;
      while (ob && ob.userData.i === undefined) ob = ob.parent;
      if (ob) { const c = cartoes[ob.userData.i]; if (c.opac > .4) return c; }
    }
    return null;
  }
  let down: {x: number; y: number; t: number} | null = null;
  const onDown = (e: PointerEvent) => { down = {x: e.clientX, y: e.clientY, t: performance.now()}; };
  const onUp = (e: PointerEvent) => {
    if (!down) return;
    const ok = Math.hypot(e.clientX - down.x, e.clientY - down.y) < 10 && performance.now() - down.t < 600;
    down = null;
    if (!ok) return;
    const c = acertar(e.clientX, e.clientY);
    if (c) focar(c); else if (foco) soltar();
  };
  let hoverXY: [number, number] | null = null;
  const onHover = (e: PointerEvent) => { if (e.pointerType === 'mouse') hoverXY = [e.clientX, e.clientY]; };
  const onSai = () => { hoverXY = null; canvas.style.cursor = ''; };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointermove', onHover);
  canvas.addEventListener('pointerleave', onSai);

  // inclinação pelo mouse/toque
  const incl = {x: 0, y: 0, ax: 0, ay: 0};
  const onMove = (e: PointerEvent) => {
    const r = o.area.getBoundingClientRect();
    incl.ax = ((e.clientX - r.left) / r.width - .5) * 2;
    incl.ay = ((e.clientY - r.top) / r.height - .5) * 2;
  };
  o.area.addEventListener('pointermove', onMove, {passive: true});

  // ---------- tamanho ----------
  const ro = new ResizeObserver(() => {
    const w = o.pai.clientWidth, h = o.pai.clientHeight;
    if (!w || !h) return;
    largura = w; altura = h;
    renderer.setSize(w, h, false);
    layout();
    if (!rodando) desenhar(0);
  });
  ro.observe(o.pai);
  largura = o.pai.clientWidth || 1; altura = o.pai.clientHeight || 1;
  renderer.setSize(largura, altura, false);
  layout();

  // posição inicial: tudo em órbita, já com 2 cartões arrumados na pilha
  cartoes.forEach(c => {
    const p = poseOrbita(c, 0, tmpPose); c.g.position.copy(p.p); c.g.quaternion.copy(p.q); c.g.scale.setScalar(p.s); c.opac = p.o;
  });
  [cartoes[4]].forEach(c => {
    c.estado = 'pilha'; pilha.push(c); c.matFace.map = texOk[c.tipo]; c.matBrilho.opacity = .55;
  });
  pilha.forEach((c, k) => { const p = posePilha(k, tmpPose); c.g.position.copy(p.p); c.g.quaternion.copy(p.q); c.g.scale.setScalar(p.s); c.opac = p.o; });

  let proxPuxao = 1.6;
  const pose = novaPose();

  function desenhar(dt: number) {
    tempo += dt;
    const t = tempo;
    // inclinação (lerp) + respiração lenta
    incl.x += (incl.ay * .14 - incl.x) * .05;
    incl.y += (incl.ax * .26 - incl.y) * .05;
    raiz.rotation.set(incl.x + Math.sin(t * .23) * .04, incl.y + Math.sin(t * .17) * .08, 0);

    // núcleo
    pulso *= Math.pow(.04, dt);
    uni.uT.value = t; uni.uPulso.value = pulso;
    const resp = 1 + Math.sin(t * 1.3) * .035 + pulso * .14;
    esfera.scale.setScalar(resp);
    esfera.rotation.y = t * .2;
    halo.scale.setScalar(5.2 * (1 + Math.sin(t * 1.3) * .05 + pulso * .3));
    (halo.material as THREE.SpriteMaterial).opacity = .55 + pulso * .35;
    miolo.scale.setScalar(2.1 * (1 + pulso * .5));
    anel1.rotation.z = t * .35; marcas.rotation.z = t * .35;
    anel2.rotation.z = -t * .22;
    anel1.scale.setScalar(1 + pulso * .08);
    poeira.rotation.y = t * .04;
    if (onda_t >= 0) {
      const k = (t - onda_t) / 1.1;
      if (k >= 1) { onda_t = -1; matOnda.opacity = 0; }
      else { onda.scale.setScalar(1 + k * 3.2); matOnda.opacity = (1 - k) * .8; olhar(lay.nucleo, onda.quaternion); }
    }

    // ciclo: puxa um cartão a cada ~4 s (pausa enquanto há foco)
    if (foco && t > focoAte) soltar();
    if (!foco && t > proxPuxao) { puxar(); proxPuxao = t + 4; }

    // cartões
    for (const c of cartoes) {
      if (c.anim) {
        const a = c.anim;
        const k = Math.min(1, (t - a.t0) / a.dur), e = a.ease(k);
        const alvo = a.alvo();
        pose.p.lerpVectors(a.de.p, alvo.p, e);
        if (a.arco) pose.p.y += Math.sin(e * Math.PI) * a.arco;
        pose.q.slerpQuaternions(a.de.q, alvo.q, e);
        c.g.position.copy(pose.p); c.g.quaternion.copy(pose.q);
        c.g.scale.setScalar(a.de.s + (alvo.s - a.de.s) * e);
        c.opac = a.de.o + (alvo.o - a.de.o) * e;
        if (k >= 1) { c.anim = null; a.fim?.(); }
      } else if (c.estado === 'orbita') {
        poseOrbita(c, t, pose);
        c.g.position.copy(pose.p); c.g.quaternion.copy(pose.q); c.g.scale.setScalar(pose.s); c.opac = pose.o;
      } else if (c.estado === 'pilha') {
        const k = pilha.indexOf(c);
        posePilha(k, pose);
        pose.p.y += Math.sin(t * 1.1 + k) * .03;
        c.g.position.copy(pose.p); c.g.quaternion.copy(pose.q);
      } else if (c.estado === 'foco') {
        c.g.position.y = lay.foco.y + Math.sin(t * 1.4) * .04;
      }
      c.matFace.opacity = c.opac;
      c.matCorpo.opacity = c.opac;
      c.g.visible = c.opac > .01 && c.g.scale.x > .01;
    }

    if (hoverXY) { canvas.style.cursor = acertar(hoverXY[0], hoverXY[1]) ? 'pointer' : ''; hoverXY = null; }
    renderer.render(cena, camera);
  }

  let raf = 0, rodando = false, ultimo = 0, avisou = false;
  function quadro(agora: number) {
    if (!rodando) return;
    const dt = Math.min(.05, (agora - ultimo) / 1000 || 0);
    ultimo = agora;
    desenhar(dt);
    if (!avisou) { avisou = true; o.aoPronto?.(); }
    raf = requestAnimationFrame(quadro);
  }

  return {
    ligar(v: boolean) {
      if (v && !rodando) { rodando = true; ultimo = performance.now(); raf = requestAnimationFrame(quadro); }
      else if (!v && rodando) { rodando = false; cancelAnimationFrame(raf); }
    },
    destruir() {
      rodando = false; cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointermove', onHover);
      canvas.removeEventListener('pointerleave', onSai);
      o.area.removeEventListener('pointermove', onMove);
      descartar.forEach(d => d.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
