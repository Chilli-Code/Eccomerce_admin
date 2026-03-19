import { useState } from "react";
import { Plus, Edit2, Trash2, FileText, ArrowLeft, Save } from "../../lib/icons.js";
import { cmsPages } from "../../data/mock.js";
import { StatusBadge } from "../../components/ui/index.jsx";
import PageBuilder from "./PageBuilder.jsx";

export default function CmsPages() {
  const [pages, setPages] = useState(cmsPages);
  const [editingPage, setEditingPage] = useState(null);
  const [form, setForm] = useState({ title: "", slug: "", status: "draft", content: "", metaTitle: "", metaDesc: "" });
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

  // Vista editor
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

  // Vista lista
  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Páginas</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gestiona el contenido de tu tienda</p>
        </div>
        <button className="btn-primary" onClick={openNew}><Plus size={16} /> Nueva página</button>
      </div>
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
                <button onClick={() => openEdit(p)} className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-primary-600"><Edit2 size={13} /></button>
                <button onClick={() => setPages(pp => pp.filter(x => x.id !== p.id))} className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
              <div>
          <h1 className="page-title">Widyect</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gestiona el contenido de tu tienda</p>
        </div>
    </div>

    
  );
}