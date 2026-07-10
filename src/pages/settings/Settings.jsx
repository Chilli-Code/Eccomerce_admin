import { useState, useEffect } from "react";
import { Store, Globe, CreditCard, Bell, Shield, Palette, Crown, Upload, X } from "../../lib/icons.js";
import clsx from "clsx";
import { api } from "../../lib/api.js";
import { notify } from "../../lib/notifications.js";
import Loader from "../../components/ui/Loader.jsx";
import { applyColor } from "../../lib/utils.js";
import { optimizeImage } from "../../lib/imageOptimizer.js";

const TABS = [
  { id: "general",       label: "General",       icon: Store    },
  { id: "payments",      label: "Pagos",          icon: CreditCard },
  { id: "notifications", label: "Notificaciones", icon: Bell     },
  { id: "security",      label: "Seguridad",      icon: Shield   },
  { id: "appearance",    label: "Apariencia",     icon: Palette  },
  { id: "billing",       label: "Plan & Billing", icon: Crown    },
];

// ── General ──────────────────────────────────────
function GeneralTab({ settings, onSave }) {
  const [form, setForm] = useState({
    storeName:   settings?.storeName   || "",
    storeEmail:  settings?.storeEmail  || "",
    storeUrl:    settings?.storeUrl    || "",
    description: settings?.description || "",
    logoUrl:     settings?.logoUrl     || "",
  });
  const [uploading, setUploading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

const handleLogoUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setUploading(true);
  try {
    const optimized = await optimizeImage(file, {
      maxWidth:  400,
      maxHeight: 400,
      quality:   0.90,
    });
    const formData = new FormData();
    formData.append("image", optimized);
    const res  = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, { method: "POST", body: formData });
    const data = await res.json();
    if (data.success) set("logoUrl", data.data.url);
  } catch { notify.error("Error al subir logo"); }
  finally  { setUploading(false); }
};

  return (
    <div className="space-y-4">
      {/* Logo */}
      <div>
        <label className="label">Logo de la tienda</label>
        <div className="flex items-center gap-4 mt-1.5">
          {form.logoUrl ? (
            <div className="relative">
              <img src={form.logoUrl} className="w-16 h-16 rounded-xl object-contain border border-gray-100 dark:border-gray-800 bg-white p-1" />
              <button onClick={() => set("logoUrl", "")} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                <X size={10} />
              </button>
            </div>
          ) : (
            <label className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center cursor-pointer hover:border-primary-400 transition-colors">
              <input type="file" accept="image/*" className="sr-only" onChange={handleLogoUpload} disabled={uploading} />
              {uploading ? <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /> : <Upload size={18} className="text-gray-300" />}
            </label>
          )}
          <div>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Sube el logo de tu tienda</p>
            <p className="text-xs text-gray-400">Recomendado: formato PNG con fondo transparente, <br/> 
              dimensiones 36x36px o 72x72px <br/> (2x para retina).
              Se mostrará a 36px de alto.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Nombre de la tienda</label>
          <input value={form.storeName} onChange={e => set("storeName", e.target.value)} className="input" placeholder="Mi Tienda" />
        </div>
        <div>
          <label className="label">Email de contacto</label>
          <input type="email" value={form.storeEmail} onChange={e => set("storeEmail", e.target.value)} className="input" placeholder="tienda@mitienda.com" />
        </div>
      </div>

      <div>
        <label className="label">Descripción</label>
        <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} className="input resize-none" placeholder="Descripción de tu tienda…" />
      </div>

      <div>
        <label className="label">URL de la tienda</label>
        <input value={form.storeUrl} onChange={e => set("storeUrl", e.target.value)} className="input" placeholder="https://mitienda.com" />
      </div>

      {/* Info fija Colombia */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Moneda</label>
          <input className="input bg-gray-50 dark:bg-gray-800 cursor-not-allowed" value="COP — Peso Colombiano" disabled />
        </div>
        <div>
          <label className="label">Zona horaria</label>
          <input className="input bg-gray-50 dark:bg-gray-800 cursor-not-allowed" value="America/Bogota (COT)" disabled />
        </div>
      </div>

      <div className="pt-2">
        <button className="btn-primary" onClick={() => onSave(form)}>Guardar cambios</button>
      </div>
    </div>
  );
}

