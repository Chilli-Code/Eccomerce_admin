import { useState } from "react";
import { Users, Plus, Edit2, Trash2, Mail, Phone, Shield, Crown, Eye, X, Check } from "../../lib/icons.js";
import { Modal } from "../../components/ui/index.jsx";
import clsx from "clsx";
import { Link } from "react-router-dom";

const ROLES = [
  {
    id: "admin",
    label: "Admin",
    icon: Shield,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    badge: "badge-blue",
    desc: "Todo excepto billing y eliminar la tienda",
  },
  {
    id: "operator",
    label: "Operador",
    icon: Users,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    badge: "badge-green",
    desc: "Órdenes, envíos e inventario",
  },
  {
    id: "viewer",
    label: "Visor",
    icon: Eye,
    color: "text-gray-500 dark:text-gray-400",
    bg: "bg-gray-50 dark:bg-gray-800",
    badge: "badge-gray",
    desc: "Solo lectura — dashboard y reportes",
  },
];

const PERMISSIONS = {
  admin: {
    "Dashboard":    true,  "Productos":   true,  "Órdenes":    true,
    "Clientes":     true,  "Envíos":      true,  "Reportes":   true,
    "Cupones":      true,  "Páginas CMS": true,  "Calendario": true,
    "Ajustes":      true,  "Billing":     false, "Equipo":     true,
  },
  operator: {
    "Dashboard":    true,  "Productos":   true,  "Órdenes":    true,
    "Clientes":     true,  "Envíos":      true,  "Reportes":   false,
    "Cupones":      false, "Páginas CMS": false, "Calendario": true,
    "Ajustes":      false, "Billing":     false, "Equipo":     false,
  },
  viewer: {
    "Dashboard":    true,  "Productos":   false, "Órdenes":    false,
    "Clientes":     false, "Envíos":      false, "Reportes":   true,
    "Cupones":      false, "Páginas CMS": false, "Calendario": false,
    "Ajustes":      false, "Billing":     false, "Equipo":     false,
  },
};

const INITIAL_MEMBERS = [
  { id: 1, name: "Jorge Ramírez",   email: "jorge@mystore.com",   phone: "+57 310 000 0001", role: "owner",    status: "active",  joined: "2025-01-15", avatar: "JR" },
  { id: 2, name: "Laura Gómez",     email: "laura@mystore.com",   phone: "+57 311 000 0002", role: "admin",    status: "active",  joined: "2025-03-10", avatar: "LG" },
  { id: 3, name: "Carlos Ruiz",     email: "carlos@mystore.com",  phone: "+57 312 000 0003", role: "operator", status: "active",  joined: "2025-06-22", avatar: "CR" },
  { id: 4, name: "Ana Martínez",    email: "ana@mystore.com",     phone: "",                 role: "viewer",   status: "pending", joined: "2026-03-01", avatar: "AM" },
];

const AVATAR_COLORS = ["#4f46e5","#10b981","#f59e0b","#8b5cf6","#ec4899","#06b6d4"];

const STATUS_CFG = {
  active:  { label: "Activo",    cls: "badge-green"  },
  pending: { label: "Pendiente", cls: "badge-yellow" },
  inactive:{ label: "Inactivo",  cls: "badge-gray"   },
};

const EMPTY_FORM = { name: "", email: "", phone: "", role: "operator" };

