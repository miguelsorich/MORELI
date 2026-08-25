import { Articulo, Venta } from '../types/inventory';

export const CATEGORIAS_DEFAULT = [
  'Blusas',
  'Vestidos',
  'Camisas',
  'Pantalones',
  'Calzado',
  'Chaquetas y Abrigos',
  'Accesorios',
  'Ropa Deportiva'
];

export const COLORES_PRESET = [
  { nombre: 'Verde Jungla', hex: '#2A5A29' },
  { nombre: 'Blanco Crudo', hex: '#F0EEEF' },
  { nombre: 'Café Kraft', hex: '#9F7652' },
  { nombre: 'Heno / Yute', hex: '#B89C71' },
  { nombre: 'Verde Musgo', hex: '#648D4B' },
  { nombre: 'Gris Sombra', hex: '#535456' },
  { nombre: 'Negro', hex: '#18181b' },
  { nombre: 'Blanco', hex: '#ffffff' },
  { nombre: 'Azul Marino', hex: '#1e3a8a' },
  { nombre: 'Beige', hex: '#d4b996' },
  { nombre: 'Terracota', hex: '#b45309' },
  { nombre: 'Rosa Palo', hex: '#f472b6' }
];

// Tallas con tallas brasileras para calzado (33 a 40: 34, 36, 38...)
export const GRUPOS_TALLAS = {
  prendas: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  pantalones: ['28', '30', '32', '34', '36', '38'],
  calzado: ['33', '34', '35', '36', '37', '38', '39', '40'], // Tallas Brasileñas (BR)
  general: ['Única']
};

export const ARTICULOS_INICIALES: Articulo[] = [
  {
    id: 'prod-001',
    nombre: 'Blusa Moreli Lino Silvestre',
    descripcion: 'Blusa en lino natural premium con mangas sueltas, detalles artesanales y botones de coco.',
    categoria: 'Blusas',
    precio: 195, // Bs. 195.00
    sku: 'MOR-BLU-001',
    foto: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
    variantes: [
      { id: 'var-001-1', color: 'Blanco Crudo', colorHex: '#F0EEEF', talla: 'S', cantidad: 1, sku: 'MOR-BLU-001-CRU-S' },
      { id: 'var-001-2', color: 'Blanco Crudo', colorHex: '#F0EEEF', talla: 'M', cantidad: 1, sku: 'MOR-BLU-001-CRU-M' },
      { id: 'var-001-3', color: 'Verde Jungla', colorHex: '#2A5A29', talla: 'M', cantidad: 1, sku: 'MOR-BLU-001-JUN-M' },
      { id: 'var-001-4', color: 'Verde Musgo', colorHex: '#648D4B', talla: 'L', cantidad: 1, sku: 'MOR-BLU-001-MUS-L' }
    ],
    fechaCreacion: '2026-08-20T10:00:00.000Z',
    fechaActualizacion: '2026-08-20T10:00:00.000Z'
  },
  {
    id: 'prod-002',
    nombre: 'Vestido Midi Moreli Botánico',
    descripcion: 'Vestido fresco de mezcla botánica con escote en V, lazo ajustable y caída envolvente.',
    categoria: 'Vestidos',
    precio: 340, // Bs. 340.00
    sku: 'MOR-VES-002',
    foto: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
    variantes: [
      { id: 'var-002-1', color: 'Café Kraft', colorHex: '#9F7652', talla: 'S', cantidad: 1, sku: 'MOR-VES-002-KRA-S' },
      { id: 'var-002-2', color: 'Verde Jungla', colorHex: '#2A5A29', talla: 'M', cantidad: 1, sku: 'MOR-VES-002-JUN-M' },
      { id: 'var-002-3', color: 'Heno / Yute', colorHex: '#B89C71', talla: 'M', cantidad: 1, sku: 'MOR-VES-002-YUT-M' }
    ],
    fechaCreacion: '2026-08-21T11:30:00.000Z',
    fechaActualizacion: '2026-08-21T11:30:00.000Z'
  },
  {
    id: 'prod-003',
    nombre: 'Sandalias Cuero Brasileño Palma',
    descripcion: 'Calzado artesanal confeccionado en cuero genuino con numeración brasilera, plantilla anatómica y suela antideslizante.',
    categoria: 'Calzado',
    precio: 290, // Bs. 290.00
    sku: 'MOR-CAL-003',
    foto: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
    variantes: [
      { id: 'var-003-1', color: 'Café Kraft', colorHex: '#9F7652', talla: '34', cantidad: 1, sku: 'MOR-CAL-003-KRA-34' },
      { id: 'var-003-2', color: 'Café Kraft', colorHex: '#9F7652', talla: '36', cantidad: 1, sku: 'MOR-CAL-003-KRA-36' },
      { id: 'var-003-3', color: 'Café Kraft', colorHex: '#9F7652', talla: '38', cantidad: 1, sku: 'MOR-CAL-003-KRA-38' },
      { id: 'var-003-4', color: 'Heno / Yute', colorHex: '#B89C71', talla: '36', cantidad: 1, sku: 'MOR-CAL-003-YUT-36' }
    ],
    fechaCreacion: '2026-08-22T09:15:00.000Z',
    fechaActualizacion: '2026-08-22T09:15:00.000Z'
  },
  {
    id: 'prod-004',
    nombre: 'Pantalón Culotte Lino & Algodón',
    descripcion: 'Pantalón amplio de corte relajado con cintura elástica posterior y bolsillos franceses.',
    categoria: 'Pantalones',
    precio: 245, // Bs. 245.00
    sku: 'MOR-PAN-004',
    foto: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80',
    variantes: [
      { id: 'var-004-1', color: 'Blanco Crudo', colorHex: '#F0EEEF', talla: '30', cantidad: 1, sku: 'MOR-PAN-004-CRU-30' },
      { id: 'var-004-2', color: 'Heno / Yute', colorHex: '#B89C71', talla: '32', cantidad: 1, sku: 'MOR-PAN-004-YUT-32' },
      { id: 'var-004-3', color: 'Verde Jungla', colorHex: '#2A5A29', talla: '34', cantidad: 1, sku: 'MOR-PAN-004-JUN-34' }
    ],
    fechaCreacion: '2026-08-22T14:40:00.000Z',
    fechaActualizacion: '2026-08-22T14:40:00.000Z'
  },
  {
    id: 'prod-005',
    nombre: 'Camisa Guayabera Rústica Yute',
    descripcion: 'Camisa manga corta con cuello cubano y botones de madera natural.',
    categoria: 'Camisas',
    precio: 210, // Bs. 210.00
    sku: 'MOR-CAM-005',
    foto: '',
    variantes: [
      { id: 'var-005-1', color: 'Blanco Crudo', colorHex: '#F0EEEF', talla: 'M', cantidad: 1, sku: 'MOR-CAM-005-CRU-M' },
      { id: 'var-005-2', color: 'Heno / Yute', colorHex: '#B89C71', talla: 'L', cantidad: 1, sku: 'MOR-CAM-005-YUT-L' }
    ],
    fechaCreacion: '2026-08-23T16:20:00.000Z',
    fechaActualizacion: '2026-08-23T16:20:00.000Z'
  }
];

