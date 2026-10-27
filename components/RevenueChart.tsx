// Heavy widget: recharts line chart of monthly revenue (client component).
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { revenue } from "@/lib/data";

export default function RevenueChart() {
  return (
    <div className="h-64 rounded-lg border bg-white p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={revenue}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line dataKey="total" stroke="#2563eb" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
