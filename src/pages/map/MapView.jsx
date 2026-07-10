import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { api } from "../../lib/api.js";
import { Search, MapPin, Package, ChevronLeft, ChevronRight } from "../../lib/icons.js";
import { notify } from "../../lib/notifications.js";

const STATUS_COLORS = {
  pending: "#f59e0b",
  processing: "#6366f1",
  completed: "#10b981",
  cancelled: "#ef4444",
};

export default function MapView() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const popupRef = useRef(null);
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    api.reports.geoOrders()
      .then((data) => {
        console.log("📍 Coordenadas de pedidos:", data.map(o => ({
          id: o.id?.slice(0,8),
          direccion: o.shippingAddress,
          ciudad: o.city,
          lat: o.lat,
          lng: o.lng,
        })));
        setOrders(data);
        setFiltered(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(orders);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(orders.filter(o =>
      o.shippingAddress?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.city?.toLowerCase().includes(q) ||
      o.id?.toLowerCase().includes(q)
    ));
  }, [search, orders]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current || !filtered.length) return;

    const timer = setTimeout(() => {
      mapInstance.current = new maplibregl.Map({
        container: mapRef.current,
        style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        center: [-74, 4.5],
        zoom: 5.5,
        minZoom: 5,
        maxZoom: 14,
        maxBounds: [[-82, -4.5], [-66, 13]],
        attributionControl: true,
      });

      mapInstance.current.on("load", () => placeMarkers(filtered));
      mapInstance.current.on("click", () => {
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
        setSelected(null);
      });
    }, 200);

    return () => {
      clearTimeout(timer);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [filtered]);

  function placeMarkers(list) {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (!mapInstance.current) return;

    const bounds = new maplibregl.LngLatBounds();

    list.forEach((order) => {
      if (!order.lat || !order.lng) return;

      const color = STATUS_COLORS[order.status] || "#6b7280";

      const wrapper = document.createElement("div");
      wrapper.style.cssText = `position:relative; width:18px; height:18px; display:flex; align-items:center; justify-content:center;`;

      const dot = document.createElement("div");
      dot.style.cssText = `
        width:18px; height:18px;
        background:${color}; border-radius:50%;
        border:2.5px solid white;
        box-shadow:0 1px 6px ${color}80;
        cursor:pointer;
        transition: transform 0.15s;
      `;
      wrapper.title = order.customerName || "Sin nombre";

      wrapper.addEventListener("mouseenter", () => { dot.style.transform = "scale(1.35)"; });
      wrapper.addEventListener("mouseleave", () => { dot.style.transform = "scale(1)"; });

      const popupContent = document.createElement("div");
      popupContent.style.cssText = "font-family:sans-serif;padding:4px 2px;min-width:200px";

      const nameP = document.createElement("p");
      nameP.style.cssText = `font-weight:700;font-size:13px;margin:0 0 2px;color:${color}`;
      nameP.textContent = order.customerName || "Sin nombre";
      popupContent.appendChild(nameP);

      const emailP = document.createElement("p");
      emailP.style.cssText = "color:#6b7280;font-size:11px;margin:0 0 4px";
      emailP.textContent = order.customerEmail || "";
      popupContent.appendChild(emailP);

      const divider = document.createElement("div");
      divider.style.cssText = "border-top:1px solid #f3f4f6;margin:4px 0;padding-top:4px";
      popupContent.appendChild(divider);

      const idRow = document.createElement("p");
      idRow.style.cssText = "font-size:11px;margin:0 0 2px;color:#374151;display:flex;align-items:center;gap:6px";
      const idStrong = document.createElement("strong");
      idStrong.textContent = "Orden:";
      idRow.appendChild(idStrong);
      const idSpan = document.createElement("span");
      idSpan.style.cssText = "font-family:monospace;font-size:10px";
      idSpan.textContent = `${order.id.slice(0, 8)}...`;
      idRow.appendChild(idSpan);
      const copyBtn = document.createElement("span");
      copyBtn.style.cssText = "cursor:pointer;color:#6366f1;line-height:1;display:inline-flex;vertical-align:middle";
      copyBtn.title = "Copiar ID";
      copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
      copyBtn.onclick = (e) => { e.stopPropagation(); navigator.clipboard.writeText(order.id).then(() => notify.copied()); };
      idRow.appendChild(copyBtn);
      divider.appendChild(idRow);

      const addrP = document.createElement("p");
      addrP.style.cssText = "font-size:11px;margin:0 0 2px;color:#374151";
      addrP.innerHTML = `<strong>Dirección:</strong> ${order.shippingAddress || ""}`;
      divider.appendChild(addrP);

      const totalP = document.createElement("p");
      totalP.style.cssText = "font-size:11px;margin:0 0 2px;color:#374151";
      totalP.innerHTML = `<strong>Total:</strong> $${Number(order.total).toLocaleString()}`;
      divider.appendChild(totalP);

      const statusP = document.createElement("p");
      statusP.style.cssText = "font-size:11px;margin:0;color:#374151";
      statusP.innerHTML = `<strong>Estado:</strong> ${order.status}`;
      divider.appendChild(statusP);

      const popup = new maplibregl.Popup({ offset: 20, closeButton: false, maxWidth: "280px" })
        .setDOMContent(popupContent);

      wrapper.appendChild(dot);

      wrapper.addEventListener("click", (e) => {
        e.stopPropagation();
        if (popupRef.current) popupRef.current.remove();
        popupRef.current = popup;
        setSelected(order);
        popup.setLngLat([order.lng, order.lat]).addTo(mapInstance.current);
      });

      new maplibregl.Marker({ element: wrapper, anchor: "center" })
        .setLngLat([order.lng, order.lat])
        .addTo(mapInstance.current);

      bounds.extend([order.lng, order.lat]);
    });

    if (!bounds.isEmpty()) {
      mapInstance.current.fitBounds(bounds, { padding: 60, maxZoom: 12 });
    }
  }

  function focusOrder(order) {
    if (!mapInstance.current || !order.lat || !order.lng) return;
    mapInstance.current.flyTo({ center: [order.lng, order.lat], zoom: 13 });
    setSelected(order);
  }

  const withCoords = filtered.filter(o => o.lat && o.lng);
  const withoutCoords = filtered.filter(o => !o.lat || !o.lng);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex absolute inset-x-0" style={{ top: "64px", bottom: 0, margin: 0 }}>
      {/* Sidebar */}
      <div className={`relative flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${sidebarOpen ? "w-80" : "w-0 overflow-hidden"}`}>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-1.5">
              <MapPin size={15} className="text-primary-600" />
              Pedidos
            </h2>
            <span className="text-xs text-gray-400 font-medium">{filtered.length}</span>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por dirección, cliente..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Con coordenadas */}
          {withCoords.length > 0 && (
            <div className="px-3 pt-3 pb-1">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Geolocalizados ({withCoords.length})
              </p>
            </div>
          )}
          {withCoords.map(o => (
            <button
              key={o.id}
              onClick={() => focusOrder(o)}
              className={`w-full text-left px-4 py-2.5 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${selected?.id === o.id ? "bg-primary-50 dark:bg-primary-900/20 border-l-2 border-l-primary-600" : ""}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[140px]">
                  {o.customerName || "Sin nombre"}
                </p>
                <span className="text-[10px] font-mono text-gray-400">{o.id.slice(0, 8)}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={10} className="text-gray-400 flex-shrink-0" />
                <p className="text-[11px] text-gray-500 truncate">{o.city || "Sin ciudad"}</p>
              </div>
              <p className="text-[11px] text-gray-400 truncate mt-0.5">{o.shippingAddress || ""}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">${Number(o.total).toLocaleString()}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{
                    background: `${STATUS_COLORS[o.status] || "#6b7280"}18`,
                    color: STATUS_COLORS[o.status] || "#6b7280"
                  }}
                >
                  {o.status}
                </span>
              </div>
            </button>
          ))}

          {/* Sin coordenadas */}
          {withoutCoords.length > 0 && (
            <div className="px-3 pt-4 pb-1">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Sin ubicación ({withoutCoords.length})
              </p>
            </div>
          )}
          {withoutCoords.map(o => (
            <div key={o.id} className="px-4 py-2.5 border-b border-gray-50 dark:border-gray-800/50 opacity-50">
              <p className="text-xs font-medium text-gray-500">{o.customerName || "Sin nombre"}</p>
              <p className="text-[11px] text-gray-400 truncate">{o.shippingAddress || ""}</p>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Package size={28} className="mb-2 opacity-30" />
              <p className="text-xs">No se encontraron pedidos</p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle sidebar */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute z-10 left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-r-lg p-1 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800"
        style={{ marginLeft: sidebarOpen ? "320px" : "0" }}
      >
        {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Mapa */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="absolute inset-0" />
        {filtered.length === 0 && orders.length > 0 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-2 text-xs text-amber-700 dark:text-amber-300 shadow-sm">
            No hay pedidos con coordenadas para mostrar en el mapa
          </div>
        )}
      </div>
    </div>
  );
}
