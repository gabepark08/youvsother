import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StatusBar from "./components/StatusBar";
import Timeline from "./components/Timeline";
import StartButton from "./components/StartButton";
import GlitchBackground from "./components/GlitchBackground";
import OriginSequence from "./components/OriginSequence";
import LeaderboardTeaser from "./components/LeaderboardTeaser";
import ChoiceStage from "./components/ChoiceStage";
import WildcardStage from "./components/WildcardStage";
import FinalReveal from "./components/FinalReveal";
import { SEQUENCE, STARTING_NET_WORTH } from "./data/stages";

const INITIAL_PLAYER = {
  netWorth: STARTING_NET_WORTH,
  trait: "Unwritten",
  beat: "The first fork is coming.",
  beats: [],
  accessories: [],
};

const INITIAL_OTHER = {
  ...INITIAL_PLAYER,
  beat: "Waiting to become inconvenient.",
};

// Apply a chosen option / wildcard effect (both share the same shape) to a
// player's accumulated state.
function applyOutcome(state, outcome) {
  return {
    netWorth: state.netWorth + outcome.netWorthDelta,
    trait: outcome.trait,
    beat: outcome.beat,
    beats: [...state.beats, outcome.beat],
    accessories: [...state.accessories, outcome.item],
  };
}

// Share of the current lead that a wildcard swings. The bigger your lead, the
// harder the market/luck knocks you back down.
const LEAD_TAX_RATE = 0.22; // leader loses ~22% of their lead on top of the base hit
const UNDERDOG_SHARE = 0.55; // trailer recovers ~55% of that swing

// Rubber-band a wildcard against the current standings. Returns the wildcard
// with adjusted deltas plus a `rubberBand` descriptor for the UI. Deterministic
// (no randomness) so the displayed numbers always match what gets applied.
function resolveWildcard(wildcard, youNet, otherNet) {
  const gap = youNet - otherNet; // + => You are ahead
  const swing = Math.round(Math.abs(gap) * LEAD_TAX_RATE);

  // Effectively level race: no catch-up drama, run the wildcard as authored.
  if (swing < 1 || gap === 0) return { ...wildcard, rubberBand: null };

  const leaderKey = gap > 0 ? "you" : "other";
  const trailerKey = gap > 0 ? "other" : "you";
  const boost = Math.round(swing * UNDERDOG_SHARE);

  return {
    ...wildcard,
    [leaderKey]: {
      ...wildcard[leaderKey],
      netWorthDelta: wildcard[leaderKey].netWorthDelta - swing,
    },
    [trailerKey]: {
      ...wildcard[trailerKey],
      netWorthDelta: wildcard[trailerKey].netWorthDelta + boost,
    },
    rubberBand: { leaderKey, trailerKey, swing, boost },
  };
}

function continueLabel(nextStep) {
  if (!nextStep) return "Continue";
  if (nextStep.type === "final") return "See Age 30";
  return `Continue to Age ${nextStep.age}`;
}

// Dev / demo bootstrap: ?view=play&step=N jumps straight to a step, skipping
// the intro. Handy for rehearsing a specific stage. Ignored in normal play.
function readBootstrap() {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  if (params.get("view") !== "play") return null;
  const step = Number(params.get("step"));
  return { stepIndex: Number.isInteger(step) ? Math.max(0, Math.min(step, SEQUENCE.length - 1)) : 0 };
}

