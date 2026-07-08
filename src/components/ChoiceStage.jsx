import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AvatarColumn from "./AvatarColumn";
import OptionCard from "./OptionCard";
import RoomVote from "./RoomVote";

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

export default function ChoiceStage({ stage, you, other, onContinue, continueLabel }) {
  const [selectedId, setSelectedId] = useState(null);
  const [otherCyclingId, setOtherCyclingId] = useState(null);
  const [otherSelectedId, setOtherSelectedId] = useState(null);
  const [isResolvingOther, setIsResolvingOther] = useState(false);
  const [voteOpen, setVoteOpen] = useState(false);

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
          const finalOption = unchosen[Math.floor(Math.random() * unchosen.length)];
          setOtherCyclingId(null);
          setOtherSelectedId(finalOption.id);
          setIsResolvingOther(false);
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

  return (
    <div className="mx-auto flex h-full w-full max-w-[1560px] flex-col items-center justify-center gap-4">
      {/* prompt banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="grid w-full grid-cols-[minmax(0,1fr)_340px] items-stretch gap-8 border-2 border-[#F4F0E8]/20 bg-panel/60 px-9 py-5 text-left"
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
            No correct answer
          </div>
          <p className="mt-3 font-mono text-xs leading-relaxed text-text-secondary">
            {stage.subtext}
          </p>
          <p className="mt-3 font-mono text-[10px] tracking-[0.14em] text-text-secondary/60 uppercase">
            Press V // Room vote
          </p>
        </div>
      </motion.div>

      {/* YOU · cards · OTHER YOU */}
      <div className="flex w-full items-stretch justify-center gap-7">
        <div className="flex flex-1 items-center justify-center">
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

        <div className="grid shrink-0 grid-cols-2 gap-4" style={{ width: 760 }}>
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

        <div className="flex flex-1 items-center justify-center">
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

      {/* continue */}
      <div className="flex h-14 items-center">
        <AnimatePresence>
          {resolved && (
            <motion.button
              type="button"
              className="border-2 border-accent bg-accent px-6 py-3 font-heading text-sm font-bold tracking-[0.18em] text-bg uppercase"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
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
