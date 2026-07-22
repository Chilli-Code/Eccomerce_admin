import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X, Upload, Image } from "../../lib/icons.js";
import clsx from "clsx";
import { notify } from "../../lib/notifications.js";
import { api } from "../../lib/api.js";
import Loader from "../../components/ui/Loader.jsx";
import { FormCard, FormField, PriceInput } from "../../components/ui/FormCard.jsx";
import { uploadImages } from "../../lib/cloudinary.js";
import ImagePickerModal from "../cms/ImagePickerModal.jsx";
import RichTextEditor from "../../components/ui/RichTextEditor.jsx";
import DOMPurify from 'dompurify'; // 👈 IMPORTAR DOMPurify

const EMPTY_FORM = {
  name:"", sku:"", price:"", salePrice:"", costPrice:"",
  category:"", description:"", status:"draft", stock:"",
  tags:[], newTag:"", brand:"", badge:"", specs:"",
  shippingMethod:"default",
  shippingPrice:"",
  warranty:"",
  deliveryTime:"",
};

const BADGE_OPTIONS = ["", "NUEVO", "OFERTA", "MÁS VENDIDO", "AGOTADO"];

// 👈 CONFIGURACIÓN DE SANITIZACIÓN
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'mark',
    'h1', 'h2', 'h3', 'h4',
    'ul', 'ol', 'li',
    'a', 'span', 'div',
    'blockquote', 'pre', 'code',
    'hr',
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
  ALLOWED_STYLES: ['color', 'background-color', 'font-weight', 'font-style', 'text-align', 'text-decoration'],
  ALLOWED_URI_REGEXP: /^(https?|mailto|tel):/i,
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
  FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus'],
};

export default function ProductForm() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const isEdit   = !!id;

  const [form,       setForm]       = useState(EMPTY_FORM);
  const [loading,    setLoading]    = useState(false);
  const [fetching,   setFetching]   = useState(isEdit);
  const [categories, setCategories] = useState([]);
  const [variants,   setVariants]   = useState([]);
  const [images,     setImages]     = useState([]);
  const [uploading,  setUploading]  = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [shippingPriceFocused, setShippingPriceFocused] = useState(false);
  const fmtCOP = (v) => v ? new Intl.NumberFormat("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(v)) : v;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Carga categorías
  useEffect(() => {
    api.categories.list().then(setCategories).catch(() => {});
  }, []);

  // Carga producto en edición
  useEffect(() => {
    if (!isEdit) return;
api.products.get(id)
  .then((p) => {
    setForm({
      name:        p.name        || "",
      sku:         p.sku         || "",
      price:       p.price       != null ? String(p.price)     : "",
      salePrice: p.salePrice != null && parseFloat(p.salePrice) !== 0 
  ? String(p.salePrice) 
  : "",
      costPrice:   p.costPrice   != null ? String(p.costPrice) : "",
      category:    p.categoryId  || "",
      description: p.description || "",
      status:      p.status      || "draft",
      stock:       String(p.stock ?? 0),
      tags:        p.tags        || [],
      newTag:      "",
      brand:       p.brand       || "",
      badge:       p.badge       || "",
      shippingMethod: p.shippingMethod || "default",
      shippingPrice: p.shippingPrice ? String(p.shippingPrice) : "",
      warranty: p.warranty || "",
      deliveryTime: p.deliveryTime || "",
specs: p.specs
  ? (() => {
      try {
        return JSON.parse(p.specs).map(s => `${s.label}: ${s.value}`).join("\n");
      } catch {
        return "";
      }
    })()
  : "",
    });
    setImages(p.images || []);
    // ← variantes ya vienen dentro del producto
    setVariants((p.variants || []).map(v => ({
      id:       v.id,
      name:     v.name,
      price:    v.price,
      stock:    String(v.stock),
      existing: true,
    })));
  })
  .catch(() => notify.error("Error al cargar producto"))
  .finally(() => setFetching(false));
  }, [id]);
  
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Imágenes
const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files);
  
  const validFiles = files.filter(file => {
    if (file.size > MAX_FILE_SIZE) {
      notify.error(`${file.name} excede el límite de 5MB`);
      return false;
    }
    if (!file.type.startsWith('image/')) {
      notify.error(`${file.name} no es una imagen válida`);
      return false;
    }
    return true;
  });
  
  if (!validFiles.length) return;
  
  setUploading(true);
  
  try {
    const results = await uploadImages(validFiles, (current, total) => {
      notify.info(`Subiendo imagen ${current} de ${total}...`);
    });
    
    const urls = results.map(r => r.url);
    setImages(prev => [...prev, ...urls]);
    notify.fileUploaded(`${urls.length} imagen(es) subidas a Cloudinary`);
  } catch { 
    notify.error("Error al subir una o más imágenes"); 
  } finally { 
    setUploading(false); 
  }
};

  // Variantes
  const addVariant    = () => setVariants(v => [...v, { id:Date.now(), name:"", price:"", stock:"", existing:false }]);
  const updateVariant = (vid, k, val) => setVariants(v => v.map(x => x.id===vid ? {...x,[k]:val} : x));
  const removeVariant = async (vid, isExisting) => {
    if (isExisting && id) {
      try { await api.products.deleteVariant(id, vid); }
      catch { notify.error("Error al eliminar variante"); return; }
    }
    setVariants(v => v.filter(x => x.id !== vid));
  };

  // Tags
  const addTag = () => {
    if (form.newTag.trim() && !form.tags.includes(form.newTag.trim())) {
      set("tags", [...form.tags, form.newTag.trim()]);
      set("newTag", "");
    }
  };

  // Guardar
