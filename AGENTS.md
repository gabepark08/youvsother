# You vs. The Other You — hackathon landing page

Founder-life simulator hackathon project. Every decision creates another
version of you that keeps going. This repo currently contains **only the
landing/home screen** — no simulator logic, no routing, no backend.

## Stack
- Vite + React
- Tailwind CSS v4 (via `@tailwindcss/vite` plugin — theme lives in
  `src/index.css` under `@theme`, NOT a `tailwind.config.js`)
- Framer Motion for animation
- No backend, no router, no state management library

## Run it
```
npm install
npm run dev
```

## Visual system (do not drift from this without being asked)
- Background `#070812`, panel `#10111F`
- Text primary `#F4F0E8`, text secondary `#A7A3B7`
- YOU = cyan `#00E5FF`, OTHER YOU = magenta `#FF2E88`, accent yellow `#F5FF3D`
- Headings: Space Grotesk (`font-heading`). Body/UI: IBM Plex Mono (`font-mono`,
  applied globally on `body`)
- Dark arcade-terminal / split-timeline machine mood. Not corporate SaaS, not
  a generic quiz app. Bold, slightly irreverent, demo-friendly.

## File map
- `src/App.jsx` — page shell: bordered frame, status bar, hero grid, footer.
  Owns `hoverPulse` / `clickPulse` state and the global `Enter` keydown
  listener, passed down to `Timeline` and `StartButton`.
- `src/components/StatusBar.jsx` — top status bar (sim label, pulsing "LIVE
  FORK ENGINE" dot, "NO UNDO BUTTON").
- `src/components/Timeline.jsx` — the right-side dual timeline SVG. YOU is a
  smooth bezier path (`smoothPath`) with square nodes. OTHER YOU is a jagged
  polyline (`jaggedPath`) with circle nodes that still lands exactly on the
  6 age nodes (16/18/21/24/27/30). The two paths are tuned to cross twice and
  end at different-but-comparable endpoints — **this is deliberate: the
  message is "different lives," not "good path vs bad path."** Don't make one
  line read as winning/losing without being asked to.
- `src/components/StartButton.jsx` — CTA button + "PRESS ENTER OR CLICK TO
  BEGIN" microcopy. Takes `onStart` / `onHoverStart` props from `App`.
- `src/components/GlitchBackground.jsx` — scanlines, faint grid, drifting
  glitch streaks, vignette. Purely decorative, `pointer-events-none`.
- `src/components/OriginSequence.jsx` — plays after START THE FORK. A blocky
  figure grows procedurally from age 1 to 16 (purple, undifferentiated),
  pauses, then splits into YOU (cyan, left) and OTHER YOU (magenta, right),
  which push apart as a middle column (reserved for the question) expands
  between them. Each side shows a net worth stat and has room on its flanks
  to grow into (see "Planned, not yet built" below). 4 option boxes sit in
  the middle; hovering one scales it up slightly and brightens its border.

## Current interactions (already implemented, keep working)
- Hover on START THE FORK: button lifts up/right with magenta hard-shadow,
  cyan line does one glow pulse, magenta line jitters briefly, one node on
  each line flashes.
- Click on START THE FORK (or press Enter anywhere): logs `"Start clicked"`
  to console, triggers a brief cyan/magenta glitch flash over the timeline.
  Does NOT navigate anywhere yet — there is nothing to navigate to.
- Status bar dot pulses continuously. Background scanlines drift slowly.

## Planned, not yet built — do not implement until asked
- **Avatar items/accessories**: once the user picks an option, that choice
  should visually attach an item/accessory to the corresponding figure (YOU
  or OTHER YOU) — e.g. picking "invest" might give OTHER YOU a pair of shoes
  and YOU a bigger net worth number instead. This is why the YOU/OTHER YOU
  columns in `OriginSequence.jsx` were widened to `flex-1` — that's empty
  space reserved for accessories to appear in later, not a finished layout.
  Net worth is currently a static `$0` placeholder on both sides; nothing is
  wired to option clicks yet (the option boxes have no `onClick`/data model).

## Guardrails — do not do these unless explicitly asked
- Do not add a navbar, feature cards, or an explanation/about section.
- Do not add routing or a second screen (choice screen, ticker, voting,
  wildcard screens, final reveal all come later, out of scope for now).
- Do not add a backend, API calls, or persistence.
- Do not restructure the visual system (colors/fonts/mood) — refine within it.
- This is a hackathon demo screen: prioritize readability, visual polish, and
  a strong first impression over feature completeness.

## Verifying changes
There's no test suite. Verify visually: `npm run dev`, open the browser,
check the change renders correctly at a 1920x1080-ish desktop size (this is
desktop-first), and that hover/click/Enter interactions still work.
