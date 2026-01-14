/* ============================================
   DATABASE SIMPLE - LocalStorage Manager
   Caja de Cristal PWA - Versión Simplificada
   ============================================ */

class SimpleDatabase {
    constructor() {
        this.storageKey = 'cajaDeCristal';
        this.data = {
            transacciones: [],
            socios: [],
            config: {}
        };
    }

    async init() {
        // Cargar datos desde localStorage
        const storedData = localStorage.getItem(this.storageKey);
        if (storedData) {
            try {
                this.data = JSON.parse(storedData);
                console.log('✅ Database loaded from localStorage');
            } catch (error) {
                console.error('Error loading data:', error);
            }
        }
        
        // Inicializar socios por defecto si no existen
        if (this.data.socios.length === 0) {
            await this.initDefaultSocios();
        }
        
        return Promise.resolve(this.data);
    }

    async initDefaultSocios() {
        const defaultSocios = [
            { 
                id: 1,
                nombre: 'Dr. Ángel Peralta', 
                avatar: 'https://www.genspark.ai/api/files/s/g4AanUit',
                deuda: 0,
                fijo: true
            },
            { 
                id: 2,
                nombre: 'Dra. Andrea Cano', 
                avatar: 'https://www.genspark.ai/api/files/s/mCiinVjN',
                deuda: 0,
                fijo: true
            },
            { 
                id: 3,
                nombre: 'Dra. Sandra Herrera', 
                avatar: 'https://www.genspark.ai/api/files/s/2wlTnIKZ',
                deuda: 0,
                fijo: true
            }
        ];

        this.data.socios = defaultSocios;
        this.save();
        console.log('✅ Default socios creados');
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            console.log('✅ Data saved');
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    // ============================================
    // TRANSACCIONES
    // ============================================

    async addTransaccion(transaccion) {
        const id = Date.now();
        const newTransaccion = {
            ...transaccion,
            id,
            createdAt: new Date().toISOString(),
            mes: transaccion.fechaFactura ? transaccion.fechaFactura.substring(0, 7) : new Date().toISOString().substring(0, 7)
        };
        
        this.data.transacciones.push(newTransaccion);
        this.save();
        return Promise.resolve(id);
    }

    async getTransacciones(filters = {}) {
        let results = [...this.data.transacciones];

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

        // Ordenar por fecha (más reciente primero)
        results.sort((a, b) => new Date(b.fechaFactura) - new Date(a.fechaFactura));

        return Promise.resolve(results);
    }

    async deleteTransaccion(id) {
        this.data.transacciones = this.data.transacciones.filter(t => t.id !== id);
        this.save();
        return Promise.resolve();
    }

    // ============================================
    // SOCIOS
    // ============================================

    async addSocio(socio) {
        const id = Date.now();
        const newSocio = {
            ...socio,
            id,
            createdAt: new Date().toISOString()
        };
        
        this.data.socios.push(newSocio);
        this.save();
        return Promise.resolve(id);
    }

    async getSocios() {
        return Promise.resolve([...this.data.socios]);
    }

    async updateSocio(id, updates) {
        const index = this.data.socios.findIndex(s => s.id === id);
        if (index !== -1) {
            this.data.socios[index] = {
                ...this.data.socios[index],
                ...updates
            };
            this.save();
        }
        return Promise.resolve();
    }

    async deleteSocio(id) {
        this.data.socios = this.data.socios.filter(s => s.id !== id);
        this.save();
        return Promise.resolve();
    }

    // ============================================
    // CALCULOS
    // ============================================

    async getKPIs() {
        const transacciones = await this.getTransacciones();
        const socios = await this.getSocios();

        let totalIngresos = 0;
        let totalEgresos = 0;
        let totalPendientes = 0;

        transacciones.forEach(t => {
            if (t.tipo === 'ingreso') {
                totalIngresos += parseFloat(t.monto) || 0;
            } else if (t.tipo === 'egreso') {
                totalEgresos += parseFloat(t.monto) || 0;
                if (t.estado === 'Pendiente') {
                    totalPendientes += parseFloat(t.monto) || 0;
                }
            }
        });

        const totalDeudaSocios = socios.reduce((sum, s) => sum + (parseFloat(s.deuda) || 0), 0);
        const cajaReal = totalIngresos - totalEgresos;

        return Promise.resolve({
            cajaReal,
            pendientes: totalPendientes,
            deudaSocios: totalDeudaSocios,
            ingresos: totalIngresos,
            egresos: totalEgresos
        });
    }

    // ============================================
    // BACKUP
    // ============================================

    async exportData() {
        return Promise.resolve(JSON.stringify(this.data, null, 2));
    }

    async importData(jsonData) {
        try {
            const imported = JSON.parse(jsonData);
            this.data = imported;
            this.save();
            return Promise.resolve(true);
        } catch (error) {
            console.error('Error importing data:', error);
            return Promise.reject(error);
        }
    }

    async clearAllData() {
        this.data = {
            transacciones: [],
            socios: [],
            config: {}
        };
        this.save();
        await this.initDefaultSocios();
        return Promise.resolve();
    }
}

// Global database instance
const db = new SimpleDatabase();
