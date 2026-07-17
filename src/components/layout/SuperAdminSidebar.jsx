import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package, Store, Settings, LogOut,
  Zap, ChevronDown, Shield, BarChart2, Users, CreditCard, Truck,
} from "../../lib/icons.js";
import { useState } from "react";
import clsx from "clsx";

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/super-admin/dashboard" },
  { label: "Tiendas", icon: Store, to: "/super-admin/stores" },
  { label: "Widgets", icon: Package, to: "/super-admin/widgets" },
  { label: "Planes", icon: CreditCard, to: "/super-admin/plans" },
  { label: "Usuarios Admin", icon: Users, to: "/super-admin/admins" },
  {
    label: "Ajustes", icon: Settings,
    children: [
      { label: "Generales", icon: Settings, to: "/super-admin/settings" },
      { label: "Transportistas", icon: Truck, to: "/super-admin/transportistas" },
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
        className={clsx("nav-link w-full justify-between", isActive && "text-gray-900 dark:text-white")}
      >
        <span className="flex items-center gap-3">
          <item.icon size={17} />
          {item.label}
        </span>
        <ChevronDown size={14} className={clsx("transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (
        <div className="ml-6 mt-0.5 space-y-0.5 border-l border-gray-100 dark:border-gray-800 pl-3">
          {item.children.map((c) => (
            <NavLink key={c.to} to={c.to} className={({ isActive }) => clsx("nav-link text-[13px]", isActive && "active")}>
              {c.icon && <c.icon size={14} />}
              {c.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SuperAdminSidebar({ open, onLogout }) {
  const user = JSON.parse(localStorage.getItem("admin_user") || "{}");
  const initials = user.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "A";

  return (
    <aside className={clsx(
      "fixed left-0 top-0 h-dvh flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-transform duration-300 z-30",
      open ? "translate-x-0" : "-translate-x-full"
    )} style={{ width: "var(--sidebar-width)" }}>
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
          <Shield size={16} className="text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">Keku Store</div>
          <div className="text-[11px] text-purple-500 font-semibold">Super Admin</div>
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
          <Shield size={12} className="text-purple-600 dark:text-purple-400" />
          <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">Panel de control</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {NAV.map((item) =>
          item.children ? <NavGroup key={item.label} item={item} /> : (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => clsx("nav-link", isActive && "active")}>
              <item.icon size={17} />
              {item.label}
            </NavLink>
          )
        )}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-semibold">{initials}</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-800 dark:text-gray-200">{user.name || "Super Admin"}</div>
            <div className="text-[10px] text-gray-400 truncate">{user.email || ""}</div>
          </div>
          <button onClick={onLogout} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
