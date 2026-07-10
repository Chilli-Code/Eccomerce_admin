import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Paperclip, User, Calendar, Tag, Flag, MessageSquare } from "../../lib/icons.js";
import { api } from "../../lib/api.js";
import { notify } from "../../lib/notifications.js";
import clsx from "clsx";
import Loader from "../../components/ui/Loader.jsx";

const STATUS_CONFIG = {
  open: { label: "Abierto", color: "bg-blue-50 text-blue-600", dot: "bg-blue-500" },
  in_progress: { label: "En progreso", color: "bg-amber-50 text-amber-600", dot: "bg-amber-500" },
  resolved: { label: "Resuelto", color: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
};

const PRIORITY_CONFIG = {
  low: { label: "Baja", color: "bg-gray-50 text-gray-500" },
  medium: { label: "Media", color: "bg-amber-50 text-amber-600" },
  high: { label: "Alta", color: "bg-orange-50 text-orange-600" },
  critical: { label: "Crítica", color: "bg-red-50 text-red-600" },
};

const StatusBadgeTicket = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.open;
  return <span className={clsx("badge", config.color)}>{config.label}</span>;
};

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const messagesEndRef = useRef(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const ticketData = await api.tickets.get(id);
      setTicket(ticketData);

      const messagesData = await api.tickets.getMessages(id);
      setMessages(messagesData || []);
    } catch (err) {
      notify.error("Error al cargar ticket");
      navigate("/tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // Scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await api.tickets.addMessage(id, {
        sender: "admin",
        message: reply
      });
      await loadData(); // Recargar para obtener el mensaje nuevo
      setReply("");
      notify.success("Mensaje enviado");
    } catch (err) {
      notify.error("Error al enviar mensaje");
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const result = await api.tickets.updateStatus(id, newStatus);

      setTicket(prev => ({ ...prev, status: newStatus }));
      // 👈 Usar un método que SÍ existe
      notify.productSaved(`Ticket #${ticket.id?.slice(0, 8)}`);
    } catch (err) {
      notify.error("Error al actualizar estado");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Loader size={80} />
      <p className="text-sm text-gray-400">Cargando Soporte</p>
    </div>
  );

  if (!ticket) return null;

  const statusConfig = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
  const priorityConfig = PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.medium;

  return (
    <div className="max-w-10xl space-y-5">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/tickets")} className="btn-ghost p-2 rounded-lg">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="page-title">Ticket #{ticket.id?.slice(0, 8)}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{ticket.subject}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadgeTicket status={ticket.status} />
          <select
            value={ticket.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updatingStatus}
            className="input py-2 text-sm w-36"
          >
            <option value="open">Abierto</option>
            <option value="in_progress">En progreso</option>
            <option value="resolved">Resuelto</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Chat col */}
        <div className="col-span-2 space-y-4">
          {/* Messages - orden correcto como WhatsApp */}
          <div className="card p-5 h-[500px] overflow-y-auto flex flex-col-reverse">
            <div className="space-y-5">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
                  No hay mensajes aún
                </div>
              ) : (
                messages.map(m => (
                  <div key={m.id} className={clsx("flex gap-3", m.sender === "admin" && "flex-row-reverse")}>
                    <div className={clsx(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0",
                      m.sender === "admin"
                        ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600"
                    )}>
                      {m.sender === "admin" ? "A" : "C"}
                    </div>
                    <div className={clsx("flex-1", m.sender === "admin" && "items-end flex flex-col")}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-400 dark:text-gray-200">
                          {m.sender === "admin"
                            ? "Soporte"
                            : (ticket.customerName || "Cliente")}
                        </span>
                        <span className="text-[10px] text-gray-400">{formatDate(m.createdAt)}</span>
                      </div>
                      <div className={clsx(
                        "px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-sm",
                        m.sender === "admin"
                          ? "bg-primary-600 text-white rounded-tr-sm"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-tl-sm"
                      )}>
                        {m.message}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Reply box */}
          <div className="card p-4">
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendReply())}
              rows={3}
              placeholder="Escribe tu respuesta... (Enter para enviar)"
              className="input resize-none text-sm mb-3"
            />
            <div className="flex items-center justify-between">
              <button className="btn-ghost p-2 text-gray-400 hover:text-gray-600">
                <Paperclip size={16} />
              </button>
              <button onClick={sendReply} disabled={sending} className="btn-primary gap-2">
                <Send size={14} /> {sending ? "Enviando..." : "Enviar respuesta"}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="card p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Cliente</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-sm">
                {ticket.customerName?.charAt(0) || "U"}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{ticket.customerName || "Usuario"}</p>
                <p className="text-xs text-gray-400">{ticket.customerEmail || "sin email"}</p>
              </div>
            </div>
            {ticket.orderId && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 text-xs">
                <span className="text-gray-400">Pedido relacionado: </span>
                <span className="font-mono font-semibold text-primary-600">{ticket.orderId.slice(0, 8)}</span>
              </div>
            )}
          </div>

          {/* Ticket info */}
          <div className="card p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Información</p>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">ID</span>
                <span className="text-xs font-mono text-gray-400">{ticket.id?.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Prioridad</span>
                <span className={clsx("text-xs font-medium px-2 py-0.5 rounded-full", priorityConfig.color)}>
                  {priorityConfig.label}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Abierto</span>
                <span className="text-xs text-gray-400">{formatDate(ticket.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Mensajes</span>
                <span className="text-xs font-medium text-gray-400">{messages.length}</span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="card p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Acciones rápidas</p>
            <div className="space-y-2">
              {ticket.orderId && (
                <button
                  onClick={() => navigate(`/orders/${ticket.orderId}`)}
                  className="btn-secondary w-full justify-center text-xs py-2"
                >
                  Ver pedido
                </button>
              )}
              <button className="btn-danger w-full justify-center text-xs py-2">
                Cerrar ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}