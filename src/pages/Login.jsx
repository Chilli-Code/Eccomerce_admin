import { useState } from "react";
import { Zap } from "../lib/icons.js";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("admin@mystore.com");
  const [pass, setPass] = useState("admin123");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (email === "admin@mystore.com" && pass === "admin123") {
        localStorage.setItem("admin_token", "demo_token_123");
        onLogin();
      } else {
        setErr("Invalid credentials. Try admin@mystore.com / admin123");
      }
      setLoading(false);
    }, 600);
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
          <p className="text-sm text-gray-500 mt-1">Sign in to your admin panel</p>
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
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                value={pass}
                onChange={e => setPass(e.target.value)}
                className="input"
                required
              />
            </div>
            {err && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{err}</p>}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Demo: admin@mystore.com / admin123
        </p>
      </div>
    </div>
  );
}
