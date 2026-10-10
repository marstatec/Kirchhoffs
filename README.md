# Kirchhoff Lab

En browserbaseret simulator til undervisning i lineære DC-kredsløb. Studerende kan placere komponenter, forbinde terminaler og beregne nodespændinger og grenstrømme med Kirchhoffs love.

## Funktioner

- Modstande og spændingskilder med redigerbar indre modstand og vendbar polaritet
- IEC-symboler med rektangulære modstande og batteriplader for spændingskilder
- Træk-og-slip-editor med klikbare terminaler
- Frit redigerbare ledningsføringer med flytbare knækpunkter
- Redigering af navn, værdi og orientering
- Modified Nodal Analysis (MNA) og Gauss-elimination direkte i browseren
- Beregning uden krav om et synligt jordpotentiale
- Separat undervisningsfane med strømpile, knudepunktsligninger og maskeligninger
- Ét fælles kredsløbsdiagram for undervisningstrin 1–3
- Strøm- og maskepile vises konsekvent med uret: mod højre på vandrette grene og nedad på lodrette grene
- Grenstrømme nummereres pr. kredsgren — ikke pr. komponent
- Automatisk skalering samt tydelige maskepile placeret centralt i de enkelte masker
- Indbygget øvelseskredsløb med spændingskilderne E1–E4, modstandene R1, R2, R3, R5 og R6 samt knudepunkterne a, b og c
- Læringsfaner for serieforbindelser, parallelforbindelser og klemspænding
- Måleteknik med klikbare målepunkter, spænding/strøm/modstand, manuelt måleområde, strømindgange og simulerede sikringsfejl
- Instrumentlære med analog klasse 1,5, digital procent-plus-cifre-nøjagtighed og forklaring af instrumentmærkning
- Magnetisme og induktion med dynamiske feltlinjer, kompas, spolepoler, magnetiske domæner, permanente magneter, motorkraft og induceret spænding
- Fem håndregler med retningsdiagrammer og direkte kobling til interaktive eksempler
- Faradays induktionslov samt beregning af 1–6 magnetisk ukoblede induktanser i serie og parallel
- Wheatstonebro med dynamiske midtpunktsspændinger, grenstrømme, nuldetektor og beregning af en valgfri ukendt modstand ved balance
- Ledningsmodstand som funktion af materiale, længde, tværsnit og temperatur samt spændingsfald, effekttab og temperatur bestemt ud fra modstandsmåling
- Elektriske felter med dynamiske feltlinjer, potentiale omkring en punktladning, Coulombkraft, parallelle plader og elektrostatisk skærmning
- Galvaniske celler med redoxreaktioner, elektron- og strømretning, belastet celle, indre tab samt batterier i serie og parallel
- Kondensatorfane med RC-opladning/afladning, tidskonstant, ladning, energi og interaktive tidskurver
- Beskrivende spolefane om selvinduktion og modelektromotorisk kraft ved vekselstrøm, med reaktans, impedans og sammenligning af strøm med/uden selvinduktion
- Tidsskyder, afspilning og mellemregninger fra 0 til 5 tidskonstanter i kondensatorfanen
- VektorLab-design med samme mørke tema, emnemenu, topbjælke, kort og indtastningsfelter
- Mobil emnemenu som i VektorLab: hamburgerknap, indskydeligt sidepanel og lukning via tilbageknap eller baggrund
- Valg af 1–6 modstande/grene direkte i serie- og parallelfanerne
- Dynamiske modstandslister, kredsløbstegninger og mellemregninger med enheder
- Lyst/mørkt tema, tekstskalering og nulstilling af den aktive fane
- Ortonormal ledningsføring med kun vandrette og lodrette segmenter
- Komponentstrømme og spændingsfald med SI-præfikser
- Ingen server, installation eller eksterne biblioteker

## Kør lokalt

Åbn `index.html` direkte i en browser, eller start en lokal server:

```bash
python -m http.server 8000
```

Åbn derefter `http://localhost:8000`.

## Publicér med GitHub Pages

1. Opret et nyt GitHub-repository.
2. Upload `index.html`, `transients.js`, `coil.js`, `transients.css`, `measurement.js`, `measurement.css`, `magnetism.js`, `magnetism.css`, `resistance-tools.js`, `resistance-tools.css`, `electric-fields.js`, `electric-fields.css`, `galvanic-cell.js`, `galvanic-cell.css` og `README.md` til repository-roden.
3. Gå til **Settings → Pages**.
4. Vælg **Deploy from a branch**, branch `main` og mappen `/ (root)`.
5. Gem. GitHub viser derefter sidens offentlige adresse.

## Fortegnskonventioner

- En spændingskilde bruger `V(terminal 1) - V(terminal 2) = kildeværdien`.
- En positiv strømkilde løber fra terminal 1 mod terminal 2.
- En positiv beregnet komponentstrøm løber fra terminal 1 mod terminal 2.
- Terminal 1 er venstre terminal for vandrette komponenter og øverste terminal for lodrette komponenter.

## Begrænsninger i denne version

Den frie kredsløbseditor er til lineære, stationære DC-kredsløb og understøtter ikke kondensatorer, spoler, afhængige kilder eller ikke-lineære komponenter. Kondensatorfanen beregner analytisk opladning og afladning i en ideel RC-seriekreds. Spolefanen bruger en lineær R–L-erstatningsmodel i sinusformet stationær vekselstrøm og ser bort fra kernetab og magnetisk mætning. Spolefanen behandler ikke ind- og udkoblingsforløb.

Magnetismefanens feltberegninger antager en lang, ret leder eller en lang luftspole. Felttegningerne er skematiske; domæner og remanens er en kvalitativ undervisningsmodel, ikke en numerisk B–H-model. Induktansformlerne gælder ideelle, magnetisk ukoblede spoler.

## Licens

MIT — tilpas og del frit i undervisningen.

