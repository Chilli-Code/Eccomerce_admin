import { useState, useEffect, useRef } from "react";
import { Upload, Edit2, Trash2, Layout, Globe, X, Check, Loader, Download } from "../../lib/icons.js";
import { api } from "../../lib/api.js";
import { sileo as toast } from "sileo";

const DEFAULT_WIDGETS = [
  {
    name: "Banner Header",
    slug: "header-banner",
    description: "Barra promocional superior y redes sociales del menú móvil",
    category: "Header",
    version: "v1.0",
    fieldsSchema: [
      { name: "promoBanner", label: "Texto del banner", type: "text" },
      { name: "socialLinks", label: "Redes sociales", type: "repeater", fields: [
        { name: "name", label: "Nombre", type: "text" },
        { name: "url", label: "URL", type: "url" },
      ]},
    ],
  },
  {
    name: "Navegación",
    slug: "site-navigation",
    description: "Menú principal de navegación de la tienda",
    category: "Header",
    version: "v1.0",
    fieldsSchema: [
      { name: "navLinks", label: "Enlaces del menú", type: "repeater", fields: [
        { name: "name", label: "Nombre", type: "text" },
        { name: "href", label: "Ruta", type: "url" },
        { name: "subMenu", label: "Submenú (separar con coma)", type: "text" },
      ]},
    ],
  },
  {
    name: "Footer",
    slug: "site-footer",
    description: "Pie de página: marca, enlaces, redes sociales, legal",
    category: "Contenido",
    version: "v1.0",
    fieldsSchema: [
      { name: "brandName", label: "Nombre de la marca", type: "text" },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "copyright", label: "Copyright", type: "text" },
      { name: "groups", label: "Grupos de enlaces", type: "repeater", fields: [
        { name: "title", label: "Título del grupo", type: "text" },
        { name: "links", label: "Enlaces (separados con coma)", type: "text" },
      ]},
      { name: "socialLinks", label: "Redes sociales", type: "repeater", fields: [
        { name: "name", label: "Nombre", type: "text" },
        { name: "url", label: "URL", type: "url" },
      ]},
      { name: "brandNames", label: "Marcas (separadas con coma)", type: "text" },
      { name: "legalLinks", label: "Enlaces legales", type: "repeater", fields: [
        { name: "name", label: "Nombre", type: "text" },
        { name: "url", label: "URL", type: "url" },
      ]},
    ],
  },
  {
    name: "Tagline",
    slug: "homepage-tagline",
    description: "Frase destacada del homepage",
    category: "Contenido",
    version: "v1.0",
    fieldsSchema: [
      { name: "text", label: "Texto del tagline", type: "text" },
    ],
  },
  {
    name: "Misión",
    slug: "homepage-mission",
    description: "Sección de misión y valores del homepage",
    category: "Contenido",
    version: "v1.0",
    fieldsSchema: [
      { name: "heading", label: "Título", type: "text" },
      { name: "image", label: "Imagen", type: "image" },
      { name: "features", label: "Características", type: "repeater", fields: [
        { name: "title", label: "Título", type: "text" },
        { name: "description", label: "Descripción", type: "text" },
      ]},
    ],
  },
];

