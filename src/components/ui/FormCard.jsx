import { useState } from "react";
export const FormCard = ({ title, children, className = "" }) => (
  <div className={`card p-5 space-y-4 ${className}`}>
    {title && <h2 className="text-sm font-semibold text-gray-800 dark:text-white">{title}</h2>}
    {children}
  </div>
);

export const FormField = ({ label, children, hint }) => (
  <div>
    <label className="label">{label}</label>
    {hint && <p className="text-[11px] text-gray-400 mb-1.5">{hint}</p>}
    {children}
  </div>
);

export const PriceInput = ({ label, value, onChange, placeholder = "0" }) => {
  const [focused, setFocused] = useState(false);

  const displayValue = focused || !value
    ? value
    : new Intl.NumberFormat("es-CO", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(value));

  return (
    <FormField label={label}>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
        <input
          type={focused ? "number" : "text"}
          value={focused ? (value ? Math.round(Number(value)) : "") : displayValue}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="input pl-7"
          placeholder={placeholder}
          step="1"
        />
      </div>
    </FormField>
  );
};