import React, { useState, useEffect, useRef } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Variante } from '../types/inventory';
import { COLORES_PRESET, GRUPOS_TALLAS } from '../data/initialData';
import { 
  generateAutoProductSku, 
  generateAutoVariantSku, 
  getHexForColor 
} from '../utils/inventoryUtils';
import { compressImage } from '../utils/imageCompression';
import { 
  X, 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Layers, 
  Sparkles, 
  AlertCircle,
  Check,
  Tag,
  Palette,
  Ruler,
  RefreshCw,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductFormModal: React.FC = () => {
  const { 
    isModalCrearOpen, 
    setIsModalCrearOpen, 
    articuloEdicion, 
    setArticuloEdicion,
    categorias,
    agregarCategoria,
    crearArticulo,
    actualizarArticulo,
    articulos,
    mostrarToast
  } = useInventory();

  const isEditing = Boolean(articuloEdicion);
  const isOpen = isModalCrearOpen || isEditing;

  // Form State
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [nuevaCategoriaInput, setNuevaCategoriaInput] = useState('');
  const [mostrarNuevaCategoria, setMostrarNuevaCategoria] = useState(false);
  const [precio, setPrecio] = useState<number | string>('');
  const [sku, setSku] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState('');
  const [fotoUrlInput, setFotoUrlInput] = useState('');
  const [mostrarUrlInput, setMostrarUrlInput] = useState(false);
  
  // Variants list
  const [variantes, setVariantes] = useState<Variante[]>([]);

  // Manual single variant adder
  const [singleColor, setSingleColor] = useState('Verde Jungla');
  const [singleColorHex, setSingleColorHex] = useState('#2A5A29');
  const [singleTalla, setSingleTalla] = useState('M');
  const [singleCantidad, setSingleCantidad] = useState<number>(1);

  // Multi-variant generator state
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [selectedColorsGen, setSelectedColorsGen] = useState<typeof COLORES_PRESET>([]);
  const [selectedSizesGen, setSelectedSizesGen] = useState<string[]>(['S', 'M', 'L']);
  const [sizeGroupType, setSizeGroupType] = useState<'prendas' | 'pantalones' | 'calzado' | 'general'>('prendas');
  const [defaultGenStock, setDefaultGenStock] = useState<number>(1);

  // Drag & drop file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Validation error state
  const [errores, setErrores] = useState<Record<string, string>>({});

  // Trigger automatic SKU generation
  const handleRegenerateSku = (targetCategoria?: string) => {
    const cat = targetCategoria || categoria || (categorias[0] || 'ART');
    const autoSku = generateAutoProductSku(cat, articulos);
    setSku(autoSku);
  };

  // Reset or initialize form when opened
  useEffect(() => {
    if (articuloEdicion) {
      setNombre(articuloEdicion.nombre);
      setCategoria(articuloEdicion.categoria);
      setPrecio(articuloEdicion.precio);
      setSku(articuloEdicion.sku || generateAutoProductSku(articuloEdicion.categoria, articulos));
      setDescripcion(articuloEdicion.descripcion || '');
      setFoto(articuloEdicion.foto || '');
      setFotoUrlInput('');
      setVariantes([...articuloEdicion.variantes]);
      setErrores({});
    } else if (isModalCrearOpen) {
      const defaultCat = categorias[0] || 'Blusas';
      setNombre('');
      setCategoria(defaultCat);
      setPrecio(180);
      const initialAutoSku = generateAutoProductSku(defaultCat, articulos);
      setSku(initialAutoSku);
      setDescripcion('');
      setFoto('');
      setFotoUrlInput('');
      // Default initial variants for boutique single-item model
      setVariantes([
        { 
          id: `var-init-1`, 
          color: 'Blanco Crudo', 
          colorHex: '#F0EEEF', 
          talla: 'S', 
          cantidad: 1,
          sku: generateAutoVariantSku(initialAutoSku, 'Blanco Crudo', 'S')
        },
        { 
          id: `var-init-2`, 
          color: 'Verde Jungla', 
          colorHex: '#2A5A29', 
          talla: 'M', 
          cantidad: 1,
          sku: generateAutoVariantSku(initialAutoSku, 'Verde Jungla', 'M')
        }
      ]);
      setErrores({});
    }
  }, [articuloEdicion, isModalCrearOpen, categorias, articulos]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsModalCrearOpen(false);
    setArticuloEdicion(null);
    setErrores({});
  };

  // Image Upload handler (Data URL base64 with compression)
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      mostrarToast('error', 'Formato inválido', 'Por favor selecciona un archivo de imagen (PNG, JPG, WebP).');
      return;
    }
    try {
      mostrarToast('info', 'Optimizando foto...', 'Preparando imagen para visualización rápida...');
      const compressed = await compressImage(file, 1200, 0.82);
      setFoto(compressed);
      mostrarToast('success', 'Foto lista', 'La imagen fue cargada correctamente.');
    } catch (err) {
      console.error('Error compressing upload in form:', err);
      mostrarToast('error', 'Error al cargar', 'No se pudo procesar la imagen seleccionada.');
    }
  };

  // Add a single variant
  const handleAddSingleVariant = () => {
    if (!singleColor.trim() || !singleTalla.trim()) {
      mostrarToast('warning', 'Campos incompletos', 'Selecciona o escribe un color y una talla.');
      return;
    }

    const duplicate = variantes.some(
      v => v.color.toLowerCase() === singleColor.trim().toLowerCase() &&
           v.talla.toLowerCase() === singleTalla.trim().toLowerCase()
    );

    if (duplicate) {
      mostrarToast('warning', 'Variante ya existe', `La combinación ${singleColor} - Talla ${singleTalla} ya está en la lista.`);
      return;
    }

    const currentSku = sku || generateAutoProductSku(categoria, articulos);
    const nuevaVariante: Variante = {
      id: `var-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      color: singleColor.trim(),
      colorHex: singleColorHex || getHexForColor(singleColor.trim()),
      talla: singleTalla.trim(),
      cantidad: Math.max(0, singleCantidad || 0),
      sku: generateAutoVariantSku(currentSku, singleColor.trim(), singleTalla.trim())
    };

    setVariantes(prev => [...prev, nuevaVariante]);
    setSingleCantidad(1);
  };

  // Multi-variant generator action
  const handleGenerateMatrix = () => {
    if (selectedColorsGen.length === 0) {
      mostrarToast('warning', 'Sin colores', 'Selecciona al menos un color para el generador.');
      return;
    }
    if (selectedSizesGen.length === 0) {
      mostrarToast('warning', 'Sin tallas', 'Selecciona al menos una talla para el generador.');
      return;
    }

    const currentSku = sku || generateAutoProductSku(categoria, articulos);
    const nuevas: Variante[] = [];
    let añadidos = 0;

    selectedColorsGen.forEach(col => {
      selectedSizesGen.forEach(tal => {
        const existe = variantes.some(
          v => v.color.toLowerCase() === col.nombre.toLowerCase() &&
               v.talla.toLowerCase() === tal.toLowerCase()
        );
        if (!existe) {
          nuevas.push({
            id: `var-gen-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}-${añadidos}`,
            color: col.nombre,
            colorHex: col.hex,
            talla: tal,
            cantidad: Math.max(0, defaultGenStock || 0),
            sku: generateAutoVariantSku(currentSku, col.nombre, tal)
          });
          añadidos++;
        }
      });
    });

    if (nuevas.length === 0) {
      mostrarToast('info', 'Variantes ya existentes', 'Todas las combinaciones seleccionadas ya estaban en la lista.');
    } else {
      setVariantes(prev => [...prev, ...nuevas]);
      mostrarToast('success', 'Variantes generadas', `Se agregaron ${nuevas.length} combinaciones con código automático.`);
    }

    setIsGeneratorOpen(false);
  };

  // Remove a variant
  const handleRemoveVariant = (id: string) => {
    if (variantes.length <= 1) {
      mostrarToast('warning', 'Mínimo requerido', 'El producto debe conservar al menos 1 variante.');
      return;
    }
    setVariantes(prev => prev.filter(v => v.id !== id));
  };

  // Save product
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevosErrores: Record<string, string> = {};

    if (!nombre.trim()) nuevosErrores.nombre = 'El nombre del producto es obligatorio.';
    if (!categoria.trim()) nuevosErrores.categoria = 'La categoría es obligatoria.';
    if (precio === '' || Number(precio) < 0 || isNaN(Number(precio))) {
      nuevosErrores.precio = 'El precio debe ser un número mayor o igual a 0 en Bs.';
    }
    if (variantes.length === 0) {
      nuevosErrores.variantes = 'Debes incluir al menos una combinación de color y talla.';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      mostrarToast('error', 'Formulario incompleto', 'Por favor revisa los campos señalados en rojo.');
      return;
    }

    const finalSku = (sku && sku.trim().length > 0) 
      ? sku.trim().toUpperCase() 
      : generateAutoProductSku(categoria.trim(), articulos);

    if (isEditing && articuloEdicion) {
      const exito = actualizarArticulo(articuloEdicion.id, {
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        precio: Number(precio),
        sku: finalSku,
        descripcion: descripcion.trim() || undefined,
        foto: foto.trim() || undefined,
        variantes
      });
      if (exito) handleClose();
    } else {
      const exito = crearArticulo({
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        precio: Number(precio),
        sku: finalSku,
        descripcion: descripcion.trim() || undefined,
        foto: foto.trim() || undefined,
        variantes
      });
      if (exito) handleClose();
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="modal-formulario-producto-overlay" 
        className="fixed inset-0 z-50 bg-[#2A5A29]/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          id="modal-formulario-producto-content"
          className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto"
        >
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#F0EEEF]">
            <div>
              <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
                <span>{isEditing ? 'Editar Artículo Moreli' : 'Nuevo Artículo de Inventario Moreli'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2A5A29]/10 text-[#2A5A29]">
                  Moneda: Bs.
                </span>
              </h2>
              <p className="text-xs text-[#535456]">
                Registra la prenda, código automático y combinaciones de color y tallas brasileras
              </p>
            </div>

            <button
              id="btn-form-cerrar"
              onClick={handleClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* SECTION 1: General Product Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#2A5A29] uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-100 pb-2">
                <Tag className="w-3.5 h-3.5 text-[#9F7652]" />
                1. Información Principal del Producto
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Nombre */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nombre del Producto / Prenda <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-form-nombre"
                    type="text"
                    required
                    placeholder="Ej. Blusa Moreli Lino Silvestre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className={`w-full text-sm px-3 py-2 bg-stone-50 border rounded-xl focus:outline-none focus:bg-white transition-colors ${
                      errores.nombre ? 'border-rose-400 focus:ring-1 focus:ring-rose-500' : 'border-stone-300 focus:ring-1 focus:ring-[#2A5A29]'
                    }`}
                  />
                  {errores.nombre && <p className="text-[11px] text-rose-500 mt-1">{errores.nombre}</p>}
                </div>

                {/* SKU Automático */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-[#9F7652]" />
                      Código / SKU Automático
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRegenerateSku()}
                      className="text-[11px] font-medium text-[#2A5A29] hover:underline flex items-center gap-0.5 cursor-pointer"
                      title="Regenerar código automático"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Auto</span>
                    </button>
                  </div>
                  <input
                    id="input-form-sku"
                    type="text"
                    placeholder="Ej. MOR-BLU-001"
                    value={sku}
                    onChange={(e) => setSku(e.target.value.toUpperCase())}
                    className="w-full text-sm px-3 py-2 bg-[#F0EEEF]/60 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2A5A29] focus:bg-white font-mono uppercase font-bold text-[#2A5A29]"
                  />
                  <span className="text-[10px] text-[#535456] mt-0.5 block">
                    Generado automáticamente según categoría
                  </span>
                </div>

                {/* Categoría */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-700">
                      Categoría <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setMostrarNuevaCategoria(!mostrarNuevaCategoria)}
                      className="text-[11px] font-medium text-[#2A5A29] hover:underline cursor-pointer"
                    >
                      {mostrarNuevaCategoria ? 'Elegir existente' : '+ Crear nueva'}
                    </button>
                  </div>

                  {mostrarNuevaCategoria ? (
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Nueva categoría..."
                        value={nuevaCategoriaInput}
                        onChange={(e) => setNuevaCategoriaInput(e.target.value)}
                        className="flex-1 text-sm px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2A5A29] focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (nuevaCategoriaInput.trim()) {
                            agregarCategoria(nuevaCategoriaInput.trim());
                            setCategoria(nuevaCategoriaInput.trim());
                            handleRegenerateSku(nuevaCategoriaInput.trim());
                            setNuevaCategoriaInput('');
                            setMostrarNuevaCategoria(false);
                          }
                        }}
                        className="px-3 py-2 bg-[#2A5A29] hover:bg-[#1e421d] text-white rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Añadir
                      </button>
                    </div>
                  ) : (
                    <select
                      id="select-form-categoria"
                      value={categoria}
                      onChange={(e) => {
                        setCategoria(e.target.value);
                        if (!isEditing) handleRegenerateSku(e.target.value);
                      }}
                      className="w-full text-sm px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2A5A29] focus:bg-white font-medium text-stone-800 cursor-pointer"
                    >
                      {categorias.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Precio en Bolivianos */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Precio Unitario (Bs.) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-bold text-[#2A5A29]">
                      Bs.
                    </span>
                    <input
                      id="input-form-precio"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      placeholder="0.00"
                      value={precio}
                      onChange={(e) => setPrecio(e.target.value)}
                      className="w-full text-sm pl-10 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2A5A29] focus:bg-white font-bold text-stone-900"
                    />
                  </div>
                  {errores.precio && <p className="text-[11px] text-rose-500 mt-1">{errores.precio}</p>}
                </div>

                {/* Descripción */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Descripción / Detalles de la Prenda <span className="text-[#535456] font-normal">(Opcional)</span>
                  </label>
                  <textarea
                    id="input-form-descripcion"
                    rows={2}
                    placeholder="Materiales, corte, cuidados, estilo o recomendaciones de uso..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full text-sm px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2A5A29] focus:bg-white resize-none"
                  />
                </div>

              </div>
            </div>

            {/* SECTION 2: Optional Photo Upload */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <h3 className="text-xs font-bold text-[#2A5A29] uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#9F7652]" />
                  2. Fotografía de la Prenda
                </h3>
                <span className="text-[11px] font-semibold text-[#2A5A29] bg-[#2A5A29]/10 px-2 py-0.5 rounded-lg border border-[#2A5A29]/20">
                  Opcional (no obligatorio)
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                
                {/* Photo Preview / Placeholder */}
                <div className="w-28 h-28 rounded-2xl bg-[#F0EEEF] border border-stone-200 overflow-hidden flex-shrink-0 flex items-center justify-center relative group">
                  {foto ? (
                    <>
                      <img
                        src={foto}
                        alt="Vista previa"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => { setFoto(''); setFotoUrlInput(''); }}
                        className="absolute top-1 right-1 p-1 rounded-full bg-stone-900/80 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                        title="Quitar foto"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-2 text-stone-400">
                      <ImageIcon className="w-7 h-7 mx-auto mb-1 stroke-[1.5]" />
                      <span className="text-[10px] block leading-tight text-[#535456]">Sin foto</span>
                    </div>
                  )}
                </div>

                {/* Upload & URL Controls */}
                <div className="flex-1 min-w-0 space-y-2">
                  
                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files?.[0]) {
                        handleFileUpload(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-3.5 text-center cursor-pointer transition-colors ${
                      isDragging 
                        ? 'border-[#2A5A29] bg-[#2A5A29]/10' 
                        : 'border-stone-300 hover:border-[#2A5A29] bg-[#F0EEEF]/40'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                    />
                    <Upload className="w-4 h-4 mx-auto text-[#2A5A29] mb-1" />
                    <p className="text-xs font-semibold text-stone-700">
                      Haz clic para subir o arrastra una imagen aquí
                    </p>
                    <p className="text-[11px] text-[#535456] mt-0.5">
                      PNG, JPG o WebP
                    </p>
                  </div>

                  {/* Toggle Image URL Input */}
                  <div>
                    {!mostrarUrlInput ? (
                      <button
                        type="button"
                        onClick={() => setMostrarUrlInput(true)}
                        className="text-xs text-[#2A5A29] hover:underline font-medium cursor-pointer"
                      >
                        + O ingresar enlace web (URL) de la imagen
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://ejemplo.com/foto-moreli.jpg"
                          value={fotoUrlInput}
                          onChange={(e) => setFotoUrlInput(e.target.value)}
                          className="flex-1 text-xs px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2A5A29]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (fotoUrlInput.trim()) {
                              setFoto(fotoUrlInput.trim());
                            }
                          }}
                          className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-medium cursor-pointer"
                        >
                          Aplicar URL
                        </button>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </div>

            {/* SECTION 3: Variants Management (Color + Talla Brasilera + Cantidad) */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2">
                <div>
                  <h3 className="text-xs font-bold text-[#2A5A29] uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#9F7652]" />
                    3. Variantes de Producto (Color + Talla Brasilera + Stock)
                  </h3>
                  <p className="text-xs text-[#535456] mt-0.5">
                    Gestiona combinaciones de color y tallas brasileras para calzado (34, 36, 38...) o prendas
                  </p>
                </div>

                <button
                  type="button"
                  id="btn-abrir-generador-matriz"
                  onClick={() => setIsGeneratorOpen(!isGeneratorOpen)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2A5A29]/10 hover:bg-[#2A5A29]/20 text-[#2A5A29] border border-[#2A5A29]/20 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratorOpen ? 'Cerrar generador' : 'Generador Rápido de Matriz'}</span>
                </button>
              </div>

              {/* Multi-variant Matrix Generator Panel */}
              {isGeneratorOpen && (
                <div className="bg-[#F0EEEF] border border-[#B89C71]/40 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#2A5A29]" />
                      Generador Automático de Combinaciones
                    </span>
                    <span className="text-[11px] text-[#9F7652] font-semibold">
                      Multiplica colores seleccionados por tallas
                    </span>
                  </div>

                  {/* 1. Select Colors */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                      <Palette className="w-3 h-3 text-[#2A5A29]" />
                      Selecciona los colores disponibles (Paleta Moreli y Básicos):
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {COLORES_PRESET.map(c => {
                        const isSelected = selectedColorsGen.some(sc => sc.nombre === c.nombre);
                        return (
                          <button
                            key={c.nombre}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedColorsGen(prev => prev.filter(sc => sc.nombre !== c.nombre));
                              } else {
                                setSelectedColorsGen(prev => [...prev, c]);
                              }
                            }}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#2A5A29] text-white border-[#2A5A29] shadow-xs'
                                : 'bg-white text-stone-700 border-stone-200 hover:border-[#2A5A29]'
                            }`}
                          >
                            <span 
                              className="w-2.5 h-2.5 rounded-full border border-black/15" 
                              style={{ backgroundColor: c.hex }} 
                            />
                            <span>{c.nombre}</span>
                            {isSelected && <Check className="w-3 h-3" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Select Sizes with Brazilian Footwear Category */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-semibold text-stone-700 flex items-center gap-1">
                        <Ruler className="w-3 h-3 text-[#9F7652]" />
                        Selecciona el tipo de tallas:
                      </label>
                      <div className="flex gap-1">
                        {(['prendas', 'pantalones', 'calzado', 'general'] as const).map(g => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => {
                              setSizeGroupType(g);
                              setSelectedSizesGen(GRUPOS_TALLAS[g]);
                            }}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                              sizeGroupType === g 
                                ? 'bg-[#2A5A29] text-white' 
                                : 'bg-white text-stone-600 border border-stone-200'
                            }`}
                          >
                            {g === 'calzado' ? 'Calzado (Tallas BR)' : g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {GRUPOS_TALLAS[sizeGroupType].map(sz => {
                        const isSelected = selectedSizesGen.includes(sz);
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedSizesGen(prev => prev.filter(s => s !== sz));
                              } else {
                                setSelectedSizesGen(prev => [...prev, sz]);
                              }
                            }}
                            className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-stone-900 text-white border-stone-900'
                                : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                            }`}
                          >
                            {sizeGroupType === 'calzado' ? `BR ${sz}` : sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Default Stock per Variant & Action */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-200">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-stone-700">
                        Cantidad inicial por prenda:
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={defaultGenStock}
                        onChange={(e) => setDefaultGenStock(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-16 text-center text-xs py-1 px-2 bg-white border border-stone-300 rounded-lg font-bold"
                      />
                      <span className="text-[11px] text-[#535456]">(Generalmente 1 unidad)</span>
                    </div>

                    <button
                      type="button"
                      id="btn-generar-combinaciones-action"
                      onClick={handleGenerateMatrix}
                      className="px-4 py-2 bg-[#2A5A29] hover:bg-[#1e421d] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Generar {selectedColorsGen.length * selectedSizesGen.length} Combinaciones</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Single Variant Quick Manual Row Adder */}
              <div className="p-3.5 bg-[#F0EEEF] border border-stone-200 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-stone-700 block">
                  Añadir combinación individual de variante:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 items-end">
                  {/* Color */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#535456] mb-1">Color</label>
                    <select
                      value={singleColor}
                      onChange={(e) => {
                        const col = COLORES_PRESET.find(c => c.nombre === e.target.value);
                        setSingleColor(e.target.value);
                        if (col) setSingleColorHex(col.hex);
                      }}
                      className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded-xl text-stone-800 font-medium cursor-pointer"
                    >
                      {COLORES_PRESET.map(c => (
                        <option key={c.nombre} value={c.nombre}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>

                  {/* Talla */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#535456] mb-1">Talla (Ej. M o 36 BR)</label>
                    <input
                      type="text"
                      placeholder="S, M, 34, 36, 38..."
                      value={singleTalla}
                      onChange={(e) => setSingleTalla(e.target.value.toUpperCase())}
                      className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded-xl text-stone-800 font-bold uppercase"
                    />
                  </div>

                  {/* Cantidad */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#535456] mb-1">Cantidad</label>
                    <input
                      type="number"
                      min="0"
                      value={singleCantidad}
                      onChange={(e) => setSingleCantidad(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded-xl font-bold text-stone-800"
                    />
                  </div>

                  {/* Add Button */}
                  <div>
                    <button
                      type="button"
                      id="btn-agregar-variante-individual"
                      onClick={handleAddSingleVariant}
                      className="w-full py-1.5 px-3 bg-[#9F7652] hover:bg-[#855f3f] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Variants Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-700">
                    Combinaciones Registradas ({variantes.length})
                  </span>
                  <span className="text-xs text-[#535456] font-medium">
                    Total: <strong className="text-stone-900">{variantes.reduce((sum, v) => sum + (Number(v.cantidad) || 0), 0)}</strong> prendas
                  </span>
                </div>

                <div className="border border-stone-200 rounded-2xl overflow-hidden max-h-56 overflow-y-auto scrollbar-thin">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F0EEEF] border-b border-stone-200 text-[11px] font-bold text-stone-700 uppercase sticky top-0">
                      <tr>
                        <th className="py-2 px-3">Color</th>
                        <th className="py-2 px-3">Talla</th>
                        <th className="py-2 px-3">Código Variante</th>
                        <th className="py-2 px-3 text-center">Cantidad en Stock</th>
                        <th className="py-2 px-3 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 bg-white">
                      {variantes.map((v, index) => (
                        <tr key={v.id} className="hover:bg-stone-50">
                          {/* Color */}
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-2">
                              <span 
                                className="w-3 h-3 rounded-full border border-black/15 shadow-2xs" 
                                style={{ backgroundColor: v.colorHex || getHexForColor(v.color) }}
                              />
                              <span className="font-semibold text-stone-800">{v.color}</span>
                            </div>
                          </td>

                          {/* Talla */}
                          <td className="py-2 px-3 font-bold text-stone-800">
                            <span className="px-2 py-0.5 rounded bg-[#F0EEEF] border border-stone-300">
                              {v.talla}
                            </span>
                          </td>

                          {/* SKU */}
                          <td className="py-2 px-3 font-mono text-[11px] text-[#2A5A29]">
                            {v.sku || generateAutoVariantSku(sku || 'MOR-ART-001', v.color, v.talla)}
                          </td>

                          {/* Cantidad editable */}
                          <td className="py-2 px-3 text-center">
                            <input
                              type="number"
                              min="0"
                              value={v.cantidad}
                              onChange={(e) => {
                                const val = Math.max(0, parseInt(e.target.value) || 0);
                                setVariantes(prev => prev.map((item, i) => i === index ? { ...item, cantidad: val } : item));
                              }}
                              className="w-16 text-center py-0.5 px-1 bg-white border border-stone-300 rounded-lg font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#2A5A29]"
                            />
                          </td>

                          {/* Delete */}
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(v.id)}
                              className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                              title="Eliminar combinación"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {errores.variantes && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errores.variantes}
                  </p>
                )}
              </div>

            </div>

          </form>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-stone-200 bg-[#F0EEEF] flex items-center justify-between gap-3">
            <button
              type="button"
              id="btn-cancelar-formulario"
              onClick={handleClose}
              className="px-4 py-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              id="btn-guardar-articulo"
              onClick={handleSubmit}
              className="px-5 py-2 bg-[#2A5A29] hover:bg-[#1e421d] text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all cursor-pointer"
            >
              {isEditing ? 'Guardar Cambios' : 'Registrar Artículo Moreli'}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
