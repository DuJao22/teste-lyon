export type SceneRole = 'hook' | 'body' | 'climax' | 'closing';
export type FallbackKind = 'kinetic' | 'burst' | 'tunnel' | 'grid' | 'orbit' | 'cube' | 'closing';
export type StructureKind = 'crescendo' | 'explosao_respiro' | 'uniforme';
export type TransitionKind = 'flash' | 'wipe_h' | 'wipe_v' | 'crossfade' | 'glitch' | 'zoom';

export interface Palette {
  bg1: string;
  bg2: string;
  acc: string;
  acc2: string;
  fg: string;
  dim: string;
}

export interface DNA {
  structure: StructureKind;
  transition: TransitionKind;
  estilo: string;
  estilo_desc?: string;
  universo_visual?: string;
  client_intent?: string;
  narrative_thread?: string;
  visual_motifs?: string[];
  voice_name?: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
  pal: Palette;
  bpm: number;
  energy: number;
  hue?: number;
}

export interface SceneVisualCheck {
  passed: boolean;
  motionScore: number; // % de variação de pixels entre t=0.15, t=0.50 e t=0.85
  coverageScore: number; // % de elementos visuais ativos em relação ao fundo
  reviewNote: string;
  snapshots?: string[]; // dataURLs dos quadros capturados (15%, 50%, 85%)
  repaired?: boolean;
}

export interface SceneSpec {
  role: SceneRole;
  text: string;
  sub: string;
  narration?: string; // Locução falada na cena (praticamente tudo que é falado aparece escrito na tela)
  voiceAudioBase64?: string; // Áudio neural gerado (WAV/PCM base64)
  voiceMimeType?: string;
  idea: string;
  layout_mode?: string;
  camera_motion?: string;
  visual_bridge?: string;
  transition_out?: TransitionKind;
  weight?: number;
  dur: number;
  seed: number;
  fb: FallbackKind;
  code: string | null;
  origem: 'gemini' | 'biblioteca' | 'fallback' | 'custom';
  status?: 'idle' | 'compiling' | 'reviewing' | 'revisando' | 'ready' | 'fallback';
  compileMs?: number;
  start?: number;
  agentId?: 1 | 2;
  fileName?: string;
  visualCheck?: SceneVisualCheck;
}

export interface ShowreelData {
  title: string;
  prompt?: string;
  W: number;
  H: number;
  duration: number;
  dna: DNA;
  scenes: SceneSpec[];
}

export interface SceneLibraryEntry {
  id: string;
  role: SceneRole;
  idea: string;
  text?: string;
  estilo: string;
  code: string;
  createdAt: string;
}

export const ROLES: SceneRole[] = ['hook', 'body', 'climax', 'closing'];
export const FALLBACKS: FallbackKind[] = ['kinetic', 'burst', 'tunnel', 'grid', 'orbit', 'cube'];
export const STRUCTURES: { id: StructureKind; label: string; desc: string }[] = [
  { id: 'crescendo', label: 'Crescendo', desc: 'Acelera gradualmente até o clímax' },
  { id: 'explosao_respiro', label: 'Explosão & Respiro', desc: 'Alterna cortes rápidos e pausas visuais' },
  { id: 'uniforme', label: 'Cadência Uniforme', desc: 'Pulso constante sincronizado ao BPM' },
];

export const TRANSITIONS: { id: TransitionKind; label: string }[] = [
  { id: 'wipe_h', label: 'Wipe Horizontal' },
  { id: 'wipe_v', label: 'Wipe Vertical' },
  { id: 'zoom', label: 'Zoom Inercial' },
  { id: 'glitch', label: 'Glitch Slice' },
  { id: 'crossfade', label: 'Crossfade' },
  { id: 'flash', label: 'Flash Cut' },
];

