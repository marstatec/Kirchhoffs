# Kirchhoff Lab

En browserbaseret simulator til undervisning i lineære DC-kredsløb. Studerende kan placere komponenter, forbinde terminaler og beregne nodespændinger og grenstrømme med Kirchhoffs love.

## Funktioner

- Modstande, ideelle spændingskilder, ideelle strømkilder og jord
- Træk-og-slip-editor med klikbare terminaler
- Frit redigerbare ledningsføringer med flytbare knækpunkter
- Redigering af navn, værdi og orientering
- Modified Nodal Analysis (MNA) og Gauss-elimination direkte i browseren
- Beregning uden krav om et synligt jordpotentiale
- Separat undervisningsfane med strømpile, knudepunktsligninger og maskeligninger
- Ét fælles kredsløbsdiagram for undervisningstrin 1–3
- Grenstrømme nummereres pr. kredsgren — ikke pr. komponent
- Læringsfaner for serieforbindelser, parallelforbindelser og klemspænding
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
2. Upload `index.html` og `README.md` til repository-roden.
3. Gå til **Settings → Pages**.
4. Vælg **Deploy from a branch**, branch `main` og mappen `/ (root)`.
5. Gem. GitHub viser derefter sidens offentlige adresse.

## Fortegnskonventioner

- En spændingskilde bruger `V(terminal 1) - V(terminal 2) = kildeværdien`.
- En positiv strømkilde løber fra terminal 1 mod terminal 2.
- En positiv beregnet komponentstrøm løber fra terminal 1 mod terminal 2.
- Terminal 1 er venstre terminal for vandrette komponenter og øverste terminal for lodrette komponenter.

## Begrænsninger i denne version

Simulatoren er til lineære, stationære DC-kredsløb. Den understøtter endnu ikke kondensatorer, spoler, afhængige kilder, ikke-lineære komponenter eller transientanalyse.

## Licens

MIT — tilpas og del frit i undervisningen.

