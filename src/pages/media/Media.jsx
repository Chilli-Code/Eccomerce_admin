import { useState, useEffect, useRef } from "react";
import { Upload, Image, Trash2, Grid, List } from "../../lib/icons.js";
import { uploadImage, listImages, deleteImage } from "../../lib/cloudinary.js";
import { notify } from "../../lib/notifications.js";

export default function Media() {
  const [view, setView] = useState("grid");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => { loadImages(); }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      const data = await listImages();
      setImages(data.images);
    } catch {
      notify.error("Error al cargar imágenes");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (files) => {
    const valid = Array.from(files).filter(f => {
      if (!f.type.startsWith("image/")) return false;
      if (f.size > 10 * 1024 * 1024) {
        notify.error(`${f.name} excede 10MB`);
        return false;
      }
      return true;
    });
    if (!valid.length) return;
    setUploading(true);
    try {
      for (const file of valid) {
        const result = await uploadImage(file);
        setImages(prev => [{
          publicId: result.publicId,
          url: result.url,
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.size,
          createdAt: result.createdAt,
        }, ...prev]);
      }
      notify.fileUploaded(`${valid.length} imagen(es) subidas`);
    } catch {
      notify.error("Error al subir imágenes");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleUpload(e.dataTransfer.files);
  };

  const handleDelete = async (publicId) => {
    setDeleting(publicId);
    try {
      await deleteImage(publicId);
      setImages(prev => prev.filter(img => img.publicId !== publicId));
      notify.success("Imagen eliminada");
    } catch {
      notify.error("Error al eliminar imagen");
    } finally {
      setDeleting(null);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Media Library</h1>
          <p className="text-sm text-gray-400 mt-0.5">{images.length} archivos</p>
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
          <button className="btn-primary" onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload size={15} />}
            {uploading ? "Subiendo..." : "Upload"}
          </button>
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => { handleUpload(e.target.files); e.target.value = ""; }} />
        </div>
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragging ? "border-primary-400 bg-primary-50 dark:bg-primary-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
        }`}
      >
        <Upload size={24} className="mx-auto mb-2 text-gray-300" />
        <p className="text-sm text-gray-500">Arrastra y suelta imágenes aquí o <span className="text-primary-600 dark:text-primary-400 cursor-pointer hover:underline" onClick={() => inputRef.current?.click()}>selecciona archivos</span></p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP, SVG, GIF — max 10MB cada una</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Image size={40} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">No hay imágenes aún</p>
          <p className="text-xs mt-1">Sube imágenes arrastrándolas o usando el botón Upload</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map(img => (
            <div key={img.publicId} className="card p-3 group cursor-pointer hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-3">
                <img src={img.url} alt={img.publicId} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{img.publicId.split("/").pop()}.{img.format}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-400">{formatSize(img.size)}</span>
                <button
                  onClick={() => handleDelete(img.publicId)}
                  disabled={deleting === img.publicId}
                  className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
                >
                  {deleting === img.publicId ? <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : <Trash2 size={12} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table-base">
            <thead>
              <tr>
                <th>Archivo</th>
                <th>Dimensiones</th>
                <th>Tamaño</th>
                <th>Subido</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {images.map(img => (
                <tr key={img.publicId}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={img.url} alt={img.publicId} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{img.publicId.split("/").pop()}.{img.format}</span>
                    </div>
                  </td>
                  <td className="text-xs text-gray-400 font-mono">{img.width}×{img.height}</td>
                  <td className="text-sm text-gray-500">{formatSize(img.size)}</td>
                  <td className="text-sm text-gray-500">{formatDate(img.createdAt)}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(img.publicId)}
                      disabled={deleting === img.publicId}
                      className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-red-500 disabled:opacity-50"
                    >
                      {deleting === img.publicId ? <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : <Trash2 size={14} />}
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
