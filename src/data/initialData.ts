import { Articulo, Venta } from '../types/inventory';

export const CATEGORIAS_DEFAULT = [
  'Accesorios',
  'Calzado',
  'Vestido',
  'Blusa',
  'Camisa',
  'Conjunto',
  'Pantalón',
  'Saco',
  'Perfumes'
];

export const COLORES_PRESET = [
  { nombre: 'Fucsia', hex: '#d946ef' },
  { nombre: 'Café - beige tejido', hex: '#9F7652' },
  { nombre: 'Naranja', hex: '#ea580c' },
  { nombre: 'Verde', hex: '#16a34a' },
  { nombre: 'Colorida', hex: '#ec4899' },
  { nombre: 'Cobre', hex: '#c2410c' },
  { nombre: 'Durazno', hex: '#fb923c' },
  { nombre: 'Negro', hex: '#18181b' },
  { nombre: 'Amarillo', hex: '#eab308' },
  { nombre: 'Azul', hex: '#2563eb' },
  { nombre: 'Estampado', hex: '#8b5cf6' },
  { nombre: 'Blanco Perla', hex: '#F0EEEF' },
  { nombre: 'Celeste', hex: '#38bdf8' },
  { nombre: 'Beige', hex: '#d4b996' },
  { nombre: 'Blanco', hex: '#ffffff' },
  { nombre: 'Azul Electrico', hex: '#0284c7' },
  { nombre: 'Rojo', hex: '#dc2626' },
  { nombre: 'Azul marino', hex: '#1e3a8a' },
  { nombre: 'Verde claro', hex: '#86efac' },
  { nombre: 'Rosa', hex: '#f472b6' },
  { nombre: 'Vino', hex: '#831843' },
  { nombre: 'Café claro', hex: '#b89c71' },
  { nombre: 'Café', hex: '#78350f' },
  { nombre: 'Morado', hex: '#9333ea' },
  { nombre: 'Canela', hex: '#a16207' },
  { nombre: 'Rosado', hex: '#f472b6' },
  { nombre: 'Guindo', hex: '#881337' },
  { nombre: 'Gris', hex: '#64748b' },
  { nombre: 'Salmón', hex: '#f87171' }
];

export const GRUPOS_TALLAS = {
  prendas: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  pantalones: ['28', '30', '32', '34', '36', '38'],
  calzado: ['33', '34', '35', '36', '37', '38', '39', '40'], // Tallas Brasileñas (BR)
  general: ['Única']
};

const FECHA_BASE = '2026-09-06T08:00:00.000Z';

