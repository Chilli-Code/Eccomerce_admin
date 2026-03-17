import { useState } from "react";
import { Store, Globe, CreditCard, Bell, Shield, Palette, Truck, Languages } from "../../lib/icons.js";

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

const TAB_CONTENT = {
  general: GeneralTab,
  store: GeneralTab,
  payments: PaymentsTab,
  notifications: NotificationsTab,
  security: SecurityTab,
  appearance: AppearanceTab,

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
