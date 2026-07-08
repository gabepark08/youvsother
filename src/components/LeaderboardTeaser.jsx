import { motion } from "framer-motion";

const ROWS = [
  ["01", "???", "IPO'D TOO EARLY", "--.--"],
  ["02", "???", "BECAME A PODCAST", "--.--"],
  ["03", "???", "HIRED OTHER YOU", "--.--"],
  ["04", "???", "RAISED A REGRET ROUND", "--.--"],
  ["05", "???", "PIVOTED INTO DUST", "--.--"],
];

const revealGroup = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
    },
  },
};

const revealItem = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function LeaderboardTeaser() {
  return (
    <section className="relative z-20 flex min-h-screen items-center border-t border-[#F4F0E8]/10 px-8 py-20 md:px-16">
      <motion.div
        className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr]"
        variants={revealGroup}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.22 }}
      >
        <motion.div variants={revealGroup}>
          <motion.p
            variants={revealItem}
            className="font-mono text-xs font-bold tracking-[0.3em] text-accent uppercase"
          >
            Locked Until First Run
          </motion.p>

          <motion.h2
            variants={revealItem}
            className="mt-5 font-heading text-5xl font-bold leading-none uppercase text-text-primary md:text-7xl"
          >
            Global
            <br />
            <span className="text-you">Forkboard</span>
          </motion.h2>

          <motion.p
            variants={revealItem}
            className="mt-7 max-w-md text-base leading-relaxed text-text-secondary md:text-lg"
          >
            Every founder timeline gets ranked. Some by revenue. Some by
            damage. Some by how funny the collapse was.
          </motion.p>

          <motion.div
            variants={revealItem}
            className="mt-8 inline-flex border-2 border-other px-4 py-3 font-mono text-xs font-black tracking-[0.24em] text-other uppercase"
          >
            Forkboard Offline
          </motion.div>
        </motion.div>

        <motion.div
          variants={revealItem}
          className="border-2 border-[#F4F0E8]/20 bg-panel/50"
        >
          <motion.div
            variants={revealItem}
            className="grid grid-cols-[0.55fr_1fr_2fr_0.9fr] border-b border-[#F4F0E8]/15 px-5 py-4 font-mono text-[11px] tracking-[0.22em] text-text-secondary uppercase"
          >
            <span>Rank</span>
            <span>Founder</span>
            <span>Outcome</span>
            <span className="text-right">Score</span>
          </motion.div>

          <div className="divide-y divide-[#F4F0E8]/10">
            {ROWS.map(([rank, founder, outcome, score], index) => (
              <motion.div
                key={outcome}
                className="grid grid-cols-[0.55fr_1fr_2fr_0.9fr] px-5 py-5 font-mono text-sm tracking-wide uppercase"
                variants={{
                  hidden: { opacity: 0, x: 18 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.45, delay: index * 0.08, ease: "easeOut" },
                  },
                }}
              >
                <span className="text-accent">{rank}</span>
                <span className="text-text-secondary">{founder}</span>
                <span className={index % 2 === 0 ? "text-you" : "text-other"}>
                  {outcome}
                </span>
                <span className="text-right text-text-secondary">{score}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={revealItem}
            className="flex items-center justify-center border-t border-[#F4F0E8]/15 px-5 py-4 text-center font-mono text-[11px] font-bold tracking-[0.22em] text-text-primary uppercase"
          >
            Complete a run to submit your timeline.
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
