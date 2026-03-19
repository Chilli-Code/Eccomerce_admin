import servientrega from "../assets/carriers/servientregaLogo.jpg";
import coordinadora from "../assets/carriers/coordinadoraLogo.svg";
import enviame from "../assets/carriers/enviameLogo.svg";
import tcc from "../assets/carriers/tccLogo.webp";
import cuatroSetentaDos from "../assets/carriers/472Logo.png";
import fedex from "../assets/carriers/fedexLogo.png";
import ups from "../assets/carriers/upsLogo.svg";

export const statsData = [
  { label: "Total Revenue", value: "$48,295", change: "+12.5%", up: true, sub: "vs last month" },
  { label: "Total Orders", value: "1,284", change: "+8.2%", up: true, sub: "vs last month" },
  { label: "Customers", value: "3,920", change: "+5.1%", up: true, sub: "vs last month" },
  { label: "Pending Orders", value: "47", change: "-3.4%", up: false, sub: "needs attention" },
];

export const revenueChart = [
  { month: "Jan", revenue: 18000, orders: 240 },
  { month: "Feb", revenue: 22000, orders: 290 },
  { month: "Mar", revenue: 19500, orders: 260 },
  { month: "Apr", revenue: 28000, orders: 370 },
  { month: "May", revenue: 31000, orders: 410 },
  { month: "Jun", revenue: 27000, orders: 355 },
  { month: "Jul", revenue: 34000, orders: 450 },
  { month: "Aug", revenue: 38000, orders: 490 },
  { month: "Sep", revenue: 35000, orders: 465 },
  { month: "Oct", revenue: 42000, orders: 540 },
  { month: "Nov", revenue: 48000, orders: 620 },
  { month: "Dec", revenue: 52000, orders: 680 },
];

export const recentOrders = [
  { id: "#ORD-1042", customer: "Laura Gómez", total: "$129.90", status: "completed", date: "Mar 14, 2026", items: 3 },
  { id: "#ORD-1041", customer: "Carlos Ruiz", total: "$89.00", status: "processing", date: "Mar 14, 2026", items: 2 },
  { id: "#ORD-1040", customer: "Ana Martínez", total: "$340.50", status: "completed", date: "Mar 13, 2026", items: 5 },
  { id: "#ORD-1039", customer: "David Chen", total: "$55.00", status: "pending", date: "Mar 13, 2026", items: 1 },
  { id: "#ORD-1038", customer: "Sofia López", total: "$210.00", status: "processing", date: "Mar 12, 2026", items: 4 },
];

export const topProducts = [
  { id: 1, name: "Air Force 1 Low", category: "Sneakers", price: "$399", sold: 192, stock: 48, image: "👟" },
  { id: 2, name: "Classic Hoodie", category: "Apparel", price: "$89", sold: 143, stock: 120, image: "👕" },
  { id: 3, name: "Slim Chinos", category: "Pants", price: "$65", sold: 98, stock: 34, image: "👖" },
  { id: 4, name: "Leather Wallet", category: "Accessories", price: "$45", sold: 77, stock: 92, image: "👜" },
];

export const allProducts = [
  { id: 1, name: "Air Force 1 Low", sku: "AF1-001", category: "Sneakers", price: 399, stock: 48, status: "active", image: "👟" },
  { id: 2, name: "Classic Hoodie", sku: "APR-021", category: "Apparel", price: 89, stock: 120, status: "active", image: "👕" },
  { id: 3, name: "Slim Chinos", sku: "PNT-055", category: "Pants", price: 65, stock: 34, status: "active", image: "👖" },
  { id: 4, name: "Leather Wallet", sku: "ACC-110", category: "Accessories", price: 45, stock: 92, status: "active", image: "👜" },
  { id: 5, name: "Canvas Backpack", sku: "BAG-032", category: "Bags", price: 129, stock: 0, status: "out_of_stock", image: "🎒" },
  { id: 6, name: "Crew Neck Tee", sku: "APR-008", category: "Apparel", price: 35, stock: 200, status: "active", image: "👚" },
  { id: 7, name: "Denim Jacket", sku: "APR-067", category: "Outerwear", price: 149, stock: 18, status: "active", image: "🧥" },
  { id: 8, name: "Running Shorts", sku: "PNT-091", category: "Sportswear", price: 42, stock: 0, status: "draft", image: "🩳" },
];

