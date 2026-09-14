import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { ease } from "../lib/motion";

type Node = { id: string; x: number; y: number; r: number };

const NODES: Node[] = [
  { id: "a", x: 80, y: 90, r: 5 },
  { id: "b", x: 160, y: 50, r: 4 },
  { id: "c", x: 210, y: 130, r: 6 },
  { id: "d", x: 300, y: 70, r: 5 },
  { id: "e", x: 280, y: 170, r: 4 },
  { id: "f", x: 380, y: 110, r: 7 },
  { id: "g", x: 430, y: 40, r: 4 },
  { id: "h", x: 470, y: 160, r: 5 },
  { id: "i", x: 120, y: 180, r: 3 },
  { id: "j", x: 360, y: 190, r: 3 },
];

const EDGES: [string, string][] = [
  ["a", "b"],
  ["a", "c"],
  ["b", "d"],
  ["c", "d"],
  ["c", "e"],
  ["d", "f"],
  ["e", "f"],
  ["f", "g"],
  ["f", "h"],
  ["a", "i"],
  ["e", "j"],
  ["c", "i"],
];

export function HeroGraph() {
  const reduce = useReducedMotion();
  const lookup = useMemo(() => Object.fromEntries(NODES.map((n) => [n.id, n])), []);

  return (
    <svg viewBox="0 0 520 230" className="h-auto w-full" role="img" aria-label="Abstract skill graph">
      {EDGES.map(([a, b], i) => {
        const n1 = lookup[a];
        const n2 = lookup[b];
        return (
          <motion.line
            key={`${a}-${b}`}
            x1={n1.x}
            y1={n1.y}
            x2={n2.x}
            y2={n2.y}
            stroke="#E3DED6"
            strokeWidth="1"
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.08 * i, ease }}
          />
        );
      })}
      {NODES.map((n, i) => (
        <motion.circle
          key={n.id}
          cx={n.x}
          cy={n.y}
          r={n.r}
          fill={i % 3 === 0 ? "#2F5D50" : "#141414"}
          initial={reduce ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.05 * i, ease }}
        />
      ))}
      {!reduce && (
        <motion.circle
          cx={NODES[5].x}
          cy={NODES[5].y}
          r={12}
          fill="none"
          stroke="#2F5D50"
          strokeWidth="0.6"
          animate={{ opacity: [0.15, 0.45, 0.15] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </svg>
  );
}
