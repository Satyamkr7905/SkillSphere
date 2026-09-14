import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Footer } from "../components/Footer";
import { GapTag } from "../components/GapTag";
import { Header } from "../components/Header";
import { HeroGraph } from "../components/HeroGraph";
import { CountUp, SkillBar } from "../components/MotionBits";
import { Pipeline } from "../components/Pipeline";
import { Reveal, Section } from "../components/Section";
import { exampleCapability, mockGaps, snapshot } from "../lib/mock";

const hrTable = [
  ["Employee databases", "Store records but perform no reasoning."],
  ["Skill inventories", "Static lists that age as soon as they are captured."],
  ["Performance dashboards", "Historical view; little signal on future capability."],
  ["Recruitment platforms", "Optimised for external hiring, not internal potential."],
  ["Training platforms", "Course recommendations without business context."],
  ["HR chatbots", "Answer questions, but do not model workforce intelligence."],
];

const features = [
  {
    n: "01",
    t: "Dynamic Workforce Skill Graph",
    d: "Maps employees, skills, projects, roles, and certifications as an interconnected network.",
  },
  {
    n: "02",
    t: "Future Skill Predictor",
    d: "Transforms business goals into the skills your organisation will need next.",
  },
  {
    n: "03",
    t: "Intelligent Skill-Gap Analysis",
    d: "Compares current and future capabilities and classifies gaps as Critical, Moderate, or Emerging.",
  },
  {
    n: "04",
    t: "AI Workforce Action Engine",
    d: "Recommends the best action: Upskill, Re-skill, Redeploy, or Hire.",
  },
  {
    n: "05",
    t: "Explainable Recommendations",
    d: "Every suggestion is transparent, traceable, and easy to trust.",
  },
  {
    n: "06",
    t: "Explainability in Action",
    d: "See why Employee #104 is recommended for upskilling into Edge AI Engineer.",
  },
];

const stakeholders = [
  ["HR Teams", "Clear visibility of skills, gaps, and workforce readiness."],
  ["Employees", "Personalised growth paths and future-ready skills."],
  ["Managers", "Smarter team planning and targeted development."],
  ["Organizations", "Higher agility, productivity, and reduced time-to-skill."],
  ["Leadership", "Data-driven talent decisions aligned to business goals."],
];

const layers = [
  ["Data Sources", "Employee Profiles, Projects, Skills, Performance, Certifications, Business Goals"],
  ["Data Processing", "Cleaning, Normalization, Skill Extraction"],
  ["Skill Engine", "Skill Graph, Skill Relationships, Employee Mapping"],
  ["AI Engine", "Gap Analysis, Future Prediction, Recommendation, Explainability"],
  ["Decision Layer", "Upskill, Re-skill, Hire, Redeploy, Prioritize"],
  ["HR Dashboard", "Skill Heatmaps, Gap Analysis, Predictions, Recommendations"],
];

