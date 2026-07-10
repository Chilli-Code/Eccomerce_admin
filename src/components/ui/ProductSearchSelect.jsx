// src/components/ui/ProductSearchSelect.jsx
import { useState, useEffect } from "react";
import { Search, X } from "../../lib/icons.js";
import { api } from "../../lib/api.js";

export default function ProductSearchSelect({ value, onChange, placeholder = "Buscar producto..." }) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Cargar productos cuando se busca
  useEffect(() => {
    if (!search.trim()) {
      setProducts([]);
      return;
    }
    
    const delay = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.products.list({ search, limit: 10 });
        setProducts(data.items || []);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    }, 300);
    
    return () => clearTimeout(delay);
  }, [search]);

  // Cargar producto seleccionado si hay value inicial
  useEffect(() => {
    if (value && !selectedProduct) {
      api.products.get(value).then(product => {
        setSelectedProduct(product);
        setSearch(product.name);
      }).catch(() => {});
    }
  }, [value]);

  const handleSelect = (product) => {
    setSelectedProduct(product);
    setSearch(product.name);
    setShowDropdown(false);
    onChange(product.id);
  };

  const handleClear = () => {
    setSelectedProduct(null);
    setSearch("");
    onChange("");
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
            if (!e.target.value) onChange("");
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className="input text-sm pl-8 pr-8"
        />
        {selectedProduct && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
          >
            <X size={12} />
          </button>
        )}
      </div>
      
      {/* Dropdown de resultados */}
      {showDropdown && (search || products.length > 0) && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-center text-gray-400 text-sm">
              <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-primary-600 rounded-full mx-auto mb-1" />
              Buscando...
            </div>
          ) : products.length === 0 ? (
            <div className="p-3 text-center text-gray-400 text-sm">
              {search ? "No se encontraron productos" : "Escribe para buscar productos"}
            </div>
          ) : (
            products.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelect(product)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                {product.images?.[0] && (
                  <img src={product.images[0]} alt="" className="w-8 h-8 rounded object-cover" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    ${Number(product.price).toLocaleString("es-CO")}
                  </p>
                </div>
                {product.badge === "OFERTA" && (
                  <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Oferta</span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}