export default function Team() {
  const [members, setMembers]       = useState(INITIAL_MEMBERS);
  const [modal, setModal]           = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [delModal, setDelModal]     = useState(null);
  const [permModal, setPermModal]   = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openInvite = () => {
    setEditMember(null);
    setForm(EMPTY_FORM);
    setModal(true);
  };

  const openEdit = (m) => {
    setEditMember(m);
    setForm({ name: m.name, email: m.email, phone: m.phone, role: m.role });
    setModal(true);
  };

  const save = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    if (editMember) {
      setMembers(ms => ms.map(m => m.id === editMember.id ? { ...m, ...form } : m));
    } else {
      setMembers(ms => [...ms, {
        ...form,
        id: Date.now(),
        status: "pending",
        joined: new Date().toISOString().slice(0, 10),
        avatar: form.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
      }]);
    }
    setModal(false);
  };

  const toggleStatus = (id) => {
    setMembers(ms => ms.map(m =>
      m.id === id ? { ...m, status: m.status === "active" ? "inactive" : "active" } : m
    ));
  };

  const getRoleCfg = (role) => ROLES.find(r => r.id === role);

  const activeCount  = members.filter(m => m.status === "active").length;
  const pendingCount = members.filter(m => m.status === "pending").length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Equipo</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {activeCount} miembro{activeCount !== 1 ? "s" : ""} activo{activeCount !== 1 ? "s" : ""}
            {pendingCount > 0 && ` · ${pendingCount} invitación${pendingCount > 1 ? "es" : ""} pendiente${pendingCount > 1 ? "s" : ""}`}
          </p>
        </div>
        <button className="btn-primary" onClick={openInvite}>
          <Plus size={16} /> Invitar empleado
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total miembros", value: members.length,                              color: "text-primary-600 dark:text-primary-400", bg: "bg-primary-50 dark:bg-primary-900/30" },
          { label: "Activos",        value: activeCount,                                 color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Pendientes",     value: pendingCount,                                color: "text-amber-500",   bg: "bg-amber-50 dark:bg-amber-900/20" },
          { label: "Roles distintos",value: [...new Set(members.map(m => m.role))].length, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" },
        ].map(s => (
          <div key={s.label} className="card px-4 py-3 flex items-center gap-3">
            <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", s.bg)}>
              <Users size={16} className={s.color} />
            </div>
            <div>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className={clsx("text-xl font-semibold", s.color)}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Members grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {members.map((m, i) => {
          const roleCfg = getRoleCfg(m.role);
          const RoleIcon = m.role === "owner" ? Crown : roleCfg?.icon || Users;
          const isOwner = m.role === "owner";

          return (
            <div key={m.id} className="card p-5 group">
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                  >
                    {m.avatar}
                  </div>
                  <div>
                    <Link
  to={`/settings/team/${m.id}`}
  className="text-sm font-semibold text-gray-800 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
>
  {m.name}
</Link>
                    <p className="text-xs text-gray-400">{m.email}</p>
                  </div>
                </div>
                <span className={clsx("badge", STATUS_CFG[m.status].cls)}>
                  {STATUS_CFG[m.status].label}
                </span>
              </div>

              {/* Role */}
              <div className={clsx(
                "flex items-center gap-2 px-3 py-2 rounded-lg mb-3",
                isOwner ? "bg-amber-50 dark:bg-amber-900/20" : roleCfg?.bg
              )}>
                <RoleIcon size={14} className={isOwner ? "text-amber-500" : roleCfg?.color} />
                <span className={clsx("text-xs font-semibold", isOwner ? "text-amber-600 dark:text-amber-400" : roleCfg?.color)}>
                  {isOwner ? "Owner" : roleCfg?.label}
                </span>
                {!isOwner && (
                  <button
                    onClick={() => setPermModal(m)}
                    className="ml-auto text-[10px] text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 underline"
                  >
                    ver permisos
                  </button>
                )}
              </div>

              {/* Info */}
              <div className="space-y-1.5 mb-4">
                {m.phone && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone size={11} /> {m.phone}
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Mail size={11} />
                  {m.status === "pending" ? "Invitación enviada — pendiente de aceptar" : `Miembro desde ${new Date(m.joined + "T12:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}`}
                </div>
              </div>

              {/* Actions */}
              {!isOwner && (
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(m)}
                    className="btn-ghost flex-1 text-xs py-1.5 gap-1.5 justify-center text-gray-500 hover:text-primary-600"
                  >
                    <Edit2 size={12} /> Editar
                  </button>
                  <button
                    onClick={() => toggleStatus(m.id)}
                    className={clsx(
                      "btn-ghost flex-1 text-xs py-1.5 gap-1.5 justify-center",
                      m.status === "active"
                        ? "text-gray-500 hover:text-amber-500"
                        : "text-gray-500 hover:text-emerald-500"
                    )}
                  >
                    {m.status === "active" ? "Desactivar" : "Activar"}
                  </button>
                  <button
                    onClick={() => setDelModal(m)}
                    className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Roles reference */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Roles y permisos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ROLES.map(role => (
            <div key={role.id} className={clsx("rounded-xl p-4 border", role.bg, "border-transparent")}>
              <div className="flex items-center gap-2 mb-2">
                <div className={clsx("w-7 h-7 rounded-lg flex items-center justify-center", role.bg)}>
                  <role.icon size={14} className={role.color} />
                </div>
                <span className={clsx("text-sm font-semibold", role.color)}>{role.label}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{role.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal invitar / editar */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editMember ? "Editar miembro" : "Invitar empleado"}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn-primary" onClick={save}>
              {editMember ? "Guardar cambios" : "Enviar invitación"}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Nombre completo *</label>
              <input value={form.name} onChange={e => set("name", e.target.value)} className="input" placeholder="Juan Pérez" />
            </div>
            <div>
              <label className="label">Teléfono</label>
              <input value={form.phone} onChange={e => set("phone", e.target.value)} className="input" placeholder="+57 310 000 0000" />
            </div>
          </div>
          <div>
            <label className="label">Email *</label>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} className="input" placeholder="empleado@empresa.com" />
            {!editMember && <p className="text-[11px] text-gray-400 mt-1">Recibirá un correo con la invitación para acceder al panel.</p>}
          </div>
          <div>
            <label className="label">Rol</label>
            <div className="space-y-2 mt-1.5">
              {ROLES.map(role => (
                <label
                  key={role.id}
                  className={clsx(
                    "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors",
                    form.role === role.id
                      ? "border-primary-400 bg-primary-50 dark:bg-primary-900/20"
                      : "border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.id}
                    checked={form.role === role.id}
                    onChange={() => set("role", role.id)}
                    className="sr-only"
                  />
                  <div className={clsx("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0", role.bg)}>
                    <role.icon size={14} className={role.color} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{role.label}</p>
                    <p className="text-xs text-gray-400">{role.desc}</p>
                  </div>
                  {form.role === role.id && (
                    <Check size={14} className="ml-auto text-primary-600 dark:text-primary-400 flex-shrink-0" />
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal eliminar */}
      <Modal
        open={!!delModal}
        onClose={() => setDelModal(null)}
        title="Eliminar miembro"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setDelModal(null)}>Cancelar</button>
            <button className="btn-danger" onClick={() => { setMembers(ms => ms.filter(m => m.id !== delModal.id)); setDelModal(null); }}>
              Eliminar
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ¿Eliminar a <strong className="text-gray-900 dark:text-white">{delModal?.name}</strong> del equipo? Perderá acceso inmediatamente.
        </p>
      </Modal>

      {/* Modal permisos */}
      {permModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPermModal(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Permisos — {getRoleCfg(permModal.role)?.label}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{permModal.name}</p>
              </div>
              <button onClick={() => setPermModal(null)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
            <div className="px-5 py-4 grid grid-cols-2 gap-2">
              {Object.entries(PERMISSIONS[permModal.role] || {}).map(([perm, allowed]) => (
                <div key={perm} className={clsx(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium",
                  allowed
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-400 line-through"
                )}>
                  <span>{allowed ? "✓" : "✗"}</span>
                  {perm}
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800">
              <button className="btn-primary w-full justify-center text-sm" onClick={() => setPermModal(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}