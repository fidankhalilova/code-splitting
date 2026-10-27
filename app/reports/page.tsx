// Reports route
"use client";

import LazyBoundary from "@/components/LazyBoundary";
import ChartSkeleton from "@/components/ChartSkeleton";
import { LazyRevenueChart } from "@/lib/chart";

export default function Reports() {
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Reports</h1>
      <LazyBoundary fallback={<ChartSkeleton />}>
        <LazyRevenueChart />
      </LazyBoundary>
    </>
  );
}
