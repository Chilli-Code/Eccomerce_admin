import { useState, useEffect } from "react";
import { ChevronDown, Save, Plus, X, Image, Upload, Loader } from "../../lib/icons.js";
import { api } from "../../lib/api.js";
import { notify } from "../../lib/notifications.js";
import ImagePickerModal from "./ImagePickerModal.jsx";

const DEFAULT_SITE_CONTENT = {
  header: {
    promoBanner: "Sign up and get 20% off for all new-season collections",
    socialLinks: [
      { name: "Instagram", url: "#" },
      { name: "Twitter", url: "#" },
      { name: "YouTube", url: "#" },
    ],
  },
  navLinks: [
    { name: "INICIO", href: "/", subMenu: [] },
    { name: "PRODUCTOS", href: "/products", subMenu: ["Fundas & Forros", "Cargadores MagSafe", "AirPods", "Protectores de pantalla"] },
    { name: "SERVICIOS", href: "/#services", subMenu: [] },
    { name: "OFERTAS", href: "/product", subMenu: [] },
    { name: "CONTACTO", href: "/contact", subMenu: [] },
  ],
  hero: {
    heading: "EL\nTELÉFONO\nQUE\nMERECES",
    description: "Dispositivos insignia y accesorios curados, probados por entusiastas. Sin relleno — solo tecnología que vale la pena llevar.",
    badge: "NUEVA TEMPORADA",
    ctaText: "VER TODO",
    verMasText: "Ver más",
    contactText: "Contáctanos",
    featureCards: [
      { img: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&q=70&fm=webp", tag: "#INSIGNIA" },
      { img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&q=70&fm=webp", tag: "#INALÁMBRICO" },
    ],
    carouselSlides: [
      { img: "/images/audifonos.png", titulo: "20% OFF en iPhone", subtitulo: "Solo este fin de semana", cta: "Ver oferta", ctaHref: "/ofertas", bg: "#1c1c1e" },
      { img: "/images/tablet.png", titulo: "Nueva temporada Samsung", subtitulo: "Galaxy S24 ya disponible", cta: "Comprar ahora", ctaHref: "/celulares/samsung", bg: "#1a2332" },
      { img: "/images/promo1.png", titulo: "Accesorios premium", subtitulo: "AirPods, cables y más", cta: "Ver accesorios", ctaHref: "/accesorios", bg: "#2a2a2a" },
      { img: "/images/promo2.png", titulo: "Envío gratis", subtitulo: "En compras mayores a $500", cta: "Explorar", ctaHref: "/ofertas", bg: "#0f1923" },
    ],
  },
  tagline: {
    text: "Tecnología que se adapta a tu vida, al instante, elegida por quienes saben lo que quieren — sin compromisos, solo lo mejor en la palma de tu mano",
  },
  mission: {
    heading: "ESTAMOS REDEFINIENDO LA TECNOLOGÍA",
    features: [
      { title: "GARANTÍA TOTAL", description: "Cada dispositivo pasa por un control de calidad riguroso. Vendemos solo tecnología verificada, con garantía oficial y soporte post-venta real." },
      { title: "ENVÍO RÁPIDO", description: "Entrega a todo el país en 24–48 horas. Tu nuevo equipo llega empacado con cuidado y listo para usar desde el primer día." },
    ],
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=85",
  },
  footer: {
    brandName: "MOBILESHOP",
    tagline: "Tecnología premium curada para quienes saben lo que quieren. Sin relleno — solo lo mejor.",
    groups: [
      { title: "PRODUCTOS", links: ["Celulares", "Accesorios", "Smartwatches", "Auriculares", "Cargadores"] },
      { title: "COMPRAR", links: ["Nuevos Lanzamientos", "Más Vendidos", "Ofertas", "Reacondicionados", "Garantía"] },
      { title: "AYUDA", links: ["Envíos", "Devoluciones", "Soporte", "Contáctanos"] },
    ],
    socialLinks: [
      { name: "Instagram", url: "#" },
      { name: "Twitter / X", url: "#" },
      { name: "YouTube", url: "#" },
      { name: "TikTok", url: "#" },
    ],
    brandNames: ["Apple", "Samsung", "Google", "Xiaomi", "OnePlus"],
    copyright: "© 2025 MobileShop®. Todos los derechos reservados.",
    legalLinks: [
      { name: "Privacidad", url: "#" },
      { name: "Términos", url: "#" },
      { name: "Cookies", url: "#" },
    ],
  },
};

function CollapsibleSection({ title, open: defaultOpen, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left">
        <span className="text-sm font-semibold text-gray-800 dark:text-white">{title}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="p-5 space-y-4">{children}</div>}
    </div>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div className="mb-1">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
      {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
    </div>
  );
}

function ArrayField({ label, items, onChange, renderItem, emptyLabel }) {
  return (
    <div>
      <SectionHeader title={label} />
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="flex-1">{renderItem(item, i)}</div>
            <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="mt-1 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="text-xs text-gray-400 py-1">{emptyLabel || "Sin elementos"}</p>}
      <button type="button" onClick={() => onChange([...items, {}])}
        className="mt-2 text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
        <Plus size={12} /> Agregar
      </button>
    </div>
  );
}

function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key]) && target[key] && typeof target[key] === "object" && !Array.isArray(target[key])) {
      result[key] = deepMerge(target[key], source[key]);
    } else if (source[key] !== undefined && source[key] !== null) {
      result[key] = source[key];
    }
  }
  return result;
}

