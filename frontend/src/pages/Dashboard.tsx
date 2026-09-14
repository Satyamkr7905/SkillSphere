import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Footer } from "../components/Footer";
import { GapTag } from "../components/GapTag";
import { Header } from "../components/Header";
import { CountUp } from "../components/MotionBits";
import { SkillGraph } from "../components/SkillGraph";
import {
  api,
  type Explain,
  type GapItem,
  type GraphEdge,
  type GraphNode,
  type Recommendation,
  type Snapshot,
} from "../lib/api";
import { demandTimeline, mockGaps, mockGraph, mockRecs, snapshot as mockSnap } from "../lib/mock";

export function Dashboard() {
  const [snap, setSnap] = useState<Snapshot>(mockSnap);
  const [gaps, setGaps] = useState<GapItem[]>(mockGaps);
  const [nodes, setNodes] = useState<GraphNode[]>(mockGraph.nodes);
  const [edges, setEdges] = useState<GraphEdge[]>(mockGraph.edges);
  const [recs, setRecs] = useState<Recommendation[]>(mockRecs);
  const [timeline, setTimeline] = useState(demandTimeline);
  const [explain, setExplain] = useState<Explain | null>(null);
  const [role, setRole] = useState("");
  const [skill, setSkill] = useState("");
  const [dept, setDept] = useState("");
  const [selected, setSelected] = useState("104");

  useEffect(() => {
    api
      .gaps()
      .then((d) => {
        setSnap(d.snapshot);
        setGaps(d.items);
      })
      .catch(() => undefined);
    api
      .graph()
      .then((d) => {
        setNodes(d.graph.nodes);
        setEdges(d.graph.edges);
      })
      .catch(() => undefined);
    api
      .recommendations()
      .then(setRecs)
      .catch(() => undefined);
    api
      .predict()
      .then((d) => {
        if (d.timeline?.length) setTimeline(d.timeline as typeof demandTimeline);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    api
      .explain(selected)
      .then(setExplain)
      .catch(() => {
        const rec = recs.find((r) => r.employee_id === selected);
        if (!rec) return;
        setExplain({
          employee_id: rec.employee_id,
          name: rec.name,
          action: rec.action,
          target_role: rec.target_role,
          reasons: [
            `Current role: ${rec.current_role}`,
            `${Math.round(rec.similarity * 100)}% similarity with ${rec.target_role}`,
            rec.missing_skills.length ? `Missing ${rec.missing_skills.join(", ")}` : "Core skills in range",
          ],
          missing_skills: rec.missing_skills,
          similarity: rec.similarity,
          readiness: rec.readiness,
          narrative: `Recommend ${rec.action.toUpperCase()} for Employee #${rec.employee_id}. Estimated transition readiness: ${rec.readiness}.`,
        });
      });
  }, [selected, recs]);

  const filtered = useMemo(() => {
    return recs.filter((r) => {
      if (role && !r.current_role.toLowerCase().includes(role.toLowerCase()) && !r.target_role.toLowerCase().includes(role.toLowerCase()))
        return false;
      if (dept && !r.department.toLowerCase().includes(dept.toLowerCase())) return false;
      if (skill && !r.missing_skills.join(" ").toLowerCase().includes(skill.toLowerCase())) return false;
      return true;
    });
  }, [recs, role, dept, skill]);

  const cards: [number, string][] = [
    [snap.employees, "Employees"],
    [snap.technical_profiles, "Technical profiles"],
    [snap.adjacent_skills, "Adjacent skills"],
    [snap.internal_candidates, "Internal candidates"],
    [snap.critical_gaps, "Critical gaps"],
  ];

  return (
    <div className="bg-paper text-ink">
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <p className="label">Workforce intelligence</p>
        <h1 className="mt-3 text-[32px] font-medium tracking-tight md:text-[38px]">Dashboard</h1>
        <p className="mt-3 max-w-2xl text-[16px] leading-[1.65] text-ink-2">
          Illustrative view of a 1,000-person organisation preparing an Edge-AI product launch.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map(([n, l]) => (
            <div key={l} className="border border-rule bg-surface p-4">
              <p className="text-[26px] font-medium tracking-tight">
                <CountUp value={n} />
              </p>
              <p className="mt-1 label">{l}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {[
            [snap.upskill, "Upskill"],
            [snap.reskill, "Reskill"],
            [snap.hire, "Hire"],
          ].map(([n, l]) => (
            <div key={String(l)} className="flex items-baseline justify-between border border-rule bg-surface px-4 py-3">
              <span className="label">{l as string}</span>
              <span className="text-[20px] font-medium">
                <CountUp value={n as number} />
              </span>
            </div>
          ))}
        </div>

        <section className="mt-14">
          <p className="label mb-4">Skill graph</p>
          <SkillGraph nodes={nodes} edges={edges} />
        </section>

        <section className="mt-14">
          <p className="label mb-4">Skill heatmap</p>
          <div className="overflow-x-auto border border-rule bg-surface">
            <table className="w-full min-w-[600px] text-[13px]">
              <thead className="border-b border-rule">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Department</th>
                  {gaps.map((g) => (
                    <th key={g.skill} className="px-3 py-2 text-center font-medium">
                      {g.skill}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {["Engineering", "AI", "Hardware", "Semiconductor", "Strategy"].map((dept) => (
                  <tr key={dept} className="border-b border-rule last:border-0">
                    <td className="px-3 py-2 text-ink">{dept}</td>
                    {gaps.map((g) => {
                      const base = g.current / 100;
                      const jitter = dept === "AI" ? 0.12 : dept === "Engineering" ? 0.05 : dept === "Hardware" ? -0.04 : dept === "Semiconductor" ? -0.08 : -0.15;
                      const val = Math.max(0, Math.min(1, base + jitter));
                      const bg = val > 0.6 ? "#2F5D50" : val > 0.35 ? "#B7791F" : "#A33A2B";
                      return (
                        <td key={g.skill} className="px-1 py-1 text-center">
                          <div
                            className="mx-auto h-8 w-full min-w-[48px]"
                            style={{ background: bg, opacity: 0.3 + val * 0.7 }}
                            title={`${dept}: ${g.skill} — ${Math.round(val * 100)}%`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-14 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="label mb-4">Gap analysis</p>
            <div className="overflow-x-auto border border-rule bg-surface">
              <table className="w-full min-w-[480px] text-left text-[14px]">
                <thead className="border-b border-rule bg-paper-alt">
                  <tr>
                    <th className="px-3 py-2 font-medium">Skill</th>
                    <th className="px-3 py-2 font-medium">Current</th>
                    <th className="px-3 py-2 font-medium">Required</th>
                    <th className="px-3 py-2 font-medium">Gap</th>
                    <th className="px-3 py-2 font-medium">Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {gaps.map((g) => (
                    <tr key={g.skill} className="border-b border-rule last:border-0">
                      <td className="px-3 py-2">{g.skill}</td>
                      <td className="px-3 py-2 text-ink-2">{g.current}%</td>
                      <td className="px-3 py-2 text-ink-2">{g.required}%</td>
                      <td className="px-3 py-2 text-ink-2">{g.gap}%</td>
                      <td className="px-3 py-2">
                        <GapTag severity={g.severity} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="lg:col-span-5">
            <p className="label mb-4">Future skill demand (12 months)</p>
            <div className="h-72 border border-rule bg-surface p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeline}>
                  <CartesianGrid stroke="#E3DED6" strokeDasharray="0" />
                  <XAxis dataKey="month" stroke="#8A8A8A" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#8A8A8A" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: "#FFFFFF",
                      border: "1px solid #E3DED6",
                      borderRadius: 0,
                      fontSize: 13,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="Edge AI" stroke="#2F5D50" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="FPGA" stroke="#141414" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="ML" stroke="#B7791F" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="CV" stroke="#5F5A54" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <p className="label mb-4">Search &amp; filter</p>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="block">
              <span className="label">Role</span>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-2 w-full border border-rule bg-surface px-3 py-2 text-[15px] outline-none focus:border-sage"
                placeholder="e.g. Firmware"
              />
            </label>
            <label className="block">
              <span className="label">Skill</span>
              <input
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="mt-2 w-full border border-rule bg-surface px-3 py-2 text-[15px] outline-none focus:border-sage"
                placeholder="e.g. FPGA"
              />
            </label>
            <label className="block">
              <span className="label">Department</span>
              <input
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="mt-2 w-full border border-rule bg-surface px-3 py-2 text-[15px] outline-none focus:border-sage"
                placeholder="e.g. Engineering"
              />
            </label>
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="label mb-4">AI recommendations</p>
            <ul className="divide-y divide-rule border border-rule bg-surface">
              {filtered.map((r) => (
                <li key={r.employee_id}>
                  <button
                    type="button"
                    onClick={() => setSelected(r.employee_id)}
                    className={`flex w-full items-start justify-between gap-4 px-4 py-4 text-left transition-colors duration-200 hover:border-sage ${
                      selected === r.employee_id ? "bg-paper-alt" : ""
                    }`}
                  >
                    <div>
                      <p className="text-[15px] font-medium">
                        {r.name} <span className="font-normal text-ink-3">#{r.employee_id}</span>
                      </p>
                      <p className="mt-1 text-[13px] text-ink-2">
                        {r.current_role} → {r.target_role}
                      </p>
                    </div>
                    <span className="border border-sage px-2 py-0.5 text-[11px] uppercase tracking-label text-sage">
                      {r.action}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <aside className="lg:col-span-5">
            <p className="label mb-4">Explainability</p>
            <div className="border border-rule bg-surface p-5">
              {explain ? (
                <>
                  <p className="text-[13px] uppercase tracking-label text-ink-3">Employee #{explain.employee_id}</p>
                  <h2 className="mt-2 text-[22px] font-medium tracking-tight">
                    Recommend: {explain.action.toUpperCase()}
                  </h2>
                  <p className="mt-1 text-[15px] text-ink-2">Target role: {explain.target_role}</p>
                  <p className="mt-5 label">Why this recommendation</p>
                  <ul className="mt-3 space-y-2 text-[15px] leading-[1.6]">
                    {explain.reasons.map((r) => (
                      <li key={r}>— {r}</li>
                    ))}
                  </ul>
                  <p className="mt-6 text-[15px] text-ink-2">
                    Estimated transition readiness: <span className="text-sage">{explain.readiness}</span>
                  </p>
                  <p className="mt-4 border-t border-rule pt-4 text-[15px] leading-[1.65] text-ink-2">
                    {explain.narrative}
                  </p>
                </>
              ) : (
                <p className="text-[15px] text-ink-2">Select a recommendation to inspect the rationale.</p>
              )}
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