export const VENTAS_INICIALES: Venta[] = [
  {
    id: 'vta-001',
    fechaVenta: '2026-08-23T14:30:00.000Z',
    articuloId: 'prod-006',
    articuloNombre: 'Cinturón Yute Trenzado & Cuero',
    categoria: 'Accesorios',
    sku: 'MOR-ACC-006',
    varianteSku: 'MOR-ACC-006-YUT-U',
    color: 'Heno / Yute',
    colorHex: '#B89C71',
    talla: 'Única',
    cantidad: 1,
    precioUnitario: 120,
    importeTotal: 120
  },
  {
    id: 'vta-002',
    fechaVenta: '2026-08-24T11:15:00.000Z',
    articuloId: 'prod-003',
    articuloNombre: 'Sandalias Cuero Brasileño Palma',
    categoria: 'Calzado',
    sku: 'MOR-CAL-003',
    varianteSku: 'MOR-CAL-003-SOM-38',
    color: 'Gris Sombra',
    colorHex: '#535456',
    talla: '38',
    cantidad: 1,
    precioUnitario: 290,
    importeTotal: 290
  },
  {
    id: 'vta-003',
    fechaVenta: '2026-08-24T16:45:00.000Z',
    articuloId: 'prod-002',
    articuloNombre: 'Vestido Midi Moreli Botánico',
    categoria: 'Vestidos',
    sku: 'MOR-VES-002',
    varianteSku: 'MOR-VES-002-MUS-L',
    color: 'Verde Musgo',
    colorHex: '#648D4B',
    talla: 'L',
    cantidad: 1,
    precioUnitario: 340,
    importeTotal: 340
  }
];
