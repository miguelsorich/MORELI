import React, { useState, useRef, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Lock, 
  X, 
  KeyRound, 
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminAuthModal: React.FC = () => {
  const { 
    isAdminAuthModalOpen, 
    setIsAdminAuthModalOpen, 
    loginAdmin 
  } = useInventory();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdminAuthModalOpen) {
      setPassword('');
      setError(false);
      setShowPassword(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isAdminAuthModalOpen]);

  if (!isAdminAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    const success = loginAdmin(password);
    if (success) {
      setIsAdminAuthModalOpen(false);
      setPassword('');
      setError(false);
    } else {
      setError(true);
      inputRef.current?.select();
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="modal-admin-auth-overlay"
        className="fixed inset-0 z-50 bg-[#2A5A29]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 10 }}
          transition={{ duration: 0.2 }}
          id="modal-admin-auth-content"
          className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-sm w-full overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#F0EEEF]">
            <div className="flex items-center gap-2 text-[#2A5A29]">
              <div className="w-8 h-8 rounded-xl bg-[#2A5A29]/10 border border-[#2A5A29]/20 flex items-center justify-center">
                <Lock className="w-4 h-4 text-[#2A5A29]" />
              </div>
              <span className="text-sm font-bold text-stone-900 font-sans">
                Acceso de Administración
              </span>
            </div>

            <button
              id="btn-cerrar-admin-auth"
              onClick={() => setIsAdminAuthModalOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="text-center space-y-1">
              <p className="text-xs text-[#535456]">
                Ingresa la contraseña autorizada para acceder al panel de inventario y ventas.
              </p>
            </div>

            <div className="space-y-1.5">
              <label 
                htmlFor="input-admin-password" 
                className="block text-[11px] font-bold uppercase tracking-wider text-stone-700"
              >
                Contraseña
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <KeyRound className="w-4 h-4" />
                </div>

                <input
                  ref={inputRef}
                  id="input-admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(false);
                  }}
                  placeholder="••••"
                  autoComplete="current-password"
                  className={`w-full pl-9 pr-10 py-2.5 bg-stone-50 border rounded-xl text-sm font-mono tracking-widest text-center text-stone-900 focus:outline-none focus:ring-2 transition-all ${
                    error 
                      ? 'border-rose-500 ring-rose-200 focus:ring-rose-400 bg-rose-50/50' 
                      : 'border-stone-200 focus:ring-[#2A5A29]/20 focus:border-[#2A5A29]'
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                  title={showPassword ? "Ocultar" : "Mostrar"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <p className="text-xs text-rose-600 font-medium text-center pt-1">
                  Contraseña incorrecta. Verifica e intenta nuevamente.
                </p>
              )}
            </div>

            {/* Quick 4-digit keypad helper or submit button */}
            <div className="pt-2">
              <button
                id="btn-submit-admin-auth"
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#2A5A29] hover:bg-[#1e421d] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#B89C71]" />
                <span>Ingresar al Sistema</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
