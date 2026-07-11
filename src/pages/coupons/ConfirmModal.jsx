import { AlertTriangle, X } from "../../lib/icons.js";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 flex flex-col items-center text-center">
          <AlertTriangle size={48} className="text-red-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{message}</p>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t">
          <button onClick={onClose} className="btn-secondary px-4 py-2">Cancelar</button>
          <button onClick={onConfirm} className="btn-primary bg-red-600 hover:bg-red-700 px-4 py-2">Eliminar</button>
        </div>
      </div>
    </div>
  );
}