export const allOrders = [
  { id: "#ORD-1042", customer: "Laura Gómez", email: "laura@example.com", total: 129.90, status: "completed", date: "Mar 14, 2026", items: 3, payment: "card" },
  { id: "#ORD-1041", customer: "Carlos Ruiz", email: "carlos@example.com", total: 89.00, status: "processing", date: "Mar 14, 2026", items: 2, payment: "paypal" },
  { id: "#ORD-1040", customer: "Ana Martínez", email: "ana@example.com", total: 340.50, status: "completed", date: "Mar 13, 2026", items: 5, payment: "card" },
  { id: "#ORD-1039", customer: "David Chen", email: "david@example.com", total: 55.00, status: "pending", date: "Mar 13, 2026", items: 1, payment: "card" },
  { id: "#ORD-1038", customer: "Sofia López", email: "sofia@example.com", total: 210.00, status: "processing", date: "Mar 12, 2026", items: 4, payment: "card" },
  { id: "#ORD-1037", customer: "Miguel Torres", email: "miguel@example.com", total: 78.50, status: "cancelled", date: "Mar 12, 2026", items: 2, payment: "paypal" },
  { id: "#ORD-1036", customer: "Elena Mora", email: "elena@example.com", total: 455.00, status: "completed", date: "Mar 11, 2026", items: 6, payment: "card" },
];

export const allCustomers = [
  { id: 1, name: "Laura Gómez", email: "laura@example.com", orders: 12, spent: "$1,420", joined: "Jan 2025", status: "active" },
  { id: 2, name: "Carlos Ruiz", email: "carlos@example.com", orders: 7, spent: "$890", joined: "Mar 2025", status: "active" },
  { id: 3, name: "Ana Martínez", email: "ana@example.com", orders: 23, spent: "$3,102", joined: "Nov 2024", status: "active" },
  { id: 4, name: "David Chen", email: "david@example.com", orders: 2, spent: "$144", joined: "Feb 2026", status: "active" },
  { id: 5, name: "Sofia López", email: "sofia@example.com", orders: 9, spent: "$1,050", joined: "Aug 2025", status: "active" },
  { id: 6, name: "Miguel Torres", email: "miguel@example.com", orders: 1, spent: "$78", joined: "Mar 2026", status: "blocked" },
];

export const allCategories = [
  { id: 1, name: "Sneakers", slug: "sneakers", products: 14, parent: null, status: "active" },
  { id: 2, name: "Apparel", slug: "apparel", products: 32, parent: null, status: "active" },
  { id: 3, name: "Accessories", slug: "accessories", products: 19, parent: null, status: "active" },
  { id: 4, name: "Bags", slug: "bags", products: 8, parent: "Accessories", status: "active" },
  { id: 5, name: "Outerwear", slug: "outerwear", products: 7, parent: "Apparel", status: "active" },
  { id: 6, name: "Sportswear", slug: "sportswear", products: 11, parent: null, status: "draft" },
];

export const allCoupons = [
  { id: 1, code: "SUMMER20", type: "percent", value: 20, used: 48, limit: 100, expires: "Jun 30, 2026", status: "active" },
  { id: 2, code: "WELCOME10", type: "percent", value: 10, used: 203, limit: null, expires: "Dec 31, 2026", status: "active" },
  { id: 3, code: "FLAT15", type: "fixed", value: 15, used: 19, limit: 50, expires: "Apr 1, 2026", status: "active" },
  { id: 4, code: "BLACK50", type: "percent", value: 50, used: 320, limit: 320, expires: "Nov 29, 2025", status: "expired" },
];

