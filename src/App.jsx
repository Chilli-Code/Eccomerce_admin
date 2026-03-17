import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./components/layout/Layout.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Products from "./pages/products/Products.jsx";
import ProductForm from "./pages/products/ProductForm.jsx";
import Categories from "./pages/categories/Categories.jsx";
import Orders from "./pages/orders/Orders.jsx";
import OrderDetail from "./pages/orders/OrderDetail.jsx";
import Customers from "./pages/customers/Customers.jsx";
import Coupons from "./pages/coupons/Coupons.jsx";
import CmsPages from "./pages/cms/CmsPages.jsx";
import Media from "./pages/media/Media.jsx";
import Settings from "./pages/settings/Settings.jsx";
import Login from "./pages/Login.jsx";
import Invoices from "./pages/invoices/Invoices.jsx";
import InvoiceDetail from "./pages/invoices/InvoiceDetail.jsx";
import Tickets from "./pages/tickets/Tickets.jsx";
import TicketDetail from "./pages/tickets/TicketDetail.jsx";
import Shipping from "./pages/shipping/Shipping.jsx";
import CarrierConfig from "./pages/shipping/CarrierConfig.jsx";
import ShippingTab from "./pages/settings/transportista.jsx";

import ProductStats from "./pages/products/ProductStats.jsx"; 
function App() {
  const [dark, setDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [auth, setAuth] = useState(() => !!localStorage.getItem("admin_token"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  if (!auth) {
    return <Login onLogin={() => setAuth(true)} />;
  }

  return (
    <Layout dark={dark} onToggleDark={() => setDark(!dark)} onLogout={() => { localStorage.removeItem("admin_token"); setAuth(false); }}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/new" element={<ProductForm />} />
        <Route path="/products/:id/edit" element={<ProductForm />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/coupons" element={<Coupons />} />
        <Route path="/pages" element={<CmsPages />} />
        <Route path="/media" element={<Media />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/invoices/:id" element={<InvoiceDetail />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/tickets/:id" element={<TicketDetail />} />
        <Route path="/shipping" element={<Shipping />} />
<Route path="/settings" element={<Settings />} />
<Route path="/settings/transportation" element={<ShippingTab />} />
<Route path="/settings/carrier/:code" element={<CarrierConfig />} />
<Route path="/products/:id/stats" element={<ProductStats />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