function App() {
  const bootstrap = readBootstrap();
  const [isStartHovered, setIsStartHovered] = useState(false);
  const [clickPulse, setClickPulse] = useState(0);
  const [view, setView] = useState(bootstrap ? "play" : "landing"); // landing | origin | play
  const [stepIndex, setStepIndex] = useState(bootstrap ? bootstrap.stepIndex : 0);
  const [you, setYou] = useState(INITIAL_PLAYER);
  const [other, setOther] = useState(INITIAL_OTHER);
  // Log of resolved rounds ({ youDelta, otherDelta }) used to compute the
  // running "rounds won" scoreboard shown each stage.
  const [rounds, setRounds] = useState([]);

  const handleStart = useCallback(() => {
    setClickPulse((c) => c + 1);
    if (view === "landing") {
      setTimeout(() => setView("origin"), 550);
    }
  }, [view]);

  useEffect(() => {
    function onKeyDown(e) {
      if (view === "landing" && e.key === "Enter") handleStart();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [view, handleStart]);

  const advance = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, SEQUENCE.length - 1));
  }, []);

  const handleChoiceContinue = useCallback(
    ({ youOptionId, otherOptionId }) => {
      const stage = SEQUENCE[stepIndex];
      const youOption = stage.options.find((o) => o.id === youOptionId);
      const otherOption = stage.options.find((o) => o.id === otherOptionId);
      setYou((s) => applyOutcome(s, youOption));
      setOther((s) => applyOutcome(s, otherOption));
      setRounds((r) => [...r, { youDelta: youOption.netWorthDelta, otherDelta: otherOption.netWorthDelta }]);
      advance();
    },
    [stepIndex, advance],
  );

  const handleWildcardContinue = useCallback(() => {
    // Re-resolve with the same (unchanged) net worth used for display, so the
    // rubber-banded deltas applied to state match exactly what the player saw.
    const wildcard = resolveWildcard(SEQUENCE[stepIndex], you.netWorth, other.netWorth);
    setYou((s) => applyOutcome(s, wildcard.you));
    setOther((s) => applyOutcome(s, wildcard.other));
    setRounds((r) => [...r, { youDelta: wildcard.you.netWorthDelta, otherDelta: wildcard.other.netWorthDelta }]);
    advance();
  }, [stepIndex, you.netWorth, other.netWorth, advance]);

  const isLanding = view === "landing";
  const step = SEQUENCE[stepIndex];
  const nextStep = SEQUENCE[stepIndex + 1];

  // Rounds won so far (from completed stages) — the running scoreboard state.
  const roundsWon = {
    you: rounds.filter((r) => r.youDelta > r.otherDelta).length,
    other: rounds.filter((r) => r.otherDelta > r.youDelta).length,
  };

  // Wildcards are rubber-banded against the current standings before display.
  const resolvedStep =
    step.type === "wildcard" ? resolveWildcard(step, you.netWorth, other.netWorth) : step;

  return (
    <div className="scrollbar-hide relative min-h-screen w-screen overflow-x-hidden overflow-y-auto bg-bg text-text-primary font-mono">
      <GlitchBackground />

      {/* thin border frame around the whole visible page */}
      <div className="pointer-events-none fixed inset-3 z-30 border border-[#F4F0E8]/15 md:inset-4" />

      <div className="relative z-20 flex min-h-screen flex-col">
        {isLanding && <StatusBar />}

        <main
          className={`flex min-h-0 flex-1 ${
            isLanding
              ? "items-start px-8 pt-8 md:px-16 lg:items-center lg:pt-0"
              : "items-center justify-center px-6 py-6 md:px-10"
          }`}
        >
          <AnimatePresence mode="wait">
            {isLanding ? (
              <motion.div
                key="landing"
                className="grid w-full grid-cols-1 items-center gap-12 lg:mt-8 lg:grid-cols-[1.15fr_0.85fr]"
                exit={{ opacity: 0, transition: { duration: 0.35 } }}
              >
                <motion.div
                  className="max-w-2xl"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <h1 className="font-heading text-6xl font-bold leading-[0.95] tracking-tight uppercase sm:text-7xl xl:text-8xl">
                    <span className="text-you">YOU</span>{" "}
                    <span className="text-[0.5em] font-medium text-white/90">vs.</span>
                    <br />
                    <span className="text-other">THE OTHER YOU</span>
                  </h1>

                  <p className="mt-8 max-w-lg text-base text-text-secondary md:text-lg">
                    A founder-life simulator where every choice creates a version of you
                    that keeps going without permission.
                  </p>

                  <p className="mt-4 max-w-lg font-mono text-[13px] tracking-wide text-text-secondary md:text-sm">
                    5 forks. 2 wildcards. 2 futures.{" "}
                    <span className="text-accent">No correct path.</span>
                  </p>

                  <div className="mt-10 mb-4">
                    <StartButton
                      onStart={handleStart}
                      onHoverStart={() => setIsStartHovered(true)}
                      onHoverEnd={() => setIsStartHovered(false)}
                    />
                  </div>
                </motion.div>

                <div className="hidden w-full justify-self-end lg:flex">
                  <Timeline isStartHovered={isStartHovered} clickPulse={clickPulse} />
                </div>
              </motion.div>
            ) : view === "origin" ? (
              <motion.div
                key="origin"
                className="flex h-full min-h-[80vh] w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.4 } }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <OriginSequence onComplete={() => setView("play")} />
              </motion.div>
            ) : (
              <motion.div
                key={`step-${stepIndex}`}
                className="flex w-full items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                transition={{ duration: 0.45 }}
              >
                {step.type === "choice" && (
                  <ChoiceStage
                    key={step.id}
                    stage={step}
                    you={you}
                    other={other}
                    roundsWon={roundsWon}
                    continueLabel={continueLabel(nextStep)}
                    onContinue={handleChoiceContinue}
                  />
                )}
                {step.type === "wildcard" && (
                  <WildcardStage
                    key={step.id}
                    wildcard={resolvedStep}
                    you={you}
                    other={other}
                    roundsWon={roundsWon}
                    onContinue={handleWildcardContinue}
                  />
                )}
                {step.type === "final" && <FinalReveal you={you} other={other} />}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {isLanding && (
          <footer className="flex h-8 shrink-0 items-center justify-center border-t border-[#F4F0E8]/10 px-6 text-center text-[10px] leading-none tracking-wide text-text-secondary md:px-10">
            <span className="whitespace-nowrap">
              Built for people who think one life path is suspiciously low sample size.
            </span>
          </footer>
        )}
      </div>

      {isLanding && <LeaderboardTeaser />}
    </div>
  );
}

export default App;
