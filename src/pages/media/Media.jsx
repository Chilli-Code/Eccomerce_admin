import { useState } from "react";
import { Upload, Image, Trash2, Grid, List } from "../../lib/icons.js";

const MOCK_MEDIA = [
  { id: 1, name: "hero-banner.jpg", size: "245 KB", type: "image/jpeg", emoji: "🖼️" },
  { id: 2, name: "product-af1.webp", size: "88 KB", type: "image/webp", emoji: "👟" },
  { id: 3, name: "category-men.jpg", size: "312 KB", type: "image/jpeg", emoji: "🧑" },
  { id: 4, name: "logo-white.png", size: "14 KB", type: "image/png", emoji: "⬜" },
  { id: 5, name: "hoodie-front.webp", size: "102 KB", type: "image/webp", emoji: "👕" },
  { id: 6, name: "banner-summer.jpg", size: "418 KB", type: "image/jpeg", emoji: "☀️" },
];

export default function Media() {
  const [view, setView] = useState("grid");
  const [files, setFiles] = useState(MOCK_MEDIA);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Media Library</h1>
          <p className="text-sm text-gray-400 mt-0.5">{files.length} files</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600" : "text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
              <Grid size={15} />
            </button>
            <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600" : "text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
              <List size={15} />
            </button>
          </div>
          <button className="btn-primary"><Upload size={15} /> Upload</button>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragging ? "border-primary-400 bg-primary-50 dark:bg-primary-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
        }`}
      >
        <Upload size={24} className="mx-auto mb-2 text-gray-300" />
        <p className="text-sm text-gray-500">Drag & drop files here or <span className="text-primary-600 dark:text-primary-400 cursor-pointer hover:underline">browse</span></p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP, SVG, GIF — max 10MB each</p>
      </div>

      {/* Grid view */}
      {view === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {files.map(f => (
            <div key={f.id} className="card p-3 group cursor-pointer hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-5xl mb-3">
                {f.emoji}
              </div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{f.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-400">{f.size}</span>
                <button
                  onClick={() => setFiles(ff => ff.filter(x => x.id !== f.id))}
                  className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <div className="table-wrap">
          <table className="table-base">
            <thead>
              <tr>
                <th>File</th>
                <th>Type</th>
                <th>Size</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {files.map(f => (
                <tr key={f.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{f.emoji}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{f.name}</span>
                    </div>
                  </td>
                  <td className="text-xs text-gray-400 font-mono">{f.type}</td>
                  <td className="text-sm text-gray-500">{f.size}</td>
                  <td>
                    <button onClick={() => setFiles(ff => ff.filter(x => x.id !== f.id))} className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
