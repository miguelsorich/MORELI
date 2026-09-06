import React from 'react';
import { Articulo } from '../types/inventory';
import { useInventory } from '../context/InventoryContext';
import { formatBolivianos } from '../utils/inventoryUtils';
import { 
  Eye, 
  Edit3, 
  Trash2, 
  ShoppingBag,
  Shirt,
  MessageCircle
} from 'lucide-react';
import { MORELI_WALINK_URL, ejecutarConsultaWhatsApp } from '../utils/whatsappUtils';

interface ProductTableProps {
  articulos: Articulo[];
}

export const ProductTable: React.FC<ProductTableProps> = ({ articulos }) => {
  const { 
    isAdmin,
    setArticuloDetalle, 
    setArticuloEdicion, 
    setArticuloEliminar,
    setSellTarget,
    setQuickStockTarget,
    mostrarToast
  } = useInventory();

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden" id="tabla-inventario-contenedor">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-[#F0EEEF] border-b border-stone-200 text-[11px] font-bold text-stone-700 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Prenda / Modelo</th>
              <th className="py-3.5 px-4">Categoría</th>
              <th className="py-3.5 px-4">Código SKU</th>
              <th className="py-3.5 px-4">Precio (Bs.)</th>
              <th className="py-3.5 px-4">Variantes (Color & Talla)</th>
              <th className="py-3.5 px-4 text-center">Stock</th>
              <th className="py-3.5 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 bg-white">
            {articulos.map((art) => {
              const totalStock = art.variantes.reduce((sum, v) => sum + (Number(v.cantidad) || 0), 0);

              return (
                <tr 
                  key={art.id} 
                  className="hover:bg-[#F0EEEF]/40 transition-colors group"
                >
                  {/* Photo & Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div 
                        onClick={() => setArticuloDetalle(art)}
                        className="w-10 h-10 rounded-xl bg-[#F0EEEF] border border-stone-200 overflow-hidden flex-shrink-0 flex items-center justify-center cursor-pointer shadow-2xs"
                      >
                        {art.foto ? (
                          <img
                            src={art.foto}
                            alt={art.nombre}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <Shirt className="w-5 h-5 text-[#9F7652]" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <span 
                          onClick={() => setArticuloDetalle(art)}
                          className="font-bold text-stone-900 hover:text-[#2A5A29] cursor-pointer block line-clamp-1"
                        >
                          {art.nombre}
                        </span>
                        {art.descripcion && (
                          <span className="text-[11px] text-[#535456] block line-clamp-1">
                            {art.descripcion}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F0EEEF] text-[#2A5A29] border border-stone-200">
                      {art.categoria}
                    </span>
                  </td>

                  {/* SKU */}
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-[#2A5A29]">
                    {art.sku || 'MOR-ART-001'}
                  </td>

                  {/* Price in Bs. */}
                  <td className="py-3.5 px-4 font-extrabold text-[#2A5A29]">
                    {formatBolivianos(art.precio)}
                  </td>

                  {/* Variants Summary */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {art.variantes.slice(0, 3).map((v) => (
                        isAdmin ? (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setQuickStockTarget({ articulo: art, variante: v })}
                            title={`Ajustar stock de ${v.color} - Talla ${v.talla}`}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#F0EEEF] hover:bg-stone-200 text-[11px] text-stone-700 border border-stone-200 cursor-pointer transition-colors"
                          >
                            <span 
                              className="w-2 h-2 rounded-full border border-black/10" 
                              style={{ backgroundColor: v.colorHex || '#64748b' }}
                            />
                            <span>{v.talla}</span>
                            <span className="font-bold text-stone-900">({v.cantidad})</span>
                          </button>
                        ) : (
                          <span
                            key={v.id}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#F0EEEF] text-[11px] text-stone-700 border border-stone-200"
                          >
                            <span 
                              className="w-2 h-2 rounded-full border border-black/10" 
                              style={{ backgroundColor: v.colorHex || '#64748b' }}
                            />
                            <span>{v.talla}</span>
                          </span>
                        )
                      ))}
                      {art.variantes.length > 3 && (
                        <button
                          onClick={() => setArticuloDetalle(art)}
                          className="text-[10px] font-bold text-[#2A5A29] hover:underline self-center px-1 cursor-pointer"
                        >
                          +{art.variantes.length - 3} más
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Total Units */}
                  <td className="py-3.5 px-4 text-center font-extrabold text-stone-900">
                    {totalStock} <span className="text-[11px] font-normal text-[#535456]">u.</span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    {isAdmin ? (
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {/* Vender CTA */}
                        <button
                          id={`btn-tabla-vender-${art.id}`}
                          onClick={() => setSellTarget({ articulo: art })}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#2A5A29] hover:bg-[#1e421d] text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
                          title="Vender prenda y registrar ingreso"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Vendido</span>
                        </button>

                        <button
                          onClick={() => setArticuloDetalle(art)}
                          className="p-1.5 rounded-xl text-[#535456] hover:text-[#2A5A29] hover:bg-[#F0EEEF] transition-colors cursor-pointer"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setArticuloEdicion(art)}
                          className="p-1.5 rounded-xl text-[#535456] hover:text-[#2A5A29] hover:bg-[#F0EEEF] transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setArticuloEliminar(art)}
                          className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setArticuloDetalle(art)}
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer border border-stone-200"
                          title="Ver tallas y detalles"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#2A5A29]" />
                          <span>Ver</span>
                        </button>

                        <a
                          id={`btn-tabla-comprar-${art.id}`}
                          href={MORELI_WALINK_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            ejecutarConsultaWhatsApp({ articulo: art }, () => {
                              mostrarToast('success', '¡Abriendo WhatsApp!', `Consulta copiada: "${art.nombre}". Abriendo chat con Moreli.`);
                            });
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                          title="Comprar o consultar disponibilidad en WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Comprar</span>
                        </a>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
