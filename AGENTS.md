# You vs. The Other You — founder-life simulator

A hackathon web game. You play ages 16→30 as a founder. At each fork you pick
one of 4 life/founder philosophies (no correct answer). Your pick becomes YOU;
then THE OTHER YOU randomly takes a *different* option and keeps going without
you. Every choice leaves visible evidence on the two avatars, and at age 30 the
two lives meet. Fully playable, front-end only.

## Stack
- Vite + React (JavaScript, not TypeScript)
- Tailwind CSS v4 (via `@tailwindcss/vite` — theme lives in `src/index.css`
  under `@theme`, NOT a `tailwind.config.js`)
- Framer Motion for animation
- No backend, no router, no state library. All game state lives in `App.jsx`.

## Run it
```
npm install
npm run dev
```

## Demo / dev shortcut
`?view=play&step=N` jumps straight into a step, skipping the intro (see
`readBootstrap` in `App.jsx`). Step indices follow `SEQUENCE` in
`src/data/stages.js`: 0 stage1(16), 1 stage2(17), 2 wildcard1(19),
3 stage3(21), 4 stage4(22), 5 wildcard2(24), 6 stage5(25), 7 final(30).
State starts fresh at whatever step you jump to (deltas don't back-fill), so
use it to rehearse a screen, not to test accumulation.

## Content is data-driven — edit `src/data/stages.js`
Everything (prompts, options, pros/costs, hidden dollar deltas, traits, life
beats, avatar items/labels, wildcard effects) lives in the `SEQUENCE` array.
Change copy/outcomes there without touching components. Each step is
`type: "choice" | "wildcard" | "final"`.

**Hidden-outcome rule:** option cards must only ever show philosophy title,
body, PROS, and COSTS. `netWorthDelta`, `trait`, `beat`, and `item` are
**never** shown on a card before selection — they surface only after the pick,
through the net-worth/ticker/HUD updates. Don't leak them onto the card.

**Other-You rule:** THE OTHER YOU must never pick the same option as the
player. Enforced in `ChoiceStage` (`unchosen = options.filter(...)`).

## Visual system (don't drift without being asked)
- bg `#070812`, panel `#10111F`, card `#151725`
- text `#F4F0E8` / secondary `#A7A3B7`
- YOU cyan `#00E5FF`, OTHER YOU magenta `#FF2E88`, accent yellow `#F5FF3D`
- pros green `#37FF8B`, costs red `#FF4D6D`
- Headings: Space Grotesk (`font-heading`). Body/labels/stats: IBM Plex Mono.
- Uppercase mono is fine for labels/tags/status; NOT for long body copy.
- Dark arcade-terminal / split-timeline machine mood. Demo-friendly, readable
  from the back of a room — avoid tiny text and long paragraphs.

## Architecture / file map
- `src/App.jsx` — the state machine. Views: `landing → origin → play`. Holds
  `you`/`other` accumulated state (`netWorth`, `trait`, `beat`, `beats[]`,
  `accessories[]`), the current `stepIndex`, and `applyOutcome()` which folds a
  chosen option or wildcard effect into a player. Renders the right stage
  component per `SEQUENCE[stepIndex].type`.
- `src/data/stages.js` — all game content (see above) + `FAKE_LEADERBOARD`.
- `src/game/figure.js` — shared block-figure geometry (`FIGURE`, `VIEWBOX`,
  `ZONES`) so every avatar is identical to the one the intro splits into.
- `src/components/Avatar.jsx` — the block figure + all ~24 accessories (keyed
  by the kebab item ids in `stages.js`). Props: `color`, `accessories[]`,
  `newlyAddedAccessory` (pops/glitches in), `isGlitching`, `size`. Add a new
  accessory by adding an entry to the `ACCESSORIES` map.
- `src/components/AvatarColumn.jsx` — one player's living HUD: avatar +
  platform + animated net worth + trait + latest beat + "gained" flash.
- `src/components/MoneyValue.jsx` — eased number counter + `formatMoney`.
- `src/components/OptionCard.jsx` — a choice card. `status` drives styling:
  idle/you/other/cycling/dim + the LOCKED INTO YOU / OTHER YOU KEPT GOING stamps.
- `src/components/ChoiceStage.jsx` — a full fork: prompt banner, YOU column,
  2×2 cards, OTHER YOU column, continue. Runs the selection flow (pick → YOU
  applies immediately → 700ms beat → OTHER YOU cycles the unchosen cards in
  magenta → lands on a random different one → both resolved → Continue). Keys:
  1–4 select, **V** opens Room Vote, Enter continues once resolved.
- `src/components/RoomVote.jsx` — presenter overlay (fake, no backend). V opens
  it, 1–4 force a winner (yellow ROOM PICK), Enter commits that option as the
  player's pick, Esc closes.
- `src/components/WildcardStage.jsx` — full-screen yellow/black warning
  takeover. One button applies fixed asymmetric effects to both timelines
  (`wildcard.you` / `wildcard.other`), with camera-flash + avatar glitch. Not
  meant to feel fair — that's the point.
- `src/components/FinalReveal.jsx` — split-screen age-30 meeting: big avatars
  with all accumulated accessories, final net worth, the gap, BIGGER NUMBER
  label + "bigger number ≠ cleaner life" warning, stitched last-5 beats each,
  the fake leaderboard, a comparison-based closing line, and Refresh-to-replay.
  No winner badge, no happiness score, no moral judgement.
- `src/components/OriginSequence.jsx` — the intro. Grows a purple figure age
  1→16, then splits it into YOU/OTHER YOU and calls `onComplete()`. **Now
  timer-driven, not animation-callback-driven**, so a backgrounded tab can't
  get the intro stuck.
- `src/components/StartButton.jsx`, `Timeline.jsx`, `StatusBar.jsx`,
  `GlitchBackground.jsx`, `LeaderboardTeaser.jsx` — landing-screen pieces.

## Guardrails
- Keep it front-end only: no backend, auth, real voting, database, or AI calls.
- Don't leak hidden dollar outcomes onto cards (see hidden-outcome rule).
- Don't let one timeline read as the "correct"/winning life — the whole point
  is different consequences, not a ranked quiz.
- Stay within the visual system; refine within it.

## Verifying changes
No test suite. `npm run dev`, then use `?view=play&step=N` to land on the screen
you changed (desktop-first, ~1920×1080). Note: a long-backgrounded browser tab
throttles JS timers hard (Chrome intensive throttling), which stretches the
timed flows — verify in a foreground tab.
