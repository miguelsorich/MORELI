import * as XLSX from 'xlsx';
import { Articulo, Variante, Venta } from '../types/inventory';
import { COLORES_PRESET } from '../data/initialData';

/**
 * Formateador oficial de moneda en BOLIVIANOS (Bs.)
 */
export const formatBolivianos = (amount: number | undefined | null): string => {
  const num = Number(amount) || 0;
  return `Bs. ${num.toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

/**
 * Generador automático de SKU de producto Moreli
 * Formato: MOR-[CAT_3]-[SECUENCIA_3_DIGITOS]
 * Ejemplos: MOR-BLU-001, MOR-CAL-002, MOR-VES-003
 */
export const generateAutoProductSku = (
  categoria: string, 
  existingArticulos: Articulo[] = []
): string => {
  const catClean = (categoria || 'ART')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, '');

  const prefixCat = catClean.slice(0, 3).padEnd(3, 'X');
  const basePrefix = `MOR-${prefixCat}`;

  // Find highest current sequence with this prefix or overall
  let maxSeq = 0;
  const regex = new RegExp(`^MOR-${prefixCat}-(\\d+)$`, 'i');
  const genericRegex = /^MOR-[A-Z]{3}-(\\d+)$/i;

  existingArticulos.forEach(art => {
    if (!art.sku) return;
    const match = art.sku.match(regex);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (num > maxSeq) maxSeq = num;
    } else {
      const genMatch = art.sku.match(genericRegex);
      if (genMatch && genMatch[1]) {
        const num = parseInt(genMatch[1], 10);
        if (num > maxSeq) maxSeq = num;
      }
    }
  });

  const nextSeq = maxSeq + 1;
  return `${basePrefix}-${String(nextSeq).padStart(3, '0')}`;
};

/**
 * Generador automático de SKU para variantes individuales
 * Formato: [SKU_PRODUCTO]-[COLOR_3]-[TALLA]
 * Ejemplo: MOR-BLU-001-CRU-M, MOR-CAL-002-KRA-36
 */
export const generateAutoVariantSku = (
  productSku: string, 
  color: string, 
  talla: string
): string => {
  const base = (productSku || 'MOR-ART-001').trim().toUpperCase();
  const colorClean = (color || 'COL')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 3)
    .padEnd(3, 'X');

  const tallaClean = (talla || 'U')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');

  return `${base}-${colorClean}-${tallaClean}`;
};

/**
 * Encuentra el código Hexadecimal aproximado de un color
 */
export const getHexForColor = (colorName: string): string => {
  const found = COLORES_PRESET.find(
    c => c.nombre.toLowerCase() === colorName.trim().toLowerCase()
  );
  if (found) return found.hex;

  // Fallback defaults
  const normalized = colorName.toLowerCase().trim();
  if (normalized.includes('jungla') || normalized.includes('verde')) return '#2A5A29';
  if (normalized.includes('crudo') || normalized.includes('blanco')) return '#F0EEEF';
  if (normalized.includes('kraft') || normalized.includes('café') || normalized.includes('cafe')) return '#9F7652';
  if (normalized.includes('yute') || normalized.includes('heno') || normalized.includes('beige')) return '#B89C71';
  if (normalized.includes('musgo')) return '#648D4B';
  if (normalized.includes('sombra') || normalized.includes('gris')) return '#535456';
  if (normalized.includes('negro')) return '#18181b';
  if (normalized.includes('azul')) return '#1e3a8a';
  if (normalized.includes('rojo') || normalized.includes('terracota')) return '#b45309';
  if (normalized.includes('rosa')) return '#f472b6';

  return '#9F7652'; // Default Kraft tone
};

/**
 * Genera y descarga la Plantilla Oficial de Carga de Prendas en formato EXCEL (.xlsx)
 */
export const downloadInventoryExcelTemplate = (): void => {
  const rows = [
    {
      'Nombre': 'Blusa Moreli Lino Silvestre',
      'Categoria': 'Blusas',
      'Precio_Bs': 195.00,
      'Color': 'Blanco Crudo',
      'Talla': 'S',
      'Cantidad': 1,
      'Descripcion': 'Blusa en lino natural con botones de coco',
      'SKU': 'MOR-BLU-001',
      'Foto_URL': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c'
    },
    {
      'Nombre': 'Blusa Moreli Lino Silvestre',
      'Categoria': 'Blusas',
      'Precio_Bs': 195.00,
      'Color': 'Verde Jungla',
      'Talla': 'M',
      'Cantidad': 1,
      'Descripcion': 'Blusa en lino natural con botones de coco',
      'SKU': 'MOR-BLU-001',
      'Foto_URL': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c'
    },
    {
      'Nombre': 'Vestido Midi Moreli Botánico',
      'Categoria': 'Vestidos',
      'Precio_Bs': 340.00,
      'Color': 'Café Kraft',
      'Talla': 'M',
      'Cantidad': 1,
      'Descripcion': 'Vestido fresco con lazo ajustable',
      'SKU': 'MOR-VES-002',
      'Foto_URL': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1'
    },
    {
      'Nombre': 'Sandalias Cuero Brasileño',
      'Categoria': 'Calzado',
      'Precio_Bs': 290.00,
      'Color': 'Café Kraft',
      'Talla': '34',
      'Cantidad': 1,
      'Descripcion': 'Calzado en cuero genuino con talla brasilera',
      'SKU': 'MOR-CAL-003',
      'Foto_URL': 'https://images.unsplash.com/photo-1549298916-b41d501d3772'
    },
    {
      'Nombre': 'Sandalias Cuero Brasileño',
      'Categoria': 'Calzado',
      'Precio_Bs': 290.00,
      'Color': 'Café Kraft',
      'Talla': '36',
      'Cantidad': 1,
      'Descripcion': 'Calzado en cuero genuino con talla brasilera',
      'SKU': 'MOR-CAL-003',
      'Foto_URL': 'https://images.unsplash.com/photo-1549298916-b41d501d3772'
    },
    {
      'Nombre': 'Sandalias Cuero Brasileño',
      'Categoria': 'Calzado',
      'Precio_Bs': 290.00,
      'Color': 'Heno / Yute',
      'Talla': '38',
      'Cantidad': 1,
      'Descripcion': 'Calzado en cuero genuino con talla brasilera',
      'SKU': 'MOR-CAL-003',
      'Foto_URL': 'https://images.unsplash.com/photo-1549298916-b41d501d3772'
    },
    {
      'Nombre': 'Cinturón Yute Trenzado',
      'Categoria': 'Accesorios',
      'Precio_Bs': 120.00,
      'Color': 'Heno / Yute',
      'Talla': 'Única',
      'Cantidad': 1,
      'Descripcion': 'Accesorio rústico con hebilla bronce',
      'SKU': 'MOR-ACC-006',
      'Foto_URL': ''
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Plantilla_Moreli');

  // Set column widths
  worksheet['!cols'] = [
    { wch: 30 }, // Nombre
    { wch: 18 }, // Categoria
    { wch: 14 }, // Precio_Bs
    { wch: 18 }, // Color
    { wch: 10 }, // Talla
    { wch: 10 }, // Cantidad
    { wch: 35 }, // Descripcion
    { wch: 16 }, // SKU
    { wch: 35 }  // Foto_URL
  ];

  XLSX.writeFile(workbook, 'plantilla_inventario_moreli.xlsx');
};

/**
 * Exporta el Reporte de Ventas e Ingresos Completo en formato EXCEL (.xlsx)
 * Con: Fecha de Venta, Producto, Categoría, SKU, Color, Talla, Piezas Vendidas, Precio Unitario (Bs.), Importe Total (Bs.) e Importe Acumulado (Bs.)
 */
export const exportSalesReportToExcel = (ventas: Venta[]): void => {
  // Sort oldest to newest to compute running cumulative total
  const sortedVentas = [...ventas].sort(
    (a, b) => new Date(a.fechaVenta).getTime() - new Date(b.fechaVenta).getTime()
  );

  let runningTotal = 0;
  const rows = sortedVentas.map((v, index) => {
    const totalItem = Number(v.importeTotal) || (v.cantidad * v.precioUnitario);
    runningTotal += totalItem;

    const fechaFormateada = new Date(v.fechaVenta).toLocaleString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return {
      'Nro': index + 1,
      'Fecha de Venta': fechaFormateada,
      'Prenda / Producto': v.articuloNombre,
      'Categoría': v.categoria,
      'Código SKU': v.varianteSku || v.sku || 'N/A',
      'Color': v.color,
      'Talla Brasilera / Talla': v.talla,
      'Piezas Vendidas': v.cantidad,
      'Precio Unitario (Bs.)': Number(v.precioUnitario.toFixed(2)),
      'Importe Total (Bs.)': Number(totalItem.toFixed(2)),
      'Importe Acumulado (Bs.)': Number(runningTotal.toFixed(2))
    };
  });

  // Calculate summary footer
  const totalPiezas = sortedVentas.reduce((sum, v) => sum + v.cantidad, 0);

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Append summary row
  XLSX.utils.sheet_add_json(worksheet, [
    {
      'Nro': 'TOTAL GENERAL',
      'Fecha de Venta': '',
      'Prenda / Producto': '',
      'Categoría': '',
      'Código SKU': '',
      'Color': '',
      'Talla Brasilera / Talla': 'TOTAL PIEZAS:',
      'Piezas Vendidas': totalPiezas,
      'Precio Unitario (Bs.)': '',
      'Importe Total (Bs.)': Number(runningTotal.toFixed(2)),
      'Importe Acumulado (Bs.)': Number(runningTotal.toFixed(2))
    }
  ], { skipHeader: true, origin: -1 });

  worksheet['!cols'] = [
    { wch: 6 },  // Nro
    { wch: 20 }, // Fecha
    { wch: 32 }, // Producto
    { wch: 18 }, // Categoria
    { wch: 22 }, // SKU
    { wch: 16 }, // Color
    { wch: 22 }, // Talla
    { wch: 16 }, // Piezas
    { wch: 20 }, // Precio Unitario
    { wch: 20 }, // Importe Total
    { wch: 22 }  // Importe Acumulado
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte_Ventas_Ingresos');

  const fechaArchivo = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `reporte_ventas_ingresos_moreli_${fechaArchivo}.xlsx`);
};

/**
 * Exporta el inventario activo completo a formato EXCEL (.xlsx)
 */
export const exportInventoryToExcel = (articulos: Articulo[]): void => {
  const rows: any[] = [];

  articulos.forEach(art => {
    art.variantes.forEach(v => {
      rows.push({
        'Nombre': art.nombre,
        'Categoria': art.categoria,
        'Precio_Bs': Number(art.precio.toFixed(2)),
        'Color': v.color,
        'Talla': v.talla,
        'Cantidad_Stock': v.cantidad,
        'Valor_Stock_Bs': Number((v.cantidad * art.precio).toFixed(2)),
        'Descripcion': art.descripcion || '',
        'SKU_Producto': art.sku || '',
        'SKU_Variante': v.sku || '',
        'Foto_URL': art.foto || ''
      });
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet['!cols'] = [
    { wch: 30 },
    { wch: 18 },
    { wch: 14 },
    { wch: 18 },
    { wch: 12 },
    { wch: 14 },
    { wch: 16 },
    { wch: 35 },
    { wch: 18 },
    { wch: 24 },
    { wch: 35 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventario_Moreli');

  const fechaArchivo = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `inventario_moreli_${fechaArchivo}.xlsx`);
};

/**
 * Parser inteligente de archivos Excel (.xlsx, .xls) y CSV:
 * Lee las hojas del libro de trabajo, agrupa variantes bajo el mismo producto con códigos SKU automáticos.
 */
export const parseExcelFileToArticles = async (
  file: File,
  existingArticlesCount = 0
): Promise<{
  articulos: Articulo[];
  categoriasDetectadas: string[];
  totalFilas: number;
  totalProductos: number;
  totalVariantes: number;
}> => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });

  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    throw new Error('El archivo Excel no contiene hojas de datos.');
  }

  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  if (rawRows.length === 0) {
    throw new Error('La hoja de cálculo está vacía o no contiene filas con datos.');
  }

  // Helper to find value by possible column names
  const findValue = (row: any, keys: string[]): string => {
    const rowKeys = Object.keys(row);
    for (const k of keys) {
      const match = rowKeys.find(rk => 
        rk.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]/g, '')
          .includes(k)
      );
      if (match && row[match] !== undefined && row[match] !== null) {
        return String(row[match]).trim();
      }
    }
    return '';
  };

  const productMap = new Map<string, {
    nombre: string;
    categoria: string;
    precio: number;
    descripcion: string;
    foto: string;
    sku: string;
    variantes: { color: string; talla: string; cantidad: number; sku?: string }[];
  }>();

  const categoriasSet = new Set<string>();
  let totalFilas = 0;
  let totalVariantes = 0;

  for (const row of rawRows) {
    const nombre = findValue(row, ['nombre', 'producto', 'articulo', 'item', 'prenda']);
    if (!nombre) continue;

    totalFilas++;
    const categoria = findValue(row, ['categoria', 'linea', 'rubro']) || 'General';
    categoriasSet.add(categoria);

    const precioStr = findValue(row, ['precio', 'preciobs', 'valor', 'monto', 'costo']);
    let precio = 0;
    if (precioStr) {
      const cleanPrice = precioStr.replace(/[^\d.,]/g, '').replace(',', '.');
      precio = parseFloat(cleanPrice) || 0;
    }

    const color = findValue(row, ['color', 'tono']) || 'Único';
    const talla = findValue(row, ['talla', 'tamano', 'numero', 'medida']) || 'Única';

    const cantStr = findValue(row, ['cantidad', 'stock', 'existencias', 'unidades', 'cant']);
    let cantidad = 1;
    if (cantStr) {
      const parsedQty = parseInt(cantStr.replace(/[^\d]/g, ''), 10);
      cantidad = !isNaN(parsedQty) ? Math.max(0, parsedQty) : 1;
    }

    const descripcion = findValue(row, ['descripcion', 'detalle', 'notas', 'desc']);
    const sku = findValue(row, ['sku', 'codigo', 'cod']);
    const foto = findValue(row, ['foto', 'imagen', 'url', 'imagenurl', 'fotourl']);

    const productKey = `${nombre.toLowerCase()}___${categoria.toLowerCase()}`;

    if (!productMap.has(productKey)) {
      productMap.set(productKey, {
        nombre,
        categoria,
        precio,
        descripcion,
        foto,
        sku,
        variantes: []
      });
    }

    const prod = productMap.get(productKey)!;
    if (precio > 0 && prod.precio === 0) prod.precio = precio;
    if (descripcion && !prod.descripcion) prod.descripcion = descripcion;
    if (foto && !prod.foto) prod.foto = foto;
    if (sku && !prod.sku) prod.sku = sku;

    const existingVar = prod.variantes.find(
      v => v.color.toLowerCase() === color.toLowerCase() && v.talla.toLowerCase() === talla.toLowerCase()
    );

    if (existingVar) {
      existingVar.cantidad += cantidad;
    } else {
      prod.variantes.push({
        color,
        talla,
        cantidad,
        sku: ''
      });
      totalVariantes++;
    }
  }

  if (productMap.size === 0) {
    throw new Error('No se encontraron registros de productos válidos en el archivo Excel. Verifica que tenga una columna "Nombre".');
  }

  const now = new Date().toISOString();
  let seqCounter = existingArticlesCount + 1;

  const articulos: Articulo[] = Array.from(productMap.values()).map((p, idx) => {
    const prodId = `prod-xl-${Date.now().toString(36)}-${idx + 1}`;
    const autoSku = p.sku || generateAutoProductSku(p.categoria, [{ id: '', nombre: '', categoria: p.categoria, precio: 0, variantes: [], sku: `MOR-XXX-${String(seqCounter).padStart(3, '0')}`, fechaCreacion: '', fechaActualizacion: '' }]);
    seqCounter++;

    const variantes: Variante[] = p.variantes.map((v, vIdx) => ({
      id: `var-${prodId}-${vIdx + 1}`,
      color: v.color,
      colorHex: getHexForColor(v.color),
      talla: v.talla,
      cantidad: v.cantidad,
      sku: generateAutoVariantSku(autoSku, v.color, v.talla)
    }));

    return {
      id: prodId,
      nombre: p.nombre,
      categoria: p.categoria,
      precio: p.precio,
      descripcion: p.descripcion || undefined,
      foto: p.foto || undefined,
      sku: autoSku,
      variantes,
      fechaCreacion: now,
      fechaActualizacion: now
    };
  });

  return {
    articulos,
    categoriasDetectadas: Array.from(categoriasSet),
    totalFilas,
    totalProductos: articulos.length,
    totalVariantes
  };
};
