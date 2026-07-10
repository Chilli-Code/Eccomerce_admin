import { useState, useEffect } from "react";
import { Plus, Copy, Pencil, Trash2 } from "lucide-react";
import { StatusBadge } from "../../components/ui/index.jsx";
import { api } from "../../lib/api.js";
import { notify } from "../../lib/notifications.js";
import CouponStats from "./CouponStats.jsx";
import CouponModal from "./CouponModal.jsx";
import ConfirmModal from "./ConfirmModal.jsx";
import Loader from "../../components/ui/Loader.jsx";

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [copied, setCopied] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ 
    code: "", type: "percentage", value: "", usageLimit: "", startDate: "", endDate: "",
    minPurchase: "", appliesTo: "all", categoryId: "", productId: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [couponsData, categoriesData, productsData] = await Promise.all([
        api.coupons.list(),
        api.categories.list(),
        api.products.list({ limit: 100 })
      ]);
      setCoupons(couponsData);
      setCategories(categoriesData);
      setProducts(productsData?.items || []);
    } catch (err) {
      notify.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ code: "", type: "percentage", value: "", usageLimit: "", startDate: "", endDate: "", minPurchase: "", appliesTo: "all", categoryId: "", productId: "" });
    setModalOpen(true);
  };

  const openEdit = (coupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      usageLimit: coupon.usageLimit || "",
      startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split("T")[0] : "",
      endDate: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split("T")[0] : "",
      minPurchase: coupon.minPurchase || "",
      appliesTo: coupon.appliesTo || "all",
      categoryId: coupon.appliesToId || "",
      productId: coupon.appliesToId || "",
    });
    setModalOpen(true);
  };

  const save = async () => {
    if (!form.code.trim() || !form.value) return notify.error("Código y valor son obligatorios");
    
    try {
      const payload = {
        code: form.code.toUpperCase(),
        type: form.type,
        value: form.value,
        usageLimit: form.usageLimit ? parseInt(form.usageLimit) : undefined,
        startDate: form.startDate || undefined,
        expiresAt: form.endDate || undefined,
        minPurchase: form.minPurchase ? parseFloat(form.minPurchase) : undefined,
        appliesTo: form.appliesTo,
        appliesToId: form.appliesTo !== "all" ? (form.appliesTo === "category" ? form.categoryId : form.productId) : undefined,
      };
      
      if (editingId) {
        const updated = await api.coupons.update(editingId, payload);
        setCoupons(prev => prev.map(c => c.id === updated.id ? updated : c));
        notify.productSaved("Cupón actualizado");
      } else {
        const newCoupon = await api.coupons.create(payload);
        setCoupons(prev => [...prev, newCoupon]);
        notify.productSaved("Cupón creado");
      }
      
      setModalOpen(false);
    } catch (err) {
      notify.error(err.message || "Error al guardar");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const deleteCoupon = async () => {
    try {
      await api.coupons.delete(deleteId);
      setCoupons(prev => prev.filter(c => c.id !== deleteId));
      notify.productSaved("Cupón eliminado");
    } catch (err) {
      notify.error("Error al eliminar");
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const stats = {
    active: coupons.filter(c => c.status === "active").length,
    used: coupons.reduce((s, c) => s + (c.usedCount || 0), 0),
    expired: coupons.filter(c => c.status === "expired").length,
    unlimited: coupons.filter(c => !c.usageLimit).length,
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Loader size={80} />
      <p className="text-sm text-gray-400">Cargando Cupones</p>
    </div>
  );
  return (
    <div className="space-y-5">
      <div className="page-header">
        <div><h1 className="page-title">Coupons</h1><p className="text-sm text-gray-400">Manage discount codes</p></div>
        <button className="btn-primary" onClick={openCreate}><Plus size={16} /> Create Coupon</button>
      </div>

      <CouponStats stats={stats} />

      <div className="table-wrap overflow-x-auto">
        <table className="table-base">
          <thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Used / Limit</th><th>Valid from - to</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.id}>
                <td><div className="flex items-center gap-2"><span className="font-mono font-semibold text-sm">{c.code}</span><button onClick={() => copyCode(c.code)}>{copied === c.code ? <span className="text-xs text-emerald-500">Copied!</span> : <Copy size={12} />}</button></div></td>
                <td className="capitalize text-sm">{c.type === "percentage" ? "percentage" : "fixed"}</td>
                <td className="font-semibold">{c.type === "percentage" ? `${c.value}%` : `$${c.value}`}</td>
                <td className="text-sm">{c.usedCount || 0} / {c.usageLimit ?? "∞"}</td>
                <td className="text-xs text-gray-400">{c.startDate ? new Date(c.startDate).toLocaleDateString() : "Always"} - {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "Never"}</td>
                <td><StatusBadge status={c.status} /></td>
                <td><div className="flex gap-1"><button onClick={() => openEdit(c)} className="p-1 text-gray-400 hover:text-primary-500"><Pencil size={14} /></button><button onClick={() => confirmDelete(c.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button></div></td>
              </tr>
            ))}
            {coupons.length === 0 && <tr><td colSpan="7" className="text-center py-8 text-gray-400">No hay cupones. Crea el primero.</td></tr>}
          </tbody>
        </table>
      </div>

      <CouponModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={save} editingId={editingId} form={form} setForm={setForm} categories={categories} products={products} />
      <ConfirmModal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={deleteCoupon} title="Eliminar cupón" message="¿Estás seguro? Esta acción no se puede deshacer." />
    </div>
  );
}