export const STYLES: { name: string; desc: string }[] = [
  {
    name: 'direção de arte autoral sob medida',
    desc: 'linguagem visual, metáforas, tipografia e atmosfera criadas exclusivamente para o pedido do cliente',
  },
  {
    name: 'narrativa cinética editorial',
    desc: 'composições assimétricas, contrastes dramáticos de escala, recortes geométricos e transições orgânicas',
  },
  {
    name: 'imersão espacial 3D & luz',
    desc: 'arquitetura em perspectiva, partículas com profundidade de campo e iluminação volumétrica',
  },
  {
    name: 'fluxo orgânico sensorial',
    desc: 'ondas fluidas, curvas bezier vivas, texturas naturais e movimento contínuo entre cenas',
  },
  {
    name: 'brutalismo gráfico de alto impacto',
    desc: 'diagonais agressivas, blocos modulares vivos, tipografia monumental e cortes sincopados',
  },
  {
    name: 'engenharia visual & precisão',
    desc: 'telemetria viva, diagramas animados, vetores paramétricos e estética de alta tecnologia',
  },
];

export const INITIAL_SHOWREEL: ShowreelData = {
  title: 'MICRO SAAS ELITE - LAYON DEVS',
  prompt:
    'Showreel vertical de 30 segundos para Micro SaaS Elite: ideia e IA, criacao de SaaS, Python, frontend, SQLite, automacao, deploy, monetizacao e assinatura final Layon Devs.',
  W: 720,
  H: 1280,
  duration: 30,
  dna: {
    structure: 'crescendo',
    transition: 'zoom',
    estilo: 'Arquitetura SaaS Elite & Engenharia IA',
    estilo_desc:
      'Interfaces premium em camadas de vidro escuro, feixes neurais ciano e esmeralda, telemetria viva de software e tipografia monumental sincronizada com a locução Aoede',
    client_intent:
      'Apresentar Micro SaaS Elite e mostrar como criar, publicar e monetizar um produto digital com IA',
    narrative_thread:
      'Da ideia ao produto SaaS: IA, stack tecnica, automacao, deploy, monetizacao e assinatura Layon Devs.',
    visual_motifs: [
      'interface SaaS premium em camadas',
      'linhas de código brilhantes',
      'núcleo de inteligência artificial',
      'gráficos e métricas em ascensão',
    ],
    voice_name: 'Kore',
    pal: {
      bg1: '#05070f',
      bg2: '#0d1528',
      acc: '#00f5a0',
      acc2: '#00d9f5',
      fg: '#f8fafc',
      dim: '#94a3b8',
    },
    bpm: 124,
    energy: 4,
    hue: 0.46,
  },
  scenes: [
    {
      role: 'hook',
      text: 'SUA IDEIA VIRA SAAS',
      sub: 'Crie seu produto digital com Python e inteligencia artificial.',
      narration:
        'Sua ideia vira SaaS. Crie seu proprio produto digital com Python e inteligencia artificial.',
      idea: 'Nucleo de IA e linhas de codigo construindo um produto digital',
      layout_mode: 'topo_assimetrico_terminal_ia',
      camera_motion: 'ascensao_vertical_lenta',
      visual_bridge: 'As linhas de código convergem para construir a interface SaaS da Cena 2',
      transition_out: 'zoom',
      dur: 4.8,
      seed: 104921,
      fb: 'kinetic',
      origem: 'gemini',
      status: 'ready',
      agentId: 1,
      fileName: 'cena_01_hook.js',
      compileMs: 4,
      code: `const R=M.rng(P.seed),e=M.ease.outExpo(M.p(ts,0,.85));
const cx=W*.5,cy=H*.38;
const g=ctx.createRadialGradient(cx,cy,10,cx,cy,W*.75);
g.addColorStop(0,M.col(P.pal.acc2,.35*e));g.addColorStop(.5,M.col(P.pal.acc,.12*e));g.addColorStop(1,'rgba(0,0,0,0)');
ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
// Janela de código iluminada em perspectiva
const winW=W*.84*e,winH=H*.34*e,wx=(W-winW)/2,wy=H*.21;
ctx.fillStyle=M.col(P.pal.bg2,.88);M.rrect(ctx,wx,wy,winW,winH,18);ctx.fill();
ctx.strokeStyle=M.col(P.pal.acc2,.65);ctx.lineWidth=2.5;ctx.stroke();
for(let d=0;d<3;d++){
  ctx.fillStyle=d===0?'#ff5f56':d===1?'#ffbd2e':P.pal.acc;
  ctx.beginPath();ctx.arc(wx+26+d*20,wy+24,6,0,7);ctx.fill();
}
for(let l=0;l<9;l++){
  const lp=M.ease.outCubic(M.stagger(ts,l,.08,.05,.45));
  const lw=(W*(.18+R()*.48))*lp;
  const indent=(l%3)*24;
  ctx.fillStyle=M.col(l%2?P.pal.acc:P.pal.acc2,.35+.45*lp);
  M.rrect(ctx,wx+28+indent,wy+56+l*34,lw,12,6);ctx.fill();
}
// Núcleo neural pulsando sobre o código
const coreR=W*(.09+.02*P.pulse)*e;
ctx.strokeStyle=P.pal.acc;ctx.lineWidth=3.5;
ctx.beginPath();ctx.arc(cx,wy+winH*.55,coreR*1.45,ts*2,ts*2+4.5);ctx.stroke();
ctx.fillStyle=M.col(P.pal.acc2,.9);ctx.beginPath();ctx.arc(cx,wy+winH*.55,coreR*.65,0,7);ctx.fill();
const L=M.lines(P.text,12),fs=M.fit(ctx,'MICRO SAAS',W*.84,W*.13);
L.forEach((line,i)=>{
  const st=M.ease.outBack(M.stagger(ts,i,.05,.09,.45));
  M.text(ctx,line,W*.5,H*.62+i*fs*1.12,fs,{color:i===L.length-1?P.pal.acc:P.pal.fg,alpha:st,glow:P.pal.acc2});
});`,
    },
    {
      role: 'body',
      text: 'CRIE COM IA',
      sub: 'Transforme uma ideia em um sistema funcional com IA ao seu lado.',
      narration:
        'Crie com inteligencia artificial. Transforme uma ideia em um sistema funcional.',
      idea: 'Interface SaaS moderna se montando em cards e metricas',
      layout_mode: 'dashboard_modular_dinamico',
      camera_motion: 'travelling_ascendente',
      visual_bridge: 'Os cards da interface expandem em profundidade 3D para a Cena 3',
      transition_out: 'wipe_h',
      dur: 4.8,
      seed: 382910,
      fb: 'grid',
      origem: 'gemini',
      status: 'ready',
      agentId: 2,
      fileName: 'cena_02_body.js',
      compileMs: 4,
      code: `const e=M.ease.outExpo(M.p(ts,0,.75));
// Cards modulares de UI SaaS se encaixando
const cards=[
  {x:W*.08,y:H*.26,w:W*.4,h:H*.16,c:P.pal.acc},
  {x:W*.52,y:H*.26,w:W*.4,h:H*.16,c:P.pal.acc2},
  {x:W*.08,y:H*.45,w:W*.84,h:H*.24,c:P.pal.acc}
];
cards.forEach((cd,i)=>{
  const st=M.ease.outBack(M.stagger(ts,i,.05,.12,.5));
  const dy=(1-st)*60;
  ctx.save();ctx.globalAlpha=M.clamp(st);
  ctx.fillStyle=M.col(P.pal.bg2,.9);
  M.rrect(ctx,cd.x,cd.y+dy,cd.w,cd.h,16);ctx.fill();
  ctx.strokeStyle=M.col(cd.c,.65);ctx.lineWidth=2.5;ctx.stroke();
  ctx.fillStyle=M.col(cd.c,.25);M.rrect(ctx,cd.x+18,cd.y+dy+18,cd.w*.45,14,7);ctx.fill();
  ctx.restore();
});
// Gráfico de crescimento subindo no card principal
const gx=W*.13,gy=H*.64,gw=W*.74,gh=H*.14;
ctx.beginPath();
for(let k=0;k<=24;k++){
  const p=k/24,px=gx+p*gw;
  const prog=M.clamp((ts*1.2)-p*.5);
  const py=gy-Math.pow(p,1.5)*gh*prog-Math.sin(p*8+ts*4)*8*prog;
  if(k===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
}
ctx.strokeStyle=P.pal.acc;ctx.lineWidth=5;ctx.stroke();
const L=M.lines(P.text,14),fs=M.fit(ctx,'O JOGO MUDOU',W*.86,W*.125);
L.forEach((l,i)=>{
  const st=M.ease.outExpo(M.stagger(ts,i,.04,.09,.42));
  M.text(ctx,l,W*.5,H*.13+i*fs*1.12,fs,{color:i===1?P.pal.acc:P.pal.fg,alpha:st,glow:P.pal.acc});
});`,
    },
    {
      role: 'body',
      text: 'PYTHON. FRONTEND. SQLITE.',
      sub: 'Backend, interface profissional, autenticacao e banco de dados.',
      narration:
        'Python, frontend e SQLite. Aprenda backend, autenticacao e banco de dados.',
      idea: 'Ecossistema SaaS conectando Python, interface web e banco de dados SQLite',
      layout_mode: 'orbita_3d_ecossistema',
      camera_motion: 'orbita_perspectiva_3d',
      visual_bridge: 'O cubo central dispara feixes de deploy para a nuvem da Cena 4',
      transition_out: 'wipe_v',
      dur: 5.2,
      seed: 591823,
      fb: 'cube',
      origem: 'gemini',
      status: 'ready',
      agentId: 1,
      fileName: 'cena_03_body.js',
      compileMs: 5,
      code: `const cx=W*.5,cy=H*.44,e=M.ease.outCubic(M.p(ts,0,.7));
const s=W*.2*e*(1+P.pulse*.07);
const V=[[-s,-s,-s],[s,-s,-s],[s,s,-s],[-s,s,-s],[-s,-s,s],[s,-s,s],[s,s,s],[-s,s,s]];
const E=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
const Q=V.map(v=>M.proj(M.rot3(v,ts*.7,ts*1.1,ts*.4),W,H,800,cx,cy));
ctx.lineWidth=3.2;
E.forEach((ed,i)=>{
  ctx.strokeStyle=M.col(i%2?P.pal.acc:P.pal.acc2,.9);
  ctx.beginPath();ctx.moveTo(Q[ed[0]].x,Q[ed[0]].y);ctx.lineTo(Q[ed[1]].x,Q[ed[1]].y);ctx.stroke();
});
for(let k=0;k<6;k++){
  const a=ts*1.3+k*Math.PI/3,r=W*.34*e;
  const nx=cx+Math.cos(a)*r,ny=cy+Math.sin(a)*r*.58;
  ctx.strokeStyle=M.col(P.pal.acc2,.4);ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(nx,ny);ctx.stroke();
  ctx.fillStyle=P.pal.bg2;M.rrect(ctx,nx-42,ny-22,84,44,10);ctx.fill();
  ctx.strokeStyle=k%2?P.pal.acc:P.pal.acc2;ctx.stroke();
  ctx.fillStyle=k%2?P.pal.acc:P.pal.acc2;ctx.beginPath();ctx.arc(nx,ny,7+P.pulse*3,0,7);ctx.fill();
}
const L=M.lines(P.text,14),fs=M.fit(ctx,'ARQUITETURA',W*.86,W*.12);
L.forEach((l,i)=>{
  M.text(ctx,l,W*.5,H*.14+i*fs*1.12,fs*e,{color:i===0?P.pal.fg:P.pal.acc2,glow:P.pal.acc});
});`,
    },
    {
      role: 'body',
      text: 'AUTOMATIZE. PUBLIQUE. CRESCA.',
      sub: 'Automatize processos e publique seu produto na internet.',
      narration:
        'Automatize, publique e cresca. Coloque seu produto digital na internet.',
      idea: 'Pipeline visual de automacao e deploy com telemetria de software',
      layout_mode: 'fluxo_pipeline_vertical',
      camera_motion: 'tilt_up_veloz',
      visual_bridge: 'O feixe de deploy ilumina a interface premium principal da Formação Mini SaaS Elite na Cena 5',
      transition_out: 'flash',
      dur: 4.8,
      seed: 774120,
      fb: 'tunnel',
      origem: 'gemini',
      status: 'ready',
      agentId: 2,
      fileName: 'cena_04_body.js',
      compileMs: 4,
      code: `const e=M.ease.outExpo(M.p(ts,0,.7));
for(let col=0;col<7;col++){
  const x=W*(.12+col*.126);
  ctx.strokeStyle=M.col(col%2?P.pal.acc:P.pal.acc2,.22);
  ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,H*.18);ctx.lineTo(x,H*.72);ctx.stroke();
  for(let p=0;p<3;p++){
    const py=H*.72-(((ts*320*(1+col*.1)+p*220)%(H*.54)));
    ctx.fillStyle=col%2?P.pal.acc:P.pal.acc2;
    M.rrect(ctx,x-5,py,10,36,5);ctx.fill();
  }
}
const cx=W*.5,cy=H*.45;
for(let r=0;r<4;r++){
  const rad=W*(.12+r*.09)*e*(1+P.pulse*.05);
  ctx.strokeStyle=M.col(r%2?P.pal.acc2:P.pal.acc,.75-r*.12);
  ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx,cy,rad,ts*(r%2?2:-2),ts*(r%2?2:-2)+4.2);ctx.stroke();
}
const L=M.lines(P.text,14),fs=M.fit(ctx,'DO PROMPT AO',W*.86,W*.13);
L.forEach((l,i)=>{
  M.text(ctx,l,cx,H*.14+i*fs*1.12,fs*e,{color:i===1?P.pal.acc:P.pal.fg,glow:P.pal.acc2});
});`,
    },
    {
      role: 'climax',
      text: 'TRANSFORME CODIGO EM NEGOCIO',
      sub: 'Monetize com assinaturas, licencas e solucoes escalaveis.',
      narration:
        'Transforme codigo em negocio. Monetize com assinaturas e licencas.',
      idea: 'Dashboard SaaS premium com metricas crescentes e receita recorrente',
      layout_mode: 'destaque_curso_interface_premium',
      camera_motion: 'zoom_choque_elastico',
      visual_bridge: 'A interface premium se estabiliza no emblema oficial e chamada final da Cena 6',
      transition_out: 'zoom',
      dur: 5.2,
      seed: 918273,
      fb: 'burst',
      origem: 'gemini',
      status: 'ready',
      agentId: 1,
      fileName: 'cena_05_climax.js',
      compileMs: 5,
      code: `const cx=W*.5,cy=H*.42,e=M.ease.outExpo(M.p(ts,0,.75));
// Interface premium SaaS ao fundo em perspectiva
const pw=W*.88*e,ph=H*.48*e,px=(W-pw)/2,py=H*.18;
ctx.fillStyle=M.col(P.pal.bg2,.85);M.rrect(ctx,px,py,pw,ph,22);ctx.fill();
ctx.strokeStyle=M.col(P.pal.acc2,.55);ctx.lineWidth=2.5;ctx.stroke();
// Barra superior e painéis internos da interface premium
ctx.fillStyle=M.col(P.pal.acc,.16);M.rrect(ctx,px+16,py+16,pw-32,38,10);ctx.fill();
for(let k=0;k<3;k++){
  const cw=(pw-56)/3,cx0=px+16+k*(cw+12);
  ctx.fillStyle=M.col(P.pal.bg1,.75);M.rrect(ctx,cx0,py+70,cw,ph*.32,12);ctx.fill();
  ctx.strokeStyle=M.col(k===1?P.pal.acc:P.pal.acc2,.45);ctx.lineWidth=1.5;ctx.stroke();
}
// Halo energético e nome do curso em destaque absoluto
const glow=ctx.createRadialGradient(cx,cy,10,cx,cy,W*.52*e);
glow.addColorStop(0,M.col(P.pal.acc,.38));glow.addColorStop(1,'rgba(0,0,0,0)');
ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);
const L=M.lines(P.text,14),fs=M.fit(ctx,'FORMAÇÃO MINI',W*.86,W*.125);
L.forEach((l,i)=>{
  const st=M.ease.outBack(M.stagger(ts,i,.05,.09,.48));
  M.text(ctx,l,cx,H*.36+(i-(L.length-1)/2)*fs*1.16,fs*st*(1+P.pulse*.05),{
    color:i===L.length-1?P.pal.acc:P.pal.fg,
    stroke:P.pal.bg1,
    strokeW:8,
    glow:P.pal.acc
  });
});`,
    },
    {
      role: 'closing',
      text: 'MICRO SAAS ELITE',
      sub: 'Sua ideia. Seu produto. Seu proximo negocio.',
      narration:
        'Micro SaaS Elite. Sua ideia. Seu produto. Seu proximo negocio. Layon Devs.',
      idea: 'Assinatura final Micro SaaS Elite com a marca Layon Devs em destaque',
      layout_mode: 'chamada_final_interface_premium',
      camera_motion: 'estabilizacao_cinematografica',
      visual_bridge: 'Encerramento com botão CTA pulsante e assinatura visual completa',
      transition_out: 'crossfade',
      dur: 5.2,
      seed: 441092,
      fb: 'closing',
      origem: 'gemini',
      status: 'ready',
      agentId: 2,
      fileName: 'cena_06_closing.js',
      compileMs: 5,
      code: `const cx=W*.5,cy=H*.36,e=M.ease.outExpo(M.p(ts,0,.8));
// Interface premium ao fundo com grid luminoso
const pw=W*.9*e,ph=H*.54*e,px=(W-pw)/2,py=H*.14;
ctx.fillStyle=M.col(P.pal.bg2,.82);M.rrect(ctx,px,py,pw,ph,24);ctx.fill();
ctx.strokeStyle=M.col(P.pal.acc,.65);ctx.lineWidth=3;ctx.stroke();
for(let r=1;r<5;r++){
  ctx.strokeStyle=M.col(P.pal.acc2,.12);ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(px+20,py+r*(ph/5));ctx.lineTo(px+pw-20,py+r*(ph/5));ctx.stroke();
}
// Badge superior ELITE
const bw=W*.44*e,bh=38;
ctx.fillStyle=M.col(P.pal.acc,.2);M.rrect(ctx,cx-bw/2,py+28,bw,bh,19);ctx.fill();
ctx.strokeStyle=P.pal.acc;ctx.lineWidth=2;ctx.stroke();
M.text(ctx,'MICRO SAAS ELITE',cx,py+47,18*e,{color:P.pal.acc,weight:800});
// Nome do curso em destaque
const L=M.lines(P.text,14),fs=M.fit(ctx,'FORMAÇÃO MINI',W*.84,W*.13);
L.forEach((l,i)=>{
  const st=M.ease.outBack(M.stagger(ts,i,.06,.09,.45));
  M.text(ctx,l,cx,H*.34+i*fs*1.15,fs*st*(1+P.pulse*.04),{
    color:i===L.length-1?P.pal.acc:P.pal.fg,
    glow:P.pal.acc2
  });
});
// Assinatura final Layon Devs
const ctaW=W*.72*M.ease.outBack(M.p(ts,.25,.5)),ctaH=56,ctaY=H*.56;
ctx.fillStyle=P.pal.acc;M.rrect(ctx,cx-ctaW/2,ctaY,ctaW,ctaH,16);ctx.fill();
M.text(ctx,'LAYON DEVS',cx,ctaY+ctaH/2,28*e,{color:P.pal.bg1,weight:900,shadow:false});`,
    },
  ],
};

