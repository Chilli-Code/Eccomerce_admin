import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, CreditCard, Package, User } from "../../lib/icons.js";
import { StatusBadge } from "../../components/ui/index.jsx";
import { allOrders } from "../../data/mock.js";

const ORDER_ITEMS = [
  { name: "Air Force 1 Low", sku: "AF1-001", qty: 1, price: 399, image: "👟" },
  { name: "Classic Hoodie", sku: "APR-021", qty: 1, price: 89, image: "👕" },
];

const TIMELINE = [
  { label: "Order placed", time: "Mar 14, 2026 · 10:22 AM", done: true },
  { label: "Payment confirmed", time: "Mar 14, 2026 · 10:23 AM", done: true },
  { label: "Processing", time: "Mar 14, 2026 · 11:00 AM", done: true },
  { label: "Shipped", time: "Pending", done: false },
  { label: "Delivered", time: "Pending", done: false },
];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = allOrders.find(o => o.id.replace("#", "") === id) || allOrders[0];

  const subtotal = ORDER_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="max-w-10xl space-y-5">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/orders")} className="btn-ghost p-2 rounded-lg">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="page-title">{order.id}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{order.date} · {order.items} items</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
          <select className="input py-2 text-sm w-auto">
            <option>Update status</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left col */}
        <div className="col-span-2 space-y-5">
          {/* Items */}
          <div className="table-wrap">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Order Items</h2>
            </div>
            <table className="table-base">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {ORDER_ITEMS.map(item => (
                  <tr key={item.sku}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl">
                          {item.image}
                        </div>
                        <span className="font-medium text-sm">{item.name}</span>
                      </div>
                    </td>
                    <td className="font-mono text-xs text-gray-400">{item.sku}</td>
                    <td className="text-center">{item.qty}</td>
                    <td>${item.price}</td>
                    <td className="font-semibold">${item.price * item.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Summary */}
            <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 space-y-1.5">
              {[
                ["Subtotal", `$${subtotal}`],
                ["Shipping", "$0"],
                ["Discount", "-$0"],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{l}</span><span>{v}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-semibold text-gray-900 dark:text-white pt-1.5 border-t border-gray-100 dark:border-gray-800">
                <span>Total</span><span>${subtotal}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Order Timeline</h2>
            <div className="space-y-4">
              {TIMELINE.map((t, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full mt-0.5 flex-shrink-0 ${t.done ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"}`} />
                    {i < TIMELINE.length - 1 && (
                      <div className={`w-0.5 flex-1 mt-1 ${t.done ? "bg-primary-200 dark:bg-primary-900" : "bg-gray-100 dark:bg-gray-800"}`} style={{ minHeight: 20 }} />
                    )}
                  </div>
                  <div className="pb-3">
                    <p className={`text-sm font-medium ${t.done ? "text-gray-800 dark:text-gray-200" : "text-gray-400"}`}>{t.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <User size={15} className="text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Customer</h3>
            </div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{order.customer}</p>
            <p className="text-xs text-gray-400 mt-0.5">{order.email}</p>
          </div>

          {/* Shipping */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={15} className="text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Shipping Address</h3>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-0.5">
              <p>{order.customer}</p>
              <p>Calle 93 #15-32, Apt 401</p>
              <p>Bogotá, Cundinamarca 110221</p>
              <p>Colombia</p>
            </div>
          </div>

          {/* Payment */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={15} className="text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Payment</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-green">Paid</span>
              <span className="text-xs text-gray-500 capitalize">{order.payment}</span>
            </div>
            <p className="text-sm font-semibold text-gray-800 dark:text-white mt-2">${order.total.toFixed(2)}</p>
          </div>

          {/* Notes */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">Order Notes</h3>
            <textarea
              rows={3}
              placeholder="Add internal note…"
              className="input text-sm resize-none"
            />
            <button className="btn-secondary text-xs mt-2 py-1.5">Add note</button>
          </div>
        </div>
      </div>
    </div>
  );
}
