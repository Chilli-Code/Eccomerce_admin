// src/components/calendar/EventModal.jsx
import { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, Tag, Ticket, Percent, Package, Target, Clock } from "../../lib/icons.js";
import ProductSearchSelect from "../../components/ui/ProductSearchSelect.jsx";

export default function EventModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingId,
  initialForm,
  categories,
  products 
}) {
  const [form, setForm] = useState({
    title: "",
    date: "",
    endDate: "",
    isRange: false,
    type: "reminder",
    description: "",
    discountType: "percentage",
    discount: "",
    targetType: "category",
    targetId: "",
  });

  useEffect(() => {
    if (initialForm) {
      setForm(initialForm);
    } else {
      setForm({
        title: "",
        date: "",
        endDate: "",
        isRange: false,
        type: "reminder",
        description: "",
        discountType: "percentage",
        discount: "",
        targetType: "category",
        targetId: "",
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

  // Calcular duración
  const getDuration = () => {
    if (!form.isRange || !form.date || !form.endDate) return null;
    const days = Math.ceil((new Date(form.endDate) - new Date(form.date)) / (1000 * 60 * 60 * 24)) + 1;
    return days;
  };

  if (!isOpen) return null;

  const isSale = form.type === "sale";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
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

        {/* Layout de dos columnas */}
        <div className="flex flex-col md:flex-row overflow-y-auto max-h-[calc(90vh-120px)]">
          
          {/* COLUMNA IZQUIERDA - Información básica */}
          <div className="flex-1 p-6 border-r border-gray-100 dark:border-gray-800">
            <div className="space-y-4">
              {/* Tipo de evento con badges visuales */}
              <div>
                <label className="label text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  Tipo de evento
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: "reminder", label: "Recordatorio", icon: "🔔", color: "purple" },
                    { value: "shipping", label: "Envío", icon: "📦", color: "emerald" },
                    { value: "sale", label: "Oferta", icon: "🏷️", color: "primary" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => set("type", opt.value)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                        form.type === opt.value
                          ? `bg-${opt.color}-100 dark:bg-${opt.color}-900/30 ring-2 ring-${opt.color}-500`
                          : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span className="text-lg">{opt.icon}</span>
                      <span className={`text-xs font-medium ${
                        form.type === opt.value ? `text-${opt.color}-700` : "text-gray-600"
                      }`}>
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Título */}
              <div>
                <label className="label text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                  Título del evento *
                </label>
                <input 
                  value={form.title} 
                  onChange={e => set("title", e.target.value)} 
                  className="input" 
                  placeholder="Ej: Descuento Black Friday, Lanzamiento de producto..."
                />
              </div>

              {/* Configuración de fecha */}
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
                    Rango de días
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-500">Fecha {form.isRange ? "inicio" : ""} *</label>
                    <input 
                      type="date" 
                      value={form.date} 
                      onChange={e => set("date", e.target.value)} 
                      className="input mt-1" 
                    />
                  </div>
                  
                  {form.isRange && (
                    <div>
                      <label className="text-xs text-gray-500">Fecha fin *</label>
                      <input 
                        type="date" 
                        value={form.endDate} 
                        onChange={e => set("endDate", e.target.value)} 
                        className="input mt-1" 
                      />
                      {form.date && form.endDate && form.endDate >= form.date && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          📅 Duración: {getDuration()} {getDuration() === 1 ? "día" : "días"}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Descripción */}
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
          </div>

{/* COLUMNA DERECHA - Configuración según tipo */}
<div className={`flex-1 p-6 transition-all ${!isSale ? "bg-gray-50 dark:bg-gray-800/30" : ""}`}>
  {isSale ? (
  <div className="space-y-4">
    <div className="flex items-center gap-2 mb-2">
      <Tag size={16} className="text-primary-600" />
      <h4 className="font-semibold text-gray-900 dark:text-white">Configuración de la oferta</h4>
    </div>
    
    {/* Tipo de descuento */}
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Tipo de descuento</label>
        <select 
          value={form.discountType} 
          onChange={e => set("discountType", e.target.value)} 
          className="input"
        >
          <option value="percentage">Porcentaje (%)</option>
          <option value="fixed">Monto fijo ($)</option>
        </select>
      </div>
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Valor del descuento</label>
        <input 
          type="number" 
          step="0.01"
          value={form.discount} 
          onChange={e => set("discount", e.target.value)} 
          className="input" 
          placeholder={form.discountType === "percentage" ? "Ej: 20" : "Ej: 5000"}
        />
      </div>
    </div>

    {/* Aplicar a */}
    <div>
      <label className="text-xs text-gray-500 mb-1 block flex items-center gap-1">
        <Target size={12} /> Aplicar descuento a
      </label>
      <div className="flex gap-2 mb-3">
        {[
          { value: "category", label: "Categoría", icon: "📁" },
          { value: "product", label: "Producto", icon: "📦" },
          { value: "all", label: "Todo el catálogo", icon: "🌐" },
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
        <select 
          value={form.targetId} 
          onChange={e => set("targetId", e.target.value)} 
          className="input"
        >
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

    {/* Resumen de la oferta */}
    {form.discount && form.targetId && (
      <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800">
        <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 mb-2">📊 Resumen de la oferta</p>
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
  ) : (
    <div className="h-full flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <Tag size={24} className="text-gray-400" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {form.type === "reminder" && "Los recordatorios solo notifican, no aplican descuentos"}
        {form.type === "shipping" && "Los envíos gratuitos se activan en el período seleccionado"}
      </p>
      <p className="text-xs text-gray-400 mt-2">
        Selecciona "Oferta" para configurar descuentos automáticos
      </p>
      {/* 👈 CONFIGURACIÓN DE CUPÓN - VA AQUÍ */}
     
    </div>
  )}
  
</div>
        </div>

        {/* Footer con botones */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
          <button className="btn-secondary px-4 py-2" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary px-6 py-2" onClick={handleSubmit}>
            {editingId ? "Actualizar evento" : "Crear evento"}
          </button>
        </div>
      </div>
    </div>
  );
}