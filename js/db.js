/* ============================================
   DATABASE - IndexedDB Manager
   Caja de Cristal PWA
   ============================================ */

const DB_NAME = 'CajaDeCristalDB';
const DB_VERSION = 1;

class Database {
    constructor() {
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                console.log('✅ Database initialized');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Crear stores si no existen
                if (!db.objectStoreNames.contains('transacciones')) {
                    const transaccionesStore = db.createObjectStore('transacciones', {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    transaccionesStore.createIndex('tipo', 'tipo', { unique: false });
                    transaccionesStore.createIndex('fechaFactura', 'fechaFactura', { unique: false });
                    transaccionesStore.createIndex('mes', 'mes', { unique: false });
                    transaccionesStore.createIndex('estado', 'estado', { unique: false });
                }

                if (!db.objectStoreNames.contains('socios')) {
                    const sociosStore = db.createObjectStore('socios', {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    sociosStore.createIndex('nombre', 'nombre', { unique: false });
                }

                if (!db.objectStoreNames.contains('config')) {
                    db.createObjectStore('config', { keyPath: 'key' });
                }

                console.log('✅ Database schema created');
            };
        });
    }

    // ============================================
    // TRANSACCIONES
    // ============================================

    async addTransaccion(transaccion) {
        const tx = this.db.transaction(['transacciones'], 'readwrite');
        const store = tx.objectStore('transacciones');
        
        // Añadir metadata
        transaccion.createdAt = new Date().toISOString();
        transaccion.mes = transaccion.fechaFactura ? transaccion.fechaFactura.substring(0, 7) : new Date().toISOString().substring(0, 7); // YYYY-MM
        
        // Campos por defecto si no existen
        if (!transaccion.estado) transaccion.estado = 'Completado';
        if (!transaccion.fechaRecaudo) transaccion.fechaRecaudo = null;

        return new Promise((resolve, reject) => {
            const request = store.add(transaccion);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getTransacciones(filters = {}) {
        const tx = this.db.transaction(['transacciones'], 'readonly');
        const store = tx.objectStore('transacciones');

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => {
                let results = request.result;

                // Aplicar filtros
                if (filters.tipo) {
                    results = results.filter(t => t.tipo === filters.tipo);
                }
                if (filters.mes) {
                    results = results.filter(t => t.mes === filters.mes);
                }
                if (filters.search) {
                    const search = filters.search.toLowerCase();
                    results = results.filter(t =>
                        t.concepto.toLowerCase().includes(search) ||
                        t.categoria.toLowerCase().includes(search)
                    );
                }

                // Ordenar por fecha descendente
                results.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

                resolve(results);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async getTransaccion(id) {
        const tx = this.db.transaction(['transacciones'], 'readonly');
        const store = tx.objectStore('transacciones');

        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async updateTransaccion(id, data) {
        const tx = this.db.transaction(['transacciones'], 'readwrite');
        const store = tx.objectStore('transacciones');

        return new Promise((resolve, reject) => {
            const getRequest = store.get(id);
            getRequest.onsuccess = () => {
                const transaccion = getRequest.result;
                Object.assign(transaccion, data);
                transaccion.updatedAt = new Date().toISOString();

                const updateRequest = store.put(transaccion);
                updateRequest.onsuccess = () => resolve(updateRequest.result);
                updateRequest.onerror = () => reject(updateRequest.error);
            };
            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    async deleteTransaccion(id) {
        const tx = this.db.transaction(['transacciones'], 'readwrite');
        const store = tx.objectStore('transacciones');

        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // ============================================
    // SOCIOS
    // ============================================

    async addSocio(socio) {
        const tx = this.db.transaction(['socios'], 'readwrite');
        const store = tx.objectStore('socios');

        socio.createdAt = new Date().toISOString();
        socio.deuda = socio.deuda || 0;

        return new Promise((resolve, reject) => {
            const request = store.add(socio);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getSocios() {
        const tx = this.db.transaction(['socios'], 'readonly');
        const store = tx.objectStore('socios');

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => {
                const results = request.result;
                // Ordenar por nombre
                results.sort((a, b) => a.nombre.localeCompare(b.nombre));
                resolve(results);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async getSocio(id) {
        const tx = this.db.transaction(['socios'], 'readonly');
        const store = tx.objectStore('socios');

        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async updateSocio(id, data) {
        const tx = this.db.transaction(['socios'], 'readwrite');
        const store = tx.objectStore('socios');

        return new Promise((resolve, reject) => {
            const getRequest = store.get(id);
            getRequest.onsuccess = () => {
                const socio = getRequest.result;
                Object.assign(socio, data);
                socio.updatedAt = new Date().toISOString();

                const updateRequest = store.put(socio);
                updateRequest.onsuccess = () => resolve(updateRequest.result);
                updateRequest.onerror = () => reject(updateRequest.error);
            };
            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    async deleteSocio(id) {
        const tx = this.db.transaction(['socios'], 'readwrite');
        const store = tx.objectStore('socios');

        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // ============================================
    // CONFIG
    // ============================================

    async setConfig(key, value) {
        const tx = this.db.transaction(['config'], 'readwrite');
        const store = tx.objectStore('config');

        return new Promise((resolve, reject) => {
            const request = store.put({ key, value });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getConfig(key) {
        const tx = this.db.transaction(['config'], 'readonly');
        const store = tx.objectStore('config');

        return new Promise((resolve, reject) => {
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result?.value);
            request.onerror = () => reject(request.error);
        });
    }

    // ============================================
    // BACKUP & RESTORE
    // ============================================

    async exportData() {
        const transacciones = await this.getTransacciones();
        const socios = await this.getSocios();

        const backup = {
            version: DB_VERSION,
            exportDate: new Date().toISOString(),
            data: {
                transacciones,
                socios
            }
        };

        return backup;
    }

    async importData(backup) {
        if (!backup.data) throw new Error('Invalid backup format');

        // Limpiar datos existentes
        await this.clearAll();

        // Importar transacciones
        if (backup.data.transacciones) {
            for (const t of backup.data.transacciones) {
                delete t.id; // Dejar que se auto-genere
                await this.addTransaccion(t);
            }
        }

        // Importar socios
        if (backup.data.socios) {
            for (const s of backup.data.socios) {
                delete s.id; // Dejar que se auto-genere
                await this.addSocio(s);
            }
        }

        console.log('✅ Data imported successfully');
    }

    async clearAll() {
        const stores = ['transacciones', 'socios'];
        for (const storeName of stores) {
            const tx = this.db.transaction([storeName], 'readwrite');
            const store = tx.objectStore(storeName);
            await new Promise((resolve, reject) => {
                const request = store.clear();
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }
    }

    // ============================================
    // STATISTICS
    // ============================================

    async getStats() {
        const transacciones = await this.getTransacciones();
        const socios = await this.getSocios();

        const ingresos = transacciones
            .filter(t => t.tipo === 'ingreso')
            .reduce((sum, t) => sum + (t.monto || 0), 0);

        const egresos = transacciones
            .filter(t => t.tipo === 'egreso')
            .reduce((sum, t) => sum + (t.monto || 0), 0);

        const cajaReal = ingresos - egresos;

        const pendientes = transacciones
            .filter(t => t.tipo === 'egreso' && t.estado === 'pendiente')
            .reduce((sum, t) => sum + (t.monto || 0), 0);

        const deudaSocios = socios.reduce((sum, s) => sum + (s.deuda || 0), 0);

        return {
            cajaReal,
            pendientes,
            deudaSocios,
            totalTransacciones: transacciones.length,
            totalSocios: socios.length
        };
    }
}

// Instancia global
const db = new Database();
