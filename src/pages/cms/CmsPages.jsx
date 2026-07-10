import { useState } from "react";
import { Plus, Edit2, Trash2, FileText, ArrowLeft, Save, Grid, Layout, X } from "../../lib/icons.js";
import { cmsPages } from "../../data/mock.js";
import { StatusBadge } from "../../components/ui/index.jsx";
import PageBuilder from "./PageBuilder.jsx";
import WidgetEditor from "./WidgetEditor.jsx";

export default function CmsPages() {
  const [pages, setPages] = useState(cmsPages);
  const [editingPage, setEditingPage] = useState(null);
  const [form, setForm] = useState({ title: "", slug: "", status: "draft", content: "", metaTitle: "", metaDesc: "" });
  
  // Estados para widgets
  const [editingWidget, setEditingWidget] = useState(null);
  const [widgetData, setWidgetData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState("pages"); // "pages" o "widgets"
  
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openNew = () => {
    setForm({ title: "", slug: "", status: "draft", content: "", metaTitle: "", metaDesc: "" });
    setEditingPage("new");
  };

  const openEdit = (p) => {
    setForm({ title: p.title, slug: p.slug, status: p.status, content: p.content || "", metaTitle: p.metaTitle || "", metaDesc: p.metaDesc || "" });
    setEditingPage(p);
  };

  const save = () => {
    if (!form.title.trim()) return;
    if (editingPage === "new") {
      setPages(pp => [...pp, { ...form, id: Date.now(), updated: "Just now" }]);
    } else {
      setPages(pp => pp.map(p => p.id === editingPage.id ? { ...p, ...form, updated: "Just now" } : p));
    }
    setEditingPage(null);
  };

  const handleSaveWidget = (data) => {
    console.log("Widget guardado:", editingWidget, data);
    setEditingWidget(null);
    setWidgetData(null);
    setViewMode("pages");
  };

  // Vista editor de página
  if (editingPage !== null) {
    return (
      <div className="space-y-5">
        <div className="page-header">
          <div className="flex items-center gap-3">
            <button onClick={() => setEditingPage(null)} className="btn-ghost p-2 rounded-lg">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="page-title">{editingPage === "new" ? "Nueva página" : `Editando: ${editingPage.title}`}</h1>
              <p className="text-sm text-gray-400 mt-0.5">Arrastra bloques para construir tu página</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary" onClick={() => setEditingPage(null)}>Cancelar</button>
            <button className="btn-primary" onClick={save}><Save size={15} /> Guardar</button>
          </div>
        </div>

        {/* Info básica */}
        <div className="card p-5">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Título *</label>
              <input value={form.title} onChange={e => { set("title", e.target.value); if (editingPage === "new") set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-")); }} className="input" placeholder="Sobre nosotros" />
            </div>
            <div>
              <label className="label">Slug</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">/</span>
                <input value={form.slug} onChange={e => set("slug", e.target.value)} className="input font-mono text-sm" placeholder="sobre-nosotros" />
              </div>
            </div>
            <div>
              <label className="label">Estado</label>
              <select value={form.status} onChange={e => set("status", e.target.value)} className="input">
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
              </select>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">SEO</h3>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-3">
              <div>
                <label className="label">Meta título</label>
                <input value={form.metaTitle} onChange={e => set("metaTitle", e.target.value)} className="input text-sm" placeholder={form.title || "Título SEO"} />
                <p className="text-[11px] text-gray-400 mt-1"><span className={form.metaTitle.length > 60 ? "text-red-500" : ""}>{form.metaTitle.length}</span>/60 caracteres</p>
              </div>
              <div>
                <label className="label">Meta descripción</label>
                <textarea rows={3} value={form.metaDesc} onChange={e => set("metaDesc", e.target.value)} className="input text-sm resize-none" placeholder="Descripción para buscadores..." />
                <p className="text-[11px] text-gray-400 mt-1"><span className={form.metaDesc.length > 160 ? "text-red-500" : ""}>{form.metaDesc.length}</span>/160 caracteres</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Preview en Google</p>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
                <p className="text-base font-medium text-blue-600 dark:text-blue-400 truncate">{form.metaTitle || form.title || "Título de la página"}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-500 my-0.5">mystore.com/{form.slug || "mi-pagina"}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{form.metaDesc || "Sin descripción — agrega una para mejorar tu SEO."}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="rounded-xl overflow-hidden h-svh">
          <PageBuilder content={form.content} onChange={v => set("content", v)} />
        </div>
      </div>
    );
  }

  // Vista principal (Páginas y Widgets)
  return (
    <div className="space-y-5">
      {/* Header con pestañas */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setViewMode("pages")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              viewMode === "pages"
                ? "bg-primary-600 text-white"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            📄 Páginas
          </button>
          <button
            onClick={() => setViewMode("widgets")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              viewMode === "widgets"
                ? "bg-primary-600 text-white"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            🧩 Widgets
          </button>
        </div>
        {viewMode === "pages" && (
          <button className="btn-primary" onClick={openNew}>
            <Plus size={16} /> Nueva página
          </button>
        )}
      </div>

      {/* Vista de Páginas */}
      {viewMode === "pages" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {pages.map(p => (
            <div key={p.id} className="card p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                  <FileText size={17} className="text-primary-600 dark:text-primary-400" />
                </div>
                <StatusBadge status={p.status} />
              </div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">{p.title}</h3>
              <p className="text-xs text-gray-400 font-mono mb-3">/{p.slug}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Updated {p.updated}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(p)} className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-primary-600">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => setPages(pp => pp.filter(x => x.id !== p.id))} className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-red-500">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vista de Widgets - SIN MODAL, COMPONENTE GRANDE */}
      {viewMode === "widgets" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 h-[calc(100vh-200px)]">
          {/* Panel izquierdo: Lista de widgets */}
          <div className="border rounded-xl overflow-hidden bg-white dark:bg-gray-900 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Widgets disponibles</h3>
              <p className="text-xs text-gray-500 mt-1">Haz clic para editar</p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {/* Hero Widget */}
              <div
                onClick={() => setEditingWidget({ id: "hero", name: "Hero / Banner principal" })}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <Layout size={18} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Hero / Banner</h4>
                    <p className="text-xs text-gray-400">Sección principal con título, imagen y botón</p>
                  </div>
                </div>
              </div>

              {/* Accordion Widget */}
              <div
                onClick={() => setEditingWidget({ id: "accordion", name: "Acordeón / FAQ" })}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <Layout size={18} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Acordeón / FAQ</h4>
                    <p className="text-xs text-gray-400">Preguntas frecuentes con despliegue</p>
                  </div>
                </div>
              </div>

              {/* Products Widget */}
              <div
                onClick={() => setEditingWidget({ id: "products", name: "Productos destacados" })}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <Layout size={18} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Productos destacados</h4>
                    <p className="text-xs text-gray-400">Muestra productos seleccionados</p>
                  </div>
                </div>
              </div>

              {/* Testimonials Widget */}
              <div
                onClick={() => setEditingWidget({ id: "testimonials", name: "Testimonios" })}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <Layout size={18} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Testimonios</h4>
                    <p className="text-xs text-gray-400">Opiniones de clientes</p>
                  </div>
                </div>
              </div>

              {/* Banner Widget */}
              <div
                onClick={() => setEditingWidget({ id: "banner", name: "Banner promocional" })}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <Layout size={18} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Banner promocional</h4>
                    <p className="text-xs text-gray-400">Imagen con texto y botón</p>
                  </div>
                </div>
              </div>

              {/* Contact Form Widget */}
              <div
                onClick={() => setEditingWidget({ id: "contact_form", name: "Formulario de contacto" })}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <Layout size={18} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Formulario de contacto</h4>
                    <p className="text-xs text-gray-400">Formulario para contactar</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel derecho: Editor del widget (grande) */}
          <div className="lg:col-span-3 border rounded-xl overflow-hidden bg-white dark:bg-gray-900">
            {editingWidget ? (
              <WidgetEditor
                widget={editingWidget}
                initialData={widgetData}
                onSave={handleSaveWidget}
                onCancel={() => {
                  setEditingWidget(null);
                  setWidgetData(null);
                }}
                categories={categories}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Grid size={32} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium">Selecciona un widget para editar</p>
                <p className="text-xs mt-1">Haz clic en cualquier widget de la izquierda</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}