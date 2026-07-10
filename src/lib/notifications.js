import { sileo } from "sileo";

// ── Órdenes ──────────────────────────────────────
export const notify = {

  // Órdenes
  orderCreated: (id) => sileo.success({ title: "Nueva orden recibida", description: `Orden ${id} creada exitosamente` }

  ),
  orderShipped: (id) => sileo.success({ title: "Orden enviada", description: `${id} marcada como enviada` }),
  orderDelivered: (id) => sileo.success({ title: "Orden entregada", description: `${id} entregada al cliente` }),
  orderFailed: (id) => sileo.error({ title: "Error en orden", description: `${id} no pudo procesarse` }),
  orderCancelled: (id) => sileo.warning({ title: "Orden cancelada", description: `${id} fue cancelada` }),

  // Productos
  productSaved: (name) => sileo.success({ title: "Producto guardado", description: `${name.toUpperCase()} Actualizado Correctamente`, 
  }),
  productDeleted: (name) => sileo.warning({ title: "Producto eliminado", description: `"${name}" fue eliminado` }),
  productOutStock: (name) => sileo.error({ title: "Sin stock", description: `"${name}" se quedó sin inventario`, duration: null }),
  productLowStock: (name, stock) => sileo.warning({ title: "Stock bajo", description: `"${name}" solo tiene ${stock} unidades` }),

  // Clientes
  customerCreated: (name) => sileo.success({ title: "Cliente registrado", description: `${name} agregado al sistema` }),
  customerDeleted: (name) => sileo.warning({ title: "Cliente eliminado", description: `${name} fue eliminado` }),

  // Cupones
  couponCreated: (code) => sileo.success({ title: "Cupón creado", description: `${code} está activo y listo para usar` }),
  couponExpired: (code) => sileo.warning({ title: "Cupón expirado", description: `${code} ya no está activo` }),
  couponCopied: (code) => sileo.info({ title: "Copiado", description: `Código ${code} copiado al portapapeles` }),

  // Envíos
  shipmentCreated: (id) => sileo.success({ title: "Envío generado", description: `Guía ${id} creada exitosamente` }),
  shipmentFailed: (carrier) => sileo.error({ title: "Error de envío", description: `No se pudo conectar con ${carrier}` }),
  carrierSaved: (name) => sileo.success({ title: "Transportadora guardada", description: `${name} configurada correctamente` }),
  carrierTested: (name, ok) => ok
    ? sileo.success({ title: "Conexión exitosa", description: `${name} está conectada y funcionando` })
    : sileo.error({ title: "Conexión fallida", description: `No se pudo conectar con ${name}` }),

  // Páginas CMS
  pageSaved: (title) => sileo.success({ title: "Página guardada", description: `"${title}" guardada exitosamente` }),
  pagePublished: (title) => sileo.success({ title: "Página publicada", description: `"${title}" ya está visible en tu tienda` }),
  pageDeleted: (title) => sileo.warning({ title: "Página eliminada", description: `"${title}" fue eliminada` }),

  // Ajustes
  settingsSaved: () => sileo.success({ title: "Ajustes guardados", description: "Los cambios se aplicaron correctamente" }),
  passwordChanged: () => sileo.success({ title: "Contraseña actualizada", description: "Tu contraseña fue cambiada exitosamente" }),
  planUpgraded: (plan) => sileo.success({ title: "Plan actualizado", description: `Ahora estás en el plan ${plan}` }),

  // Equipo
  configGeneralSaved: () => sileo.success({ title: "Configuracion Aplicada", description: `Se ha aplicado la configuración a tu cuenta` }),
  memberInvited: (email) => sileo.success({ title: "Invitación enviada", description: `Se envió un correo a ${email}` }),
  memberUpdated: (name) => sileo.success({ title: "Miembro actualizado", description: `${name} fue Actualizado correctamente` }),
  memberRemoved: (name) => sileo.warning({ title: "Miembro eliminado", description: `${name} ya no tiene acceso al panel` }),

  // Reportes
  reportExported: () => sileo.success({ title: "Reporte exportado", description: "El PDF fue generado y descargado" }),

  // Calendario
  eventCreated: (title) => sileo.success({ title: "Evento creado", description: `"${title}" agregado al calendario` }),
  eventDeleted: (title) => sileo.warning({ title: "Evento eliminado", description: `"${title}" fue eliminado` }),

  // Media
  fileUploaded: (name) => sileo.success({ title: "Archivo subido", description: `"${name}" subido exitosamente` }),
  fileDeleted: (name) => sileo.warning({ title: "Archivo eliminado", description: `"${name}" fue eliminado` }),

  // Genéricas
  copied: () => sileo.info({ title: "Copiado", description: "Contenido copiado al portapapeles" }),
  saved: () => sileo.success({ title: "Guardado", description: "Los cambios fueron guardados" }),
  deleted: () => sileo.warning({ title: "Eliminado", description: "El elemento fue eliminado" }),
  error: (msg) => sileo.error({ title: "Error", description: msg || "Algo salió mal, intenta de nuevo" }),

  // Promise helper — para llamadas async al backend
  async: (promise, { loading, success, error }) =>
    sileo.promise(promise, {
      loading: { title: loading || "Procesando..." },
      success: { title: success || "Listo" },
      error: { title: error || "Error al procesar" },
    }),


  success: (message, title = "Éxito") => {
    sileo.success({ title, description: message });
  },
  
  // También agrega info si no existe
  info: (message, title = "Información") => {
    sileo.info({ title, description: message });
  },
  
  warning: (message, title = "Advertencia") => {
    sileo.warning({ title, description: message });
  },
  
  error: (message, title = "Error") => {
    sileo.error({ title, description: message || "Algo salió mal" });
  },
};