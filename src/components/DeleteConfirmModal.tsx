import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DeleteConfirmModal: React.FC = () => {
  const { articuloEliminar, setArticuloEliminar, eliminarArticulo } = useInventory();

  if (!articuloEliminar) return null;

  const totalStock = articuloEliminar.variantes.reduce((sum, v) => sum + (Number(v.cantidad) || 0), 0);

  const handleConfirm = () => {
    eliminarArticulo(articuloEliminar.id);
    setArticuloEliminar(null);
  };

  return (
    <AnimatePresence>
      <div 
        id="modal-confirmar-eliminar-overlay" 
        className="fixed inset-0 z-50 bg-[#2A5A29]/40 backdrop-blur-xs flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          id="modal-confirmar-eliminar-content"
          className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-md w-full p-6 overflow-hidden"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-stone-900 leading-tight">
                ¿Eliminar esta prenda del inventario?
              </h3>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                Estás a punto de eliminar <strong className="text-stone-900 font-semibold">"{articuloEliminar.nombre}"</strong> ({articuloEliminar.categoria}) con código <strong className="text-[#9F7652]">{articuloEliminar.sku || 'MOR'}</strong> y {totalStock} unidades en existencias.
              </p>
              <p className="text-[11px] text-stone-400 mt-2">
                Esta acción es irreversible y removerá el registro permanentemente.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2.5">
            <button
              id="btn-cancelar-eliminar"
              type="button"
              onClick={() => setArticuloEliminar(null)}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              id="btn-confirmar-eliminar"
              type="button"
              onClick={handleConfirm}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Sí, eliminar prenda</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
