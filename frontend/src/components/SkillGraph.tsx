import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GraphEdge, GraphNode } from "../lib/api";

const TYPE_FILL: Record<string, string> = {
  employee: "#141414",
  skill: "#2F5D50",
  role: "#5F5A54",
  project: "#B7791F",
};

type SimNode = GraphNode & d3.SimulationNodeDatum;
type SimLink = { source: string | SimNode; target: string | SimNode; relation: string };

export function SkillGraph({ nodes, edges }: { nodes: GraphNode[]; edges: GraphEdge[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [size, setSize] = useState({ w: 800, h: 460 });

  const connected = useMemo(() => {
    const map = new Map<string, Set<string>>();
    nodes.forEach((n) => map.set(n.id, new Set([n.id])));
    edges.forEach((e) => {
      map.get(e.source)?.add(e.target);
      map.get(e.target)?.add(e.source);
    });
    return map;
  }, [nodes, edges]);

  useEffect(() => {
    if (!wrap.current) return;
    const ro = new ResizeObserver(() => {
      if (!wrap.current) return;
      setSize({ w: wrap.current.clientWidth, h: Math.max(380, wrap.current.clientWidth * 0.48) });
    });
    ro.observe(wrap.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);
    svg.selectAll("*").remove();
    const { w, h } = size;
    const simNodes: SimNode[] = nodes.map((n) => ({ ...n }));
    const simLinks: SimLink[] = edges.map((e) => ({ ...e }));

    const sim = d3
      .forceSimulation(simNodes)
      .force("link", d3.forceLink<SimNode, SimLink>(simLinks).id((d) => d.id).distance(72))
      .force("charge", d3.forceManyBody().strength(-140))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force("collide", d3.forceCollide(18));

    const g = svg.append("g");
    const link = g
      .append("g")
      .selectAll("line")
      .data(simLinks)
      .enter()
      .append("line")
      .attr("stroke", "#E3DED6")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "140")
      .attr("stroke-dashoffset", "140");

    link.transition().duration(500).attr("stroke-dashoffset", "0");

    const node = g
      .append("g")
      .selectAll("circle")
      .data(simNodes)
      .enter()
      .append("circle")
      .attr("r", (d) => (d.type === "skill" ? 7 : d.type === "employee" ? 6 : 5.5))
      .attr("fill", (d) => TYPE_FILL[d.type] ?? "#141414")
      .attr("opacity", 0)
      .attr("tabindex", 0)
      .attr("role", "img")
      .attr("aria-label", (d) => `${d.type}: ${d.label}`)
      .style("cursor", "pointer")
      .on("mouseenter", (_, d) => setHover(d.id))
      .on("mouseleave", () => setHover(null))
      .on("focus", (_, d) => setHover(d.id))
      .on("blur", () => setHover(null));

    node
      .transition()
      .duration(400)
      .delay((_, i) => i * 18)
      .attr("opacity", 1);

    const drag = d3
      .drag<SVGCircleElement, SimNode>()
      .on("start", (event, d) => {
        if (!event.active) sim.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) sim.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(drag);

    const label = g
      .append("g")
      .selectAll("text")
      .data(simNodes)
      .enter()
      .append("text")
      .text((d) => d.label)
      .attr("font-size", 10)
      .attr("fill", "#8A8A8A")
      .attr("dx", 10)
      .attr("dy", 3);

    sim.on("tick", () => {
      g.selectAll<SVGLineElement, SimLink>("line")
        .attr("x1", (d) => (d.source as SimNode).x ?? 0)
        .attr("y1", (d) => (d.source as SimNode).y ?? 0)
        .attr("x2", (d) => (d.target as SimNode).x ?? 0)
        .attr("y2", (d) => (d.target as SimNode).y ?? 0);
      node.attr("cx", (d) => d.x ?? 0).attr("cy", (d) => d.y ?? 0);
      label.attr("x", (d) => d.x ?? 0).attr("y", (d) => d.y ?? 0);
    });

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    return () => {
      sim.stop();
    };
  }, [nodes, edges, size]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);
    const active = hover ? connected.get(hover) : null;
    svg.selectAll("circle").attr("opacity", (d) => {
      const n = d as SimNode;
      if (!active) return 1;
      return active.has(n.id) ? 1 : 0.18;
    });
    svg.selectAll("line").attr("stroke", (d) => {
      const l = d as SimLink;
      if (!hover) return "#E3DED6";
      const s = typeof l.source === "string" ? l.source : l.source.id;
      const t = typeof l.target === "string" ? l.target : l.target.id;
      return s === hover || t === hover ? "#2F5D50" : "#E3DED6";
    });
    svg.selectAll("text").attr("opacity", (d) => {
      const n = d as SimNode;
      if (!active) return 1;
      return active.has(n.id) ? 1 : 0.2;
    });
  }, [hover, connected]);

  return (
    <div ref={wrap} className="w-full border border-rule bg-surface">
      <div className="flex flex-wrap gap-4 border-b border-rule px-4 py-3 text-[11px] uppercase tracking-label text-ink-3">
        <span>
          <i className="mr-2 inline-block h-2 w-2 rounded-full bg-ink" />
          Employee
        </span>
        <span>
          <i className="mr-2 inline-block h-2 w-2 rounded-full bg-sage" />
          Skill
        </span>
        <span>
          <i className="mr-2 inline-block h-2 w-2 rounded-full bg-ink-2" />
          Role
        </span>
        <span>
          <i className="mr-2 inline-block h-2 w-2 rounded-full bg-moderate" />
          Project
        </span>
      </div>
      <svg ref={svgRef} width={size.w} height={size.h} className="block" />
    </div>
  );
}
