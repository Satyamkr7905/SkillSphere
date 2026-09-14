import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ease } from "../lib/motion";

export function CountUp({ value, duration = 0.8 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(value);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(value * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value, duration, reduce]);

  return <span ref={ref}>{n.toLocaleString()}</span>;
}

export function SkillBar({ label, value }: { label: string; value: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();

  return (
    <div ref={ref} className="grid grid-cols-[140px_1fr_48px] items-center gap-3 md:grid-cols-[180px_1fr_48px]">
      <span className="text-[14px] text-ink">{label}</span>
      <div className="h-[6px] bg-rule">
        <motion.div
          className="h-full bg-sage"
          initial={{ width: 0 }}
          animate={{ width: inView || reduce ? `${value}%` : 0 }}
          transition={{ duration: reduce ? 0 : 0.5, ease }}
        />
      </div>
      <span className="text-right text-[13px] text-ink-2">{value}%</span>
    </div>
  );
}
