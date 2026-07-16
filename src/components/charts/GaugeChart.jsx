import { useState } from "react";
import { X, Target } from "../../lib/icons.js";
import { api } from "../../lib/api.js";
import { notify } from "../../lib/notifications.js";

const fmtCOP = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

export default function GaugeChart({ target = 20000, revenue = 0, today = 0, monthlySales = [], onTargetChange }) {
  const [showModal, setShowModal] = useState(false);
  const [focused, setFocused] = useState(false);
  const [config, setConfig] = useState({
    type: "monthly",
    target,
    from: "",
    to: "",
    day: "",
  });

  const setC = (k, v) => setConfig(c => ({ ...c, [k]: v }));

  const handleSave = async () => {
    try {
      await api.settings.update({ monthlyTarget: config.target });
      onTargetChange?.(config.target);
      setShowModal(false);
      notify.success("Meta guardada correctamente");
    } catch {
      notify.error("Error al guardar la meta");
    }
  };

  const value = target > 0 ? Math.min(100, Math.round((revenue / target) * 100)) : 0;

  const prevMonthRevenue = monthlySales.length >= 2
    ? Number(monthlySales[monthlySales.length - 2].revenue)
    : 0;
  const changePct = prevMonthRevenue > 0
    ? ((revenue - prevMonthRevenue) / prevMonthRevenue * 100).toFixed(1)
    : null;
  const changeLabel = changePct !== null
    ? `${changePct.startsWith("-") ? "" : "+"}${changePct}%`
    : "";

  const size = 200, cx = size / 2, cy = size / 2, r = 78, stroke = 14;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);

  const periodLabel = {
    monthly: "Meta mensual",
    range: config.from && config.to ? `${config.from} → ${config.to}` : "Rango personalizado",
    day: config.day || "Día específico",
  }[config.type];

  return (
    <>
      <div className="card p-5 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">Meta Mensual</p>
            <p className="text-xs text-gray-400">{periodLabel} · Meta: {fmtCOP(target)}</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            title="Configurar objetivo"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <circle cx="8" cy="3" r="1.2" /><circle cx="8" cy="8" r="1.2" /><circle cx="8" cy="13" r="1.2" />
            </svg>
          </button>
        </div>

        <div className="flex justify-center my-2 relative">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} className="dark:opacity-20" />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#4f46e5" strokeWidth={stroke} strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={offset} className="transition-all duration-500" />
          </svg>
          <div className="absolute flex flex-col items-center justify-center pointer-events-none" style={{ width: size, height: size }}>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}%</span>
            {changeLabel && (
              <span className={`text-xs font-semibold ${Number(changePct) >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                {changeLabel}
              </span>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 px-2 mb-4">
          Hoy ganaste <strong className="text-gray-700 dark:text-gray-200">{fmtCOP(today)}</strong>, {changePct !== null && changePct > 0 ? "superior" : "inferior"} al mes pasado. ¡Sigue así!
        </p>

        <div className="mt-auto grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
          {[
            { label: "Meta", value: fmtCOP(target), up: revenue >= target },
            { label: "Ingresos", value: fmtCOP(revenue), up: true },
            { label: "Hoy", value: fmtCOP(today), up: true },
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 dark:border-gray-800">

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
              <div>
                <label className="label">Tipo de período</label>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {[
                    { key: "monthly", label: "Mensual" },
                    { key: "range", label: "Rango" },
                    { key: "day", label: "Día" },
                  ].map(t => (
                    <button
                      key={t.key}
                      onClick={() => setC("type", t.key)}
                      className={`py-2 rounded-lg text-xs font-medium border transition-colors ${config.type === t.key
                          ? "bg-primary-600 border-primary-600 text-white"
                          : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

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

              <div>
                <label className="label">Meta de ventas</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type={focused ? "number" : "text"}
                    value={focused ? config.target : fmtCOP(config.target)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={e => setC("target", Number(e.target.value.replace(/[^0-9]/g, "")) || 0)}
                    className="input pl-7"
                    min={0}
                    step={1000}
                    placeholder="$ 20.000"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {[5000000, 10000000, 20000000, 50000000].map(v => (
                    <button
                      key={v}
                      onClick={() => setC("target", v)}
                      className={`text-[11px] px-2 py-1 rounded-md border transition-colors ${config.target === v
                          ? "bg-primary-600 border-primary-600 text-white"
                          : "border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                    >
                      {(v / 1000000).toFixed(0)}M
                    </button>
                  ))}
                </div>
              </div>
            </div>

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
