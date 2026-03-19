import { useState } from "react";
import { Store, Globe, CreditCard, Bell, Shield, Palette, Truck, Languages, Crown } from "../../lib/icons.js";

import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { carriers } from "../../data/mock.js";


const TABS = [
  { id: "general", label: "General", icon: Store },
  { id: "store", label: "Store", icon: Globe },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "billing", label: "Plan & Billing", icon: Crown },

];




function GeneralTab() {
  const [active, setActive] = useState("general");
  const [lang, setLang] = useState("es");

  const languages = [
    { code: "es", label: "Español", flag: "🇨🇴", region: "Colombia" },
    { code: "en", label: "English", flag: "🇺🇸", region: "United States" },
    { code: "pt", label: "Português", flag: "🇧🇷", region: "Brasil" },
    { code: "fr", label: "Français", flag: "🇫🇷", region: "France" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label">Store name</label><input className="input" defaultValue="My Store" /></div>
        <div><label className="label">Store email</label><input className="input" defaultValue="store@mystore.com" /></div>
      </div>
      <div><label className="label">Store description</label><textarea rows={3} className="input resize-none" defaultValue="The best store in town." /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label">Currency</label>
          <select className="input"><option>USD — US Dollar</option><option>COP — Colombian Peso</option><option>EUR — Euro</option></select>
        </div>
        <div><label className="label">Timezone</label>
          <select className="input"><option>America/Bogota (COT)</option><option>America/New_York</option><option>Europe/London</option></select>
        </div>
      </div>
      <div><label className="label">Store URL</label><input className="input" defaultValue="https://mystore.com" /></div>
      <div>
        <label className="label">Idioma del panel</label>
        <select
          value={lang}
          onChange={e => setLang(e.target.value)}
          className="input w-64"
        >
          {languages.map(l => (
            <option key={l.code} value={l.code}>
              {l.flag} {l.label} — {l.region}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-400 mt-1.5">
          ⚠️ Traducción pendiente de implementación
        </p>
      </div>
    </div>
  );
}

function PaymentsTab() {
  const [stripe, setStripe] = useState(true);
  const [paypal, setPaypal] = useState(false);
  return (
    <div className="space-y-4">
      {[
        { id: "stripe", label: "Stripe", desc: "Credit/debit cards, Apple Pay, Google Pay", enabled: stripe, set: setStripe },
        { id: "paypal", label: "PayPal", desc: "PayPal balance and linked cards", enabled: paypal, set: setPaypal },
      ].map(p => (
        <div key={p.id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-xl">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{p.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{p.desc}</p>
          </div>
<button
  onClick={() => p.set(!p.enabled)}
  className={clsx(
    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0",
    p.enabled ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"
  )}
>
  <span
    className={clsx(
      "inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200",
      p.enabled ? "translate-x-6" : "translate-x-1"
    )}
  />
</button>
        </div>
      ))}
      <div className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">Stripe Keys</p>
        <div className="space-y-2">
          <div><label className="label text-xs">Publishable key</label><input className="input font-mono text-xs" placeholder="pk_live_..." /></div>
          <div><label className="label text-xs">Secret key</label><input type="password" className="input font-mono text-xs" placeholder="sk_live_..." /></div>
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const items = ["New order received", "Order status changed", "Low stock alert", "New customer registered", "Payment failed"];
  return (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800">
          <p className="text-sm text-gray-700 dark:text-gray-300">{item}</p>
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary-600 cursor-pointer" />
        </div>
      ))}
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-4">
      <div><label className="label">Current password</label><input type="password" className="input" /></div>
      <div><label className="label">New password</label><input type="password" className="input" /></div>
      <div><label className="label">Confirm new password</label><input type="password" className="input" /></div>
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
        <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Two-factor authentication</p>
        <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">Enable 2FA for extra security on your admin account.</p>
        <button className="btn text-xs mt-2 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/60 px-3 py-1.5">Enable 2FA</button>
      </div>
    </div>
  );
}

function AppearanceTab() {
  return (
    <div className="space-y-4">
      <div>
        <label className="label">Primary color</label>
        <div className="flex gap-2 mt-1.5">
          {["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#ef4444"].map(c => (
            <button key={c} className="w-8 h-8 rounded-lg border-2 border-transparent hover:scale-110 transition-transform" style={{ background: c }} />
          ))}
        </div>
      </div>
      <div>
        <label className="label">Store logo</label>
        <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
          <p className="text-sm text-gray-400">Click to upload logo</p>
          <p className="text-xs text-gray-300 mt-0.5">PNG, SVG — max 2MB</p>
        </div>
      </div>
      <div>
        <label className="label">Favicon</label>
        <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
          <p className="text-sm text-gray-400">Click to upload favicon</p>
          <p className="text-xs text-gray-300 mt-0.5">ICO, PNG 32×32</p>
        </div>
      </div>
    </div>
  );
}

function BillingTab() {
  const currentPlan = "pro"; // vendría del backend
  const nextBilling = "2026-04-18";
  const daysLeft = Math.ceil((new Date(nextBilling) - new Date()) / (1000 * 60 * 60 * 24));

  const PLANS = [
    {
      id: "starter",
      name: "Starter",
      price: 29,
      color: "border-gray-200 dark:border-gray-700",
      badge: null,
      features: [
        "Hasta 100 productos",
        "1 usuario admin",
        "Reportes básicos",
        "Soporte por email",
        "Dominio personalizado",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: 79,
      color: "border-primary-500",
      badge: "Tu plan actual",
      features: [
        "Hasta 1,000 productos",
        "3 usuarios admin",
        "Reportes avanzados",
        "Soporte prioritario",
        "Dominio personalizado",
        "Editor de páginas CMS",
        "Cupones y descuentos",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 199,
      color: "border-purple-400",
      badge: "Recomendado",
      features: [
        "Productos ilimitados",
        "Usuarios ilimitados",
        "Reportes + exportación",
        "Soporte 24/7",
        "Dominio personalizado",
        "Editor de páginas CMS",
        "Cupones y descuentos",
        "API acceso completo",
        "Multi-tienda",
        "Manager de cuenta dedicado",
      ],
    },
  ];

  const INVOICES = [
    { id: "INV-001", date: "2026-03-18", amount: 79, status: "paid" },
    { id: "INV-002", date: "2026-02-18", amount: 79, status: "paid" },
    { id: "INV-003", date: "2026-01-18", amount: 79, status: "paid" },
    { id: "INV-004", date: "2025-12-18", amount: 29, status: "paid" },
  ];

  return (
    <div className="space-y-6">

      {/* Banner plan actual + próximo cobro */}
      <div className="rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 p-5 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80 mb-1">Plan actual</p>
            <h3 className="text-2xl font-bold mb-1">Pro — $79/mes</h3>
            <p className="text-sm opacity-80">Próximo cobro el {new Date(nextBilling + "T12:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 rounded-xl px-4 py-3 text-center">
              <p className="text-3xl font-bold">{daysLeft}</p>
              <p className="text-xs opacity-80">días restantes</p>
            </div>
          </div>
        </div>

        {/* Barra de progreso del ciclo */}
        <div className="mt-4">
          <div className="flex justify-between text-xs opacity-70 mb-1">
            <span>Ciclo actual (Mar 18 → Abr 18)</span>
            <span>{30 - daysLeft} de 30 días</span>
          </div>
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${((30 - daysLeft) / 30) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Planes */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Planes disponibles</h3>
        <div className="grid grid-cols-3 gap-4">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={clsx(
                "rounded-xl border-2 p-5 relative transition-all",
                plan.id === currentPlan
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              )}
            >
              {plan.badge && (
                <span className={clsx(
                  "absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-semibold px-3 py-1 rounded-full whitespace-nowrap",
                  plan.id === currentPlan
                    ? "bg-primary-600 text-white"
                    : "bg-purple-600 text-white"
                )}>
                  {plan.badge}
                </span>
              )}

              <p className="text-sm font-semibold text-gray-800 dark:text-white mb-1">{plan.name}</p>
              <div className="flex items-end gap-1 mb-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
                <span className="text-xs text-gray-400 mb-1">/mes</span>
              </div>

              <ul className="space-y-2 mb-5">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={clsx(
                  "w-full py-2 rounded-lg text-sm font-medium transition-colors",
                  plan.id === currentPlan
                    ? "bg-primary-600 text-white cursor-default"
                    : plan.id === "enterprise"
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
                disabled={plan.id === currentPlan}
              >
                {plan.id === currentPlan ? "Plan actual" : plan.id === "enterprise" ? "Contactar ventas" : "Cambiar plan"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Método de pago */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Método de pago</h3>
        <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 bg-gray-800 rounded-md flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">VISA</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Visa terminada en 4242</p>
              <p className="text-xs text-gray-400">Vence 12/2028</p>
            </div>
          </div>
          <button className="btn-secondary text-xs py-1.5">Cambiar tarjeta</button>
        </div>
      </div>

      {/* Historial de facturas */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Historial de pagos</h3>
        <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
          <table className="table-base">
            <thead>
              <tr>
                <th>Factura</th>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {INVOICES.map(inv => (
                <tr key={inv.id}>
                  <td className="font-mono text-xs text-gray-500">{inv.id}</td>
                  <td className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(inv.date + "T12:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="font-semibold">${inv.amount}</td>
                  <td><span className="badge badge-green">Pagado</span></td>
                  <td>
                    <button className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                      Descargar PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

const TAB_CONTENT = {
  general: GeneralTab,
  store: GeneralTab,
  payments: PaymentsTab,
  notifications: NotificationsTab,
  security: SecurityTab,
  appearance: AppearanceTab,
  billing: BillingTab,

};

export default function Settings() {
  const [active, setActive] = useState("general");
  const Content = TAB_CONTENT[active] || GeneralTab;

  return (
    <div className="space-y-5">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <button className="btn-primary">Save Changes</button>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {/* Sidebar tabs */}
        <div className="card p-2">
          <nav className="space-y-0.5">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={clsx("nav-link w-full", active === t.id && "active")}
              >
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="col-span-3 card p-6">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-5 capitalize">{active} Settings</h2>
          <Content />
        </div>
      </div>

    </div>
  );
}
