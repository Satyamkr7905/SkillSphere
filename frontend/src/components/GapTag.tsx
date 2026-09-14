export function GapTag({ severity }: { severity: string }) {
  const tone =
    severity === "Critical"
      ? "text-critical border-critical"
      : severity === "Moderate"
        ? "text-moderate border-moderate"
        : "text-sage border-sage";
  return (
    <span className={`inline-block border px-2 py-0.5 text-[11px] uppercase tracking-label ${tone}`}>
      {severity}
    </span>
  );
}