const handleSave = async () => {
  // Validaciones iniciales
  if (!form.name.trim()) 
    return notify.error("El nombre es obligatorio");
  
  if (!form.sku) 
    return notify.error("El SKU es obligatorio");

  // Validación de precio
  const priceNum = parseFloat(form.price);
  if (isNaN(priceNum) || priceNum <= 0)
    return notify.error("El precio debe ser un número válido mayor a 0");

  // Validación de precio de oferta (warning, no error)
  if (form.salePrice && form.salePrice.trim()) {
    const salePriceNum = parseFloat(form.salePrice);
    if (!isNaN(salePriceNum) && salePriceNum >= priceNum) {
      notify.warning("El precio de oferta debería ser menor al precio regular");
    }
  }

  // Procesar especificaciones
  let specsJson;
  if (form.specs.trim()) {
    const parsed = form.specs.trim().split("\n")
      .filter(l => l.includes(":"))
      .map(l => { 
        const [label, ...rest] = l.split(":"); 
        return { 
          label: label.trim(), 
          value: rest.join(":").trim() 
        }; 
      });
    specsJson = JSON.stringify(parsed);
  }

  // 🛡️ SANITIZAR DESCRIPCIÓN ANTES DE ENVIAR AL BACKEND
  const sanitizedDescription = form.description 
    ? DOMPurify.sanitize(form.description, SANITIZE_CONFIG)
    : undefined;

  setLoading(true);
  try {
    const payload = {
      name: form.name, 
      sku: form.sku, 
      price: String(form.price),
      salePrice: form.salePrice && form.salePrice.trim() !== "" && parseFloat(form.salePrice) !== 0 
  ? String(form.salePrice) 
  : undefined,
      costPrice: form.costPrice || "0",
      description: sanitizedDescription, // ✅ Usar descripción sanitizada
      stock: Number(form.stock) || 0,
      status: form.status, 
      tags: form.tags, 
      images,
      categoryId: form.category || undefined, 
      brand: form.brand || undefined,
      badge: form.badge || undefined, 
      specs: specsJson,
      shippingMethod: form.shippingMethod,
      shippingPrice: form.shippingPrice ? String(form.shippingPrice) : null,
      warranty: form.warranty || null,
      deliveryTime: form.deliveryTime || null,
    };

    let savedId = id;
    if (isEdit) { 
      await api.products.update(id, payload); 
    } else { 
      const c = await api.products.create(payload); 
      savedId = c.id; 
    }

    // Guardar variantes
    const newVars = variants.filter(v => !v.existing);
    const existingVars = variants.filter(v => v.existing);
    
    // Crear promesas para todas las operaciones
    const variantPromises = [
      ...newVars.map(v => {
        if (!v.name.trim()) {
          throw new Error("Todas las variantes deben tener nombre");
        }
        return api.products.createVariant(savedId, {
          name: v.name.trim(),
          stock: Number(v.stock) || 0,
          variantType: "size", 
          ...(v.price && String(v.price).trim() !== "" ? { price: String(v.price) } : {}),
        });
      }),
      ...existingVars.map(v => {
        if (!v.name.trim()) {
          throw new Error("Todas las variantes deben tener nombre");
        }
        return api.products.updateVariant(savedId, v.id, {
          name: v.name.trim(),
          stock: Number(v.stock) || 0,
          variantType: "size",
          ...(v.price && String(v.price).trim() !== "" ? { price: String(v.price) } : {}),
        });
      }),
    ];
    
    if (variantPromises.length > 0) {
      await Promise.all(variantPromises);
    }
    
    notify.productSaved(form.name);
    navigate("/products");
  } catch (err) { 
    console.error("Error al guardar:", err);
    notify.error(err.message || "Error al guardar"); 
  } finally { 
    setLoading(false); 
  }
};

  if (fetching) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Loader size={80} />
      <p className="text-sm text-gray-400">Cargando producto...</p>
    </div>
  );

  return (
    <div className="max-w-10xl">
      {/* Header */}
      <div className="page-header mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/products")} className="btn-ghost p-2 rounded-lg"><ArrowLeft size={18} /></button>
          <div>
            <h1 className="page-title">{isEdit ? "Editar producto" : "Nuevo producto"}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{isEdit ? `Editando: ${form.name}` : "Completa los datos del producto"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => navigate("/products")}>Cancelar</button>
          <button className="btn-primary" onClick={handleSave} disabled={loading}>{loading ? "Guardando…" : "Guardar producto"}</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Columna principal */}
        <div className="col-span-2 space-y-5">

          {/* Info básica */}
          <FormCard title="Información básica">
            <FormField label="Nombre *">
              <input value={form.name} onChange={e=>set("name",e.target.value)} className="input" placeholder="Air Force 1 Low" />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="SKU *">
                <input value={form.sku} onChange={e=>set("sku",e.target.value)} className="input font-mono" placeholder="AF1-001" />
              </FormField>
              <FormField label="Categoría">
                <select value={form.category} onChange={e=>set("category",e.target.value)} className="input">
                  <option value="">Seleccionar categoría</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </FormField>
            </div>
            
            {/* Editor de texto para descripción */}
            <FormField label="Descripción">
              <RichTextEditor 
                value={form.description} 
                onChange={(html) => set("description", html)}
                placeholder="Describe las características, beneficios y especificaciones del producto..."
              />
            </FormField>
          </FormCard>

          {/* Detalles adicionales */}
          <FormCard title="Detalles adicionales">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Marca">
                <input value={form.brand} onChange={e=>set("brand",e.target.value)} className="input" placeholder="Apple, Samsung…" />
              </FormField>
              <FormField label="Badge / Etiqueta">
                <select value={form.badge} onChange={e=>set("badge",e.target.value)} className="input">
                  {BADGE_OPTIONS.map(b => <option key={b} value={b}>{b || "Sin etiqueta"}</option>)}
                </select>
              </FormField>
            </div>
            <FormField label="Garantía" hint="Ej: 12 meses, Garantía de fábrica">
              <input value={form.warranty} onChange={e=>set("warranty",e.target.value)} className="input" placeholder="12 meses" />
            </FormField>
            <FormField label="Tiempo de entrega" hint="Ej: 24 - 48 horas, 3-5 días hábiles">
              <input value={form.deliveryTime} onChange={e=>set("deliveryTime",e.target.value)} className="input" placeholder="24 – 48 horas" />
            </FormField>
            <FormField label="Especificaciones técnicas" hint='Una por línea: Pantalla: 6.1" OLED'>
              <textarea value={form.specs} onChange={e=>set("specs",e.target.value)} rows={5}
                className="input resize-none font-mono text-xs" placeholder={"Pantalla: 6.1\" OLED\nChip: A17 Pro\nBatería: 23h"} />
            </FormField>
          </FormCard>

          {/* Media */}
          <FormCard title="Media">
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((url,i) => (
                  <div key={i} className="relative group aspect-square">
                    <img src={url} className="w-full h-full object-cover rounded-lg" />
                    <button type="button" onClick={() => { const u=images.filter((_,idx)=>idx!==i); setImages(u); }}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center hover:border-primary-400 transition-colors cursor-pointer block">
              <input type="file" accept="image/*" multiple className="sr-only" onChange={handleImageUpload} disabled={uploading} />
              {uploading
                ? <div className="flex items-center justify-center gap-2 text-gray-400"><div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /><span className="text-sm">Subiendo…</span></div>
                : <><Upload size={24} className="mx-auto mb-2 text-gray-300" /><p className="text-sm text-gray-500">Arrastra o <span className="text-primary-600">busca archivos</span></p><p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP · Cloudinary</p></>
              }
            </label>
            {!uploading && (
              <button type="button" onClick={() => setShowPicker(true)}
                className="mt-2 w-full text-sm text-primary-600 hover:text-primary-700 font-medium py-2 border border-dashed border-primary-300 rounded-xl hover:bg-primary-50 dark:border-primary-700 dark:hover:bg-primary-900/20 transition-colors">
                <Image size={16} className="inline mr-1" />Seleccionar desde Cloudinary
              </button>
            )}
          </FormCard>
          {showPicker && <ImagePickerModal
            onSelect={(url) => { setImages(prev => [...prev, url]); setShowPicker(false); }}
            onClose={() => setShowPicker(false)}
          />}

          {/* Variantes */}
          <FormCard>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Variantes</h2>
              <button className="btn-secondary text-xs py-1.5 px-3" onClick={addVariant}><Plus size={13} /> Agregar</button>
            </div>
            {variants.length === 0
              ? <div className="text-sm text-gray-400 py-4 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">Sin variantes. Agrega talla, color u otras opciones.</div>
              : <div className="space-y-3">
                  {variants.map(v => (
                    <div key={v.id} className="grid grid-cols-4 gap-2 items-center">
                      <input value={v.name} onChange={e=>updateVariant(v.id,"name",e.target.value)} className="input text-sm" placeholder="Talla 8" />
                      <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                        <input value={v.price} onChange={e=>updateVariant(v.id,"price",e.target.value)} className="input text-sm pl-6" placeholder="0.00" type="number" />
                      </div>
                      <input value={v.stock} onChange={e=>updateVariant(v.id,"stock",e.target.value)} className="input text-sm" placeholder="Stock" type="number" />
                      <button onClick={()=>removeVariant(v.id,v.existing)} className="btn-ghost p-2 rounded-lg text-gray-400 hover:text-red-500 justify-center"><X size={14} /></button>
                    </div>
                  ))}
                  <p className="text-[11px] text-gray-400">Nombre · Precio · Stock</p>
                </div>
            }
          </FormCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <FormCard title="Estado">
            <select value={form.status} onChange={e=>set("status",e.target.value)} className="input">
              <option value="active">Activo</option>
              <option value="draft">Borrador</option>
              <option value="out_of_stock">Sin stock</option>
            </select>
          </FormCard>

          <FormCard title="Método de envío">
            <select value={form.shippingMethod} onChange={e=>set("shippingMethod",e.target.value)} className="input">
              <option value="default">Por defecto (tarifa fija global)</option>
              <option value="manual">Precio manual por producto</option>
            </select>
            {form.shippingMethod === "manual" && (
              <div className="mt-3">
                <label className="label">Precio de envío</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type={shippingPriceFocused ? "number" : "text"}
                    min="0"
                    value={shippingPriceFocused ? (form.shippingPrice ? Math.round(Number(form.shippingPrice)) : "") : fmtCOP(form.shippingPrice)}
                    onChange={e=>set("shippingPrice",e.target.value)}
                    onFocus={() => setShippingPriceFocused(true)}
                    onBlur={() => setShippingPriceFocused(false)}
                    className="input pl-7"
                    placeholder="10,000"
                  />
                </div>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1.5">Selecciona cómo se calcula el envío de este producto</p>
          </FormCard>

          <FormCard title="Precios">
            <PriceInput label="Precio *"        value={form.price}     onChange={e=>set("price",e.target.value)} />
            <PriceInput label="Precio de oferta" value={form.salePrice} onChange={e=>set("salePrice",e.target.value)} />
            <div>
              <PriceInput label="Costo" value={form.costPrice} onChange={e=>set("costPrice",e.target.value)} />
              <p className="text-[11px] text-gray-400 mt-1">Lo que pagaste al proveedor por este producto. Se usa para calcular tu margen de ganancia.</p>
              {form.price && form.costPrice && Number(form.costPrice) > 0 && (() => {
                const refPrice = form.salePrice && Number(form.salePrice) > 0 ? Number(form.salePrice) : Number(form.price);
                const cost = Number(form.costPrice);
                const diff = refPrice - cost;
                const margin = ((diff / refPrice) * 100);
                const isProfitable = diff >= 0;
                return (
                  <div className={clsx("mt-2 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5", isProfitable ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400")}>
                    <span>{isProfitable ? "📈" : "📉"}</span>
                    {isProfitable
                      ? `Ganancia: $${diff.toLocaleString()} (${margin.toFixed(1)}%)`
                      : `Pérdida: $${Math.abs(diff).toLocaleString()} (${Math.abs(margin).toFixed(1)}%)`}
                    {form.salePrice && Number(form.salePrice) > 0 && <span className="opacity-60">· vs precio de oferta</span>}
                  </div>
                );
              })()}
            </div>
          </FormCard>

          <FormCard title="Inventario">
            <FormField label="Stock">
              <input value={form.stock} onChange={e=>set("stock",e.target.value)} className="input" placeholder="0" type="number" />
            </FormField>
          </FormCard>

          <FormCard title="Tags">
            <div className="flex gap-2">
              <input value={form.newTag} onChange={e=>set("newTag",e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTag()} className="input text-sm py-1.5 flex-1" placeholder="Agregar tag…" />
              <button onClick={addTag} className="btn-secondary px-3 py-1.5"><Plus size={14} /></button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.tags.map(t => (
                <span key={t} className="badge badge-blue gap-1">{t}
                  <button onClick={()=>set("tags",form.tags.filter(x=>x!==t))}><X size={10} /></button>
                </span>
              ))}
            </div>
          </FormCard>
        </div>
      </div>
    </div>
  );
}