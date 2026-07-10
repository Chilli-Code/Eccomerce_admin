import { useState } from "react";
import { ChevronRight, Image, Layout, MessageCircle, ShoppingBag, Star, FileText, Phone, Heart, MapPin, Clock, Users, ChevronDown } from "../../lib/icons.js";

// Catálogo de widgets disponibles
const WIDGETS_CATALOG = [
  {
    id: "hero",
    name: "Hero / Banner principal",
    icon: Layout,
    description: "Sección principal con título, subtítulo e imagen",
    category: "Hero",
    preview: "https://placehold.co/400x200/4f46e5/white?text=Hero+Section",
    fields: [
      { name: "title", label: "Título principal", type: "text", default: "Bienvenidos a nuestra tienda" },
      { name: "subtitle", label: "Subtítulo", type: "text", default: "Los mejores productos al mejor precio" },
      { name: "image", label: "Imagen de fondo", type: "image", default: "/images/hero-default.jpg" },
      { name: "cta_text", label: "Texto del botón", type: "text", default: "Comprar ahora" },
      { name: "cta_link", label: "Enlace del botón", type: "url", default: "/products" },
      { name: "background_color", label: "Color de fondo", type: "color", default: "#f5f5f5" },
    ]
  },
  {
    id: "accordion",
    name: "Acordeón / FAQ",
    icon: MessageCircle,
    description: "Preguntas frecuentes con despliegue",
    category: "Contenido",
    preview: "https://placehold.co/400x200/10b981/white?text=Accordion",
    fields: [
      { name: "title", label: "Título de la sección", type: "text", default: "Preguntas frecuentes" },
      { name: "items", label: "Preguntas y respuestas", type: "repeater", default: [
        { question: "¿Cómo comprar?", answer: "Selecciona el producto y añade al carrito" },
        { question: "¿Hacen envíos?", answer: "Sí, a todo el país" },
        { question: "¿Aceptan devoluciones?", answer: "30 días para cambios" }
      ] }
    ]
  },
  {
    id: "products",
    name: "Productos destacados",
    icon: ShoppingBag,
    description: "Muestra productos seleccionados",
    category: "E-commerce",
    preview: "https://placehold.co/400x200/3b82f6/white?text=Products+Grid",
    fields: [
      { name: "title", label: "Título", type: "text", default: "Productos destacados" },
      { name: "limit", label: "Cantidad de productos", type: "number", default: 6 },
      { name: "category", label: "Categoría (opcional)", type: "category_select", default: "" },
      { name: "layout", label: "Diseño", type: "select", options: ["grid", "slider"], default: "grid" },
      { name: "show_prices", label: "Mostrar precios", type: "checkbox", default: true },
    ]
  },
  {
    id: "testimonials",
    name: "Testimonios",
    icon: Star,
    description: "Opiniones de clientes",
    category: "Social",
    preview: "https://placehold.co/400x200/f59e0b/white?text=Testimonials",
    fields: [
      { name: "title", label: "Título", type: "text", default: "Lo que dicen nuestros clientes" },
      { name: "items", label: "Testimonios", type: "repeater", default: [
        { name: "Juan Pérez", comment: "Excelente servicio!", rating: 5, avatar: "" },
        { name: "María García", comment: "Productos de calidad", rating: 5, avatar: "" }
      ] }
    ]
  },
  {
    id: "banner",
    name: "Banner promocional",
    icon: Image,
    description: "Imagen con texto y botón",
    category: "Promociones",
    preview: "https://placehold.co/400x200/ef4444/white?text=Banner",
    fields: [
      { name: "title", label: "Título", type: "text", default: "Oferta especial" },
      { name: "subtitle", label: "Subtítulo", type: "text", default: "20% de descuento" },
      { name: "image", label: "Imagen", type: "image", default: "/images/banner.jpg" },
      { name: "link", label: "Enlace", type: "url", default: "/products" },
      { name: "button_text", label: "Texto del botón", type: "text", default: "Ver oferta" },
    ]
  },
  {
    id: "contact_form",
    name: "Formulario de contacto",
    icon: Phone,
    description: "Formulario para que los clientes te contacten",
    category: "Formularios",
    preview: "https://placehold.co/400x200/8b5cf6/white?text=Contact+Form",
    fields: [
      { name: "title", label: "Título", type: "text", default: "Contáctanos" },
      { name: "email", label: "Correo de destino", type: "email", default: "contacto@tienda.com" },
      { name: "show_phone", label: "Mostrar teléfono", type: "checkbox", default: true },
      { name: "phone", label: "Teléfono", type: "text", default: "+57 300 123 4567" },
      { name: "show_address", label: "Mostrar dirección", type: "checkbox", default: true },
      { name: "address", label: "Dirección", type: "text", default: "Calle 123, Barranquilla" },
    ]
  },
  {
    id: "map",
    name: "Mapa de ubicación",
    icon: MapPin,
    description: "Google Maps con tu ubicación",
    category: "Ubicación",
    preview: "https://placehold.co/400x200/ec489a/white?text=Map",
    fields: [
      { name: "title", label: "Título", type: "text", default: "Nuestra ubicación" },
      { name: "address", label: "Dirección", type: "text", default: "Barranquilla, Colombia" },
      { name: "zoom", label: "Zoom", type: "number", default: 15 },
      { name: "show_button", label: "Mostrar botón de ruta", type: "checkbox", default: true },
    ]
  },
  {
    id: "social_links",
    name: "Redes sociales",
    icon: Heart,
    description: "Enlaces a tus redes sociales",
    category: "Social",
    preview: "https://placehold.co/400x200/14b8a6/white?text=Social+Links",
    fields: [
      { name: "title", label: "Título", type: "text", default: "Síguenos" },
      { name: "items", label: "Redes sociales", type: "repeater", default: [
        { platform: "facebook", url: "https://facebook.com/tutienda" },
        { platform: "instagram", url: "https://instagram.com/tutienda" },
        { platform: "whatsapp", url: "https://wa.me/573001234567" }
      ] }
    ]
  }
];

