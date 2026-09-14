export type GraphNode = {
  id: string;
  label: string;
  type: string;
  group: string;
};

export type GraphEdge = {
  source: string;
  target: string;
  relation: string;
};

export type GapItem = {
  skill: string;
  current: number;
  required: number;
  gap: number;
  severity: string;
};

export type Recommendation = {
  employee_id: string;
  name: string;
  current_role: string;
  target_role: string;
  action: string;
  department: string;
  readiness: string;
  similarity: number;
  missing_skills: string[];
};

export type Explain = {
  employee_id: string;
  name: string;
  action: string;
  target_role: string;
  reasons: string[];
  missing_skills: string[];
  similarity: number;
  readiness: string;
  narrative: string;
};

export type Snapshot = {
  employees: number;
  technical_profiles: number;
  adjacent_skills: number;
  internal_candidates: number;
  critical_gaps: number;
  upskill: number;
  reskill: number;
  hire: number;
};

const API = "/api";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(path);
  return res.json() as Promise<T>;
}

export const api = {
  employees: (q = "") => getJson(`${"/employees"}${q}`),
  skills: () => getJson("/skills"),
  roles: () => getJson("/roles"),
  projects: () => getJson("/projects"),
  graph: () => getJson<{ graph: { nodes: GraphNode[]; edges: GraphEdge[] }; central: string[] }>("/graph"),
  gaps: () =>
    getJson<{
      scenario: string;
      items: GapItem[];
      conclusion: string;
      snapshot: Snapshot;
      example_capability: Record<string, number>;
    }>("/gap-analysis"),
  predict: () =>
    getJson<{
      scenario: string;
      series: { skill: string; demand: number; horizon_months: number }[];
      timeline: Record<string, string | number>[];
    }>("/predict"),
  recommendations: (q = "") => getJson<Recommendation[]>(`/recommendations${q}`),
  explain: (id: string) => getJson<Explain>(`/explain/${id}`),
};
