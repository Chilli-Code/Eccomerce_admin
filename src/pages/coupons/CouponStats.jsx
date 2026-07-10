import { Check, BarChart, Clock, Infinity, Ticket } from "lucide-react";

export default function CouponStats({ stats }) {
  const items = [
    { label: "Active coupons", value: stats.active, icon: Check, color: "text-green-500" },
    { label: "Total used", value: stats.used, icon: BarChart, color: "text-blue-500" },
    { label: "Expired", value: stats.expired, icon: Clock, color: "text-red-500" },
    { label: "Unlimited", value: stats.unlimited, icon: Infinity, color: "text-purple-500" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {items.map(s => (
        <div key={s.label} className="card px-5 py-4">
          <div className="flex items-center gap-2 mb-1">
            <s.icon size={16} className={s.color} />
            <p className="text-xs text-gray-400">{s.label}</p>
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{s.value}</p>
        </div>
      ))}
    </div>
  );
}