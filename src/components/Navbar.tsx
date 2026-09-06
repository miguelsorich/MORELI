import React, { useState, useRef } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Plus, 
  FileSpreadsheet, 
  Database, 
  Receipt,
  Download,
  LogOut,
  Sparkles,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import { downloadInventoryExcelTemplate } from '../utils/inventoryUtils';
import { MORELI_WALINK_URL } from '../utils/whatsappUtils';

export const Navbar: React.FC = () => {
  const { 
    isAdmin,
    setIsAdminAuthModalOpen,
    logoutAdmin,
    setIsModalCrearOpen, 
    setIsImportModalOpen, 
    setIsSalesReportOpen,
    setIsBackupModalOpen,
    ventas 
  } = useInventory();

  // Secret 3-click trigger on the Moreli brand image
  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = () => {
    if (isAdmin) return; // already in admin mode

    setClickCount((prev) => {
      const next = prev + 1;
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
      if (next >= 3) {
        setIsAdminAuthModalOpen(true);
        return 0;
      }
      clickTimerRef.current = setTimeout(() => {
        setClickCount(0);
      }, 1500); // 1.5s window
      return next;
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#9F7652] text-white border-b border-[#855f3f] shadow-md select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Identity with secret 3-click trigger */}
          <div className="flex items-center gap-3">
            {/* Signature Moreli Brand Image - 3 clicks triggers admin login */}
            <div 
              id="brand-logo-moreli"
              onClick={handleLogoClick}
              className="w-11 h-11 rounded-2xl bg-white overflow-hidden shadow-xs border border-[#B89C71] flex-shrink-0 flex items-center justify-center cursor-pointer transition-transform active:scale-95"
              title="MORELI"
            >
              <img 
                src="/moreli-logo.png" 
                alt="Logo Moreli" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover pointer-events-none"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/d/1ncj1maBvJHcljkm0CjM2HT_BA710sBBk";
                }}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-white uppercase font-sans">
                  MORELI
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2A5A29] text-white">
                  Bolivia (Bs.)
                </span>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#2A5A29] text-white border border-[#B89C71]">
                    <ShieldCheck className="w-3 h-3 text-[#B89C71]" />
                    Admin
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#F0EEEF]/90 -mt-0.5">
                {isAdmin 
                  ? 'Gestión de Inventario, Ventas e Ingresos' 
                  : 'Prendas, Calzado, Perfumes & Accesorios'}
              </p>
            </div>
          </div>

          {/* Quick Action Navigation - ONLY VISIBLE FOR ADMIN */}
          {isAdmin ? (
            <div className="flex items-center gap-2 sm:gap-2.5">
              
              {/* Sales & Revenue Report Action Button */}
              <button
                id="btn-nav-reporte-ventas"
                onClick={() => setIsSalesReportOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#2A5A29] hover:bg-[#1e421d] text-white transition-all cursor-pointer shadow-xs"
                title="Abrir Reporte de Ventas e Ingresos"
              >
                <Receipt className="w-4 h-4 text-[#B89C71]" />
                <span>Reporte de Ventas</span>
                {ventas.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-extrabold">
                    {ventas.length}
                  </span>
                )}
              </button>

              {/* Download Excel Template button */}
              <button
                id="btn-nav-descargar-plantilla"
                onClick={downloadInventoryExcelTemplate}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#F0EEEF] hover:bg-white/10 transition-colors cursor-pointer"
                title="Descargar plantilla Excel (.xlsx) de inventario"
              >
                <Download className="w-3.5 h-3.5 text-[#B89C71]" />
                <span>Plantilla Excel</span>
              </button>

              {/* Excel Import Modal Button */}
              <button
                id="btn-nav-importar-excel"
                onClick={() => setIsImportModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer shadow-2xs"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#B89C71]" />
                <span className="hidden sm:inline">Cargar Excel (.xlsx)</span>
              </button>

              {/* Backup & Tools Modal Button */}
              <button
                id="btn-nav-respaldo"
                onClick={() => setIsBackupModalOpen(true)}
                className="p-2 rounded-xl text-stone-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Copia de seguridad y configuración"
              >
                <Database className="w-4 h-4" />
              </button>

              {/* New Product Main Primary CTA */}
              <button
                id="btn-nav-nuevo-articulo"
                onClick={() => setIsModalCrearOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#2A5A29] hover:bg-[#1e421d] text-white shadow-xs hover:shadow transition-all cursor-pointer border border-white/20"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Prenda</span>
              </button>

              {/* Exit / Logout Admin button */}
              <button
                id="btn-nav-logout-admin"
                onClick={logoutAdmin}
                className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold text-[#F0EEEF] hover:bg-rose-900/30 hover:text-white transition-colors cursor-pointer border border-white/10"
                title="Cerrar sesión de Administrador y volver a vista de Cliente"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Salir</span>
              </button>

            </div>
          ) : (
            /* Client Portal Nav actions */
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-[11px] font-semibold text-[#F0EEEF]">
                <Sparkles className="w-3 h-3 text-[#B89C71]" />
                Colección Exclusiva
              </span>

              <a
                id="btn-nav-whatsapp-consulta"
                href={MORELI_WALINK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-extrabold shadow-xs hover:shadow transition-all cursor-pointer"
                title="Consultar o comprar por WhatsApp (walink.co/2bp3yl)"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Comprar por WhatsApp</span>
                <span className="sm:hidden">WhatsApp</span>
              </a>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