export default function WidgetManager() {
  const [widgets, setWidgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [editWidget, setEditWidget] = useState(null);
  const [seeding, setSeeding] = useState(false);

  const fetchWidgets = async () => {
    try {
      setLoading(true);
      const data = await api.widgets.list();
      setWidgets(data);
    } catch (e) {
      toast.error("Error al cargar widgets: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWidgets(); }, []);

  const handleSeedDefaults = async () => {
    if (!confirm("Crear los 5 widgets por defecto? (Header, Navegación, Footer, Tagline, Misión)")) return;
    setSeeding(true);
    try {
      const existing = widgets.map(w => w.slug);
      let created = 0;
      for (const w of DEFAULT_WIDGETS) {
        if (existing.includes(w.slug)) continue;
        await api.widgets.uploadNew({
          name: w.name,
          slug: w.slug,
          description: w.description,
          category: w.category,
          version: w.version,
          fieldsSchema: JSON.stringify(w.fieldsSchema),
        });
        created++;
      }
      toast.success(` ${created} widget(s) creado(s) correctamente`);
      fetchWidgets();
    } catch (e) {
      toast.error("Error al crear widgets: " + e.message);
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (w) => {
    if (!confirm(`¿Eliminar "${w.name}"?`)) return;
    try {
      await api.widgets.delete(w.id);
      toast.success("Widget eliminado");
      fetchWidgets();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handlePublishToggle = async (w) => {
    const newStatus = w.status === "published" ? "draft" : "published";
    try {
      await api.widgets.update(w.id, { status: newStatus });
      toast.success(newStatus === "published" ? "Widget publicado" : "Widget despublicado");
      fetchWidgets();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const statusColor = (s) => {
    switch (s) {
      case "published": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "draft": return "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400";
      case "deprecated": return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300";
      default: return "bg-gray-100 text-gray-500";
    }
  };

  const statusLabel = (s) => {
    switch (s) {
      case "published": return "Publicado";
      case "draft": return "Borrador";
      case "deprecated": return "Obsoleto";
      default: return s;
    }
  };

  const defaultSlugs = DEFAULT_WIDGETS.map(d => d.slug);
  const allDefaultsCreated = defaultSlugs.every(slug => widgets.some(w => w.slug === slug));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title">Gestión de Widgets</h1>
          <p className="text-sm text-gray-400 mt-0.5">Sube y administra los bundles de componentes para las tiendas</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {allDefaultsCreated ? (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg font-medium">
              Widgets por defecto creados
            </span>
          ) : (
            <button className="btn-secondary" onClick={handleSeedDefaults} disabled={seeding}>
              {seeding ? <><Loader size={14} className="animate-spin mr-1" /> Creando...</> : "✨ Crear widgets por defecto"}
            </button>
          )}
          <button className="btn-primary" onClick={() => { setEditWidget(null); setShowUpload(true); }}>
            <Upload size={16} /> Subir widget
          </button>
        </div>
      </div>

      {showUpload && (
        <UploadForm
          editWidget={editWidget}
          onDone={() => { setShowUpload(false); setEditWidget(null); fetchWidgets(); }}
          onCancel={() => { setShowUpload(false); setEditWidget(null); }}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader size={20} className="animate-spin mr-2" /> Cargando widgets...
        </div>
      ) : widgets.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <Layout size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium text-gray-500 dark:text-gray-300">No hay widgets aún</p>
          <p className="text-sm mt-1">Sube tu primer widget para empezar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {widgets.map(w => (
            <div key={w.id} className="card p-4 group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                  <Layout size={18} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex items-center gap-1.5">
                  {defaultSlugs.includes(w.slug) && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      Default
                    </span>
                  )}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor(w.status)}`}>
                    {statusLabel(w.status)}
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white">{w.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">{w.category}</span>
                <span className="text-[10px] text-gray-400">{w.version}</span>
              </div>
              {w.description && (
                <p className="text-xs text-gray-400 mt-2 line-clamp-2">{w.description}</p>
              )}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <span className="text-[10px] text-gray-400">{w.bundleUrl ? "Bundle subido" : "Sin bundle"}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handlePublishToggle(w)} className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-emerald-600" title={w.status === "published" ? "Despublicar" : "Publicar"}>
                    <Globe size={13} />
                  </button>
                  <button onClick={() => { setEditWidget(w); setShowUpload(true); }} className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-primary-600">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => handleDelete(w)} className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-red-500">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UploadForm({ editWidget, onDone, onCancel }) {
  const [name, setName] = useState(editWidget?.name || "");
  const [slug, setSlug] = useState(editWidget?.slug || "");
  const [description, setDescription] = useState(editWidget?.description || "");
  const [category, setCategory] = useState(editWidget?.category || "Hero");
  const [version, setVersion] = useState(editWidget?.version || "v1.0");
  const [fieldsSchema, setFieldsSchema] = useState(
    editWidget?.fieldsSchema ? JSON.stringify(editWidget.fieldsSchema, null, 2) : "[]"
  );
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUploading(true);

    try {
      let schema;
      try { schema = JSON.parse(fieldsSchema); } catch { throw new Error("fieldsSchema no es JSON válido"); }

      if (editWidget) {
        await api.widgets.update(editWidget.id, { name, slug, description, category, version, fieldsSchema: schema });
        if (file) await api.widgets.uploadBundle(editWidget.id, file);
        toast.success("Widget actualizado");
      } else {
        await api.widgets.uploadNew({ name, slug, description, category, version, fieldsSchema: JSON.stringify(schema) }, file);
        toast.success("Widget subido correctamente");
      }
      onDone();
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSlugChange = (v) => {
    setSlug(v.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"));
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
          {editWidget ? "Editar widget" : "Subir nuevo widget"}
        </h3>
        <button onClick={onCancel} className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Nombre</label>
            <input value={name} onChange={e => setName(e.target.value)} className="input" required placeholder="Ej: Hero Animado" />
          </div>
          <div>
            <label className="label">Slug</label>
            <input value={slug} onChange={e => handleSlugChange(e.target.value)} className="input" required placeholder="hero-animado" />
          </div>
        </div>
        <div>
          <label className="label">Descripción</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="input" rows={2} placeholder="Widget de hero con animaciones GSAP" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Categoría</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="input">
              <option>Hero</option>
              <option>Testimonial</option>
              <option>FAQ</option>
              <option>Products</option>
              <option>Contenido</option>
              <option>Social</option>
              <option>E-commerce</option>
              <option>Custom</option>
            </select>
          </div>
          <div>
            <label className="label">Versión</label>
            <input value={version} onChange={e => setVersion(e.target.value)} className="input" placeholder="v1.0" />
          </div>
        </div>
        <div>
          <label className="label">Bundle (.js)</label>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => fileRef.current?.click()} className="btn-secondary text-sm">
              <Download size={14} /> {file ? "Cambiar archivo" : "Seleccionar archivo"}
            </button>
            <input ref={fileRef} type="file" accept=".js,.zip" onChange={e => setFile(e.target.files[0])} className="hidden" />
            {file && <span className="text-xs text-gray-400">{file.name}</span>}
          </div>
        </div>
        <div>
          <label className="label">Schema de campos (JSON)</label>
          <textarea value={fieldsSchema} onChange={e => setFieldsSchema(e.target.value)} className="input font-mono text-xs" rows={6} placeholder='[{"name":"title","label":"Título","type":"text","default":"Mi título"}]' />
        </div>
        {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
        <div className="flex gap-2 justify-end pt-2">
          <button type="button" onClick={onCancel} className="btn-secondary text-sm">Cancelar</button>
          <button type="submit" disabled={uploading} className="btn-primary text-sm">
            {uploading ? "Subiendo..." : editWidget ? "Guardar cambios" : "Subir widget"}
          </button>
        </div>
      </form>
    </div>
  );
}
