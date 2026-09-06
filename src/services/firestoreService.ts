import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  writeBatch,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Articulo, Venta } from '../types/inventory';
import { ARTICULOS_INICIALES, CATEGORIAS_DEFAULT, VENTAS_INICIALES } from '../data/initialData';

const ARTICLES_COLLECTION = 'articulos';
const VENTAS_COLLECTION = 'ventas';
const CONFIG_COLLECTION = 'config';
const CATALOGO_CONFIG_DOC = 'catalogo';

/**
 * Initializes Firestore catalog if empty, seeding default 102 articles.
 */
export async function ensureFirestoreSeeded(): Promise<void> {
  try {
    const colRef = collection(db, ARTICLES_COLLECTION);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      console.log('Seeding initial Moreli catalog to Firestore...');
      const batch = writeBatch(db);
      for (const art of ARTICULOS_INICIALES) {
        const dRef = doc(db, ARTICLES_COLLECTION, art.id);
        batch.set(dRef, art);
      }
      const configRef = doc(db, CONFIG_COLLECTION, CATALOGO_CONFIG_DOC);
      batch.set(configRef, {
        categorias: CATEGORIAS_DEFAULT,
        lastUpdated: new Date().toISOString()
      });
      await batch.commit();
      console.log('Firestore seed completed successfully.');
    }
  } catch (err) {
    console.warn('Could not check or seed Firestore (offline or permission issue):', err);
  }
}

/**
 * Subscribes to real-time updates of the articles catalog.
 * When the admin updates a photo, all buyers receive the change immediately.
 */
export function subscribeToArticulos(
  onUpdate: (articulos: Articulo[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const colRef = collection(db, ARTICLES_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const items: Articulo[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as Articulo);
        });
        onUpdate(items);
      }
    },
    (error) => {
      console.warn('Error in Firestore real-time listener:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Subscribes to categories configuration
 */
export function subscribeToCategorias(
  onUpdate: (categorias: string[]) => void
): Unsubscribe {
  const configRef = doc(db, CONFIG_COLLECTION, CATALOGO_CONFIG_DOC);
  return onSnapshot(
    configRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.categorias) && data.categorias.length > 0) {
          onUpdate(data.categorias);
        }
      }
    },
    (err) => {
      console.warn('Error fetching categories from Firestore:', err);
    }
  );
}

/**
 * Subscribes to sales
 */
export function subscribeToVentas(
  onUpdate: (ventas: Venta[]) => void
): Unsubscribe {
  const colRef = collection(db, VENTAS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Venta[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Venta);
      });
      onUpdate(list);
    },
    (err) => {
      console.warn('Error fetching sales from Firestore:', err);
    }
  );
}

/**
 * Saves or updates an article in Firestore (including photo, variants, and stock)
 */
export async function saveArticuloFirestore(articulo: Articulo): Promise<void> {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, articulo.id);
    await setDoc(docRef, articulo, { merge: true });
  } catch (err) {
    console.error('Error saving article to Firestore:', err);
    throw err;
  }
}

/**
 * Deletes an article from Firestore
 */
export async function deleteArticuloFirestore(articuloId: string): Promise<void> {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, articuloId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting article from Firestore:', err);
    throw err;
  }
}

/**
 * Records a new sale in Firestore
 */
export async function saveVentaFirestore(venta: Venta): Promise<void> {
  try {
    const docRef = doc(db, VENTAS_COLLECTION, venta.id);
    await setDoc(docRef, venta);
  } catch (err) {
    console.error('Error saving sale to Firestore:', err);
  }
}

/**
 * Updates categories list in Firestore
 */
export async function saveCategoriasFirestore(categorias: string[]): Promise<void> {
  try {
    const docRef = doc(db, CONFIG_COLLECTION, CATALOGO_CONFIG_DOC);
    await setDoc(docRef, { categorias, lastUpdated: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.error('Error saving categories to Firestore:', err);
  }
}

/**
 * Full batch synchronization of catalog
 */
export async function syncBatchToFirestore(
  articulos: Articulo[],
  categorias: string[],
  ventas: Venta[]
): Promise<void> {
  try {
    const batch = writeBatch(db);
    for (const art of articulos) {
      const ref = doc(db, ARTICLES_COLLECTION, art.id);
      batch.set(ref, art, { merge: true });
    }
    const configRef = doc(db, CONFIG_COLLECTION, CATALOGO_CONFIG_DOC);
    batch.set(configRef, { categorias, lastUpdated: new Date().toISOString() }, { merge: true });

    for (const v of ventas) {
      const vRef = doc(db, VENTAS_COLLECTION, v.id);
      batch.set(vRef, v, { merge: true });
    }

    await batch.commit();
  } catch (err) {
    console.error('Error in batch sync to Firestore:', err);
  }
}