export function Landing() {
  return (
    <div className="bg-paper text-ink">
      <Header />
      <main>
        <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-12 md:px-8 md:py-24">
          <div className="md:col-span-7">
            <p className="label">Workforce digital twin</p>
            <h1 className="mt-5 max-w-xl text-[34px] font-medium leading-[1.15] tracking-tight md:text-[44px]">
              Know your workforce today. Predict the skills you need tomorrow.
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-[1.65] text-ink-2">
              AI-powered workforce digital twin for future skill readiness.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#solution"
                className="inline-flex items-center gap-2 bg-sage px-5 py-2.5 text-[12px] uppercase tracking-label text-paper-alt"
              >
                Explore the Platform
              </a>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 border border-ink px-5 py-2.5 text-[12px] uppercase tracking-label text-ink hover:border-sage hover:text-sage"
              >
                View Dashboard
              </Link>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="border border-rule bg-surface p-4">
              <p className="label mb-3">Skill graph</p>
              <HeroGraph />
            </div>
          </div>
        </section>

        <Section
          id="problem"
          eyebrow="The problem"
          title="Companies know their people — but not their future capability."
        >
          <Reveal>
            <p className="max-w-2xl text-[17px] leading-[1.65] text-ink-2">
              Workforce information lives in different systems and formats, creating blind spots and limiting
              forward-looking decisions.
            </p>
          </Reveal>
          <div className="mt-10">
            <p className="label mb-4">Current pipeline</p>
            <Pipeline stages={["Employee Data", "HR Database", "Reports / Dashboards", "Human Interpretation", "Decision"]} />
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div>
              <p className="label mb-3">Open questions</p>
              <ul className="space-y-3 text-[16px] leading-[1.6] text-ink">
                <li>— What skills do we have?</li>
                <li>— What skills will we need next, and can our existing employees develop them?</li>
              </ul>
            </div>
            <div className="border border-rule bg-surface p-5">
              <p className="label">Key gap</p>
              <p className="mt-3 text-[16px] leading-[1.6] text-ink">
                There is a missing intelligence layer connecting current employee capabilities to future business
                requirements.
              </p>
            </div>
          </div>
          <div className="mt-12 overflow-x-auto border border-rule">
            <table className="w-full min-w-[560px] text-left text-[15px]">
              <thead className="border-b border-rule bg-paper-alt">
                <tr>
                  <th className="px-4 py-3 font-medium">Current HR approach</th>
                  <th className="px-4 py-3 font-medium">Limitation</th>
                </tr>
              </thead>
              <tbody>
                {hrTable.map(([a, b]) => (
                  <tr key={a} className="border-b border-rule last:border-0">
                    <td className="px-4 py-3 text-ink">{a}</td>
                    <td className="px-4 py-3 text-ink-2">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section
          id="solution"
          eyebrow="The solution"
          title="AI workforce intelligence with dynamic Skill Graph and predictive analytics."
        >
          <Pipeline
            stages={[
              "Current Workforce",
              "AI Skill Graph",
              "Future Business Plan",
              "Required Future Skills",
              "AI Gap Analysis",
              "AI Recommendation",
              "Upskill / Re-skill / Hire",
            ]}
          />
          <dl className="mt-12 grid gap-8 md:grid-cols-2">
            {[
              ["Current Workforce", "Employee profiles, skills, projects, experience, performance, certifications."],
              ["AI Skill Graph", "Employee ↔ skills, skills ↔ projects, skills ↔ roles — a living map of capability."],
              ["Future Business Plan", "Example: Edge-AI product launch within 12 months."],
              [
                "Required Future Skills",
                "Embedded AI, ML, FPGA, Computer Vision, Embedded C — derived from the plan, not from last year’s org chart.",
              ],
              ["AI Gap Analysis", "Compare required skills against current capabilities, with severity tags."],
              ["AI Recommendation", "Identify the best path to close gaps: upskill, re-skill, redeploy, or hire."],
            ].map(([dt, dd]) => (
              <Reveal key={dt}>
                <dt className="label">{dt}</dt>
                <dd className="mt-2 text-[16px] leading-[1.6] text-ink-2">{dd}</dd>
              </Reveal>
            ))}
          </dl>
        </Section>

        <Section id="scenario" eyebrow="Example scenario" title="Edge-AI Product Launch Within 12 Months">
          <p className="max-w-2xl text-[17px] leading-[1.65] text-ink-2">
            Can we close this gap using our existing workforce?
          </p>
          <div className="mt-10 space-y-4">
            {exampleCapability.map((s) => (
              <SkillBar key={s.skill} label={s.skill} value={s.value} />
            ))}
          </div>
          <div className="mt-10 border border-rule bg-surface p-6">
            <p className="label">AI conclusion</p>
            <p className="mt-3 max-w-2xl text-[16px] leading-[1.65] text-ink">
              Sufficient foundational talent internally; prioritise upskilling existing employees; recruit 2 specialists
              for advanced FPGA / Edge-AI expertise.
            </p>
          </div>
        </Section>

        <Section id="architecture" eyebrow="System architecture" title="Six layers from data to decision.">
          <div className="grid gap-px bg-rule md:grid-cols-3">
            {layers.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.08} className="bg-paper p-6">
                <p className="label">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-[18px] font-medium tracking-tight">{t}</h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-ink-2">{d}</p>
              </Reveal>
            ))}
          </div>
          <p className="mt-8">
            <Link to="/architecture" className="inline-flex items-center gap-2 text-[13px] uppercase tracking-label text-sage">
              Full architecture &amp; stack <ArrowRight size={14} />
            </Link>
          </p>
        </Section>

        <Section id="features" eyebrow="Core features" title="Intelligence you can trace, not just a score.">
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((f, i) => (
              <Reveal key={f.n} delay={i * 0.08}>
                <article className="h-full border border-rule bg-surface p-6 transition-colors duration-300 hover:border-sage hover:-translate-y-0.5">
                  <p className="label">{f.n}</p>
                  <h3 className="mt-3 text-[18px] font-medium tracking-tight">{f.t}</h3>
                  <p className="mt-2 text-[15px] leading-[1.6] text-ink-2">{f.d}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 border border-rule bg-surface p-6 md:p-8">
            <p className="label">Employee #104</p>
            <h3 className="mt-3 text-[22px] font-medium tracking-tight">Recommend: UPSKILL</h3>
            <p className="mt-1 text-[15px] text-ink-2">Target role: Edge AI Engineer</p>
            <p className="mt-6 label">Why this recommendation</p>
            <ul className="mt-3 space-y-2 text-[16px] leading-[1.6] text-ink">
              <li>— Strong in Python</li>
              <li>— Completed 2 machine learning projects</li>
              <li>— Hands-on embedded systems experience</li>
              <li>— 68% skill similarity with target role</li>
              <li>— Missing Edge ML and deployment skills</li>
            </ul>
            <p className="mt-6 text-[15px] text-ink-2">
              Estimated transition readiness: <span className="text-sage">High</span>
            </p>
          </div>
        </Section>

        <Section
          id="impact"
          eyebrow="Impact & feasibility"
          title="Proven value today. Built to scale tomorrow. Relevant across industries."
        >
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {stakeholders.map(([t, d]) => (
              <div key={t} className="border-t border-rule pt-4">
                <h3 className="text-[16px] font-medium">{t}</h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-ink-2">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-5">
            {[
              [snapshot.employees, "Employees"],
              [snapshot.technical_profiles, "Technical profiles"],
              [snapshot.adjacent_skills, "Adjacent skills"],
              [snapshot.internal_candidates, "Internal candidates"],
              [snapshot.critical_gaps, "Critical skill gaps"],
            ].map(([n, l]) => (
              <div key={String(l)} className="border border-rule bg-surface p-4">
                <p className="text-[28px] font-medium tracking-tight">
                  <CountUp value={n as number} />
                </p>
                <p className="mt-1 label">{l as string}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              [snapshot.upskill, "Upskill"],
              [snapshot.reskill, "Reskill"],
              [snapshot.hire, "Hire"],
            ].map(([n, l]) => (
              <div key={String(l)} className="flex items-baseline justify-between border border-rule px-4 py-3">
                <span className="label">{l as string}</span>
                <span className="text-[22px] font-medium">
                  <CountUp value={n as number} />
                </span>
              </div>
            ))}
          </div>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            <div>
              <p className="label">Feasibility</p>
              <p className="mt-3 text-[15px] leading-[1.65] text-ink-2">
                Software-first solution. No special hardware. Low-cost MVP using an open-source stack: Python libraries,
                PostgreSQL, Neo4j Community Edition, React, FastAPI, and open-source ML models.
              </p>
            </div>
            <div>
              <p className="label">Scalability</p>
              <p className="mt-3 text-[15px] leading-[1.65] text-ink-2">
                From 100 to 10,000+ employees via cloud and modular design.
              </p>
            </div>
            <div>
              <p className="label">Industry relevance</p>
              <p className="mt-3 text-[15px] leading-[1.65] text-ink-2">
                Applicable across IT, manufacturing, semiconductor, healthcare, government, and large enterprises.
                Example: semiconductor workforce planning for a new VLSI/AI division — RTL Design, Verification, FPGA,
                VLSI, Embedded AI, Computer Architecture. Decision flow: Upskill → Redeploy → Hire.
              </p>
            </div>
          </div>
        </Section>

        <Section id="preview" eyebrow="Dashboard" title="Heatmaps, gaps, predictions, and recommendations — in one view.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-rule bg-surface p-5">
              <p className="label mb-4">Skill heatmap</p>
              <div className="grid grid-cols-6 gap-1">
                {mockGaps.flatMap((g, i) =>
                  [0.2, 0.4, 0.55, 0.7, g.current / 100].map((v, j) => (
                    <span
                      key={`${i}-${j}`}
                      className="h-8"
                      style={{ background: v > 0.6 ? "#2F5D50" : v > 0.35 ? "#B7791F" : "#A33A2B", opacity: 0.35 + v * 0.65 }}
                    />
                  )),
                )}
              </div>
            </div>
            <div className="border border-rule bg-surface p-5">
              <p className="label mb-4">Gap analysis</p>
              <ul className="space-y-3">
                {mockGaps.slice(0, 4).map((g) => (
                  <li key={g.skill} className="flex items-center justify-between gap-3 text-[14px]">
                    <span>{g.skill}</span>
                    <GapTag severity={g.severity} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-rule bg-surface p-5">
              <p className="label mb-3">Predictions</p>
              <p className="text-[16px] leading-[1.6] text-ink-2">
                Edge AI and FPGA demand rise sharply across a 12-month launch horizon.
              </p>
            </div>
            <div className="border border-rule bg-surface p-5">
              <p className="label mb-3">Recommendations</p>
              <p className="text-[16px] leading-[1.6] text-ink-2">48 Upskill · 16 Reskill · 10 Hire</p>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="mt-8 inline-flex items-center gap-2 bg-sage px-5 py-2.5 text-[12px] uppercase tracking-label text-paper-alt"
          >
            Open live dashboard
          </Link>
        </Section>

        <section className="border-t border-rule py-16">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="border-y border-rule py-12">
              <p className="label">Built by</p>
              <h2 className="mt-3 text-[28px] font-medium tracking-tight">Team Gryffindor</h2>
              <p className="mt-2 text-[13px] uppercase tracking-label text-ink-3">Team ID: 161D9A799A0E</p>
              <ul className="mt-8 grid gap-2 text-[16px] text-ink md:grid-cols-2">
                <li>Satyam Kumar</li>
                <li>Sukhdeep Singh</li>
                <li>Dhruv Oberoi</li>
                <li>Ushakirana S</li>
              </ul>
              <p className="mt-8 max-w-xl text-[15px] leading-[1.65] text-ink-2">
                Sapthagiri NPS University School of Engineering &amp; Technology
                <br />
                B.E. Electronics &amp; Communication Engineering
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
