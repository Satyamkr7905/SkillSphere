import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { ease } from "../lib/motion";

export function Pipeline({
  stages,
  direction = "horizontal",
}: {
  stages: string[];
  direction?: "horizontal" | "vertical";
}) {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const show = inView || reduce;

  if (direction === "vertical") {
    return (
      <ol ref={ref} className="space-y-0">
        {stages.map((s, i) => (
          <li key={s} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="mt-1 h-2 w-2 bg-sage" />
              {i < stages.length - 1 && (
                <motion.span
                  className="w-px flex-1 bg-rule"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: show ? 1 : 0 }}
                  style={{ originY: 0, minHeight: 28 }}
                  transition={{ duration: 0.4, delay: 0.08 * i, ease }}
                />
              )}
            </div>
            <p className="pb-6 text-[15px] text-ink">{s}</p>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol ref={ref} className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-0">
      {stages.map((s, i) => (
        <li key={s} className="flex items-center md:flex-1">
          <motion.div
            className="border border-rule bg-surface px-3 py-2 text-[13px] text-ink md:min-w-[8.5rem]"
            initial={{ opacity: 0, y: 12 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.08 * i, ease }}
          >
            {s}
          </motion.div>
          {i < stages.length - 1 && (
            <motion.span
              className="mx-1 hidden h-px flex-1 bg-rule md:block"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: show ? 1 : 0 }}
              style={{ originX: 0 }}
              transition={{ duration: 0.4, delay: 0.08 * i + 0.12, ease }}
            />
          )}
        </li>
      ))}
    </ol>
  );
}
