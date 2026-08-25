import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, eliminarToast } = useInventory();

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />;
    }
  };

  const getBorderColor = (tipo: string) => {
    switch (tipo) {
      case 'success':
        return 'border-emerald-200 bg-emerald-50/95 text-emerald-950';
      case 'error':
        return 'border-rose-200 bg-rose-50/95 text-rose-950';
      case 'warning':
        return 'border-amber-200 bg-amber-50/95 text-amber-950';
      case 'info':
      default:
        return 'border-blue-200 bg-blue-50/95 text-blue-950';
    }
  };

  return (
    <div 
      id="toast-notifications-container" 
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            id={`toast-${toast.id}`}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-sm ${getBorderColor(toast.tipo)}`}
          >
            {getIcon(toast.tipo)}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold tracking-tight leading-tight">{toast.titulo}</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.mensaje}</p>
            </div>
            <button
              id={`toast-close-${toast.id}`}
              onClick={() => eliminarToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
