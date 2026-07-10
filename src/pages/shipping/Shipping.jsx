import { useState, useEffect } from "react";
import { ExternalLink, Truck, Package, CheckCircle, XCircle, Clock, MapPin, TrendingUp } from "../../lib/icons.js";
import { shipments, carriers } from "../../data/mock.js";
import { SearchInput, Pagination } from "../../components/ui/index.jsx";
import clsx from "clsx";
import CustomerMap from "../../components/charts/CustomerMap.jsx";
import ShippingAnalytics from "./ShippingAnalytics.jsx";
import { api } from "../../lib/api.js";

const STATUS_CONFIG = {
  pending: { label: "Pending", icon: Clock, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
  picked_up: { label: "Picked up", icon: Package, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  in_transit: { label: "In transit", icon: Truck, color: "text-primary-600 dark:text-primary-400", bg: "bg-primary-50 dark:bg-primary-900/20" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  failed: { label: "Failed", icon: XCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
};

const TABS = ["All", "Pending", "Picked up", "In transit", "Delivered", "Failed"];

function ShipmentBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", cfg.bg, cfg.color)}>
      <Icon size={11} /> {cfg.label}
    </span>
  );
}

const PER_PAGE = 6;

export default function Shipping() {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    api.reports.geo()
      .then(setGeoData)
      .catch(() => setGeoData([]));
  }, []);

  const tabKey = tab.toLowerCase().replace(" ", "_");

  const filtered = shipments.filter(s => {
    const matchTab = tab === "All" || s.status === tabKey;
    const matchSearch =
      s.order.toLowerCase().includes(search.toLowerCase()) ||
      s.customer.toLowerCase().includes(search.toLowerCase()) ||
      s.tracking.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const activeCarriers = carriers.filter(c => c.active);

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Shipping</h1>
          <p className="text-sm text-gray-400 mt-0.5">{shipments.length} shipments total</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon;
          const count = shipments.filter(s => s.status === key).length;
          return (
            <div key={key} className="card px-4 py-3 flex items-center gap-3">
              <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", cfg.bg)}>
                <Icon size={16} className={cfg.color} />
              </div>
              <div>
                <p className="text-xs text-gray-400">{cfg.label}</p>
                <p className={clsx("text-xl font-semibold", cfg.color)}>{count}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active carriers pills */}
      <div className="card px-5 py-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Active carriers</p>
        <div className="flex flex-wrap gap-2">
          {carriers.map(c => (
            <div
              key={c.id}
              className={clsx(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors",
                c.active
                  ? "border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                  : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400"
              )}
            >
              <img
                src={c.logo}
                alt={c.name}
                className="w-8 h-8 object-contain rounded-lg bg-white p-1 border border-gray-100 dark:border-gray-800"
                onError={e => { e.target.style.display = "none"; }}
              />
              <span>{c.name}</span>
              {c.active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5" />}
            </div>
          ))}
        </div>
      </div>

      {/* Shipments table */}
      <div className="table-wrap">
        <div className="flex gap-1 px-5 pt-4 border-b border-gray-100 dark:border-gray-800 overflow-x-auto overflow-y-hidden">
          {TABS.map(t => (
            <button key={t} onClick={() => { setTab(t); setPage(1); }}
              className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${tab === t
                  ? "border-primary-600 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
            >{t}</button>
          ))}
        </div>

        <div className="px-5 py-3">
          <div className="w-64">
            <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search by order, customer, tracking…" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>Shipment</th>
                <th>Order</th>
                <th>Customer</th>
                <th>Carrier</th>
                <th>Tracking</th>
                <th>City</th>
                <th>ETA</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(s => {
                const carrier = carriers.find(c => c.name === s.carrier);
                const trackingUrl = carrier?.tracking_url?.replace("{tracking}", s.tracking);
                return (
                  <tr key={s.id}>
                    <td className="font-mono text-xs font-semibold text-gray-500">{s.id}</td>
                    <td className="font-mono text-xs text-primary-600 dark:text-primary-400">{s.order}</td>
                    <td className="text-sm text-gray-700 dark:text-gray-300">{s.customer}</td>
                    <td>
                      <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                        <img
                          src={carrier.logo}
                          alt={carrier.name}
                          className="w-8 h-8 object-contain rounded-lg bg-white p-1 border border-gray-100 dark:border-gray-800"
                          onError={e => { e.target.style.display = "none"; }}
                        /> {s.carrier}
                      </span>
                    </td>
                    <td>
                      <a
                        href={trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 font-mono text-xs text-primary-600 dark:text-primary-400 hover:underline"
                        onClick={e => e.stopPropagation()}
                      >
                        {s.tracking} <ExternalLink size={10} />
                      </a>
                    </td>
                    <td>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={11} /> {s.city}
                      </span>
                    </td>
                    <td className={clsx("text-xs font-medium", s.status === "failed" ? "text-red-500" : "text-gray-500")}>
                      {s.eta}
                    </td>
                    <td>
                      <ShipmentBadge status={s.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            <Truck size={32} className="mx-auto mb-2 opacity-30" />
            No shipments found
          </div>
        )}

        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </div>
      <CustomerMap showFilters size="lg" cities={geoData || []} />
      <div className="flex items-center gap-2 pt-2">
        <TrendingUp size={18} className="text-primary-600 dark:text-primary-400" />
        <h2 className="text-base font-semibold text-gray-800 dark:text-white">Análisis de envíos</h2>
        <span className="badge badge-blue ml-1">Últimos 6 meses</span>
      </div>
      <ShippingAnalytics />
    </div>
  );
}