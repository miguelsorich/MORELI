import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { formatBolivianos, exportSalesReportToExcel } from '../utils/inventoryUtils';
import { 
  Package, 
  Layers, 
  Tag, 
  DollarSign, 
  FileSpreadsheet, 
  ShoppingBag,
  Receipt,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

export const Dashboard: React.FC = () => {
  const { 
    estadisticas, 
    setIsSalesReportOpen,
    ventas,
    setFiltro 
  } = useInventory();

  return (
    <div className="space-y-5" id="seccion-dashboard">
      
      {/* 4 Main KPI Cards: Sales Pieces, Total Revenue, Active Garments, Available Stock */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Prendas / Piezas Vendidas */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsSalesReportOpen(true)}
          className="p-5 rounded-2xl bg-[#F0EEEF] border border-stone-200 shadow-2xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#535456]">
              Prendas Vendidas
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#2A5A29] text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#2A5A29] tracking-tight">
              {estadisticas.totalPiezasVendidas}
            </span>
            <span className="text-xs text-[#535456] block mt-0.5 font-medium">
              {ventas.length} transacciones registradas • Ver reporte →
            </span>
          </div>
        </motion.div>

        {/* KPI 2: Ingreso Total por Ventas (Bs.) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          onClick={() => setIsSalesReportOpen(true)}
          className="p-5 rounded-2xl bg-[#F0EEEF] border border-stone-200 shadow-2xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#535456]">
              Ingreso Total por Ventas
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#2A5A29] text-white flex items-center justify-center shadow-xs">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-extrabold text-[#2A5A29] tracking-tight truncate block">
              {formatBolivianos(estadisticas.totalIngresosVentas)}
            </span>
            <span className="text-xs text-[#535456] block mt-0.5 font-medium">
              Acumulado en moneda nacional (Bs.)
            </span>
          </div>
        </motion.div>

        {/* KPI 3: Modelos de Prendas en Catálogo Activo */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="p-5 rounded-2xl bg-[#F0EEEF] border border-stone-200 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#535456]">
              Modelos en Catálogo
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#9F7652] text-white flex items-center justify-center shadow-xs">
              <Tag className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {estadisticas.totalProductos}
            </span>
            <span className="text-xs text-[#535456] block mt-0.5 font-medium">
              En {estadisticas.totalCategorias} categorías activas
            </span>
          </div>
        </motion.div>

        {/* KPI 4: Unidades en Stock Físico */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="p-5 rounded-2xl bg-[#F0EEEF] border border-stone-200 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#535456]">
              Existencias Físicas (Stock)
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#648D4B] text-white flex items-center justify-center shadow-xs">
              <Package className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {estadisticas.totalUnidades}
            </span>
            <span className="text-xs text-[#535456] block mt-0.5 font-medium">
              Valor estimado: {formatBolivianos(estadisticas.valorTotalEstimado)}
            </span>
          </div>
        </motion.div>

      </div>

      {/* Category Overview & Sales Report Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Distribution with Inventory Value */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#2A5A29]" />
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-tight">
                Distribución y Existencias por Categoría
              </h3>
            </div>
            <span className="text-xs text-[#535456] font-medium">
              {estadisticas.distribucionCategorias.length} líneas registradas
            </span>
          </div>

          <div className="space-y-3">
            {estadisticas.distribucionCategorias.map((cat) => {
              const porcentaje = estadisticas.totalUnidades > 0 
                ? Math.round((cat.unidades / estadisticas.totalUnidades) * 100) 
                : 0;

              return (
                <div 
                  key={cat.categoria} 
                  onClick={() => setFiltro(prev => ({ ...prev, categoria: cat.categoria }))}
                  className="p-3 rounded-xl bg-[#F0EEEF]/60 hover:bg-[#F0EEEF] transition-colors cursor-pointer border border-stone-200/80"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-stone-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#2A5A29]"></span>
                      {cat.categoria}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[#535456] font-medium">{cat.cantidad} modelos ({cat.unidades} u.)</span>
                      <span className="font-bold text-[#2A5A29]">{formatBolivianos(cat.valor)}</span>
                    </div>
                  </div>

                  {/* Progress bar in Verde Musgo Claro (#648D4B) */}
                  <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                    <div 
                      className="h-full bg-[#648D4B] rounded-full transition-all duration-500"
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sales & Revenue Quick Action Box */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Receipt className="w-4 h-4 text-[#9F7652]" />
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-tight">
                Módulo de Ventas & Reportes
              </h3>
            </div>
            <p className="text-xs text-[#535456] leading-relaxed">
              Al colocar una prenda como <strong className="text-stone-900 font-semibold">Vendida</strong>, se descuenta de las existencias y si se agota, se retira automáticamente del catálogo activo mientras suma a los ingresos.
            </p>
          </div>

          <div className="p-4 bg-[#F0EEEF] rounded-xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#535456] font-semibold">Piezas Vendidas:</span>
              <span className="font-extrabold text-stone-900">{estadisticas.totalPiezasVendidas} u.</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#535456] font-semibold">Ingresos Totales:</span>
              <span className="font-extrabold text-[#2A5A29]">{formatBolivianos(estadisticas.totalIngresosVentas)}</span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <button
              onClick={() => setIsSalesReportOpen(true)}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#2A5A29] hover:bg-[#1e421d] text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <Receipt className="w-4 h-4" />
              <span>Ver Historial de Ingresos Completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => exportSalesReportToExcel(ventas)}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#F0EEEF] hover:bg-stone-200 text-[#9F7652] text-xs font-bold transition-colors cursor-pointer border border-stone-200"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#2A5A29]" />
              <span>Descargar Reporte en Excel (.xlsx)</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
