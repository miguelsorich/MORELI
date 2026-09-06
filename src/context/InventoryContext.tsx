import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Articulo, 
  FiltroInventario, 
  EstadisticasInventario, 
  ToastMessage, 
  Variante,
  Venta
} from '../types/inventory';
import { ARTICULOS_INICIALES, CATEGORIAS_DEFAULT, VENTAS_INICIALES } from '../data/initialData';
import { generateAutoProductSku, generateAutoVariantSku, getHexForColor } from '../utils/inventoryUtils';

interface InventoryContextType {
  articulos: Articulo[];
  categorias: string[];
  ventas: Venta[];
  articulosFiltrados: Articulo[];
  estadisticas: EstadisticasInventario;
  filtro: FiltroInventario;
  setFiltro: React.Dispatch<React.SetStateAction<FiltroInventario>>;
  limpiarFiltros: () => void;
  vista: 'grid' | 'tabla';
  setVista: (vista: 'grid' | 'tabla') => void;
  
  // Admin & Portal state
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  isAdminAuthModalOpen: boolean;
  setIsAdminAuthModalOpen: (open: boolean) => void;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;

  // Modals & UI States
  isModalCrearOpen: boolean;
  setIsModalCrearOpen: (open: boolean) => void;
  isImportModalOpen: boolean;
  setIsImportModalOpen: (open: boolean) => void;
  isSalesReportOpen: boolean;
  setIsSalesReportOpen: (open: boolean) => void;
  articuloEdicion: Articulo | null;
  setArticuloEdicion: (articulo: Articulo | null) => void;
  articuloDetalle: Articulo | null;
  setArticuloDetalle: (articulo: Articulo | null) => void;
  articuloEliminar: Articulo | null;
  setArticuloEliminar: (articulo: Articulo | null) => void;
  quickStockTarget: { articulo: Articulo; variante: Variante } | null;
  setQuickStockTarget: (target: { articulo: Articulo; variante: Variante } | null) => void;
  sellTarget: { articulo: Articulo; variante?: Variante } | null;
  setSellTarget: (target: { articulo: Articulo; variante?: Variante } | null) => void;
  isBackupModalOpen: boolean;
  setIsBackupModalOpen: (open: boolean) => void;

