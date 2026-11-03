import type { SpeechAnalysis } from '../analyzer.ts';
import type { Palette } from '../../src/types/showreel.ts';
import { FONT_STACKS } from '../themes.ts';

export type TemplateKind =
  | 'kinetic' | 'metric' | 'bars' | 'line' | 'dashboard' | 'terminal'
  | 'nodeflow' | 'timeline' | 'benefits' | 'beforeAfter' | 'architecture'
  | 'question' | 'cta' | 'ambient';

export interface TemplateInput {
  text: string;
  sub: string;
  analysis: SpeechAnalysis;
  theme: Palette;
  seed: number;
  index: number;
}

const common = `
const E=M.ease.outCubic(M.p(ts,0,.7)), cx=W*.5, cy=H*.43;
M.deco(ctx,W,H,P,ts);
const box=(x,y,w,h,r=18)=>{ctx.fillStyle=M.col(P.pal.bg2,.88);M.rrect(ctx,x,y,w,h,r);ctx.fill();ctx.strokeStyle=M.col(P.pal.acc,.58);ctx.lineWidth=2;ctx.stroke()};
const label=(s,x,y,size,color=P.pal.fg)=>M.text(ctx,s,x,y,size,{color,weight:800,font:'${FONT_STACKS.display}',glow:color===P.pal.acc?P.pal.acc:undefined});
const codeLine=(s,x,y,size,color,alpha=1)=>M.text(ctx,s,x,y,size,{align:'left',weight:600,font:'${FONT_STACKS.code}',color,alpha});
const headline=(s,y=H*.16)=>{const lines=M.lines(String(s).toUpperCase(),17,3),fs=M.fit(ctx,lines.reduce((a,b)=>a.length>b.length?a:b,''),W*.86,W*.105);lines.forEach((l,i)=>M.text(ctx,l,cx,y+i*fs*1.05,fs*E,{color:i===lines.length-1?P.pal.acc:P.pal.fg,font:'${FONT_STACKS.display}',glow:P.pal.acc}))};
`;

