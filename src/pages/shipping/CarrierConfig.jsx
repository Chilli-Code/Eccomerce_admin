import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, CheckCircle, ExternalLink } from "../../lib/icons.js";
import { useNavigate, useParams } from "react-router-dom";
import { carriers } from "../../data/mock.js";
import clsx from "clsx";

const CARRIER_FIELDS = {
  servientrega: {
    docs: "https://developers.servientrega.com",
    fields: [
      { key: "api_user", label: "Usuario API", type: "text", placeholder: "usuario@empresa.com" },
      { key: "api_password", label: "Contraseña API", type: "password", placeholder: "••••••••" },
      { key: "account_number", label: "Número de cuenta", type: "text", placeholder: "SVE-000000" },
      { key: "cost_center", label: "Centro de costo", type: "text", placeholder: "001" },
      { key: "sandbox", label: "Modo sandbox (pruebas)", type: "toggle" },
    ],
  },
  coordinadora: {
    docs: "https://api.coordinadora.com/docs",
    fields: [
      { key: "api_key", label: "API Key", type: "password", placeholder: "ck_live_..." },
      { key: "api_secret", label: "API Secret", type: "password", placeholder: "cs_live_..." },
      { key: "account_id", label: "ID de cuenta", type: "text", placeholder: "CRD-000000" },
      { key: "sandbox", label: "Modo sandbox (pruebas)", type: "toggle" },
    ],
  },
  enviame: {
    docs: "https://developers.enviame.io",
    fields: [
      { key: "api_key", label: "API Key", type: "password", placeholder: "em_live_..." },
      { key: "company_id", label: "Company ID", type: "text", placeholder: "12345" },
      { key: "sandbox", label: "Modo sandbox (pruebas)", type: "toggle" },
    ],
  },
  tcc: {
    docs: "https://tcc.com.co/developers",
    fields: [
      { key: "username", label: "Usuario", type: "text", placeholder: "usuario_tcc" },
      { key: "password", label: "Contraseña", type: "password", placeholder: "••••••••" },
      { key: "nit", label: "NIT empresa", type: "text", placeholder: "900000000-1" },
      { key: "sandbox", label: "Modo sandbox (pruebas)", type: "toggle" },
    ],
  },
  "472": {
    docs: "https://4-72.com.co/api",
    fields: [
      { key: "api_key", label: "API Key", type: "password", placeholder: "472_live_..." },
      { key: "client_code", label: "Código de cliente", type: "text", placeholder: "CLI-0000" },
      { key: "sandbox", label: "Modo sandbox (pruebas)", type: "toggle" },
    ],
  },
  fedex: {
    docs: "https://developer.fedex.com",
    fields: [
      { key: "api_key", label: "API Key", type: "password", placeholder: "fedex_api_..." },
      { key: "secret_key", label: "Secret Key", type: "password", placeholder: "fedex_secret_..." },
      { key: "account_number", label: "Account Number", type: "text", placeholder: "000000000" },
      { key: "meter_number", label: "Meter Number", type: "text", placeholder: "000000000" },
      { key: "sandbox", label: "Modo sandbox (pruebas)", type: "toggle" },
    ],
  },
  ups: {
    docs: "https://developer.ups.com",
    fields: [
      { key: "client_id", label: "Client ID", type: "text", placeholder: "ups_client_..." },
      { key: "client_secret", label: "Client Secret", type: "password", placeholder: "ups_secret_..." },
      { key: "account_number", label: "Account Number", type: "text", placeholder: "XXXXXX" },
      { key: "sandbox", label: "Modo sandbox (pruebas)", type: "toggle" },
    ],
  },
};

function PasswordInput({ placeholder, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input pr-10 font-mono text-sm"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

export default function CarrierConfig() {
  const { code } = useParams();
  const navigate = useNavigate();
  const carrier = carriers.find(c => c.code === code) || carriers[0];
  const config = CARRIER_FIELDS[code] || CARRIER_FIELDS.servientrega;

  const [form, setForm] = useState(() =>
    Object.fromEntries(config.fields.map(f => [f.key, f.type === "toggle" ? false : ""]))
  );
  const [tested, setTested] = useState(null);
  const [testing, setTesting] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const testConnection = () => {
    setTesting(true);
    setTested(null);
    setTimeout(() => {
      setTested(true); // simula éxito
      setTesting(false);
    }, 1500);
  };

  return (
    <div className="max-w-10xl space-y-5">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/settings/transportation")} className="btn-ghost p-2 rounded-lg">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <img
              src={carrier.logo}
              alt={carrier.name}
              className="w-10 h-10 object-contain rounded-lg bg-white p-1 border border-gray-100 dark:border-gray-800"
              onError={e => { e.target.style.display = "none"; }}
            />
            <div>
              <h1 className="page-title">{carrier.name}</h1>
              <p className="text-sm text-gray-400 mt-0.5">Configurar integración · {carrier.coverage}</p>
            </div>
          </div>
        </div>
        <a
          href={config.docs}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary gap-2 text-xs"
        >
          <ExternalLink size={13} /> Ver documentación
        </a>
      </div>

      {/* Status banner */}
      <div className={clsx(
        "rounded-xl px-4 py-3 flex items-center gap-3 text-sm",
        carrier.active
          ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
          : "bg-gray-50 dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700"
      )}>
        <div className={clsx("w-2 h-2 rounded-full flex-shrink-0", carrier.active ? "bg-emerald-500" : "bg-gray-400")} />
        {carrier.active ? `${carrier.name} está activa y conectada` : `${carrier.name} está desactivada`}
      </div>

      {/* Form */}
      <div className="card p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Credenciales de acceso</h2>
        <p className="text-xs text-gray-400 -mt-3">
          Obtén estas credenciales desde el portal de desarrolladores de {carrier.name}.
          Nunca compartas estas claves.
        </p>

        {config.fields.map(field => (
          <div key={field.key}>
            {field.type === "toggle" ? (
              <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{field.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Usa el entorno de pruebas — no se generarán envíos reales
                  </p>
                </div>
                <button
                  onClick={() => set(field.key, !form[field.key])}
                  className={clsx(
                    "w-10 h-[22px] rounded-full transition-colors relative flex-shrink-0",
                    form[field.key] ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"
                  )}
                >
                  <span className={clsx(
                    "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                    form[field.key] ? "translate-x-5" : "translate-x-0.5"
                  )} />
                </button>
              </div>
            ) : (
              <div>
                <label className="label">{field.label}</label>
                {field.type === "password" ? (
                  <PasswordInput
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={e => set(field.key, e.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    value={form[field.key]}
                    onChange={e => set(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="input"
                  />
                )}
              </div>
            )}
          </div>
        ))}

        {/* Test connection result */}
        {tested === true && (
          <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <CheckCircle size={16} /> Conexión exitosa con {carrier.name}
          </div>
        )}
        {tested === false && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg border border-red-200 dark:border-red-800">
            No se pudo conectar. Verifica las credenciales.
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={testConnection}
            disabled={testing}
            className="btn-secondary gap-2 disabled:opacity-60"
          >
            {testing ? "Probando…" : "Probar conexión"}
          </button>
          <button className="btn-primary">Guardar configuración</button>
        </div>
      </div>
    </div>
  );
}