import React, { useRef } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  X, 
  Download, 
  Upload, 
  RotateCcw, 
  Database, 
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { exportInventoryToExcel } from '../utils/inventoryUtils';

export const BackupModal: React.FC = () => {
  const { 
    isBackupModalOpen, 
    setIsBackupModalOpen, 
    articulos, 
    exportarJSON, 
    importarJSON, 
    restablecerDatosEjemplo,
    mostrarToast 
  } = useInventory();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isBackupModalOpen) return null;

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        const exito = importarJSON(content);
        if (exito) {
          setIsBackupModalOpen(false);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <AnimatePresence>
      <div 
        id="modal-backup-overlay" 
        className="fixed inset-0 z-50 bg-[#2A5A29]/40 backdrop-blur-xs flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          id="modal-backup-content"
          className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-md w-full p-6 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#2A5A29]/10 text-[#2A5A29] flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-tight">
                  Respaldos y Herramientas de Datos
                </h3>
                <p className="text-xs text-stone-500">
                  Exporta, importa o restablece tu catálogo Moreli
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsBackupModalOpen(false)}
              className="p-1 text-stone-400 hover:text-stone-600 rounded-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 my-4">
            
            {/* 1. Export Excel */}
            <div className="p-3.5 rounded-2xl border border-stone-200 bg-[#F0EEEF] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#2A5A29]" />
                  Exportar a Excel (.xlsx)
                </h4>
                <p className="text-[11px] text-[#535456] mt-0.5">
                  Descarga tus {articulos.length} prendas con precios en Bs. y variantes.
                </p>
              </div>
              <button
                id="btn-exportar-excel-completo"
                onClick={() => exportInventoryToExcel(articulos)}
                className="px-3 py-1.5 bg-[#2A5A29] hover:bg-[#1e421d] text-white rounded-xl text-xs font-semibold whitespace-nowrap shadow-2xs cursor-pointer"
              >
                Exportar Excel
              </button>
            </div>

            {/* 2. Export JSON Backup */}
            <div className="p-3.5 rounded-xl border border-stone-200 bg-[#F0EEEF]/60 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-[#9F7652]" />
                  Copia de Seguridad (JSON)
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Respaldo completo de base de datos local.
                </p>
              </div>
              <button
                id="btn-exportar-json"
                onClick={exportarJSON}
                className="px-3 py-1.5 bg-[#9F7652] hover:bg-[#855f3f] text-white rounded-lg text-xs font-semibold whitespace-nowrap shadow-2xs cursor-pointer"
              >
                Descargar JSON
              </button>
            </div>

            {/* 3. Import JSON */}
            <div className="p-3.5 rounded-xl border border-stone-200 bg-[#F0EEEF]/60 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-[#648D4B]" />
                  Restaurar Respaldo (JSON)
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Carga un archivo de respaldo JSON previo.
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleFileImport}
              />
              <button
                id="btn-importar-json"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer"
              >
                Subir JSON
              </button>
            </div>

            {/* 4. Reset Demo Data */}
            <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                  Restablecer Catálogo Moreli
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Recarga las prendas iniciales en Bolivianos (Bs.).
                </p>
              </div>
              <button
                id="btn-restablecer-datos"
                onClick={() => {
                  restablecerDatosEjemplo();
                  setIsBackupModalOpen(false);
                }}
                className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer"
              >
                Restablecer
              </button>
            </div>

          </div>

          <div className="mt-5 pt-3 border-t border-stone-200 flex justify-end">
            <button
              onClick={() => setIsBackupModalOpen(false)}
              className="px-4 py-2 bg-[#2A5A29] hover:bg-[#1e421d] text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Listo
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
