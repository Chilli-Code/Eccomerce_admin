import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Paperclip } from "../../lib/icons.js";
import { allTickets } from "../../data/mock.js";
import clsx from "clsx";

const MESSAGES = [
  { id: 1, from: "customer", name: "Laura Gómez", time: "Mar 14 · 10:22 AM", text: "Hi, I placed order #ORD-1042 five days ago and it still hasn't arrived. The tracking number doesn't show any updates. Can you help?" },
  { id: 2, from: "admin", name: "Support Team", time: "Mar 14 · 11:05 AM", text: "Hi Laura! Thanks for reaching out. We're checking with our logistics team right now and will update you within 24 hours. Sorry for the inconvenience!" },
];

const StatusBadgeTicket = ({ status }) => {
  const map = {
    open:        "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    in_progress: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    resolved:    "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
  };
  const labels = { in_progress: "In Progress" };
  return <span className={clsx("badge", map[status])}>{labels[status] || status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ticket = allTickets.find(t => t.id === id) || allTickets[0];
  const [messages, setMessages] = useState(MESSAGES);
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState(ticket.status);

  const sendReply = () => {
    if (!reply.trim()) return;
    setMessages(m => [...m, {
      id: Date.now(), from: "admin", name: "Support Team",
      time: "Just now", text: reply,
    }]);
    setReply("");
  };

  return (
    <div className="max-w-10xl space-y-5">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/tickets")} className="btn-ghost p-2 rounded-lg">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="page-title">{ticket.id} — {ticket.subject}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{ticket.date} · {ticket.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadgeTicket status={status} />
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="input py-2 text-sm w-auto"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Chat col */}
        <div className="col-span-2 space-y-4">
          {/* Messages */}
          <div className="card p-5 space-y-5">
            {messages.map(m => (
              <div key={m.id} className={clsx("flex gap-3", m.from === "admin" && "flex-row-reverse")}>
                <div className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0",
                  m.from === "admin"
                    ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                )}>
                  {m.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className={clsx("flex-1", m.from === "admin" && "items-end flex flex-col")}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{m.name}</span>
                    <span className="text-[10px] text-gray-400">{m.time}</span>
                  </div>
                  <div className={clsx(
                    "px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-sm",
                    m.from === "admin"
                      ? "bg-primary-600 text-white rounded-tr-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-tl-sm"
                  )}>
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reply box */}
          <div className="card p-4">
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendReply())}
              rows={3}
              placeholder="Type your reply… (Enter to send)"
              className="input resize-none text-sm mb-3"
            />
            <div className="flex items-center justify-between">
              <button className="btn-ghost p-2 text-gray-400 hover:text-gray-600">
                <Paperclip size={16} />
              </button>
              <button onClick={sendReply} className="btn-primary gap-2">
                <Send size={14} /> Send Reply
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="card p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Customer</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-semibold text-sm">
                {ticket.customer.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">{ticket.customer}</p>
                <p className="text-xs text-gray-400">{ticket.email}</p>
              </div>
            </div>
            {ticket.order && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 text-xs">
                <span className="text-gray-400">Related order: </span>
                <span className="font-mono font-semibold text-primary-600 dark:text-primary-400">{ticket.order}</span>
              </div>
            )}
          </div>

          {/* Ticket info */}
          <div className="card p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Ticket Info</p>
            <div className="space-y-2.5">
              {[
                ["ID", ticket.id],
                ["Category", ticket.category],
                ["Priority", ticket.priority],
                ["Opened", ticket.date],
                ["Messages", ticket.messages],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{l}</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="card p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Quick Actions</p>
            <div className="space-y-2">
              <button className="btn-secondary w-full justify-center text-xs py-2">View Order</button>
              <button className="btn-secondary w-full justify-center text-xs py-2">Issue Refund</button>
              <button className="btn-danger w-full justify-center text-xs py-2">Close Ticket</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}