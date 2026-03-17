import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const DATA = {
  Monthly: [
    { label: "Jan", sales: 180, revenue: 40 },
    { label: "Feb", sales: 195, revenue: 60 },
    { label: "Mar", sales: 165, revenue: 50 },
    { label: "Apr", sales: 180, revenue: 75 },
    { label: "May", sales: 175, revenue: 50 },
    { label: "Jun", sales: 170, revenue: 45 },
    { label: "Jul", sales: 185, revenue: 90 },
    { label: "Aug", sales: 200, revenue: 110 },
    { label: "Sep", sales: 220, revenue: 130 },
    { label: "Oct", sales: 215, revenue: 140 },
    { label: "Nov", sales: 235, revenue: 145 },
    { label: "Dec", sales: 240, revenue: 150 },
  ],
  Quarterly: [
    { label: "Q1", sales: 540, revenue: 150 },
    { label: "Q2", sales: 525, revenue: 170 },
    { label: "Q3", sales: 605, revenue: 330 },
    { label: "Q4", sales: 690, revenue: 435 },
  ],
  Annually: [
    { label: "2022", sales: 1800, revenue: 600 },
    { label: "2023", sales: 2100, revenue: 900 },
    { label: "2024", sales: 2360, revenue: 1085 },
    { label: "2025", sales: 2500, revenue: 1200 },
    { label: "2026", sales: 700,  revenue: 400 },
  ],
};

const PERIODS = ["Monthly", "Quarterly", "Annually"];

export default function StatisticsChart() {
  const [period, setPeriod] = useState("Monthly");

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-1 flex-wrap gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Statistics</h2>
          <p className="text-xs text-gray-400">Target you've set for each month</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Period tabs */}
          <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            {PERIODS.map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  period === p
                    ? "bg-primary-600 text-white"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          {/* Date range pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Mar 8 to Mar 15
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={DATA[period]} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02}/>
            </linearGradient>
            <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0.02}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" vertical={false}/>
          <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false}/>
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false}/>
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          />
          <Area type="monotone" dataKey="sales" name="Total Sales" stroke="#4f46e5" strokeWidth={2} fill="url(#salesGrad)"/>
          <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#818cf8" strokeWidth={2} fill="url(#revGrad2)" strokeDasharray="4 2"/>
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
