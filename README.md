# Kirchhoff Lab

En browserbaseret simulator til undervisning i lineære DC-kredsløb. Studerende kan placere komponenter, forbinde terminaler og beregne nodespændinger og grenstrømme med Kirchhoffs love.

## Funktioner

- Modstande, ideelle spændingskilder, ideelle strømkilder og jord
- Træk-og-slip-editor med klikbare terminaler
- Redigering af navn, værdi og orientering
- Modified Nodal Analysis (MNA) og Gauss-elimination direkte i browseren
- Nodespændinger og komponentstrømme med SI-præfikser
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

