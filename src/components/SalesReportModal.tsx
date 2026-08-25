import React, { useState, useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import { exportSalesReportToExcel, formatBolivianos, getHexForColor } from '../utils/inventoryUtils';
import { 
  FileSpreadsheet, 
  X, 
  Search, 
  TrendingUp, 
  ShoppingBag, 
  Receipt, 
  Calendar, 
  Trash2, 
  ArrowDownToLine,
  Filter,
  DollarSign,
  Layers,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SalesReportModal: React.FC = () => {
  const { isSalesReportOpen, setIsSalesReportOpen, ventas, eliminarVenta, mostrarToast } = useInventory();
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');

  // Sorted list chronologically for calculating cumulative totals
  const ventasOrdenadas = useMemo(() => {
    return [...ventas].sort(
      (a, b) => new Date(b.fechaVenta).getTime() - new Date(a.fechaVenta).getTime()
    );
  }, [ventas]);

  // Unique categories in sales
  const categoriasVentas = useMemo(() => {
    const set = new Set<string>();
    ventas.forEach(v => {
      if (v.categoria) set.add(v.categoria);
    });
    return Array.from(set);
  }, [ventas]);

  // Filtered sales
  const ventasFiltradas = useMemo(() => {
    return ventasOrdenadas.filter(v => {
      if (busqueda.trim()) {
        const query = busqueda.toLowerCase().trim();
        const matchNombre = v.articuloNombre.toLowerCase().includes(query);
        const matchSku = v.sku.toLowerCase().includes(query) || (v.varianteSku && v.varianteSku.toLowerCase().includes(query));
        const matchCat = v.categoria.toLowerCase().includes(query);
        const matchColor = v.color.toLowerCase().includes(query);
        if (!matchNombre && !matchSku && !matchCat && !matchColor) return false;
      }

      if (filtroCategoria !== 'todas' && v.categoria !== filtroCategoria) {
        return false;
      }

      return true;
    });
  }, [ventasOrdenadas, busqueda, filtroCategoria]);

  // Calculate Running Cumulative Total
  const ventasConAcumulado = useMemo(() => {
    // We compute cumulative from oldest to newest
    const cronologico = [...ventasFiltradas].sort(
      (a, b) => new Date(a.fechaVenta).getTime() - new Date(b.fechaVenta).getTime()
    );

    let acumulado = 0;
    const mapAcumulado = new Map<string, number>();

    cronologico.forEach(v => {
      acumulado += (v.importeTotal || (v.cantidad * v.precioUnitario) || 0);
      mapAcumulado.set(v.id, acumulado);
    });

    // Return in reverse chronological order (newest first) for viewing
    return ventasFiltradas.map(v => ({
      ...v,
      importeAcumulado: mapAcumulado.get(v.id) || v.importeTotal
    }));
  }, [ventasFiltradas]);

  // Overall totals
  const totalPiezasVendidas = useMemo(() => {
    return ventas.reduce((sum, v) => sum + (Number(v.cantidad) || 0), 0);
  }, [ventas]);

  const totalIngresosBs = useMemo(() => {
    return ventas.reduce((sum, v) => sum + (Number(v.importeTotal) || (v.cantidad * v.precioUnitario) || 0), 0);
  }, [ventas]);

  const ticketPromedio = totalPiezasVendidas > 0 ? (totalIngresosBs / totalPiezasVendidas) : 0;

  if (!isSalesReportOpen) return null;

  const handleDownloadExcel = () => {
    if (ventas.length === 0) {
      mostrarToast('warning', 'Sin registros', 'No hay ventas registradas para generar el reporte en Excel.');
      return;
    }
    exportSalesReportToExcel(ventas);
    mostrarToast('success', 'Excel Descargado', 'El reporte oficial de ingresos y ventas ha sido generado.');
  };

  return (
    <AnimatePresence>
      <div 
        id="modal-reporte-ventas-overlay"
        className="fixed inset-0 z-50 bg-[#2A5A29]/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          id="modal-reporte-ventas-content"
          className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#F0EEEF] gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#9F7652] text-white flex items-center justify-center shadow-xs">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-stone-900 tracking-tight">
                    Reporte de Ventas & Registro de Ingresos
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2A5A29]/10 text-[#2A5A29]">
                    Moneda: Bs.
                  </span>
                </div>
                <p className="text-xs text-[#535456]">
                  Control detallado de piezas vendidas, importes acumulados y exportación a Excel
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-descargar-reporte-excel-top"
                onClick={handleDownloadExcel}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#2A5A29] hover:bg-[#1e421d] text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Descargar en Excel (.xlsx)</span>
              </button>

              <button
                onClick={() => setIsSalesReportOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* KPI Cards Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Total Ingreso Acumulado */}
              <div className="p-4 bg-[#F0EEEF] border border-stone-200 rounded-2xl flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#2A5A29] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#535456] uppercase tracking-wider block">
                    Ingreso Total Acumulado
                  </span>
                  <span className="text-xl font-extrabold text-[#2A5A29]">
                    {formatBolivianos(totalIngresosBs)}
                  </span>
                </div>
              </div>

              {/* Total Piezas Vendidas */}
              <div className="p-4 bg-[#F0EEEF] border border-stone-200 rounded-2xl flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#9F7652] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#535456] uppercase tracking-wider block">
                    Prendas / Piezas Vendidas
                  </span>
                  <span className="text-xl font-extrabold text-stone-900">
                    {totalPiezasVendidas} <span className="text-xs font-normal text-stone-500">unidades</span>
                  </span>
                </div>
              </div>

              {/* Promedio por prenda */}
              <div className="p-4 bg-[#F0EEEF] border border-stone-200 rounded-2xl flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#B89C71] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#535456] uppercase tracking-wider block">
                    Precio Promedio por Prenda
                  </span>
                  <span className="text-xl font-extrabold text-[#9F7652]">
                    {formatBolivianos(ticketPromedio)}
                  </span>
                </div>
              </div>

            </div>

            {/* Filter and Search Bar inside Report */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar por producto, código SKU, color o categoría..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#2A5A29]"
                />
              </div>

              {categoriasVentas.length > 0 && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-3.5 h-3.5 text-stone-400" />
                  <select
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    className="text-xs bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-stone-700 font-medium cursor-pointer"
                  >
                    <option value="todas">Todas las categorías</option>
                    {categoriasVentas.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Transactions Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#2A5A29]" />
                  Historial Detallado de Ventas ({ventasConAcumulado.length} registros)
                </span>
                <span className="text-[11px] text-[#535456]">
                  Valores expresados en Bolivianos (Bs.)
                </span>
              </div>

              {ventasConAcumulado.length > 0 ? (
                <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto max-h-80 overflow-y-auto scrollbar-thin">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-[#F0EEEF] border-b border-stone-200 text-[11px] font-bold text-stone-700 uppercase sticky top-0 z-10">
                        <tr>
                          <th className="py-2.5 px-3 whitespace-nowrap">Fecha de Venta</th>
                          <th className="py-2.5 px-3">Prenda / Producto</th>
                          <th className="py-2.5 px-3">SKU</th>
                          <th className="py-2.5 px-3">Color / Talla</th>
                          <th className="py-2.5 px-3 text-center">Piezas</th>
                          <th className="py-2.5 px-3 text-right">Precio Unit.</th>
                          <th className="py-2.5 px-3 text-right">Importe Total</th>
                          <th className="py-2.5 px-3 text-right bg-[#648D4B]/10 text-[#2A5A29]">
                            Acumulado
                          </th>
                          <th className="py-2.5 px-2 text-center">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 bg-white">
                        {ventasConAcumulado.map((v) => {
                          const fecha = new Date(v.fechaVenta).toLocaleString('es-BO', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          });

                          return (
                            <tr key={v.id} className="hover:bg-[#F0EEEF]/40 transition-colors">
                              {/* Fecha */}
                              <td className="py-2.5 px-3 whitespace-nowrap text-[#535456] font-medium text-[11px]">
                                {fecha}
                              </td>

                              {/* Prenda */}
                              <td className="py-2.5 px-3">
                                <span className="font-bold text-stone-900 block line-clamp-1">
                                  {v.articuloNombre}
                                </span>
                                <span className="text-[10px] text-[#535456]">
                                  {v.categoria}
                                </span>
                              </td>

                              {/* SKU */}
                              <td className="py-2.5 px-3 font-mono text-[11px] text-[#2A5A29] font-bold">
                                {v.varianteSku || v.sku}
                              </td>

                              {/* Color y Talla */}
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-1.5">
                                  <span 
                                    className="w-2.5 h-2.5 rounded-full border border-black/10 flex-shrink-0"
                                    style={{ backgroundColor: v.colorHex || getHexForColor(v.color) }}
                                  />
                                  <span className="font-medium text-stone-700 truncate max-w-[90px]">{v.color}</span>
                                  <span className="px-1.5 py-0.2 rounded bg-stone-100 font-bold text-stone-800 text-[10px]">
                                    {v.talla}
                                  </span>
                                </div>
                              </td>

                              {/* Cantidad */}
                              <td className="py-2.5 px-3 text-center font-bold text-stone-900">
                                {v.cantidad}
                              </td>

                              {/* Precio Unitario */}
                              <td className="py-2.5 px-3 text-right font-medium text-stone-700">
                                {formatBolivianos(v.precioUnitario)}
                              </td>

                              {/* Importe Total */}
                              <td className="py-2.5 px-3 text-right font-extrabold text-[#2A5A29]">
                                {formatBolivianos(v.importeTotal)}
                              </td>

                              {/* Importe Acumulado */}
                              <td className="py-2.5 px-3 text-right font-extrabold text-stone-900 bg-[#648D4B]/5">
                                {formatBolivianos(v.importeAcumulado)}
                              </td>

                              {/* Delete Action */}
                              <td className="py-2.5 px-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => eliminarVenta(v.id)}
                                  className="p-1 text-stone-300 hover:text-rose-600 rounded transition-colors cursor-pointer"
                                  title="Eliminar este registro de venta"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary row */}
                  <div className="bg-[#F0EEEF] px-4 py-3 border-t border-stone-200 flex items-center justify-between">
                    <div className="text-xs font-bold text-stone-700">
                      Total Registros: <strong className="text-stone-900">{ventasFiltradas.length}</strong> ventas ({ventasFiltradas.reduce((s, v) => s + v.cantidad, 0)} piezas)
                    </div>
                    <div className="text-xs font-bold text-[#2A5A29] flex items-center gap-2">
                      <span>Total Filtrado:</span>
                      <span className="text-sm font-extrabold">
                        {formatBolivianos(ventasFiltradas.reduce((s, v) => s + (v.importeTotal || (v.cantidad * v.precioUnitario)), 0))}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-[#F0EEEF]/60 rounded-2xl border border-stone-200">
                  <ShoppingBag className="w-8 h-8 mx-auto text-stone-400 mb-2 stroke-[1.5]" />
                  <p className="text-xs font-bold text-stone-700">No hay ventas registradas</p>
                  <p className="text-[11px] text-[#535456] mt-0.5">
                    Utiliza la opción "Vender" en cualquier prenda para registrar una venta en Bolivianos.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-stone-200 bg-[#F0EEEF] flex items-center justify-between">
            <button
              onClick={() => setIsSalesReportOpen(false)}
              className="px-4 py-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Cerrar
            </button>

            <button
              onClick={handleDownloadExcel}
              id="btn-descargar-reporte-excel-bottom"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#2A5A29] hover:bg-[#1e421d] text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Descargar Reporte en Excel (.xlsx)</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
