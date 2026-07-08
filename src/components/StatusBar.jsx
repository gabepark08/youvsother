import { motion } from "framer-motion";

export default function StatusBar() {
  return (
    <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-[#F4F0E8]/10 px-6 pt-6 pb-3 text-[11px] tracking-[0.2em] uppercase md:px-10">
      <span className="justify-self-start text-text-secondary">
        Simulation: Founder Life / Ages 16&ndash;30
      </span>

      <span className="flex items-center gap-2 justify-self-center font-semibold text-text-primary">
        <motion.span
          className="block h-2 w-2 rounded-full bg-accent"
          style={{ boxShadow: "0 0 8px 2px #F5FF3D" }}
          animate={{ opacity: [1, 0.15, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
        Parallel Selves: 1,247
      </span>

      <span className="justify-self-end font-bold text-other">No Undo Button</span>
    </div>
  );
}
