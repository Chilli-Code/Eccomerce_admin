import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Link } from "react-router-dom";
import { shipments } from "../../data/mock.js";


const CITIES = [
  { name: "Bogotá", coords: [-74.0721, 4.7110], sales: 4823, pct: 38.2, color: "#3730a3" },
  { name: "Medellín", coords: [-75.5636, 6.2518], sales: 1540, pct: 12.2, color: "#4f46e5" },
  { name: "Cali", coords: [-76.5225, 3.4516], sales: 1320, pct: 10.4, color: "#6366f1" },
  { name: "Barranquilla", coords: [-74.7964, 10.9685], sales: 980, pct: 7.7, color: "#818cf8" },
  { name: "Bucaramanga", coords: [-73.1198, 7.1254], sales: 760, pct: 6.0, color: "#a5b4fc" },
  { name: "Pereira", coords: [-75.6903, 4.8133], sales: 620, pct: 4.9, color: "#c7d2fe" },
];

const STATUS_FILTERS = [
  { key: "all", label: "Todos" },
  { key: "in_transit", label: "En tránsito" },
  { key: "pending", label: "Pendientes" },
  { key: "delivered", label: "Entregados" },
  { key: "failed", label: "Fallidos" },
];

// shipments mock local para el mapa

export default function CustomerMap({ showFilters = false, size = "default" }) {

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const style = document.createElement("style");
    style.textContent = `@keyframes pulse { 0%,100%{transform:scale(1);opacity:.2} 50%{transform:scale(1.4);opacity:.08} }`;
    document.head.appendChild(style);

    const timer = setTimeout(() => {
      mapInstance.current = new maplibregl.Map({
        container: mapRef.current,
        style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        center: [-74, 4],
        zoom: 4.5,
        minZoom: 4,
        maxZoom: 8,
        maxBounds: [[-82, -5], [-65, 13]],
        attributionControl: false,
      });

      mapInstance.current.on("load", () => renderMarkers("all"));
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  function renderMarkers(filter) {
    // limpia marcadores anteriores
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (!mapInstance.current) return;

    CITIES.forEach(city => {
      // cuenta envíos por ciudad y estado
      const cityShipments = shipments.filter(s =>
        s.city === city.name && (filter === "all" || s.status === filter)
      );
      const count = cityShipments.length;
      if (count === 0 && filter !== "all") return;

      const size = Math.max(20, Math.min(44, city.sales / 140));
      const haloSize = size * 1.8;

      const wrapper = document.createElement("div");
      wrapper.style.cssText = `position:relative; width:${haloSize}px; height:${haloSize}px; display:flex; align-items:center; justify-content:center;`;

      const halo = document.createElement("div");
      halo.style.cssText = `position:absolute; inset:0; border-radius:50%; background:${city.color}; opacity:0.2; animation:pulse 2s ease-in-out infinite;`;

      const dot = document.createElement("div");
      dot.style.cssText = `
        width:${size}px; height:${size}px;
        background:${city.color}; border-radius:50%;
        border:2.5px solid white;
        box-shadow:0 2px 12px ${city.color}80;
        display:flex; align-items:center; justify-content:center;
        color:white; font-size:9px; font-weight:700; cursor:pointer;
        position:relative; z-index:1;
      `;
      dot.textContent = filter === "all"
        ? `${(city.sales / 1000).toFixed(1)}k`
        : `${count}`;

      wrapper.appendChild(halo);
      wrapper.appendChild(dot);

      const marker = new maplibregl.Marker({ element: wrapper, anchor: "center" })
        .setLngLat(city.coords)
        .setPopup(
          new maplibregl.Popup({ offset: 30, closeButton: false })
            .setHTML(`
              <div style="font-family:sans-serif; padding:6px 2px; min-width:130px">
                <p style="font-weight:700; color:${city.color}; font-size:13px; margin:0 0 4px">${city.name}</p>
                <p style="color:#6b7280; font-size:12px; margin:0">${city.sales.toLocaleString()} envíos totales</p>
                ${filter !== "all" ? `<p style="color:${city.color}; font-size:11px; font-weight:600; margin:2px 0 0">${count} ${STATUS_FILTERS.find(f => f.key === filter)?.label}</p>` : ""}
                <p style="color:${city.color}; font-size:11px; font-weight:600; margin:2px 0 0">${city.pct}% del total</p>
              </div>
            `)
        )
        .addTo(mapInstance.current);

      markersRef.current.push(marker);
    });
  }

  function handleFilter(key) {
    setActiveFilter(key);
    if (mapInstance.current?.loaded()) {
      renderMarkers(key);
    } else {
      mapInstance.current?.on("load", () => renderMarkers(key));
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Envíos por ciudad</h2>
          <p className="text-xs text-gray-400">Distribución de pedidos en Colombia</p>
        </div>
        <div className="flex items-center justify-between mb-4">
            <Link to="/shipping" className="text-xs text-primary-600 dark:text-primary-400 hover:underline">View all</Link>
        </div>
      </div>

      {/* Botones de filtro — solo si showFilters está activo */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => handleFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${activeFilter === f.key
                  ? "bg-primary-600 border-primary-600 text-white"
                  : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className={`grid gap-4 ${size === "lg" ? "grid-cols-3" : "grid-cols-5"}`}>
        {/* Mapa */}
        <div className={size === "lg" ? "col-span-2" : "col-span-3"}>
          <div
            ref={mapRef}
            className="rounded-xl overflow-hidden w-full"
            style={{ height: size === "lg" ? "380px" : "260px", minHeight: size === "lg" ? "380px" : "260px" }}
          />
        </div>

        {/* Barras laterales */}
        <div className={`space-y-3 flex flex-col justify-center ${size === "lg" ? "col-span-1" : "col-span-2"}`}>
          {CITIES.map((c) => (
            <div key={c.name}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                  <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[80px]">{c.name}</span>
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{c.pct}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${c.pct}%`, background: c.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}