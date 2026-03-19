import { useState } from "react";
import { X, Target } from "../../lib/icons.js";

export default function GaugeChart({ value = 75.55, change = "+10%", target = 20000, revenue = 20000, today = 20000 }) {
  const [showModal, setShowModal] = useState(false);
  const [config, setConfig] = useState({
    type: "monthly",        // monthly | range | day
    target: target,
    from: "",
    to: "",
    day: "",
  });
  const [saved, setSaved] = useState({ ...config, target });

  const setC = (k, v) => setConfig(c => ({ ...c, [k]: v }));

  const handleSave = () => {
    setSaved({ ...config });
    setShowModal(false);
  };

  // SVG gauge
  const R = 80, cx = 110, cy = 105;
  const startAngle = Math.PI;
  const endAngle = 0;
  const angle = startAngle - (value / 100) * Math.PI;
  const trackStart = { x: cx + R * Math.cos(startAngle), y: cy + R * Math.sin(startAngle) };
  const trackEnd   = { x: cx + R * Math.cos(endAngle),   y: cy + R * Math.sin(endAngle) };
  const fillEnd    = { x: cx + R * Math.cos(angle),       y: cy + R * Math.sin(angle) };
  const largeArc   = value > 50 ? 1 : 0;
  const fmt = (n) => n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`;

  const periodLabel = {
    monthly: "Meta mensual",
    range:   saved.from && saved.to ? `${saved.from} → ${saved.to}` : "Rango personalizado",
    day:     saved.day || "Día específico",
  }[saved.type];

  return (
    <>
      <div className="card p-5 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">Monthly Target</p>
            <p className="text-xs text-gray-400">{periodLabel} · Meta: {fmt(saved.target)}</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            title="Configurar objetivo"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <circle cx="8" cy="3" r="1.2"/><circle cx="8" cy="8" r="1.2"/><circle cx="8" cy="13" r="1.2"/>
            </svg>
          </button>
        </div>

        {/* SVG Gauge */}
        <div className="flex justify-center my-2">
          <svg width="220" height="130" viewBox="0 0 220 130">
            <path d={`M ${trackStart.x} ${trackStart.y} A ${R} ${R} 0 1 1 ${trackEnd.x} ${trackEnd.y}`}
              fill="none" stroke="#e5e7eb" strokeWidth="12" strokeLinecap="round" className="dark:opacity-20" />
            <path d={`M ${trackStart.x} ${trackStart.y} A ${R} ${R} 0 ${largeArc} 1 ${fillEnd.x} ${fillEnd.y}`}
              fill="none" stroke="#4f46e5" strokeWidth="12" strokeLinecap="round" />
            <text x={cx} y={cy - 6} textAnchor="middle" fontSize="26" fontWeight="700" className="fill-gray-900 dark:fill-white">
              {value}%
            </text>
            <text x={cx} y={cy + 16} textAnchor="middle" fontSize="12" fill="#10b981" fontWeight="600">{change}</text>
          </svg>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 px-2 mb-4">
          You earn <strong className="text-gray-700 dark:text-gray-200">${today.toLocaleString()}</strong> today, it's higher than last month. Keep up your good work!
        </p>

        <div className="mt-auto grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
          {[
            { label: "Target",  value: fmt(saved.target), up: false },
            { label: "Revenue", value: fmt(revenue),      up: true  },
            { label: "Today",   value: fmt(today),        up: true  },
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 dark:border-gray-800">
            
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-primary-600 dark:text-primary-400" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Configurar objetivo</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={16} />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Tipo de período */}
              <div>
                <label className="label">Tipo de período</label>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {[
                    { key: "monthly", label: "Mensual" },
                    { key: "range",   label: "Rango" },
                    { key: "day",     label: "Día" },
                  ].map(t => (
                    <button
                      key={t.key}
                      onClick={() => setC("type", t.key)}
                      className={`py-2 rounded-lg text-xs font-medium border transition-colors ${
                        config.type === t.key
                          ? "bg-primary-600 border-primary-600 text-white"
                          : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fecha según tipo */}
              {config.type === "monthly" && (
                <div>
                  <label className="label">Mes objetivo</label>
                  <input
                    type="month"
                    className="input"
                    defaultValue={new Date().toISOString().slice(0, 7)}
                    onChange={e => setC("month", e.target.value)}
                  />
                </div>
              )}

              {config.type === "range" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Desde</label>
                    <input type="date" className="input" value={config.from} onChange={e => setC("from", e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Hasta</label>
                    <input type="date" className="input" value={config.to} onChange={e => setC("to", e.target.value)} />
                  </div>
                </div>
              )}

              {config.type === "day" && (
                <div>
                  <label className="label">Día específico</label>
                  <input type="date" className="input" value={config.day} onChange={e => setC("day", e.target.value)} />
                </div>
              )}

              {/* Meta de ventas */}
              <div>
                <label className="label">Meta de ventas ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    value={config.target}
                    onChange={e => setC("target", Number(e.target.value))}
                    className="input pl-7"
                    min={0}
                    step={1000}
                    placeholder="20000"
                  />
                </div>
                {/* Sugerencias rápidas */}
                <div className="flex gap-2 mt-2">
                  {[5000, 10000, 20000, 50000].map(v => (
                    <button
                      key={v}
                      onClick={() => setC("target", v)}
                      className={`text-[11px] px-2 py-1 rounded-md border transition-colors ${
                        config.target === v
                          ? "bg-primary-600 border-primary-600 text-white"
                          : "border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      ${v >= 1000 ? `${v/1000}K` : v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn-primary" onClick={handleSave}>Guardar objetivo</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}