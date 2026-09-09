const fs=require("fs"),vm=require("vm");
const B=require("path").join(__dirname,"..","js")+"/";
const src=["data.js","engine.js"].map(f=>fs.readFileSync(B+f,"utf8")).join("\n")
 +"\nglobalThis.Engine=Engine;globalThis.RANKS=RANKS;";
const ctx={console};vm.createContext(ctx);vm.runInContext(src,ctx);
const {Engine,RANKS}=ctx;

// A competent player: estimates the odds, avoids obvious suicide, but still
// takes the doors, because refusing every door is its own kind of death.
function score(s,c){
  let v=0;
  if(c.check){
    const stat=s.stats[c.check.stat]||0;
    const era=Math.floor(Engine.years(s)/20);
    const dc=c.check.dc+(c.check.dcScale||0)*s.rank+(c.check.dcEra||0)*era;
    let pf=0,ps=0;
    for(let r=1;r<=10;r++){const m=r+stat-dc;
      if(m>=0)ps+=0.1; else if(c.check.fatal!=null&&m<=-c.check.fatal)pf+=0.1;}
    v += -260*pf + 30*ps;
  } else v += 12;
  const fx=c.effects||{};
  if(fx.rank||fx.nightmare||fx.solstice)v+=40;      // progression is the point
  if(fx.death)v-=1000;
  for(const[k,d]of Object.entries(fx.stats||{}))v+=(k==="vitality"?2.5:2)*d;
  return v;
}
const POL=process.argv[2]||"skilled", ORIGIN=process.argv[3]||"citadel", N=+(process.argv[4]||6000);
const ranks={},died={},kinds={},ages=[],ev=[];
for(let i=0;i<N;i++){
  const s=Engine.newRun(ORIGIN);let g=0;
  while(!s.dead&&g++<4000){
    const e=Engine.draw(s);if(!e||s.dead)break;
    const av=e.choices.map((c,j)=>[c,j]).filter(([c])=>Engine.choiceAvailable(s,c));
    if(!av.length)break;
    let pick;
    if(POL==="random")pick=av[Math.floor(Math.random()*av.length)][1];
    else pick=av.reduce((a,b)=>score(s,b[0])>score(s,a[0])?b:a)[1];
    Engine.choose(s,e,pick);
  }
  ranks[Engine.rank(s).common]=(ranks[Engine.rank(s).common]||0)+1;
  died[s.diedIn]=(died[s.diedIn]||0)+1;kinds[s.causeKind]=(kinds[s.causeKind]||0)+1;
  ages.push(Engine.years(s));ev.push(s.eventCount);
}
const pc=v=>(v/N*100).toFixed(2)+"%";
const med=a=>[...a].sort((x,y)=>x-y)[Math.floor(N/2)];
console.log(`policy=${POL} origin=${ORIGIN} n=${N}  age median=${med(ages)} max=${Math.max(...ages)}  events median=${med(ev)}`);
console.log("  furthest:", RANKS.filter(r=>ranks[r.common]).map(r=>`${r.common} ${pc(ranks[r.common])}`).join("  "));
console.log("  cause   :", Object.entries(kinds).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k} ${pc(v)}`).join("  "));
