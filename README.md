# Ecommerce Admin

Panel de administración profesional multi-tienda para ecommerce. Una aplicación completa construida con React que cubre todos los aspectos de la gestión de un negocio de comercio electrónico: desde productos y pedidos hasta análisis, marketing y soporte al cliente.

## Tabla de Contenidos

- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Visión General de Funcionalidades](#visión-general-de-funcionalidades)
- [Autenticación](#autenticación)
- [Dashboard](#dashboard)
- [Gestión de Catálogo](#gestión-de-catálogo)
- [Gestión de Pedidos](#gestión-de-pedidos)
- [Gestión de Clientes](#gestión-de-clientes)
- [Marketing y Cupones](#marketing-y-cupones)
- [Gestión de Contenido (CMS)](#gestión-de-contenido-cms)
- [Medios y Biblioteca de Archivos](#medios-y-biblioteca-de-archivos)
- [Facturación](#facturación)
- [Envíos y Logística](#envíos-y-logística)
- [Sistema de Tickets](#sistema-de-tickets)
- [Reportes y Análisis](#reportes-y-análisis)
- [Configuración](#configuración)
- [Calendario](#calendario)
- [Componentes Reutilizables](#componentes-reutilizables)
- [Variables de Entorno](#variables-de-entorno)
- [Cómo Conectar con Backend](#cómo-conectar-con-backend)
- [Patrones de Diseño](#patrones-de-diseño)

---

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 18.3.1 | Framework principal de UI |
| **React Router** | 6.26.0 | Navegación y rutas |
| **Vite** | 5.4.1 | Bundling y desarrollo |
| **TailwindCSS** | 3.4.10 | Estilos utility-first |
| **Recharts** | 2.12.7 | Gráficos y visualizaciones |
| **MapLibre GL** | 5.20.1 | Mapas interactivos |
| **GrapesJS** | 0.22.14 | Page builder visual |
| **Lucide React** | 0.446.0 | Sistema de íconos |
| **clsx** | 2.1.1 | Clases condicionales |
| **D3 Scale** | 4.0.2 | Escalado de datos |
| **React Simple Maps** | 3.0.0 | Mapas estáticos |
| **Sileo** | - | Notificaciones toast |
| **Cuelume** | 0.1.2 | Sonidos de notificaciones |

### Tipografía

- **DM Sans**: Fuente principal para interfaz de usuario
- **JetBrains Mono**: Fuente monoespaciada para código y datos

---

## Estructura del Proyecto

```
eccomerce_admin/
├── src/
│   ├── components/
│   │   ├── charts/           # Componentes de gráficos especializados
│   │   │   ├── CustomerMap.jsx
│   │   │   ├── GaugeChart.jsx
│   │   │   ├── RecentOrdersWidget.jsx
│   │   │   └── StatisticsChart.jsx
│   │   ├── layout/           # Componentes de estructura
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Topbar.jsx
│   │   └── ui/               # Componentes UI genéricos
│   │       └── index.jsx
│   ├── data/
│   │   └── mock.js           # Datos de prueba para desarrollo
│   ├── lib/
│   │   ├── api.js             # Cliente API centralizado
│   │   ├── icons.js           # Configuración de íconos
│   │   ├── notifications.js   # Sistema de notificaciones toast con sonidos
│   │   └── sounds.js          # Utilidad de sonidos (Cuelume)
│   ├── pages/                # Todas las páginas de la aplicación
│   │   ├── Login.jsx
│   │   ├── calendar/
│   │   ├── categories/
│   │   ├── cms/
│   │   ├── coupons/
│   │   ├── customers/
│   │   ├── dashboard/
│   │   ├── invoices/
│   │   ├── media/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── reports/
│   │   ├── settings/
│   │   ├── shipping/
│   │   └── tickets/
│   ├── App.jsx               # Router principal
│   ├── index.css             # Estilos globales y sistema de diseño
│   └── main.jsx              # Punto de entrada
├── index.html
├── package.json
├── scripts/
│   └── cuelume-patch.mjs     # Postinstall: parchea exports de Cuelume
├── tailwind.config.js         # Configuración de Tailwind
├── postcss.config.js
└── vite.config.js             # CSP, proxy y plugins
```

---

## Instalación

### Requisitos Previos

- Node.js 18+ 
- npm o yarn

### Pasos

```bash
# Clonar el repositorio
git clone <repository-url>
cd eccomerce_admin

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El servidor de desarrollo estará disponible en `http://localhost:5174`

### Build para Producción

```bash
npm run build
npm run preview  # Previsualizar build
```

---

## Visión General de Funcionalidades

Este admin panel incluye **más de 22 páginas** organizadas en las siguientes áreas funcionales:

| Área | Páginas | Propósito |
|------|---------|-----------|
| **Autenticación** | Login | Inicio de sesión |
| **Dashboard** | Dashboard | Vista general del negocio |
| **Catálogo** | Products, ProductForm, ProductStats, Categories | Gestión de productos y categorías |
| **Pedidos** | Orders, OrderDetail | Gestión de órdenes |
| **Clientes** | Customers, CustomerDetail | Perfiles de clientes |
| **Marketing** | Coupons | Descuentos y promociones |
| **Contenido** | CmsPages, PageBuilder | Páginas y editor visual |
| **Medios** | Media | Biblioteca de archivos |
| **Facturas** | Invoices, InvoiceDetail | Documentación financiera |
| **Envíos** | Shipping, CarrierConfig, ShippingAnalytics | Logística |
| **Tickets** | Tickets, TicketDetail | Soporte al cliente |
| **Reportes** | Reports | Análisis y métricas |
| **Configuración** | Settings, Team, TeamMember, Transportista | Administración |
| **Calendario** | Calendar | Programación de eventos |

---

## Autenticación

### Página: Login (`/login`)

Sistema de autenticación simple con credenciales hardcodeadas para desarrollo.

**Credenciales Demo:**
```
Email:    admin@mystore.com
Password: admin123
```

**Comportamiento:**
- Validación de credenciales en cliente
- Al autenticar exitosamente, guarda `admin_token` en localStorage
- Redirige a `/dashboard` tras login exitoso
- Componente `Layout` verifica existencia de token para proteger rutas

**Flujo de autenticación:**
```
Login → valid credentials → setItem('admin_token', token) → navigate('/dashboard')
Login → invalid credentials → show error message
Protected Route → no token → navigate('/login')
```

---

## Dashboard

### Página: Dashboard (`/dashboard`)

Centro de comando del sistema con métricas clave y visualizaciones.

**KPIs Principales (StatCards):**
- Ingresos del mes (formateados en COP con `Intl.NumberFormat("es-CO")`)
- Total de pedidos
- Nuevos clientes
- Órdenes pendientes

**Visualizaciones:**

| Componente | Tipo | Descripción |
|------------|------|-------------|
| MonthlySalesBar | Bar Chart | Ventas mensuales comparadas con mes anterior |
| OrderStatusPie | Pie Chart | Distribución de estados de pedidos |
| TargetGauge | Gauge | Progreso hacia meta mensual (persistido vía API, % calculado dinámicamente) |
| CustomerMap | Mapa interactivo | Distribución geográfica de clientes en Colombia |
| StatisticsChart | Area Chart | Tendencias de ventas e ingresos por período |

**Widgets Adicionales:**
- **RecentOrdersWidget**: Tabla compacta de últimos 5 pedidos
- **TopProducts**: Lista de 4 productos más vendidos

**Nota:** Todos los montos se muestran en pesos colombianos (COP) usando el formato `es-CO`.

---

## Gestión de Catálogo

### Página: Products (`/products`)

Listado completo del catálogo de productos.

**Funcionalidades:**
- **Búsqueda**: Filtrado por nombre de producto
- **Listado**: Tabla con columnas ordenables (nombre, SKU, stock, precio, estado)
- **Filtros de Estado**: Todos, Activos, Agotados, Borradores
- **Acciones en Lote**: Seleccionar múltiples productos
- **Paginación**: Navegación por páginas

**StatCards de Resumen:**
- Total de productos
- Total de categorías
- Productos agotados
- Borradores

**Tabla de Productos:**
| Columna | Descripción |
|---------|-------------|
| Checkbox | Selección múltiple |
| Producto | Imagen + Nombre + SKU |
| Stock | Cantidad actual |
| Precio | Precio con formato moneda |
| Status | Badge de estado (Activo/Agotado/Borrador) |
| Acciones | Editar, Ver Stats |

### Página: ProductForm (`/products/new`, `/products/:id/edit`)

Formulario completo para crear/editar productos.

**Secciones del Formulario:**

1. **Información Básica**
   - Nombre del producto
   - Descripción
   - Categoría (select)
   - Tags (input con chip de colores)
   - Status (select)

2. **Medios**
   - Zona de drop para imágenes
   - Galería de imágenes subidas
   - Preview de imagen principal

3. **Precios**
   - Precio regular
   - Precio de venta (opcional)
   - Precio de costo

4. **Inventario**
   - SKU
   - Cantidad en stock
   - Tracking de inventario (toggle)

5. **Variantes**
   - Agregar variantes (talla, color, etc.)
   - Precio y stock por variante
   - Imagen por variante

**Validaciones:**
- Campos requeridos
- Formato de precio
- Stock positivo

### Página: ProductStats (`/products/:id/stats`)

Análisis detallado de rendimiento por producto.

**KPIs del Producto:**
- Revenue generado
- Unidades vendidas
- Tasa de conversión
- Rating promedio

**Gráficos:**
- Ventas mensuales (barras)
- Ingresos mensuales (línea)
- Distribución por ciudad (pie)

**Tablas:**
- Performance por variante
- Top clientes compradores

### Página: Categories (`/categories`)

Gestión del árbol de categorías.

**Funcionalidades:**
- Vista jerárquica (padre → hijos)
- CRUD completo (crear, editar, eliminar)
- Slug automático
- Estado (activo/inactivo)
- Reordenamiento visual

**Modal de Edición:**
- Nombre de categoría
- Categoría padre (dropdown)
- Estado (toggle)

---

## Gestión de Pedidos

### Página: Orders (`/orders`)

Centro de gestión de pedidos.

**Filtros por Estado:**
| Estado | Color | Descripción |
|--------|-------|-------------|
| All | - | Todos los pedidos |
| Pending | Yellow | Pendientes de confirmación |
| Processing | Blue | En proceso |
| Completed | Green | Completados |
| Cancelled | Red | Cancelados |

**StatCards:**
- Total de pedidos
- Pendientes
- Procesando
- Entregados

**Tabla de Pedidos:**
| Columna | Descripción |
|---------|-------------|
| ID | Número de pedido |
| Cliente | Nombre |
| Estado | Badge de estado |
| Items | Cantidad de productos |
| Total | Monto total |
| Fecha | Fecha de creación |
| Actions | Ver detalle |

**Funcionalidades:**
- Búsqueda por ID o cliente
- Filtro por estado (tabs)
- Paginación

### Página: OrderDetail (`/orders/:id`)

Vista completa del pedido.

**Estructura:**

1. **Header del Pedido**
   - ID y fecha
   - Estado actual
   - Acciones rápidas (cambiar estado)

2. **Timeline Vertical**
   - Orden de estados cronológicos
   - Timestamps por cada cambio
   - Indicador visual de progreso

3. **Información del Cliente**
   - Nombre y email
   - Teléfono
   - Fecha de registro

4. **Dirección de Envío**
   - Ciudad
   - Dirección completa
   - Código postal

5. **Método de Pago**
   - Tipo de pago usado
   - Últimos 4 dígitos (si aplica)

6. **Items del Pedido**
   - Tabla con producto, cantidad, precio
   - Subtotal, envío, total

7. **Notas**
   - Notas internas del pedido
   - Historial de notas agregadas

---

## Gestión de Clientes

### Página: Customers (`/customers`)

Directorio de clientes registrados.

**Funcionalidades:**
- Búsqueda por nombre/email
- Filtro por estado
- Modal de vista rápida
- Estadísticas generales

**StatCards:**
- Total de clientes
- Nuevos (este mes)
- Activos
- Inactivos

**Tabla de Clientes:**
| Columna | Descripción |
|---------|-------------|
| Cliente | Avatar + Nombre + Email |
| Teléfono | Número de contacto |
| Pedidos | Cantidad total |
| Total Gastado | Suma de todas las compras |
| Último pedido | Fecha |
| Estado | Badge (Activo/Inactivo) |
| Acciones | Ver detalle |

**Modal de Detalle Rápido:**
- Avatar e info básica
- Total gastado
- Órdenes
- Valor promedio
- Contacto

### Página: CustomerDetail (`/customers/:id`)

Perfil completo del cliente.

**KPIs Personales:**
- Total gastado
- Número de pedidos
- Valor promedio por pedido
- Miembro desde

**Gráficos:**
- MonthlySpendChart: Área chart con gastos mensuales

**Información:**
- Datos personales
- Fecha de registro
- Última actividad

**Historial:**
- Tabla de pedidos del cliente
- Productos favoritos
- Gráfico de productos más comprados

**Métricas Avanzadas:**
- Tasa de retención
- NPS (Net Promoter Score)

---

## Marketing y Cupones

### Página: Coupons (`/coupons`)

Gestión de códigos de descuento.

**StatCards:**
- Total de cupones
- Activos
- Usados
- Disponibles

**Funcionalidades:**
- Crear nuevo cupón (modal)
- Tipos: Porcentaje, Monto fijo, Envío gratis
- Límite de usos (numérico o ilimitado)
- Fecha de expiración
- Valor mínimo de compra
- Copiar código al portapapeles

**Tabla de Cupones:**
| Columna | Descripción |
|---------|-------------|
| Código | Código con botón copiar |
| Tipo | Porcentaje/Monto/Envío |
| Valor | Descuento aplicado |
| Uso | Usados / Límite |
| Vence | Fecha de expiración |
| Estado | Badge (Activo/Expirado) |
| Acciones | Editar/Eliminar |

---

## Gestión de Contenido (CMS)

### Página: CmsPages (`/pages`)

Listado de páginas estáticas del sitio.

**Funcionalidades:**
- Crear nueva página
- Editar página existente
- Eliminar página
- Publicar/despublicar

**Tabla de Páginas:**
| Columna | Descripción |
|---------|-------------|
| Título | Nombre de la página |
| slug | URL amigable |
| Estado | Badge (Publicado/Borrador) |
| Actualizado | Fecha de última modificación |
| Acciones | Editar, Builder, Eliminar |

### Página: PageBuilder (`/pages/:id/edit`)

Editor visual de páginas con GrapesJS.

**Funcionalidades del Builder:**

1. **Barra de Herramientas**
   - Vista previa (Desktop/Tablet/Mobile)
   - Deshacer/Rehacer
   - Guardar
   - Exportar HTML

2. **Bloques Disponibles**
   - Hero Section (encabezado completo)
   - 3 Columnas (grid de contenido)
   - CTA Button (botón de llamada a la acción)
   - Image + Text (combinación multimedia)
   - Testimonial (reseña/testimonio)
   - Contact Form (formulario de contacto)

3. **Paneles de Gestión**
   - **Layers**: Jerarquía de elementos
   - **Styles**: Propiedades CSS visuales
   - **Traits**: Configuración de atributos

4. **Exportación**
   - Exportar como HTML
   - Exportar como JSON (para guardar)

---

## Medios y Biblioteca de Archivos

### Página: Media (`/media`)

Biblioteca de archivos multimedia.

**Vistas:**
- **Grid**: Visualización en tarjetas con preview
- **List**: Vista detallada en tabla

**Funcionalidades:**
- Subida por drag & drop
- Subida por botón tradicional
- Preview de archivos
- Eliminar archivos
- Toggle entre vistas

**Tabla/List View:**
| Columna | Descripción |
|---------|-------------|
| Preview | Thumbnail del archivo |
| Nombre | Nombre del archivo |
| Tipo | Extensión |
| Tamaño | Peso del archivo |
| Fecha | Fecha de subida |
| Acciones | Eliminar |

---

## Facturación

### Página: Invoices (`/invoices`)

Gestión de facturas del sistema.

**Filtros por Estado:**
| Estado | Color | Descripción |
|--------|-------|-------------|
| All | - | Todas |
| Paid | Green | Pagadas |
| Pending | Yellow | Pendientes |
| Overdue | Red | Vencidas |

**StatCards:**
- Total de facturas
- Total pagado
- Pendiente
- Vencido

**Tabla de Facturas:**
| Columna | Descripción |
|---------|-------------|
| Factura | Número correlativo |
| Cliente | Nombre |
| Amount | Monto total |
| Status | Badge de estado |
| Fecha | Fecha de emisión |
| Vence | Fecha de vencimiento |
| Acciones | Ver detalle |

### Página: InvoiceDetail (`/invoices/:id`)

Vista completa de factura (documento).

**Componentes del Documento:**

1. **Header de Empresa**
   - Logo
   - Nombre
   - Dirección
   - Teléfono

2. **Información de Factura**
   - Número
   - Fecha de emisión
   - Fecha de vencimiento
   - Términos de pago

3. **Bill To (Cliente)**
   - Nombre
   - Empresa
   - Dirección
   - Email

4. **Tabla de Ítems**
   - Descripción
   - Cantidad
   - Precio unitario
   - Subtotal

5. **Totales**
   - Subtotal
   - Impuesto (19% IVA)
   - Total

**Acciones:**
- Imprimir
- Enviar por email
- Descargar PDF

---

## Envíos y Logística

### Página: Shipping (`/shipping`)

Gestión centralizada de envíos.

**Filtros por Estado:**
| Estado | Descripción |
|--------|-------------|
| All | Todos los envíos |
| Processing | En proceso |
| Shipped | Enviados |
| Delivered | Entregados |
| Returned | Devueltos |

**Carriers Soportados:**
- Servientrega
- Coordinara
- Envíame
- TCC
- 4-72
- FedEx
- UPS

**Funcionalidades:**
- Ver todos los envíos por carrier
- Tracking de estado
- Enlaces a rastreo externo
- Analytics de envíos

### Página: CarrierConfig (`/settings/carrier/:code`)

Configuración de credenciales API por carrier.

**Campos:**
- Sandbox/Production toggle
- API Key
- API Secret
- Contraseña (con visibilidad toggle)

**Funcionalidades:**
- Test de conexión
- Toggle de habilitación
- Guardar configuración

### Página: ShippingAnalytics (`/shipping/analytics`)

Análisis de logística.

**Gráficos:**
- MonthlyShipments: Barras mensuales
- CarrierPerformance: Comparativa de carriers
- TopCities: Ciudades con más envíos

---

## Sistema de Tickets

### Página: Tickets (`/tickets`)

Centro de soporte al cliente.

**Filtros por Estado:**
| Estado | Color | Descripción |
|--------|-------|-------------|
| All | - | Todos |
| Open | Red | Abiertos |
| In Progress | Yellow | En proceso |
| Resolved | Green | Resueltos |

**StatCards:**
- Total de tickets
- Abiertos
- En proceso
- Resueltos

**Tabla de Tickets:**
| Columna | Descripción |
|---------|-------------|
| ID | Número de ticket |
| Asunto | Título del ticket |
| Cliente | Nombre del cliente |
| Prioridad | Badge (Low/Medium/High/Critical) |
| Estado | Badge de estado |
| Categoría | Tipo de consulta |
| Mensajes | Conteo de mensajes |
| Creado | Fecha |

### Página: TicketDetail (`/tickets/:id`)

Conversación detallada del ticket.

**Diseño:**
- Chat-style con burbujas de mensaje
- Mensajes del cliente (izquierda)
- Respuestas del admin (derecha)
- Timestamps por mensaje

**Panel de Info:**
- Estado actual
- Prioridad
- Categoría
- Cliente info
- Orden relacionada (si existe)

**Acciones Rápidas:**
- Ver orden
- Emitir reembolso
- Cerrar ticket

**Compositor de Respuesta:**
- Textarea expandible
- Enviar con Enter
- Guardar respuesta

---

## Reportes y Análisis

### Página: Reports (`/reports`)

Centro de analytics con múltiples pestañas.

**Pestañas:**

1. **Sales (Ventas)**
   - Tendencias (semanal/mensual/trimestral/anual)
   - Funnel de conversión
   - Patrones por día de semana
   - Gráfico de área con revenue

2. **Products (Productos)**
   - Top vendedores (tabla)
   - Chart radar por categoría
   - Productos más rentables

3. **Customers (Clientes)**
   - Segmentación de clientes
   - LTV (Lifetime Value) por cliente

4. **Payments (Pagos)**
   - Métodos de pago (pie chart)
   - Tasas de falla
   - Razones de fallo

5. **Coupons (Cupones)**
   - ROI por cupón
   - Efectividad de descuentos
   - Uso vs. ahorro generado

6. **Inventory (Inventario)**
   - Niveles de riesgo
   - Productos en Stock bajo
   - Urgencia de reorden

---

## Configuración

### Página: Settings (`/settings`)

Panel de configuración general con tabs.

**Pestañas:**

1. **General**
   - Nombre de la tienda
   - URL del sitio
   - Moneda (COP/USD/EUR)
   - Zona horaria

2. **Payments**
   - Toggle para Stripe/PayPal
   - Campos de API keys
   - Modo sandbox/production

3. **Notifications**
   - Toggle para tipos de notificación
   - Toggle de sonidos en notificaciones (usando Cuelume)
   - Cada toast reproduce un sonido al aparecer
   - Email de notificaciones
   - Alertas de stock bajo

4. **Security**
   - Cambio de contraseña
   - Habilitar 2FA

5. **Appearance**
   - Selector de color primario
   - Logo de la tienda

6. **Billing**
   - Plan actual
   - Comparación de planes
   - Historial de facturas
   - Método de pago

### Página: Team (`/settings/team`)

Gestión de miembros del equipo.

**Roles Disponibles:**
| Rol | Descripción |
|-----|-------------|
| Owner | Propietario, acceso total |
| Admin | Administrador |
| Operator | Operador |
| Viewer | Solo lectura |

**Funcionalidades:**
- Invitar nuevo miembro
- Editar rol
- Eliminar miembro
- Matriz de permisos visual

**Tarjetas de Miembros:**
- Avatar
- Nombre y email
- Rol
- Stats (pedidos, envíos, tickets, cupones)

### Página: TeamMember (`/settings/team/:id`)

Detalle individual de miembro.

**Contenido:**
- ActivityChart: Gráfico semanal de actividad
- ActivityLog: Timeline de acciones
- Stats: KPIs del miembro

### Página: Transportista (`/settings/transportation`)

Configuración de transportistas.

**Funcionalidades:**
- Toggle de habilitación por carrier
- Carrier por defecto
- Enlace a configuración avanzada

---

## Calendario

### Página: Calendar (`/calendar`)

Calendario de eventos construido con **DayFlow**. Vista mensual con grid responsivo.

**Funcionalidades:**
- Navegación entre meses
- Vista de cuadrícula mensual con eventos
- Crear, editar y eliminar eventos (modal con formulario completo)
- Filtro por tipo de evento

**Modal de Evento:**
- Título
- Tipo (Cupón / Venta / Envío / Recordatorio)
- Fecha de inicio y fin
- Descripción
- Recordatorio (toggle)

---

## Componentes Reutilizables

### Layout Components

| Componente | Descripción |
|------------|-------------|
| **Layout** | Contenedor principal con sidebar + topbar + contenido |
| **Sidebar** | Navegación lateral colapsable con grupos de menú |
| **Topbar** | Header con búsqueda, toggles y avatar de usuario |

### UI Components

| Componente | Props | Uso |
|------------|-------|-----|
| **StatusBadge** | status, children | Badges de estado con colores predefinidos |
| **StatCard** | label, value, change | Tarjetas de métricas con indicador de cambio |
| **EmptyState** | icon, title, description, action | Estado vacío con acción |
| **Modal** | isOpen, onClose, title, children | Ventana modal genérica |
| **SearchInput** | value, onChange, placeholder | Input de búsqueda |
| **Pagination** | currentPage, totalPages, onPageChange | Controles de paginación |

### Chart Components

| Componente | Tipo | Descripción |
|------------|------|-------------|
| **GaugeChart** | SVG | Anillo circular de progreso hacia meta mensual (target persistido vía API) |
| **StatisticsChart** | Recharts | Área dual (ventas + revenue) |
| **CustomerMap** | MapLibre | Mapa interactivo de Colombia con filtros por estado |
| **RecentOrdersWidget** | Tabla | Widget de pedidos recientes con filtro por estado |

---

## Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# URL base de la API
VITE_API_URL=http://localhost:3000/v1

# Entorno
VITE_ENV=development
```

---

## Cómo Conectar con Backend

### Paso 1: Identificar Datos Mock

Todos los datos de prueba están en `src/data/mock.js`. Este archivo contiene:

```javascript
// Ejemplos de datos mock
export const allProducts = [...]
export const allOrders = [...]
export const allCustomers = [...]
export const statsData = {...}
```

### Paso 2: Crear Servicios API

Crear una capa de servicios en `src/services/`:

```javascript
// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
  'Content-Type': 'application/json'
});

export const api = {
  // Productos
  async getProducts() {
    const res = await fetch(`${API_URL}/products`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },
  
  async createProduct(data) {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  // ... más endpoints
};
```

### Paso 3: Reemplazar en Componentes

**Ejemplo: Products.jsx**

```jsx
// Antes (mock data)
useEffect(() => {
  setProducts(allProducts);
}, []);

// Después (API real)
useEffect(() => {
  api.getProducts()
     .then(data => setProducts(data.data))
     .catch(error => toast.error('Error cargando productos'));
}, []);
```

### Paso 4: Agregar Loading States

```jsx
const [loading, setLoading] = useState(true);

useEffect(() => {
  setLoading(true);
  api.getProducts()
     .then(data => {
       setProducts(data.data);
       setLoading(false);
     });
}, []);
```

### Paso 5: Manejar Errores

```jsx
// En cada llamada API
try {
  const data = await api.getProducts();
  setProducts(data.data);
} catch (error) {
  toast.error('Error al cargar productos');
  // Quizás redirigir si no está autenticado
  if (error.status === 401) {
    navigate('/login');
  }
}
```

---

## Patrones de Diseño

### Arquitectura de Páginas

Cada sección sigue el patrón **List → Detail**:

```
/products          → Lista de productos
/products/:id      → Detalle (integrado en form)

/orders            → Lista de pedidos
/orders/:id        → Detalle completo

/customers         → Lista de clientes
/customers/:id     → Perfil detallado
```

### Estructura de Páginas

Las páginas siguen una estructura consistente:

```jsx
export default function PageName() {
  // 1. Estado local
  const [data, setData] = useState([]);
  
  // 2. Efectos (carga de datos)
  useEffect(() => { ... }, []);
  
  // 3. Handlers
  const handleAction = () => { ... };
  
  // 4. Render
  return (
    <Layout>
      <div className="page-header">
        <h1>Título</h1>
        <Button>Acción</Button>
      </div>
      
      {/* StatCards */}
      <div className="stats-grid">
        <StatCard ... />
      </div>
      
      {/* Filtros/Búsqueda */}
      <div className="filters">
        <SearchInput ... />
        <Tabs ... />
      </div>
      
      {/* Contenido principal */}
      <Table ... />
      
      {/* Paginación */}
      <Pagination ... />
    </Layout>
  );
}
```

### Sistema de Colores para Estados

| Estado | Color | Uso |
|--------|-------|-----|
| Success | `#10B981` (green) | Completado, Pagado, Activo |
| Warning | `#F59E0B` (yellow) | Pendiente, En Proceso |
| Error | `#EF4444` (red) | Cancelado, Agotado, Overdue |
| Info | `#3B82F6` (blue) | Procesando, Información |
| Neutral | `#6B7280` (gray) | Borrador, Inactivo |

### Clases CSS del Sistema de Diseño

| Clase | Descripción |
|-------|-------------|
| `.card` | Contenedor con fondo y borde |
| `.btn` | Botón base |
| `.btn-primary` | Botón primario |
| `.btn-secondary` | Botón secundario |
| `.btn-danger` | Botón de peligro |
| `.input` | Campo de formulario |
| `.table-wrap` | Wrapper para tablas |
| `.badge` | Etiqueta de estado |
| `.nav-link` | Enlace de navegación |

---

## Login Demo

```
Email:    admin@mystore.com
Password: admin123
```

---

## Licencia

Este proyecto es parte del sistema EcomAdmin.
