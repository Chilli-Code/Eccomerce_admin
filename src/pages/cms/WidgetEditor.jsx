import { useState, useRef, useEffect, useCallback } from "react";
import { Save, X, Image, ChevronLeft, Eye, Smartphone, Tablet, Monitor, Layout, Upload } from "../../lib/icons.js";
import ImagePickerModal from "./ImagePickerModal.jsx";

const DEVICE_WIDTHS = { desktop: "100%", tablet: "768px", mobile: "375px" };

function LivePreview({ widget, formData, device }) {
  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const getBundleUrl = () => {
    if (!widget?.bundleUrl) return null;
    if (widget.bundleUrl.startsWith("http")) return widget.bundleUrl;
    return widget.bundleUrl;
  };

  const buildSrcdoc = useCallback(() => {
    const bundleUrl = getBundleUrl();
    if (!bundleUrl) return "<html><body><p>Sin bundle</p></body></html>";

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #000; }
    #root { width: 100%; height: 100%; }
    .swidget { height: 100vh !important; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    var widgetContent = ${JSON.stringify(formData)};
    var script = document.createElement('script');
    script.src = '${bundleUrl}';
    script.onload = function() {
      var root = document.getElementById('root');
      var SW = window.SliderWidget;
      if (SW && typeof SW.default === 'function') {
        SW.default(root, widgetContent);
      } else if (typeof SW === 'function') {
        SW(root, widgetContent);
      } else if (SW && typeof SW.init === 'function') {
        SW.init(root, widgetContent);
      } else if (SW && SW.SliderWidget) {
        try { var React = window.React; var createRoot = window.ReactDOM.createRoot; } catch(e) {}
      }
    };
    script.onerror = function() {
      document.getElementById('root').innerHTML = '<div style="padding:2rem;color:red;text-align:center">Error al cargar bundle</div>';
    };
    document.head.appendChild(script);
  </script>
</body>
</html>`;
  }, [formData, widget?.bundleUrl]);

  useEffect(() => {
    setLoading(true);
    const iframe = iframeRef.current;
    if (!iframe) return;
    iframe.srcdoc = buildSrcdoc();
  }, [buildSrcdoc]);

  const isConstrained = device !== "desktop";

  return (
    <div className="relative w-full h-full bg-gray-300 dark:bg-gray-700 overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 z-10">
          <p className="text-xs text-gray-400">Cargando widget...</p>
        </div>
      )}
      <div
        className={`h-full mx-auto transition-all duration-300 relative ${isConstrained ? "shadow-2xl" : ""}`}
        style={{ maxWidth: DEVICE_WIDTHS[device] || "100%" }}
      >
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          title="Widget Preview"
          onLoad={() => setLoading(false)}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}

function DynamicPreview({ fieldsSchema, formData, widgetName }) {
  const repeaterFields = (fieldsSchema || []).filter(f => f.type === "repeater");
  const textFields = (fieldsSchema || []).filter(f => f.type === "text" || f.type === "url" || f.type === "email");
  const imageFields = (fieldsSchema || []).filter(f => f.type === "image");
  const firstTitle = textFields.find(f => /title|heading|nombre/i.test(f.name))?.name;
  const firstImage = imageFields[0]?.name;
  const items = repeaterFields[0] ? formData[repeaterFields[0].name] || [] : [];

  if (firstTitle && firstImage && items.length > 0) {
    const title = formData[firstTitle] || widgetName;
    const img = formData[firstImage];
    return (
      <div className="space-y-3">
        {img && <img src={img} alt="" className="w-full h-32 object-cover rounded-lg" />}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {items.slice(0, 5).map((item, i) => (
            <div key={i} className="flex-shrink-0 w-32 border rounded-lg p-2 text-center">
              {item.image && <img src={item.image} alt="" className="w-full h-16 object-cover rounded mb-1" />}
              {item.title && <p className="text-xs font-medium truncate">{item.title}</p>}
              {Object.entries(item).filter(([k]) => k !== "image" && k !== "title").slice(0, 2).map(([k, v]) => (
                <p key={k} className="text-[10px] text-gray-400 truncate">{String(v).slice(0, 20)}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length > 0) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{repeaterFields[0]?.label || "Items"}</h3>
        {items.slice(0, 4).map((item, i) => (
          <div key={i} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
            {Object.entries(item).slice(0, 3).map(([k, v]) => (
              <p key={k} className="text-xs"><span className="font-medium capitalize">{k}:</span> {String(v).slice(0, 40)}</p>
            ))}
          </div>
        ))}
        {items.length > 4 && <p className="text-xs text-gray-400">+{items.length - 4} más</p>}
      </div>
    );
  }

  if (firstTitle) {
    const title = formData[firstTitle] || widgetName;
    const img = firstImage ? formData[firstImage] : null;
    return (
      <div className="text-center py-6">
        {img && <img src={img} alt="" className="w-full h-28 object-cover rounded-lg mb-3" />}
        {textFields.slice(0, 3).map(f => (
          formData[f.name] && <p key={f.name} className={`${f.name === firstTitle ? "text-lg font-bold" : "text-sm text-gray-500"} mb-1`}>{formData[f.name]}</p>
        ))}
      </div>
    );
  }

  return (
    <div className="text-center py-8 text-gray-400">
      <Layout size={32} className="mx-auto mb-3 opacity-40" />
      <p className="text-sm font-medium text-gray-500">{widgetName}</p>
      <p className="text-xs mt-1">Completa los campos a la izquierda para ver la vista previa</p>
    </div>
  );
}

function getSubFields(field) {
  return field?.fields || field?.subFields || [];
}

function buildInitialData(schema, savedData) {
  if (!schema) return savedData || {};
  const out = {};
  for (const f of schema) {
    if (f.type === "repeater") {
      out[f.name] = savedData?.[f.name] || [];
    } else if (f.type === "checkbox") {
      out[f.name] = savedData?.[f.name] ?? f.default ?? false;
    } else if (savedData && savedData[f.name] !== undefined) {
      out[f.name] = savedData[f.name];
    } else if (f.default !== undefined) {
      out[f.name] = structuredClone(f.default);
    } else {
      out[f.name] = "";
    }
  }
  return out;
}

function makeEmptyRepeaterItem(field) {
  const subFields = getSubFields(field);
  if (!subFields.length) return {};
  const item = {};
  for (const sf of subFields) {
    item[sf.name] = sf.default !== undefined ? sf.default : "";
  }
  return item;
}

export default function WidgetEditor({ widget, initialData, onSave, onCancel, categories }) {
  const schema = widget?.fieldsSchema || widget?.fields;
  const [formData, setFormData] = useState(() => buildInitialData(schema, initialData));
  const [previewMode, setPreviewMode] = useState("desktop");
  const [showPreview, setShowPreview] = useState(true);
  const [previewKey, setPreviewKey] = useState(0);
  const [splitPercent, setSplitPercent] = useState(50);
  const splitRef = useRef(null);
  const [pickerField, setPickerField] = useState(null);

  const handleImageSelect = (url) => {
    if (!pickerField) return;
    const { field, repeater, index, subField } = pickerField;
    if (repeater != null) {
      const newItems = [...(formData[repeater] || [])];
      if (newItems[index]) {
        newItems[index] = { ...newItems[index], [subField]: url };
        handleChange(repeater, newItems);
      }
    } else {
      handleChange(field, url);
    }
    setPickerField(null);
  };

  const handleMouseDown = () => {
    const startX = 0;
    const container = splitRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();

    const onMove = (e) => {
      const x = e.clientX - rect.left;
      const pct = Math.min(Math.max((x / rect.width) * 100, 20), 80);
      setSplitPercent(pct);
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

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

        {/* Fallback preview dinámico para cualquier widget */}
        {!["hero","accordion","products","testimonials","banner","contact_form"].includes(widget?.id) && (
          <DynamicPreview fieldsSchema={widget?.fieldsSchema || widget?.fields} formData={formData} widgetName={widget?.name} />
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

      {/* Layout: Editor + Preview con divider ajustable */}
      <div ref={splitRef} className="flex-1 overflow-hidden flex">
        {/* Panel izquierdo: Editor de campos */}
        <div className="overflow-y-auto p-4 border-r border-gray-200 dark:border-gray-700" style={{ width: `${splitPercent}%` }}>
          <div className="space-y-4">
            {(widget?.fieldsSchema || widget?.fields)?.map((field, fi) => (
              <div key={field.name}>
                <label className="label text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
                  {field.label}
                </label>
                {field.type === "repeater" ? (
                  <div className="space-y-2">
                    {Array.isArray(formData[field.name]) && formData[field.name].map((item, idx) => (
                      <div key={idx} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                        {getSubFields(field).length > 0 ? (
                          getSubFields(field).map(sf => (
                            <div key={sf.name} className="mb-2">
                              <label className="text-xs text-gray-500 capitalize mb-1 block">{sf.label || sf.name}</label>
                              {sf.type === "image" ? (
                                <div className="space-y-1">
                                  {item[sf.name] && (
                                    <div
                                      className="relative group cursor-pointer"
                                      onClick={() => setPickerField({ field: field.name, repeater: field.name, index: idx, subField: sf.name })}
                                    >
                                      <img src={item[sf.name]} alt="" className="w-full h-16 object-cover rounded" />
                                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                                        <span className="text-white text-[10px] font-medium">Cambiar</span>
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex gap-1">
                                    <input
                                      type="text"
                                      value={item[sf.name] ?? ""}
                                      onChange={(e) => {
                                        const newItems = [...formData[field.name]];
                                        newItems[idx][sf.name] = e.target.value;
                                        handleChange(field.name, newItems);
                                      }}
                                      className="flex-1 input text-sm"
                                      placeholder="URL"
                                    />
                                    <button
                                      onClick={() => setPickerField({ field: field.name, repeater: field.name, index: idx, subField: sf.name })}
                                      className="btn-secondary p-1.5 text-xs"
                                      title="Seleccionar imagen"
                                    >
                                      <Image size={14} />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  value={item[sf.name] ?? ""}
                                  onChange={(e) => {
                                    const newItems = [...formData[field.name]];
                                    newItems[idx][sf.name] = e.target.value;
                                    handleChange(field.name, newItems);
                                  }}
                                  className="input text-sm"
                                />
                              )}
                            </div>
                          ))
                        ) : (
                          Object.keys(item).map(key => {
                            const isImageField = /^image|img|photo|foto|imagen|picture|slide|banner|background|bg|icon|logo|thumbnail|preview|portada$/i.test(key);
                            return (
                            <div key={key} className="mb-2">
                              <label className="text-xs text-gray-500 capitalize mb-1 block">{key}</label>
                              {isImageField ? (
                                <div className="space-y-1">
                                  {item[key] && (
                                    <div
                                      className="relative group cursor-pointer"
                                      onClick={() => setPickerField({ field: field.name, repeater: field.name, index: idx, subField: key })}
                                    >
                                      <img src={item[key]} alt="" className="w-full h-16 object-cover rounded" />
                                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                                        <span className="text-white text-[10px] font-medium">Cambiar</span>
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex gap-1">
                                    <input
                                      type="text"
                                      value={item[key]}
                                      onChange={(e) => {
                                        const newItems = [...formData[field.name]];
                                        newItems[idx][key] = e.target.value;
                                        handleChange(field.name, newItems);
                                      }}
                                      className="flex-1 input text-sm"
                                      placeholder="URL"
                                    />
                                    <button
                                      onClick={() => setPickerField({ field: field.name, repeater: field.name, index: idx, subField: key })}
                                      className="btn-secondary p-1.5 text-xs"
                                      title="Seleccionar imagen"
                                    >
                                      <Image size={14} />
                                    </button>
                                  </div>
                                </div>
                              ) : (
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
                              )}
                            </div>
                            );
                          })
                        )}
                        <button
                          onClick={() => handleChange(field.name, formData[field.name].filter((_, i) => i !== idx))}
                          className="text-xs text-red-500 hover:text-red-700 mt-2"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleChange(field.name, [...(formData[field.name] || []), makeEmptyRepeaterItem(field)])}
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
                      <div
                        className="relative group cursor-pointer"
                        onClick={() => setPickerField({ field: field.name })}
                      >
                        <img src={formData[field.name]} alt="Preview" className="w-full h-24 object-cover rounded-lg" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                          <span className="text-white text-xs font-medium">Click para cambiar</span>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPickerField({ field: field.name })}
                        className="btn-secondary text-sm py-1.5 px-3 flex items-center gap-2"
                      >
                        <Image size={14} />
                        {formData[field.name] ? "Cambiar imagen" : "Seleccionar imagen"}
                      </button>
                    </div>
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

        {/* Divider arrastrable */}
        <div
          className="flex-shrink-0 w-1.5 cursor-col-resize hover:bg-primary-400/50 active:bg-primary-500 bg-transparent transition-colors relative z-10 group"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-y-0 -left-1 -right-1" />
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-gray-300 dark:bg-gray-600 group-hover:bg-primary-400 group-active:bg-primary-500 transition-colors" />
        </div>

        {/* Panel derecho: Vista previa */}
        <div className="flex flex-col bg-gray-50 dark:bg-gray-800" style={{ flex: 1, minWidth: 0 }}>
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
                <button
                  onClick={() => setPreviewMode("desktop")}
                  className={`p-1.5 rounded transition-colors ${previewMode === "desktop" ? "bg-white dark:bg-gray-700 shadow-sm text-primary-600" : "text-gray-400 hover:text-gray-600"}`}
                  title="Escritorio"
                >
                  <Monitor size={14} />
                </button>
                <button
                  onClick={() => setPreviewMode("tablet")}
                  className={`p-1.5 rounded transition-colors ${previewMode === "tablet" ? "bg-white dark:bg-gray-700 shadow-sm text-primary-600" : "text-gray-400 hover:text-gray-600"}`}
                  title="Tablet"
                >
                  <Tablet size={14} />
                </button>
                <button
                  onClick={() => setPreviewMode("mobile")}
                  className={`p-1.5 rounded transition-colors ${previewMode === "mobile" ? "bg-white dark:bg-gray-700 shadow-sm text-primary-600" : "text-gray-400 hover:text-gray-600"}`}
                  title="Móvil"
                >
                  <Smartphone size={14} />
                </button>
              </div>
              <Eye size={14} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-500">Preview</span>
            </div>
            {widget?.bundleUrl && (
              <button onClick={() => setPreviewKey(k => k + 1)} className="btn-ghost p-1.5 rounded-lg text-xs text-gray-400 hover:text-primary-600">
                Recargar
              </button>
            )}
          </div>
          <div className="flex-1 overflow-hidden p-0">
            {widget?.bundleUrl ? (
              <LivePreview key={previewKey} widget={widget} formData={formData} device={previewMode} />
            ) : (
              <div className="p-4 overflow-y-auto h-full">{renderPreview()}</div>
            )}
          </div>
        </div>
        {pickerField && (
          <ImagePickerModal
            onSelect={handleImageSelect}
            onClose={() => setPickerField(null)}
          />
        )}
      </div>
    </div>
  );
}