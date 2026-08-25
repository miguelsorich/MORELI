import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { formatBolivianos, getHexForColor } from '../utils/inventoryUtils';
import { ShoppingBag, X, Check, ArrowRight, Tag, Layers, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SellModal: React.FC = () => {
  const { sellTarget, setSellTarget, registrarVenta } = useInventory();
  
  const [selectedVarianteId, setSelectedVarianteId] = useState<string>('');
  const [cantidad, setCantidad] = useState<number>(1);
  const [precioUnitario, setPrecioUnitario] = useState<number>(0);

  useEffect(() => {
    if (sellTarget?.articulo) {
      const art = sellTarget.articulo;
      const initialVar = sellTarget.variante || art.variantes[0];
      if (initialVar) {
        setSelectedVarianteId(initialVar.id);
        setCantidad(1);
      }
      setPrecioUnitario(art.precio || 0);
    }
  }, [sellTarget]);

  if (!sellTarget) return null;

  const { articulo } = sellTarget;
  const currentVariante = articulo.variantes.find(v => v.id === selectedVarianteId) || articulo.variantes[0];
  const maxAvailable = currentVariante?.cantidad || 1;
  const totalImporte = (cantidad || 1) * (precioUnitario || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVariante) return;

    const exito = registrarVenta({
      articulo,
      varianteId: currentVariante.id,
      cantidadVendida: Math.min(cantidad, maxAvailable),
      precioUnitario: Number(precioUnitario)
    });

    if (exito) {
      setSellTarget(null);
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="modal-vender-prenda-overlay"
        className="fixed inset-0 z-50 bg-[#2A5A29]/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          id="modal-vender-prenda-content"
          className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-md w-full overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#F0EEEF]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#2A5A29] text-white flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 tracking-tight">
                  Registrar Venta de Prenda
                </h3>
                <p className="text-[11px] text-[#535456]">
                  Se sumará al Reporte de Ingresos y se retirará del catálogo
                </p>
              </div>
            </div>

            <button
              onClick={() => setSellTarget(null)}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Product Summary Box */}
            <div className="p-3.5 bg-[#F0EEEF]/70 border border-stone-200 rounded-xl flex gap-3 items-center">
              {articulo.foto ? (
                <img 
                  src={articulo.foto} 
                  alt={articulo.nombre} 
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-lg object-cover border border-stone-200 flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-[#9F7652]/10 border border-[#9F7652]/20 flex items-center justify-center text-[#9F7652] flex-shrink-0">
                  <Tag className="w-6 h-6" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-[#2A5A29] uppercase tracking-wider block">
                  {articulo.categoria} • {articulo.sku}
                </span>
                <h4 className="text-xs font-bold text-stone-900 truncate">
                  {articulo.nombre}
                </h4>
                <p className="text-xs font-extrabold text-[#9F7652] mt-0.5">
                  Precio Base: {formatBolivianos(articulo.precio)}
                </p>
              </div>
            </div>

            {/* Select Variant / Size if multiple */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-[#2A5A29]" />
                  Variante a Vender (Color & Talla)
                </span>
                <span className="text-[11px] text-[#535456]">
                  Disponibles: <strong className="text-stone-900">{maxAvailable}</strong> u.
                </span>
              </label>

              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-1">
                {articulo.variantes.map(v => {
                  const isSelected = v.id === selectedVarianteId;
                  return (
                    <button
                      type="button"
                      key={v.id}
                      onClick={() => {
                        setSelectedVarianteId(v.id);
                        if (cantidad > v.cantidad) setCantidad(Math.max(1, v.cantidad));
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#2A5A29] bg-[#2A5A29]/10 font-bold text-stone-900 shadow-2xs'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3 h-3 rounded-full border border-black/15 shadow-2xs" 
                          style={{ backgroundColor: v.colorHex || getHexForColor(v.color) }}
                        />
                        <span>{v.color}</span>
                        <span className="px-2 py-0.5 rounded bg-white text-stone-800 font-bold border border-stone-200">
                          Talla: {v.talla}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[#535456]">
                          Stock: {v.cantidad}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-[#2A5A29]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity & Unit Price Inputs */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Quantity */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Piezas Vendidas
                </label>
                <input
                  type="number"
                  min="1"
                  max={maxAvailable}
                  required
                  value={cantidad}
                  onChange={(e) => setCantidad(Math.max(1, Math.min(maxAvailable, parseInt(e.target.value) || 1)))}
                  className="w-full text-center text-sm font-extrabold py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#2A5A29] focus:bg-white"
                />
                <span className="text-[10px] text-[#535456] mt-0.5 block text-center">
                  (Máx. {maxAvailable} disponible)
                </span>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Precio Unitario (Bs.)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-xs font-bold text-[#2A5A29]">
                    Bs.
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={precioUnitario}
                    onChange={(e) => setPrecioUnitario(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pl-9 pr-2 py-2 text-sm font-extrabold bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#2A5A29] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Revenue Total Highlight */}
            <div className="p-3 bg-[#2A5A29]/10 border border-[#2A5A29]/30 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#2A5A29] block">
                  Importe Total a Sumar:
                </span>
                <span className="text-[10px] text-[#535456]">
                  {cantidad} {cantidad === 1 ? 'pieza' : 'piezas'} × {formatBolivianos(precioUnitario)}
                </span>
              </div>
              <span className="text-base font-extrabold text-[#2A5A29]">
                {formatBolivianos(totalImporte)}
              </span>
            </div>

            {/* Notice */}
            <p className="text-[11px] text-[#535456] bg-[#F0EEEF] p-2.5 rounded-lg border border-stone-200 flex items-start gap-1.5 leading-tight">
              <Sparkles className="w-3.5 h-3.5 text-[#9F7652] flex-shrink-0 mt-0.5" />
              <span>
                Al marcar como vendido, esta unidad se descuenta de las existencias. Si todas las piezas de la prenda se venden, se retirará automáticamente del catálogo activo.
              </span>
            </p>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setSellTarget(null)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                id="btn-confirmar-venta-modal"
                className="flex-2 py-2.5 bg-[#2A5A29] hover:bg-[#1e421d] text-white rounded-xl text-xs font-bold shadow-xs hover:shadow flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar Venta ({formatBolivianos(totalImporte)})</span>
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
