import { SEQUENCE } from "../data/stages";

const YELLOW = "#F5FF3D";

const TOTAL_FORKS = SEQUENCE.filter((s) => s.type === "choice").length;
const TOTAL_WILDCARDS = SEQUENCE.filter((s) => s.type === "wildcard").length;

// Human-readable position in the run, e.g. "Fork 2 / 5" or "Wildcard 1 / 2",
// plus the age. Helps an audience see this is a full game, not one screen.
function labelFor(stepIndex) {
  const step = SEQUENCE[stepIndex];
  if (!step) return null;
  const ordinalOfType = SEQUENCE.slice(0, stepIndex + 1).filter((s) => s.type === step.type).length;
  if (step.type === "choice") return { kind: `Fork ${ordinalOfType} / ${TOTAL_FORKS}`, age: step.age };
  if (step.type === "wildcard") return { kind: `Wildcard ${ordinalOfType} / ${TOTAL_WILDCARDS}`, age: step.age };
  return { kind: "The Reveal", age: step.age };
}

// A slim dashboard rail: node per stage with the current one highlighted,
// plus a "Fork n / 5 · Age X" caption.
export default function StageProgress({ stepIndex }) {
  const info = labelFor(stepIndex);
  if (!info) return null;

  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-col items-center gap-2">
      <div className="flex items-center gap-3 font-mono text-[11px] font-bold tracking-[0.2em] uppercase">
        <span style={{ color: YELLOW }}>{info.kind}</span>
        <span className="text-text-secondary/40">//</span>
        <span className="text-text-secondary">Age {info.age}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {SEQUENCE.map((s, i) => {
          const done = i < stepIndex;
          const current = i === stepIndex;
          const isWild = s.type === "wildcard";
          return (
            <span
              key={s.id}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: current ? 28 : 14,
                background: current
                  ? YELLOW
                  : done
                    ? "rgba(244,240,232,0.55)"
                    : "rgba(244,240,232,0.18)",
                boxShadow: current ? `0 0 10px ${YELLOW}` : "none",
                // wildcards get a subtly taller node so the rhythm reads
                height: isWild ? 5 : 6,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
