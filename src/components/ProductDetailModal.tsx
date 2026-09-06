import React, { useRef, useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { formatBolivianos } from '../utils/inventoryUtils';
import { MORELI_WALINK_URL, ejecutarConsultaWhatsApp, generarMensajeWhatsApp } from '../utils/whatsappUtils';
import { compressImage } from '../utils/imageCompression';
import { Variante } from '../types/inventory';
import { 
  X as CloseIcon, 
  Edit3 as EditIcon, 
  Trash2 as TrashIcon, 
  Shirt as ShirtIcon, 
  Plus as PlusIcon, 
  Minus as MinusIcon, 
  Calendar as CalendarIcon, 
  Layers as LayersIcon, 
  CheckCircle2 as CheckIcon,
  ShoppingBag as SellIcon,
  Camera as CameraIcon,
  MessageCircle,
  ExternalLink,
  Copy,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetailModal: React.FC = () => {
  const { 
    isAdmin,
    articuloDetalle, 
    setArticuloDetalle, 
    setArticuloEdicion, 
    setArticuloEliminar,
    setSellTarget,
    actualizarStockVariante,
    actualizarArticulo,
    mostrarToast
  } = useInventory();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedVariante, setSelectedVariante] = useState<Variante | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [modalImgError, setModalImgError] = useState(false);

  useEffect(() => {
    setModalImgError(false);
  }, [articuloDetalle?.foto]);

  if (!articuloDetalle) return null;

  const handleWhatsAppAction = () => {
    ejecutarConsultaWhatsApp(
      { 
        articulo: articuloDetalle, 
        variante: selectedVariante || undefined 
      }, 
      (mensaje) => {
        mostrarToast(
          'success', 
          '¡Abriendo WhatsApp!', 
          `Mensaje preparado para "${articuloDetalle.nombre}". Abriendo chat con Moreli...`
        );
      }
    );
  };

  const handleModalPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      mostrarToast('error', 'Formato no válido', 'Por favor selecciona una imagen (JPG, PNG, WebP).');
      return;
    }

    try {
      setIsUploadingPhoto(true);
      mostrarToast('info', 'Optimizando foto...', 'Preparando imagen de alta velocidad para el catálogo...');
      const compressedDataUrl = await compressImage(file, 520, 0.72);
      actualizarArticulo(articuloDetalle.id, { foto: compressedDataUrl });
      setArticuloDetalle({ ...articuloDetalle, foto: compressedDataUrl });
      mostrarToast('success', '¡Foto Guardada!', `La foto de "${articuloDetalle.nombre}" se guardó y sincronizó con la nube.`);
    } catch (err) {
      console.error('Error processing detail photo:', err);
      mostrarToast('error', 'Error al procesar foto', err instanceof Error ? err.message : 'No se pudo procesar la imagen seleccionada.');
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const totalStock = articuloDetalle.variantes.reduce((sum, v) => sum + (Number(v.cantidad) || 0), 0);
  const valorTotal = totalStock * (articuloDetalle.precio || 0);

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('es-BO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const handleSellAction = () => {
    const item = articuloDetalle;
    setArticuloDetalle(null);
    setSellTarget({ articulo: item });
  };

  return (
    <AnimatePresence>
      <div 
        id="modal-detalle-articulo-overlay" 
        className="fixed inset-0 z-50 bg-[#2A5A29]/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          id="modal-detalle-articulo-content"
          className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#F0EEEF]">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#2A5A29]/10 text-[#2A5A29] border border-[#2A5A29]/20">
                {articuloDetalle.categoria}
              </span>
              <span className="text-xs font-mono font-bold text-[#2A5A29]">
                {articuloDetalle.sku || 'MOR-ART-001'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {isAdmin && (
                <>
                  <button
                    id="btn-detalle-vender"
                    onClick={handleSellAction}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#2A5A29] hover:bg-[#1e421d] text-white transition-colors cursor-pointer shadow-xs"
                  >
                    <SellIcon className="w-3.5 h-3.5" />
                    <span>Vendido</span>
                  </button>

                  <button
                    id="btn-detalle-editar"
                    onClick={() => {
                      const toEdit = articuloDetalle;
                      setArticuloDetalle(null);
                      setArticuloEdicion(toEdit);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
                  >
                    <EditIcon className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    id="btn-detalle-eliminar"
                    onClick={() => {
                      const toDelete = articuloDetalle;
                      setArticuloDetalle(null);
                      setArticuloEliminar(toDelete);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                </>
              )}

              <button
                id="btn-detalle-cerrar"
                onClick={() => setArticuloDetalle(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-xl transition-colors ml-1 cursor-pointer"
                aria-label="Cerrar modal"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            
            {/* Top Product Overview */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              
              {/* Product Photo / Placeholder */}
              <div className="w-full sm:w-48 h-48 rounded-2xl bg-[#F0EEEF] border border-stone-200 overflow-hidden flex-shrink-0 flex items-center justify-center relative shadow-2xs group">
                {isUploadingPhoto ? (
                  <div className="flex flex-col items-center justify-center gap-2 text-[#2A5A29] p-4 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#2A5A29]" />
                    <span className="text-xs font-bold text-stone-700">Optimizando foto...</span>
                    <span className="text-[10px] text-stone-500">Un momento por favor</span>
                  </div>
                ) : articuloDetalle.foto && !modalImgError ? (
                  <img
                    src={articuloDetalle.foto}
                    alt={articuloDetalle.nombre}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={() => {
                      setModalImgError(true);
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-stone-400 p-4 text-center">
                    <ShirtIcon className="w-10 h-10 stroke-[1.5] text-[#9F7652] mb-1.5" />
                    <span className="text-xs font-bold text-stone-600">{articuloDetalle.categoria}</span>
                    <span className="text-[10px] text-[#535456]">Colección Moreli</span>
                  </div>
                )}

                {isAdmin && !isUploadingPhoto && (
                  <div className="absolute bottom-2 right-2 z-10">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/95 hover:bg-white text-stone-800 hover:text-[#2A5A29] shadow-md border border-stone-200 transition-all text-xs font-bold cursor-pointer"
                      title="Cargar o cambiar foto"
                    >
                      <CameraIcon className="w-3.5 h-3.5 text-[#2A5A29]" />
                      <span>{articuloDetalle.foto ? 'Cambiar Foto' : 'Subir Foto'}</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      className="hidden"
                      onChange={handleModalPhotoUpload}
                    />
                  </div>
                )}
              </div>

              {/* Product Meta */}
              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
                    {articuloDetalle.nombre}
                  </h2>
                  {articuloDetalle.descripcion && (
                    <p className="text-xs text-[#535456] mt-1 leading-relaxed">
                      {articuloDetalle.descripcion}
                    </p>
                  )}
                </div>

                {/* KPI stats in Bolivianos */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-[#F0EEEF] border border-stone-200">
                    <span className="text-[10px] font-bold text-[#535456] uppercase tracking-wider block">Precio Unitario</span>
                    <span className="text-sm sm:text-base font-extrabold text-[#2A5A29]">{formatBolivianos(articuloDetalle.precio)}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F0EEEF] border border-stone-200">
                    <span className="text-[10px] font-bold text-[#535456] uppercase tracking-wider block">Stock Total</span>
                    <span className="text-sm sm:text-base font-extrabold text-stone-900">
                      {totalStock} {totalStock === 1 ? 'unidad' : 'unidades'}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F0EEEF] border border-stone-200">
                    <span className="text-[10px] font-bold text-[#535456] uppercase tracking-wider block">Valor Total</span>
                    <span className="text-sm sm:text-base font-extrabold text-[#2A5A29]">{formatBolivianos(valorTotal)}</span>
                  </div>
                </div>

                {/* WhatsApp Purchase & Direct Consultation Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50/60 border border-emerald-200/90 shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-900">
                        <MessageCircle className="w-4 h-4 text-[#25D366]" />
                        <span>Comprar o Consultar esta Prenda</span>
                      </div>
                      <p className="text-xs text-emerald-800/90 mt-0.5">
                        {selectedVariante ? (
                          <span className="font-semibold text-emerald-950">
                            Variante elegida: <span className="underline">{selectedVariante.color}</span> (Talla {selectedVariante.talla})
                          </span>
                        ) : (
                          <span>Puedes seleccionar tu talla o color abajo y enviar la consulta directa a Moreli.</span>
                        )}
                      </p>
                    </div>

                    <a
                      id="btn-modal-comprar-whatsapp"
                      href={MORELI_WALINK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleWhatsAppAction}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-extrabold shadow-sm hover:shadow transition-all cursor-pointer flex-shrink-0"
                      title="Enviar consulta o comprar vía WhatsApp (walink.co/qzd099)"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Comprar por WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>
                  </div>

                  {/* Message preview snippet */}
                  <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white/80 border border-emerald-200/60 text-[11px] text-emerald-900">
                    <span className="font-mono truncate">
                      "{generarMensajeWhatsApp({ articulo: articuloDetalle, variante: selectedVariante || undefined })}"
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const msg = generarMensajeWhatsApp({ articulo: articuloDetalle, variante: selectedVariante || undefined });
                        navigator.clipboard?.writeText(msg);
                        mostrarToast('success', 'Texto copiado', 'Mensaje de consulta copiado al portapapeles.');
                      }}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 hover:text-emerald-950 flex-shrink-0 cursor-pointer"
                      title="Copiar texto de consulta"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-[#535456] pt-1">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    Actualizado: {formatDate(articuloDetalle.fechaActualizacion)}
                  </span>
                </div>
              </div>

            </div>

            {/* Complete Variants Matrix (Color × Size × Stock) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <LayersIcon className="w-4 h-4 text-[#2A5A29]" />
                  Existencias por Variante (Color + Talla Brasilera)
                </h3>
                <span className="text-xs text-[#535456] font-medium">
                  {articuloDetalle.variantes.length} combinaciones registradas
                </span>
              </div>

              {/* Variants table */}
              <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F0EEEF] border-b border-stone-200 text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-4">Color</th>
                      <th className="py-2.5 px-4">Talla (Prenda / Calzado BR)</th>
                      {isAdmin && <th className="py-2.5 px-4">Código SKU Variante</th>}
                      <th className="py-2.5 px-4 text-center">Estado</th>
                      {isAdmin && <th className="py-2.5 px-4 text-right">Existencias / Ajuste</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 bg-white">
                    {articuloDetalle.variantes.map((v) => {
                      const isSelected = selectedVariante?.id === v.id;

                      return (
                        <tr 
                          key={v.id} 
                          onClick={() => setSelectedVariante(isSelected ? null : v)}
                          className={`transition-colors cursor-pointer ${
                            isSelected 
                              ? 'bg-emerald-50/80 ring-1 ring-inset ring-emerald-400' 
                              : 'hover:bg-stone-50'
                          }`}
                          title={isAdmin ? undefined : (isSelected ? 'Variante seleccionada para WhatsApp (clic para deseleccionar)' : 'Haz clic para seleccionar esta variante para tu consulta de WhatsApp')}
                        >
                          {/* Color with visual bullet */}
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-2">
                              <span 
                                className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs flex-shrink-0" 
                                style={{ backgroundColor: v.colorHex || '#64748b' }}
                              />
                              <span className="font-bold text-stone-800">{v.color}</span>
                              {isSelected && (
                                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                                  Elegido
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Size */}
                          <td className="py-2.5 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-extrabold bg-[#F0EEEF] text-stone-800 border border-stone-300">
                              {v.talla}
                            </span>
                          </td>

                          {/* SKU */}
                          {isAdmin && (
                            <td className="py-2.5 px-4 font-mono text-xs font-bold text-[#2A5A29]">
                              {v.sku || `${articuloDetalle.sku || 'MOR'}-${v.color.slice(0,3).toUpperCase()}-${v.talla}`}
                            </td>
                          )}

                          {/* Status */}
                          <td className="py-2.5 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#2A5A29]/10 text-[#2A5A29] border border-[#2A5A29]/20">
                              <CheckIcon className="w-3 h-3" />
                              {isAdmin ? `${v.cantidad} ${v.cantidad === 1 ? 'unidad' : 'unidades'}` : 'Disponible'}
                            </span>
                          </td>

                          {/* Inline Stock Adjustment Controls */}
                          {isAdmin && (
                            <td className="py-2.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="inline-flex items-center justify-end gap-1.5">
                                <button
                                  id={`btn-minus-${v.id}`}
                                  disabled={v.cantidad <= 0}
                                  onClick={() => actualizarStockVariante(articuloDetalle.id, v.id, -1, true)}
                                  className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed text-stone-700 font-bold flex items-center justify-center transition-colors cursor-pointer"
                                  title="Restar 1 prenda"
                                >
                                  <MinusIcon className="w-3.5 h-3.5" />
                                </button>

                                <input
                                  type="number"
                                  min="0"
                                  value={v.cantidad}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    if (!isNaN(val) && val >= 0) {
                                      actualizarStockVariante(articuloDetalle.id, v.id, val, false);
                                    }
                                  }}
                                  className="w-14 text-center py-1 px-1 bg-white border border-stone-300 rounded-lg font-bold text-stone-900 text-xs focus:outline-none focus:ring-1 focus:ring-[#2A5A29]"
                                />

                                <button
                                  id={`btn-plus-${v.id}`}
                                  onClick={() => actualizarStockVariante(articuloDetalle.id, v.id, 1, true)}
                                  className="w-7 h-7 rounded-lg bg-[#2A5A29]/10 hover:bg-[#2A5A29]/20 text-[#2A5A29] font-bold flex items-center justify-center transition-colors cursor-pointer"
                                  title="Sumar 1 prenda"
                                >
                                  <PlusIcon className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3.5 border-t border-stone-200 bg-[#F0EEEF] flex flex-wrap items-center justify-between gap-3">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSellAction}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2A5A29] hover:bg-[#1e421d] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <SellIcon className="w-3.5 h-3.5" />
                  <span>Marcar como Vendido (Bs.)</span>
                </button>

                <a
                  href={MORELI_WALINK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppAction}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  title="Probar consulta de cliente en WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span className="hidden sm:inline">Probar WhatsApp</span>
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  id="btn-footer-comprar-whatsapp"
                  href={MORELI_WALINK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppAction}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
                  title="Comprar o consultar disponibilidad vía WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Comprar por WhatsApp ({formatBolivianos(articuloDetalle.precio)})</span>
                </a>
              </div>
            )}

            <button
              onClick={() => setArticuloDetalle(null)}
              className="px-4 py-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
