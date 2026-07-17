const BASE = import.meta.env.VITE_API_URL;

// Helper base
async function request(path, options = {}) {
  const token = localStorage.getItem("admin_token");

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Error en la petición");
  }

  return data;
}

// ── Auth ──────────────────────────────────────
export const api = {
  auth: {
    login:  (email, password)  => request("/auth/login",  { method: "POST", body: JSON.stringify({ email, password }) }),
    me:     ()                 => request("/auth/me"),
    logout: ()                 => request("/auth/logout", { method: "POST" }),
  },

  // ── Products ──────────────────────────────
products: {
  list:          (params = {})  => request(`/products?${new URLSearchParams(params)}`),
  get:           (id)           => request(`/products/${id}`),
  create:        (data)         => request("/products",    { method: "POST",   body: JSON.stringify(data) }),
  update:        (id, data)     => request(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete:        (id)           => request(`/products/${id}`, { method: "DELETE" }),
  createVariant: (id, data)     => request(`/products/${id}/variants`, { method: "POST", body: JSON.stringify(data) }),
  getVariants:   (id)           => request(`/products/${id}/variants`),
  deleteVariant: (productId, variantId) => request(`/products/${productId}/variants/${variantId}`, { method: "DELETE" }),
  updateVariant: (productId, variantId, data) => request(`/products/${productId}/variants/${variantId}`, { method: "PUT", body: JSON.stringify(data) }), // ← aquí adentro
},

  // ── Categories ────────────────────────────
  categories: {
    list:    ()                => request("/categories"),
    create:  (data)            => request("/categories",  { method: "POST", body: JSON.stringify(data) }),
    update:  (id, data)        => request(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete:  (id)              => request(`/categories/${id}`, { method: "DELETE" }),
  },

  // ── Customers ─────────────────────────────
  customers: {
    list:    (params = {})     => request(`/customers?${new URLSearchParams(params)}`),
    get:     (id)              => request(`/customers/${id}`),
    create:  (data)            => request("/customers",   { method: "POST", body: JSON.stringify(data) }),
    update:  (id, data)        => request(`/customers/${id}`, { method: "PUT",  body: JSON.stringify(data) }),
    delete:  (id)              => request(`/customers/${id}`, { method: "DELETE" }),
  },

  // ── Orders ────────────────────────────────
  orders: {
    list:         (params = {}) => request(`/orders?${new URLSearchParams(params)}`),
    get:          (id)          => request(`/orders/${id}`),
    create:       (data)        => request("/orders",     { method: "POST",  body: JSON.stringify(data) }),
    updateStatus: (id, status)  => request(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  },

  // ── Tickets ───────────────────────────────
  tickets: {
    list:         (params = {}) => request(`/tickets?${new URLSearchParams(params)}`),
    get:          (id)          => request(`/tickets/${id}`),
    create:       (data)        => request("/tickets",    { method: "POST",  body: JSON.stringify(data) }),
    updateStatus: (id, status)  => request(`/tickets/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
    getMessages:  (id)          => request(`/tickets/${id}/messages`),
    addMessage:   (id, data)    => request(`/tickets/${id}/messages`, { method: "POST", body: JSON.stringify(data) }),
  },

  // ── Shipping ──────────────────────────────
  shipping: {
    list:         (params = {}) => request(`/shipping?${new URLSearchParams(params)}`),
    get:          (id)          => request(`/shipping/${id}`),
    create:       (data)        => request("/shipping",   { method: "POST",  body: JSON.stringify(data) }),
    updateStatus: (id, status)  => request(`/shipping/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  },

  // ── Reports ───────────────────────────────
  reports: {
    dashboard: ()              => request("/reports/dashboard"),
    sales:     (params = {})   => request(`/reports/sales?${new URLSearchParams(params)}`),
    products:  ()              => request("/reports/products"),
    customers: ()              => request("/reports/customers"),
    geo:       ()              => request("/reports/geo/cities"),
    geoOrders: ()              => request("/reports/geo/orders"),
  },

  // ── Invoices ──────────────────────────────
  invoices: {
    list:         ()            => request("/invoices"),
    get:          (id)          => request(`/invoices/${id}`),
    create:       (data)        => request("/invoices",   { method: "POST",  body: JSON.stringify(data) }),
    updateStatus: (id, status)  => request(`/invoices/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  },

  // ── Pages (CMS) ───────────────────────────
  pages: {
    list:    ()                => request("/pages"),
    get:     (slug)            => request(`/pages/${slug}`),
    create:  (data)            => request("/pages",       { method: "POST", body: JSON.stringify(data) }),
    update:  (id, data)        => request(`/pages/${id}`, { method: "PUT",  body: JSON.stringify(data) }),
    delete:  (id)              => request(`/pages/${id}`, { method: "DELETE" }),
  },

  // ── Media ─────────────────────────────────
  media: {
    list:    ()                => request("/media"),
    delete:  (id)              => request(`/media/${id}`, { method: "DELETE" }),
  },

  // ── Calendar ──────────────────────────────
  calendar: {
    list:    ()                => request("/calendar"),
    create:  (data)            => request("/calendar",    { method: "POST",   body: JSON.stringify(data) }),
    update:  (id, data)        => request(`/calendar/${id}`, { method: "PUT", body: JSON.stringify(data) }), 
    delete:  (id)              => request(`/calendar/${id}`, { method: "DELETE" }),
  },

  // ── Users (Equipo) ────────────────────────
users: {
  list:         ()         => request("/users"),
  invite:       (data)     => request("/users/invite",       { method: "POST", body: JSON.stringify(data) }),
  updateRole:   (id, role) => request(`/users/${id}/role`,   { method: "PUT",  body: JSON.stringify({ role }) }),
  updateStatus: (id, status) => request(`/users/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
  delete:       (id)       => request(`/users/${id}`,        { method: "DELETE" }),
},

settings: {
  get: () => request("/settings"),
  update: (data) => request("/settings", { method: "PUT", body: JSON.stringify(data) }),
  testStripe: (data) => request("/settings/test-stripe", { 
    method: "POST", 
    body: JSON.stringify(data) 
  }),
  testBold: (data) => request("/settings/test-bold", { 
    method: "POST", 
    body: JSON.stringify(data) 
  }),
},

// ── Widgets ──────────────────────────────
widgets: {
  list:     ()                => request("/widgets"),
  get:      (id)              => request(`/widgets/${id}`),
  create:   (data)            => request("/widgets/upload", { method: "POST", body: data, headers: {} }),
  update:   (id, data)        => request(`/widgets/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete:   (id)              => request(`/widgets/${id}`, { method: "DELETE" }),
  uploadBundle: (id, file)    => {
    const form = new FormData();
    form.append("file", file);
    return fetch(`${BASE}/widgets/${id}/bundle`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      body: form,
    }).then(async r => { const d = await r.json(); if (!r.ok) throw new Error(d.error); return d; });
  },
  uploadNew: (metadata, file) => {
    const form = new FormData();
    for (const [k, v] of Object.entries(metadata)) form.append(k, v);
    if (file) form.append("file", file);
    return fetch(`${BASE}/widgets/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      body: form,
    }).then(async r => { const d = await r.json(); if (!r.ok) throw new Error(d.error || JSON.stringify(d)); return d; });
  },
},
storeWidgets: {
  list:     ()                => request("/store-widgets"),
  create:   (data)            => request("/store-widgets", { method: "POST", body: JSON.stringify(data) }),
  update:   (id, data)        => request(`/store-widgets/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete:   (id)              => request(`/store-widgets/${id}`, { method: "DELETE" }),
},

// ── Coupons ───────────────────────────────
coupons: {
  list:     ()               => request("/coupons"),
  create:   (data)           => request("/coupons",     { method: "POST", body: JSON.stringify(data) }),
  update:   (id, data)       => request(`/coupons/${id}`, { method: "PUT", body: JSON.stringify(data) }), // 👈 AGREGAR ESTA LÍNEA
  validate: (code)           => request("/coupons/validate", { method: "POST", body: JSON.stringify({ code }) }),
  delete:   (id)             => request(`/coupons/${id}`,    { method: "DELETE" }),
},
};

