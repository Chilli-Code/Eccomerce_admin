// src/components/calendar/CalendarSidebar.jsx
import { Plus, X, Edit2 } from "../../lib/icons.js";
import clsx from "clsx";

const EVENT_COLORS = {
  coupon: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300", dot: "bg-amber-500" },
  sale: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
   shipping: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
  reminder: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300", dot: "bg-purple-500" },
};

export function SelectedDayEvents({ selected, selectedEvents, openCreateModal, openEditModal, removeEvent }) {
  if (!selected) return null;

  return (
    <div className="card p-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        {new Date(selected + "T12:00:00").toLocaleDateString("es-CO", { 
          weekday: "long", 
          day: "numeric", 
          month: "long" 
        })}
      </p>
      
      {selectedEvents.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-xs text-gray-400">Sin eventos</p>
          <button 
            onClick={openCreateModal} 
            className="btn-secondary text-xs mt-2 py-1.5"
          >
            <Plus size={12} /> Agregar
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {selectedEvents.map(ev => {
            const colors = EVENT_COLORS[ev.type] || EVENT_COLORS.reminder;
            return (
              <div key={ev.id} className={clsx("flex items-start gap-2 p-2.5 rounded-lg", colors.bg)}>
                <span className={clsx("w-2 h-2 rounded-full mt-1 flex-shrink-0", colors.dot)} />
                <div className="flex-1 min-w-0">
                  <p className={clsx("text-xs font-semibold truncate", colors.text)}>
                    {ev.title}
                  </p>
                  {ev.description && (
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {ev.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
    {ev.type !== "coupon" && (
      <button 
        onClick={() => openEditModal(ev)} 
        className="text-gray-400 hover:text-primary-500 flex-shrink-0"
      >
        <Edit2 size={12} />
      </button>
    )}
    <button 
      onClick={() => removeEvent(ev.id)} 
      className="text-gray-400 hover:text-red-500 flex-shrink-0"
    >
      <X size={12} />
    </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function UpcomingEvents({ upcoming, goToDate }) {
const EVENT_COLORS = {
  coupon: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700" },
  sale: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700" },
   shipping: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700" },
  reminder: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700" },
};

  return (
    <div className="card p-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Próximos eventos
      </p>
      <div className="space-y-2">
        {upcoming.map(ev => {
          const colors = EVENT_COLORS[ev.type] || EVENT_COLORS.reminder;
          const date = new Date(ev.startDate);
          return (
            <div
              key={ev.id}
              onClick={() => goToDate(date.toISOString().split("T")[0])}
              className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            >
              <div className={clsx("w-8 h-8 rounded-lg flex flex-col items-center justify-center flex-shrink-0", colors.bg)}>
                <span className={clsx("text-[10px] font-bold leading-none", colors.text)}>
                  {date.getDate()}
                </span>
                <span className={clsx("text-[9px] uppercase leading-none", colors.text)}>
                  {date.toLocaleDateString("es-CO", { month: "short" })}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                  {ev.title}
                </p>
                {ev.description && (
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">
                    {ev.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        {upcoming.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">
            No hay eventos próximos
          </p>
        )}
      </div>
    </div>
  );
}

export default function CalendarSidebar({ 
  selected, 
  selectedEvents, 
  upcoming, 
  openCreateModal, 
  openEditModal, 
  removeEvent,
  goToDate 
}) {
  return (
    <div className="space-y-4">
      <SelectedDayEvents
        selected={selected}
        selectedEvents={selectedEvents}
        openCreateModal={openCreateModal}
        openEditModal={openEditModal}
        removeEvent={removeEvent}
      />
      <UpcomingEvents upcoming={upcoming} goToDate={goToDate} />
    </div>
  );
}