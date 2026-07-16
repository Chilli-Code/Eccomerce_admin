import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, CreditCard, Package, User, Truck, Clock, Pencil, Tag } from "../../lib/icons.js";
import { StatusBadge } from "../../components/ui/index.jsx";
import AddressInput from "../../components/ui/AddressInput.jsx";
import { api } from "../../lib/api.js";
import { notify } from "../../lib/notifications.js";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await api.orders.get(id);
      setOrder(data);
    } catch (err) {
      notify.error("Error al cargar la orden");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await api.orders.updateStatus(id, newStatus);
      setOrder(prev => ({ ...prev, status: newStatus }));
      notify.success(`Estado actualizado a ${newStatus}`);
    } catch (err) {
      notify.error("Error al actualizar estado");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(price || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Fecha no disponible";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Calcular timeline basado en el estado de la orden
  const getTimeline = (status, createdAt) => {
    const timeline = [
      { label: "Orden creada", time: formatDate(createdAt), done: true },
      { label: "Pago confirmado", time: status !== "pending" ? formatDate(createdAt) : "Pendiente", done: status !== "pending" },
      { label: "Procesando", time: status === "processing" || status === "in_transit" || status === "delivered" ? formatDate(createdAt) : "Pendiente", done: status === "processing" || status === "in_transit" || status === "delivered" },
      { label: "En camino", time: status === "in_transit" || status === "delivered" ? formatDate(createdAt) : "Pendiente", done: status === "in_transit" || status === "delivered" },
      { label: "Entregado", time: status === "delivered" ? formatDate(createdAt) : "Pendiente", done: status === "delivered" },
    ];
    return timeline;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) return null;

  const timeline = getTimeline(order.status, order.createdAt);
  const subtotal = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const discount = parseFloat(order.discount || "0");
  const shippingCost = parseFloat(order.shippingCost || "0");
  const total = subtotal - discount + shippingCost;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/orders")} className="btn-ghost p-2 rounded-lg shrink-0">
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white truncate">
              Order: #{order.id?.slice(0, 8)}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {formatDate(order.createdAt)} · {order.items?.length || 0} items
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updatingStatus}
            className="input py-2 text-sm w-36"
          >
            <option value="pending">Pendiente</option>
            <option value="processing">Procesando</option>
            <option value="in_transit">En camino</option>
            <option value="delivered">Entregado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left col */}
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <div className="table-wrap">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Order Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th className="hidden md:table-cell">SKU</th>
                    <th>Qty</th>
                    <th className="hidden sm:table-cell">Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl overflow-hidden shrink-0">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package size={16} className="text-gray-400" />
                            )}
                          </div>
                          <span className="font-medium text-sm truncate">{item.name || `Producto ${item.productId?.slice(0, 8)}`}</span>
                        </div>
                      </td>
                      <td className="hidden md:table-cell font-mono text-xs text-gray-400">{item.sku || item.productId?.slice(0, 8)}</td>
                      <td className="text-center whitespace-nowrap">{item.quantity}</td>
                      <td className="hidden sm:table-cell whitespace-nowrap">{formatPrice(item.price)}</td>
                      <td className="font-semibold whitespace-nowrap">{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Summary */}
            <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 space-y-1.5">
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-500">
                  <span>Descuento {order.couponCode ? `(${order.couponCode})` : ""}</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Envío</span><span>{shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-gray-900 dark:text-white pt-1.5 border-t border-gray-100 dark:border-gray-800">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Order Timeline</h2>
            <div className="space-y-4">
              {timeline.map((t, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full mt-0.5 flex-shrink-0 ${t.done ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"}`} />
                    {i < timeline.length - 1 && (
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
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{order.customerName || "Cliente"}</p>
            <p className="text-xs text-gray-400 mt-0.5">{order.customerEmail || "sin email"}</p>
          </div>

          {/* Shipping */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Truck size={15} className="text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Shipping</h3>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium">Dirección de envío:</p>
                <p>{order.shippingAddress || "No especificada"}</p>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <Clock size={12} className="text-gray-400" />
                <span className="text-xs text-gray-500">
                  {order.status === "in_transit" ? "En camino" : order.status === "delivered" ? "Entregado" : "Pendiente de envío"}
                </span>
              </div>
              {order.trackingNumber && (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500">Número de seguimiento:</p>
                  <p className="text-xs font-mono font-semibold">{order.trackingNumber}</p>
                  {order.trackingUrl && (
                    <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline mt-1 inline-block">
                      Rastrear envío →
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Payment */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={15} className="text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Payment</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`badge ${order.status === "cancelled" ? "badge-red" : order.status === "delivered" ? "badge-green" : order.status === "processing" || order.status === "in_transit" ? "badge-green" : "badge-yellow"}`}>
                {order.status === "cancelled" ? "Reembolsado" : order.status === "delivered" || order.status === "processing" || order.status === "in_transit" ? "Pagado" : "Pendiente"}
              </span>
              <span className="text-xs text-gray-500 capitalize">{order.paymentMethod || "No especificado"}</span>
            </div>
            <p className="text-sm font-semibold text-gray-800 dark:text-white mt-2">{formatPrice(order.total)}</p>
            {order.couponCode && (
              <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-emerald-600 flex items-center gap-1">
                <Tag size={12} />
                Cupón: <span className="font-mono font-semibold">{order.couponCode}</span>
                {discount > 0 && <span> (-{formatPrice(discount)})</span>}
              </div>
            )}
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