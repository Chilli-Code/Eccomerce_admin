import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package, Tag, ShoppingCart, Users,
  Ticket, FileText, Image, Settings, ChevronDown,
  Zap, LogOut, Store, Receipt, Truck, MessageSquare, StickyNote, SlidersHorizontal, CalendarDays, BarChart2, MapPin,
} from "../../lib/icons.js";
import { useState } from "react";
import clsx from "clsx";

const NAV = [
  { label: "Inicio", icon: LayoutDashboard, to: "/dashboard" },
  {
    label: "Catálogo", icon: Package,
    children: [
      { label: "Productos", icon: Package, to: "/products" },
      { label: "Categorías", icon: Tag, to: "/categories" },
      { label: "Facturas", icon: Receipt, to: "/invoices" },
    ],
  },
  {
    label: "Pedidos", icon: ShoppingCart,
    children: [
      { label: "Órdenes", icon: ShoppingCart, to: "/orders" },
      { label: "Envíos", icon: Truck, to: "/shipping" },
      { label: "Mapa", icon: MapPin, to: "/map" },
    ],
  },
  { label: "Reportes", icon: BarChart2, to: "/reports" },
  { label: "Clientes", icon: Users, to: "/customers" },
  { label: "Cupones", icon: Ticket, to: "/coupons" },
  {
    label: "Contenido", icon: FileText,
    children: [
      { label: "Páginas", icon: StickyNote, to: "/pages" },
      { label: "Multimedia", icon: Image, to: "/media" },
      { label: "Calendario",  icon: CalendarDays, to: "/calendar" },
    ],
  },
  { label: "Soporte", icon: MessageSquare, to: "/tickets" },
  {
    label: "Ajustes", icon: Settings,
    children: [
      { label: "General", icon: SlidersHorizontal, to: "/settings" },
      { label: "Transportista", icon: Truck, to: "/settings/transportation" },
      { label: "Equipo", icon: Users, to: "/settings/team" },
    ],
  },
];

function NavGroup({ item }) {
  const location = useLocation();
  const isActive = item.children?.some(c => location.pathname === c.to || location.pathname.startsWith(c.to + "/"));
  const [open, setOpen] = useState(isActive);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={clsx(
          "nav-link w-full justify-between",
          isActive && "text-gray-900 dark:text-white"
        )}
      >
        <span className="flex items-center gap-3">
          <item.icon size={17} />
          {item.label}
        </span>
        <ChevronDown
          size={14}
          className={clsx("transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="ml-6 mt-0.5 space-y-0.5 border-l border-gray-100 dark:border-gray-800 pl-3">
          {item.children.map((c) => (
            <NavLink
              key={c.to}
              to={c.to}
              className={({ isActive }) =>
                clsx("nav-link text-[13px]", location.pathname === c.to && "active")
              }
            >
              {c.icon && <c.icon size={14} />}
              {c.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ open, onLogout }) {
  const user = JSON.parse(localStorage.getItem("admin_user") || "{}");
  const initials = user.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "A";
  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 h-dvh flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-transform duration-300 z-30",
        open ? "translate-x-0" : "-translate-x-full"
      )}
      style={{ width: "var(--sidebar-width)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
          <Zap size={16} className="text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">Keku Store</div>
          <div className="text-[11px] text-gray-400">{user.role === "super_admin" || user.role === "owner" ? "Super Admin" : "Admin"}</div>
        </div>
      </div>

      {/* Store pill */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
          <div className="w-6 h-6 rounded-md bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
            <Store size={12} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">Keku Store</div>
            <div className="text-[10px] text-gray-400">kekustore.com</div>
          </div>
          <ChevronDown size={12} className="text-gray-400" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {NAV.map((item) =>
          item.children ? (
            <NavGroup key={item.label} item={item} />
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx("nav-link", isActive && "active")
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          )
        )}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-semibold">{initials}</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-800 dark:text-gray-200">{user.name || "Admin"}</div>
            <div className="text-[10px] text-gray-400 truncate">{user.email || ""}</div>
          </div>
          <button onClick={onLogout} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
