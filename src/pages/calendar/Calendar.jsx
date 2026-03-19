import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { allCoupons } from "../../data/mock.js";
import clsx from "clsx";

const DAYS   = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

const EVENT_COLORS = {
  coupon:   { bg: "bg-amber-100 dark:bg-amber-900/30",   text: "text-amber-700 dark:text-amber-300",   dot: "bg-amber-500"   },
  sales:    { bg: "bg-primary-100 dark:bg-primary-900/30", text: "text-primary-700 dark:text-primary-300", dot: "bg-primary-500" },
  shipping: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
  reminder: { bg: "bg-purple-100 dark:bg-purple-900/30",  text: "text-purple-700 dark:text-purple-300",  dot: "bg-purple-500"  },
};

const INITIAL_EVENTS = [
  { id: 1, title: "SUMMER20 expira",       date: "2026-03-20", type: "coupon",   desc: "Cupón de 20% vence hoy" },
  { id: 2, title: "Pico de ventas",         date: "2026-03-17", type: "sales",    desc: "32 órdenes registradas" },
  { id: 3, title: "12 entregas esperadas",  date: "2026-03-18", type: "shipping", desc: "Envíos Servientrega" },
  { id: 4, title: "WELCOME10 expira",       date: "2026-03-31", type: "coupon",   desc: "Cupón de 10% vence hoy" },
  { id: 5, title: "Restock productos",      date: "2026-03-25", type: "reminder", desc: "Revisar inventario bajo" },
  { id: 6, title: "8 entregas esperadas",   date: "2026-03-22", type: "shipping", desc: "Envíos Coordinadora" },
  { id: 7, title: "Lanzamiento colección",  date: "2026-04-01", type: "reminder", desc: "Nueva temporada" },
  { id: 8, title: "Black Friday prep",      date: "2026-04-15", type: "reminder", desc: "Planear descuentos" },
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
}

