import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Printer, Download } from "../../lib/icons.js";
import { api } from "../../lib/api.js";
import { StatusBadge } from "../../components/ui/index.jsx";

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inv, setInv] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.invoices.get(id);
        setInv(data);

        if (data?.orderId) {
          try {
            const orderData = await api.orders.get(data.orderId);
            if (orderData?.items) {
              setItems(orderData.items);
            }
          } catch (err) {
            console.error("Error loading order items:", err);
          }
        }
      } catch (err) {
        console.error("Error loading invoice:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-gray-400">
        Cargando factura...
      </div>
    );
  }

  if (!inv) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-gray-400">
        Factura no encontrada
      </div>
    );
  }

  const store = inv.store || {};
  const fmt = (v) => parseFloat(v || "0").toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) : "-";
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = parseFloat(inv.discount || "0");
  const shippingCost = parseFloat(inv.shippingCost || "0");

  const invId = inv.id?.slice(0, 8) || "";
  const orderId = inv.orderId?.slice(0, 8) || "";

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-print, #invoice-print * { visibility: visible; }
          #invoice-print { position: absolute; left: 0; top: 0; width: 100%; padding: 2rem; background: white; }
          #invoice-print .card { box-shadow: none; border: none; padding: 0; }
          .page-header, .sidebar, nav, footer { display: none !important; }
        }
      `}</style>
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/invoices")} className="btn-ghost p-2 rounded-lg">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="page-title">Factura #{invId}</h1>
            <p className="text-sm text-gray-400 mt-0.5">Emitida {fmtDate(inv.issuedAt)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost gap-2" onClick={() => window.print()}><Printer size={15} /> Imprimir</button>
          <button className="btn-primary gap-2"><Download size={15} /> Descargar PDF</button>
        </div>
      </div>

      <div className="card p-8 space-y-8" id="invoice-print">
        {/* Header: Logo + Store info */}
        <div className="flex items-start justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {store.logoUrl ? (
              <img src={store.logoUrl} alt={store.storeName} className="w-14 h-14 rounded-xl object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-primary-600 flex items-center justify-center text-white text-xl font-bold">
                {(store.storeName || "E")[0]}
              </div>
            )}
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{store.storeName || "Mi Tienda"}</p>
              <p className="text-sm text-gray-400">{store.storeEmail || ""}</p>
              {store.storeUrl && <p className="text-sm text-gray-400">{store.storeUrl}</p>}
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">${fmt(inv.amount)}</p>
            <div className="mt-1"><StatusBadge status={inv.status} /></div>
          </div>
        </div>

        {/* Invoice meta + Customer */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Facturar a</p>
            <p className="text-base font-semibold text-gray-900 dark:text-white">{inv.customerName || "Cliente"}</p>
            <p className="text-sm text-gray-400">{inv.customerEmail || ""}</p>
          </div>
          <div className="text-right">
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
              <span className="text-gray-400 text-right">Factura:</span>
              <span className="font-mono text-gray-800 dark:text-gray-200 text-left">#{invId}</span>
              <span className="text-gray-400 text-right">Orden:</span>
              <span className="font-mono text-gray-800 dark:text-gray-200 text-left">#{orderId || "—"}</span>
              <span className="text-gray-400 text-right">Emisión:</span>
              <span className="text-gray-800 dark:text-gray-200 text-left">{fmtDate(inv.issuedAt)}</span>
              <span className="text-gray-400 text-right">Pago:</span>
              <span className="text-gray-800 dark:text-gray-200 capitalize text-left">{inv.paymentMethod || "—"}</span>
            </div>
          </div>
        </div>

        {/* Products */}
        {items.length > 0 && (
          <>
            <div className="pt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">Producto</th>
                    <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">Cant.</th>
                    <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">Precio</th>
                    <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={item.id || i} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                          )}
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-center text-gray-500">{item.quantity}</td>
                      <td className="py-3 text-right text-gray-700 dark:text-gray-300">${fmt(item.price)}</td>
                      <td className="py-3 text-right font-medium text-gray-800 dark:text-white">${fmt(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <div className="w-64 space-y-1.5">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>${fmt(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Descuento {inv.couponCode ? `(${inv.couponCode})` : ""}</span>
                    <span>-${fmt(discount)}</span>
                  </div>
                )}
                {shippingCost > 0 && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Envío</span>
                    <span>${fmt(shippingCost)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-3 border-t-2 border-gray-300 dark:border-gray-600">
                  <span>Total</span>
                  <span>${fmt(inv.amount)}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
          {store.description && (
            <p className="text-xs text-gray-400 leading-relaxed">{store.description}</p>
          )}
          <p className="text-xs text-gray-400">
            Factura #{invId} — Pagado con {inv.paymentMethod || "el método seleccionado"}. Gracias por tu compra.
          </p>
          {store.storeUrl && (
            <p className="text-xs text-gray-400">{store.storeUrl}</p>
          )}
        </div>
      </div>
    </div>
  );
}
