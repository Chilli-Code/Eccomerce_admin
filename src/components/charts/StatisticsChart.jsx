import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "../../lib/charts.js";

const FALLBACK = [
  { label: "Jan", sales: 0, revenue: 0 },
  { label: "Feb", sales: 0, revenue: 0 },
  { label: "Mar", sales: 0, revenue: 0 },
  { label: "Apr", sales: 0, revenue: 0 },
  { label: "May", sales: 0, revenue: 0 },
  { label: "Jun", sales: 0, revenue: 0 },
  { label: "Jul", sales: 0, revenue: 0 },
  { label: "Aug", sales: 0, revenue: 0 },
  { label: "Sep", sales: 0, revenue: 0 },
  { label: "Oct", sales: 0, revenue: 0 },
  { label: "Nov", sales: 0, revenue: 0 },
  { label: "Dec", sales: 0, revenue: 0 },
];

export default function StatisticsChart({ monthlySales }) {
  const data = (monthlySales || []).map(m => ({
    label: m.month,
    sales: Number(m.orders),
    revenue: Number(m.revenue),
  }));

  const chartData = data.length > 0 ? data : FALLBACK;

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-1 flex-wrap gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Statistics</h2>
          <p className="text-xs text-gray-400">Monthly sales & orders</p>
        </div>
      </div>

        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
