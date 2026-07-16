import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Link } from "react-router-dom";

const DOT_COLORS = ["#3730a3", "#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe", "#94a3b8", "#64748b"];

const STATUS_BAR = [
  { key: "pending", label: "Pendientes", color: "#f59e0b" },
  { key: "processing", label: "Procesando", color: "#6366f1" },
  { key: "in_transit", label: "En camino", color: "#06b6d4" },
  { key: "delivered", label: "Entregados", color: "#10b981" },
  { key: "cancelled", label: "Cancelados", color: "#ef4444" },
];

const STATUS_FILTERS = [
  { key: "all", label: "Todos", color: null },
  { key: "pending", label: "Pendientes", color: "#f59e0b" },
  { key: "processing", label: "Procesando", color: "#6366f1" },
  { key: "in_transit", label: "En camino", color: "#06b6d4" },
  { key: "delivered", label: "Entregados", color: "#10b981" },
  { key: "cancelled", label: "Cancelados", color: "#ef4444" },
];

export default function CustomerMap({ size = "default", cities: citiesProp }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const [tooltip, setTooltip] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const allCities = (citiesProp || []).map((c, i) => ({
    name: c.city,
    coords: c.lat && c.lng ? [c.lng, c.lat] : null,
    hasCoords: !!(c.lat && c.lng),
    sales: c.orders,
    revenue: c.revenue,
    color: DOT_COLORS[i % DOT_COLORS.length],
    breakdown: c.statusBreakdown || {},
  }));

  const cities = activeFilter === "all"
    ? allCities
    : allCities.filter(c => (c.breakdown[activeFilter] || 0) > 0);

  function renderMarkers() {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (!mapInstance.current || !cities.length) return;

    cities.filter(c => c.hasCoords).forEach(city => {
      const dotSize = Math.max(20, Math.min(44, city.sales / 3));
      const haloSize = dotSize * 1.8;

      const wrapper = document.createElement("div");
      wrapper.style.cssText = `position:relative; width:${haloSize}px; height:${haloSize}px; display:flex; align-items:center; justify-content:center;`;

      const halo = document.createElement("div");
      halo.style.cssText = `position:absolute; inset:0; border-radius:50%; background:${city.color}; opacity:0.2; animation:pulse 2s ease-in-out infinite;`;

      const dot = document.createElement("div");
      dot.style.cssText = `
        width:${dotSize}px; height:${dotSize}px;
        background:${city.color}; border-radius:50%;
        border:2.5px solid white;
        box-shadow:0 2px 12px ${city.color}80;
        display:flex; align-items:center; justify-content:center;
        color:white; font-size:9px; font-weight:700; cursor:pointer;
        position:relative; z-index:1;
      `;
      dot.textContent = `${(city.sales / 1000).toFixed(1)}k`;

      wrapper.appendChild(halo);
      wrapper.appendChild(dot);

      const marker = new maplibregl.Marker({ element: wrapper, anchor: "center" })
        .setLngLat(city.coords)
        .setPopup(
          new maplibregl.Popup({ offset: 30, closeButton: false })
            .setHTML(`
              <div style="font-family:sans-serif; padding:6px 2px; min-width:130px">
                <p style="font-weight:700; color:${city.color}; font-size:13px; margin:0 0 4px">${city.name}</p>
                <p style="color:#6b7280; font-size:12px; margin:0">${city.sales} pedidos</p>
                <p style="color:#6b7280; font-size:12px; margin:0">$${Number(city.revenue).toLocaleString()} en ventas</p>
              </div>
            `)
        )
        .addTo(mapInstance.current);

      markersRef.current.push(marker);
    });
  }

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
        minZoom: 4.5,
        maxZoom: 8,
        maxBounds: [[-82, -4.5], [-66, 13]],
        attributionControl: false,
      });

      mapInstance.current.on("load", () => renderMarkers());
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [citiesProp]);

  useEffect(() => {
    if (mapInstance.current) renderMarkers();
  }, [activeFilter, citiesProp]);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Envíos por ciudad</h2>
          <p className="text-xs text-gray-400">Distribución de pedidos en Colombia</p>
        </div>
        <div className="flex items-center justify-between mb-4">
            <Link to="/shipping" className="text-xs text-primary-600 dark:text-primary-400 hover:underline">Ver todos</Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${activeFilter === f.key
                ? "bg-primary-600 border-primary-600 text-white"
                : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
          >
            {f.color && <span className="w-2 h-2 rounded-full inline-block mr-1" style={{ background: f.color }} />}
            {f.label}
          </button>
        ))}
      </div>

      <div className={`grid gap-4 ${size === "lg" ? "md:grid-cols-3" : "md:grid-cols-5"}`}>
        <div className={size === "lg" ? "md:col-span-2" : "md:col-span-3"}>
          <div
            ref={mapRef}
            className="rounded-xl overflow-hidden w-full"
            style={{ height: size === "lg" ? "380px" : "260px", minHeight: size === "lg" ? "380px" : "260px" }}
          />
        </div>

        <div className={`space-y-3 flex flex-col justify-center ${size === "lg" ? "md:col-span-1" : "md:col-span-2"}`}>
          {cities.length === 0 && (
            <p className="text-xs text-gray-400 text-center">No hay datos geográficos aún</p>
          )}
          {cities.map((c) => {
            const b = c.breakdown;
            const total = c.sales;
            const parts = STATUS_BAR.map(s => ({
              ...s,
              count: b[s.key] || 0,
              pct: total > 0 ? (b[s.key] || 0) / total * 100 : 0,
            }));

            return (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                    <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[80px]">{c.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{total} pedidos</span>
                </div>
                <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
                  {parts.map(p => p.count > 0 && (
                    <div
                      key={p.key}
                      className="h-full first:rounded-l-full last:rounded-r-full transition-opacity duration-150 cursor-pointer hover:opacity-80 relative"
                      style={{ width: `${p.pct}%`, background: p.color, minWidth: p.pct > 0 ? "4px" : "0" }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({ x: rect.left + rect.width / 2, y: rect.top, status: p.label, count: p.count, color: p.color });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          {tooltip && (
            <div
              className="fixed z-50 pointer-events-none px-2.5 py-1.5 rounded-lg text-xs font-medium shadow-lg"
              style={{ left: tooltip.x, top: tooltip.y - 8, transform: "translate(-50%, -100%)", background: tooltip.color, color: "#fff" }}
            >
              {tooltip.status}: {tooltip.count}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}