import { Articulo, Variante } from '../types/inventory';

export const MORELI_WALINK_URL = 'https://walink.co/2bp3yl';

export interface WhatsAppInquiryPayload {
  articulo?: Articulo;
  variante?: Variante;
  talla?: string;
  color?: string;
}

/**
 * Prepares an inquiry message in Spanish for the buyer.
 */
export const generarMensajeWhatsApp = (payload?: WhatsAppInquiryPayload): string => {
  if (!payload || !payload.articulo) {
    return '¡Hola Moreli! Me comunico desde su catálogo virtual para consultar sobre las prendas y calzados disponibles.';
  }

  const { articulo, variante, talla, color } = payload;
  const selectedTalla = talla || variante?.talla;
  const selectedColor = color || variante?.color;

  let msg = `¡Hola Moreli! Me interesa comprar: "${articulo.nombre}"`;
  
  if (articulo.sku) {
    msg += ` (SKU: ${articulo.sku})`;
  }
  
  if (articulo.precio) {
    msg += ` por Bs. ${articulo.precio}`;
  }

  if (selectedColor) {
    msg += ` en color ${selectedColor}`;
  }

  if (selectedTalla) {
    msg += ` (Talla: ${selectedTalla})`;
  }

  msg += '. ¿Tienen disponibilidad para entrega o reserva? ¡Muchas gracias!';
  return msg;
};

/**
 * Copies the inquiry text to clipboard and opens walink.co/2bp3yl safely.
 */
export const ejecutarConsultaWhatsApp = (
  payload?: WhatsAppInquiryPayload, 
  onCopied?: (mensaje: string) => void
) => {
  const mensaje = generarMensajeWhatsApp(payload);

  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(mensaje).catch(() => {
      // Ignore clipboard write errors in restricted environments
    });
  }

  if (onCopied) {
    onCopied(mensaje);
  }
};
