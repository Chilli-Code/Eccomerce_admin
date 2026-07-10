// src/pages/Calendar.jsx
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus } from "../../lib/icons.js";
import { api } from "../../lib/api.js";
import { notify } from "../../lib/notifications.js";
import EventModal from "./EventModal.jsx";
import CalendarGrid from "./CalendarGrid.jsx";
import CalendarSidebar from "./CalendarSidebar.jsx";
import Loader from "../../components/ui/Loader.jsx";

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

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
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [initialForm, setInitialForm] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // Cargar datos
  useEffect(() => {
    api.categories.list().then(setCategories).catch(() => {});
    api.products.list({ limit: 100 }).then(data => setProducts(data.items || [])).catch(() => {});
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await api.calendar.list();
      setEvents(data);
    } catch (err) {
      notify.error("Error al cargar eventos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const eventsFor = (dateStr) => {
    return events.filter(e => {
      const eventStart = new Date(e.startDate).toISOString().split("T")[0];
      const eventEnd = e.endDate ? new Date(e.endDate).toISOString().split("T")[0] : eventStart;
      return dateStr >= eventStart && dateStr <= eventEnd;
    });
  };

  const openCreateModal = () => {
    setEditingId(null);
    setInitialForm({
      title: "",
      date: selected || "",
      endDate: "",
      isRange: false,
      type: "reminder",
      description: "",
      discountType: "percentage",
      discount: "",
      targetType: "category",
      targetId: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (event) => {
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
  };

  const saveEvent = async (formData) => {
    try {
      const payload = {
        title: formData.title,
        type: formData.type,
        startDate: formData.date,
        description: formData.description,
      };

      if (formData.isRange && formData.endDate) {
        payload.endDate = formData.endDate;
      }

      if (formData.type === "sale") {
        payload.discountType = formData.discountType;
        payload.discount = parseFloat(formData.discount);
        payload.targetType = formData.targetType;
        if (formData.targetId) payload.targetId = formData.targetId;
      }

      if (editingId) {
        const updated = await api.calendar.update(editingId, payload);
        setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
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
    const [yearStr, monthStr] = dateStr.split("-");
    setYear(parseInt(yearStr));
    setMonth(parseInt(monthStr) - 1);
    setSelected(dateStr);
  };

  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
  const upcoming = [...events]
    .filter(e => new Date(e.startDate).toISOString().split("T")[0] >= todayStr)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 6);

  const selectedEvents = selected ? eventsFor(selected) : [];

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
        {/* Calendario principal */}
        <div className="xl:col-span-3 card p-5">
          {/* Header del calendario */}
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

          {/* Grid del calendario */}
          <CalendarGrid
            year={year}
            month={month}
            daysInMonth={daysInMonth}
            firstDay={firstDay}
            totalCells={totalCells}
            eventsFor={eventsFor}
            selected={selected}
            setSelected={setSelected}
            today={today}
            toDateStr={toDateStr}
          />

          {/* Leyenda de colores */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Cupones</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 " />
              <span className="text-xs text-gray-500 dark:text-gray-400">Ventas / Ofertas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Envíos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Recordatorios</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
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

      {/* Modal de eventos */}
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