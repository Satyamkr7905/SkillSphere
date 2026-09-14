import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Pipeline } from "../components/Pipeline";
import { Reveal } from "../components/Section";

const layers = [
  {
    title: "Data Sources",
    items: ["Employee Profiles", "Projects", "Skills", "Performance", "Certifications", "Business Goals"],
  },
  {
    title: "Data Processing",
    items: ["Cleaning", "Normalization", "Skill Extraction"],
  },
  {
    title: "Skill Engine",
    items: ["Skill Graph", "Skill Relationships", "Employee Mapping"],
  },
  {
    title: "AI Engine",
    items: ["Gap Analysis", "Future Prediction", "Recommendation", "Explainability"],
  },
  {
    title: "Decision Layer",
    items: ["Upskill", "Re-skill", "Hire", "Redeploy", "Prioritize"],
  },
  {
    title: "HR Dashboard",
    items: ["Skill Heatmaps", "Gap Analysis", "Predictions", "Recommendations"],
  },
];

const stack = [
  ["Frontend", "React + Tailwind CSS"],
  ["Backend API", "Python + FastAPI"],
  [
    "AI/ML Engine",
    "Python AI/ML (Scikit-learn, pandas, NetworkX, Sentence Transformer, LLM API / open-weight LLM)",
  ],
  ["Data Stores", "PostgreSQL + Neo4j (Skill Graph Database)"],
  ["Visualization", "Recharts or D3.js"],
  ["DevOps & Deployment", "Docker + Cloud"],
];

export function Architecture() {
  return (
    <div className="bg-paper text-ink">
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <p className="label">System</p>
        <h1 className="mt-3 max-w-3xl text-[32px] font-medium leading-tight tracking-tight md:text-[40px]">
          Six layers from source data to an HR decision.
        </h1>
        <p className="mt-5 max-w-2xl text-[17px] leading-[1.65] text-ink-2">
          SkillSphere AI sits as an intelligence layer between existing HR systems and the people who must act.
        </p>

        <div className="mt-12">
          <Pipeline
            stages={[
              "Data Sources",
              "Data Processing",
              "Skill Engine",
              "AI Engine",
              "Decision Layer",
              "HR Dashboard",
            ]}
          />
        </div>

        <ol className="mt-16 grid gap-8 md:grid-cols-2">
          {layers.map((layer, i) => (
            <Reveal key={layer.title} delay={i * 0.08}>
              <li className="border border-rule bg-surface p-6">
                <p className="label">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="mt-3 text-[20px] font-medium tracking-tight">{layer.title}</h2>
                <ul className="mt-4 space-y-2 text-[15px] leading-[1.6] text-ink-2">
                  {layer.items.map((item) => (
                    <li key={item}>— {item}</li>
                  ))}
                </ul>
              </li>
            </Reveal>
          ))}
        </ol>

        <section className="mt-20">
          <p className="label">Tech stack</p>
          <div className="mt-6 overflow-x-auto border border-rule">
            <table className="w-full min-w-[520px] text-left text-[15px]">
              <thead className="border-b border-rule bg-paper-alt">
                <tr>
                  <th className="px-4 py-3 font-medium">Layer</th>
                  <th className="px-4 py-3 font-medium">Choice</th>
                </tr>
              </thead>
              <tbody>
                {stack.map(([a, b]) => (
                  <tr key={a} className="border-b border-rule last:border-0">
                    <td className="px-4 py-3">{a}</td>
                    <td className="px-4 py-3 text-ink-2">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="mt-12">
          <Link to="/dashboard" className="border border-ink px-5 py-2.5 text-[12px] uppercase tracking-label hover:border-sage hover:text-sage">
            View dashboard
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
