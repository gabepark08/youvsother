import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AvatarColumn from "./AvatarColumn";
import OptionCard from "./OptionCard";
import RoomVote from "./RoomVote";
import RoundVerdict from "./RoundVerdict";
import StageProgress from "./StageProgress";
import MoneyValue, { formatMoney } from "./MoneyValue";
import { playSelect, playOther } from "../lib/sfx";

const YOU_COLOR = "#00E5FF";
const OTHER_COLOR = "#FF2E88";

// Derive the display state for one player: incoming accumulated state with the
// stage's chosen option applied (so the HUD updates live during the stage).
function applyOption(base, option) {
  if (!option) {
    return {
      netWorth: base.netWorth,
      trait: base.trait,
      beat: base.beat,
      accessories: base.accessories,
      newly: undefined,
      gained: null,
    };
  }
  return {
    netWorth: base.netWorth + option.netWorthDelta,
    trait: option.trait,
    beat: option.beat,
    accessories: [...base.accessories, option.item],
    newly: option.item,
    gained: option.itemLabel,
  };
}

// Compact live stat card used on smaller screens in place of the full avatar
// columns, so the head-to-head net worth / trait is still visible.
function MiniStat({ identity, color, display, align = "left" }) {
  return (
    <div
      className={`flex flex-col gap-1 border-2 bg-panel/50 px-4 py-3 ${align === "right" ? "items-end text-right" : "items-start text-left"}`}
      style={{ borderColor: `${color}55` }}
    >
      <span className="font-heading text-sm font-bold tracking-[0.16em] uppercase" style={{ color }}>
        {identity}
      </span>
      <span className="font-heading text-2xl font-bold text-text-primary">
        <MoneyValue value={display.netWorth} />
      </span>
      <span className="font-mono text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color }}>
        {display.trait}
      </span>
    </div>
  );
}

