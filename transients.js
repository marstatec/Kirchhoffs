/* Independent RC/RL lessons. The free-form Kirchhoff solver remains stationary DC. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const format = n => new Intl.NumberFormat('da-DK', {maximumSignificantDigits:4}).format(n);
  const quantity = (n, unit) => {
    if (!Number.isFinite(n)) return '—';
    const a = Math.abs(n);
    const [factor, prefix] = a >= 1e6 ? [1e6,'M'] : a >= 1e3 ? [1e3,'k'] : a > 0 && a < 1e-6 ? [1e-9,'n'] : a > 0 && a < 1e-3 ? [1e-6,'µ'] : a > 0 && a < 1 ? [1e-3,'m'] : [1,''];
    return `${format(n / factor)} ${prefix}${unit}`;
  };
  const specs = {
    capacitor: {number:'05', title:'Kondensatoren lades op — strømmen aftager', subtitle:'Følg spænding, strøm og energi i en RC-kreds. Kondensatorspændingen kan ikke springe: opladningen tager tid.', symbol:'C', name:'Kapacitans C (µF)', value:1000, resistance:1000, up:'Opladning', down:'Afladning'},
    inductor: {number:'06', title:'Spolen modvirker ændringer i strømmen', subtitle:'Følg strømmen i en RL-kreds, og se den inducerede elektromotoriske kraft. Spolestrømmen kan ikke springe: magnetfeltet opbygges og nedbrydes over tid.', symbol:'L', name:'Induktans L (mH)', value:500, resistance:20, up:'Indkobling', down:'Udkobling'}
  };
  const states = {};
  function sample(kind, U, R, component, mode, k) {
    const decay = Math.exp(-k), cap = kind === 'capacitor', up = mode === 'up';
    const tau = cap ? R * component : component / R;
    const voltage = cap ? U * (up ? 1-decay : decay) : U * (up ? decay : -decay);
    const current = cap ? U/R * (up ? decay : -decay) : U/R * (up ? 1-decay : decay);
    const energy = .5 * component * (cap ? voltage ** 2 : current ** 2);
    return {tau, time:k*tau, voltage, current, energy, emf:cap ? 0 : -voltage, resistor:R*current};
  }
  function field(id, label, value) {
    return `<div class="field"><label for="${id}">${label}</label><input id="${id}" type="number" min="0.000001" step="any" value="${value}" required></div>`;
  }
  for (const [kind,spec] of Object.entries(specs)) {
    const section = document.createElement('section');
    section.id = `${kind}-view`; section.className = 'topic-page transient-page'; section.hidden = true;
    section.innerHTML = `<div class="topic-hero"><span class="eyebrow">${spec.number} · ${kind === 'capacitor' ? 'Kondensator · RC' : 'Spole · RL'}</span><h2>${spec.title}</h2><p>${spec.subtitle}</p></div>
      <div class="learn-grid">
        <article class="learn-card"><h3>Inddata</h3>
          <div class="transient-mode" role="group" aria-label="Forløb">${['up','down'].map(mode=>`<button type="button" data-mode="${mode}" aria-pressed="${mode==='up'}">${spec[mode]}</button>`).join('')}</div>
          <div class="transient-fields">${field(`${kind}-u`,'Forsyningsspænding U (V)',24)}${field(`${kind}-r`,'Samlet seriemodstand R (Ω)',spec.resistance)}${field(`${kind}-component`,spec.name,spec.value)}</div>
          <p id="${kind}-initial" class="lesson-note"></p><p id="${kind}-error" class="error" role="alert" hidden>Indtast positive, endelige værdier for U, R og ${spec.symbol}.</p>
        </article>
        <article class="learn-card"><h3 id="${kind}-circuit-title">Kredsløbet ved den valgte tid</h3><svg id="${kind}-circuit" class="learn-svg transient-circuit" viewBox="0 0 600 270" role="img" aria-labelledby="${kind}-circuit-title"></svg><div id="${kind}-metrics" class="metric-strip transient-metrics"></div></article>
        <article class="learn-card full"><h3>Følg forløbet i tiden</h3><div class="transient-timebar"><button type="button" id="${kind}-play" class="secondary">▶ Afspil</button><output id="${kind}-time"></output></div>
          <div class="field"><label for="${kind}-time-slider">Tid fra 0 til 5 tidskonstanter (τ)</label><input id="${kind}-time-slider" type="range" min="0" max="5" step="0.01" value="1"></div>
          <div class="transient-chart-grid"><div><div id="${kind}-voltage-legend" class="transient-legend"></div><svg id="${kind}-voltage-plot" class="transient-plot" viewBox="0 0 520 300" role="img" aria-label="Spænding som funktion af tiden"></svg></div><div><div class="transient-legend"><span style="--curve:var(--orange)">Strøm i</span></div><svg id="${kind}-current-plot" class="transient-plot" viewBox="0 0 520 300" role="img" aria-label="Strøm som funktion af tiden"></svg></div></div>
          <p id="${kind}-explanation" class="lesson-note"></p>
        </article>
        <article class="learn-card"><h3>Formler og fortegn</h3><div id="${kind}-formulas" class="formula-list"></div></article>
        <article class="learn-card"><h3>Indsæt tallene ved den valgte tid</h3><div id="${kind}-working" class="working"></div></article>
        <article class="learn-card full"><h3>Fra 0 til 5 τ</h3><p class="lesson-note">Efter 1 τ er 63,2 % af ændringen gennemført. Efter 5 τ er det 99,3 % — slutværdien nås kun asymptotisk.</p><div class="transient-table-wrap"><table class="result-table"><thead><tr><th>Tid</th><th>Sekunder</th><th>u<sub>${spec.symbol}</sub></th><th>i</th><th>${kind === 'capacitor' ? 'Ladning q' : 'Induceret EMK e'}</th></tr></thead><tbody id="${kind}-table"></tbody></table></div></article>
      </div>`;
    document.querySelector('.app').append(section);
    states[kind] = {mode:'up',frame:null};
    section.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click',()=>{
      stop(kind); states[kind].mode=button.dataset.mode; $(`${kind}-time-slider`).value=0;
      section.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button))); render(kind);
    }));
    section.querySelectorAll('input').forEach(input=>input.addEventListener('input',()=>{stop(kind);render(kind);}));
    $(`${kind}-play`).addEventListener('click',()=>play(kind));
    render(kind);
  }
  function stop(kind) {
    cancelAnimationFrame(states[kind].frame); states[kind].frame=null;
    $(`${kind}-play`).textContent='▶ Afspil';
  }
  function play(kind) {
    if(states[kind].frame!==null){stop(kind);return;}
    const slider=$(`${kind}-time-slider`);
    if(+slider.value>=5)slider.value=0;
    const initial=+slider.value, start=performance.now();
    $(`${kind}-play`).textContent='Ⅱ Pause';
    const tick = now => {
      if($(`${kind}-view`).hidden){stop(kind);return;}
      slider.value=Math.min(5,initial+(now-start)/2000); render(kind);
      if(+slider.value>=5)stop(kind);else states[kind].frame=requestAnimationFrame(tick);
    };
    states[kind].frame=requestAnimationFrame(tick);
  }
  function render(kind) {
    const spec=specs[kind],cap=kind==='capacitor', mode=states[kind].mode,up=mode==='up';
    const U=$(`${kind}-u`).valueAsNumber,R=$(`${kind}-r`).valueAsNumber,raw=$(`${kind}-component`).valueAsNumber,component=raw*(cap?1e-6:1e-3),k=+$(`${kind}-time-slider`).value;
    const s=sample(kind,U,R,component,mode,k);
    const valid=[U,R,component].every(v=>Number.isFinite(v)&&v>0)&&Object.values(s).every(Number.isFinite)&&s.tau>0;
    $(`${kind}-error`).hidden=valid;$(`${kind}-play`).disabled=!valid;
    for(const suffix of ['metrics','circuit','voltage-plot','current-plot','working','table','formulas','explanation','time','voltage-legend'])$(`${kind}-${suffix}`).replaceChildren();
    $(`${kind}-initial`).textContent=cap?(up?'Start: uC(0) = 0 V. En afladet kondensator tilsluttes U gennem R.':'Start: uC(0) = U. Kilden kobles fra, og kondensatoren aflades gennem R i en lukket kreds.'):(up?'Start: i(0) = 0 A. En ideel spole tilsluttes U gennem R. R omfatter også en eventuel viklingsmodstand.':'Start: i(0) = U/R. Kilden kobles fra efter stationær drift. Spolen og R forbliver i en lukket afladningskreds.');
    if(!valid)return;
    $(`${kind}-time`).textContent=`t = ${quantity(s.time,'s')} = ${format(k)} τ · Afspilning: 2 s pr. τ`;
    const metrics=[['Tidskonstant τ',quantity(s.tau,'s')],[`Spænding u${spec.symbol}`,quantity(s.voltage,'V')],['Strøm i',quantity(s.current,'A')],['Lagret energi W',quantity(s.energy,'J')]];
    $(`${kind}-metrics`).innerHTML=metrics.map(([name,value])=>`<div class="metric"><small>${name}</small><strong>${value}</strong></div>`).join('');
    circuit(kind,U,R,component,s,up);
    const curves=cap?[{label:'uC',color:'var(--blue)',get:v=>v.voltage},{label:'uR',color:'var(--green)',get:v=>v.resistor}]:[{label:'uL = L · di/dt',color:'var(--blue)',get:v=>v.voltage},{label:'e = −L · di/dt',color:'var(--red)',get:v=>v.emf}];
    $(`${kind}-voltage-legend`).innerHTML=curves.map(c=>`<span style="--curve:${c.color}">${c.label}</span>`).join('');
    const at=t=>sample(kind,U,R,component,mode,t);
    plot($(`${kind}-voltage-plot`),curves,at,k,U,'V',(!up||!cap)?-U:0);
    plot($(`${kind}-current-plot`),[{color:'var(--orange)',get:v=>v.current}],at,k,U/R,'A',cap&&!up?-U/R:0);
    $(`${kind}-explanation`).textContent=cap?`Når kondensatoren ${up?'oplades, stiger spændingen, mens strømmen falder':'aflades, falder spændingen, og strømmen løber modsat den valgte positive retning'}. Den lodrette markør viser samme tidspunkt på begge kurver. τ = R · C: større R eller C giver et langsommere forløb.`:`Ved ${up?'indkobling er e negativ og modvirker strømmens vækst. Efterhånden som strømmen bliver konstant, går e mod nul':'udkobling er e positiv og opretholder strømmen i dens oprindelige retning, mens magnetfeltets energi afgives i R'}. uL er spændingsfaldet i strømmens positive retning; den inducerede EMK e har modsat fortegn. τ = L/R: større L giver et langsommere forløb, større R et hurtigere.`;
    const formula=(label,body)=>`<div class="formula-box"><small>${label}</small>${body}</div>`;
    const voltageFormula=cap?(up?'U · (1 − e<sup>−t/τ</sup>)':'U · e<sup>−t/τ</sup>'):(up?'U · e<sup>−t/τ</sup>':'−U · e<sup>−t/τ</sup>');
    const currentFormula=cap?(up?'(U/R) · e<sup>−t/τ</sup>':'−(U/R) · e<sup>−t/τ</sup>'):(up?'(U/R) · (1 − e<sup>−t/τ</sup>)':'(U/R) · e<sup>−t/τ</sup>');
    $(`${kind}-formulas`).innerHTML=formula('Tidskonstant',cap?'τ = R · C':'τ = L / R')+formula('Spænding',`u<sub>${spec.symbol}</sub>(t) = ${voltageFormula}`)+formula('Strøm',`i(t) = ${currentFormula}`)+(cap?formula('Ladning og energi','q = C · u<sub>C</sub><br>W = ½ · C · u<sub>C</sub><sup>2</sup>'):formula('Modelektromotorisk kraft og energi','e = −L · di/dt = −u<sub>L</sub><br>W = ½ · L · i<sup>2</sup>'))+`<p class="lesson-note">${cap?'i = C · duC/dt. Positiv i løber ind i kondensatorens pluspol.':'Minustegnet i Lenz’ lov viser, at den inducerede EMK modvirker ændringen i strømmen. Ved konstant DC-strøm er di/dt = 0 og e = 0.'} I eksponentialfunktionen er e Eulers tal ≈ 2,718.</p>`;
    const exp=Math.exp(-k),tauNumbers=cap?`${quantity(R,'Ω')} · ${quantity(component,'F')}`:`${quantity(component,'H')} / ${quantity(R,'Ω')}`;
    $(`${kind}-working`).innerHTML=`τ = ${tauNumbers} = <b>${quantity(s.tau,'s')}</b><br>t/τ = ${format(k)}<br>e<sup>−t/τ</sup> = ${format(exp)}<br><br>u<sub>${spec.symbol}</sub> = ${cap?(up?`${format(U)} · (1 − ${format(exp)})`:`${format(U)} · ${format(exp)}`):`${up?'':'−'}${format(U)} · ${format(exp)}`} V = <b>${quantity(s.voltage,'V')}</b><br>i = ${cap&&!up?'−':''}(${format(U)} V / ${format(R)} Ω) · ${!cap&&up?`(1 − ${format(exp)})`:format(exp)} = <b>${quantity(s.current,'A')}</b><br><br>${cap?`q = C · u<sub>C</sub> = <b>${quantity(component*s.voltage,'C')}</b>`:`di/dt = u<sub>L</sub>/L = <b>${quantity(s.voltage/component,'A/s')}</b><br>e = −u<sub>L</sub> = <b>${quantity(s.emf,'V')}</b>`}<br>W = <b>${quantity(s.energy,'J')}</b><br><br>Kirchhoff-kontrol:<br>${up?'U':'0 V'} = u<sub>R</sub> + u<sub>${spec.symbol}</sub> = ${quantity(s.resistor,'V')} + (${quantity(s.voltage,'V')}) = <b>${quantity(up?U:0,'V')}</b>${!cap?'<p class="lesson-note">Ved udkobling forudsætter modellen en lukket strømvej gennem R. Hvis strømvejen i stedet brydes helt, kan spolen skabe en stor spændingsspids. Dens størrelse afhænger af bl.a. parasitkapacitans og beskyttelseskredsløb og beregnes ikke af denne RL-model.</p>':''}`;
    $(`${kind}-table`).innerHTML=[0,1,2,3,4,5].map(t=>{const v=at(t);return `<tr><td>${t} τ</td><td>${quantity(v.time,'s')}</td><td>${quantity(v.voltage,'V')}</td><td>${quantity(v.current,'A')}</td><td>${quantity(cap?component*v.voltage:v.emf,cap?'C':'V')}</td></tr>`;}).join('');
  }
  function plot(root,curves,at,k,max,unit,min) {
    const left=74,right=490,top=32,bottom=246,range=max-min;
    const x=t=>left+t/5*(right-left),y=v=>bottom-(v-min)/range*(bottom-top);
    let drawing='';
    for(let t=0;t<=5;t++)drawing+=`<path class="plot-grid" d="M${x(t)} ${top}V${bottom}"/><text x="${x(t)}" y="270" text-anchor="middle">${t}τ</text>`;
    for(let j=0;j<=4;j++){const v=min+range*j/4;drawing+=`<path class="plot-grid" d="M${left} ${y(v)}H${right}"/><text x="${left-9}" y="${y(v)+4}" text-anchor="end">${quantity(v,unit)}</text>`;}
    drawing+=`<path class="plot-axis" d="M${left} ${top}V${bottom}M${left} ${y(0)}H${right}"/><text x="${right}" y="294" text-anchor="end">Tid · τ = ${quantity(at(1).tau,'s')}</text>`;
    curves.forEach(c=>{const points=Array.from({length:201},(_,i)=>`${i?'L':'M'}${x(i/40).toFixed(2)} ${y(c.get(at(i/40))).toFixed(2)}`).join(' ');drawing+=`<path d="${points}" fill="none" stroke="${c.color}" stroke-width="2.8"/>`;});
    drawing+=`<path class="plot-cursor" d="M${x(k)} ${top}V${bottom}"/>`;
    curves.forEach(c=>drawing+=`<circle cx="${x(k)}" cy="${y(c.get(at(k)))}" r="4" fill="${c.color}"/>`);
    root.innerHTML=drawing;
  }
  function circuit(kind,U,R,component,s,up) {
    const cap=kind==='capacitor',symbol=cap?'C':'L';
    const element=cap?'<path d="M440 65V119M418 119H462M418 135H462M440 135V215"/>':'<path d="M440 65V85 C410 85 410 115 440 115 C410 115 410 145 440 145 C410 145 410 175 440 175 V215"/>';
    const source=up?'<path d="M90 65V112M90 168V215"/><circle cx="90" cy="140" r="28"/><path d="M81 129H99M90 120V138M81 151H99"/>':'<path d="M90 65V215"/>';
    const arrow=s.current<0?'M215 90H175M183 85L175 90L183 95':'M175 90H215M207 85L215 90L207 95';
    $(`${kind}-circuit`).innerHTML=`<g fill="none" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round"><path d="M90 65H240M320 65H440M90 215H440"/><rect x="240" y="54" width="80" height="22" rx="2"/>${element}${source}</g><g text-anchor="middle"><text x="280" y="35">R = ${quantity(R,'Ω')}</text><text x="95" y="247">${up?`U = ${quantity(U,'V')}`:'Kilden er koblet fra'}</text><text x="505" y="92">${symbol} = ${quantity(component,cap?'F':'H')}</text><text x="505" y="180">u${symbol} = ${quantity(s.voltage,'V')}</text><text x="280" y="115" style="fill:var(--orange)">i = ${quantity(s.current,'A')}</text></g><path d="${arrow}" fill="none" stroke="var(--orange)" stroke-width="2"/><text x="472" y="120">+</text><text x="472" y="154">−</text><text x="120" y="190">${up?'t = 0: tilslut U':'t = 0: luk afladningskredsen'}</text>`;
  }
  // Capture reset only for these lessons; preserve the editor's existing reset behavior.
  $('reset-module').addEventListener('click',event=>{
    const kind=document.querySelector('.topic-button.active')?.dataset.module;
    if(!specs[kind])return;
    event.stopImmediatePropagation();stop(kind);
    const spec=specs[kind];states[kind].mode='up';
    $(`${kind}-u`).value=24;$(`${kind}-r`).value=spec.resistance;$(`${kind}-component`).value=spec.value;$(`${kind}-time-slider`).value=1;
    $(`${kind}-view`).querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode==='up')));render(kind);
  },true);
})();
