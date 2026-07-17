import { useState, useEffect, useRef } from "react";
import { Image, Upload, Search, X, ChevronLeft } from "../../lib/icons.js";
import { listImages, uploadImageToFolder, listFolders } from "../../lib/cloudinary.js";

export default function ImagePickerModal({ onSelect, onClose }) {
  const [images, setImages] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentFolder, setCurrentFolder] = useState("");
  const inputRef = useRef(null);

  const loadData = () => {
    setLoading(true);
    const prefix = currentFolder ? currentFolder.replace(/\/?$/, "/") : "";
    Promise.all([
      listImages({ maxResults: 100, prefix }),
      listFolders(currentFolder),
    ])
      .then(([imgData, folderData]) => {
        setImages(imgData.images);
        setFolders(folderData.folders);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(loadData, [currentFolder]);

  const handleUpload = async (files) => {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadImageToFolder(file, currentFolder || "widgets");
      setImages(prev => [{
        publicId: result.publicId,
        url: result.url,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.size,
        createdAt: result.createdAt,
      }, ...prev]);
    } catch {}
    setUploading(false);
  };

  const goToFolder = (folderPath) => {
    setCurrentFolder(folderPath);
    setSearch("");
  };

  const filtered = currentFolder
    ? images
    : images;

  const displayImages = search
    ? (currentFolder ? images : images).filter(i =>
        i.publicId.toLowerCase().includes(search.toLowerCase())
      )
    : filtered;

  const folderParts = currentFolder ? currentFolder.split("/") : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Seleccionar imagen</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
            <X size={18} />
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 px-4 pt-3 pb-1 text-xs text-gray-500">
          <button
            onClick={() => goToFolder("")}
            className={`px-2 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${!currentFolder ? "font-semibold text-primary-600" : ""}`}
          >
            Raíz
          </button>
          {folderParts.map((part, i) => {
            const path = folderParts.slice(0, i + 1).join("/");
            const isLast = i === folderParts.length - 1;
            return (
              <span key={path} className="flex items-center gap-1">
                <span className="text-gray-300">/</span>
                <button
                  onClick={() => goToFolder(path)}
                  className={`px-2 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${isLast ? "font-semibold text-primary-600" : ""}`}
                >
                  {part}
                </button>
              </span>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 p-4 pb-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar imágenes..."
              className="input text-sm pl-9"
            />
          </div>
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload size={14} />
            )}
            {uploading ? "Subiendo..." : "Subir imagen"}
          </button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { handleUpload(e.target.files); e.target.value = ""; }} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Folders */}
              {folders.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Carpetas</p>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {folders.map(f => (
                      <button
                        key={f.path}
                        onClick={() => goToFolder(f.path)}
                        className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-center"
                      >
                        <div className="w-8 h-8 mx-auto mb-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                        </div>
                        <p className="text-[10px] text-gray-600 dark:text-gray-400 truncate">{f.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Images */}
              {displayImages.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Image size={40} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">{search ? "Sin resultados" : "No hay imágenes en esta carpeta"}</p>
                </div>
              ) : (
                <div>
                  {folders.length > 0 && <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Imágenes</p>}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {displayImages.map(img => (
                      <button
                        key={img.publicId}
                        onClick={() => onSelect(img.url)}
                        className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border-2 border-transparent hover:border-primary-500 hover:shadow-lg transition-all group relative"
                      >
                        <img src={img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2 pt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-[10px] text-white truncate text-left">{img.publicId.split("/").pop()}.{img.format}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