export default function SiteContentEditor() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPicker, setShowPicker] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    api.settings.get()
      .then(data => {
        const saved = data?.siteContent;
        if (saved && Object.keys(saved).length > 0) {
          setContent(deepMerge(DEFAULT_SITE_CONTENT, saved));
        } else {
          setContent(DEFAULT_SITE_CONTENT);
        }
      })
      .catch(() => {
        notify.error("Error al cargar contenido del sitio");
        setContent(DEFAULT_SITE_CONTENT);
      })
      .finally(() => setLoading(false));
  }, []);

  const update = (path, value) => {
    setContent(prev => {
      const keys = path.split(".");
      const last = keys.pop();
      const copy = JSON.parse(JSON.stringify(prev));
      let target = copy;
      for (const k of keys) target = target[k];
      target[last] = value;
      return copy;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.settings.update({ siteContent: content });
      notify.saved();
    } catch (err) {
      notify.error(err.message || "Error al guardar");
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-gray-400">
      <Loader size={20} className="animate-spin mr-2" /> Cargando contenido...
    </div>
  );

  if (!content) return null;

  const c = content;

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Contenido del sitio</h2>
          <p className="text-xs text-gray-400 mt-0.5">Edita los textos, enlaces e imágenes que se muestran en la tienda</p>
        </div>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          <Save size={14} /> {saving ? "Guardando..." : "Guardar todo"}
        </button>
      </div>

      {/* Header Section */}
      <CollapsibleSection title="Header — Barra superior" open>
        <div>
          <label className="label">Texto del banner promocional</label>
          <input value={c.header.promoBanner} onChange={e => update("header.promoBanner", e.target.value)}
            className="input" placeholder="Sign up and get 20% off..." />
        </div>
        <ArrayField
          label="Redes sociales (menú móvil)"
          items={c.header.socialLinks}
          onChange={v => update("header.socialLinks", v)}
          renderItem={(item, i) => (
            <div className="flex gap-2">
              <input value={item.name || ""} onChange={e => { const s = [...c.header.socialLinks]; s[i] = { ...s[i], name: e.target.value }; update("header.socialLinks", s); }}
                className="input text-sm flex-1" placeholder="Nombre" />
              <input value={item.url || ""} onChange={e => { const s = [...c.header.socialLinks]; s[i] = { ...s[i], url: e.target.value }; update("header.socialLinks", s); }}
                className="input text-sm flex-1" placeholder="URL" />
            </div>
          )}
        />
      </CollapsibleSection>

      {/* Navigation */}
      <CollapsibleSection title="Navegación — Menú principal">
        <ArrayField
          label="Enlaces de navegación"
          items={c.navLinks}
          onChange={v => update("navLinks", v)}
          renderItem={(item, i) => (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input value={item.name || ""} onChange={e => { const s = [...c.navLinks]; s[i] = { ...s[i], name: e.target.value }; update("navLinks", s); }}
                  className="input text-sm flex-1" placeholder="Nombre" />
                <input value={item.href || ""} onChange={e => { const s = [...c.navLinks]; s[i] = { ...s[i], href: e.target.value }; update("navLinks", s); }}
                  className="input text-sm flex-1 font-mono" placeholder="/ruta" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 mb-1">Submenú (uno por línea)</p>
                <textarea value={(item.subMenu || []).join("\n")}
                  onChange={e => { const s = [...c.navLinks]; s[i] = { ...s[i], subMenu: e.target.value.split("\n").filter(Boolean) }; update("navLinks", s); }}
                  className="input text-xs resize-none" rows={2} placeholder="Opción 1&#10;Opción 2" />
              </div>
            </div>
          )}
        />
      </CollapsibleSection>

      {/* Hero */}
      <CollapsibleSection title="Hero — Sección principal" open>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Título principal (una línea por salto)</label>
            <textarea value={c.hero.heading} onChange={e => update("hero.heading", e.target.value)}
              className="input resize-none" rows={2} placeholder="Una línea por salto de línea" />
          </div>
          <div>
            <label className="label">Badge</label>
            <input value={c.hero.badge} onChange={e => update("hero.badge", e.target.value)}
              className="input" placeholder="NUEVA TEMPORADA" />
          </div>
        </div>
        <div>
          <label className="label">Descripción</label>
          <textarea value={c.hero.description} onChange={e => update("hero.description", e.target.value)}
            className="input resize-none" rows={2} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">Texto botón CTA</label>
            <input value={c.hero.ctaText} onChange={e => update("hero.ctaText", e.target.value)}
              className="input" placeholder="VER TODO" />
          </div>
          <div>
            <label className="label">Texto "Ver más"</label>
            <input value={c.hero.verMasText} onChange={e => update("hero.verMasText", e.target.value)}
              className="input" placeholder="Ver más" />
          </div>
          <div>
            <label className="label">Texto "Contáctanos"</label>
            <input value={c.hero.contactText} onChange={e => update("hero.contactText", e.target.value)}
              className="input" placeholder="Contáctanos" />
          </div>
        </div>

        <ArrayField
          label="Tarjetas de producto"
          items={c.hero.featureCards}
          onChange={v => update("hero.featureCards", v)}
          renderItem={(item, i) => (
            <div className="flex gap-2">
              <div className="flex-1">
                <p className="text-[11px] text-gray-400 mb-1">Imagen</p>
                <div className="flex gap-1">
                  <input value={item.img || ""} onChange={e => { const s = [...c.hero.featureCards]; s[i] = { ...s[i], img: e.target.value }; update("hero.featureCards", s); }}
                    className="input text-xs flex-1 font-mono" placeholder="URL de la imagen" />
                  <button type="button" onClick={() => setShowPicker(`hero.featureCards.${i}.img`)}
                    className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-primary-600 flex-shrink-0">
                    <Image size={14} />
                  </button>
                </div>
                {item.img && <img src={item.img} className="w-16 h-12 object-cover rounded mt-1 border border-gray-200 dark:border-gray-700" />}
              </div>
              <div className="w-32">
                <label className="label">Etiqueta</label>
                <input value={item.tag || ""} onChange={e => { const s = [...c.hero.featureCards]; s[i] = { ...s[i], tag: e.target.value }; update("hero.featureCards", s); }}
                  className="input text-sm" placeholder="#INSIGNIA" />
              </div>
            </div>
          )}
        />

        <ArrayField
          label="Slides del carrusel"
          items={c.hero.carouselSlides}
          onChange={v => update("hero.carouselSlides", v)}
          renderItem={(item, i) => (
            <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
              <div className="flex gap-2">
                <input value={item.titulo || ""} onChange={e => { const s = [...c.hero.carouselSlides]; s[i] = { ...s[i], titulo: e.target.value }; update("hero.carouselSlides", s); }}
                  className="input text-sm flex-1" placeholder="Título" />
                <input value={item.subtitulo || ""} onChange={e => { const s = [...c.hero.carouselSlides]; s[i] = { ...s[i], subtitulo: e.target.value }; update("hero.carouselSlides", s); }}
                  className="input text-sm flex-1" placeholder="Subtítulo" />
              </div>
              <div className="flex gap-2">
                <input value={item.cta || ""} onChange={e => { const s = [...c.hero.carouselSlides]; s[i] = { ...s[i], cta: e.target.value }; update("hero.carouselSlides", s); }}
                  className="input text-sm flex-1" placeholder="Texto del botón" />
                <input value={item.ctaHref || ""} onChange={e => { const s = [...c.hero.carouselSlides]; s[i] = { ...s[i], ctaHref: e.target.value }; update("hero.carouselSlides", s); }}
                  className="input text-sm flex-1 font-mono" placeholder="/ruta" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <p className="text-[11px] text-gray-400 mb-1">Imagen</p>
                  <div className="flex gap-1">
                    <input value={item.img || ""} onChange={e => { const s = [...c.hero.carouselSlides]; s[i] = { ...s[i], img: e.target.value }; update("hero.carouselSlides", s); }}
                      className="input text-xs flex-1 font-mono" placeholder="URL de la imagen" />
                    <button type="button" onClick={() => setShowPicker(`hero.carouselSlides.${i}.img`)}
                      className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-primary-600 flex-shrink-0">
                      <Image size={14} />
                    </button>
                  </div>
                </div>
                <div className="w-24">
                  <p className="text-[11px] text-gray-400 mb-1">Color fondo</p>
                  <input value={item.bg || "#1c1c1e"} onChange={e => { const s = [...c.hero.carouselSlides]; s[i] = { ...s[i], bg: e.target.value }; update("hero.carouselSlides", s); }}
                    className="input text-xs" type="color" />
                </div>
              </div>
            </div>
          )}
        />
      </CollapsibleSection>

      {/* Tagline */}
      <CollapsibleSection title="Tagline — Frase destacada">
        <div>
          <label className="label">Texto del tagline</label>
          <textarea value={c.tagline.text} onChange={e => update("tagline.text", e.target.value)}
            className="input resize-none" rows={3} />
        </div>
      </CollapsibleSection>

      {/* Mission */}
      <CollapsibleSection title="Misión — Sección de valores">
        <div>
          <label className="label">Título</label>
          <input value={c.mission.heading} onChange={e => update("mission.heading", e.target.value)}
            className="input" />
        </div>
        <div>
          <label className="label">Imagen</label>
          <div className="flex gap-2">
            <input value={c.mission.image} onChange={e => update("mission.image", e.target.value)}
              className="input flex-1 font-mono text-xs" placeholder="URL de la imagen" />
            <button type="button" onClick={() => setShowPicker("mission.image")}
              className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-primary-600">
              <Image size={14} />
            </button>
          </div>
          {c.mission.image && (
            <img src={c.mission.image} className="w-20 h-20 object-cover rounded-lg mt-2 border border-gray-200 dark:border-gray-700" />
          )}
        </div>
        <ArrayField
          label="Características"
          items={c.mission.features}
          onChange={v => update("mission.features", v)}
          renderItem={(item, i) => (
            <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
              <input value={item.title || ""} onChange={e => { const s = [...c.mission.features]; s[i] = { ...s[i], title: e.target.value }; update("mission.features", s); }}
                className="input text-sm" placeholder="Título" />
              <textarea value={item.description || ""} onChange={e => { const s = [...c.mission.features]; s[i] = { ...s[i], description: e.target.value }; update("mission.features", s); }}
                className="input text-xs resize-none" rows={2} placeholder="Descripción" />
            </div>
          )}
        />
      </CollapsibleSection>

      {/* Footer */}
      <CollapsibleSection title="Footer — Pie de página">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Nombre de la marca</label>
            <input value={c.footer.brandName} onChange={e => update("footer.brandName", e.target.value)}
              className="input" />
          </div>
          <div>
            <label className="label">Copyright</label>
            <input value={c.footer.copyright} onChange={e => update("footer.copyright", e.target.value)}
              className="input" />
          </div>
        </div>
        <div>
          <label className="label">Tagline</label>
          <textarea value={c.footer.tagline} onChange={e => update("footer.tagline", e.target.value)}
            className="input resize-none" rows={2} />
        </div>

        <ArrayField
          label="Grupos de enlaces"
          items={c.footer.groups}
          onChange={v => update("footer.groups", v)}
          renderItem={(item, i) => (
            <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
              <input value={item.title || ""} onChange={e => { const s = [...c.footer.groups]; s[i] = { ...s[i], title: e.target.value }; update("footer.groups", s); }}
                className="input text-sm" placeholder="Título del grupo" />
              <div>
                <p className="text-[11px] text-gray-400 mb-1">Enlaces (uno por línea)</p>
                <textarea value={(item.links || []).join("\n")}
                  onChange={e => { const s = [...c.footer.groups]; s[i] = { ...s[i], links: e.target.value.split("\n").filter(Boolean) }; update("footer.groups", s); }}
                  className="input text-xs resize-none" rows={3} placeholder="Link 1&#10;Link 2" />
              </div>
            </div>
          )}
        />

        <ArrayField
          label="Redes sociales"
          items={c.footer.socialLinks}
          onChange={v => update("footer.socialLinks", v)}
          renderItem={(item, i) => (
            <div className="flex gap-2">
              <input value={item.name || ""} onChange={e => { const s = [...c.footer.socialLinks]; s[i] = { ...s[i], name: e.target.value }; update("footer.socialLinks", s); }}
                className="input text-sm flex-1" placeholder="Nombre" />
              <input value={item.url || ""} onChange={e => { const s = [...c.footer.socialLinks]; s[i] = { ...s[i], url: e.target.value }; update("footer.socialLinks", s); }}
                className="input text-sm flex-1" placeholder="URL" />
            </div>
          )}
        />

        <div>
          <label className="label">Marcas (separadas por coma)</label>
          <input value={c.footer.brandNames.join(", ")} onChange={e => update("footer.brandNames", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
            className="input" placeholder="Apple, Samsung, Google" />
        </div>

        <ArrayField
          label="Enlaces legales"
          items={c.footer.legalLinks}
          onChange={v => update("footer.legalLinks", v)}
          renderItem={(item, i) => (
            <div className="flex gap-2">
              <input value={item.name || ""} onChange={e => { const s = [...c.footer.legalLinks]; s[i] = { ...s[i], name: e.target.value }; update("footer.legalLinks", s); }}
                className="input text-sm flex-1" placeholder="Nombre" />
              <input value={item.url || ""} onChange={e => { const s = [...c.footer.legalLinks]; s[i] = { ...s[i], url: e.target.value }; update("footer.legalLinks", s); }}
                className="input text-sm flex-1" placeholder="URL" />
            </div>
          )}
        />
      </CollapsibleSection>

      {showPicker && (
        <ImagePickerModal
          onSelect={(url) => {
            update(showPicker, url);
            setShowPicker(null);
          }}
          onClose={() => setShowPicker(null)}
        />
      )}
    </div>
  );
}
