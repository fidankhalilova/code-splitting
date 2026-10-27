// Placeholder with the chart's exact box (h-64 + border) so swapping it in causes no layout shift.
export default function ChartSkeleton() {
  return (
    <div
      className="h-64 animate-pulse rounded-lg border bg-slate-200"
      aria-busy="true"
    />
  );
}
