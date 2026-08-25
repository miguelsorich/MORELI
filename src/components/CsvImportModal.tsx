import React, { useState, useRef } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  downloadInventoryExcelTemplate, 
  parseExcelFileToArticles, 
  formatBolivianos 
} from '../utils/inventoryUtils';
import { 
  X, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Layers, 
  Tag, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Articulo } from '../types/inventory';

export const CsvImportModal: React.FC = () => {
  const { 
    isImportModalOpen, 
    setIsImportModalOpen, 
    importarArticulosExcel, 
    articulos,
    mostrarToast 
  } = useInventory();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [nombreArchivo, setNombreArchivo] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorParsing, setErrorParsing] = useState<string | null>(null);

  // Parsed result preview
  const [previewResult, setPreviewResult] = useState<{
    articulos: Articulo[];
    categoriasDetectadas: string[];
    totalFilas: number;
    totalProductos: number;
    totalVariantes: number;
  } | null>(null);

  if (!isImportModalOpen) return null;

  const handleClose = () => {
    setIsImportModalOpen(false);
    setPreviewResult(null);
    setErrorParsing(null);
    setNombreArchivo('');
  };

  const handleProcessFile = async (file: File) => {
    setErrorParsing(null);
    setIsProcessing(true);
    setNombreArchivo(file.name);

    try {
      const parsed = await parseExcelFileToArticles(file, articulos.length);
      setPreviewResult(parsed);
      setIsProcessing(false);
      mostrarToast(
        'success', 
        'Archivo Excel procesado', 
        `Se detectaron ${parsed.totalProductos} productos y ${parsed.totalVariantes} combinaciones.`
      );
    } catch (err: any) {
      setErrorParsing(err.message || 'Error al procesar el archivo Excel. Verifica el formato de la plantilla.');
      setIsProcessing(false);
      setPreviewResult(null);
    }
  };

  const handleConfirmImport = () => {
    if (!previewResult || previewResult.articulos.length === 0) return;

    importarArticulosExcel(previewResult.articulos, previewResult.categoriasDetectadas);
    handleClose();
  };

  return (
    <AnimatePresence>
      <div 
        id="modal-importar-excel-overlay" 
        className="fixed inset-0 z-50 bg-[#2A5A29]/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          id="modal-importar-excel-content"
          className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto"
        >
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#F0EEEF]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#9F7652] text-white flex items-center justify-center shadow-xs">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900 tracking-tight flex items-center gap-2">
                  <span>Importar Inventario desde Excel (.xlsx)</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2A5A29]/10 text-[#2A5A29] uppercase tracking-wider">
                    Bolivia (Bs.)
                  </span>
                </h2>
                <p className="text-xs text-[#535456]">
                  Carga masiva de prendas, tallas brasileras y códigos automáticos mediante hoja de cálculo
                </p>
              </div>
            </div>

            <button
              id="btn-cerrar-importar-excel"
              onClick={handleClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            
            {/* Step 1: Download Official Excel Template */}
            <div className="p-4.5 rounded-2xl bg-[#F0EEEF] border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#9F7652]" />
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Paso 1: Descargar Plantilla Oficial en Excel
                  </h3>
                </div>
                <p className="text-xs text-[#535456] leading-relaxed max-w-lg">
                  La plantilla contiene las columnas requeridas: <strong>Nombre, Categoria, Precio_Bs, Color, Talla, Cantidad, Descripcion y SKU</strong>.
                </p>
              </div>

              <button
                type="button"
                id="btn-descargar-plantilla-excel"
                onClick={downloadInventoryExcelTemplate}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#9F7652] hover:bg-[#855f3f] text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer flex-shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Plantilla (.xlsx)</span>
              </button>
            </div>

            {/* Step 2: Upload Excel File */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-[#2A5A29]" />
                Paso 2: Subir Archivo Excel Completado
              </h3>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files?.[0]) {
                    handleProcessFile(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-[#2A5A29] bg-[#2A5A29]/10' 
                    : 'border-[#B89C71]/60 hover:border-[#2A5A29] bg-[#F0EEEF]/40 hover:bg-[#F0EEEF]/80'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleProcessFile(e.target.files[0]);
                    }
                  }}
                />
                
                <div className="w-12 h-12 rounded-2xl bg-[#2A5A29]/10 text-[#2A5A29] flex items-center justify-center mx-auto mb-2.5">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>

                <p className="text-sm font-bold text-stone-800">
                  {nombreArchivo ? nombreArchivo : 'Haz clic para seleccionar o arrastra tu archivo Excel (.xlsx) aquí'}
                </p>
                <p className="text-xs text-[#535456] mt-1">
                  Formatos compatibles: <strong>.xlsx</strong> y <strong>.xls</strong> de Microsoft Excel
                </p>
              </div>

              {/* Error Box */}
              {errorParsing && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2.5 text-xs">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block">Error en la lectura del archivo:</strong>
                    <span>{errorParsing}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Preview of extracted data */}
            {previewResult && (
              <div className="space-y-4 pt-2 border-t border-stone-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#2A5A29]" />
                      Paso 3: Vista Previa de Prendas Detectadas
                    </h3>
                    <p className="text-xs text-[#535456]">
                      Verifica las prendas antes de incorporarlas al catálogo activo
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#2A5A29]/10 text-[#2A5A29] text-xs font-bold">
                      {previewResult.totalProductos} Productos
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#9F7652]/15 text-[#9F7652] text-xs font-bold">
                      {previewResult.totalVariantes} Variantes
                    </span>
                  </div>
                </div>

                {/* Extracted table preview */}
                <div className="border border-stone-200 rounded-2xl overflow-hidden max-h-56 overflow-y-auto shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F0EEEF] border-b border-stone-200 text-[11px] font-bold text-stone-700 uppercase sticky top-0">
                      <tr>
                        <th className="py-2.5 px-3">Producto</th>
                        <th className="py-2.5 px-3">Categoría</th>
                        <th className="py-2.5 px-3">Precio (Bs.)</th>
                        <th className="py-2.5 px-3">Código SKU</th>
                        <th className="py-2.5 px-3">Variantes</th>
                        <th className="py-2.5 px-3 text-center">Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 bg-white">
                      {previewResult.articulos.map((art) => {
                        const stockProd = art.variantes.reduce((sum, v) => sum + (Number(v.cantidad) || 0), 0);
                        return (
                          <tr key={art.id} className="hover:bg-stone-50">
                            <td className="py-2.5 px-3 font-bold text-stone-900">
                              {art.nombre}
                            </td>
                            <td className="py-2.5 px-3 text-[#535456]">
                              <span className="px-2 py-0.5 rounded bg-stone-100 border border-stone-200 font-medium">
                                {art.categoria}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-bold text-[#2A5A29]">
                              {formatBolivianos(art.precio)}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[11px] text-[#2A5A29] font-bold">
                              {art.sku}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {art.variantes.slice(0, 3).map(v => (
                                  <span key={v.id} className="px-1.5 py-0.5 rounded bg-stone-100 text-[10px] text-stone-700 border border-stone-200">
                                    {v.color} - T.{v.talla} ({v.cantidad}u)
                                  </span>
                                ))}
                                {art.variantes.length > 3 && (
                                  <span className="text-[10px] text-stone-400 font-bold self-center">
                                    +{art.variantes.length - 3} más
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold text-stone-800">
                              {stockProd}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-[#648D4B]/10 border border-[#648D4B]/30 rounded-xl flex items-center gap-2 text-xs text-[#2A5A29]">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Las filas coincidentes se agrupan automáticamente con numeración y códigos SKU autogenerados.
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-stone-200 bg-[#F0EEEF] flex items-center justify-between gap-3">
            <button
              type="button"
              id="btn-cancelar-importar-modal"
              onClick={handleClose}
              className="px-4 py-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              id="btn-confirmar-importar-catalogo"
              disabled={!previewResult || previewResult.articulos.length === 0}
              onClick={handleConfirmImport}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2A5A29] hover:bg-[#1e421d] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <span>Incorporar al Inventario ({previewResult?.totalProductos || 0} Prendas)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
