import { useState } from "react";
import { Zap, Eye, EyeOff } from "../lib/icons.js";
import { api } from "../lib/api.js";

export default function Login({ onLogin }) {
  const [email,   setEmail]   = useState("jorge@mystore.com");
  const [pass,    setPass]    = useState("admin123");
  const [err,     setErr]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass,setShowPass]= useState(false);

const handle = async (e) => {
  e.preventDefault();
  setErr("");
  setLoading(true);
  try {
    const data = await api.auth.login(email, pass);
    localStorage.setItem("admin_token", data.token);
    localStorage.setItem("admin_user",  JSON.stringify(data.user));
    onLogin(data.user);
  } catch (err) {
    setErr(err.message || "Credenciales incorrectas");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center mb-3 shadow-lg shadow-primary-500/20">
            <Zap size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">EcomAdmin</h1>
          <p className="text-sm text-gray-500 mt-1">Inicia sesión en tu panel</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                placeholder="jorge@mystore.com"
                required
              />
            </div>
            <div>
              <label className="label">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {err && (
              <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                {err}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5 disabled:opacity-60"
            >
              {loading ? "Iniciando sesión…" : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}