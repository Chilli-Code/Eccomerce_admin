// src/components/calendar/CalendarGrid.jsx
import clsx from "clsx";

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export default function CalendarGrid({ 
  year, 
  month, 
  daysInMonth, 
  firstDay, 
  totalCells, 
  eventsFor, 
  selected, 
  setSelected, 
  today,
  toDateStr 
}) {
  const isToday = (dateStr) => {
    return dateStr === toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
  };

const EVENT_COLORS = {
  coupon: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300" },
  sale: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-300" },
  shipping: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300" },
  reminder: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300" },
};

  return (
    <>
      {/* Header días */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Grid de días */}
      <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
        {Array.from({ length: totalCells }).map((_, i) => {
          const dayNum = i - firstDay + 1;
          const valid = dayNum >= 1 && dayNum <= daysInMonth;
          const dateStr = valid ? toDateStr(year, month, dayNum) : null;
          const dayEvents = dateStr ? eventsFor(dateStr) : [];
          const isTodayDate = dateStr ? isToday(dateStr) : false;
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
                    isTodayDate
                      ? "bg-primary-600 text-white"
                      : "text-gray-700 dark:text-gray-300"
                  )}>
                    {dayNum}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map(ev => {
                      const colors = EVENT_COLORS[ev.type] || EVENT_COLORS.reminder;
                      return (
                        <div
                          title={ev.title}
                          key={ev.id} 
                          className={clsx("text-[10px] px-1.5 py-0.5 rounded truncate font-medium", colors.bg, colors.text)}
                        >
                          {ev.title}
                        </div>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <div className="text-[10px] text-gray-400 px-1">
                        +{dayEvents.length - 2} más
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}