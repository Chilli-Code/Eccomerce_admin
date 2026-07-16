import { sileo } from "sileo";
import { playSound } from "./sounds.js";

function sound(type) {
  return (...args) => {
    playSound(type);
    return sileo[type](...args);
  };
}

const sileoWithSound = {
  success: sound("success"),
  error: sound("error"),
  warning: sound("warning"),
  info: sound("info"),
  promise: sileo.promise,
};

// ── Órdenes ──────────────────────────────────────
export const notify = {

  // Órdenes
  orderCreated: (id) => sileoWithSound.success({ title: "Nueva orden recibida", description: `Orden ${id} creada exitosamente` }

  ),
  orderShipped: (id) => sileoWithSound.success({ title: "Orden enviada", description: `${id} marcada como enviada` }),
  orderDelivered: (id) => sileoWithSound.success({ title: "Orden entregada", description: `${id} entregada al cliente` }),
  orderFailed: (id) => sileoWithSound.error({ title: "Error en orden", description: `${id} no pudo procesarse` }),
  orderCancelled: (id) => sileoWithSound.warning({ title: "Orden cancelada", description: `${id} fue cancelada` }),

  // Productos
  productSaved: (name) => sileoWithSound.success({ title: "Producto guardado", description: `${name.toUpperCase()} Actualizado Correctamente`, 
  }),
  productDeleted: (name) => sileoWithSound.warning({ title: "Producto eliminado", description: `"${name}" fue eliminado` }),
  productOutStock: (name) => sileoWithSound.error({ title: "Sin stock", description: `"${name}" se quedó sin inventario`, duration: null }),
  productLowStock: (name, stock) => sileoWithSound.warning({ title: "Stock bajo", description: `"${name}" solo tiene ${stock} unidades` }),

  // Clientes
  customerCreated: (name) => sileoWithSound.success({ title: "Cliente registrado", description: `${name} agregado al sistema` }),
  customerDeleted: (name) => sileoWithSound.warning({ title: "Cliente eliminado", description: `${name} fue eliminado` }),

  // Cupones
  couponCreated: (code) => sileoWithSound.success({ title: "Cupón creado", description: `${code} está activo y listo para usar` }),
  couponExpired: (code) => sileoWithSound.warning({ title: "Cupón expirado", description: `${code} ya no está activo` }),
  couponCopied: (code) => sileoWithSound.info({ title: "Copiado", description: `Código ${code} copiado al portapapeles` }),

  // Envíos
  shipmentCreated: (id) => sileoWithSound.success({ title: "Envío generado", description: `Guía ${id} creada exitosamente` }),
  shipmentFailed: (carrier) => sileoWithSound.error({ title: "Error de envío", description: `No se pudo conectar con ${carrier}` }),
  carrierSaved: (name) => sileoWithSound.success({ title: "Transportadora guardada", description: `${name} configurada correctamente` }),
  carrierTested: (name, ok) => ok
    ? sileoWithSound.success({ title: "Conexión exitosa", description: `${name} está conectada y funcionando` })
    : sileoWithSound.error({ title: "Conexión fallida", description: `No se pudo conectar con ${name}` }),

  // Páginas CMS
  pageSaved: (title) => sileoWithSound.success({ title: "Página guardada", description: `"${title}" guardada exitosamente` }),
  pagePublished: (title) => sileoWithSound.success({ title: "Página publicada", description: `"${title}" ya está visible en tu tienda` }),
  pageDeleted: (title) => sileoWithSound.warning({ title: "Página eliminada", description: `"${title}" fue eliminada` }),

  // Ajustes
  settingsSaved: () => sileoWithSound.success({ title: "Ajustes guardados", description: "Los cambios se aplicaron correctamente" }),
  passwordChanged: () => sileoWithSound.success({ title: "Contraseña actualizada", description: "Tu contraseña fue cambiada exitosamente" }),
  planUpgraded: (plan) => sileoWithSound.success({ title: "Plan actualizado", description: `Ahora estás en el plan ${plan}` }),

  // Equipo
  configGeneralSaved: () => sileoWithSound.success({ title: "Configuracion Aplicada", description: `Se ha aplicado la configuración a tu cuenta` }),
  memberInvited: (email) => sileoWithSound.success({ title: "Invitación enviada", description: `Se envió un correo a ${email}` }),
  memberUpdated: (name) => sileoWithSound.success({ title: "Miembro actualizado", description: `${name} fue Actualizado correctamente` }),
  memberRemoved: (name) => sileoWithSound.warning({ title: "Miembro eliminado", description: `${name} ya no tiene acceso al panel` }),

  // Reportes
  reportExported: () => sileoWithSound.success({ title: "Reporte exportado", description: "El PDF fue generado y descargado" }),

  // Calendario
  eventCreated: (title) => sileoWithSound.success({ title: "Evento creado", description: `"${title}" agregado al calendario` }),
  eventDeleted: (title) => sileoWithSound.warning({ title: "Evento eliminado", description: `"${title}" fue eliminado` }),

  // Media
  fileUploaded: (name) => sileoWithSound.success({ title: "Archivo subido", description: `"${name}" subido exitosamente` }),
  fileDeleted: (name) => sileoWithSound.warning({ title: "Archivo eliminado", description: `"${name}" fue eliminado` }),

  // Genéricas
  copied: () => sileoWithSound.info({ title: "Copiado", description: "Contenido copiado al portapapeles" }),
  saved: () => sileoWithSound.success({ title: "Guardado", description: "Los cambios fueron guardados" }),
  deleted: () => sileoWithSound.warning({ title: "Eliminado", description: "El elemento fue eliminado" }),
  error: (msg) => sileoWithSound.error({ title: "Error", description: msg || "Algo salió mal, intenta de nuevo" }),

  // Promise helper — para llamadas async al backend
  async: (promise, { loading, success, error }) =>
    sileo.promise(promise, {
      loading: { title: loading || "Procesando..." },
      success: { title: success || "Listo" },
      error: { title: error || "Error al procesar" },
    }),


  success: (message, title = "Éxito") => {
    sileoWithSound.success({ title, description: message });
  },
  
  // También agrega info si no existe
  info: (message, title = "Información") => {
    sileoWithSound.info({ title, description: message });
  },
  
  warning: (message, title = "Advertencia") => {
    sileoWithSound.warning({ title, description: message });
  },
  
  error: (message, title = "Error") => {
    sileoWithSound.error({ title, description: message || "Algo salió mal" });
  },
};