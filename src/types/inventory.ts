export interface Variante {
  id: string;
  color: string;
  colorHex?: string;
  talla: string;
  cantidad: number;
  sku?: string;
}

export interface Articulo {
  id: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  precio: number; // En Bolivianos (Bs.)
  foto?: string; // Base64 data URL or external URL (opcional)
  sku?: string;
  variantes: Variante[];
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface Venta {
  id: string;
  fechaVenta: string; // ISO string
  articuloId: string;
  articuloNombre: string;
  categoria: string;
  sku: string;
  varianteSku?: string;
  color: string;
  colorHex?: string;
  talla: string;
  cantidad: number; // Piezas vendidas
  precioUnitario: number; // Bs.
  importeTotal: number; // Bs.
  importeAcumulado?: number; // Bs. Calculado en reporte
}

export type OrdenInventario = 
  | 'nombre_asc' 
  | 'nombre_desc' 
  | 'precio_asc' 
  | 'precio_desc' 
  | 'stock_asc' 
  | 'stock_desc' 
  | 'recientes';

export interface FiltroInventario {
  busqueda: string;
  categoria: string;
  color: string;
  talla: string;
  orden: OrdenInventario;
}

export interface EstadisticasInventario {
  totalProductos: number;
  totalUnidades: number;
  totalCategorias: number;
  valorTotalEstimado: number; // En Bolivianos (Bs.)
  totalPiezasVendidas: number;
  totalIngresosVentas: number; // En Bolivianos (Bs.)
  distribucionCategorias: { categoria: string; cantidad: number; unidades: number; valor: number }[];
}

export interface ToastMessage {
  id: string;
  tipo: 'success' | 'error' | 'warning' | 'info';
  titulo: string;
  mensaje: string;
}

export interface PlantillaFilaExcel {
  Nombre: string;
  Categoria: string;
  Precio_Bs: number;
  Color: string;
  Talla: string;
  Cantidad: number;
  Descripcion?: string;
  SKU?: string;
  Foto_URL?: string;
}