export default function Calendar() {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents]       = useState(INITIAL_EVENTS);
  const [selected, setSelected]   = useState(null); // fecha seleccionada
  const [modal, setModal]         = useState(false);
  const [form, setForm]           = useState({ title: "", date: "", type: "reminder", desc: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const daysInMonth  = getDaysInMonth(year, month);
  const firstDay     = getFirstDayOfMonth(year, month);
  const totalCells   = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const eventsFor = (dateStr) => events.filter(e => e.date === dateStr);

  const addEvent = () => {
    if (!form.title.trim() || !form.date) return;
    setEvents(ev => [...ev, { ...form, id: Date.now() }]);
    setForm({ title: "", date: "", type: "reminder", desc: "" });
    setModal(false);
  };

  const removeEvent = (id) => setEvents(ev => ev.filter(e => e.id !== id));

  // próximos eventos ordenados
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
  const upcoming = [...events]
    .filter(e => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);

  const selectedEvents = selected ? eventsFor(selected) : [];

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Calendario</h1>
          <p className="text-sm text-gray-400 mt-0.5">Eventos, cupones y recordatorios</p>
        </div>
        <button className="btn-primary" onClick={() => setModal(true)}>
          <Plus size={16} /> Nuevo evento
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">

        {/* Calendario principal */}
        <div className="xl:col-span-3 card p-5">
          {/* Navegación */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white">
              {MONTHS[month]} {year}
            </h2>
            <div className="flex items-center gap-1">
              <button onClick={prevMonth} className="btn-ghost p-2 rounded-lg">
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()); }}
                className="btn-secondary text-xs px-3 py-1.5"
              >
                Hoy
              </button>
              <button onClick={nextMonth} className="btn-ghost p-2 rounded-lg">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Header días */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
            ))}
          </div>

          {/* Grid de días */}
          <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
            {Array.from({ length: totalCells }).map((_, i) => {
              const dayNum = i - firstDay + 1;
              const valid  = dayNum >= 1 && dayNum <= daysInMonth;
              const dateStr = valid ? toDateStr(year, month, dayNum) : null;
              const dayEvents = dateStr ? eventsFor(dateStr) : [];
              const isToday   = dateStr === toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
              const isSelected = dateStr === selected;

              return (
                <div
                  key={i}
                  onClick={() => valid && setSelected(isSelected ? null : dateStr)}
                  className={clsx(
                    "bg-white dark:bg-gray-900 min-h-[90px] p-1.5 transition-colors",
                    valid ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60" : "opacity-30",
                    isSelected && "ring-2 ring-inset ring-primary-400"
                  )}
                >
                  {valid && (
                    <>
                      <div className={clsx(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mb-1 mx-auto",
                        isToday
                          ? "bg-primary-600 text-white"
                          : "text-gray-700 dark:text-gray-300"
                      )}>
                        {dayNum}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 2).map(ev => {
                          const cfg = EVENT_COLORS[ev.type];
                          return (
                            <div key={ev.id} className={clsx("text-[10px] px-1.5 py-0.5 rounded truncate font-medium", cfg.bg, cfg.text)}>
                              {ev.title}
                            </div>
                          );
                        })}
                        {dayEvents.length > 2 && (
                          <div className="text-[10px] text-gray-400 px-1">+{dayEvents.length - 2} más</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Leyenda */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            {Object.entries(EVENT_COLORS).map(([type, cfg]) => (
              <div key={type} className="flex items-center gap-1.5">
                <span className={clsx("w-2.5 h-2.5 rounded-full", cfg.dot)} />
                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {{ coupon: "Cupones", sales: "Ventas", shipping: "Envíos", reminder: "Recordatorios" }[type]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">

          {/* Eventos del día seleccionado */}
          {selected && (
            <div className="card p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                {new Date(selected + "T12:00:00").toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}
              </p>
              {selectedEvents.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-xs text-gray-400">Sin eventos</p>
                  <button
                    onClick={() => { setForm(f => ({ ...f, date: selected })); setModal(true); }}
                    className="btn-secondary text-xs mt-2 py-1.5"
                  >
                    <Plus size={12} /> Agregar
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedEvents.map(ev => {
                    const cfg = EVENT_COLORS[ev.type];
                    return (
                      <div key={ev.id} className={clsx("flex items-start gap-2 p-2.5 rounded-lg", cfg.bg)}>
                        <span className={clsx("w-2 h-2 rounded-full mt-1 flex-shrink-0", cfg.dot)} />
                        <div className="flex-1 min-w-0">
                          <p className={clsx("text-xs font-semibold truncate", cfg.text)}>{ev.title}</p>
                          {ev.desc && <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{ev.desc}</p>}
                        </div>
                        <button onClick={() => removeEvent(ev.id)} className="text-gray-300 hover:text-red-400 flex-shrink-0">
                          <X size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Próximos eventos */}
          <div className="card p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Próximos eventos</p>
            <div className="space-y-2">
              {upcoming.map(ev => {
                const cfg  = EVENT_COLORS[ev.type];
                const date = new Date(ev.date + "T12:00:00");
                return (
                  <div
                    key={ev.id}
                    onClick={() => setSelected(ev.date)}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  >
                    <div className={clsx("w-8 h-8 rounded-lg flex flex-col items-center justify-center flex-shrink-0", cfg.bg)}>
                      <span className={clsx("text-[10px] font-bold leading-none", cfg.text)}>
                        {date.toLocaleDateString("es-CO", { day: "numeric" })}
                      </span>
                      <span className={clsx("text-[9px] uppercase leading-none", cfg.text)}>
                        {date.toLocaleDateString("es-CO", { month: "short" })}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{ev.title}</p>
                      {ev.desc && <p className="text-[11px] text-gray-400 truncate mt-0.5">{ev.desc}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Modal nuevo evento */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Nuevo evento</h3>
              <button onClick={() => setModal(false)} className="btn-ghost p-1.5 rounded-lg text-gray-400">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div>
                <label className="label">Título *</label>
                <input value={form.title} onChange={e => set("title", e.target.value)} className="input" placeholder="Nombre del evento" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Fecha *</label>
                  <input type="date" value={form.date} onChange={e => set("date", e.target.value)} className="input" />
                </div>
                <div>
                  <label className="label">Tipo</label>
                  <select value={form.type} onChange={e => set("type", e.target.value)} className="input">
                    <option value="reminder">Recordatorio</option>
                    <option value="coupon">Cupón</option>
                    <option value="shipping">Envío</option>
                    <option value="sales">Ventas</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Descripción</label>
                <input value={form.desc} onChange={e => set("desc", e.target.value)} className="input" placeholder="Descripción opcional" />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
              <button className="btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn-primary" onClick={addEvent}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}