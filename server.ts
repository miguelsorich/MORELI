import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { ARTICULOS_INICIALES, CATEGORIAS_DEFAULT, VENTAS_INICIALES } from './src/data/initialData';
import { Articulo, Venta } from './src/types/inventory';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'inventory-db.json');

interface InventoryDB {
  articulos: Articulo[];
  categorias: string[];
  ventas: Venta[];
  version: number;
  lastUpdated: string;
}

// Ensure database directory and file exist with initial data
function getDatabase(): InventoryDB {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content) as InventoryDB;
      if (parsed && Array.isArray(parsed.articulos)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error reading inventory DB, reinitializing:', error);
  }

  // Seed default database
  const initialDB: InventoryDB = {
    articulos: ARTICULOS_INICIALES,
    categorias: CATEGORIAS_DEFAULT,
    ventas: VENTAS_INICIALES,
    version: 1,
    lastUpdated: new Date().toISOString()
  };

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error seeding initial inventory DB:', err);
  }

  return initialDB;
}

function saveDatabase(db: InventoryDB): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    db.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving inventory DB:', error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support JSON bodies up to 50MB (for optimized base64 photos)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // --- API ROUTES FIRST ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Get full inventory (accessible to both Admin and Buyers)
  app.get('/api/inventario', (req, res) => {
    try {
      const db = getDatabase();
      res.json({
        success: true,
        articulos: db.articulos,
        categorias: db.categorias,
        ventas: db.ventas,
        lastUpdated: db.lastUpdated
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error retrieving inventory' });
    }
  });

  // Update a single article (including photo, stock, variants, details)
  app.put('/api/inventario/articulo/:id', (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const db = getDatabase();

      const index = db.articulos.findIndex(a => a.id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Article not found' });
      }

      const existing = db.articulos[index];
      const updatedArticle: Articulo = {
        ...existing,
        ...updates,
        id: existing.id, // Preserve ID
        fechaActualizacion: new Date().toISOString()
      };

      db.articulos[index] = updatedArticle;
      saveDatabase(db);

      res.json({
        success: true,
        articulo: updatedArticle,
        message: 'Artículo actualizado correctamente'
      });
    } catch (err) {
      console.error('Error updating article:', err);
      res.status(500).json({ success: false, message: 'Error updating article' });
    }
  });

  // Create a new article
  app.post('/api/inventario/articulo', (req, res) => {
    try {
      const nuevoArticulo: Articulo = req.body;
      if (!nuevoArticulo || !nuevoArticulo.id) {
        return res.status(400).json({ success: false, message: 'Invalid article data' });
      }

      const db = getDatabase();
      db.articulos.unshift(nuevoArticulo);

      if (nuevoArticulo.categoria && !db.categorias.includes(nuevoArticulo.categoria)) {
        db.categorias.push(nuevoArticulo.categoria);
      }

      saveDatabase(db);

      res.json({ success: true, articulo: nuevoArticulo });
    } catch (err) {
      console.error('Error creating article:', err);
      res.status(500).json({ success: false, message: 'Error creating article' });
    }
  });

  // Delete an article
  app.delete('/api/inventario/articulo/:id', (req, res) => {
    try {
      const { id } = req.params;
      const db = getDatabase();

      db.articulos = db.articulos.filter(a => a.id !== id);
      saveDatabase(db);

      res.json({ success: true, message: 'Artículo eliminado' });
    } catch (err) {
      console.error('Error deleting article:', err);
      res.status(500).json({ success: false, message: 'Error deleting article' });
    }
  });

  // Register sale
  app.post('/api/inventario/venta', (req, res) => {
    try {
      const { venta, articuloId, varianteId, cantidadVendida } = req.body;
      const db = getDatabase();

      if (venta) {
        db.ventas.unshift(venta);
      }

      if (articuloId && varianteId && cantidadVendida) {
        const artIndex = db.articulos.findIndex(a => a.id === articuloId);
        if (artIndex !== -1) {
          const art = db.articulos[artIndex];
          art.variantes = art.variantes
            .map(v => v.id === varianteId ? { ...v, cantidad: Math.max(0, v.cantidad - cantidadVendida) } : v)
            .filter(v => v.cantidad > 0);

          const totalStock = art.variantes.reduce((sum, v) => sum + (v.cantidad || 0), 0);
          if (totalStock === 0) {
            db.articulos.splice(artIndex, 1);
          } else {
            art.fechaActualizacion = new Date().toISOString();
          }
        }
      }

      saveDatabase(db);
      res.json({ success: true, ventas: db.ventas, articulos: db.articulos });
    } catch (err) {
      console.error('Error recording sale:', err);
      res.status(500).json({ success: false, message: 'Error recording sale' });
    }
  });

  // Bulk sync (e.g. after Excel import or restore)
  app.post('/api/inventario/sync', (req, res) => {
    try {
      const { articulos, categorias, ventas } = req.body;
      const db = getDatabase();

      if (Array.isArray(articulos)) db.articulos = articulos;
      if (Array.isArray(categorias)) db.categorias = categorias;
      if (Array.isArray(ventas)) db.ventas = ventas;

      saveDatabase(db);
      res.json({ success: true, message: 'Inventario sincronizado' });
    } catch (err) {
      console.error('Error syncing inventory:', err);
      res.status(500).json({ success: false, message: 'Error syncing inventory' });
    }
  });

  // Reset to default sample catalog
  app.post('/api/inventario/reset', (req, res) => {
    try {
      const freshDB: InventoryDB = {
        articulos: ARTICULOS_INICIALES,
        categorias: CATEGORIAS_DEFAULT,
        ventas: VENTAS_INICIALES,
        version: 1,
        lastUpdated: new Date().toISOString()
      };
      saveDatabase(freshDB);
      res.json({ success: true, ...freshDB });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error resetting database' });
    }
  });

  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Moreli server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Moreli server:', err);
});