export const cmsPages = [
  { id: 1, title: "About Us", slug: "about-us", status: "published", updated: "Mar 10, 2026" },
  { id: 2, title: "Contact", slug: "contact", status: "published", updated: "Feb 22, 2026" },
  { id: 3, title: "Privacy Policy", slug: "privacy-policy", status: "published", updated: "Jan 5, 2026" },
  { id: 4, title: "Terms of Service", slug: "terms", status: "draft", updated: "Mar 1, 2026" },
  { id: 5, title: "FAQ", slug: "faq", status: "draft", updated: "Mar 14, 2026" },
];

export const allInvoices = [
  { id: "INV-2026-001", order: "#ORD-1042", customer: "Laura Gómez", email: "laura@example.com", amount: 129.90, status: "paid", date: "Mar 14, 2026", due: "Mar 21, 2026" },
  { id: "INV-2026-002", order: "#ORD-1041", customer: "Carlos Ruiz", email: "carlos@example.com", amount: 89.00, status: "paid", date: "Mar 14, 2026", due: "Mar 21, 2026" },
  { id: "INV-2026-003", order: "#ORD-1040", customer: "Ana Martínez", email: "ana@example.com", amount: 340.50, status: "pending", date: "Mar 13, 2026", due: "Mar 20, 2026" },
  { id: "INV-2026-004", order: "#ORD-1039", customer: "David Chen", email: "david@example.com", amount: 55.00, status: "overdue", date: "Mar 1, 2026", due: "Mar 8, 2026" },
  { id: "INV-2026-005", order: "#ORD-1038", customer: "Sofia López", email: "sofia@example.com", amount: 210.00, status: "paid", date: "Mar 12, 2026", due: "Mar 19, 2026" },
  { id: "INV-2026-006", order: "#ORD-1037", customer: "Miguel Torres", email: "miguel@example.com", amount: 78.50, status: "pending", date: "Mar 12, 2026", due: "Mar 19, 2026" },
  { id: "INV-2026-007", order: "#ORD-1036", customer: "Elena Mora", email: "elena@example.com", amount: 455.00, status: "paid", date: "Mar 11, 2026", due: "Mar 18, 2026" },
];
export const allTickets = [
  { id: "TKT-001", subject: "Order not received", customer: "Laura Gómez", email: "laura@example.com", order: "#ORD-1042", priority: "high", status: "open", category: "Shipping", date: "Mar 14, 2026", messages: 2 },
  { id: "TKT-002", subject: "Wrong product received", customer: "Carlos Ruiz", email: "carlos@example.com", order: "#ORD-1041", priority: "high", status: "in_progress", category: "Product", date: "Mar 13, 2026", messages: 4 },
  { id: "TKT-003", subject: "Request refund", customer: "Ana Martínez", email: "ana@example.com", order: "#ORD-1040", priority: "medium", status: "open", category: "Refund", date: "Mar 13, 2026", messages: 1 },
  { id: "TKT-004", subject: "Discount code not working", customer: "David Chen", email: "david@example.com", order: null, priority: "low", status: "resolved", category: "Coupon", date: "Mar 12, 2026", messages: 3 },
  { id: "TKT-005", subject: "Delivery address change", customer: "Sofia López", email: "sofia@example.com", order: "#ORD-1038", priority: "medium", status: "in_progress", category: "Shipping", date: "Mar 12, 2026", messages: 2 },
  { id: "TKT-006", subject: "Product arrived damaged", customer: "Miguel Torres", email: "miguel@example.com", order: "#ORD-1037", priority: "high", status: "open", category: "Product", date: "Mar 11, 2026", messages: 1 },
  { id: "TKT-007", subject: "Invoice copy request", customer: "Elena Mora", email: "elena@example.com", order: "#ORD-1036", priority: "low", status: "resolved", category: "Billing", date: "Mar 10, 2026", messages: 2 },
];

