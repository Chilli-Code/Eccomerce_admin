export function applyColor(hex) {
  const root = document.documentElement;

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Variables RGB para las clases CSS personalizadas
  root.style.setProperty("--color-primary-50",  `${lightenHex(r,g,b,0.95)}`);
  root.style.setProperty("--color-primary-100", `${lightenHex(r,g,b,0.88)}`);
  root.style.setProperty("--color-primary-200", `${lightenHex(r,g,b,0.75)}`);
  root.style.setProperty("--color-primary-400", `${lightenHex(r,g,b,0.40)}`);
  root.style.setProperty("--color-primary-500", `${r} ${g} ${b}`);
  root.style.setProperty("--color-primary-600", `${darkenHex(r,g,b,0.10)}`);
  root.style.setProperty("--color-primary-700", `${darkenHex(r,g,b,0.25)}`);
  root.style.setProperty("--color-primary-800", `${darkenHex(r,g,b,0.40)}`);
  root.style.setProperty("--color-primary-900", `${darkenHex(r,g,b,0.55)}`);

  // Hex directo para el color base (útil para referencias directas)
  root.style.setProperty("--primary-hex", hex);
}

function lightenHex(r, g, b, amount) {
  const mix = (c) => Math.round(c + (255 - c) * amount);
  return `${mix(r)} ${mix(g)} ${mix(b)}`;
}

function darkenHex(r, g, b, amount) {
  const mix = (c) => Math.round(c * (1 - amount));
  return `${mix(r)} ${mix(g)} ${mix(b)}`;
}