/** Gera corpo de desenho local compatível com compileSceneCode do player. */
export function renderCanvasTemplate(kind: TemplateKind, input: TemplateInput): string {
  const title = JSON.stringify(input.text);
  const sub = JSON.stringify(input.sub);
  const visuals: Record<TemplateKind, string> = {
    kinetic: `headline(${title},H*.42); const u=M.ease.outExpo(M.p(ts,.2,.8));ctx.fillStyle=P.pal.acc;ctx.fillRect(W*.2,H*.57,W*.6*u,5);`,
    metric: `headline(${title},H*.19);box(W*.13,H*.34,W*.74,H*.27,26);const n=${input.analysis.numbers.length ? JSON.stringify(input.analysis.numbers[0]) : "'01'"};label(n,cx,H*.47,W*.19,P.pal.acc);label(${sub},cx,H*.55,W*.045,P.pal.dim);`,
    bars: `headline(${title},H*.17);box(W*.11,H*.34,W*.78,H*.38,22);for(let k=0;k<5;k++){const bh=H*.24*(.2+.8*M.ease.outExpo(M.p(ts,.1+k*.09,.7)))*(.35+((k*37)%61)/100);const x=W*(.2+k*.13);ctx.fillStyle=M.col(k===4?P.pal.acc:P.pal.acc2,.86);M.rrect(ctx,x,H*.66-bh,W*.075,bh,8);ctx.fill();label(String((k+1)*17)+'%',x+W*.037,H*.7,15,P.pal.dim)}`,
    line: `headline(${title},H*.17);box(W*.1,H*.34,W*.8,H*.37,22);ctx.beginPath();for(let k=0;k<=24;k++){const x=W*.16+k*W*.68/24,y=H*.62-Math.sin(k*.42+ts*1.1)*H*.045-k*H*.006*E;if(k===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.strokeStyle=P.pal.acc;ctx.lineWidth=5;ctx.shadowColor=P.pal.acc;ctx.shadowBlur=16;ctx.stroke();ctx.shadowBlur=0;`,
    dashboard: `headline(${title},H*.16);box(W*.08,H*.29,W*.84,H*.43,20);for(let k=0;k<3;k++){const x=W*(.13+k*.25);box(x,H*.34,W*.21,H*.1,12);label(['01','24','98'][k],x+W*.105,H*.39,20,k===1?P.pal.acc:P.pal.fg)}box(W*.13,H*.49,W*.74,H*.17,12);for(let k=0;k<16;k++){const x=W*.17+k*W*.044,y=H*.61-Math.sin(k*.6+ts)*H*.055;ctx.fillStyle=k>11?P.pal.acc:P.pal.acc2;ctx.beginPath();ctx.arc(x,y,4+E*2,0,7);ctx.fill()}`,
    terminal: `headline(${title},H*.17);box(W*.09,H*.34,W*.82,H*.3,18);{const rows=['$ python app.py','ai.build_product()','app.add_auth(database="sqlite")','deploy(target="cloud")'];rows.forEach((row,k)=>{const a=M.ease.outCubic(M.p(ts,.08+k*.14,.42));codeLine(row,W*.16,H*(.405+k*.052),Math.min(17,W*.026),k%2?P.pal.acc2:P.pal.acc,a)})}ctx.fillStyle=P.pal.acc;ctx.fillRect(W*.16+W*.4*(ts%1),H*.62,7,13);`,
    nodeflow: `headline(${title},H*.18);{const nodes=4, yy=H*.49;for(let k=0;k<nodes;k++){const x=W*(.2+k*.2);if(k<nodes-1){ctx.strokeStyle=M.col(P.pal.acc,.3+E*.6);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+32,yy);ctx.lineTo(x+W*.14,yy);ctx.stroke()}box(x-30,yy-27,60,54,14);label(String(k+1).padStart(2,'0'),x,yy,18,k===nodes-1?P.pal.acc:P.pal.fg)}}`,
    timeline: `headline(${title},H*.18);for(let k=0;k<4;k++){const y=H*(.34+k*.105),a=M.ease.outCubic(M.p(ts,.1+k*.1,.5));ctx.strokeStyle=M.col(P.pal.acc,.65);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(W*.2,y);ctx.lineTo(W*.8,y);ctx.stroke();ctx.fillStyle=P.pal.acc;ctx.beginPath();ctx.arc(W*.2+a*W*.6,y,9,0,7);ctx.fill();label('ETAPA '+(k+1),W*.5,y-20,13,P.pal.dim)}`,
    benefits: `headline(${title},H*.17);for(let k=0;k<3;k++){const a=M.ease.outBack(M.p(ts,.1+k*.16,.45)),y=H*(.34+k*.105)+(1-a)*35;box(W*.14,y,W*.72,H*.075,14);ctx.fillStyle=k===1?P.pal.acc:P.pal.acc2;ctx.beginPath();ctx.arc(W*.21,y+H*.037,8,0,7);ctx.fill();label(${sub},W*.56,y+H*.037,W*.031,P.pal.fg)}`,
    beforeAfter: `headline(${title},H*.18);box(W*.09,H*.34,W*.37,H*.25,16);box(W*.54,H*.34,W*.37,H*.25,16);label('ANTES',W*.275,H*.39,15,P.pal.dim);label('DEPOIS',W*.725,H*.39,15,P.pal.acc);label('→',W*.5,H*.47,30,P.pal.acc);for(let k=0;k<3;k++){ctx.fillStyle=M.col(P.pal.acc2,.6);ctx.fillRect(W*.15,H*(.49+k*.03),W*.24*(.35+k*.2),5);ctx.fillStyle=M.col(P.pal.acc,.8);ctx.fillRect(W*.6,H*(.49+k*.03),W*.24*(.9-k*.1),5)}`,
    architecture: `headline(${title},H*.17);{const bx=[W*.16,W*.42,W*.68],by=[H*.43,H*.53,H*.43];for(let k=0;k<3;k++){box(bx[k],by[k],W*.16,H*.085,13);label(['APP','API','DB'][k],bx[k]+W*.08,by[k]+H*.043,14,k===1?P.pal.acc:P.pal.fg);if(k<2){ctx.strokeStyle=P.pal.acc;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(bx[k]+W*.16,by[k]+H*.04);ctx.lineTo(bx[k+1],by[k+1]+H*.04);ctx.stroke()}}}`,
    question: `headline(${title},H*.2);box(W*.11,H*.36,W*.78,H*.2,24);label('?',cx,H*.46,W*.15,P.pal.acc);label(${sub},cx,H*.61,W*.038,P.pal.fg);`,
    cta: `headline(${title},H*.22);box(W*.12,H*.38,W*.76,H*.2,25);label(${sub},cx,H*.44,W*.047,P.pal.fg);const bw=W*.56,bh=H*.065,by=H*.56;ctx.fillStyle=P.pal.acc;M.rrect(ctx,cx-bw/2,by,bw,bh,18);ctx.fill();label('COMECE AGORA',cx,by+bh/2,19,P.pal.bg1);label('LAYON DEVS',cx,H*.68,20,P.pal.acc);`,
    ambient: `headline(${title},H*.4);for(let k=0;k<7;k++){ctx.strokeStyle=M.col(k%2?P.pal.acc:P.pal.acc2,.42);ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,30+k*22+Math.sin(ts*2+k)*7,0,Math.PI*1.4);ctx.stroke()}`,
  };

  return `${common}\n${visuals[kind] || visuals.ambient}`;
}

export const TEMPLATE_CATALOG: Array<{ kind: TemplateKind; label: string }> = [
  { kind: 'kinetic', label: 'Tipografia cinética' },
  { kind: 'metric', label: 'Card de métrica' },
  { kind: 'bars', label: 'Gráfico de barras' },
  { kind: 'line', label: 'Gráfico de linha' },
  { kind: 'dashboard', label: 'Dashboard' },
  { kind: 'terminal', label: 'Terminal e código' },
  { kind: 'nodeflow', label: 'Fluxo de nós' },
  { kind: 'timeline', label: 'Timeline de etapas' },
  { kind: 'benefits', label: 'Cards em cascata' },
  { kind: 'beforeAfter', label: 'Antes e depois' },
  { kind: 'architecture', label: 'Diagrama de arquitetura' },
  { kind: 'question', label: 'Pergunta e resposta' },
  { kind: 'cta', label: 'CTA final' },
  { kind: 'ambient', label: 'Fundo animado genérico' },
];

