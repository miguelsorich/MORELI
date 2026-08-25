import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { X, Plus, Minus, Check, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const QuickStockModal: React.FC = () => {
  const { quickStockTarget, setQuickStockTarget, actualizarStockVariante } = useInventory();
  const [cantidad, setCantidad] = useState<number>(0);

  useEffect(() => {
    if (quickStockTarget) {
      setCantidad(quickStockTarget.variante.cantidad);
    }
  }, [quickStockTarget]);

  if (!quickStockTarget) return null;

  const { articulo, variante } = quickStockTarget;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (cantidad >= 0) {
      actualizarStockVariante(articulo.id, variante.id, cantidad, false);
      setQuickStockTarget(null);
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="modal-ajuste-stock-rapido-overlay" 
        className="fixed inset-0 z-50 bg-[#2A5A29]/40 backdrop-blur-xs flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          id="modal-ajuste-stock-rapido-content"
          className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-sm w-full p-5 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#2A5A29]" />
              Ajuste Rápido de Existencias
            </h3>
            <button
              onClick={() => setQuickStockTarget(null)}
              className="p-1 text-stone-400 hover:text-stone-600 rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 bg-[#F0EEEF]/70 rounded-xl border border-stone-200 mb-4">
            <p className="text-xs font-bold text-stone-900 line-clamp-1">{articulo.nombre}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex items-center gap-1.5">
                <span 
                  className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-2xs" 
                  style={{ backgroundColor: variante.colorHex || '#64748b' }} 
                />
                <span className="text-xs text-stone-700 font-semibold">{variante.color}</span>
              </div>
              <span className="text-stone-300">•</span>
              <span className="text-xs font-bold text-stone-800 bg-white px-2 py-0.5 rounded border border-stone-200">
                Talla: {variante.talla}
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 text-center mb-2">
                Unidades en inventario
              </label>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={cantidad <= 0}
                  onClick={() => setCantidad(prev => Math.max(0, prev - 1))}
                  className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-800 font-bold flex items-center justify-center transition-colors cursor-pointer text-lg"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <input
                  type="number"
                  min="0"
                  required
                  value={cantidad}
                  onChange={(e) => setCantidad(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-24 text-center text-2xl font-extrabold py-2 bg-white border-2 border-[#2A5A29] rounded-xl text-stone-900 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => setCantidad(prev => prev + 1)}
                  className="w-10 h-10 rounded-xl bg-[#2A5A29]/10 hover:bg-[#2A5A29]/20 text-[#2A5A29] font-bold flex items-center justify-center transition-colors cursor-pointer text-lg"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setQuickStockTarget(null)}
                className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-[#2A5A29] hover:bg-[#1e421d] text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Guardar Stock</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
