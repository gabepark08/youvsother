import { useEffect, useRef, useState } from "react";

export function formatMoney(value) {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  return `${sign}$${Math.abs(rounded).toLocaleString("en-US")}`;
}

// Animated number that eases from its previous value to the new one whenever
// `value` changes — used for the net-worth / ticker updates.
export default function MoneyValue({ value, duration = 750 }) {
  const [display, setDisplay] = useState(value);
  const displayRef = useRef(value);

  useEffect(() => {
    const start = displayRef.current;
    const difference = value - start;
    if (difference === 0) {
      displayRef.current = value;
      setDisplay(value);
      return;
    }

    let rafId;
    const startedAt = performance.now();

    function tick(now) {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const nextValue = start + difference * eased;
      displayRef.current = nextValue;
      setDisplay(nextValue);
      if (progress < 1) rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [value, duration]);

  return <>{formatMoney(display)}</>;
}
