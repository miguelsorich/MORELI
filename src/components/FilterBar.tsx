import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { COLORES_PRESET, GRUPOS_TALLAS } from '../data/initialData';
import { 
  Search, 
  X, 
  ArrowUpDown, 
  Tag, 
  Palette,
  Ruler,
  SlidersHorizontal
} from 'lucide-react';

export const FilterBar: React.FC = () => {
  const { 
    filtro, 
    setFiltro, 
    limpiarFiltros, 
    categorias, 
    articulosFiltrados, 
    articulos 
  } = useInventory();

  const isFilterActive = 
    filtro.busqueda !== '' || 
    filtro.categoria !== 'todas' || 
    filtro.color !== 'todos' || 
    filtro.talla !== 'todas' ||
    filtro.orden !== 'recientes';

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-2xs space-y-4" id="barra-filtros">
      
      {/* Top Search and Sorter */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            id="input-busqueda-inventario"
            type="text"
            placeholder="Buscar por nombre, código SKU (Ej. MOR-BLU-001), color o descripción..."
            value={filtro.busqueda}
            onChange={(e) => setFiltro(prev => ({ ...prev, busqueda: e.target.value }))}
            className="w-full pl-10 pr-9 py-2.5 bg-[#F0EEEF]/60 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#2A5A29] focus:bg-white transition-all"
          />
          {filtro.busqueda && (
            <button
              onClick={() => setFiltro(prev => ({ ...prev, busqueda: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-600 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-[#F0EEEF]/70 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#9F7652]" />
            <span className="hidden sm:inline">Ordenar:</span>
            <select
              id="select-ordenar-inventario"
              value={filtro.orden}
              onChange={(e) => setFiltro(prev => ({ ...prev, orden: e.target.value as any }))}
              className="bg-transparent text-xs font-bold text-stone-900 focus:outline-none cursor-pointer"
            >
              <option value="recientes">Más recientes</option>
              <option value="nombre_asc">Nombre (A - Z)</option>
              <option value="nombre_desc">Nombre (Z - A)</option>
              <option value="precio_asc">Precio (Menor a Mayor)</option>
              <option value="precio_desc">Precio (Mayor a Menor)</option>
              <option value="stock_asc">Stock (Menor a Mayor)</option>
              <option value="stock_desc">Stock (Mayor a Menor)</option>
            </select>
          </div>

          {isFilterActive && (
            <button
              id="btn-limpiar-filtros"
              onClick={limpiarFiltros}
              className="inline-flex items-center gap-1 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              title="Restablecer todos los filtros"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          )}
        </div>

      </div>

      {/* Secondary dropdown filters: Categoría, Color, Talla Brasilera */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-100">
        
        {/* Category filter */}
        <div>
          <label className="block text-[11px] font-bold text-[#535456] uppercase tracking-wider mb-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-[#2A5A29]" />
            Categoría:
          </label>
          <select
            id="filtro-select-categoria"
            value={filtro.categoria}
            onChange={(e) => setFiltro(prev => ({ ...prev, categoria: e.target.value }))}
            className="w-full text-xs px-3 py-2 bg-[#F0EEEF]/60 border border-stone-200 rounded-xl text-stone-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#2A5A29] cursor-pointer"
          >
            <option value="todas">Todas las categorías ({categorias.length})</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Color filter */}
        <div>
          <label className="block text-[11px] font-bold text-[#535456] uppercase tracking-wider mb-1 flex items-center gap-1">
            <Palette className="w-3 h-3 text-[#9F7652]" />
            Color:
          </label>
          <select
            id="filtro-select-color"
            value={filtro.color}
            onChange={(e) => setFiltro(prev => ({ ...prev, color: e.target.value }))}
            className="w-full text-xs px-3 py-2 bg-[#F0EEEF]/60 border border-stone-200 rounded-xl text-stone-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#2A5A29] cursor-pointer"
          >
            <option value="todos">Todos los colores</option>
            {COLORES_PRESET.map(col => (
              <option key={col.nombre} value={col.nombre}>{col.nombre}</option>
            ))}
          </select>
        </div>

        {/* Size filter (including Brazilian sizes) */}
        <div>
          <label className="block text-[11px] font-bold text-[#535456] uppercase tracking-wider mb-1 flex items-center gap-1">
            <Ruler className="w-3 h-3 text-[#648D4B]" />
            Talla (Prendas o Calzado BR):
          </label>
          <select
            id="filtro-select-talla"
            value={filtro.talla}
            onChange={(e) => setFiltro(prev => ({ ...prev, talla: e.target.value }))}
            className="w-full text-xs px-3 py-2 bg-[#F0EEEF]/60 border border-stone-200 rounded-xl text-stone-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#2A5A29] cursor-pointer"
          >
            <option value="todas">Todas las tallas</option>
            <optgroup label="Tallas Brasileras de Calzado">
              {GRUPOS_TALLAS.calzado.map(sz => (
                <option key={`calzado-${sz}`} value={sz}>Calzado BR {sz}</option>
              ))}
            </optgroup>
            <optgroup label="Tallas de Prendas">
              {GRUPOS_TALLAS.prendas.map(sz => (
                <option key={`prendas-${sz}`} value={sz}>Prendas {sz}</option>
              ))}
            </optgroup>
            <optgroup label="Pantalones">
              {GRUPOS_TALLAS.pantalones.map(sz => (
                <option key={`pantalones-${sz}`} value={sz}>Pantalón {sz}</option>
              ))}
            </optgroup>
            <optgroup label="General">
              <option value="Única">Talla Única</option>
            </optgroup>
          </select>
        </div>

      </div>

    </div>
  );
};
