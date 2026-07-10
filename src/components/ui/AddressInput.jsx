import { useState, useEffect } from "react";

const VIA_TYPES = [
  { value: "Calle", label: "Calle" },
  { value: "Cra", label: "Carrera" },
  { value: "Av", label: "Avenida" },
  { value: "Tv", label: "Transversal" },
  { value: "Dg", label: "Diagonal" },
  { value: "Circ", label: "Circular" },
];

export default function AddressInput({ value, onChange, className = "" }) {
  const [parts, setParts] = useState(() => parseAddress(value || ""));

  useEffect(() => {
    setParts(parseAddress(value || ""));
  }, [value]);

  function parseAddress(addr) {
    const match = addr.match(/^(Calle|Cra|Av|Tv|Dg|Circ)\s+(.+?)\s*#\s*(.+?)\s*-\s*(.+?)(?:,\s*(.+))?$/i);
    if (match) {
      return {
        viaType: match[1],
        name: match[2],
        num1: match[3],
        num2: match[4],
        complement: match[5] || "",
      };
    }
    const simple = addr.split(",")[0] || addr;
    return { viaType: "Calle", name: simple, num1: "", num2: "", complement: "" };
  }

  function buildAddress(p) {
    let addr = `${p.viaType} ${p.name}`;
    if (p.num1) addr += ` #${p.num1}`;
    if (p.num2) addr += `-${p.num2}`;
    if (p.complement) addr += `, ${p.complement}`;
    return addr;
  }

  function update(field, val) {
    const next = { ...parts, [field]: val };
    setParts(next);
    onChange(buildAddress(next));
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={parts.viaType}
          onChange={e => update("viaType", e.target.value)}
          className="input w-auto min-w-[90px] py-2 text-sm"
        >
          {VIA_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <input
          type="text"
          value={parts.name}
          onChange={e => update("name", e.target.value)}
          placeholder="Nombre de la vía"
          className="input flex-1 min-w-[140px] py-2 text-sm"
        />
        <span className="text-sm text-gray-400 font-medium flex-shrink-0">#</span>
        <input
          type="text"
          value={parts.num1}
          onChange={e => update("num1", e.target.value)}
          placeholder="N°"
          className="input w-[80px] py-2 text-sm"
        />
        <span className="text-sm text-gray-400 flex-shrink-0">-</span>
        <input
          type="text"
          value={parts.num2}
          onChange={e => update("num2", e.target.value)}
          placeholder="N°"
          className="input w-[80px] py-2 text-sm"
        />
      </div>
      <input
        type="text"
        value={parts.complement}
        onChange={e => update("complement", e.target.value)}
        placeholder="Complemento (apto, piso, etc.) — opcional"
        className="input w-full py-2 text-sm"
      />
    </div>
  );
}