export const carriers = [
  { id: 1, name: "Servientrega", code: "servientrega", logo: servientrega, active: true, coverage: "Nacional", tracking_url: "https://servientrega.com/tracking?guia={tracking}" },
  { id: 2, name: "Coordinadora", code: "coordinadora", logo: coordinadora, active: true, coverage: "Nacional", tracking_url: "https://coordinadora.com/tracking?guia={tracking}" },
  { id: 3, name: "Envíame", code: "enviame", logo: enviame, active: false, coverage: "Nacional + Internacional", tracking_url: "https://enviame.io/tracking/{tracking}" },
  { id: 4, name: "TCC", code: "tcc", logo: tcc, active: false, coverage: "Nacional", tracking_url: "https://tcc.com.co/tracking?guia={tracking}" },
  { id: 5, name: "4-72", code: "472", logo: cuatroSetentaDos, active: false, coverage: "Nacional", tracking_url: "https://4-72.com.co/tracking/{tracking}" },
  { id: 6, name: "FedEx", code: "fedex", logo: fedex, active: false, coverage: "Internacional", tracking_url: "https://fedex.com/tracking?tracknumbers={tracking}" },
  { id: 7, name: "UPS", code: "ups", logo: ups, active: false, coverage: "Internacional", tracking_url: "https://ups.com/track?tracknum={tracking}" },
];

export const shipments = [
  { id: "SHP-001", order: "#ORD-1042", customer: "Laura Gómez", carrier: "Servientrega", tracking: "SRV2026001042", status: "delivered", city: "Bogotá", date: "Mar 14, 2026", eta: "Mar 16, 2026" },
  { id: "SHP-002", order: "#ORD-1041", carrier: "Coordinadora", customer: "Carlos Ruiz", tracking: "CRD2026001041", status: "in_transit", city: "Medellín", date: "Mar 14, 2026", eta: "Mar 17, 2026" },
  { id: "SHP-003", order: "#ORD-1040", carrier: "Servientrega", customer: "Ana Martínez", tracking: "SRV2026001040", status: "in_transit", city: "Cali", date: "Mar 13, 2026", eta: "Mar 16, 2026" },
  { id: "SHP-004", order: "#ORD-1039", carrier: "Coordinadora", customer: "David Chen", tracking: "CRD2026001039", status: "picked_up", city: "Barranquilla", date: "Mar 13, 2026", eta: "Mar 18, 2026" },
  { id: "SHP-005", order: "#ORD-1038", carrier: "Servientrega", customer: "Sofia López", tracking: "SRV2026001038", status: "pending", city: "Bucaramanga", date: "Mar 12, 2026", eta: "Mar 17, 2026" },
  { id: "SHP-006", order: "#ORD-1037", carrier: "TCC", customer: "Miguel Torres", tracking: "TCC2026001037", status: "failed", city: "Pereira", date: "Mar 12, 2026", eta: "Mar 15, 2026" },
];

export const shippingAnalytics = {
  byMonth: [
    { month: "Oct", bogota: 28, medellin: 12, cali: 8,  barranquilla: 5, otros: 4 },
    { month: "Nov", bogota: 35, medellin: 15, cali: 11, barranquilla: 7, otros: 6 },
    { month: "Dic", bogota: 52, medellin: 22, cali: 16, barranquilla: 10, otros: 9 },
    { month: "Ene", bogota: 31, medellin: 14, cali: 9,  barranquilla: 6, otros: 5 },
    { month: "Feb", bogota: 38, medellin: 18, cali: 13, barranquilla: 8, otros: 7 },
    { month: "Mar", bogota: 48, medellin: 22, cali: 18, barranquilla: 12, otros: 10 },
  ],
  byCarrier: [
    { carrier: "Servientrega", entregas: 89, enTransito: 12, fallidos: 3 },
    { carrier: "Coordinadora", entregas: 54, enTransito: 8,  fallidos: 1 },
    { carrier: "TCC",          entregas: 21, enTransito: 3,  fallidos: 2 },
  ],
};
