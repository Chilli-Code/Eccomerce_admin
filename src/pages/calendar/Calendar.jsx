import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  useCalendarApp,
  DayFlowCalendar,
  createDayView,
  createWeekView,
  createMonthView,
  createAgendaView,
  createEvent,
  temporalToDate,
  ViewType,
} from "@dayflow/react";
import { createDragPlugin } from "@dayflow/plugin-drag";
import { createSidebarPlugin } from "@dayflow/plugin-sidebar";
import { createKeyboardShortcutsPlugin } from "@dayflow/plugin-keyboard-shortcuts";
import { createLocalizationPlugin, es } from "@dayflow/plugin-localization";
import "@dayflow/core/dist/styles.css";
import { Plus } from "../../lib/icons.js";
import { api } from "../../lib/api.js";
import { notify } from "../../lib/notifications.js";
import EventModal from "./EventModal.jsx";
import CalendarSidebar from "./CalendarSidebar.jsx";
import Loader from "../../components/ui/Loader.jsx";

const CALENDARS = [
  {
    id: "reminder",
    name: "Recordatorios",
    colors: { eventColor: "#e0e7ff", eventSelectedColor: "#c7d2fe", lineColor: "#6366f1", textColor: "#3730a3" },
    darkColors: { eventColor: "#1e1b4b", eventSelectedColor: "#312e81", lineColor: "#818cf8", textColor: "#c7d2fe" },
  },
  {
    id: "shipping",
    name: "Envíos",
    colors: { eventColor: "#dbeafe", eventSelectedColor: "#bfdbfe", lineColor: "#2563eb", textColor: "#1e3a8a" },
    darkColors: { eventColor: "#172554", eventSelectedColor: "#1e3a5f", lineColor: "#60a5fa", textColor: "#bfdbfe" },
  },
  {
    id: "sale",
    name: "Ofertas",
    colors: { eventColor: "#d1fae5", eventSelectedColor: "#a7f3d0", lineColor: "#059669", textColor: "#064e3b" },
    darkColors: { eventColor: "#022c22", eventSelectedColor: "#064e3b", lineColor: "#34d399", textColor: "#a7f3d0" },
  },
  {
    id: "coupon",
    name: "Cupones",
    colors: { eventColor: "#fef3c7", eventSelectedColor: "#fde68a", lineColor: "#d97706", textColor: "#78350f" },
    darkColors: { eventColor: "#451a03", eventSelectedColor: "#78350f", lineColor: "#f59e0b", textColor: "#fde68a" },
  },
];

function toDayFlowEvent(event) {
  const start = new Date(event.startDate);
  const end = event.endDate ? new Date(event.endDate) : new Date(start);
  return createEvent({
    id: String(event.id),
    title: event.title,
    start,
    end,
    allDay: true,
    calendarId: event.type || "reminder",
    description: event.description,
    meta: {
      discountType: event.discountType,
      discount: event.discount,
      targetType: event.targetType,
      targetId: event.targetId,
    },
  });
}

