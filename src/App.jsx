import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { Toaster } from "sileo";

import Layout from "./components/layout/Layout.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Products from "./pages/products/Products.jsx";
import ProductForm from "./pages/products/ProductForm.jsx";
import Categories from "./pages/categories/Categories.jsx";
import Orders from "./pages/orders/Orders.jsx";
import OrderDetail from "./pages/orders/OrderDetail.jsx";
import Customers from "./pages/customers/Customers.jsx";
import Coupons from "./pages/coupons/Coupons.jsx";
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
import Calendar from "./pages/calendar/Calendar.jsx";
import ProductStats from "./pages/products/ProductStats.jsx";
import CustomerDetail from "./pages/customers/CustomerDetail.jsx";
import Reports from "./pages/reports/Reports.jsx";
import Team from "./pages/settings/Team.jsx";
import TeamMember from "./pages/settings/TeamMember.jsx";

const CmsPages = lazy(() => import("./pages/cms/CmsPages.jsx"));


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
    <>
      <Toaster position="bottom-center" />
    <Layout dark={dark} onToggleDark={() => setDark(!dark)} onLogout={() => { localStorage.removeItem("admin_token"); setAuth(false); }}>
      <Suspense fallback={<div>Loading...</div>}>
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
          <Route path="/reports" element={<Reports />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/team" element={<Team />} />
          <Route path="/settings/team/:id" element={<TeamMember />} />
          <Route path="/settings/transportation" element={<ShippingTab />} />
          <Route path="/settings/carrier/:code" element={<CarrierConfig />} />
          <Route path="/products/:id/stats" element={<ProductStats />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </Layout>
    </>
  );
}

export default App;
