/* ============================================
   APP SIMPLE - Main Application Logic
   Caja de Cristal PWA - Versión Simplificada
   ============================================ */

class CajaDeCristalApp {
    constructor() {
        this.currentView = 'dashboard';
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        console.log('🚀 Initializing Caja de Cristal...');

        // Initialize sound system
        sounds.init();

        // Initialize database
        await db.init();

        // Setup UI
        this.setupEventListeners();
        this.setupNavigation();

        // Load initial view
        await this.refreshDashboard();

        this.initialized = true;
        console.log('✅ App initialized');
    }

    setupEventListeners() {
        // Navigation toggle
        document.getElementById('nav-toggle')?.addEventListener('click', () => {
            sounds.playClick();
            document.getElementById('sidebar').classList.add('active');
        });

        document.getElementById('sidebar-close')?.addEventListener('click', () => {
            sounds.playClick();
            document.getElementById('sidebar').classList.remove('active');
        });

        // Nueva transacción
        document.getElementById('btn-nueva-transaccion')?.addEventListener('click', () => {
            sounds.playClick();
            this.showTransaccionModal();
        });

        // Nuevo socio
        document.getElementById('btn-nuevo-socio')?.addEventListener('click', () => {
            sounds.playClick();
            this.showSocioModal();
        });

        // Backup
        document.getElementById('btn-exportar')?.addEventListener('click', () => {
            sounds.playClick();
            this.exportBackup();
        });

        document.getElementById('btn-importar')?.addEventListener('click', () => {
            sounds.playClick();
            document.getElementById('file-importar').click();
        });

        document.getElementById('file-importar')?.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                this.importBackup(e.target.files[0]);
            }
        });

        // Filters
        document.getElementById('filter-tipo')?.addEventListener('change', () => {
            sounds.playClick();
            this.refreshTransacciones();
        });

        document.getElementById('filter-mes')?.addEventListener('change', () => {
            sounds.playClick();
            this.refreshTransacciones();
        });

        document.getElementById('filter-buscar')?.addEventListener('input', () => {
            this.refreshTransacciones();
        });

        // Close modal on overlay click
        document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') {
                sounds.playClick();
                this.closeModal();
            }
        });
    }

    setupNavigation() {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                sounds.playNavigate();
                const view = item.getAttribute('data-view');
                this.navigateTo(view);
            });
        });
    }

    navigateTo(view) {
        // Update menu
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-view') === view);
        });

        // Update views
        document.querySelectorAll('.view').forEach(v => {
            v.classList.remove('active');
        });
        document.getElementById(`view-${view}`)?.classList.add('active');

        // Close sidebar on mobile
        document.getElementById('sidebar')?.classList.remove('active');

        this.currentView = view;

        // Refresh data
        switch (view) {
            case 'dashboard':
                this.refreshDashboard();
                break;
            case 'transacciones':
                this.refreshTransacciones();
                break;
            case 'socios':
                this.refreshSocios();
                break;
            case 'backup':
                this.refreshBackupInfo();
                break;
        }
    }

    async refreshDashboard() {
        try {
            const kpis = await db.getKPIs();

            document.getElementById('kpi-caja-real').textContent = this.formatMoney(kpis.cajaReal);
            document.getElementById('kpi-pendientes').textContent = this.formatMoney(kpis.pendientes);
            document.getElementById('kpi-deuda-socios').textContent = this.formatMoney(kpis.deudaSocios);

            // Recent transactions
            const recent = await db.getTransacciones();
            const recentList = document.getElementById('recent-transactions');
            
            if (recent.length === 0) {
                recentList.innerHTML = '<p class="empty-state">No hay transacciones recientes</p>';
            } else {
                recentList.innerHTML = recent.slice(0, 5).map(t => `
                    <div class="transaction-item" onclick="app.viewTransaccionDetails(${t.id})">
                        <div style="display:flex; justify-content:space-between; align-items:start;">
                            <div style="flex:1;">
                                <strong>${t.concepto}</strong>
                                <p style="color:var(--text-secondary); font-size:0.9rem;">${t.categoria} • ${t.fechaFactura}</p>
                            </div>
                            <div style="text-align:right;">
                                <strong style="color:${t.tipo === 'ingreso' ? 'var(--success)' : 'var(--danger)'}; font-size:1.1rem;">
                                    ${t.tipo === 'ingreso' ? '+' : '-'}${this.formatMoney(t.monto)}
                                </strong>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Error refreshing dashboard:', error);
            this.showToast('Error al cargar el dashboard', 'error');
        }
    }

    async refreshTransacciones() {
        try {
            const filters = {
                tipo: document.getElementById('filter-tipo')?.value || '',
                mes: document.getElementById('filter-mes')?.value || '',
                search: document.getElementById('filter-buscar')?.value || ''
            };

            const transacciones = await db.getTransacciones(filters);
            const list = document.getElementById('transacciones-list');

            if (transacciones.length === 0) {
                list.innerHTML = '<p class="empty-state">No hay transacciones que mostrar</p>';
            } else {
                list.innerHTML = transacciones.map(t => `
                    <div class="transaction-item" onclick="app.viewTransaccionDetails(${t.id})">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <div style="flex:1;">
                                <strong>${t.concepto}</strong>
                                <p style="color:var(--text-secondary); font-size:0.9rem;">
                                    ${t.categoria} • ${t.fechaFactura}
                                </p>
                            </div>
                            <div style="text-align:right;">
                                <strong style="color:${t.tipo === 'ingreso' ? 'var(--success)' : 'var(--danger)'}; font-size:1.1rem;">
                                    ${t.tipo === 'ingreso' ? '+' : '-'}${this.formatMoney(t.monto)}
                                </strong>
                                <p style="font-size:0.85rem; color:var(--text-secondary);">${t.metodoPago || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Error refreshing transacciones:', error);
            this.showToast('Error al cargar transacciones', 'error');
        }
    }

    async refreshSocios() {
        try {
            const socios = await db.getSocios();
            const list = document.getElementById('socios-list');

            if (socios.length === 0) {
                list.innerHTML = '<p class="empty-state">No hay socios registrados</p>';
            } else {
                list.innerHTML = socios.map(s => {
                    const semaforo = this.getSemaforoSocio(s.deuda);
                    const deleteButton = !s.fijo ? `<button class="btn-delete-socio" onclick="event.stopPropagation(); app.deleteSocio(${s.id})">🗑️ Eliminar</button>` : '';
                    return `
                        <div class="socio-card" onclick="app.viewSocioDetails(${s.id})">
                            <img src="${s.avatar}" alt="${s.nombre}" class="socio-avatar" onerror="this.src='assets/icon.svg'">
                            <div class="socio-name">${s.nombre}</div>
                            <div class="socio-deuda">
                                <div class="semaforo-indicator" style="background:${semaforo.color}"></div>
                                ${this.formatMoney(s.deuda || 0)}
                            </div>
                            <div class="socio-status">${semaforo.label}</div>
                            ${deleteButton}
                        </div>
                    `;
                }).join('');
            }
        } catch (error) {
            console.error('Error refreshing socios:', error);
            this.showToast('Error al cargar socios', 'error');
        }
    }

    getSemaforoSocio(deuda) {
        if (deuda === 0 || deuda === null || deuda === undefined) {
            return { color: '#10b981', label: '🟢 Al Día ($0)' };
        } else if (deuda > 0 && deuda < 500000) {
            return { color: '#f59e0b', label: '🟡 Abono Parcial ($1 - $499,999)' };
        } else {
            return { color: '#ef4444', label: '🔴 Pendiente ($500,000+)' };
        }
    }

    showTransaccionModal(id = null) {
        const modalContent = `
            <div class="modal-header">
                <h2>${id ? 'Ver Transacción' : 'Nueva Transacción'}</h2>
                <button onclick="app.closeModal()" class="modal-close">✕</button>
            </div>
            <form id="form-transaccion" class="modal-form">
                <div class="form-group">
                    <label>Tipo *</label>
                    <select id="tipo" required>
                        <option value="">Seleccionar</option>
                        <option value="ingreso">Ingreso</option>
                        <option value="egreso">Egreso</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Categoría *</label>
                    <select id="categoria" required>
                        <option value="">Seleccionar tipo primero</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Concepto *</label>
                    <input type="text" id="concepto" required>
                </div>
                <div class="form-group">
                    <label>Monto (COP) *</label>
                    <input type="number" id="monto" min="0" step="0.01" placeholder="Ej: 150000 o 150000.50" required>
                </div>
                <div class="form-group">
                    <label>Fecha Factura *</label>
                    <input type="date" id="fechaFactura" required>
                </div>
                <div class="form-group">
                    <label>Método de Pago *</label>
                    <select id="metodoPago" required>
                        <option value="">Seleccionar</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Transferencia">Transferencia</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Tarjeta">Tarjeta</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Estado</label>
                    <select id="estado">
                        <option value="Completado">Completado</option>
                        <option value="Pendiente">Pendiente</option>
                    </select>
                </div>
                ${!id ? '<button type="submit" class="btn-primary">Guardar Transacción</button>' : ''}
            </form>
        `;

        document.getElementById('modal-content').innerHTML = modalContent;
        document.getElementById('modal-overlay').style.display = 'flex';

        // Setup category change handler
        document.getElementById('tipo').addEventListener('change', (e) => {
            const categoriaSelect = document.getElementById('categoria');
            if (e.target.value === 'ingreso') {
                categoriaSelect.innerHTML = `
                    <option value="">Seleccionar</option>
                    <option value="Honorarios">Honorarios</option>
                    <option value="Fondos de Terceros">Fondos de Terceros</option>
                `;
            } else if (e.target.value === 'egreso') {
                categoriaSelect.innerHTML = `
                    <option value="">Seleccionar</option>
                    <option value="Operativos">Operativos</option>
                    <option value="Reembolsables">Reembolsables</option>
                `;
            }
        });

        // Setup form submit
        if (!id) {
            document.getElementById('form-transaccion').addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.saveTransaccion();
            });
        }
    }

    async saveTransaccion() {
        try {
            const formData = {
                tipo: document.getElementById('tipo').value,
                categoria: document.getElementById('categoria').value,
                concepto: document.getElementById('concepto').value,
                monto: parseFloat(document.getElementById('monto').value),
                fechaFactura: document.getElementById('fechaFactura').value,
                metodoPago: document.getElementById('metodoPago').value,
                estado: document.getElementById('estado').value
            };

            await db.addTransaccion(formData);
            
            this.closeModal();
            sounds.playSuccess();
            this.showToast('Transacción guardada correctamente', 'success');
            
            // Refresh views
            await this.refreshDashboard();
            await this.refreshTransacciones();
        } catch (error) {
            console.error('Error saving transaccion:', error);
            sounds.playError();
            this.showToast('Error al guardar la transacción', 'error');
        }
    }

    viewTransaccionDetails(id) {
        this.showTransaccionModal(id);
    }

    showSocioModal() {
        const modalContent = `
            <div class="modal-header">
                <h2>Nuevo Socio</h2>
                <button onclick="app.closeModal()" class="modal-close">✕</button>
            </div>
            <form id="form-socio" class="modal-form">
                <div class="form-group">
                    <label>Nombre *</label>
                    <input type="text" id="nombre-socio" placeholder="Nombre completo del socio" required>
                </div>
                <div class="form-group">
                    <label>Avatar</label>
                    <select id="avatar-socio">
                        <option value="https://www.genspark.ai/api/files/s/AaX7BoVD">👩 Avatar F3 (Mujer - Azul)</option>
                        <option value="https://www.genspark.ai/api/files/s/pozM56uz">👩 Avatar F4 (Mujer - Rojo)</option>
                        <option value="https://www.genspark.ai/api/files/s/Xt5ryLmf">👨 Avatar M2 (Hombre - Azul)</option>
                        <option value="https://www.genspark.ai/api/files/s/u7gkxVTS">👨 Avatar M3 (Hombre - Beige)</option>
                        <option value="https://www.genspark.ai/api/files/s/10aGHwc6">👨 Avatar M4 (Hombre - Gris)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Deuda Inicial (COP)</label>
                    <input type="number" id="deuda-socio" min="0" step="0.01" placeholder="0.00" value="0">
                </div>
                <button type="submit" class="btn-primary">Guardar Socio</button>
            </form>
        `;

        document.getElementById('modal-content').innerHTML = modalContent;
        document.getElementById('modal-overlay').style.display = 'flex';

        document.getElementById('form-socio').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.saveSocio();
        });
    }

    async saveSocio() {
        try {
            const formData = {
                nombre: document.getElementById('nombre-socio').value,
                avatar: document.getElementById('avatar-socio').value,
                deuda: parseFloat(document.getElementById('deuda-socio').value) || 0,
                fijo: false
            };

            await db.addSocio(formData);
            
            this.closeModal();
            sounds.playSuccess();
            this.showToast('Socio guardado correctamente', 'success');
            
            // Refresh socios view
            await this.refreshSocios();
        } catch (error) {
            console.error('Error saving socio:', error);
            sounds.playError();
            this.showToast('Error al guardar el socio', 'error');
        }
    }

    viewSocioDetails(id) {
        // Implementation for viewing socio details
        console.log('View socio:', id);
    }

    async deleteSocio(id) {
        try {
            const socios = await db.getSocios();
            const socio = socios.find(s => s.id === id);
            
            if (!socio) {
                this.showToast('Socio no encontrado', 'error');
                return;
            }

            if (socio.fijo) {
                this.showToast('No se pueden eliminar los socios fijos (Ángel, Andrea, Sandra)', 'error');
                sounds.playError();
                return;
            }

            if (confirm(`¿Estás seguro de eliminar a ${socio.nombre}?`)) {
                await db.deleteSocio(id);
                sounds.playSuccess();
                this.showToast('Socio eliminado correctamente', 'success');
                await this.refreshSocios();
                await this.refreshDashboard();
            }
        } catch (error) {
            console.error('Error deleting socio:', error);
            sounds.playError();
            this.showToast('Error al eliminar el socio', 'error');
        }
    }

    async exportBackup() {
        try {
            const data = await db.exportData();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `caja-de-cristal-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            sounds.playSuccess();
            this.showToast('Backup exportado correctamente', 'success');
        } catch (error) {
            console.error('Error exporting backup:', error);
            sounds.playError();
            this.showToast('Error al exportar backup', 'error');
        }
    }

    async importBackup(file) {
        try {
            const text = await file.text();
            await db.importData(text);
            
            sounds.playSuccess();
            this.showToast('Backup importado correctamente', 'success');
            
            // Refresh all views
            await this.refreshDashboard();
            await this.refreshTransacciones();
            await this.refreshSocios();
        } catch (error) {
            console.error('Error importing backup:', error);
            sounds.playError();
            this.showToast('Error al importar backup', 'error');
        }
    }

    async refreshBackupInfo() {
        const transacciones = await db.getTransacciones();
        const socios = await db.getSocios();
        
        document.getElementById('backup-stats').textContent = 
            `${transacciones.length} transacciones, ${socios.length} socios`;
    }

    closeModal() {
        document.getElementById('modal-overlay').style.display = 'none';
        document.getElementById('modal-content').innerHTML = '';
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        const container = document.getElementById('toast-container');
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                container.removeChild(toast);
            }, 300);
        }, 3000);
    }

    formatMoney(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    }
}

// Global app instance
const app = new CajaDeCristalApp();

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Hide splash screen
    setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
    }, 1500);
    
    // Initialize app
    await app.init();
});