export const ARTICULOS_INICIALES: Articulo[] = [
  // --- ACCESORIOS ---
  {
    id: 'mor-acc-001',
    nombre: 'Cartera Fucsia',
    categoria: 'Accesorios',
    precio: 99,
    sku: 'MOR-ACC-001',
    descripcion: 'Steve Madden con relieve. Nombre y cadenita dorada. Tamaño sobre. Nueva.',
    foto: '',
    variantes: [
      { id: 'var-mor-acc-001', color: 'Fucsia', colorHex: '#d946ef', talla: 'Única', cantidad: 1, sku: 'MOR-ACC-001-FUC-U' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-acc-002',
    nombre: 'Cartera Brasileña',
    categoria: 'Accesorios',
    precio: 99,
    sku: 'MOR-ACC-002',
    descripcion: 'Bordes color café, con tejido beige. Como nueva.',
    foto: '',
    variantes: [
      { id: 'var-mor-acc-002', color: 'Café - beige tejido', colorHex: '#9F7652', talla: 'Única', cantidad: 1, sku: 'MOR-ACC-002-BEI-U' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-acc-003',
    nombre: 'Cartera Brasileña',
    categoria: 'Accesorios',
    precio: 99,
    sku: 'MOR-ACC-003',
    descripcion: 'Como nueva. Medidas 20 cm x 17 cm',
    foto: '',
    variantes: [
      { id: 'var-mor-acc-003', color: 'Café - beige tejido', colorHex: '#9F7652', talla: 'Única', cantidad: 1, sku: 'MOR-ACC-003-BEI-U' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-acc-004',
    nombre: 'Cartera Zara',
    categoria: 'Accesorios',
    precio: 99,
    sku: 'MOR-ACC-004',
    descripcion: 'Como nueva. Medidas 23 cm x 15 cm.',
    foto: '',
    variantes: [
      { id: 'var-mor-acc-004', color: 'Café - beige tejido', colorHex: '#9F7652', talla: 'Única', cantidad: 1, sku: 'MOR-ACC-004-BEI-U' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },

  // --- CALZADO ---
  {
    id: 'mor-cal-001',
    nombre: 'Sandalias Hawaiana Naranjas',
    categoria: 'Calzado',
    precio: 99,
    sku: 'MOR-CAL-001',
    descripcion: 'Con tira talón Rosado. Como nueva.',
    foto: '',
    variantes: [
      { id: 'var-mor-cal-001', color: 'Naranja', colorHex: '#ea580c', talla: '37', cantidad: 1, sku: 'MOR-CAL-001-NAR-37' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-cal-002',
    nombre: 'Sandalias Verdes con dige plateado',
    categoria: 'Calzado',
    precio: 109,
    sku: 'MOR-CAL-002',
    descripcion: 'Con dige plateado. Nueva.',
    foto: '',
    variantes: [
      { id: 'var-mor-cal-002', color: 'Verde', colorHex: '#16a34a', talla: '36', cantidad: 1, sku: 'MOR-CAL-002-VER-36' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-cal-003',
    nombre: 'Sandalias Hawaiana de Colores',
    categoria: 'Calzado',
    precio: 99,
    sku: 'MOR-CAL-003',
    descripcion: 'Como nueva.',
    foto: '',
    variantes: [
      { id: 'var-mor-cal-003', color: 'Colorida', colorHex: '#ec4899', talla: '37', cantidad: 1, sku: 'MOR-CAL-003-COL-37' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-cal-004',
    nombre: 'Sandalidas Cobre Brasileña',
    categoria: 'Calzado',
    precio: 109,
    sku: 'MOR-CAL-004',
    descripcion: 'Con piedras de colores que resaltan su belleza. Nueva',
    foto: '',
    variantes: [
      { id: 'var-mor-cal-004', color: 'Cobre', colorHex: '#c2410c', talla: '36', cantidad: 1, sku: 'MOR-CAL-004-COB-36' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },

  // --- BLUSAS ---
  {
    id: 'mor-blu-001',
    nombre: 'Blusa Carlita',
    categoria: 'Blusa',
    precio: 109,
    sku: 'MOR-BLU-001',
    descripcion: 'Nueva. Seda. Shein. Con tiros en la espalda.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-001', color: 'Blanco Perla', colorHex: '#F0EEEF', talla: 'M', cantidad: 1, sku: 'MOR-BLU-001-BLA-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-002',
    nombre: 'Blusa Carlita',
    categoria: 'Blusa',
    precio: 109,
    sku: 'MOR-BLU-002',
    descripcion: 'Nueva. Seda. Shein. Con tiros en la espalda.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-002', color: 'Blanco Perla', colorHex: '#F0EEEF', talla: 'M', cantidad: 1, sku: 'MOR-BLU-002-BLA-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-003',
    nombre: 'Blusa Naked Zebra',
    categoria: 'Blusa',
    precio: 99,
    sku: 'MOR-BLU-003',
    descripcion: 'Con volantes en las mangas. Estilo A. Como nueva.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-003', color: 'Celeste', colorHex: '#38bdf8', talla: 'M', cantidad: 1, sku: 'MOR-BLU-003-CEL-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-004',
    nombre: 'Blusa Naked Zebra',
    categoria: 'Blusa',
    precio: 149,
    sku: 'MOR-BLU-004',
    descripcion: 'Con doble volante en las mangas. Estilo A. Nueva.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-004', color: 'Beige', colorHex: '#d4b996', talla: 'S', cantidad: 1, sku: 'MOR-BLU-004-BEI-S' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-005',
    nombre: 'Blusa Brasilera',
    categoria: 'Blusa',
    precio: 79,
    sku: 'MOR-BLU-005',
    descripcion: 'Como nueva.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-005', color: 'Blanco Perla', colorHex: '#F0EEEF', talla: 'M', cantidad: 1, sku: 'MOR-BLU-005-BLA-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-006',
    nombre: 'Blusa Doce Flor',
    categoria: 'Blusa',
    precio: 69,
    sku: 'MOR-BLU-006',
    descripcion: 'Como nueva.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-006', color: 'Verde', colorHex: '#16a34a', talla: 'S', cantidad: 1, sku: 'MOR-BLU-006-VER-S' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-007',
    nombre: 'Blusa Brasilera',
    categoria: 'Blusa',
    precio: 99,
    sku: 'MOR-BLU-007',
    descripcion: 'Nueva. Elegante. Con mangas y elástico en la cintura.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-007', color: 'Café', colorHex: '#78350f', talla: 'M', cantidad: 1, sku: 'MOR-BLU-007-CAF-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-008',
    nombre: 'Blusa',
    categoria: 'Blusa',
    precio: 39,
    sku: 'MOR-BLU-008',
    descripcion: 'Top. Como nuevo. Con forro en la parte frontal.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-008', color: 'Verde', colorHex: '#16a34a', talla: 'L', cantidad: 1, sku: 'MOR-BLU-008-VER-L' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-009',
    nombre: 'Blusa',
    categoria: 'Blusa',
    precio: 39,
    sku: 'MOR-BLU-009',
    descripcion: 'Top. Como nuevo. Con forro en la parte frontal.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-009', color: 'Amarillo', colorHex: '#eab308', talla: 'L', cantidad: 1, sku: 'MOR-BLU-009-AMA-L' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-010',
    nombre: 'Blusa',
    categoria: 'Blusa',
    precio: 99,
    sku: 'MOR-BLU-010',
    descripcion: 'Nueva. Manga larga.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-010', color: 'Negro', colorHex: '#18181b', talla: 'L', cantidad: 1, sku: 'MOR-BLU-010-NEG-L' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-011',
    nombre: 'Blusa',
    categoria: 'Blusa',
    precio: 59,
    sku: 'MOR-BLU-011',
    descripcion: 'Nuevo. Body. Espalda descubierta.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-011', color: 'Negro', colorHex: '#18181b', talla: 'L', cantidad: 1, sku: 'MOR-BLU-011-NEG-L' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-012',
    nombre: 'Blusa',
    categoria: 'Blusa',
    precio: 59,
    sku: 'MOR-BLU-012',
    descripcion: 'Nuevo. Body. Espalda descubierta.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-012', color: 'Blanco Perla', colorHex: '#F0EEEF', talla: 'L', cantidad: 1, sku: 'MOR-BLU-012-BLA-L' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-013',
    nombre: 'Blusa Bershka',
    categoria: 'Blusa',
    precio: 49,
    sku: 'MOR-BLU-013',
    descripcion: 'Como nuevo. Body.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-013', color: 'Negro', colorHex: '#18181b', talla: 'S', cantidad: 1, sku: 'MOR-BLU-013-NEG-S' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-014',
    nombre: 'Blusa Zara',
    categoria: 'Blusa',
    precio: 49,
    sku: 'MOR-BLU-014',
    descripcion: 'Como nueva.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-014', color: 'Negro', colorHex: '#18181b', talla: 'M', cantidad: 1, sku: 'MOR-BLU-014-NEG-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-015',
    nombre: 'Blusa Zara',
    categoria: 'Blusa',
    precio: 49,
    sku: 'MOR-BLU-015',
    descripcion: 'Como nueva.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-015', color: 'Blanco Perla', colorHex: '#F0EEEF', talla: 'M', cantidad: 1, sku: 'MOR-BLU-015-BLA-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-016',
    nombre: 'Blusa Brasilera',
    categoria: 'Blusa',
    precio: 79,
    sku: 'MOR-BLU-016',
    descripcion: 'Como nueva. Con mangas y elástico en la cintura.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-016', color: 'Azul Electrico', colorHex: '#0284c7', talla: 'S', cantidad: 1, sku: 'MOR-BLU-016-AZU-S' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-017',
    nombre: 'Blusa Shein',
    categoria: 'Blusa',
    precio: 39,
    sku: 'MOR-BLU-017',
    descripcion: 'Como nueva. Broderí.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-017', color: 'Blanco', colorHex: '#ffffff', talla: 'S', cantidad: 1, sku: 'MOR-BLU-017-BLA-S' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-018',
    nombre: 'Blusa Elegante Hayden',
    categoria: 'Blusa',
    precio: 129,
    sku: 'MOR-BLU-018',
    descripcion: 'Nueva. Con mangas estido mariposa.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-018', color: 'Rojo', colorHex: '#dc2626', talla: 'S', cantidad: 1, sku: 'MOR-BLU-018-ROJ-S' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-019',
    nombre: 'Blusa Vickys Casual',
    categoria: 'Blusa',
    precio: 79,
    sku: 'MOR-BLU-019',
    descripcion: 'Como nueva.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-019', color: 'Negro', colorHex: '#18181b', talla: 'S', cantidad: 1, sku: 'MOR-BLU-019-NEG-S' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-020',
    nombre: 'Blusa Croptop',
    categoria: 'Blusa',
    precio: 39,
    sku: 'MOR-BLU-020',
    descripcion: 'Como nueva.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-020', color: 'Blanco Perla', colorHex: '#F0EEEF', talla: 'S', cantidad: 1, sku: 'MOR-BLU-020-BLA-S' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-021',
    nombre: 'Blusa Bandolera',
    categoria: 'Blusa',
    precio: 79,
    sku: 'MOR-BLU-021',
    descripcion: 'Como nueva. Blusa Nube. Con cierre en la espalda.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-021', color: 'Blanco', colorHex: '#ffffff', talla: 'M', cantidad: 1, sku: 'MOR-BLU-021-BLA-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-022',
    nombre: 'Blusa Milalai',
    categoria: 'Blusa',
    precio: 79,
    sku: 'MOR-BLU-022',
    descripcion: 'Como nueva. Con broderí en las mangas.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-022', color: 'Azul marino', colorHex: '#1e3a8a', talla: 'M', cantidad: 1, sku: 'MOR-BLU-022-AZU-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-023',
    nombre: 'Blusa Valentina',
    categoria: 'Blusa',
    precio: 109,
    sku: 'MOR-BLU-023',
    descripcion: 'Brasilera. Elegante. Broderí en la parte frontal. Mangas con elástico.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-023', color: 'Verde claro', colorHex: '#86efac', talla: 'M', cantidad: 1, sku: 'MOR-BLU-023-VER-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-024',
    nombre: 'Blusa Benetton',
    categoria: 'Blusa',
    precio: 49,
    sku: 'MOR-BLU-024',
    descripcion: 'Semi nueva. Con botones en la espalda y volados.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-024', color: 'Rosa', colorHex: '#f472b6', talla: 'XS', cantidad: 1, sku: 'MOR-BLU-024-ROS-XS' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-025',
    nombre: 'Blusa Milalai',
    categoria: 'Blusa',
    precio: 99,
    sku: 'MOR-BLU-025',
    descripcion: 'Como nueva.Elegante. Con bolados y broderí.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-025', color: 'Vino', colorHex: '#831843', talla: 'S', cantidad: 1, sku: 'MOR-BLU-025-VIN-S' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-026',
    nombre: 'Blusa Mixxo',
    categoria: 'Blusa',
    precio: 49,
    sku: 'MOR-BLU-026',
    descripcion: 'Semi nueva.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-026', color: 'Celeste', colorHex: '#38bdf8', talla: 'S', cantidad: 1, sku: 'MOR-BLU-026-CEL-S' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-027',
    nombre: 'Blusa Naked Zebra',
    categoria: 'Blusa',
    precio: 109,
    sku: 'MOR-BLU-027',
    descripcion: 'Nueva. Manga estilo mariposa.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-027', color: 'Café claro', colorHex: '#b89c71', talla: 'S', cantidad: 1, sku: 'MOR-BLU-027-CAF-S' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-028',
    nombre: 'Blusa Milalai',
    categoria: 'Blusa',
    precio: 109,
    sku: 'MOR-BLU-028',
    descripcion: 'Como nueva.Elegante. Con bolados, relieve y broderí.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-028', color: 'Blanco', colorHex: '#ffffff', talla: 'S', cantidad: 1, sku: 'MOR-BLU-028-BLA-S' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-029',
    nombre: 'Blusa Brasilera',
    categoria: 'Blusa',
    precio: 49,
    sku: 'MOR-BLU-029',
    descripcion: 'Como nueva. Azul con rayas blancas. Con volados. Sin mangas.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-029', color: 'Azul', colorHex: '#2563eb', talla: 'S', cantidad: 1, sku: 'MOR-BLU-029-AZU-S' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-030',
    nombre: 'Blusa Dona Ritz',
    categoria: 'Blusa',
    precio: 109,
    sku: 'MOR-BLU-030',
    descripcion: 'Como nueva. Con volados y brokerí.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-030', color: 'Blanca', colorHex: '#ffffff', talla: 'M', cantidad: 1, sku: 'MOR-BLU-030-BLA-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-031',
    nombre: 'Blusa Kdaba',
    categoria: 'Blusa',
    precio: 49,
    sku: 'MOR-BLU-031',
    descripcion: 'Como nueva. Con manga princesa.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-031', color: 'Café Claro', colorHex: '#b89c71', talla: 'M', cantidad: 1, sku: 'MOR-BLU-031-CAF-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-blu-032',
    nombre: 'Blusa Shein',
    categoria: 'Blusa',
    precio: 59,
    sku: 'MOR-BLU-032',
    descripcion: 'Nueva. Manga princesa.',
    foto: '',
    variantes: [
      { id: 'var-mor-blu-032', color: 'Amarillo', colorHex: '#eab308', talla: 'L', cantidad: 1, sku: 'MOR-BLU-032-AMA-L' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },

  // --- CAMISAS ---
  {
    id: 'mor-cam-001',
    nombre: 'Camisa Wrinkle',
    categoria: 'Camisa',
    precio: 39,
    sku: 'MOR-CAM-001',
    descripcion: 'Como nueva. Blanco con rayas blancas.',
    foto: '',
    variantes: [
      { id: 'var-mor-cam-001', color: 'Negro', colorHex: '#18181b', talla: 'S', cantidad: 1, sku: 'MOR-CAM-001-NEG-S' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-cam-002',
    nombre: 'Camisa LAP',
    categoria: 'Camisa',
    precio: 39,
    sku: 'MOR-CAM-002',
    descripcion: 'Semi nueva. Azul con rayas blancas. Detalle rosado con blanco en las mangas y cuello.',
    foto: '',
    variantes: [
      { id: 'var-mor-cam-002', color: 'Azul', colorHex: '#2563eb', talla: 'S', cantidad: 1, sku: 'MOR-CAM-002-AZU-S' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-cam-003',
    nombre: 'Camisa Sfera',
    categoria: 'Camisa',
    precio: 39,
    sku: 'MOR-CAM-003',
    descripcion: 'Semi nueva. Azul con rayas blancas.',
    foto: '',
    variantes: [
      { id: 'var-mor-cam-003', color: 'Azul', colorHex: '#2563eb', talla: 'S', cantidad: 1, sku: 'MOR-CAM-003-AZU-S' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-cam-004',
    nombre: 'Camisa SPAO',
    categoria: 'Camisa',
    precio: 39,
    sku: 'MOR-CAM-004',
    descripcion: 'Semi nueva. Blanco con rayas azules.',
    foto: '',
    variantes: [
      { id: 'var-mor-cam-004', color: 'Blanco', colorHex: '#ffffff', talla: 'S', cantidad: 1, sku: 'MOR-CAM-004-BLA-S' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-cam-005',
    nombre: 'Camisa Signature',
    categoria: 'Camisa',
    precio: 39,
    sku: 'MOR-CAM-005',
    descripcion: 'Semi nueva. Amarillo con rayas blancas.',
    foto: '',
    variantes: [
      { id: 'var-mor-cam-005', color: 'Amarilla', colorHex: '#eab308', talla: 'M', cantidad: 1, sku: 'MOR-CAM-005-AMA-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-cam-006',
    nombre: 'Camisa LAUREN',
    categoria: 'Camisa',
    precio: 39,
    sku: 'MOR-CAM-006',
    descripcion: 'Como nueva.Morado con rayas blancas.',
    foto: '',
    variantes: [
      { id: 'var-mor-cam-006', color: 'Morado', colorHex: '#9333ea', talla: 'M', cantidad: 1, sku: 'MOR-CAM-006-MOR-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-cam-007',
    nombre: 'Camisa Stradivarius',
    categoria: 'Camisa',
    precio: 39,
    sku: 'MOR-CAM-007',
    descripcion: 'Semi nueva. Manga princesa.',
    foto: '',
    variantes: [
      { id: 'var-mor-cam-007', color: 'Blanco', colorHex: '#ffffff', talla: 'XS', cantidad: 1, sku: 'MOR-CAM-007-BLA-XS' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },

  // --- CONJUNTOS ---
  {
    id: 'mor-con-001',
    nombre: 'Conjunto Panda Moda',
    categoria: 'Conjunto',
    precio: 199,
    sku: 'MOR-CON-001',
    descripcion: 'Nuevo. Elegante. Pantalón y blusa.',
    foto: '',
    variantes: [
      { id: 'var-mor-con-001', color: 'Naranja', colorHex: '#ea580c', talla: 'M', cantidad: 1, sku: 'MOR-CON-001-NAR-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-con-002',
    nombre: 'Conjunto Panda Moda',
    categoria: 'Conjunto',
    precio: 199,
    sku: 'MOR-CON-002',
    descripcion: 'Como nuevo. Elegante. Pantalón y blusa.',
    foto: '',
    variantes: [
      { id: 'var-mor-con-002', color: 'Naranja', colorHex: '#ea580c', talla: 'S', cantidad: 1, sku: 'MOR-CON-002-NAR-S' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-con-003',
    nombre: 'Camisa Isaias Moda',
    categoria: 'Conjunto',
    precio: 49,
    sku: 'MOR-CON-003',
    descripcion: 'Semi nueva. Short y blusa. Rojo con rayas blancas.',
    foto: '',
    variantes: [
      { id: 'var-mor-con-003', color: 'Rojo', colorHex: '#dc2626', talla: 'L', cantidad: 1, sku: 'MOR-CON-003-ROJ-L' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-con-004',
    nombre: 'Camisa Shein',
    categoria: 'Conjunto',
    precio: 179,
    sku: 'MOR-CON-004',
    descripcion: 'Nuevo. Elegante.  Short y blusa.',
    foto: '',
    variantes: [
      { id: 'var-mor-con-004', color: 'Fucsia', colorHex: '#d946ef', talla: 'M', cantidad: 1, sku: 'MOR-CON-004-FUC-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },

  // --- VESTIDOS ---
  {
    id: 'mor-ves-001',
    nombre: 'Vestido Midi. Estilo A',
    categoria: 'Vestido',
    precio: 179,
    sku: 'MOR-VES-001',
    descripcion: 'Con volantes en las mangas. Estilo A. Como nuevo.',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-001', color: 'Durazno', colorHex: '#fb923c', talla: 'M', cantidad: 1, sku: 'MOR-VES-001-DUR-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-ves-002',
    nombre: 'Vestido Midi. Estilo A',
    categoria: 'Vestido',
    precio: 149,
    sku: 'MOR-VES-002',
    descripcion: 'Con volantes en las mangas. Estilo A. Como nuevo.',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-002', color: 'Negro', colorHex: '#18181b', talla: 'M', cantidad: 1, sku: 'MOR-VES-002-NEG-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-ves-003',
    nombre: 'Vestido Midi. Estilo A',
    categoria: 'Vestido',
    precio: 179,
    sku: 'MOR-VES-003',
    descripcion: 'Naked Zebra con volantes en las mangas. Como Nuevo.',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-003', color: 'Amarillo', colorHex: '#eab308', talla: 'M', cantidad: 1, sku: 'MOR-VES-003-AMA-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-ves-004',
    nombre: 'Vestido Midi. Estilo A',
    categoria: 'Vestido',
    precio: 149,
    sku: 'MOR-VES-004',
    descripcion: 'Naked Zebra con volantes en las mangas. Como nuevo.',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-004', color: 'Azul', colorHex: '#2563eb', talla: 'M', cantidad: 1, sku: 'MOR-VES-004-AZU-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-ves-005',
    nombre: 'Vestido Zara. Estilo Boho',
    categoria: 'Vestido',
    precio: 99,
    sku: 'MOR-VES-005',
    descripcion: 'Midi. Estampado azul con blanco. Como nuevo.',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-005', color: 'Estampado', colorHex: '#8b5cf6', talla: 'M', cantidad: 1, sku: 'MOR-VES-005-EST-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-ves-006',
    nombre: 'Vestido Brasilero',
    categoria: 'Vestido',
    precio: 99,
    sku: 'MOR-VES-006',
    descripcion: 'Midi. Con mangas elegantes. Como nuevo.',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-006', color: 'Negro', colorHex: '#18181b', talla: 'M', cantidad: 1, sku: 'MOR-VES-006-NEG-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-ves-007',
    nombre: 'Vestido Shein',
    categoria: 'Vestido',
    precio: 109,
    sku: 'MOR-VES-007',
    descripcion: 'Nuevo. Midi. Con volados blancos en la parte inferior.',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-007', color: 'Negro', colorHex: '#18181b', talla: 'M', cantidad: 1, sku: 'MOR-VES-007-NEG-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-ves-008',
    nombre: 'Vestido Brasilero',
    categoria: 'Vestido',
    precio: 49,
    sku: 'MOR-VES-008',
    descripcion: 'Semi nuevo. Midi. Con mangas largas con apertura.',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-008', color: 'Blanco', colorHex: '#ffffff', talla: 'M', cantidad: 1, sku: 'MOR-VES-008-BLA-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-ves-009',
    nombre: 'Vestido',
    categoria: 'Vestido',
    precio: 39,
    sku: 'MOR-VES-009',
    descripcion: 'Semi nuevo. Corto. Estilo A.',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-009', color: 'Rojo', colorHex: '#dc2626', talla: 'S', cantidad: 1, sku: 'MOR-VES-009-ROJ-S' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-ves-010',
    nombre: 'Vestido Shein',
    categoria: 'Vestido',
    precio: 119,
    sku: 'MOR-VES-010',
    descripcion: 'Nuevo. Largo. Estilo A.',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-010', color: 'Celeste', colorHex: '#38bdf8', talla: 'L', cantidad: 1, sku: 'MOR-VES-010-CEL-L' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-ves-011',
    nombre: 'Vestido Modern Abayati',
    categoria: 'Vestido',
    precio: 99,
    sku: 'MOR-VES-011',
    descripcion: 'Nuevo. Elegante. Largo. Textura de lunares y cinturón.',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-011', color: 'Canela', colorHex: '#a16207', talla: 'S', cantidad: 1, sku: 'MOR-VES-011-CAN-S' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-ves-012',
    nombre: 'Vestido Shein',
    categoria: 'Vestido',
    precio: 299,
    sku: 'MOR-VES-012',
    descripcion: 'Nuevo. Plizado. Con espaldo descubierta.',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-012', color: 'Celeste', colorHex: '#38bdf8', talla: 'M', cantidad: 1, sku: 'MOR-VES-012-CEL-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-ves-013',
    nombre: 'Vestido Indú',
    categoria: 'Vestido',
    precio: 69,
    sku: 'MOR-VES-013',
    descripcion: 'Nuevo. Largo. Estilo A. Espalda descubierta.',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-013', color: 'Estampado', colorHex: '#8b5cf6', talla: 'M', cantidad: 1, sku: 'MOR-VES-013-EST-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-ves-014',
    nombre: 'Vestido Belma',
    categoria: 'Vestido',
    precio: 99,
    sku: 'MOR-VES-014',
    descripcion: 'Como nuevo. Largo. Estilo Indú.',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-014', color: 'Estampado', colorHex: '#8b5cf6', talla: 'L', cantidad: 1, sku: 'MOR-VES-014-EST-L' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-ves-015',
    nombre: 'Vestido Fashion Nova',
    categoria: 'Vestido',
    precio: 99,
    sku: 'MOR-VES-015',
    descripcion: 'Como nuevo. Largo. Elegante azul marino con cinturón a juego.',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-015', color: 'Estampado', colorHex: '#8b5cf6', talla: 'L', cantidad: 1, sku: 'MOR-VES-015-EST-L' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-ves-016',
    nombre: 'Vestido',
    categoria: 'Vestido',
    precio: 99,
    sku: 'MOR-VES-016',
    descripcion: 'Como nuevo. Largo. Elegante. Blanco, rosado, celeste, azul.',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-016', color: 'Estampado', colorHex: '#8b5cf6', talla: 'L', cantidad: 1, sku: 'MOR-VES-016-EST-L' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-ves-017',
    nombre: 'Vestido Shein',
    categoria: 'Vestido',
    precio: 109,
    sku: 'MOR-VES-017',
    descripcion: 'Nuevo. Largo. Estilo A. Blanco con flores moradas. Mangas largas.',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-017', color: 'Morado', colorHex: '#9333ea', talla: 'L', cantidad: 1, sku: 'MOR-VES-017-MOR-L' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-ves-018',
    nombre: 'Vestido Shein',
    categoria: 'Vestido',
    precio: 109,
    sku: 'MOR-VES-018',
    descripcion: 'Nuevo. Largo. Estilo A. Rosado con flores blancas',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-018', color: 'Rosado', colorHex: '#f472b6', talla: 'L', cantidad: 1, sku: 'MOR-VES-018-ROS-L' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-ves-019',
    nombre: 'Vestido Maritsa',
    categoria: 'Vestido',
    precio: 99,
    sku: 'MOR-VES-019',
    descripcion: 'Semi nuevo. Largo. Estilo A.',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-019', color: 'Naranja', colorHex: '#ea580c', talla: 'M', cantidad: 1, sku: 'MOR-VES-019-NAR-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-ves-020',
    nombre: 'Vestido de Fiesta',
    categoria: 'Vestido',
    precio: 99,
    sku: 'MOR-VES-020',
    descripcion: 'Semi nuevo. Largo. Elegante.',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-020', color: 'Guindo', colorHex: '#881337', talla: 'M', cantidad: 1, sku: 'MOR-VES-020-GUI-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-ves-021',
    nombre: 'Vestido Only',
    categoria: 'Vestido',
    precio: 79,
    sku: 'MOR-VES-021',
    descripcion: 'Semi nuevo. Largo. Estilo A. Con volados en las mangas. Forro.',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-021', color: 'Blanco', colorHex: '#ffffff', talla: 'S', cantidad: 1, sku: 'MOR-VES-021-BLA-S' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-ves-022',
    nombre: 'Vestido Elegante Shein',
    categoria: 'Vestido',
    precio: 139,
    sku: 'MOR-VES-022',
    descripcion: 'Nuevo. Largo. Estilo A. Ideal para fiestas. Con cinturón a juego.',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-022', color: 'Gris', colorHex: '#64748b', talla: 'L', cantidad: 1, sku: 'MOR-VES-022-GRI-L' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-ves-023',
    nombre: 'Vestido Elegante Bicici y Coti',
    categoria: 'Vestido',
    precio: 199,
    sku: 'MOR-VES-023',
    descripcion: 'Nuevo. Con piedreria. Largo. Estilo A. Ideal para fiestas.',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-023', color: 'Salmón', colorHex: '#f87171', talla: 'S', cantidad: 1, sku: 'MOR-VES-023-SAL-S' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-ves-024',
    nombre: 'Vestido Brasilero',
    categoria: 'Vestido',
    precio: 99,
    sku: 'MOR-VES-024',
    descripcion: 'Como nuevo. Largo para invierno. Cuello redondo.',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-024', color: 'Negro', colorHex: '#18181b', talla: 'M', cantidad: 1, sku: 'MOR-VES-024-NEG-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-ves-025',
    nombre: 'Vestido Brasilero',
    categoria: 'Vestido',
    precio: 99,
    sku: 'MOR-VES-025',
    descripcion: 'Como nuevo. Largo para invierno. Cuello a los hombros.',
    foto: '',
    variantes: [
      { id: 'var-mor-ves-025', color: 'Negro', colorHex: '#18181b', talla: 'M', cantidad: 1, sku: 'MOR-VES-025-NEG-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },

  // --- PANTALONES ---
  {
    id: 'mor-pan-001',
    nombre: 'Pantalón Vicky Casual',
    categoria: 'Pantalón',
    precio: 119,
    sku: 'MOR-PAN-001',
    descripcion: 'Como nuevo. Cintura de avispa.',
    foto: '',
    variantes: [
      { id: 'var-mor-pan-001', color: 'Negro', colorHex: '#18181b', talla: 'M', cantidad: 1, sku: 'MOR-PAN-001-NEG-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-pan-002',
    nombre: 'Pantalón Vicky Casual',
    categoria: 'Pantalón',
    precio: 119,
    sku: 'MOR-PAN-002',
    descripcion: 'Como nuevo. Cintura de avispa.',
    foto: '',
    variantes: [
      { id: 'var-mor-pan-002', color: 'Beige', colorHex: '#d4b996', talla: 'M', cantidad: 1, sku: 'MOR-PAN-002-BEI-M' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },

  // --- SACOS ---
  {
    id: 'mor-sac-001',
    nombre: 'Saco Bershka',
    categoria: 'Saco',
    precio: 99,
    sku: 'MOR-SAC-001',
    descripcion: 'Como nuevo.',
    foto: '',
    variantes: [
      { id: 'var-mor-sac-001', color: 'Rojo', colorHex: '#dc2626', talla: 'S', cantidad: 1, sku: 'MOR-SAC-001-ROJ-S' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  },
  {
    id: 'mor-sac-002',
    nombre: 'Saco Denim',
    categoria: 'Saco',
    precio: 89,
    sku: 'MOR-SAC-002',
    descripcion: 'Como nuevo.',
    foto: '',
    variantes: [
      { id: 'var-mor-sac-002', color: 'Rojo', colorHex: '#dc2626', talla: 'S', cantidad: 1, sku: 'MOR-SAC-002-ROJ-S' }
    ],
    fechaCreacion: FECHA_BASE,
    fechaActualizacion: FECHA_BASE
  }
];

export const VENTAS_INICIALES: Venta[] = [];
