// Top navigation that preloads the Reports chart on hover, focus, touch, or after a short idle delay.
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { LazyRevenueChart } from "@/lib/chart";

const preload = () => void LazyRevenueChart.preload().catch(() => {});

export default function Nav() {
  useEffect(() => {
    const id = setTimeout(preload, 3000);
    return () => clearTimeout(id);
  }, []);

  return (
    <nav className="flex gap-4 border-b bg-white px-6 py-3 text-sm font-medium">
      <Link href="/">Home</Link>
      <Link href="/reports" onMouseEnter={preload} onFocus={preload} onTouchStart={preload}>
        Reports
      </Link>
    </nav>
  );
}