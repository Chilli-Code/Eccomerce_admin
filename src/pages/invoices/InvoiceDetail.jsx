import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, Printer, Send } from "../../lib/icons.js";
import { allInvoices } from "../../data/mock.js";
import { StatusBadge } from "../../components/ui/index.jsx";

const ITEMS = [
  { description: "Air Force 1 Low — Size 10 / White", qty: 1, price: 399.00 },
  { description: "Classic Hoodie — M / Black", qty: 1, price: 89.00 },
];

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const inv = allInvoices.find(i => i.id === id) || allInvoices[0];

  const subtotal = ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * 0.19;
  const total = subtotal + tax;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/invoices")} className="btn-ghost p-2 rounded-lg">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="page-title">{inv.id}</h1>
            <p className="text-sm text-gray-400 mt-0.5">Issued {inv.date} · Due {inv.due}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost gap-2"><Printer size={15} /> Print</button>
          <button className="btn-secondary gap-2"><Send size={15} /> Send</button>
          <button className="btn-primary gap-2"><Download size={15} /> Download PDF</button>
        </div>
      </div>

      {/* Invoice card */}
      <div className="card p-8 space-y-8">

        {/* Top: logo + status */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">E</span>
              </div>
              <span className="text-base font-semibold text-gray-900 dark:text-white">EcomStore</span>
            </div>
            <p className="text-xs text-gray-400">mystore.com</p>
            <p className="text-xs text-gray-400">contact@mystore.com</p>
            <p className="text-xs text-gray-400">Bogotá, Colombia</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{inv.id}</p>
            <StatusBadge status={inv.status} />
          </div>
        </div>

        {/* Bill to / dates */}
        <div className="grid grid-cols-3 gap-6 py-6 border-y border-gray-100 dark:border-gray-800">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Bill To</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">{inv.customer}</p>
            <p className="text-xs text-gray-400">{inv.email}</p>
            <p className="text-xs text-gray-400 mt-1">Calle 93 #15-32</p>
            <p className="text-xs text-gray-400">Bogotá, Colombia</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Invoice Date</p>
            <p className="text-sm font-medium text-gray-800 dark:text-white">{inv.date}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 mt-4">Due Date</p>
            <p className={`text-sm font-medium ${inv.status === "overdue" ? "text-red-500" : "text-gray-800 dark:text-white"}`}>
              {inv.due}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Order Ref</p>
            <p className="text-sm font-mono text-primary-600 dark:text-primary-400">{inv.order}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 mt-4">Payment</p>
            <p className="text-sm font-medium text-gray-800 dark:text-white">Credit Card</p>
          </div>
        </div>

        {/* Items */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">Description</th>
              <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">Qty</th>
              <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">Unit Price</th>
              <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((item, i) => (
              <tr key={i} className="border-b border-gray-50 dark:border-gray-800/50">
                <td className="py-3.5 text-gray-700 dark:text-gray-300">{item.description}</td>
                <td className="py-3.5 text-center text-gray-500">{item.qty}</td>
                <td className="py-3.5 text-right text-gray-700 dark:text-gray-300">${item.price.toFixed(2)}</td>
                <td className="py-3.5 text-right font-medium text-gray-800 dark:text-white">${(item.price * item.qty).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            {[
              ["Subtotal", `$${subtotal.toFixed(2)}`],
              ["Tax (19%)", `$${tax.toFixed(2)}`],
              ["Shipping", "$0.00"],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{l}</span><span>{v}</span>
              </div>
            ))}
            <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-gray-700">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Notes</p>
          <p className="text-xs text-gray-400">Thank you for your purchase. For any questions regarding this invoice, contact us at contact@mystore.com</p>
        </div>

      </div>
    </div>
  );
}