/* Sinusoidal steady-state model of a real coil: winding resistance R in series with L. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const number = value => new Intl.NumberFormat('da-DK', {maximumFractionDigits:3, maximumSignificantDigits:4}).format(value);
  const defaults = {u:230, f:50, l:1, r:100};
  const section = document.createElement('section');
  section.id = 'inductor-view';
  section.className = 'topic-page transient-page coil-page';
  section.hidden = true;
  section.innerHTML = `
    <div class="topic-hero"><span class="eyebrow">06  |  Spoler i vekselstrøm</span><h2>Hvorfor begrænser spolen strømmen?</h2><p>Spolens tråd har en modstand R. Men ved vekselstrøm skaber selvinduktionen også en modelektromotorisk kraft. Derfor bestemmes strømmen af impedansen Z — både modstanden og den induktive reaktans.</p></div>
    <div class="learn-grid">
      <article class="learn-card full"><h3>Selvinduktion: strøm → magnetfelt → induceret spænding</h3>
        <div class="coil-steps">
          <div><span class="step">1  |  Strømmen ændrer sig</span><p>Vekselstrøm skifter hele tiden størrelse og retning. Strømmen i spolens vindinger danner et magnetfelt, som derfor også ændrer sig.</p></div>
          <div><span class="step">2  |  Spolen inducerer en spænding</span><p>Det ændrede magnetfelt inducerer en elektromotorisk kraft i spolens egne vindinger. Det kaldes <strong>selvinduktion</strong>.</p></div>
          <div><span class="step">3  |  Ændringen modvirkes</span><p>Ifølge Lenz’ lov modvirker den inducerede spænding <strong>ændringen i strømmen</strong>: den bremser en stigning og understøtter strømmen, når den aftager.</p></div>
        </div>
        <div class="formula-box"><small>Modelektromotorisk kraft  |  Lenz’ lov</small>e<sub>s</sub> = −L · di/dt</div>
        <p class="lesson-note">e<sub>s</sub> er en spænding i volt, selv om den kaldes en “kraft”. L er induktansen i henry (H), og di/dt fortæller, hvor hurtigt strømmen ændres, målt i A/s. Jo større L eller jo hurtigere ændring, desto større induceret spænding.</p>
      </article>
      <article class="learn-card"><h3>Regn på spolen</h3><p class="lesson-note">Startværdierne svarer til eksemplet: 230 V, 50 Hz, 1 H og 100 Ω. U og I er effektivværdier (RMS).</p>
        <div class="transient-fields">
          ${[['u','Spænding U (V RMS)'],['f','Frekvens f (Hz)'],['l','Induktans L (H)'],['r','Viklingsmodstand R (Ω)']].map(([id,label])=>`<div class="field"><label for="coil-${id}">${label}</label><input id="coil-${id}" type="number" min="${id==='u'||id==='r'?'0.000001':'0'}" step="any" value="${defaults[id]}" required></div>`).join('')}
        </div>
        <p class="lesson-note">R er modstanden i spolens tråd. X<sub>L</sub> beskriver virkningen af selvinduktionen ved den valgte frekvens.</p>
        <p id="coil-error" class="error" role="alert" hidden>U og R skal være større end 0. f og L skal være 0 eller større. Alle felter skal indeholde endelige tal.</p>
      </article>
      <article class="learn-card"><h3 id="coil-diagram-title">En virkelig spole har både R og L</h3>
        <svg id="coil-diagram" class="learn-svg transient-circuit" viewBox="0 0 600 270" role="img" aria-labelledby="coil-diagram-title"></svg>
        <p class="lesson-note">Spolen er her vist som sin elektriske erstatningsmodel: viklingsmodstanden R i serie med en ideel induktans L.</p>
        <div id="coil-metrics" class="metric-strip transient-metrics"></div>
      </article>
      <article class="learn-card full"><h3>Med og uden selvinduktion</h3><p class="lesson-note">Samme spænding og samme viklingsmodstand i begge beregninger.</p>
        <div id="coil-comparison" class="coil-comparison"></div><p id="coil-conclusion" class="lesson-note"></p>
      </article>
      <article class="learn-card"><h3>Sådan beregnes strømmen</h3>
        <div class="formula-list">
          <div class="formula-box"><small>1  |  Induktiv reaktans</small>X<sub>L</sub> = 2 · π · f · L</div>
          <div class="formula-box"><small>2  |  Impedansens størrelse</small>Z = √(R² + X<sub>L</sub>²)</div>
          <div class="formula-box"><small>3  |  Strøm i spolen</small>I = U / Z</div>
          <div class="formula-box"><small>Til sammenligning  |  hvis selvinduktionen ikke var til stede</small>I<sub>uden</sub> = U / R</div>
        </div>
        <p class="lesson-note">R og X<sub>L</sub> lægges sammen vektorielt, fordi de tilsvarende spændingsfald er 90° forskudt. Derfor bruges kvadratsummen, ikke R + X<sub>L</sub>.</p>
      </article>
      <article class="learn-card"><h3>Eksemplet med dine tal</h3><div id="coil-working" class="working"></div></article>
      <article class="learn-card full"><h3>Hvordan hænger mod-EMK og reaktans sammen?</h3>
        <div class="coil-steps coil-pair"><div><p>Ved sinusformet vekselstrøm kan virkningen af <strong>e<sub>s</sub> = −L · di/dt</strong> beskrives med <strong>X<sub>L</sub> = 2πfL</strong>. En højere frekvens betyder hurtigere ændringer, større reaktans og mindre strøm ved samme U og R.</p><p>Selvinduktionen gør også, at strømmen halter efter forsyningsspændingen. For en <strong>ideel spole</strong> er fasevinklen <strong>90°</strong>. For en <strong>virkelig eller reel spole</strong> ligger fasevinklen mellem <strong>0° og 90°</strong>, afhængigt af forholdet mellem modstanden R og reaktansen X<sub>L</sub>. Jo større R er i forhold til X<sub>L</sub>, desto mindre er vinklen. Jo større X<sub>L</sub> er i forhold til R, desto tættere er vinklen på 90°.</p></div>
          <div><div class="formula-box"><small>Induceret spænding  |  størrelse som effektivværdi</small>E<sub>s</sub> = I · X<sub>L</sub></div><div id="coil-emf" class="working"></div><p class="lesson-note">u<sub>L</sub> = L · di/dt er det induktive spændingsfald. Den inducerede EMK har modsat fortegn: e<sub>s</sub> = −u<sub>L</sub>. Effektivværdierne har samme størrelse. E<sub>s</sub> skal derfor ikke trækkes direkte fra U som almindelige tal.</p></div>
        </div>
        <p class="lesson-note">Ved konstant jævnstrøm er di/dt = 0, så der ikke længere induceres en mod-EMK. I denne model begrænses den stationære strøm da kun af R. Beregningerne her gælder en lineær spole og ser bort fra kernetab og magnetisk mætning.</p>
      </article>
    </div>`;
  document.querySelector('.app').append(section);
  section.querySelectorAll('input').forEach(input=>input.addEventListener('input',render));
  $('reset-module').addEventListener('click',event=>{
    if(document.querySelector('.topic-button.active')?.dataset.module!=='inductor')return;
    event.stopImmediatePropagation();
    for(const [id,value] of Object.entries(defaults))$(`coil-${id}`).value=value;
    render();
  },true);
  function render() {
    const U=$('coil-u').valueAsNumber,f=$('coil-f').valueAsNumber,L=$('coil-l').valueAsNumber,R=$('coil-r').valueAsNumber;
    const XL=2*Math.PI*f*L,Z=Math.hypot(R,XL),I=U/Z,without=U/R,Es=I*XL,phi=Math.atan2(XL,R)*180/Math.PI;
    const valid=[U,f,L,R,XL,Z,I,without,Es,phi].every(Number.isFinite)&&U>0&&R>0&&f>=0&&L>=0;
    $('coil-error').hidden=valid;
    for(const id of ['diagram','metrics','comparison','conclusion','working','emf'])$(`coil-${id}`).replaceChildren();
    if(!valid)return;
    const n=number;
    $('coil-metrics').innerHTML=[['Reaktans Xₗ',`${n(XL)} Ω`],['Impedans Z',`${n(Z)} Ω`],['Strøm I',`${n(I)} A`],['Fasevinkel φ',`${n(phi)}°`]].map(([label,value])=>`<div class="metric"><small>${label}</small><strong>${value}</strong></div>`).join('');
    $('coil-diagram').innerHTML=`<g fill="none" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round"><path d="M80 108V70H230M310 70H370 C370 40 400 40 400 70 C400 40 430 40 430 70 C430 40 460 40 460 70 H515V210H80V164"/><circle cx="80" cy="136" r="28"/><path d="M62 136Q71 116 80 136T98 136"/><rect x="230" y="59" width="80" height="22" rx="2"/><rect x="205" y="20" width="285" height="100" rx="14" stroke="var(--line)" stroke-dasharray="5 5"/></g><g text-anchor="middle"><text x="270" y="105">R = ${n(R)} Ω</text><text x="420" y="105">L = ${n(L)} H</text><text x="345" y="149">Spolens erstatningsmodel</text><text x="145" y="242">U = ${n(U)} V  |  f = ${n(f)} Hz</text><text x="151" y="35" style="fill:var(--orange)">I = ${n(I)} A</text></g><path d="M120 54H180M172 49L180 54L172 59" fill="none" stroke="var(--orange)" stroke-width="2.5"/>`;
    const ratio=Math.max(0,Math.min(1,I/without));
    $('coil-comparison').innerHTML=`<div class="coil-result"><span>Med selvinduktion</span><strong id="coil-current">${n(I)} A</strong><small>I = U / Z</small><div class="coil-bar" aria-hidden="true"><i style="width:${ratio*100}%"></i></div></div><div class="coil-result coil-without"><span>Uden selvinduktion (tænkt sammenligning)</span><strong id="coil-without-current">${n(without)} A</strong><small>I<sub>uden</sub> = U / R</small><div class="coil-bar" aria-hidden="true"><i style="width:100%"></i></div></div>`;
    $('coil-conclusion').textContent=XL>0?`Selvinduktionen giver her en reaktans på ${n(XL)} Ω. Strømmen bliver ${n(I)} A i stedet for ${n(without)} A — altså ${n(100*(1-ratio))} % mindre. Strømmen halter ${n(phi)}° efter spændingen.`:f===0?'Ved f = 0 vises grænsetilfældet med konstant jævnstrøm: Xₗ = 0, Z = R og I = U/R. Der er ingen mod-EMK, når strømmen er konstant.':'Ved L = 0 er der ingen selvinduktion: Xₗ = 0, Z = R og I = U/R.';
    $('coil-working').innerHTML=`<p>X<sub>L</sub> = 2 · π · ${n(f)} Hz · ${n(L)} H<br>= <b>${n(XL)} Ω</b></p><p>Z = √((${n(R)} Ω)² + (${n(XL)} Ω)²)<br>= <b>${n(Z)} Ω</b></p><p>I = ${n(U)} V / ${n(Z)} Ω<br>= <b>${n(I)} A</b></p><p>Uden selvinduktion:<br>I<sub>uden</sub> = ${n(U)} V / ${n(R)} Ω<br>= <b>${n(without)} A</b></p><p>φ = arctan(X<sub>L</sub>/R)<br>= arctan(${n(XL)} / ${n(R)})<br>= <b>${n(phi)}°</b></p>`;
    $('coil-emf').innerHTML=`<p>E<sub>s</sub> = ${n(I)} A · ${n(XL)} Ω<br>= <b>${n(Es)} V RMS</b></p>`;
  }
  render();
})();
