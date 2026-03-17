# Eccomerce Admin

Panel de administración para el ecommerce. Construido con **React + Vite + TailwindCSS**.

## Stack

- React 18 + React Router v6
- Vite 5
- TailwindCSS 3
- Recharts (gráficas)
- Lucide React (íconos)

## Secciones incluidas

| Sección | Ruta | Descripción |
|---|---|---|
| Dashboard | `/dashboard` | Estadísticas, revenue chart, pedidos recientes |
| Products | `/products` | Lista, búsqueda, filtros, paginación |
| Product Form | `/products/new` | Crear / editar producto con variantes y tags |
| Categories | `/categories` | Árbol de categorías |
| Orders | `/orders` | Lista con tabs por estado |
| Order Detail | `/orders/:id` | Detalle con timeline y notas |
| Customers | `/customers` | Lista con modal de detalle |
| Coupons | `/coupons` | Gestión de descuentos |
| Pages (CMS) | `/pages` | Páginas estáticas |
| Media | `/media` | Biblioteca de archivos (grid/list) |
| Settings | `/settings` | General, pagos, notificaciones, seguridad |

## Roles

- `super_admin` — Tú. Ve todo, gestiona la plataforma.
- `store_admin` — Dueño de tienda. Solo ve su tienda. *(integrar con backend)*

## Instalación

```bash
npm install
npm run dev
# Corre en http://localhost:5174
```

## Login demo

```
Email:    admin@mystore.com
Password: admin123
```

## Conectar con backend

Reemplazar los datos de `src/data/mock.js` con llamadas reales a la API:

```js
// Ejemplo en Products.jsx
const [products, setProducts] = useState([]);

useEffect(() => {
  fetch("https://api.tutienda.com/v1/admin/products", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(r => r.json())
    .then(d => setProducts(d.data));
}, []);
```

## Variables de entorno

```env
VITE_API_URL=http://localhost:3000/v1
```
