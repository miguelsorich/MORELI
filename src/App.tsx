import React from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { FilterBar } from './components/FilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductTable } from './components/ProductTable';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProductFormModal } from './components/ProductFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { QuickStockModal } from './components/QuickStockModal';
import { BackupModal } from './components/BackupModal';
import { CsvImportModal } from './components/CsvImportModal';
import { SellModal } from './components/SellModal';
import { SalesReportModal } from './components/SalesReportModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { ToastContainer } from './components/ToastContainer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { 
  PackageOpen, 
  Plus, 
  LayoutGrid, 
  List, 
  FileSpreadsheet,
  Sparkles 
} from 'lucide-react';
import { downloadInventoryExcelTemplate } from './utils/inventoryUtils';

const InventoryMain: React.FC = () => {
  const { 
    isAdmin,
    articulosFiltrados, 
    vista, 
    setVista,
    setIsModalCrearOpen, 
    limpiarFiltros,
    articulos 
  } = useInventory();

  return (
    <div className="min-h-screen bg-[#F0EEEF]/60 text-stone-800 flex flex-col font-sans antialiased">
      
      {/* Top Navigation with Moreli Palette */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Dashboard with KPIs in Bolivianos Bs. and Sales Indicators - Admin Only */}
        {isAdmin && <Dashboard />}

        {/* Client View Welcome Banner */}
        {!isAdmin && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#2A5A29]/10 text-[#2A5A29] mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#B89C71]" />
                <span>Catálogo Oficial Moreli</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                Prendas Exclusivas • Calzado • Perfumes • Accesorios
              </h1>
              <p className="text-xs sm:text-sm text-[#535456] max-w-xl">
                Explora nuestras colecciones, colores disponibles y tallas. Precios expresados en Bolivianos (Bs.).
              </p>
            </div>

            <div className="text-center sm:text-right bg-[#F0EEEF] px-4 py-2.5 rounded-2xl border border-stone-200 flex-shrink-0">
              <span className="text-[11px] font-bold text-[#535456] block uppercase tracking-wider">
                Prendas Disponibles
              </span>
              <span className="text-lg font-extrabold text-[#2A5A29]">
                {articulosFiltrados.length} modelos
              </span>
            </div>
          </div>
        )}

        {/* Search & Category Filter Toolbar */}
        <FilterBar />

        {/* View mode toggle header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              {isAdmin ? 'Catálogo de Gestión Moreli' : 'Prendas en Exhibición'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#2A5A29]/10 text-[#2A5A29] border border-[#2A5A29]/20">
              {articulosFiltrados.length} {articulosFiltrados.length === 1 ? 'modelo' : 'modelos'}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-stone-200 shadow-2xs">
            <button
              id="btn-vista-cuadricula"
              onClick={() => setVista('grid')}
              className={`p-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                vista === 'grid'
                  ? 'bg-[#2A5A29] text-white shadow-2xs'
                  : 'text-[#535456] hover:text-stone-800'
              }`}
              title="Vista de Cuadrícula"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Tarjetas</span>
            </button>

            <button
              id="btn-vista-tabla"
              onClick={() => setVista('tabla')}
              className={`p-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                vista === 'tabla'
                  ? 'bg-[#2A5A29] text-white shadow-2xs'
                  : 'text-[#535456] hover:text-stone-800'
              }`}
              title="Vista de Tabla Detallada"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Tabla</span>
            </button>
          </div>
        </div>

        {/* Inventory View (Cards Grid or Dense Table) */}
        {articulosFiltrados.length > 0 ? (
          vista === 'grid' ? (
            <div 
              id="grid-productos" 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
            >
              {articulosFiltrados.map(articulo => (
                <ProductCard key={articulo.id} articulo={articulo} />
              ))}
            </div>
          ) : (
            <ProductTable articulos={articulosFiltrados} />
          )
        ) : (
          /* Empty State */
          <div 
            id="empty-state-inventario"
            className="bg-white rounded-3xl border border-stone-200 p-10 sm:p-14 text-center max-w-lg mx-auto my-8 shadow-sm"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#F0EEEF] text-[#9F7652] flex items-center justify-center mx-auto mb-4 border border-stone-200">
              <PackageOpen className="w-8 h-8 stroke-[1.5]" />
            </div>

            <h3 className="text-base font-bold text-stone-900 mb-1">
              No se encontraron prendas
            </h3>
            
            <p className="text-xs text-[#535456] mb-6 leading-relaxed">
              {articulos.length === 0 
                ? (isAdmin
                    ? 'El catálogo de Moreli no tiene prendas activas. Puedes registrar una nueva prenda o cargar la plantilla oficial en Excel (.xlsx).'
                    : 'El catálogo se encuentra en actualización. Por favor vuelve a consultar pronto.')
                : 'No hay prendas disponibles que coincidan con la búsqueda o filtro actual.'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {articulos.length > 0 ? (
                <button
                  onClick={limpiarFiltros}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Restablecer Filtros
                </button>
              ) : (
                isAdmin && (
                  <>
                    <button
                      onClick={downloadInventoryExcelTemplate}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F0EEEF] hover:bg-stone-200 text-[#9F7652] text-xs font-bold rounded-xl border border-stone-200 transition-colors cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Descargar Plantilla Excel (.xlsx)</span>
                    </button>

                    <button
                      onClick={() => setIsModalCrearOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2A5A29] hover:bg-[#1e421d] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nueva Prenda</span>
                    </button>
                  </>
                )
              )}
            </div>
          </div>
        )}

      </main>

      {/* Clean Moreli footer */}
      <footer className="border-t border-stone-200 bg-white py-5 mt-12 text-xs text-[#535456] text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#2A5A29]">MORELI</span>
            <span className="text-stone-300">•</span>
            <span>{isAdmin ? 'Gestión de Inventario & Ventas (Moneda Oficial: Bolivianos Bs.)' : 'Catálogo de Moda & Calzado'}</span>
          </div>
          <span className="text-[11px] text-[#535456] font-mono">
            {isAdmin ? 'Tallas Brasileras de Calzado & Reportes Automáticos en Excel' : 'Tallas Brasileras & Variedad de Colores'}
          </span>
        </div>
      </footer>

      {/* Secret Admin Authentication Modal */}
      <AdminAuthModal />

      {/* Global Modals & Notifications */}
      <ProductDetailModal />
      {isAdmin && (
        <>
          <ProductFormModal />
          <DeleteConfirmModal />
          <QuickStockModal />
          <BackupModal />
          <CsvImportModal />
          <SellModal />
          <SalesReportModal />
        </>
      )}
      <ToastContainer />

    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <InventoryProvider>
        <InventoryMain />
      </InventoryProvider>
    </ErrorBoundary>
  );
}
