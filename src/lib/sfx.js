// Lightweight synthesized sound effects via the Web Audio API — no audio
// assets required. All effects are generated on the fly. Safe to import
// anywhere: everything is guarded and a shared, lazily-created AudioContext is
// resumed on first user gesture (browsers block audio before interaction).

let ctx = null;
let muted = false;

function getCtx() {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

export function toggleMute() {
  muted = !muted;
  return muted;
}

export function isMuted() {
  return muted;
}

// Core tone helper: one oscillator through a gain envelope.
function tone({ freq = 440, type = "sine", start = 0, dur = 0.15, gain = 0.15, sweepTo = null }) {
  const ac = getCtx();
  if (!ac || muted) return;
  const t0 = ac.currentTime + start;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (sweepTo) osc.frequency.exponentialRampToValueAtTime(sweepTo, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

// Short bright click when the player locks in a choice.
export function playSelect() {
  tone({ freq: 620, type: "square", dur: 0.09, gain: 0.09 });
  tone({ freq: 930, type: "square", start: 0.05, dur: 0.09, gain: 0.06 });
}

// The rival's answer lands — a lower, moodier counter-blip.
export function playOther() {
  tone({ freq: 340, type: "sawtooth", dur: 0.12, gain: 0.08, sweepTo: 220 });
}

// Tiny tick used during money count-ups (call repeatedly).
export function playTick() {
  tone({ freq: 1200, type: "square", dur: 0.03, gain: 0.03 });
}

// Heavy impact for the "VS" clash / wildcard hit.
export function playImpact() {
  tone({ freq: 160, type: "sawtooth", dur: 0.32, gain: 0.16, sweepTo: 55 });
  tone({ freq: 90, type: "square", dur: 0.28, gain: 0.1, sweepTo: 45 });
}

// Yellow-flag alarm blips for a wildcard reveal.
export function playWildcard() {
  tone({ freq: 720, type: "square", dur: 0.12, gain: 0.08 });
  tone({ freq: 720, type: "square", start: 0.16, dur: 0.12, gain: 0.08 });
}

// Triumphant little arpeggio when the winner is declared.
export function playWinner() {
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C
  notes.forEach((f, i) => tone({ freq: f, type: "triangle", start: i * 0.1, dur: 0.28, gain: 0.13 }));
}
