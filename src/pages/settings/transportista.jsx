
import { useState } from "react";
import { Store, Globe, CreditCard, Bell, Shield, Palette, Truck } from "../../lib/icons.js";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { carriers } from "../../data/mock.js";


export default function ShippingTab() {

  const navigate = useNavigate();
  const [carrierList, setCarrierList] = useState(carriers);
  const toggle = (id) => setCarrierList(list =>
    list.map(c => c.id === id ? { ...c, active: !c.active } : c)
  );

  return (
    <div className="space-y-5">

      <div className="page-header">
        <div>
          <h1 className="page-title">Transportistas</h1>
          <p className="text-sm text-gray-400 mt-0.5">Configura las empresas de envío</p>
        </div>
        <button className="btn-primary">Guardar cambios</button>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transportadora por defecto</p>
        <select className="input w-64">
          {carrierList.filter(c => c.active).map(c => (
            <option key={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Transportadoras</p>
        <div className="space-y-2">
          {carrierList.map(c => (
            <div key={c.id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-xl">
              <div className="flex items-center gap-3">
                <img
                  src={c.logo}
                  alt={c.name}
                  className="w-10 h-10 object-contain rounded-lg bg-white p-1 border border-gray-100 dark:border-gray-800"
                  onError={e => { e.target.style.display = "none"; }}
                />
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.coverage}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(`/settings/carrier/${c.code}`)}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  Configurar
                </button>
<button
  onClick={() => toggle(c.id)}
  className={clsx(
    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0",
    c.active ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"
  )}
>
  <span
    className={clsx(
      "inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200",
      c.active ? "translate-x-6" : "translate-x-1"
    )}
  />
</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}