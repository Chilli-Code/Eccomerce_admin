import { useState } from "react";
import { Save, X, Image, ChevronLeft, Eye, Smartphone, Tablet, Monitor } from "../../lib/icons.js";

export default function WidgetEditor({ widget, initialData, onSave, onCancel, categories }) {
  const [formData, setFormData] = useState(initialData || {});
  const [previewMode, setPreviewMode] = useState("desktop"); // desktop, tablet, mobile
  const [showPreview, setShowPreview] = useState(true);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  // Renderizado de vista previa según tipo de widget
  const renderPreview = () => {
    const previewStyles = {
      desktop: "w-full",
      tablet: "max-w-[768px] mx-auto",
      mobile: "max-w-[375px] mx-auto",
    };

    return (
      <div className={`${previewStyles[previewMode]} transition-all duration-300`}>
        {/* Hero Widget Preview */}
        {widget?.id === "hero" && (
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800 text-white">
            {formData.image && (
              <img src={formData.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            )}
            <div className="relative p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">{formData.title || "Título principal"}</h2>
              <p className="text-sm opacity-90 mb-4">{formData.subtitle || "Subtítulo de ejemplo"}</p>
              {formData.cta_text && (
                <button className="px-6 py-2 bg-white text-primary-600 rounded-full text-sm font-semibold hover:scale-105 transition-transform">
                  {formData.cta_text}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Accordion Widget Preview */}
        {widget?.id === "accordion" && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{formData.title || "Preguntas frecuentes"}</h3>
            <div className="space-y-2">
              {formData.items?.slice(0, 3).map((item, idx) => (
                <div key={idx} className="border rounded-lg overflow-hidden">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 font-medium text-sm">
                    {item.question || "¿Pregunta de ejemplo?"}
                  </div>
                  <div className="p-3 text-sm text-gray-600 dark:text-gray-400">
                    {item.answer || "Respuesta de ejemplo para mostrar cómo se verá el acordeón en la página."}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Widget Preview */}
        {widget?.id === "products" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{formData.title || "Productos destacados"}</h3>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].slice(0, formData.limit || 4).map((i) => (
                <div key={i} className="border rounded-lg p-2">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-24 mb-2 flex items-center justify-center text-gray-400 text-xs">
                    Producto {i}
                  </div>
                  <p className="text-xs font-medium">Producto ejemplo</p>
                  <p className="text-xs text-primary-600">$99.900</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials Widget Preview */}
        {widget?.id === "testimonials" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{formData.title || "Testimonios"}</h3>
            <div className="space-y-3">
              {formData.items?.slice(0, 2).map((item, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                      {item.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{item.name || "Cliente"}</p>
                      <div className="flex gap-0.5">
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xs">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">"{item.comment || "Excelente servicio y productos de calidad."}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Banner Widget Preview */}
        {widget?.id === "banner" && (
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-orange-500 to-pink-500 text-white">
            {formData.image && (
              <img src={formData.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            )}
            <div className="relative p-6 text-center">
              <h3 className="text-xl font-bold mb-1">{formData.title || "Oferta especial"}</h3>
              <p className="text-sm mb-3">{formData.subtitle || "20% de descuento"}</p>
              {formData.button_text && (
                <button className="px-5 py-2 bg-white text-orange-600 rounded-full text-sm font-semibold">
                  {formData.button_text}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Contact Form Widget Preview */}
        {widget?.id === "contact_form" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{formData.title || "Contáctanos"}</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Tu nombre"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                disabled
              />
              <input
                type="email"
                placeholder="Tu email"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                disabled
              />
              <textarea
                placeholder="Tu mensaje"
                rows="3"
                className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                disabled
              />
              <button className="w-full py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold">
                Enviar mensaje
              </button>
              {formData.show_phone && (
                <p className="text-xs text-center text-gray-500 mt-2">📞 {formData.phone || "+57 300 123 4567"}</p>
              )}
              {formData.show_address && (
                <p className="text-xs text-center text-gray-500">📍 {formData.address || "Calle 123, Barranquilla"}</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <ChevronLeft size={18} />
          </button>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Editar: {widget?.name}
            </h3>
            <p className="text-xs text-gray-500">Configura el contenido del widget</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="btn-secondary text-sm py-1.5 px-3">
            Cancelar
          </button>
          <button onClick={handleSave} className="btn-primary text-sm py-1.5 px-3 flex items-center gap-1">
            <Save size={14} /> Guardar
          </button>
        </div>
      </div>

      {/* Layout: Editor + Preview */}
      <div className="flex-1 overflow-hidden flex">
        {/* Panel izquierdo: Editor de campos */}
        <div className="w-1/2 overflow-y-auto p-4 border-r border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            {widget?.fields?.map(field => (
              <div key={field.name}>
                <label className="label text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
                  {field.label}
                </label>
                {field.type === "repeater" ? (
                  <div className="space-y-2">
                    {Array.isArray(formData[field.name]) && formData[field.name].map((item, idx) => (
                      <div key={idx} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                        {Object.keys(item).map(key => (
                          <div key={key} className="mb-2">
                            <label className="text-xs text-gray-500 capitalize mb-1 block">{key}</label>
                            <input
                              type="text"
                              value={item[key]}
                              onChange={(e) => {
                                const newItems = [...formData[field.name]];
                                newItems[idx][key] = e.target.value;
                                handleChange(field.name, newItems);
                              }}
                              className="input text-sm"
                            />
                          </div>
                        ))}
                        <button
                          onClick={() => handleChange(field.name, formData[field.name].filter((_, i) => i !== idx))}
                          className="text-xs text-red-500 hover:text-red-700 mt-2"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleChange(field.name, [...(formData[field.name] || []), {}])}
                      className="text-xs text-primary-600 hover:text-primary-700"
                    >
                      + Agregar {field.label.slice(0, -1).toLowerCase()}
                    </button>
                  </div>
                ) : field.type === "select" ? (
                  <select
                    value={formData[field.name] || field.default}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="input text-sm"
                  >
                    {field.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === "category_select" ? (
                  <select
                    value={formData[field.name] || field.default}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="input text-sm"
                  >
                    <option value="">Todas las categorías</option>
                    {categories?.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                ) : field.type === "checkbox" ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData[field.name] ?? field.default}
                      onChange={(e) => handleChange(field.name, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{field.label}</span>
                  </label>
                ) : field.type === "image" ? (
                  <div className="space-y-2">
                    {formData[field.name] && (
                      <img src={formData[field.name]} alt="Preview" className="w-full h-24 object-cover rounded-lg" />
                    )}
                    <input
                      type="text"
                      value={formData[field.name] || field.default}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="input text-sm"
                      placeholder="URL de la imagen"
                    />
                  </div>
                ) : field.type === "color" ? (
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData[field.name] || field.default}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-10 h-10 rounded border"
                    />
                    <input
                      type="text"
                      value={formData[field.name] || field.default}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="flex-1 input text-sm"
                    />
                  </div>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] || field.default}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="input text-sm"
                    placeholder={field.label}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Panel derecho: Vista previa */}
        <div className="w-1/2 flex flex-col bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-1">
              <Eye size={14} className="text-gray-500" />
              <span className="text-xs font-medium text-gray-600">Vista previa</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`p-1.5 rounded ${previewMode === "mobile" ? "bg-primary-100 text-primary-600" : "text-gray-400 hover:bg-gray-100"}`}
                title="Vista móvil"
              >
                <Smartphone size={14} />
              </button>
              <button
                onClick={() => setPreviewMode("tablet")}
                className={`p-1.5 rounded ${previewMode === "tablet" ? "bg-primary-100 text-primary-600" : "text-gray-400 hover:bg-gray-100"}`}
                title="Vista tablet"
              >
                <Tablet size={14} />
              </button>
              <button
                onClick={() => setPreviewMode("desktop")}
                className={`p-1.5 rounded ${previewMode === "desktop" ? "bg-primary-100 text-primary-600" : "text-gray-400 hover:bg-gray-100"}`}
                title="Vista escritorio"
              >
                <Monitor size={14} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {renderPreview()}
          </div>
        </div>
      </div>
    </div>
  );
}