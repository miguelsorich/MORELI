import React, { useRef } from 'react';
import { Articulo } from '../types/inventory';
import { useInventory } from '../context/InventoryContext';
import { formatBolivianos } from '../utils/inventoryUtils';
import { 
  Eye, 
  Edit3, 
  Trash2, 
  Shirt,
  ShoppingBag,
  CheckCircle2,
  Camera,
  MessageCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { MORELI_WALINK_URL, ejecutarConsultaWhatsApp } from '../utils/whatsappUtils';

interface ProductCardProps {
  articulo: Articulo;
}

export const ProductCard: React.FC<ProductCardProps> = ({ articulo }) => {
  const { 
    isAdmin,
    setArticuloDetalle, 
    setArticuloEdicion, 
    setArticuloEliminar,
    setSellTarget,
    actualizarArticulo,
    mostrarToast
  } = useInventory();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleQuickUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      mostrarToast('error', 'Formato no soportado', 'Por favor selecciona un archivo de imagen (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        actualizarArticulo(articulo.id, { foto: result });
        mostrarToast('success', 'Foto Cargada', `Se guardó la foto para "${articulo.nombre}".`);
      }
    };
    reader.readAsDataURL(file);
  };

  const totalStock = articulo.variantes.reduce((sum, v) => sum + (Number(v.cantidad) || 0), 0);

  // Group variants summary
  const totalColores = new Set(articulo.variantes.map(v => v.color)).size;
  const totalTallas = new Set(articulo.variantes.map(v => v.talla)).size;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      id={`tarjeta-producto-${articulo.id}`}
      className="bg-white rounded-3xl border border-stone-200 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group hover:border-[#648D4B]/60"
    >
      {/* Product Image / Placeholder Banner */}
      <div 
        onClick={() => setArticuloDetalle(articulo)}
        className="relative h-48 bg-[#F0EEEF] overflow-hidden cursor-pointer flex items-center justify-center"
      >
        {articulo.foto ? (
          <img
            src={articulo.foto}
            alt={articulo.nombre}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-[#F0EEEF] to-[#B89C71]/15">
            <div className="w-12 h-12 rounded-2xl bg-[#9F7652]/15 text-[#2A5A29] flex items-center justify-center mb-2 shadow-2xs">
              <Shirt className="w-6 h-6 stroke-[1.5]" />
            </div>
            <span className="text-[11px] font-bold text-[#9F7652] uppercase tracking-wider">
              Moreli Colección
            </span>
            <span className="text-xs font-semibold text-[#535456]">{articulo.categoria}</span>
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#F0EEEF]/95 backdrop-blur-md text-[#2A5A29] border border-stone-200 shadow-2xs uppercase tracking-wider">
            {articulo.categoria}
          </span>
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#2A5A29]/95 backdrop-blur-md text-white shadow-2xs">
            <CheckCircle2 className="w-3 h-3" />
            {totalStock} {totalStock === 1 ? 'unidad' : 'unidades'}
          </span>
        </div>

        {/* Quick Upload Photo Button for Admin */}
        {isAdmin && (
          <div className="absolute bottom-3 right-3 z-20">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/95 hover:bg-white text-stone-800 hover:text-[#2A5A29] shadow-md border border-stone-200 transition-all text-xs font-bold cursor-pointer"
              title="Cargar foto para este artículo"
            >
              <Camera className="w-3.5 h-3.5 text-[#2A5A29]" />
              <span>{articulo.foto ? 'Cambiar Foto' : 'Subir Foto'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleQuickUpload}
            />
          </div>
        )}

        {/* Quick view hover icon */}
        <div className="absolute inset-0 bg-[#2A5A29]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 text-stone-900 text-xs font-bold shadow-md">
            <Eye className="w-3.5 h-3.5 text-[#2A5A29]" />
            Ver Detalles & Tallas
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        {/* Name & SKU */}
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="font-mono text-[11px] font-bold text-[#2A5A29] tracking-wider">
              {articulo.sku || 'MOR-ART-001'}
            </span>
            <span className="text-xs text-[#535456]">
              {articulo.variantes.length} {articulo.variantes.length === 1 ? 'variante' : 'variantes'}
            </span>
          </div>

          <h3 
            onClick={() => setArticuloDetalle(articulo)}
            className="text-sm font-bold text-stone-900 line-clamp-1 hover:text-[#2A5A29] cursor-pointer transition-colors"
            title={articulo.nombre}
          >
            {articulo.nombre}
          </h3>

          {articulo.descripcion && (
            <p className="text-xs text-[#535456] line-clamp-2 mt-1 leading-relaxed">
              {articulo.descripcion}
            </p>
          )}
        </div>

        {/* Variants Micro-Visualizer (Colors & Sizes) */}
        <div className="p-2.5 rounded-2xl bg-[#F0EEEF] border border-stone-200/80 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#535456] font-medium">Colores & Tallas:</span>
            <span className="text-stone-800 font-bold">{totalColores} col • {totalTallas} tallas</span>
          </div>

          {/* Color bullets & Sizes tags */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center -space-x-1 overflow-hidden">
              {articulo.variantes.slice(0, 5).map((v) => (
                <span
                  key={v.id}
                  title={`${v.color} - Talla ${v.talla} (${v.cantidad} u.)`}
                  className="w-4 h-4 rounded-full border-2 border-white shadow-2xs flex-shrink-0"
                  style={{ backgroundColor: v.colorHex || '#64748b' }}
                />
              ))}
              {articulo.variantes.length > 5 && (
                <span className="text-[10px] font-bold text-[#535456] pl-2">
                  +{articulo.variantes.length - 5}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1 justify-end">
              {Array.from(new Set(articulo.variantes.map(v => v.talla))).slice(0, 4).map(t => (
                <span key={t} className="px-1.5 py-0.5 rounded bg-white text-[10px] font-bold text-stone-800 border border-stone-200">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Price in Bolivianos & Action Bar */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold text-[#535456] uppercase tracking-wider block">
              Precio
            </span>
            <span className="text-base font-extrabold text-[#2A5A29]">
              {formatBolivianos(articulo.precio)}
            </span>
          </div>

          {isAdmin ? (
            <div className="flex items-center gap-1.5">
              {/* Vender button (Action Button in Verde Jungla Profundo) */}
              <button
                id={`btn-vender-${articulo.id}`}
                onClick={() => setSellTarget({ articulo })}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#2A5A29] hover:bg-[#1e421d] text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
                title="Marcar como Vendido y registrar en reporte de ingresos"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Vendido</span>
              </button>

              <button
                id={`btn-editar-${articulo.id}`}
                onClick={() => setArticuloEdicion(articulo)}
                className="p-1.5 rounded-xl text-[#535456] hover:text-[#2A5A29] hover:bg-[#F0EEEF] transition-colors cursor-pointer"
                title="Editar prenda"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                id={`btn-eliminar-${articulo.id}`}
                onClick={() => setArticuloEliminar(articulo)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Eliminar del inventario"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <a
                href={MORELI_WALINK_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  ejecutarConsultaWhatsApp({ articulo }, () => {
                    mostrarToast('success', '¡Abriendo WhatsApp!', `Consulta copiada: "${articulo.nombre}". Abriendo chat con Moreli.`);
                  });
                }}
                className="p-1.5 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                title="Probar enlace WhatsApp (wa.link)"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                id={`btn-cliente-ver-${articulo.id}`}
                onClick={() => setArticuloDetalle(articulo)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#F0EEEF] hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer border border-stone-200"
                title="Ver detalles, tallas y colores"
              >
                <Eye className="w-3.5 h-3.5 text-[#2A5A29]" />
                <span>Ver</span>
              </button>

              <a
                id={`btn-comprar-whatsapp-${articulo.id}`}
                href={MORELI_WALINK_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  ejecutarConsultaWhatsApp({ articulo }, () => {
                    mostrarToast('success', '¡Abriendo WhatsApp!', `Consulta copiada: "${articulo.nombre}". Abriendo chat de compra con Moreli.`);
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
                title="Comprar o consultar disponibilidad en WhatsApp (walink.co/2bp3yl)"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Comprar</span>
              </a>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};