// ── Payments ─────────────────────────────────────
// ── Payments ─────────────────────────────────────
function PaymentsTab({ settings, onSave }) {
  const [stripe,    setStripe]    = useState(settings?.stripeEnabled    ?? false);
  const [paypal,    setPaypal]    = useState(settings?.paypalEnabled    ?? false);
  const [bold,      setBold]      = useState(settings?.boldEnabled      ?? false);
  
  const [stripeKey,    setStripeKey]    = useState(settings?.stripeKey    || "");
  const [stripeSecret, setStripeSecret] = useState(settings?.stripeSecret || "");
  
  const [boldPublicKey,  setBoldPublicKey]  = useState(settings?.boldPublicKey  || "");
  const [boldSecretKey,  setBoldSecretKey]  = useState(settings?.boldSecretKey  || "");
  const [boldApiUrl,     setBoldApiUrl]     = useState(settings?.boldApiUrl     || "https://api.bold.co/v1");
  const [boldTestMode,   setBoldTestMode]   = useState(settings?.boldTestMode   ?? true);

  // Función para probar conexión con Stripe
const testStripeConnection = async () => {
    // Validación local rápida
    if (!stripeSecret) {
        notify.error("La secret key es requerida");
        return;
    }
    
    if (!stripeSecret.startsWith('sk_')) {
        notify.error("La secret key debe comenzar con 'sk_'");
        return;
    }
    
    if (stripeSecret.length < 40) {
        notify.error("La secret key parece incompleta. Verifica que la copiaste completamente.");
        return;
    }
    
    try {
        const result = await api.settings.testStripe({ 
            publishableKey: stripeKey, 
            secretKey: stripeSecret 
        });
        
        if (result.success) {
            notify.success("✅ Conexión con Stripe exitosa");
        } else {
            notify.error(result.error || "Error al conectar con Stripe");
        }
    } catch (err) {
        notify.error("Error al probar conexión");
    }
};
  // Función para probar conexión con BOLD
  const testBoldConnection = async () => {
    if (!boldPublicKey || !boldSecretKey) {
      notify.error("Completa las keys de BOLD primero");
      return;
    }
    try {
      const result = await api.settings.testBold({ 
        publicKey: boldPublicKey, 
        secretKey: boldSecretKey,
        apiUrl: boldApiUrl,
        testMode: boldTestMode
      });
      if (result.success) {
        notify.success("✅ Conexión con BOLD exitosa");
      } else {
        notify.error(result.error || "Error al conectar con BOLD");
      }
    } catch (err) {
      notify.error("Error al probar conexión");
    }
  };

  return (
    <div className="space-y-4">
      {/* Métodos de pago disponibles */}
      {[
        { id: "stripe", label: "Stripe", desc: "Tarjetas crédito/débito, Apple Pay, Google Pay", enabled: stripe, set: setStripe },
        { id: "paypal", label: "PayPal", desc: "Saldo PayPal y tarjetas vinculadas",             enabled: paypal, set: setPaypal },
        { id: "bold",   label: "BOLD Colombia", desc: "Pagos con PSE, Nequi, Daviplata, tarjetas", enabled: bold, set: setBold },
      ].map(p => (
        <div key={p.id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-xl">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{p.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{p.desc}</p>
          </div>
          <button 
            onClick={() => p.set(!p.enabled)} 
            className={clsx("relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0", 
              p.enabled ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"
            )}
          >
            <span className={clsx("inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform", 
              p.enabled ? "translate-x-6" : "translate-x-1"
            )} />
          </button>
        </div>
      ))}

      {/* Stripe Config */}
      {stripe && (
        <div className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Stripe Keys</p>
            <button 
              onClick={testStripeConnection}
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              Probar conexión
            </button>
          </div>
          <div>
            <label className="label text-xs">Publishable key</label>
            <input 
              value={stripeKey} 
              onChange={e => setStripeKey(e.target.value)} 
              className="input font-mono text-xs" 
              placeholder="pk_live_..." 
            />
          </div>
          <div>
            <label className="label text-xs">Secret key</label>
            <input 
              type="password" 
              value={stripeSecret} 
              onChange={e => setStripeSecret(e.target.value)} 
              className="input font-mono text-xs" 
              placeholder="sk_live_..." 
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            🔑 Obtén tus keys en <a href="https://dashboard.stripe.com/apikeys" target="_blank" className="text-primary-600">dashboard.stripe.com</a>
          </p>
        </div>
      )}

      {/* BOLD Colombia Config */}
      {bold && (
        <div className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">BOLD Colombia</p>
            <button 
              onClick={testBoldConnection}
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              Probar conexión
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Modo prueba</span>
            <button 
              onClick={() => setBoldTestMode(!boldTestMode)} 
              className={clsx("relative inline-flex h-5 w-9 items-center rounded-full transition-colors", 
                boldTestMode ? "bg-amber-500" : "bg-gray-300 dark:bg-gray-600"
              )}
            >
              <span className={clsx("inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-md transition-transform", 
                boldTestMode ? "translate-x-4" : "translate-x-1"
              )} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-xs">Public Key</label>
              <input 
                value={boldPublicKey} 
                onChange={e => setBoldPublicKey(e.target.value)} 
                className="input font-mono text-xs" 
                placeholder={boldTestMode ? "pk_test_..." : "pk_live_..."} 
              />
            </div>
            <div>
              <label className="label text-xs">Secret Key</label>
              <input 
                type="password" 
                value={boldSecretKey} 
                onChange={e => setBoldSecretKey(e.target.value)} 
                className="input font-mono text-xs" 
                placeholder={boldTestMode ? "sk_test_..." : "sk_live_..."} 
              />
            </div>
          </div>
          
          <div>
            <label className="label text-xs">API URL</label>
            <input 
              value={boldApiUrl} 
              onChange={e => setBoldApiUrl(e.target.value)} 
              className="input font-mono text-xs" 
              placeholder="https://api.bold.co/v1" 
            />
          </div>
          
          <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-xs text-amber-700 dark:text-amber-300">
              💡 BOLD permite pagos con PSE (transferencia bancaria), Nequi, Daviplata, 
              tarjetas de crédito/débito (Visa, Mastercard, American Express) y efectivo en puntos.
            </p>
          </div>
          
          <p className="text-xs text-gray-400 mt-1">
            🔑 Obtén tus keys en <a href="https://dashboard.bold.co" target="_blank" className="text-primary-600">dashboard.bold.co</a>
          </p>
        </div>
      )}

      <button 
        className="btn-primary" 
        onClick={() => onSave({ 
          stripeEnabled: stripe, 
          paypalEnabled: paypal, 
          boldEnabled: bold,
          stripeKey, 
          stripeSecret,
          boldPublicKey,
          boldSecretKey,
          boldApiUrl,
          boldTestMode,
        })}
      >
        Guardar cambios
      </button>
    </div>
  );
}

// ── Notifications ────────────────────────────────
function NotificationsTab({ settings, onSave }) {
  const ALL = [
    { key: "new_order",       label: "Nueva orden recibida"       },
    { key: "order_status",    label: "Cambio de estado de orden"  },
    { key: "low_stock",       label: "Alerta de stock bajo"       },
    { key: "new_customer",    label: "Nuevo cliente registrado"   },
    { key: "payment_failed",  label: "Pago fallido"               },
  ];
  const [active, setActive] = useState(settings?.notifications || ALL.map(n => n.key));
  const toggle = (key) => setActive(a => a.includes(key) ? a.filter(k => k !== key) : [...a, key]);

  return (
    <div className="space-y-3">
      {ALL.map(item => (
        <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800">
          <p className="text-sm text-gray-700 dark:text-gray-300">{item.label}</p>
          <input type="checkbox" checked={active.includes(item.key)} onChange={() => toggle(item.key)} className="w-4 h-4 accent-primary-600 cursor-pointer" />
        </div>
      ))}
      <div className="pt-2">
        <button className="btn-primary" onClick={() => onSave({ notifications: active })}>Guardar cambios</button>
      </div>
    </div>
  );
}

// ── Security ─────────────────────────────────────
function SecurityTab() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.current || !form.next) return notify.error("Completa todos los campos");
    if (form.next !== form.confirm) return notify.error("Las contraseñas no coinciden");
    try {
      await api.auth.changePassword?.(form.current, form.next);
      notify.passwordChanged();
      setForm({ current: "", next: "", confirm: "" });
    } catch (err) {
      notify.error(err.message || "Error al cambiar contraseña");
    }
  };

  return (
    <div className="space-y-4">
      <div><label className="label">Contraseña actual</label><input type="password" value={form.current} onChange={e => set("current", e.target.value)} className="input" /></div>
      <div><label className="label">Nueva contraseña</label><input type="password" value={form.next} onChange={e => set("next", e.target.value)} className="input" /></div>
      <div><label className="label">Confirmar contraseña</label><input type="password" value={form.confirm} onChange={e => set("confirm", e.target.value)} className="input" /></div>
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
        <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Autenticación de dos factores</p>
        <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">Próximamente disponible.</p>
      </div>
      <button className="btn-primary" onClick={handleSave}>Cambiar contraseña</button>
    </div>
  );
}

