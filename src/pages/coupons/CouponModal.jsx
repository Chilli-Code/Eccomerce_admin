import { X, Target, Ticket } from "../../lib/icons.js";
import ProductSearchSelect from "../../components/ui/ProductSearchSelect.jsx";

export default function CouponModal({ isOpen, onClose, onSave, editingId, form, setForm, categories, products }) {
  if (!isOpen) return null;

  const set = (k, v) => {
    if (k === "type" && v === "free_shipping") {
      setForm(f => ({ ...f, type: v, value: "0" }));
    } else {
      setForm(f => ({ ...f, [k]: v }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold">{editingId ? "Editar cupón" : "Crear nuevo cupón"}</h3>
            <p className="text-xs text-gray-500">{editingId ? "Modifica los detalles" : "Completa la información"}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {/* Layout 2 columnas */}
        <div className="flex bg-gray-50 dark:bg-gray-800/30 flex-col md:flex-row overflow-y-auto max-h-[calc(90vh-120px)]">

          {/* Izquierda */}
          <div className="flex-1 p-6 ">
            <div className="space-y-4">
              <div>
                <label className="label">Código *</label>
                <input value={form.code} onChange={e => set("code", e.target.value.toUpperCase())} className="input font-mono uppercase" placeholder="SUMMER20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Tipo</label>
                  <select value={form.type} onChange={e => set("type", e.target.value)} className="input">
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed">Monto fijo ($)</option>
                    <option value="free_shipping">Envío gratis</option>
                  </select>
                </div>
                <div>
                  <label className="label">Valor *</label>
                  {form.type === "free_shipping" ? (
                    <div className="input bg-gray-50 dark:bg-gray-800 text-gray-400 flex items-center text-sm">
                      Envío gratis automático
                    </div>
                  ) : (
                    <input value={form.value} onChange={e => set("value", e.target.value)} className="input" type="number" placeholder={form.type === "percentage" ? "20" : "15000"} />
                  )}
                </div>
              </div>
              <div>
                <label className="label">Límite de usos</label>
                <input value={form.usageLimit} onChange={e => set("usageLimit", e.target.value)} className="input" type="number" placeholder="Sin límite" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Fecha inicio</label>
                  <input value={form.startDate} onChange={e => set("startDate", e.target.value)} className="input" type="date" />
                </div>
                <div>
                  <label className="label">Fecha fin</label>
                  <input value={form.endDate} onChange={e => set("endDate", e.target.value)} className="input" type="date" />
                </div>
              </div>
            </div>
          </div>

          {/* Derecha - Restricciones */}
          <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-800/30">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-primary-600" />
                <h4 className="font-semibold">Restricciones</h4>
              </div>

              <div>
                <label className="label">Monto mínimo</label>
                <input value={form.minPurchase} onChange={e => set("minPurchase", e.target.value)} className="input" type="number" placeholder="0" />
              </div>

              <div>
                <label className="label">Aplica a</label>
                <div className="flex gap-2 mb-3">
                  {[
                    { value: "all", label: "Todos" },
                    { value: "category", label: "Categoría" },
                    { value: "product", label: "Producto" },
                  ].map(opt => (
                    <button key={opt.value} onClick={() => set("appliesTo", opt.value)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium ${form.appliesTo === opt.value ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>

                {form.appliesTo === "category" && (
                  <select value={form.categoryId} onChange={e => set("categoryId", e.target.value)} className="input">
                    <option value="">Seleccionar categoría</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                )}

                {form.appliesTo === "product" && (
                  <ProductSearchSelect value={form.productId} onChange={(id) => set("productId", id)} placeholder="Buscar producto..." />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-1 md:py-4 border-t border-gray-100 dark:border-gray-800">
          <button className="btn-secondary py-1 md:py-2" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={onSave}>{editingId ? "Actualizar" : "Crear"}</button>
        </div>
      </div>
    </div>
  );
}