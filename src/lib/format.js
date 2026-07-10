export const formatCOP = (price) =>
  new Intl.NumberFormat("es-CO", {
    style:                 "currency",
    currency:              "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(price));