// ── Appearance ───────────────────────────────────
function AppearanceTab() {
  const [color, setColor] = useState(() => localStorage.getItem("primary_color") || "#4f46e5");

const handleColor = (c) => {
  setColor(c);
  localStorage.setItem("primary_color", c);
  applyColor(c);
  notify.saved();
};

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Color primario</label>
        <p className="text-xs text-gray-400 mb-2">Afecta botones, links y acentos del panel</p>
        <div className="flex gap-2 mt-1.5">
          {["#4f46e5","#8b5cf6","#ec4899","#10b981","#f59e0b","#ef4444"].map(c => (
            <button
              key={c}
              onClick={() => handleColor(c)}
              className={clsx("w-8 h-8 rounded-lg border-2 hover:scale-110 transition-transform", color === c ? "border-gray-900 dark:border-white" : "border-transparent")}
              style={{ background: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Billing ──────────────────────────────────────
function BillingTab() {
  const currentPlan = "pro";
  const nextBilling = "2026-04-18";
  const daysLeft    = Math.ceil((new Date(nextBilling) - new Date()) / (1000 * 60 * 60 * 24));

  const PLANS = [
    { id: "starter",    name: "Starter",    price: 29,  badge: null,           features: ["Hasta 100 productos","1 usuario admin","Reportes básicos","Soporte por email"] },
    { id: "pro",        name: "Pro",        price: 79,  badge: "Tu plan actual",features: ["Hasta 1,000 productos","3 usuarios admin","Reportes avanzados","Soporte prioritario","Editor CMS","Cupones"] },
    { id: "enterprise", name: "Enterprise", price: 199, badge: "Recomendado",   features: ["Productos ilimitados","Usuarios ilimitados","Reportes + exportación","Soporte 24/7","API completo","Multi-tienda"] },
  ];

  const INVOICES = [
    { id: "INV-001", date: "2026-03-18", amount: 79 },
    { id: "INV-002", date: "2026-02-18", amount: 79 },
    { id: "INV-003", date: "2026-01-18", amount: 79 },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 p-5 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80 mb-1">Plan actual</p>
            <h3 className="text-2xl font-bold mb-1">Pro — $79/mes</h3>
            <p className="text-sm opacity-80">Próximo cobro el {new Date(nextBilling + "T12:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
          <div className="bg-white/20 rounded-xl px-4 py-3 text-center">
            <p className="text-3xl font-bold">{daysLeft}</p>
            <p className="text-xs opacity-80">días restantes</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs opacity-70 mb-1">
            <span>Ciclo actual</span>
            <span>{30 - daysLeft} de 30 días</span>
          </div>
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${((30 - daysLeft) / 30) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {PLANS.map(plan => (
          <div key={plan.id} className={clsx("rounded-xl border-2 p-5 relative", plan.id === currentPlan ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10" : "border-gray-200 dark:border-gray-700")}>
            {plan.badge && (
              <span className={clsx("absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-semibold px-3 py-1 rounded-full whitespace-nowrap", plan.id === currentPlan ? "bg-primary-600 text-white" : "bg-purple-600 text-white")}>
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
                  <span className="text-emerald-500 flex-shrink-0">✓</span>{f}
                </li>
              ))}
            </ul>
            <button disabled={plan.id === currentPlan} className={clsx("w-full py-2 rounded-lg text-sm font-medium", plan.id === currentPlan ? "bg-primary-600 text-white cursor-default" : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800")}>
              {plan.id === currentPlan ? "Plan actual" : "Cambiar plan"}
            </button>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Historial de pagos</h3>
        <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
          <table className="table-base">
            <thead><tr><th>Factura</th><th>Fecha</th><th>Monto</th><th>Estado</th></tr></thead>
            <tbody>
              {INVOICES.map(inv => (
                <tr key={inv.id}>
                  <td className="font-mono text-xs text-gray-500">{inv.id}</td>
                  <td className="text-sm text-gray-500">{new Date(inv.date + "T12:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="font-semibold">${inv.amount}</td>
                  <td><span className="badge badge-green">Pagado</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────
export default function Settings() {
  const [active,   setActive]   = useState("general");
  const [settings, setSettings] = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.settings.get()
      .then(setSettings)
      .catch(() => notify.error("Error al cargar ajustes"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (data) => {
    try {
      const updated = await api.settings.update(data);
      setSettings(updated);
      notify.settingsSaved();
    } catch (err) {
      notify.error(err.message || "Error al guardar");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Loader size={80} />
      <p className="text-sm text-gray-400">Cargando ajustes…</p>
    </div>
  );

  const TAB_CONTENT = {
    general:       () => <GeneralTab       settings={settings} onSave={handleSave} />,
    payments:      () => <PaymentsTab      settings={settings} onSave={handleSave} />,
    notifications: () => <NotificationsTab settings={settings} onSave={handleSave} />,
    security:      () => <SecurityTab />,
    appearance:    () => <AppearanceTab />,
    billing:       () => <BillingTab />,
  };

  const Content = TAB_CONTENT[active] || TAB_CONTENT.general;

  return (
    <div className="space-y-5">
      <div className="page-header">
        <h1 className="page-title">Ajustes</h1>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <div className="card p-2">
          <nav className="space-y-0.5">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActive(t.id)} className={clsx("nav-link w-full", active === t.id && "active")}>
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="col-span-3 card p-6">
          <Content />
        </div>
      </div>
    </div>
  );
}