  // CRUD actions
  crearArticulo: (nuevo: Omit<Articulo, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => boolean;
  actualizarArticulo: (id: string, actualizacion: Partial<Articulo>) => boolean;
  eliminarArticulo: (id: string) => boolean;
  actualizarStockVariante: (articuloId: string, varianteId: string, cantidad: number, esDelta?: boolean) => void;
  agregarCategoria: (nueva: string) => void;

  // Sales Registration & Auto Removal
  registrarVenta: (datos: {
    articulo: Articulo;
    varianteId: string;
    cantidadVendida: number;
    precioUnitario: number;
  }) => boolean;
  eliminarVenta: (ventaId: string) => void;
  
  // Excel batch import
  importarArticulosExcel: (nuevosArticulos: Articulo[], nuevasCategorias: string[]) => void;
  
  // Backup / Data tools
  restablecerDatosEjemplo: () => void;
  exportarJSON: () => void;
  importarJSON: (jsonString: string) => boolean;

  // Toasts
  toasts: ToastMessage[];
  mostrarToast: (tipo: ToastMessage['tipo'], titulo: string, mensaje: string) => void;
  eliminarToast: (id: string) => void;
}

const STORAGE_KEY_ARTICULOS = 'moreli_inventario_prendas_v4';
const STORAGE_KEY_CATEGORIAS = 'moreli_inventario_categorias_v4';
const STORAGE_KEY_VENTAS = 'moreli_inventario_ventas_v4';
const STORAGE_KEY_ADMIN_AUTH = 'moreli_admin_auth_v1';
const ADMIN_PASSWORD_HASH = '3822';

const FILTRO_INICIAL: FiltroInventario = {
  busqueda: '',
  categoria: 'todas',
  color: 'todos',
  talla: 'todas',
  orden: 'recientes'
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load persisted articles (only items with stock)
  const [articulos, setArticulos] = useState<Articulo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ARTICULOS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading inventory from storage', e);
    }
    return ARTICULOS_INICIALES;
  });

  // Load persisted categories
  const [categorias, setCategorias] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CATEGORIAS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading categories from storage', e);
    }
    return CATEGORIAS_DEFAULT;
  });

  // Load persisted sales history
  const [ventas, setVentas] = useState<Venta[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VENTAS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading sales from storage', e);
    }
    return VENTAS_INICIALES;
  });

  // Filter state
  const [filtro, setFiltro] = useState<FiltroInventario>(FILTRO_INICIAL);
  const [vista, setVista] = useState<'grid' | 'tabla'>('grid');

  // Admin and Portal Authentication State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  // Modals state
  const [isModalCrearOpen, setIsModalCrearOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSalesReportOpen, setIsSalesReportOpen] = useState(false);
  const [articuloEdicion, setArticuloEdicion] = useState<Articulo | null>(null);
  const [articuloDetalle, setArticuloDetalle] = useState<Articulo | null>(null);
  const [articuloEliminar, setArticuloEliminar] = useState<Articulo | null>(null);
  const [quickStockTarget, setQuickStockTarget] = useState<{ articulo: Articulo; variante: Variante } | null>(null);
  const [sellTarget, setSellTarget] = useState<{ articulo: Articulo; variante?: Variante } | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ARTICULOS, JSON.stringify(articulos));
    } catch (e) {
      console.error('Error persisting articles', e);
    }
  }, [articulos]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIAS, JSON.stringify(categorias));
    } catch (e) {
      console.error('Error persisting categories', e);
    }
  }, [categorias]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VENTAS, JSON.stringify(ventas));
    } catch (e) {
      console.error('Error persisting sales', e);
    }
  }, [ventas]);

  // Toast helpers
  const mostrarToast = (tipo: ToastMessage['tipo'], titulo: string, mensaje: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts(prev => [...prev, { id, tipo, titulo, mensaje }]);
    setTimeout(() => {
      eliminarToast(id);
    }, 4500);
  };

  const eliminarToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Admin Auth Methods
  const loginAdmin = (password: string): boolean => {
    if (password.trim() === ADMIN_PASSWORD_HASH) {
      setIsAdmin(true);
      try {
        localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
      } catch (e) {
        console.error('Error saving admin session', e);
      }
      mostrarToast('success', 'Modo Administrador Activo', 'Acceso concedido al panel completo de Moreli.');
      return true;
    }
    mostrarToast('error', 'Contraseña Incorrecta', 'La contraseña ingresada no es válida.');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
    } catch (e) {
      console.error('Error removing admin session', e);
    }
    mostrarToast('info', 'Sesión Finalizada', 'Has salido al portal público del catálogo Moreli.');
  };

  // Add new category
  const agregarCategoria = (nueva: string) => {
    const nombre = nueva.trim();
    if (!nombre) return;
    if (categorias.some(c => c.toLowerCase() === nombre.toLowerCase())) {
      mostrarToast('info', 'Categoría existente', `"${nombre}" ya está registrada.`);
      return;
    }
    setCategorias(prev => [...prev, nombre]);
    mostrarToast('success', 'Categoría agregada', `Se añadió "${nombre}" a la lista.`);
  };

  // Clean filters
  const limpiarFiltros = () => {
    setFiltro(FILTRO_INICIAL);
  };

  // CRUD Operations
  const crearArticulo = (nuevo: Omit<Articulo, 'id' | 'fechaCreacion' | 'fechaActualizacion'>): boolean => {
    try {
      const now = new Date().toISOString();
      const id = `prod-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
      
      const autoProductSku = (nuevo.sku && nuevo.sku.trim().length > 0)
        ? nuevo.sku.trim().toUpperCase()
        : generateAutoProductSku(nuevo.categoria, articulos);

      const processedVariantes: Variante[] = (nuevo.variantes || []).map((v, idx) => ({
        ...v,
        id: v.id || `var-${id}-${idx + 1}`,
        colorHex: v.colorHex || getHexForColor(v.color),
        sku: (v.sku && v.sku.trim().length > 0)
          ? v.sku.trim().toUpperCase()
          : generateAutoVariantSku(autoProductSku, v.color, v.talla)
      })).filter(v => v.cantidad > 0); // Only keep variants with stock

      if (processedVariantes.length === 0) {
        mostrarToast('warning', 'Sin existencias', 'El producto debe tener al menos una unidad en stock.');
        return false;
      }

      const articuloCompleto: Articulo = {
        ...nuevo,
        id,
        sku: autoProductSku,
        variantes: processedVariantes,
        fechaCreacion: now,
        fechaActualizacion: now
      };

      setArticulos(prev => [articuloCompleto, ...prev]);

      if (nuevo.categoria && !categorias.includes(nuevo.categoria)) {
        setCategorias(prev => [...prev, nuevo.categoria]);
      }

      mostrarToast('success', 'Prenda Registrada', `"${nuevo.nombre}" con código ${autoProductSku} fue añadida al catálogo.`);
      return true;
    } catch (e) {
      console.error(e);
      mostrarToast('error', 'Error al guardar', 'No se pudo crear el artículo.');
      return false;
    }
  };

  const actualizarArticulo = (id: string, actualizacion: Partial<Articulo>): boolean => {
    try {
      const now = new Date().toISOString();
      let articuloActualizado: Articulo | null = null;

      setArticulos(prev => {
        const nextList: Articulo[] = [];
        for (const art of prev) {
          if (art.id === id) {
            const productSku = actualizacion.sku || art.sku || generateAutoProductSku(actualizacion.categoria || art.categoria, prev);
            
            let variantesActualizadas = actualizacion.variantes ? actualizacion.variantes : art.variantes;
            variantesActualizadas = variantesActualizadas.map((v, idx) => ({
              ...v,
              id: v.id || `var-${id}-${idx + 1}`,
              colorHex: v.colorHex || getHexForColor(v.color),
              sku: v.sku || generateAutoVariantSku(productSku, v.color, v.talla)
            })).filter(v => v.cantidad > 0); // Remove 0 stock variants

            const totalStock = variantesActualizadas.reduce((sum, v) => sum + (v.cantidad || 0), 0);

            // If 0 stock remains, automatically remove from active inventory
            if (totalStock > 0) {
              articuloActualizado = {
                ...art,
                ...actualizacion,
                sku: productSku,
                variantes: variantesActualizadas,
                fechaActualizacion: now
              };
              nextList.push(articuloActualizado);
            }
          } else {
            nextList.push(art);
          }
        }
        return nextList;
      });

      if (articuloDetalle && articuloDetalle.id === id) {
        setArticuloDetalle(articuloActualizado);
      }

      mostrarToast('success', 'Cambios guardados', 'El catálogo ha sido actualizado.');
      return true;
    } catch (e) {
      console.error(e);
      mostrarToast('error', 'Error al actualizar', 'No se pudieron guardar los cambios.');
      return false;
    }
  };

  const eliminarArticulo = (id: string): boolean => {
    try {
      const objetivo = articulos.find(a => a.id === id);
      setArticulos(prev => prev.filter(a => a.id !== id));
      if (articuloDetalle?.id === id) setArticuloDetalle(null);
      if (articuloEdicion?.id === id) setArticuloEdicion(null);

      mostrarToast('info', 'Prenda eliminada', `"${objetivo?.nombre || 'Artículo'}" ha sido retirado del inventario.`);
      return true;
    } catch (e) {
      console.error(e);
      mostrarToast('error', 'Error al eliminar', 'No se pudo eliminar el artículo.');
      return false;
    }
  };

  const actualizarStockVariante = (
    articuloId: string, 
    varianteId: string, 
    cantidad: number, 
    esDelta = false
  ) => {
    const now = new Date().toISOString();
    setArticulos(prev => {
      const nextList: Articulo[] = [];
      
      for (const art of prev) {
        if (art.id === articuloId) {
          const variantes = art.variantes.map(v => {
            if (v.id === varianteId) {
              const nuevaCantidad = esDelta 
                ? Math.max(0, (v.cantidad || 0) + cantidad) 
                : Math.max(0, cantidad);
              return { ...v, cantidad: nuevaCantidad };
            }
            return v;
          }).filter(v => v.cantidad > 0); // Strip 0 stock variants automatically

          const totalStock = variantes.reduce((sum, v) => sum + (v.cantidad || 0), 0);
          
          if (totalStock > 0) {
            const actualizado = {
              ...art,
              variantes,
              fechaActualizacion: now
            };
            if (articuloDetalle && articuloDetalle.id === articuloId) {
              setArticuloDetalle(actualizado);
            }
            nextList.push(actualizado);
          } else {
            // Auto removed from active list
            if (articuloDetalle && articuloDetalle.id === articuloId) {
              setArticuloDetalle(null);
            }
          }
        } else {
          nextList.push(art);
        }
      }

      return nextList;
    });
  };

  /**
   * REGISTRAR VENTA:
   * 1. Suma al reporte de ventas e ingresos
   * 2. Descuenta la cantidad vendida
   * 3. Elimina automáticamente la prenda de la lista cuando su stock llega a 0
   */
  const registrarVenta = (datos: {
    articulo: Articulo;
    varianteId: string;
    cantidadVendida: number;
    precioUnitario: number;
  }): boolean => {
    try {
      const { articulo, varianteId, cantidadVendida, precioUnitario } = datos;
      const targetVar = articulo.variantes.find(v => v.id === varianteId) || articulo.variantes[0];
      
      if (!targetVar) {
        mostrarToast('error', 'Error', 'No se encontró la variante seleccionada.');
        return false;
      }

      const cantARestar = Math.min(targetVar.cantidad, Math.max(1, cantidadVendida));
      const totalImporte = cantARestar * precioUnitario;
      const now = new Date().toISOString();

      // 1. Create Sale Record
      const nuevaVenta: Venta = {
        id: `vta-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
        fechaVenta: now,
        articuloId: articulo.id,
        articuloNombre: articulo.nombre,
        categoria: articulo.categoria,
        sku: articulo.sku || 'MOR-ART',
        varianteSku: targetVar.sku || `${articulo.sku}-${targetVar.color.slice(0,3).toUpperCase()}-${targetVar.talla}`,
        color: targetVar.color,
        colorHex: targetVar.colorHex || getHexForColor(targetVar.color),
        talla: targetVar.talla,
        cantidad: cantARestar,
        precioUnitario: precioUnitario,
        importeTotal: totalImporte
      };

      setVentas(prev => [nuevaVenta, ...prev]);

      // 2. Decrement stock & auto-remove if 0
      setArticulos(prev => {
        const nextList: Articulo[] = [];

        for (const art of prev) {
          if (art.id === articulo.id) {
            const updatedVariantes = art.variantes.map(v => {
              if (v.id === targetVar.id) {
                return { ...v, cantidad: v.cantidad - cantARestar };
              }
              return v;
            }).filter(v => v.cantidad > 0); // Remove 0 stock variant

            const remainingStock = updatedVariantes.reduce((sum, v) => sum + (v.cantidad || 0), 0);

            if (remainingStock > 0) {
              const actualizado = {
                ...art,
                variantes: updatedVariantes,
                fechaActualizacion: now
              };
              if (articuloDetalle && articuloDetalle.id === articulo.id) {
                setArticuloDetalle(actualizado);
              }
              nextList.push(actualizado);
            } else {
              // Complete article sold out -> Automatically removed from active list!
              if (articuloDetalle && articuloDetalle.id === articulo.id) {
                setArticuloDetalle(null);
              }
            }
          } else {
            nextList.push(art);
          }
        }

        return nextList;
      });

      mostrarToast(
        'success',
        '¡Venta Registrada Exitosamente!',
        `"${articulo.nombre}" (${targetVar.color} - Talla ${targetVar.talla}) vendida por Bs. ${totalImporte.toFixed(2)}. Sumada al Reporte de Ingresos.`
      );

      return true;
    } catch (e) {
      console.error(e);
      mostrarToast('error', 'Error al registrar venta', 'No se pudo completar la operación.');
      return false;
    }
  };

  const eliminarVenta = (ventaId: string) => {
    setVentas(prev => prev.filter(v => v.id !== ventaId));
    mostrarToast('info', 'Venta eliminada', 'El registro de venta fue eliminado del reporte.');
  };

  // Import batch Excel items
  const importarArticulosExcel = (nuevosArticulos: Articulo[], nuevasCategorias: string[]) => {
    if (nuevosArticulos.length === 0) return;

    setCategorias(prev => {
      const merged = new Set([...prev, ...nuevasCategorias]);
      return Array.from(merged);
    });

    setArticulos(prev => [...nuevosArticulos, ...prev]);

    mostrarToast(
      'success', 
      'Catálogo Excel Importado', 
      `Se incorporaron ${nuevosArticulos.length} prendas al inventario activo.`
    );
  };

  // Reset demo data
  const restablecerDatosEjemplo = () => {
    setArticulos(ARTICULOS_INICIALES);
    setCategorias(CATEGORIAS_DEFAULT);
    setVentas(VENTAS_INICIALES);
    localStorage.removeItem(STORAGE_KEY_ARTICULOS);
    localStorage.removeItem(STORAGE_KEY_CATEGORIAS);
    localStorage.removeItem(STORAGE_KEY_VENTAS);
    mostrarToast('info', 'Datos restablecidos', 'Se cargó el catálogo y reporte de muestra Moreli en Bolivianos.');
  };

  // JSON Export / Import
  const exportarJSON = () => {
    const backup = {
      version: '3.0-moreli-ventas-ingresos-bolivia',
      fechaExportacion: new Date().toISOString(),
      moneda: 'BOB (Bs.)',
      categorias,
      articulos,
      ventas
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `moreli_inventario_ventas_respaldo_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    mostrarToast('success', 'Respaldo generado', 'Archivo de respaldo descargado correctamente.');
  };

  const importarJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.articulos) && Array.isArray(parsed.categorias)) {
        setArticulos(parsed.articulos);
        setCategorias(parsed.categorias);
        if (Array.isArray(parsed.ventas)) {
          setVentas(parsed.ventas);
        }
        mostrarToast('success', 'Respaldo restaurado', `Se importaron ${parsed.articulos.length} artículos y ${(parsed.ventas || []).length} ventas.`);
        return true;
      }
      mostrarToast('error', 'Formato incompatible', 'El archivo no contiene una estructura válida.');
      return false;
    } catch {
      mostrarToast('error', 'Error al leer JSON', 'El archivo seleccionado está dañado o no es válido.');
      return false;
    }
  };

  // Statistics Calculation (Including Sales & Revenues)
  const estadisticas: EstadisticasInventario = useMemo(() => {
    let totalUnidades = 0;
    let valorTotalEstimado = 0;
    const catMap = new Map<string, { cantidad: number; unidades: number; valor: number }>();

    articulos.forEach(art => {
      const stockArticulo = art.variantes.reduce((sum, v) => sum + (Number(v.cantidad) || 0), 0);
      const valorArticulo = stockArticulo * (art.precio || 0);

      totalUnidades += stockArticulo;
      valorTotalEstimado += valorArticulo;

      const currentCat = catMap.get(art.categoria) || { cantidad: 0, unidades: 0, valor: 0 };
      currentCat.cantidad += 1;
      currentCat.unidades += stockArticulo;
      currentCat.valor += valorArticulo;
      catMap.set(art.categoria, currentCat);
    });

    const distribucionCategorias = Array.from(catMap.entries()).map(([categoria, datos]) => ({
      categoria,
      cantidad: datos.cantidad,
      unidades: datos.unidades,
      valor: datos.valor
    }));

    // Sales metrics
    const totalPiezasVendidas = ventas.reduce((sum, v) => sum + (Number(v.cantidad) || 0), 0);
    const totalIngresosVentas = ventas.reduce((sum, v) => sum + (Number(v.importeTotal) || (v.cantidad * v.precioUnitario) || 0), 0);

    return {
      totalProductos: articulos.length,
      totalUnidades,
      totalCategorias: categorias.length,
      valorTotalEstimado,
      totalPiezasVendidas,
      totalIngresosVentas,
      distribucionCategorias
    };
  }, [articulos, categorias, ventas]);

  // Filtered & Sorted Articles
  const articulosFiltrados = useMemo(() => {
    return articulos.filter(art => {
      // Search term
      if (filtro.busqueda.trim()) {
        const query = filtro.busqueda.toLowerCase().trim();
        const matchNombre = art.nombre.toLowerCase().includes(query);
        const matchSku = art.sku?.toLowerCase().includes(query);
        const matchDesc = art.descripcion?.toLowerCase().includes(query);
        const matchVarSku = art.variantes.some(v => v.sku?.toLowerCase().includes(query));
        const matchColor = art.variantes.some(v => v.color.toLowerCase().includes(query));
        if (!matchNombre && !matchSku && !matchDesc && !matchVarSku && !matchColor) return false;
      }

      // Category
      if (filtro.categoria !== 'todas' && art.categoria !== filtro.categoria) {
        return false;
      }

      // Color
      if (filtro.color !== 'todos') {
        const hasColor = art.variantes.some(v => v.color.toLowerCase() === filtro.color.toLowerCase());
        if (!hasColor) return false;
      }

      // Size
      if (filtro.talla !== 'todas') {
        const hasTalla = art.variantes.some(v => v.talla.toLowerCase() === filtro.talla.toLowerCase());
        if (!hasTalla) return false;
      }

      return true;
    }).sort((a, b) => {
      const stockA = a.variantes.reduce((sum, v) => sum + (Number(v.cantidad) || 0), 0);
      const stockB = b.variantes.reduce((sum, v) => sum + (Number(v.cantidad) || 0), 0);

      switch (filtro.orden) {
        case 'nombre_asc':
          return a.nombre.localeCompare(b.nombre);
        case 'nombre_desc':
          return b.nombre.localeCompare(a.nombre);
        case 'precio_asc':
          return a.precio - b.precio;
        case 'precio_desc':
          return b.precio - a.precio;
        case 'stock_asc':
          return stockA - stockB;
        case 'stock_desc':
          return stockB - stockA;
        case 'recientes':
        default:
          return new Date(b.fechaActualizacion).getTime() - new Date(a.fechaActualizacion).getTime();
      }
    });
  }, [articulos, filtro]);

  return (
    <InventoryContext.Provider
      value={{
        articulos,
        categorias,
        ventas,
        articulosFiltrados,
        estadisticas,
        filtro,
        setFiltro,
        limpiarFiltros,
        vista,
        setVista,
        isAdmin,
        setIsAdmin,
        isAdminAuthModalOpen,
        setIsAdminAuthModalOpen,
        loginAdmin,
        logoutAdmin,
        isModalCrearOpen,
        setIsModalCrearOpen,
        isImportModalOpen,
        setIsImportModalOpen,
        isSalesReportOpen,
        setIsSalesReportOpen,
        articuloEdicion,
        setArticuloEdicion,
        articuloDetalle,
        setArticuloDetalle,
        articuloEliminar,
        setArticuloEliminar,
        quickStockTarget,
        setQuickStockTarget,
        sellTarget,
        setSellTarget,
        isBackupModalOpen,
        setIsBackupModalOpen,
        crearArticulo,
        actualizarArticulo,
        eliminarArticulo,
        actualizarStockVariante,
        agregarCategoria,
        registrarVenta,
        eliminarVenta,
        importarArticulosExcel,
        restablecerDatosEjemplo,
        exportarJSON,
        importarJSON,
        toasts,
        mostrarToast,
        eliminarToast
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
