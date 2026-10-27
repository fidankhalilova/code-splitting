// Single module-scope lazy chart, shared so Nav's preload and the Reports page use the same import.
import { lazyWithPreload } from "@/lib/lazy";

export const LazyRevenueChart = lazyWithPreload(
  () => import("@/components/RevenueChart"),
);
