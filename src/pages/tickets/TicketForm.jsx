import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "../../lib/icons.js";
import { api } from "../../lib/api.js";
import { notify } from "../../lib/notifications.js";

export default function TicketForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerId: "",
    subject: "",
    priority: "medium",
    message: "",
  });

  const handleSubmit = async () => {
    if (!form.customerId || !form.subject || !form.message) {
      return notify.error("Completa todos los campos");
    }
    setLoading(true);
    try {
      const newTicket = await api.tickets.create(form);
      notify.success("Ticket creado");
      navigate(`/tickets/${newTicket.id}`);
    } catch (err) {
      notify.error("Error al crear ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/tickets")} className="btn-ghost p-2 rounded-lg">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="page-title">Nuevo Ticket</h1>
            <p className="text-sm text-gray-400 mt-0.5">Crear ticket de soporte para un cliente</p>
          </div>
        </div>
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          <Send size={15} /> {loading ? "Creando..." : "Crear ticket"}
        </button>
      </div>

      <div className="card p-6 space-y-4">
        <div>
          <label className="label">Cliente (ID o email)</label>
          <input
            type="text"
            value={form.customerId}
            onChange={(e) => setForm({ ...form, customerId: e.target.value })}
            className="input"
            placeholder="ID del cliente o email"
          />
        </div>
        <div>
          <label className="label">Asunto</label>
          <input
            type="text"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="input"
            placeholder="Resumen del problema"
          />
        </div>
        <div>
          <label className="label">Prioridad</label>
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="input"
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
            <option value="critical">Crítica</option>
          </select>
        </div>
        <div>
          <label className="label">Mensaje</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={5}
            className="input resize-none"
            placeholder="Describe el problema..."
          />
        </div>
      </div>
    </div>
  );
}