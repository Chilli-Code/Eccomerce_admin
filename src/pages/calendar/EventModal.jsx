import { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, Tag, Percent, Target, Clock } from "../../lib/icons.js";
import ProductSearchSelect from "../../components/ui/ProductSearchSelect.jsx";

const TYPE_STYLES = {
  purple: { active: "bg-purple-100 dark:bg-purple-900/30 ring-2 ring-purple-500", text: "text-purple-700 dark:text-purple-300" },
  emerald: { active: "bg-emerald-100 dark:bg-emerald-900/30 ring-2 ring-emerald-500", text: "text-emerald-700 dark:text-emerald-300" },
  primary: { active: "bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500", text: "text-primary-700 dark:text-primary-300" },
  amber: { active: "bg-amber-100 dark:bg-amber-900/30 ring-2 ring-amber-500", text: "text-amber-700 dark:text-amber-300" },
};

const TYPE_ICONS = { reminder: "🔔", shipping: "📦", sale: "🏷️", coupon: "🎫" };
const TYPE_LABELS = { reminder: "Recordatorio", shipping: "Envío", sale: "Oferta", coupon: "Cupón" };

export default function EventModal({ isOpen, onClose, onSave, onDelete, editingId, initialForm, categories, products }) {
  const [form, setForm] = useState({
    title: "", date: "", endDate: "", isRange: false, type: "reminder",
    description: "", discountType: "percentage", discount: "",
    targetType: "category", targetId: "",
  });

  useEffect(() => {
    if (initialForm) {
      setForm(initialForm);
    } else {
      setForm({
        title: "", date: "", endDate: "", isRange: false, type: "reminder",
        description: "", discountType: "percentage", discount: "",
        targetType: "category", targetId: "",
      });
    }
  }, [initialForm, isOpen]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    if (!form.date) return;
    if (form.isRange && form.endDate && form.endDate < form.date) {
      alert("La fecha fin debe ser posterior a la fecha inicio");
      return;
    }
    onSave(form);
  };

  const getDuration = () => {
    if (!form.isRange || !form.date || !form.endDate) return null;
    return Math.ceil((new Date(form.endDate) - new Date(form.date)) / (1000 * 60 * 60 * 24)) + 1;
  };

  if (!isOpen) return null;

  const needsDiscount = form.type === "sale" || form.type === "coupon";
  const typeColor = { reminder: "purple", shipping: "emerald", sale: "primary", coupon: "amber" }[form.type];

  const TYPE_INFO = {
    reminder: {
      title: "Información del recordatorio",
      desc: "El recordatorio aparecerá en el calendario en la(s) fecha(s) seleccionada(s). No aplica descuentos automáticos.",
      icon: "🔔",
    },
    shipping: {
      title: "Configuración de envío gratis",
      desc: "Los envíos gratuitos estarán activos durante el período seleccionado. Los clientes verán el cargo de envío en $0.",
      icon: "📦",
    },
    sale: {
      title: "Configuración de la oferta",
      desc: "Define el descuento que se aplicará automáticamente a los productos durante este período.",
      icon: "🏷️",
    },
    coupon: {
      title: "Configuración del cupón",
      desc: "Define el descuento del cupón. El cupón estará disponible durante el período seleccionado.",
      icon: "🎫",
    },
  };

  const info = TYPE_INFO[form.type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {editingId ? "Editar evento" : "Crear nuevo evento"}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {editingId ? "Modifica los detalles del evento" : "Completa la información para programar un evento"}
            </p>
          </div>
          <button onClick={onClose} className="btn-ghost p-2 rounded-lg text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="flex-1 p-4 sm:p-6 md:border-r border-gray-100 dark:border-gray-800 space-y-4">
            <div>
              <label className="label text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Tipo de evento
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: "reminder", color: "purple" },
                  { value: "shipping", color: "emerald" },
                  { value: "sale", color: "primary" },
                  { value: "coupon", color: "amber" },
                ].map((opt) => {
                  const styles = TYPE_STYLES[opt.color];
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => set("type", opt.value)}
                      className={`flex flex-col items-center gap-1 p-2 sm:p-3 rounded-lg transition-all ${
                        form.type === opt.value
                          ? styles.active
                          : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span className="text-lg sm:text-xl">{TYPE_ICONS[opt.value]}</span>
                      <span className={`text-[10px] sm:text-xs font-medium text-center leading-tight ${
                        form.type === opt.value ? styles.text : "text-gray-600 dark:text-gray-400"
                      }`}>
                        {TYPE_LABELS[opt.value]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="label text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                Título del evento *
              </label>
              <input
                value={form.title}
                onChange={e => set("title", e.target.value)}
                className="input"
                placeholder={`Ej: ${form.type === "sale" ? "Descuento Black Friday" : form.type === "coupon" ? "Cupón de bienvenida" : form.type === "shipping" ? "Envío gratis fin de semana" : "Reunión de equipo"}`}
              />
            </div>

            <div>
              <label className="label text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                Duración
              </label>
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => set("isRange", false)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    !form.isRange
                      ? "bg-primary-600 text-white shadow-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  <Clock size={14} />
                  Un día
                </button>
                <button
                  type="button"
                  onClick={() => set("isRange", true)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    form.isRange
                      ? "bg-primary-600 text-white shadow-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  <CalendarIcon size={14} />
                  Rango
                </button>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-500">Fecha {form.isRange ? "inicio" : ""} *</label>
                  <input type="date" value={form.date} onChange={e => set("date", e.target.value)} className="input mt-1" />
                </div>
                {form.isRange && (
                  <div>
                    <label className="text-xs text-gray-500">Fecha fin *</label>
                    <input type="date" value={form.endDate} onChange={e => set("endDate", e.target.value)} className="input mt-1" />
                    {form.date && form.endDate && form.endDate >= form.date && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        📅 Duración: {getDuration()} {getDuration() === 1 ? "día" : "días"}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="label text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                Descripción
              </label>
              <textarea
                value={form.description}
                onChange={e => set("description", e.target.value)}
                className="input resize-none"
                rows={3}
                placeholder="Descripción detallada del evento (opcional)"
              />
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{info.icon}</span>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{info.title}</h4>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{info.desc}</p>

            {needsDiscount && (
              <div className="space-y-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Tipo de descuento</label>
                    <select value={form.discountType} onChange={e => set("discountType", e.target.value)} className="input">
                      <option value="percentage">Porcentaje (%)</option>
                      <option value="fixed">Monto fijo ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Valor del descuento</label>
                    <input
                      type="number" step="0.01" value={form.discount}
                      onChange={e => set("discount", e.target.value)} className="input"
                      placeholder={form.discountType === "percentage" ? "Ej: 20" : "Ej: 5000"}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block flex items-center gap-1">
                    <Target size={12} /> Aplicar descuento a
                  </label>
                  <div className="flex gap-2 mb-3">
                    {[
                      { value: "category", label: "Categoría" },
                      { value: "product", label: "Producto" },
                      { value: "all", label: "Todo el catálogo" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => set("targetType", opt.value)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          form.targetType === opt.value
                            ? "bg-primary-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {form.targetType === "category" && (
                    <select value={form.targetId} onChange={e => set("targetId", e.target.value)} className="input">
                      <option value="">Seleccionar categoría</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  )}

                  {form.targetType === "product" && (
                    <ProductSearchSelect
                      value={form.targetId}
                      onChange={(id) => set("targetId", id)}
                      placeholder="Buscar producto..."
                    />
                  )}

                  {form.targetType === "all" && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                      <p className="text-xs text-gray-500">✓ El descuento se aplicará a todos los productos activos</p>
                    </div>
                  )}
                </div>

                {form.discount && form.targetId && (
                  <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800">
                    <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 mb-2">
                      📊 Resumen del {form.type === "coupon" ? "cupón" : "descuento"}
                    </p>
                    <div className="space-y-1 text-xs">
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Descuento:</span> {form.discount}{form.discountType === "percentage" ? "%" : " COP"}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Aplica a:</span> {
                          form.targetType === "category" ? categories.find(c => c.id === form.targetId)?.name || "Categoría seleccionada" :
                          form.targetType === "product" ? "Producto seleccionado" :
                          "Todos los productos"
                        }
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Vigencia:</span> {
                          form.isRange
                            ? `${new Date(form.date).toLocaleDateString("es-CO")} - ${new Date(form.endDate).toLocaleDateString("es-CO")}`
                            : new Date(form.date).toLocaleDateString("es-CO")
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
          <div>
            {editingId && onDelete && (
              <button
                onClick={async () => { if (confirm("¿Eliminar este evento?")) { await onDelete(editingId); onClose(); } }}
                className="px-4 py-2 text-sm rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium"
              >
                Eliminar evento
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary px-4 py-2 text-sm" onClick={onClose}>Cancelar</button>
            <button className="btn-primary px-6 py-2 text-sm" onClick={handleSubmit}>
              {editingId ? "Actualizar evento" : "Crear evento"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
