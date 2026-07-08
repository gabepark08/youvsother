import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StatusBar from "./components/StatusBar";
import Timeline from "./components/Timeline";
import StartButton from "./components/StartButton";
import GlitchBackground from "./components/GlitchBackground";
import OriginSequence from "./components/OriginSequence";
import LeaderboardTeaser from "./components/LeaderboardTeaser";

function App() {
  const [isStartHovered, setIsStartHovered] = useState(false);
  const [clickPulse, setClickPulse] = useState(0);
  const [view, setView] = useState("landing");

  const handleStart = useCallback(() => {
    console.log("Start clicked");
    setClickPulse((c) => c + 1);
    if (view === "landing") {
      setTimeout(() => setView("origin"), 550);
    }
  }, [view]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Enter") handleStart();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleStart]);

  const isLanding = view === "landing";

  return (
    <div className="scrollbar-hide relative h-screen w-screen overflow-x-hidden overflow-y-auto bg-bg text-text-primary font-mono">
      <GlitchBackground />

      {/* thin border frame around the whole visible page */}
      <div className="pointer-events-none fixed inset-3 z-30 border border-[#F4F0E8]/15 md:inset-4" />

      <div className="relative z-20 flex min-h-screen flex-col">
        {isLanding && <StatusBar />}

        <main className={`flex min-h-0 flex-1 ${isLanding ? "items-start px-8 pt-8 md:px-16 lg:items-center lg:pt-0" : "items-center px-6 py-5 md:px-10"}`}>
          <AnimatePresence mode="wait">
            {isLanding ? (
              <motion.div
                key="landing"
                className="grid w-full grid-cols-1 items-center gap-12 lg:mt-8 lg:grid-cols-[1.15fr_0.85fr]"
                exit={{ opacity: 0, transition: { duration: 0.35 } }}
              >
                {/* hero text - centred-left */}
                <motion.div
                  className="max-w-2xl"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <h1 className="font-heading text-6xl font-bold leading-[0.95] tracking-tight uppercase sm:text-7xl xl:text-8xl">
                    <span className="text-you">YOU</span>{" "}
                    <span className="text-[0.5em] font-medium text-white/90">
                      vs.
                    </span>
                    <br />
                    <span className="text-other">THE OTHER YOU</span>
                  </h1>

                  <p className="mt-8 max-w-lg text-base text-text-secondary md:text-lg">
                    A founder-life simulator where every choice creates a version
                    of you that keeps going without permission.
                  </p>

                  <p className="mt-4 max-w-lg font-mono text-[13px] tracking-wide text-text-secondary md:text-sm">
                    4 choices. Multiple wildcards. 2 futures.{" "}
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

                {/* timeline visual */}
                <div className="hidden w-full justify-self-end lg:flex">
                  <Timeline isStartHovered={isStartHovered} clickPulse={clickPulse} />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="origin"
                className="flex h-full w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <OriginSequence />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {isLanding && (
          <motion.div
            className="absolute right-8 bottom-12 hidden items-center gap-2 font-mono text-[10px] font-bold tracking-[0.22em] text-text-secondary uppercase md:right-16 lg:flex"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 2, ease: "easeOut" }}
          >
            <motion.span
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            >
              v
            </motion.span>
            Scroll // Forkboard Offline
          </motion.div>
        )}

        {isLanding && (
          <footer className="flex h-8 shrink-0 items-center justify-center border-t border-[#F4F0E8]/10 px-6 text-center text-[10px] leading-none tracking-wide text-text-secondary md:px-10">
            <span className="whitespace-nowrap">
              Built for people who think one life path is suspiciously low sample
              size.
            </span>
          </footer>
        )}
      </div>

      {isLanding && <LeaderboardTeaser />}
    </div>
  );
}

export default App;
