import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Shield, Eye, Users, Crown, Clock, Package, Truck, MessageSquare, Tag, Edit2, CheckCircle, AlertCircle } from "../../lib/icons.js";
import clsx from "clsx";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";

// Mock members (mismo que Team.jsx — cuando tengas backend viene de API)
const MEMBERS = [
  { id: 1, name: "Jorge Ramírez",  email: "jorge@mystore.com",  phone: "+57 310 000 0001", role: "owner",    status: "active",  joined: "2025-01-15", avatar: "JR" },
  { id: 2, name: "Laura Gómez",    email: "laura@mystore.com",  phone: "+57 311 000 0002", role: "admin",    status: "active",  joined: "2025-03-10", avatar: "LG" },
  { id: 3, name: "Carlos Ruiz",    email: "carlos@mystore.com", phone: "+57 312 000 0003", role: "operator", status: "active",  joined: "2025-06-22", avatar: "CR" },
  { id: 4, name: "Ana Martínez",   email: "ana@mystore.com",    phone: "",                 role: "viewer",   status: "pending", joined: "2026-03-01", avatar: "AM" },
];

const AVATAR_COLORS = ["#4f46e5","#10b981","#f59e0b","#8b5cf6"];

const ROLE_CFG = {
  owner:    { label: "Owner",    icon: Crown,  color: "text-amber-500",  bg: "bg-amber-50 dark:bg-amber-900/20"  },
  admin:    { label: "Admin",    icon: Shield, color: "text-blue-600 dark:text-blue-400",   bg: "bg-blue-50 dark:bg-blue-900/20"   },
  operator: { label: "Operador", icon: Users,  color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  viewer:   { label: "Visor",    icon: Eye,    color: "text-gray-500",   bg: "bg-gray-50 dark:bg-gray-800"       },
};

const STATUS_CFG = {
  active:  { label: "Activo",    cls: "badge-green"  },
  pending: { label: "Pendiente", cls: "badge-yellow" },
  inactive:{ label: "Inactivo",  cls: "badge-gray"   },
};

// Mock actividad semanal
const WEEKLY_ACTIVITY = [
  { dia: "Lun", acciones: 12 },
  { dia: "Mar", acciones: 18 },
  { dia: "Mié", acciones: 8  },
  { dia: "Jue", acciones: 22 },
  { dia: "Vie", acciones: 31 },
  { dia: "Sáb", acciones: 5  },
  { dia: "Dom", acciones: 2  },
];

// Mock log de actividad
const ACTIVITY_LOG = [
  { id: 1, action: "Marcó orden #ORD-1045 como enviada",       type: "order",   time: "Hace 2 horas",    icon: Truck,          color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" },
  { id: 2, action: "Editó producto 'Air Force 1 Low'",          type: "product", time: "Hace 3 horas",    icon: Edit2,          color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20" },
  { id: 3, action: "Resolvió ticket #TKT-088",                  type: "ticket",  time: "Hace 5 horas",    icon: MessageSquare,  color: "text-purple-500 bg-purple-50 dark:bg-purple-900/20" },
  { id: 4, action: "Aplicó cupón WELCOME10 a orden #ORD-1044",  type: "coupon",  time: "Ayer 4:22 PM",    icon: Tag,            color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20" },
  { id: 5, action: "Marcó orden #ORD-1043 como entregada",      type: "order",   time: "Ayer 2:10 PM",    icon: CheckCircle,    color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" },
  { id: 6, action: "Actualizó stock de 'Classic Hoodie' a 45",  type: "product", time: "Ayer 11:30 AM",   icon: Package,        color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20" },
  { id: 7, action: "Procesó devolución de orden #ORD-1038",     type: "order",   time: "Hace 2 días",     icon: AlertCircle,    color: "text-red-500 bg-red-50 dark:bg-red-900/20" },
  { id: 8, action: "Resolvió ticket #TKT-081",                  type: "ticket",  time: "Hace 2 días",     icon: MessageSquare,  color: "text-purple-500 bg-purple-50 dark:bg-purple-900/20" },
  { id: 9, action: "Editó producto 'Canvas Backpack'",           type: "product", time: "Hace 3 días",     icon: Edit2,          color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20" },
  { id: 10,action: "Marcó orden #ORD-1031 como enviada",        type: "order",   time: "Hace 3 días",     icon: Truck,          color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" },
];

export default function TeamMember() {
  const { id } = useParams();
  const navigate = useNavigate();
  const member = MEMBERS.find(m => m.id === Number(id)) || MEMBERS[1];
  const idx = MEMBERS.findIndex(m => m.id === Number(id));

  const roleCfg  = ROLE_CFG[member.role];
  const RoleIcon = roleCfg.icon;
  const color    = AVATAR_COLORS[idx % AVATAR_COLORS.length];

  const joinedDate = new Date(member.joined + "T12:00:00");
  const daysActive = Math.ceil((new Date() - joinedDate) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/settings/team")} className="btn-ghost p-2 rounded-lg">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: color }}
            >
              {member.avatar}
            </div>
            <div>
              <h1 className="page-title">{member.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={clsx("badge", STATUS_CFG[member.status].cls)}>
                  {STATUS_CFG[member.status].label}
                </span>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <span className="text-xs text-gray-400">{member.email}</span>
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => navigate("/settings/team")} className="btn-secondary gap-2">
          <Edit2 size={14} /> Editar miembro
        </button>
      </div>

      <div className="grid grid-cols-3 gap-5">

        {/* Columna izquierda — info */}
        <div className="space-y-4">

          {/* Perfil */}
          <div className="card p-5">
            <div className="flex flex-col items-center text-center mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3"
                style={{ background: color }}
              >
                {member.avatar}
              </div>
              <h2 className="text-base font-semibold text-gray-800 dark:text-white">{member.name}</h2>
              <div className={clsx("flex items-center gap-1.5 px-3 py-1 rounded-full mt-2 text-xs font-semibold", roleCfg.bg, roleCfg.color)}>
                <RoleIcon size={12} /> {roleCfg.label}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Mail size={13} className="flex-shrink-0" />
                <span className="truncate">{member.email}</span>
              </div>
              {member.phone && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone size={13} className="flex-shrink-0" />
                  {member.phone}
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock size={13} className="flex-shrink-0" />
                Miembro desde {joinedDate.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </div>
          </div>

          {/* Última sesión */}
          <div className="card p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Última sesión</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Hoy, 3:24 PM</p>
            </div>
            <p className="text-xs text-gray-400 mt-1">Desde Bogotá, Colombia</p>
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400 mb-1">Días activo en la plataforma</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{daysActive}d</p>
            </div>
          </div>

        </div>

        {/* Columna derecha — métricas y actividad */}
        <div className="col-span-2 space-y-4">

          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Órdenes procesadas", value: 89,   icon: Package,        color: "text-primary-600 dark:text-primary-400", bg: "bg-primary-50 dark:bg-primary-900/30" },
              { label: "Envíos gestionados", value: 67,   icon: Truck,          color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
              { label: "Tickets resueltos",  value: 24,   icon: MessageSquare,  color: "text-purple-600 dark:text-purple-400",  bg: "bg-purple-50 dark:bg-purple-900/20"  },
              { label: "Cupones aplicados",  value: 12,   icon: Tag,            color: "text-amber-500",  bg: "bg-amber-50 dark:bg-amber-900/20"  },
            ].map(k => (
              <div key={k.label} className="card px-4 py-3 flex items-center gap-3">
                <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", k.bg)}>
                  <k.icon size={16} className={k.color} />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 leading-tight">{k.label}</p>
                  <p className={clsx("text-xl font-semibold", k.color)}>{k.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Gráfica actividad semanal */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Actividad esta semana</h3>
            <p className="text-xs text-gray-400 mb-4">Número de acciones realizadas por día</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={WEEKLY_ACTIVITY} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-800" />
                <XAxis dataKey="dia" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={v => [`${v} acciones`]}
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }}
                />
                <Bar dataKey="acciones" radius={[4, 4, 0, 0]}>
                  {WEEKLY_ACTIVITY.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.acciones === Math.max(...WEEKLY_ACTIVITY.map(d => d.acciones))
                        ? "#4f46e5"
                        : "#e0e7ff"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-center text-gray-400 mt-1">
              Día más activo: <span className="font-semibold text-primary-600 dark:text-primary-400">
                {WEEKLY_ACTIVITY.reduce((a, b) => a.acciones > b.acciones ? a : b).dia}
              </span> con {Math.max(...WEEKLY_ACTIVITY.map(d => d.acciones))} acciones
            </p>
          </div>

          {/* Log de actividad */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Log de actividad</h3>
            <div className="space-y-0">
              {ACTIVITY_LOG.map((log, i) => {
                const Icon = log.icon;
                const [iconColor, iconBg] = log.color.split(" ");
                return (
                  <div key={log.id} className="flex gap-3 pb-4 relative">
                    {/* línea vertical */}
                    {i < ACTIVITY_LOG.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-100 dark:bg-gray-800" />
                    )}
                    {/* icono */}
                    <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10", iconBg)}>
                      <Icon size={13} className={iconColor} />
                    </div>
                    {/* contenido */}
                    <div className="flex-1 pt-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{log.action}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{log.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}