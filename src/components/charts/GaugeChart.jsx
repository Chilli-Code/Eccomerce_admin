export default function GaugeChart({ value = 75.55, change = "+10%", target = 20000, revenue = 20000, today = 20000 }) {
  // semicircle gauge: 0% = left, 100% = right
  const R = 80;
  const cx = 110;
  const cy = 105;
  const startAngle = Math.PI; // 180°
  const endAngle = 0;        // 0°
  const angle = startAngle - (value / 100) * Math.PI;

  const trackStart = { x: cx + R * Math.cos(startAngle), y: cy + R * Math.sin(startAngle) };
  const trackEnd   = { x: cx + R * Math.cos(endAngle),   y: cy + R * Math.sin(endAngle) };
  const fillEnd    = { x: cx + R * Math.cos(angle),       y: cy + R * Math.sin(angle) };

  const largeArc = value > 50 ? 1 : 0;

  const fmt = (n) => n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`;

  return (
    <div className="card p-5 flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-white">Monthly Target</p>
          <p className="text-xs text-gray-400">Target you've set for each month</p>
        </div>
        <button className="text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <circle cx="8" cy="3" r="1.2"/><circle cx="8" cy="8" r="1.2"/><circle cx="8" cy="13" r="1.2"/>
          </svg>
        </button>
      </div>

      {/* SVG Gauge */}
      <div className="flex justify-center my-2">
        <svg width="220" height="130" viewBox="0 0 220 130">
          {/* Track */}
          <path
            d={`M ${trackStart.x} ${trackStart.y} A ${R} ${R} 0 1 1 ${trackEnd.x} ${trackEnd.y}`}
            fill="none" stroke="#e5e7eb" strokeWidth="12" strokeLinecap="round"
            className="dark:opacity-20"
          />
          {/* Fill */}
          <path
            d={`M ${trackStart.x} ${trackStart.y} A ${R} ${R} 0 ${largeArc} 1 ${fillEnd.x} ${fillEnd.y}`}
            fill="none" stroke="#4f46e5" strokeWidth="12" strokeLinecap="round"
          />
          {/* Center text */}
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize="26" fontWeight="700" fill="currentColor" className="fill-gray-900 dark:fill-white">
            {value}%
          </text>
          <text x={cx} y={cy + 16} textAnchor="middle" fontSize="12" fill="#10b981" fontWeight="600">{change}</text>
        </svg>
      </div>

      <p className="text-center text-xs text-gray-500 dark:text-gray-400 px-2 mb-4">
        You earn <strong className="text-gray-700 dark:text-gray-200">${(today).toLocaleString()}</strong> today, it's higher than last month. Keep up your good work!
      </p>

      {/* Bottom stats */}
      <div className="mt-auto grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
        {[
          { label: "Target",  value: fmt(target),  up: false },
          { label: "Revenue", value: fmt(revenue), up: true },
          { label: "Today",   value: fmt(today),   up: true },
        ].map(s => (
          <div key={s.label} className="text-center">
            <p className="text-[11px] text-gray-400 mb-0.5">{s.label}</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center justify-center gap-1">
              {s.value}
              <span className={s.up ? "text-emerald-500" : "text-red-400"} style={{ fontSize: 10 }}>
                {s.up ? "↑" : "↓"}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
