import { useState } from "react";
import { Plus, Ticket, Copy } from "../../lib/icons.js";
import { allCoupons } from "../../data/mock.js";
import { StatusBadge, Modal } from "../../components/ui/index.jsx";

export default function Coupons() {
  const [coupons, setCoupons] = useState(allCoupons);
  const [modal, setModal] = useState(false);
  const [copied, setCopied] = useState(null);
  const [form, setForm] = useState({ code: "", type: "percent", value: "", limit: "", expires: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const copy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  };

  const save = () => {
    if (!form.code.trim()) return;
    setCoupons(c => [...c, { ...form, id: Date.now(), used: 0, status: "active", value: Number(form.value) }]);
    setForm({ code: "", type: "percent", value: "", limit: "", expires: "" });
    setModal(false);
  };

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Coupons</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage discount codes</p>
        </div>
        <button className="btn-primary" onClick={() => setModal(true)}>
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-2">
        {[
          { label: "Active coupons", value: coupons.filter(c => c.status === "active").length },
          { label: "Total used", value: coupons.reduce((s, c) => s + c.used, 0) },
          { label: "Expired", value: coupons.filter(c => c.status === "expired").length },
          { label: "Unlimited", value: coupons.filter(c => !c.limit).length },
        ].map(s => (
          <div key={s.label} className="card px-5 py-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="table-wrap overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Used / Limit</th>
              <th>Expires</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.id}>
                <td>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-sm text-gray-800 dark:text-gray-100">{c.code}</span>
                    <button onClick={() => copy(c.code)} className="text-gray-300 hover:text-primary-500 transition-colors">
                      {copied === c.code ? <span className="text-xs text-emerald-500">Copied!</span> : <Copy size={12} />}
                    </button>
                  </div>
                </td>
                <td className="capitalize text-sm text-gray-500">{c.type}</td>
                <td className="font-semibold">{c.type === "percent" ? `${c.value}%` : `$${c.value}`}</td>
                <td className="text-sm">{c.used} / {c.limit ?? "∞"}</td>
                <td className="text-xs text-gray-400">{c.expires}</td>
                <td><StatusBadge status={c.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Create Coupon"
        footer={<>
          <button className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
          <button className="btn-primary" onClick={save}>Create</button>
        </>}
      >
        <div className="space-y-3">
          <div>
            <label className="label">Coupon code *</label>
            <input value={form.code} onChange={e => set("code", e.target.value.toUpperCase())} className="input font-mono uppercase" placeholder="SUMMER20" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Type</label>
              <select value={form.type} onChange={e => set("type", e.target.value)} className="input">
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed ($)</option>
              </select>
            </div>
            <div>
              <label className="label">Value *</label>
              <input value={form.value} onChange={e => set("value", e.target.value)} className="input" type="number" placeholder={form.type === "percent" ? "20" : "15"} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Usage limit</label>
              <input value={form.limit} onChange={e => set("limit", e.target.value)} className="input" type="number" placeholder="Unlimited" />
            </div>
            <div>
              <label className="label">Expires</label>
              <input value={form.expires} onChange={e => set("expires", e.target.value)} className="input" type="date" />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
