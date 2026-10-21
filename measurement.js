/* Fixed, low-voltage teaching circuits; not a model of a particular real instrument. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id), fmt=(v,d=2)=>v.toLocaleString('da-DK',{minimumFractionDigits:d,maximumFractionDigits:d});
  const exercises={voltage:['Spænding','Mål spændingen over R₂ med positiv visning.'],current:['Strøm','Åbn forbindelsen A–B, og mål kredsstrømmen med positiv visning.'],resistance:['Modstand','Mål R₂ alene. Afbryd forsyningen og isolér komponenten først.'],instruments:['Instrumentlære','Undersøg måleområde, nøjagtighed og mærkning.']};
  const fresh=()=>({exercise:'voltage',mode:'V',range:1,jack:'V',red:null,black:null,active:'red',power:true,gap:false,lift:false,fuses:{mA:true,A:true},result:null,hint:false,explain:false});
  let state=fresh();
  const ranges={V:[{max:2,step:.001,unit:'V',scale:1},{max:20,step:.01,unit:'V',scale:1},{max:200,step:.1,unit:'V',scale:1}],A:[{max:.02,step:.00001,unit:'mA',scale:1000},{max:.2,step:.0001,unit:'mA',scale:1000},{max:10,step:.01,unit:'A',scale:1}],O:[{max:200,step:.1,unit:'Ω',scale:1},{max:2000,step:1,unit:'Ω',scale:1},{max:20000,step:10,unit:'kΩ',scale:.001}]};
  const page=document.createElement('section');page.id='measurement-view';page.className='topic-page measurement-page';page.hidden=true;
  page.innerHTML=`<div class="topic-hero"><span class="eyebrow">07  |  Virtuelt målelaboratorium</span><h2>Mål, beregn og forklar</h2><p>Vælg målefunktion og indgang. Klik på en måleledning og derefter på et punkt i kredsløbet. Kontrollér opstillingen, og undersøg hvad målingen fortæller.</p></div>
    <div class="measure-tabs" role="group" aria-label="Måleøvelse">${Object.entries(exercises).map(([id,[label]])=>`<button data-exercise="${id}" type="button">${label}</button>`).join('')}</div>
    <div id="measure-lab"><div class="measure-task"><strong id="measure-task"></strong><span>24 V DC  |  undervisningsmodel</span></div>
    <div class="measure-layout"><article class="learn-card"><h3>Kredsløb og målepunkter</h3><div class="measure-controls"><button id="measure-power" class="secondary"></button><button id="measure-gap" class="secondary"></button><button id="measure-lift" class="secondary"></button></div>
    <svg id="measure-circuit" viewBox="0 0 640 350" role="img" aria-label="Øvelseskredsløb med klikbare målepunkter"></svg>
    <div class="measure-probes" role="group" aria-label="Vælg måleledning"><button id="measure-red" type="button">● Rød ledning</button><button id="measure-black" type="button">● Sort ledning  |  COM</button><button id="measure-disconnect" class="secondary" type="button">Fjern ledninger</button></div>
    <p id="measure-connections" class="lesson-note"></p><p class="lesson-note">Den sorte ledning sidder fast i COM. Vælg den røde lednings indgang på multimeteret. Målepunkterne kan også aktiveres med Tab og Enter.</p>
    <details><summary>Sådan er modellen beregnet</summary><p class="lesson-note">R₁ = 100 Ω og R₂ = 200 Ω. Forsyningen har 0,5 Ω indre modstand. Voltmeterets indgangsmodstand er 10 MΩ. Strømindgangene har 1 Ω (mA) og 0,1 Ω (A). Instrumentet påvirker derfor kredsløbet lidt. Strømindgangene er sikret ved henholdsvis 200 mA og 10 A. Simulationen lader sikringen springe straks over grænsen; virkelige sikringer har en tids-/strømkarakteristik.</p></details>
    </article><article class="learn-card measure-meter"><h3>Multimeter  |  manuel områdevalg</h3><div class="measure-display" role="status" aria-live="polite"><span id="measure-display-mode"></span><strong id="measure-display">—</strong><small id="measure-display-note">Tryk Kontrollér opstilling</small></div>
    <div class="field"><label for="measure-function">Målefunktion</label><select id="measure-function"><option value="V">V ⎓  |  DC-spænding</option><option value="A">A ⎓  |  DC-strøm</option><option value="O">Ω  |  Modstand</option></select></div>
    <div class="field"><label for="measure-range">Manuelt måleområde</label><select id="measure-range"></select></div>
    <fieldset class="measure-jacks"><legend>Rød lednings indgang</legend>${[['V','V / Ω'],['mA','mA  |  sikret'],['A','A  |  sikret']].map(([v,l])=>`<label><input type="radio" name="measure-jack" value="${v}"><span>${l}</span></label>`).join('')}</fieldset><p id="measure-fuses" class="lesson-note"></p><button id="measure-replace" class="secondary" type="button">Udskift sikringer i simulationen</button>
    </article></div>
    <div class="measure-actions"><button id="measure-check" class="primary">Kontrollér opstilling</button><button id="measure-hint" class="secondary">Giv et hint</button><button id="measure-explain" class="secondary">Vis forklaring</button></div>
    <div id="measure-feedback" role="status" aria-live="polite" class="measure-feedback"></div><div id="measure-help" class="learn-card" hidden></div></div>
    <div id="measure-instruments" hidden><div class="learn-grid"><article class="learn-card"><h3>Analogt instrument  |  klasse 1,5</h3><p class="lesson-note">Eksempel: DC-voltmeter med nøjagtighedsklasse 1,5, angivet i procent af måleområdets slutværdi.</p><div class="field"><label for="measure-analog-range">Måleområdets slutværdi</label><select id="measure-analog-range"><option value="30">30 V</option><option value="300">300 V</option></select></div><div class="field"><label for="measure-analog-reading">Aflæsning (V)</label><input id="measure-analog-reading" type="number" value="12" step="any"></div><svg id="measure-analog" viewBox="0 0 400 140" role="img" aria-label="Analog spændingsskala med viser"></svg><div id="measure-analog-result" class="working"></div></article>
    <article class="learn-card"><h3>Digitalt instrument  |  procent + cifre</h3><p class="lesson-note">Undervisningseksempel: 20 V-område, opløsning 0,01 V og specificeret nøjagtighed ±(0,5 % af aflæsningen + 2 cifre). Et ciffer betyder én enhed på displayets sidste plads.</p><div class="field"><label for="measure-digital-reading">Aflæsning (V, højst 19,99)</label><input id="measure-digital-reading" type="number" step=".01" value="12"></div><div id="measure-digital-result" class="working"></div><p class="lesson-note">Opløsning og nøjagtighed er forskellige: mange decimaler er ikke i sig selv garanti for en nøjagtig måling. De viste grænser er eksempler på instrumentfejl, ikke en fuldstændig usikkerhedsanalyse.</p></article>
    <article class="learn-card full"><h3>Læs instrumentets mærkning</h3><dl class="measure-markings"><dt>⎓ / ~</dt><dd>Jævnstrøm eller -spænding / vekselstrøm eller -spænding.</dd><dt>COM</dt><dd>Fælles referenceindgang til den sorte måleledning. COM er ikke nødvendigvis jord.</dd><dt>V / Ω</dt><dd>Indgang til spænding og modstand; høj indgangsmodstand ved spændingsmåling.</dd><dt>mA / A</dt><dd>Strømindgange med lav modstand. Se instrumentets grænser, sikring og eventuelle tidsbegrænsning.</dd><dt>CAT II / III / IV + V</dt><dd>Målekategori og mærkespænding beskriver egnethed til det elektriske miljø og dets transienter. CAT II ved brugsgenstande, CAT III i distributions-/installationsmiljø og CAT IV ved installationens forsyningsindgang. Kategori er ikke nøjagtighedsklasse. Både kategori, spænding og måleledningernes mærkning skal passe til målingen.</dd><dt>Sikringsmærkning</dt><dd>Angiver den foreskrevne sikring. Strøm, spænding, brydeevne og type skal passe til fabrikantens anvisning.</dd></dl><p class="lesson-note">Dette er et virtuelt 24 V-laboratorium. Oplysninger om et virkeligt instruments tilslutning og grænser findes i dets egen manual. <a href="https://assets.fluke.com/manuals/287_289_umeng0000.pdf" target="_blank" rel="noopener">Eksempel på fabrikantmanual (Fluke)</a>.</p></article></div></div>`;
  document.querySelector('.app').append(page);
  function invalidate(){state.result=null;render();}
  page.querySelectorAll('[data-exercise]').forEach(b=>b.onclick=()=>{const fuses=state.fuses;state=fresh();state.fuses=fuses;state.exercise=b.dataset.exercise;render();});
  $('measure-power').onclick=()=>{state.power=!state.power;invalidate();};
  $('measure-gap').onclick=()=>{state.gap=!state.gap;invalidate();};
  $('measure-lift').onclick=()=>{state.lift=!state.lift;invalidate();};
  for(const color of ['red','black'])$('measure-'+color).onclick=()=>{state.active=color;render();};
  $('measure-disconnect').onclick=()=>{state.red=state.black=null;invalidate();};
  $('measure-function').onchange=e=>{state.mode=e.target.value;state.range=1;invalidate();};
  $('measure-range').onchange=e=>{state.range=+e.target.value;invalidate();};
  page.querySelectorAll('[name=measure-jack]').forEach(r=>r.onchange=()=>{state.jack=r.value;invalidate();});
  $('measure-check').onclick=()=>{state.result=measure();render();};
  $('measure-replace').onclick=()=>{if(state.power||state.red!==null||state.black!==null){state.result={display:'—',message:'Afbryd forsyningen og fjern begge måleledninger, før du udskifter sikringerne i simulationen.',level:'error'};}else{state.fuses={mA:true,A:true};state.result={display:'—',message:'Simulationens sikringer er udskiftet.',level:'ok'};}render();};
  $('measure-hint').onclick=()=>{state.hint=!state.hint;render();};
  $('measure-explain').onclick=()=>{state.explain=!state.explain;render();};
  for(const id of ['analog-range','analog-reading','digital-reading'])$('measure-'+id).oninput=instrumentLesson;
  $('reset-module').addEventListener('click',e=>{if(document.querySelector('.topic-button.active')?.dataset.module!=='measurement')return;e.stopImmediatePropagation();state=fresh();$('measure-analog-range').value=30;$('measure-analog-reading').value=12;$('measure-digital-reading').value=12;render();},true);
  // Small resistive network solver. Each floating connected component gets a reference.
  function solve(edges,fixed={},injection={}){
    const nodes=[...new Set([...edges.flatMap(e=>e.slice(0,2)),...Object.keys(fixed),...Object.keys(injection)])],known={...fixed},seen=new Set();
    for(const node of nodes){if(seen.has(node))continue;const group=[],todo=[node];while(todo.length){const n=todo.pop();if(seen.has(n))continue;seen.add(n);group.push(n);for(const [a,b] of edges){if(a===n&&!seen.has(b))todo.push(b);if(b===n&&!seen.has(a))todo.push(a);}}if(!group.some(n=>n in known))known[group[0]]=0;}
    const unknown=nodes.filter(n=>!(n in known)),N=unknown.length,M=unknown.map(n=>{const row=Array(N+1).fill(0),i=unknown.indexOf(n);row[N]=injection[n]||0;for(const [a,b,r] of edges){if(a===b)continue;if(a!==n&&b!==n)continue;const other=a===n?b:a,g=1/r;row[i]+=g;if(other in known)row[N]+=g*known[other];else row[unknown.indexOf(other)]-=g;}return row;});
    for(let c=0;c<N;c++){let p=c;for(let r=c+1;r<N;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;[M[c],M[p]]=[M[p],M[c]];const v=M[c][c];if(Math.abs(v)<1e-15)throw Error('Singular teaching circuit');for(let j=c;j<=N;j++)M[c][j]/=v;for(let r=0;r<N;r++){if(r===c)continue;const k=M[r][c];for(let j=c;j<=N;j++)M[r][j]-=k*M[c][j];}}
    return {...known,...Object.fromEntries(unknown.map((n,i)=>[n,M[i][N]]))};
  }
  function circuit(){
    if(state.exercise==='resistance')return {map:{A:'A',B:'B',C:state.lift?'C':'A'},edges:[['A','B',100],[state.lift?'C':'A','B',200]],ground:'B'};
    return {map:{A:'A',B:state.gap?'B':'A',C:'C',D:'D',E:'D'},edges:[[state.gap?'B':'A','C',100],['C','D',200]],ground:'D'};
  }
  function resistance(edges,a,b){if(a===b)return 0;const reachable=new Set([a]);let changed=true;while(changed){changed=false;for(const [x,y] of edges){if(reachable.has(x)&&!reachable.has(y)){reachable.add(y);changed=true;}if(reachable.has(y)&&!reachable.has(x)){reachable.add(x);changed=true;}}}if(!reachable.has(b))return Infinity;return solve(edges,{[b]:0},{[a]:1,[b]:-1})[a];}
  function measure(){
    const fail=(display,message)=>({display,message,level:'error'});
    if(state.red===null||state.black===null)return fail('—','Tilslut begge måleledninger til punkter i kredsløbet.');
    const net=circuit(),a=net.map[state.red],b=net.map[state.black],currentJack=state.jack!=='V';
    if(currentJack&&!state.fuses[state.jack])return fail('SIKRING','Den valgte strømindgang har en sprunget sikring. Afbryd og fjern ledningerne før udskiftning.');
    let value;
    if(currentJack){
      const shunt=state.jack==='mA'?1:.1,edges=[...net.edges,[a,b,shunt]];
      if(state.power)edges.push(['S','A',.5]);
      const v=solve(edges,{[net.ground]:0,...(state.power?{S:24}:{})}),amps=a===b?0:(v[a]-v[b])/shunt;
      if(Math.abs(amps)>(state.jack==='mA'?.2:10)){state.fuses[state.jack]=false;return fail('SIKRING',`Sikringen sprang i simulationen. Tilslutningen ville give cirka ${fmt(Math.abs(amps))} A gennem strømindgangen. Den lave modstand kortslutter eller shunter en del af kredsløbet. Det gælder også, når drejeknappen står på V eller Ω.`);}
      if(state.mode!=='A')return fail('INDGANG','Den røde ledning sidder i en strømindgang. Den belaster kredsløbet med lav modstand, selv om funktionen er V eller Ω. Flyt ledningen til V/Ω.');
      if(state.jack==='mA'&&state.range===2||state.jack==='A'&&state.range!==2)return fail('OMRÅDE','Brug mA-indgangen med 20/200 mA-områderne og A-indgangen med 10 A-området.');
      value=amps;
    }else{
      if(state.mode==='A')return fail('INDGANG','V/Ω-indgangen kan ikke bruges til strømmåling. Vælg strømindgang, og sæt instrumentet i serie.');
      if(state.mode==='O'){
        if(state.power)return fail('STOP','Modstand måles uden spænding. Afbryd forsyningen først. Ohmmeteret bruger sin egen målestrøm.');
        value=resistance(net.edges,a,b);
      }else{const edges=[...net.edges,[a,b,1e7]];if(state.power)edges.push(['S','A',.5]);const v=solve(edges,{[net.ground]:0,...(state.power?{S:24}:{})});value=a===b?0:v[a]-v[b];}
    }
    const range=ranges[state.mode][state.range],rounded=Math.round(value/range.step)*range.step;
    if(!Number.isFinite(value)||Math.abs(rounded)>=range.max)return fail('OL',Number.isFinite(value)?'Målingen ligger over det valgte måleområde. Vælg et større område. OL er ikke en måleværdi.':'Der er ingen ledende forbindelse mellem målepunkterne. OL betyder her åben kreds.');
    const decimals=Math.max(0,Math.round(-Math.log10(range.step*range.scale))),display=`${fmt(Math.abs(rounded)<range.step/2?0:rounded*range.scale,decimals)} ${range.unit}`;
    let correct=false,message='Instrumentet viser værdien mellem de valgte punkter, men opgaven er endnu ikke løst.';
    if(state.exercise==='voltage'){correct=state.mode==='V'&&state.power&&!state.gap&&state.red==='C'&&['D','E'].includes(state.black);if(correct)message='Korrekt: voltmeteret sidder parallelt over R₂, og den røde ledning er på det højeste potentiale.';else if(state.mode==='V'&&value<0)message='Negativ visning: den røde ledning er på lavere potentiale end COM. Byt ledningerne for positiv visning.';else if(state.mode==='V'&&Math.abs(value)<1e-9)message='0 V: punkterne har samme potentiale, eller forsyningen er afbrudt. Det er ikke i sig selv en instrumentfejl.';}
    if(state.exercise==='current'){correct=state.mode==='A'&&state.power&&state.gap&&state.red==='A'&&state.black==='B';if(correct)message='Korrekt: instrumentet forbinder den åbne A–B-forbindelse og fører hele kredsstrømmen. Positiv strøm går ind i den røde ledning.';else if(state.mode==='A')message='Amperemeteret skal ind i den åbnede A–B-forbindelse. En parallel tilslutning kan shunte en modstand; det er ikke kredsstrømmen.';}
    if(state.exercise==='resistance'){correct=state.mode==='O'&&!state.power&&state.lift&&[state.red,state.black].sort().join('')==='BC';if(correct)message='Korrekt: R₂ er isoleret fra parallelgrenen. Instrumentet måler nu R₂ alene; polariteten er uden betydning.';else if(state.mode==='O'&&Math.abs(value)<1e-9)message='0 Ω: punkterne er forbundet direkte eller er det samme punkt. Du måler ikke over R₂.';else if(state.mode==='O'&&!state.lift)message='R₂ sidder stadig parallelt med R₁. Mellem de to sider måles 100 Ω ∥ 200 Ω = 66,7 Ω, ikke R₂ alene. Løft R₂’s øverste ben.';}
    return {display,message,level:correct?'ok':'notice'};
  }
  function render(){
    page.querySelectorAll('[data-exercise]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.exercise===state.exercise)));
    $('measure-lab').hidden=state.exercise==='instruments';$('measure-instruments').hidden=state.exercise!=='instruments';instrumentLesson();
    $('measure-task').textContent=exercises[state.exercise][1];
    $('measure-power').textContent=state.power?'⏻ Forsyning: tændt':'⏻ Forsyning: afbrudt';$('measure-power').setAttribute('aria-pressed',String(state.power));
    $('measure-gap').hidden=state.exercise==='resistance';$('measure-gap').textContent=state.gap?'Luk A–B':'Åbn A–B';
    $('measure-lift').hidden=state.exercise!=='resistance';$('measure-lift').textContent=state.lift?'Forbind R₂ igen':'Løft R₂’s øverste ben';
    $('measure-function').value=state.mode;$('measure-range').innerHTML=ranges[state.mode].map((r,i)=>`<option value="${i}">${fmt(r.max*r.scale,0)} ${r.unit}</option>`).join('');$('measure-range').value=state.range;
    page.querySelectorAll('[name=measure-jack]').forEach(r=>r.checked=r.value===state.jack);
    for(const color of ['red','black'])$('measure-'+color).setAttribute('aria-pressed',String(state.active===color));
    $('measure-connections').textContent=`Rød: ${state.red||'ikke tilsluttet'}  |  Sort: ${state.black||'ikke tilsluttet'}. Næste klik placerer ${state.active==='red'?'rød':'sort'} ledning.`;
    $('measure-fuses').textContent=`mA-sikring: ${state.fuses.mA?'OK':'sprunget'}  |  A-sikring: ${state.fuses.A?'OK':'sprunget'}`;
    $('measure-display-mode').textContent=state.mode==='O'?'Ω':state.mode+' ⎓';$('measure-display').textContent=state.result?.display||'—';$('measure-display-note').textContent=state.result?'Seneste kontrol':'Tryk Kontrollér opstilling';
    $('measure-feedback').className='measure-feedback '+(state.result?.level||'');$('measure-feedback').textContent=state.result?.message||'Vælg opstilling, og tryk Kontrollér opstilling. Displayet opdateres ved kontrol.';
    $('measure-help').hidden=!state.hint&&!state.explain;
    const hints={voltage:'Spænding måles over en komponent. Find de to ender af R₂, og vælg V/Ω-indgangen og DC V.',current:'Strøm måles igennem instrumentet. Åbn A–B og lad amperemeteret erstatte ledningen. Vælg et område, der kan rumme cirka 80 mA.',resistance:'Ohmmeteret må ikke tilsluttes en spændingssæt kreds. Afbryd kilden, løft R₂’s øverste ben, og mål mellem C og B.',instruments:''};
    const explain={voltage:'<p>Rød på C, sort på D eller E, V/Ω-indgang, V ⎓ og 20 V-område. U₂ ≈ 24 · 200/(100 + 200 + 0,5) = 15,97 V. Voltmeterets 10 MΩ ligger parallelt med R₂ og ændrer værdien en smule. Omvendte ledninger giver samme størrelse med minusfortegn.</p>',current:'<p>Åbn A–B. Rød på A, sort på B, A ⎓, mA-indgang og 200 mA-område. I = 24/(100 + 200 + 0,5 + 1) = 79,60 mA. På A-indgangen/10 A-området er modstanden 0,1 Ω, og strømmen bliver cirka 79,84 mA, men vises grovere. 20 mA-området giver OL uden at sprænge 200 mA-sikringen.</p>',resistance:'<p>Sluk forsyningen, løft R₂’s øverste ben, vælg Ω, V/Ω-indgang og 2.000 Ω-område. Mål C–B: 200 Ω. Uden isolering er resultatet 1/(1/100 + 1/200) = 66,67 Ω. Det er en rigtig måling af parallelforbindelsen, men ikke af R₂ alene. 200 Ω kan ikke vises på 200 Ω-området, hvis højeste visning er 199,9 Ω.</p>',instruments:''};
    $('measure-help').innerHTML=(state.hint?`<h3>Hint</h3><p>${hints[state.exercise]}</p>`:'')+(state.explain?`<h3>Forklaring og beregning</h3>${explain[state.exercise]}`:'');drawCircuit();
  }
  function drawCircuit(){
    const ohm=state.exercise==='resistance';
    const points=ohm?{A:[235,70],B:[235,270],C:[460,110]}:{A:[180,70],B:[280,70],C:[505,150],D:[505,285],E:[270,285]};
    const source=`<path d="M80 70V145M80 205V${ohm?270:285}"/><circle cx="80" cy="175" r="30"/><path d="M68 163H92M80 151V175M68 190H92"/>`;
    const wires=ohm?`M80 70H${state.power?235:130} M${state.power?235:160} 70H460 M80 270H460 M235 70V140M235 200V270M460 110V140M460 200V270 ${state.lift?'':'M460 70V110'}`:`M80 70H180 ${state.power?'':'M110 70H130'} ${state.gap?'':'M180 70H280'} M280 70H330M405 70H505V150M505 150V185M505 235V285H80`;
    const resistors=ohm?'<rect x="224" y="140" width="22" height="60"/><rect x="449" y="140" width="22" height="60"/>':'<rect x="330" y="59" width="75" height="22"/><rect x="494" y="185" width="22" height="50"/>';
    const labels=ohm?'<text x="270" y="175">R₁ 100 Ω</text><text x="475" y="175">R₂ 200 Ω</text>':'<text x="333" y="108">R₁ 100 Ω</text><text x="525" y="219">R₂ 200 Ω</text>';
    let content=`<g fill="none" stroke="var(--ink)" stroke-width="2.5">${source}<path d="${wires}"/>${resistors}</g><g class="measure-label">${labels}<text x="20" y="125">${state.power?'24 V DC':'Kilde fra'}</text>${!ohm?`<text x="185" y="43">${state.gap?'Åben A–B':'Lukket A–B'}</text>`:`<text x="380" y="40">${state.lift?'R₂ isoleret':'Parallelforbindelse'}</text>`}</g>`;
    if(!state.power)content+=`<path d="M108 70H157" stroke="var(--paper)" stroke-width="7"/><path d="M110 70L150 50" stroke="var(--ink)" stroke-width="2.5"/>`;
    for(const [color,x,stroke] of [['black',135,'var(--muted)'],['red',330,'var(--red)']]){const p=points[state[color]];if(p)content+=`<path d="M${x} 340 C${x} 305 ${p[0]-50} ${p[1]+30} ${p[0]} ${p[1]}" fill="none" stroke="${stroke}" stroke-width="4" stroke-dasharray="${color==='black'?'8 4':'none'}"/><text x="${x}" y="335" class="measure-label">${color==='red'?'Rød':'COM'}</text>`;}
    for(const [name,[x,y]] of Object.entries(points)){content+=`<g role="button" tabindex="0" aria-label="Målepunkt ${name}" data-point="${name}"><circle cx="${x}" cy="${y}" r="20" fill="transparent"/><circle cx="${x}" cy="${y}" r="8" fill="var(--paper)" stroke="var(--blue)" stroke-width="3"/><text x="${x+12}" y="${y-12}" class="measure-label">${name}</text></g>`;}
    $('measure-circuit').innerHTML=content;
    $('measure-circuit').querySelectorAll('[data-point]').forEach(p=>{const select=()=>{state[state.active]=p.dataset.point;state.active=state.active==='red'?'black':'red';invalidate();$('measure-circuit').querySelector(`[data-point="${p.dataset.point}"]`).focus();};p.onclick=select;p.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select();}};});
  }
  function instrumentLesson(){
    const end=+$('measure-analog-range').value,reading=$('measure-analog-reading').valueAsNumber,valid=Number.isFinite(reading)&&reading>=0&&reading<=end,err=.015*end;
    $('measure-analog-result').textContent=valid?`±1,5 % af ${fmt(end,0)} V = ±${fmt(err)} V. Ved ${fmt(reading)} V: ${fmt(reading-err)} til ${fmt(reading+err)} V. Fejlgrænsen er ${fmt(100*err/reading)} % af aflæsningen.`:'Indtast en aflæsning inden for måleområdet.';
    if(valid&&reading===0)$('measure-analog-result').textContent=`Fejlgrænse ±${fmt(err)} V. Relativ fejl kan ikke beregnes ved 0 V.`;
    let svg='<path d="M30 95H370" fill="none" stroke="var(--muted)"/>';
    for(let i=0;i<=10;i++)svg+=`<path d="M${30+i*34} 95V${i%2?85:78}" stroke="var(--muted)"/>${i%2?'':`<text x="${30+i*34}" y="118" text-anchor="middle">${fmt(end*i/10,0)}</text>`}`;
    if(valid)svg+=`<path d="M${30+340*reading/end} 40V90" stroke="var(--red)" stroke-width="3"/><text x="200" y="24" text-anchor="middle">Klasse 1,5  |  ${end} V DC</text>`;$('measure-analog').innerHTML=svg;
    const digital=$('measure-digital-reading').valueAsNumber,delta=.005*digital+.02;
    $('measure-digital-result').textContent=Number.isFinite(digital)&&digital>=0&&digital<=19.99?`ΔU = ±(0,005 · ${fmt(digital)} + 2 · 0,01) V = ±${fmt(delta,4)} V. Interval: ${fmt(digital-delta,4)} til ${fmt(digital+delta,4)} V.`:'Indtast en aflæsning mellem 0 og 19,99 V.';
  }
  render();
})();