// Componente para editar campos
function FieldEditor({ field, value, onChange, categories }) {
  switch (field.type) {
    case "text":
    case "url":
    case "email":
      return (
        <input
          type={field.type}
          value={value || field.default}
          onChange={(e) => onChange(e.target.value)}
          className="input text-sm"
          placeholder={field.label}
        />
      );
    
    case "number":
      return (
        <input
          type="number"
          value={value || field.default}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="input text-sm"
        />
      );
    
    case "color":
      return (
        <div className="flex gap-2">
          <input
            type="color"
            value={value || field.default}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded border border-gray-200"
          />
          <input
            type="text"
            value={value || field.default}
            onChange={(e) => onChange(e.target.value)}
            className="input text-sm flex-1"
          />
        </div>
      );
    
    case "select":
      return (
        <select
          value={value || field.default}
          onChange={(e) => onChange(e.target.value)}
          className="input text-sm"
        >
          {field.options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    
    case "category_select":
      return (
        <select
          value={value || field.default}
          onChange={(e) => onChange(e.target.value)}
          className="input text-sm"
        >
          <option value="">Todas las categorías</option>
          {categories?.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      );
    
    case "checkbox":
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={value ?? field.default}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300"
          />
          <span className="text-xs text-gray-600">{field.label}</span>
        </label>
      );
    
    case "image":
      return (
        <div className="space-y-2">
          {value && (
            <img src={value} alt="Preview" className="w-full h-24 object-cover rounded-lg" />
          )}
          <input
            type="text"
            value={value || field.default}
            onChange={(e) => onChange(e.target.value)}
            className="input text-sm"
            placeholder="URL de la imagen"
          />
        </div>
      );
    
    case "repeater":
      return (
        <div className="space-y-2">
          {Array.isArray(value) && value.map((item, idx) => (
            <div key={idx} className="border rounded-lg p-3 bg-gray-50">
              {Object.keys(item).map(key => (
                <div key={key} className="mb-2">
                  <label className="text-xs text-gray-500 capitalize mb-1 block">{key}</label>
                  <input
                    type="text"
                    value={item[key]}
                    onChange={(e) => {
                      const newItems = [...value];
                      newItems[idx][key] = e.target.value;
                      onChange(newItems);
                    }}
                    className="input text-sm"
                  />
                </div>
              ))}
              <button
                onClick={() => onChange(value.filter((_, i) => i !== idx))}
                className="text-xs text-red-500 hover:text-red-700 mt-2"
              >
                Eliminar
              </button>
            </div>
          ))}
          <button
            onClick={() => onChange([...value, {}])}
            className="text-xs text-primary-600 hover:text-primary-700 mt-1"
          >
            + Agregar elemento
          </button>
        </div>
      );
    
    default:
      return null;
  }
}

// Componente principal
export default function WidgetSelector({ onSelectWidget, categories }) {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  const categoryList = ["Todos", ...new Set(WIDGETS_CATALOG.map(w => w.category))];
  
  const filteredWidgets = WIDGETS_CATALOG.filter(w => {
    const matchesCategory = selectedCategory === "Todos" || w.category === selectedCategory;
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Widgets disponibles</h3>
        <input
          type="text"
          placeholder="Buscar widget..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input text-sm w-full"
        />
      </div>

      {/* Categorías */}
      <div className="flex overflow-x-auto gap-1 p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? "bg-primary-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lista de widgets */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredWidgets.map(widget => (
          <div
            key={widget.id}
            onClick={() => onSelectWidget(widget)}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 cursor-pointer hover:border-primary-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                <widget.icon size={18} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-600">
                  {widget.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {widget.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500">
                    {widget.category}
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-primary-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}