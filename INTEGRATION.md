# Croupier Ops dashboard – hur den är tänkt och hur du kör den lokalt

Källa för allt labb-relaterat: `https://gitlab.com/scout-gg/croupier`, branch `jakeminator123/work`,
HEAD `94a268837538e656376dcfd2afd64199a6ca8310`. Inget i GitLab har ändrats av den här dashboarden.

## 1. Idén: en brygga, inte en kopia

Labbet i repot (`lab/`) är en egen Next.js-app som startas med `Start-Labb.cmd` och lyssnar på
`http://127.0.0.1:4188`. Den vy du vill ha in är `lab/components/studio.tsx` (renderas av
`lab/app/studio-page.tsx`).

Den här dashboarden kopierar **inte** den koden. I stället finns `components/croupier-lab-view.tsx`
som kan visa Studio på två sätt:

| Läge | När | Hur |
| --- | --- | --- |
| **Iframe-brygga** (standard) | Dashboard och labb körs som två appar lokalt | Fliken *Croupier Lab* → *Visa labbet*. Adressen är förifylld med `127.0.0.1:4188`. |
| **Direkt React-mount** | Du flyttar dashboarden in i `croupier`-repot | `<CroupierLabView><StudioPage /></CroupierLabView>` – children-slotten ersätter iframen. |

Fördel: labbets UI, data och beteende ägs fortsatt av GitLab-branchen. Ändrar du `studio.tsx` där
syns det direkt här utan att något behöver synkas.

## 2. Kör lokalt (två terminaler)

```bash
# Terminal 1 – labbet (i croupier-repot)
Start-Labb.cmd          # eller: cd lab && npm run dev   → 127.0.0.1:4188

# Terminal 2 – den här dashboarden
pnpm install
pnpm dev                # → http://localhost:3000
```

Öppna dashboarden, fliken **Croupier Lab** är förvald, tryck **Visa labbet**.
Kör du dashboarden över HTTPS (t.ex. v0-previewn) blockerar webbläsaren en lokal HTTP-iframe
(mixed content) – då visas en gul ruta och knappen **Egen flik** används i stället. Lokalt över
HTTP finns inte den spärren.

## 3. Flytta in dashboarden i repot (valfritt, senare)

1. Kopiera `components/scout-logo.tsx`, `components/croupier-lab-view.tsx` samt Scout-delarna i
   `tailwind.config.ts` (`colors.scout`, `keyframes`, `animation`, `fontFamily`) och
   `app/globals.css` (`.dark`-tokens, `@layer utilities`-blocket).
2. Rendera: `import StudioPage from "@/app/studio-page"` och
   `<CroupierLabView><StudioPage /></CroupierLabView>`.
3. Ta bort `defaultUrl`/iframe-vägen om du inte längre behöver den – den ligger helt i
   `croupier-lab-view.tsx`.

## 4. Scout Gaming-profilen

Färgerna är hämtade från `:root` på scoutgaminggroup.com och ligger som Tailwind-tokens:

| Token | Hex | Används till |
| --- | --- | --- |
| `scout-ink` | `#0A0B0D` | Bakgrund överallt |
| `scout-off` | `#F2F1ED` | Text, wordmark (aldrig ren vit) |
| `scout-lime` / `scout-lime-deep` | `#D6FF3A` / `#B5DC1F` | Enda accenten: snedstreck, aktiv nav, status, CTA |
| `scout-steel` / `scout-steel-deep` | `#5A6470` / `#1F252E` | Sekundär text, etiketter, paneler |
| ramar | `rgba(242,241,237,0.14)` | `border-scout-off/10..15` |

Typsnitt (samma som sajten, via `next/font`): **Space Grotesk** för rubriker/nav (`font-display`),
**Inter** för brödtext (`font-sans`), **JetBrains Mono** för `// etiketter` och kod (`font-mono`).
shadcn-tokens i `.dark` (`--primary`, `--ring`, `--border` …) är mappade till samma palett så att
alla `components/ui/*` följer profilen automatiskt.

Undersidorna (Command Center, Agent Network, Operations, Intelligence, Systems) fick en
sök/ersätt `orange-* → scout-lime` så att de följer paletten utan att layouten rördes.

## 5. Logotypen – pedagogiskt

`components/scout-logo.tsx` exporterar två saker:

- `ScoutLogo` – wordmarket `scout` **/** `gaming`. Props: `size` (`sm|md|lg|xl`), `tagline`,
  `animated` (default `true`), `className`.
- `ScoutMark` – bara snedstrecket i en kvadrat, för hopfälld sidomeny/favicon.

Regeln som komponenten kodar in: **snedstrecket är brandet**. Det är den enda delen i lime och
därför den enda som får vara 3D och animerad. Orden är alltid `scout-off`, samma vikt, tight
tracking (`-0.04em`). Snedstrecket roterar runt sin Y-axel och skjuts framåt på Z
(`animate-slash-swing` + `preserve-3d`) med en svag lime-glow. Fliken *Croupier Lab* visar en
"Brand anatomy"-panel med logotyp, tagline och alla swatches med förklaring.

## 6. Animation och 3D – bara CSS, inga nya beroenden

Allt är Tailwind-keyframes i `tailwind.config.ts` + små utilities i `app/globals.css`:

| Klass | Effekt | Var |
| --- | --- | --- |
| `animate-reveal-up` + `.stagger` (`--i`) | Fade/slide in med fördröjning per barn | Sidomeny, rubriker, steg-korten |
| `animate-reveal-3d` | Hela "monitorn" faller in i perspektiv | Labbramen |
| `.perspective-1400` + `.tilt-card` | Kortet lutar (`--tilt-x/--tilt-y`) och rätar upp sig vid hover/focus eller `data-flat="true"` | Labbramen (rätar upp sig när vyn är live), workspace-panelen, steg-korten |
| `animate-slash-swing` + `.preserve-3d` | Snedstrecket roterar i 3D | Logotypen |
| `animate-scan` | Lime-svep över ramen tills en vy är monterad | Labbramen (tomt läge) |
| `animate-glow-pulse` | Andande statuspunkt / hörnglow | Statusprickar, hero-glow |
| `.scout-grid` + `animate-grid-drift` | Fint tekniskt rutnät som driver långsamt | Bakgrund i main och tomt läge |

`prefers-reduced-motion: reduce` stänger av allt ovan. Labbets egna stilar (`lab/app/globals.css`)
körs oberört inuti iframen/children – dashboardens tema läcker inte in i Studio.

## 7. Filkarta

```
app/layout.tsx                 fonter, dark-klass, metadata
app/page.tsx                   skal: sidomeny, topbar, sektioner (Croupier Lab förvald)
app/globals.css                Scout-tokens för shadcn, 3D/animations-utilities
tailwind.config.ts             colors.scout, fontFamily, keyframes, animation
components/scout-logo.tsx      ScoutLogo, ScoutMark
components/croupier-lab-view.tsx  bryggan (iframe eller children), brand anatomy
next.config.mjs                säkerhetsheaders
```