function toDateStr(date) {
  const d = date instanceof Date ? date : temporalToDate(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function Calendar() {
  const today = new Date();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [initialForm, setInitialForm] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("dark_mode");
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const el = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(el.classList.contains("dark"));
    });
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const eventsRef = useRef(events);
  eventsRef.current = events;
  const openEditModalRef = useRef(null);

  useEffect(() => {
    api.categories.list().then(setCategories).catch(() => {});
    api.products.list({ limit: 100 }).then(data => setProducts(data.items || [])).catch(() => {});
  }, []);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.calendar.list();
      setEvents(data);
    } catch (err) {
      notify.error("Error al cargar eventos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const dayFlowEvents = useMemo(() => events.map(toDayFlowEvent), [events]);

  const openCreateModal = useCallback(() => {
    setEditingId(null);
    setInitialForm({
      title: "", date: selected || "", endDate: "", isRange: false,
      type: "reminder", description: "", discountType: "percentage",
      discount: "", targetType: "category", targetId: "",
    });
    setModalOpen(true);
  }, [selected]);

  const openEditModal = useCallback((event) => {
    setEditingId(event.id);
    setInitialForm({
      title: event.title,
      date: new Date(event.startDate).toISOString().split("T")[0],
      endDate: event.endDate ? new Date(event.endDate).toISOString().split("T")[0] : "",
      isRange: !!event.endDate,
      type: event.type,
      description: event.description || "",
      discountType: event.discountType || "percentage",
      discount: event.discount || "",
      targetType: event.targetType || "category",
      targetId: event.targetId || "",
    });
    setModalOpen(true);
  }, []);

  openEditModalRef.current = openEditModal;

  const openEventInModal = useCallback((dfEvent) => {
    const original = eventsRef.current.find(ev => String(ev.id) === dfEvent.id);
    if (original) {
      openEditModalRef.current(original);
    } else {
      const fallback = {
        id: dfEvent.id,
        title: dfEvent.title,
        startDate: temporalToDate(dfEvent.start).toISOString().split("T")[0],
        endDate: dfEvent.end ? temporalToDate(dfEvent.end).toISOString().split("T")[0] : "",
        type: dfEvent.calendarId || "reminder",
        description: dfEvent.description || "",
        discountType: dfEvent.meta?.discountType || "percentage",
        discount: dfEvent.meta?.discount || "",
        targetType: dfEvent.meta?.targetType || "category",
        targetId: dfEvent.meta?.targetId || "",
      };
      openEditModalRef.current(fallback);
    }
  }, []);

  const updateEventInBackend = useCallback(async (id, payload) => {
    try {
      const updated = await api.calendar.update(id, payload);
      setEvents(prev => prev.map(e => String(e.id) === String(updated.id) ? updated : e));
    } catch (err) {
      if (err.status === 404) {
        const match = eventsRef.current.find(ev => String(ev.id) === String(id));
        if (match) {
          notify.error("Evento no encontrado en el servidor");
        }
      } else {
        notify.error("Error al actualizar evento");
      }
      loadEvents();
    }
  }, [loadEvents]);

  const calendar = useCalendarApp({
    views: [
      createDayView(),
      createWeekView({ startOfWeek: 1 }),
      createMonthView({ scroll: { disabled: true, transition: "fade" } }),
      createAgendaView({ daysToShow: 14 }),
    ],
    defaultView: ViewType.MONTH,
    events: dayFlowEvents,
    calendars: CALENDARS,
    defaultCalendar: "reminder",
    locale: "es",
    useEventDetailPanel: false,
    switcherMode: "buttons",
    theme: { mode: isDark ? "dark" : "light" },
    plugins: [
      createDragPlugin({
        enableDrag: true,
        enableResize: false,
        enableCreate: false,
          onEventDrop: (updated, original) => {
            const id = String(original?.id ?? updated.id);
            const exists = eventsRef.current.some(ev => String(ev.id) === id);
            if (!exists) return;
            const startDate = toDateStr(updated.start);
            const endDate = updated.end ? toDateStr(updated.end) : undefined;
            updateEventInBackend(id, {
              startDate,
              endDate: endDate !== startDate ? endDate : undefined,
            });
          },
      }),
      createSidebarPlugin({
        width: 240,
        initialCollapsed: false,
        createCalendarMode: "modal",
      }),
      createKeyboardShortcutsPlugin({
        callbacks: {
          newEvent: () => openCreateModal(),
        },
      }),
      createLocalizationPlugin({ locales: [es] }),
    ],
    callbacks: {
      onDateChange: (date) => setSelected(toDateStr(date)),
      onEventDoubleClick: (dfEvent, e) => {
        openEventInModal(dfEvent);
        return false;
      },
      onMobileEventDetailToggle: (dfEvent) => {
        if (dfEvent) openEventInModal(dfEvent);
      },
    },
  });

  useEffect(() => {
    if (calendar?.app?.setTheme) {
      calendar.app.setTheme(isDark ? "dark" : "light");
    }
  }, [isDark]);

  const saveEvent = async (formData) => {
    try {
      const payload = {
        title: formData.title,
        type: formData.type,
        startDate: formData.date,
        description: formData.description,
      };
      if (formData.isRange && formData.endDate) payload.endDate = formData.endDate;
      if (formData.type === "sale" || formData.type === "coupon") {
        payload.discountType = formData.discountType;
        payload.discount = parseFloat(formData.discount);
        payload.targetType = formData.targetType;
        if (formData.targetId) payload.targetId = formData.targetId;
      }
      if (editingId) {
        const updated = await api.calendar.update(editingId, payload);
        setEvents(prev => prev.map(e => String(e.id) === String(updated.id) ? updated : e));
        notify.productSaved("Evento actualizado");
      } else {
        const newEvent = await api.calendar.create(payload);
        setEvents(prev => [...prev, newEvent]);
        notify.productSaved("Evento creado");
      }
      setModalOpen(false);
      setEditingId(null);
      setInitialForm(null);
    } catch (err) {
      console.error("Error al guardar evento:", err);
      notify.error(err.message || "Error al guardar evento");
    }
  };

  const removeEvent = async (id) => {
    try {
      await api.calendar.delete(id);
      setEvents(prev => prev.filter(e => e.id !== id));
      notify.productSaved("Evento eliminado");
    } catch (err) {
      notify.error("Error al eliminar evento");
    }
  };

  const goToDate = (dateStr) => {
    calendar.selectDate(new Date(dateStr + "T12:00:00"));
    setSelected(dateStr);
  };

  const todayStr = toDateStr(today);
  const upcoming = useMemo(() => [...events]
    .filter(e => toDateStr(new Date(e.startDate)) >= todayStr)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 6), [events, todayStr]);

  const selectedEvents = useMemo(() =>
    selected ? events.filter(e => {
      const start = toDateStr(new Date(e.startDate));
      const end = e.endDate ? toDateStr(new Date(e.endDate)) : start;
      return selected >= start && selected <= end;
    }) : [], [events, selected]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Loader size={80} />
      <p className="text-sm text-gray-400">Cargando Calendario...</p>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Calendario</h1>
          <p className="text-sm text-gray-400 mt-0.5">Eventos, cupones y recordatorios</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <Plus size={16} /> Nuevo evento
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        <div className="xl:col-span-3 card p-0 overflow-hidden" style={{ minHeight: 600 }}>
          <DayFlowCalendar calendar={calendar} mobileEventDetail={() => null} />
        </div>

        <CalendarSidebar
          selected={selected}
          selectedEvents={selectedEvents}
          upcoming={upcoming}
          openCreateModal={openCreateModal}
          openEditModal={openEditModal}
          removeEvent={removeEvent}
          goToDate={goToDate}
        />
      </div>

      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveEvent}
        editingId={editingId}
        initialForm={initialForm}
        categories={categories}
        products={products}
      />
    </div>
  );
}