export default function ChoiceStage({ stage, stepIndex, you, other, roundsWon = { you: 0, other: 0 }, onContinue, continueLabel }) {
  const [selectedId, setSelectedId] = useState(null);
  const [otherCyclingId, setOtherCyclingId] = useState(null);
  const [otherSelectedId, setOtherSelectedId] = useState(null);
  const [isResolvingOther, setIsResolvingOther] = useState(false);
  const [voteOpen, setVoteOpen] = useState(false);
  // Ephemeral, punchy "lock-in" banner: { text, color } or null.
  const [lockFlash, setLockFlash] = useState(null);

  const options = stage.options;
  const selectedOption = useMemo(
    () => options.find((o) => o.id === selectedId),
    [options, selectedId],
  );
  const otherSelectedOption = useMemo(
    () => options.find((o) => o.id === otherSelectedId),
    [options, otherSelectedId],
  );

  const canSelect = !selectedId && !isResolvingOther;
  const resolved = Boolean(selectedId && otherSelectedId);

  const handleSelect = useCallback(
    (id) => {
      if (selectedId || isResolvingOther) return;
      setSelectedId(id);
      // Loud "you locked in" moment.
      playSelect();
      setLockFlash({ text: "You Locked In", color: YOU_COLOR });
      setTimeout(() => setLockFlash(null), 900);
      const unchosen = options.filter((o) => o.id !== id);

      // Beat, then run the OTHER YOU random-selection animation.
      setTimeout(() => {
        setIsResolvingOther(true);
        let index = 0;
        setOtherCyclingId(unchosen[0].id);
        const intervalId = setInterval(() => {
          index = (index + 1) % unchosen.length;
          setOtherCyclingId(unchosen[index].id);
        }, 170);

        const duration = 1300 + Math.random() * 600;
        setTimeout(() => {
          clearInterval(intervalId);
          // Strategic Other You: always locks in the highest net-worth option
          // still on the table, so it plays like a rival optimizing for money.
          const finalOption = unchosen.reduce((best, o) =>
            o.netWorthDelta > best.netWorthDelta ? o : best,
          );
          setOtherCyclingId(null);
          setOtherSelectedId(finalOption.id);
          setIsResolvingOther(false);
          // Loud "other you kept going" counter-moment.
          playOther();
          setLockFlash({ text: "Other You Kept Going", color: OTHER_COLOR });
          setTimeout(() => setLockFlash(null), 1100);
        }, duration);
      }, 700);
    },
    [options, selectedId, isResolvingOther],
  );

  // Keyboard: 1-4 select, V opens room vote (before picking), Enter continues.
  useEffect(() => {
    function onKeyDown(e) {
      if (voteOpen) return; // RoomVote owns the keyboard while open
      if (e.key.toLowerCase() === "v" && canSelect) {
        setVoteOpen(true);
        return;
      }
      if (resolved && e.key === "Enter") {
        onContinue({ youOptionId: selectedId, otherOptionId: otherSelectedId });
        return;
      }
      if (!canSelect) return;
      const index = Number(e.key) - 1;
      if (index >= 0 && index < options.length) handleSelect(options[index].id);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [voteOpen, canSelect, resolved, options, handleSelect, onContinue, selectedId, otherSelectedId]);

  const youDisplay = applyOption(you, selectedOption);
  const otherDisplay = applyOption(other, otherSelectedOption);

  const paragraphs = stage.prompt.split("\n\n");

  // Copy polish: the panel heading already conveys "no correct answer", so drop
  // that repeated lead-in from the subtext. First fork gets its own heading.
  const isFirstFork = stage.age === 16;
  const cleanSubtext = stage.subtext.replace(/^\s*no correct answer\.?\s*/i, "");

  // Standings as you WALK INTO this stage (based on cumulative net worth so far).
  const roundsPlayed = roundsWon.you + roundsWon.other;
  const enteringGap = Math.abs(you.netWorth - other.netWorth);
  const enteringLeader =
    you.netWorth > other.netWorth ? "you" : other.netWorth > you.netWorth ? "other" : "tie";
  const enteringLine =
    enteringLeader === "tie"
      ? "Dead even"
      : `${enteringLeader === "you" ? "You lead" : "Other You leads"} by ${formatMoney(enteringGap)}`;

  return (
    <div className="relative mx-auto flex min-h-full w-full max-w-[1560px] flex-col items-center justify-center gap-4 pb-2 pt-14 md:pt-2">
      {/* punchy lock-in flash banner */}
      <AnimatePresence>
        {lockFlash && (
          <motion.div
            key={lockFlash.text}
            className="pointer-events-none absolute inset-x-0 top-1/2 z-30 flex -translate-y-1/2 justify-center"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <div
              className="border-4 bg-bg/85 px-8 py-4 font-heading text-3xl font-bold tracking-[0.14em] uppercase backdrop-blur-sm md:text-5xl"
              style={{ color: lockFlash.color, borderColor: lockFlash.color }}
            >
              {lockFlash.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <StageProgress stepIndex={stepIndex} />

      {/* prompt banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="grid w-full grid-cols-1 items-stretch gap-5 border-2 border-[#F4F0E8]/20 bg-panel/60 px-5 py-4 text-left md:px-9 md:py-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8"
      >
        <div>
          <div className="font-mono text-sm font-bold tracking-[0.24em] text-accent uppercase">
            {stage.label}
          </div>
          <div className="mt-3 space-y-2 max-w-4xl">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={
                  i === paragraphs.length - 1
                    ? "font-heading text-2xl font-bold leading-tight text-text-primary"
                    : "font-heading text-lg font-medium leading-snug text-text-primary/90"
                }
              >
                {p}
              </p>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center border border-[#F4F0E8]/20 bg-bg/45 px-5 py-4">
          <div className="font-mono text-xs font-bold tracking-[0.16em] text-accent uppercase">
            {isFirstFork ? "First Fork Rule" : "Both Lives Continue"}
          </div>
          <p className="mt-3 font-mono text-xs leading-relaxed text-text-secondary">
            {cleanSubtext}
          </p>

          {roundsPlayed > 0 && (
            <div className="mt-3 border-t border-[#F4F0E8]/12 pt-3">
              <div className="font-mono text-[10px] font-bold tracking-[0.18em] text-text-secondary/60 uppercase">
                Standings
              </div>
              <div className="mt-1.5 flex items-center justify-between font-mono text-xs font-bold">
                <span style={{ color: YOU_COLOR }}>YOU {roundsWon.you}</span>
                <span className="text-[9px] tracking-[0.14em] text-text-secondary/40 uppercase">
                  Rounds
                </span>
                <span style={{ color: OTHER_COLOR }}>{roundsWon.other} OTHER</span>
              </div>
              <div
                className="mt-1.5 font-mono text-[10px] tracking-[0.1em] uppercase"
                style={{
                  color:
                    enteringLeader === "you"
                      ? YOU_COLOR
                      : enteringLeader === "other"
                        ? OTHER_COLOR
                        : "#F4F0E8",
                }}
              >
                {enteringLine}
              </div>
            </div>
          )}

          <p className="mt-3 font-mono text-[10px] tracking-[0.14em] text-text-secondary/60 uppercase">
            Press V // Room vote
          </p>
        </div>
      </motion.div>

      {/* YOU · cards · OTHER YOU (arcade layout on xl, stacked below) */}
      <div className="flex w-full flex-col items-center gap-5 xl:flex-row xl:items-stretch xl:justify-center xl:gap-7">
        <div className="hidden flex-1 items-center justify-center xl:flex">
          <AvatarColumn
            identity="You"
            color={YOU_COLOR}
            netWorth={youDisplay.netWorth}
            trait={youDisplay.trait}
            beat={youDisplay.beat}
            accessories={youDisplay.accessories}
            newlyAddedAccessory={youDisplay.newly}
            gainedLabel={youDisplay.gained}
          />
        </div>

        {/* compact head-to-head stats for smaller screens */}
        <div className="grid w-full max-w-[760px] grid-cols-2 gap-3 xl:hidden">
          <MiniStat identity="You" color={YOU_COLOR} display={youDisplay} />
          <MiniStat identity="Other You" color={OTHER_COLOR} display={otherDisplay} align="right" />
        </div>

        <div className="grid w-full max-w-[760px] grid-cols-1 gap-4 sm:grid-cols-2 xl:w-[760px] xl:shrink-0">
          {options.map((option) => {
            let status = "idle";
            if (selectedId === option.id) status = "you";
            else if (otherSelectedId === option.id) status = "other";
            else if (otherCyclingId === option.id) status = "cycling";
            else if (selectedId && otherSelectedId) status = "dim";
            return (
              <OptionCard
                key={option.id}
                option={option}
                status={status}
                disabled={!canSelect || voteOpen}
                onSelect={handleSelect}
              />
            );
          })}
        </div>

        <div className="hidden flex-1 items-center justify-center xl:flex">
          <AvatarColumn
            identity="Other You"
            color={OTHER_COLOR}
            netWorth={otherDisplay.netWorth}
            trait={otherDisplay.trait}
            beat={otherDisplay.beat}
            accessories={otherDisplay.accessories}
            newlyAddedAccessory={otherDisplay.newly}
            gainedLabel={otherDisplay.gained}
          />
        </div>
      </div>

      {/* round verdict + continue */}
      <div className="flex min-h-14 w-full flex-col items-center gap-3">
        <AnimatePresence>
          {resolved && selectedOption && otherSelectedOption && (
            <RoundVerdict
              key="verdict"
              youDelta={selectedOption.netWorthDelta}
              otherDelta={otherSelectedOption.netWorthDelta}
              youTotal={youDisplay.netWorth}
              otherTotal={otherDisplay.netWorth}
              priorWins={roundsWon}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {resolved && (
            <motion.button
              type="button"
              className="border-2 border-accent bg-accent px-6 py-3 font-heading text-sm font-bold tracking-[0.18em] text-bg uppercase"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.9, ease: "easeOut" }}
              whileHover={{ x: 4 }}
              onClick={() => onContinue({ youOptionId: selectedId, otherOptionId: otherSelectedId })}
            >
              {continueLabel} &rarr;
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {voteOpen && (
          <RoomVote
            options={options}
            onChoose={(id) => {
              setVoteOpen(false);
              handleSelect(id);
            }}
            onClose={() => setVoteOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
