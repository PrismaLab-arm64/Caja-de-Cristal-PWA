/* ============================================
   APP - Main Application Logic
   Caja de Cristal PWA
   ============================================ */

class CajaDeCristalApp {
    constructor() {
        this.currentView = 'dashboard';
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        console.log('🚀 Initializing Caja de Cristal...');

        // Initialize database
        await db.init();

        // Initialize socios por defecto si no existen
        await this.initDefaultSocios();

        // Setup UI
        this.setupEventListeners();
        this.setupNavigation();

        // Hide splash, show app
        setTimeout(() => {
            document.getElementById('splash-screen').classList.remove('active');
            document.getElementById('app').style.display = 'block';
            this.refreshDashboard();
        }, 2000);

        this.initialized = true;
        console.log('✅ App initialized');
    }

    async initDefaultSocios() {
        const socios = await db.getSocios();
        if (socios.length === 0) {
            // Crear 3 socios principales
            const defaultSocios = [
                { nombre: 'John Skinner', avatar: '👨‍💼', deuda: 0 },
                { nombre: 'María González', avatar: '👩‍💼', deuda: 0 },
                { nombre: 'Carlos Rodríguez', avatar: '👨‍💻', deuda: 0 }
            ];

            for (const socio of defaultSocios) {
                await db.addSocio(socio);
            }
            console.log('✅ Default socios created');
        }
    }

    setupEventListeners() {
        // Navigation toggle
        document.getElementById('nav-toggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.add('active');
        });

        document.getElementById('sidebar-close').addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('active');
        });

        // Nueva transacción
        document.getElementById('btn-nueva-transaccion')?.addEventListener('click', () => {
            this.showTransaccionModal();
        });

        // Nuevo socio
        document.getElementById('btn-nuevo-socio')?.addEventListener('click', () => {
            this.showSocioModal();
        });

        // Generar reporte
        document.getElementById('btn-generar-reporte')?.addEventListener('click', () => {
            this.generateReport();
        });

        // Backup
        document.getElementById('btn-exportar')?.addEventListener('click', () => {
            this.exportBackup();
        });

        document.getElementById('btn-importar')?.addEventListener('click', () => {
            document.getElementById('file-importar').click();
        });

        document.getElementById('file-importar')?.addEventListener('change', (e) => {
            this.importBackup(e.target.files[0]);
        });

        // Filters
        document.getElementById('filter-tipo')?.addEventListener('change', () => {
            this.refreshTransacciones();
        });

        document.getElementById('filter-mes')?.addEventListener('change', () => {
            this.refreshTransacciones();
        });

        document.getElementById('filter-buscar')?.addEventListener('input', () => {
            this.refreshTransacciones();
        });

        // Close modal on overlay click
        document.getElementById('modal-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') {
                this.closeModal();
            }
        });
    }

    setupNavigation() {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
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
        document.getElementById(`view-${view}`).classList.add('active');

        // Close sidebar on mobile
        document.getElementById('sidebar').classList.remove('active');

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
        const stats = await db.getStats();

        document.getElementById('kpi-caja-real').textContent = this.formatMoney(stats.cajaReal);
        document.getElementById('kpi-pendientes').textContent = this.formatMoney(stats.pendientes);
        document.getElementById('kpi-deuda-socios').textContent = this.formatMoney(stats.deudaSocios);

        // Recent transactions
        const recent = await db.getTransacciones();
        const recentList = document.getElementById('recent-transactions');
        
        if (recent.length === 0) {
            recentList.innerHTML = '<p class="empty-state">No hay transacciones recientes</p>';
        } else {
            recentList.innerHTML = recent.slice(0, 5).map(t => `
                <div class="transaction-item">
                    <div style="display:flex; justify-content:space-between;">
                        <div>
                            <strong>${t.concepto}</strong>
                            <p style="color:var(--text-secondary); font-size:0.9rem;">${t.categoria} • ${t.fecha}</p>
                        </div>
                        <div style="text-align:right;">
                            <strong style="color:${t.tipo === 'ingreso' ? 'var(--success)' : 'var(--danger)'}">
                                ${t.tipo === 'ingreso' ? '+' : '-'}${this.formatMoney(t.monto)}
                            </strong>
                            <p style="font-size:0.8rem; color:var(--text-secondary);">${t.metodoPago || ''}</p>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    async refreshTransacciones() {
        const filters = {
            tipo: document.getElementById('filter-tipo')?.value,
            mes: document.getElementById('filter-mes')?.value,
            search: document.getElementById('filter-buscar')?.value
        };

        const transacciones = await db.getTransacciones(filters);
        const list = document.getElementById('transacciones-list');

        if (transacciones.length === 0) {
            list.innerHTML = '<p class="empty-state">No hay transacciones que mostrar</p>';
        } else {
            list.innerHTML = transacciones.map(t => `
                <div class="transaction-item" onclick="app.showTransaccionModal(${t.id})">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <strong>${t.concepto}</strong>
                            <p style="color:var(--text-secondary); font-size:0.9rem;">
                                ${t.categoria} • ${t.fecha} • ${t.metodoPago || 'N/A'}
                            </p>
                        </div>
                        <strong style="color:${t.tipo === 'ingreso' ? 'var(--success)' : 'var(--danger)'}; font-size:1.2rem;">
                            ${t.tipo === 'ingreso' ? '+' : '-'}${this.formatMoney(t.monto)}
                        </strong>
                    </div>
                </div>
            `).join('');
        }
    }

    async refreshSocios() {
        const socios = await db.getSocios();
        const list = document.getElementById('socios-list');

        if (socios.length === 0) {
            list.innerHTML = '<p class="empty-state">No hay socios registrados</p>';
        } else {
            list.innerHTML = socios.map(s => `
                <div class="socio-card" onclick="app.showSocioModal(${s.id})">
                    <div style="font-size:3rem; text-align:center; margin-bottom:10px;">
                        ${s.avatar || '👤'}
                    </div>
                    <h3 style="text-align:center; margin-bottom:10px;">${s.nombre}</h3>
                    <div style="text-align:center;">
                        <div style="font-size:0.9rem; color:var(--text-secondary);">Deuda</div>
                        <div style="font-size:1.5rem; font-weight:700; color:${s.deuda > 0 ? 'var(--danger)' : 'var(--success)'}">
                            ${this.formatMoney(s.deuda || 0)}
                        </div>
                        <div style="margin-top:10px; padding:5px 10px; background:${this.getSemaforoColor(s.deuda)}; border-radius:15px; display:inline-block;">
                            ${this.getSemaforoLabel(s.deuda)}
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    getSemaforoColor(deuda) {
        if (deuda === 0) return 'var(--success)';
        if (deuda > 0 && deuda < 500000) return 'var(--warning)';
        return 'var(--danger)';
    }

    getSemaforoLabel(deuda) {
        if (deuda === 0) return '🟢 Al Día';
        if (deuda > 0 && deuda < 500000) return '🟡 Abono Parcial';
        return '🔴 Pendiente';
    }

    async refreshBackupInfo() {
        const stats = await db.getStats();
        document.getElementById('backup-stats').textContent = 
            `${stats.totalTransacciones} transacciones, ${stats.totalSocios} socios`;

        const lastBackup = await db.getConfig('lastBackup');
        document.getElementById('last-backup').textContent = 
            lastBackup ? new Date(lastBackup).toLocaleString() : 'Nunca';
    }

    // MODALS

    showTransaccionModal(id = null) {
        const content = `
            <h2>${id ? 'Editar' : 'Nueva'} Transacción</h2>
            <form id="form-transaccion" onsubmit="app.saveTransaccion(event, ${id})">
                <select name="tipo" class="form-input" required>
                    <option value="">Tipo...</option>
                    <option value="ingreso">Ingreso</option>
                    <option value="egreso">Egreso</option>
                </select>
                <select name="categoria" class="form-input" required>
                    <option value="">Categoría...</option>
                    <option value="Honorarios">Honorarios</option>
                    <option value="Fondos de Terceros">Fondos de Terceros</option>
                    <option value="Operativo">Operativo</option>
                    <option value="Reembolsable">Reembolsable</option>
                </select>
                <input type="text" name="concepto" class="form-input" placeholder="Concepto" required>
                <input type="number" name="monto" class="form-input" placeholder="Monto" required>
                <input type="date" name="fecha" class="form-input" required>
                <select name="metodoPago" class="form-input">
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Tarjeta">Tarjeta</option>
                </select>
                <div style="display:flex; gap:10px; margin-top:20px;">
                    <button type="submit" class="btn-primary" style="flex:1;">Guardar</button>
                    <button type="button" class="btn-secondary" onclick="app.closeModal()">Cancelar</button>
                </div>
            </form>
        `;
        document.getElementById('modal-content').innerHTML = content;
        document.getElementById('modal-overlay').classList.add('active');
    }

    async saveTransaccion(event, id) {
        event.preventDefault();
        const form = event.target;
        const data = {
            tipo: form.tipo.value,
            categoria: form.categoria.value,
            concepto: form.concepto.value,
            monto: parseFloat(form.monto.value),
            fecha: form.fecha.value,
            metodoPago: form.metodoPago.value,
            estado: 'completado'
        };

        if (id) {
            await db.updateTransaccion(id, data);
            this.showToast('Transacción actualizada', 'success');
        } else {
            await db.addTransaccion(data);
            this.showToast('Transacción creada', 'success');
        }

        this.closeModal();
        this.refreshDashboard();
        this.refreshTransacciones();
    }

    showSocioModal(id = null) {
        const content = `
            <h2>${id ? 'Editar' : 'Nuevo'} Socio</h2>
            <form id="form-socio" onsubmit="app.saveSocio(event, ${id})">
                <input type="text" name="nombre" class="form-input" placeholder="Nombre completo" required>
                <input type="text" name="avatar" class="form-input" placeholder="Avatar (emoji)" value="👤">
                <input type="number" name="deuda" class="form-input" placeholder="Deuda inicial" value="0">
                <div style="display:flex; gap:10px; margin-top:20px;">
                    <button type="submit" class="btn-primary" style="flex:1;">Guardar</button>
                    <button type="button" class="btn-secondary" onclick="app.closeModal()">Cancelar</button>
                </div>
            </form>
        `;
        document.getElementById('modal-content').innerHTML = content;
        document.getElementById('modal-overlay').classList.add('active');
    }

    async saveSocio(event, id) {
        event.preventDefault();
        const form = event.target;
        const data = {
            nombre: form.nombre.value,
            avatar: form.avatar.value || '👤',
            deuda: parseFloat(form.deuda.value) || 0
        };

        if (id) {
            await db.updateSocio(id, data);
            this.showToast('Socio actualizado', 'success');
        } else {
            await db.addSocio(data);
            this.showToast('Socio creado', 'success');
        }

        this.closeModal();
        this.refreshSocios();
    }

    closeModal() {
        document.getElementById('modal-overlay').classList.remove('active');
    }

    // UTILITIES

    formatMoney(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        document.getElementById('toast-container').appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    async generateReport() {
        const mes = document.getElementById('report-mes').value;
        if (!mes) {
            this.showToast('Selecciona un mes', 'warning');
            return;
        }

        this.showToast('Generando reporte...', 'info');
        
        try {
            await generatePDF(mes);
            this.showToast('Reporte generado correctamente', 'success');
        } catch (error) {
            console.error('Error generating report:', error);
            this.showToast('Error al generar reporte', 'error');
        }
    }

    async exportBackup() {
        try {
            const backup = await db.exportData();
            const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `caja-de-cristal-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            
            URL.revokeObjectURL(url);
            
            await db.setConfig('lastBackup', new Date().toISOString());
            this.showToast('Backup exportado correctamente', 'success');
            this.refreshBackupInfo();
        } catch (error) {
            console.error('Error exporting backup:', error);
            this.showToast('Error al exportar backup', 'error');
        }
    }

    async importBackup(file) {
        if (!file) return;

        try {
            const text = await file.text();
            const backup = JSON.parse(text);
            
            if (confirm('¿Estás seguro? Esto reemplazará todos los datos actuales.')) {
                await db.importData(backup);
                this.showToast('Backup importado correctamente', 'success');
                this.refreshDashboard();
                this.refreshTransacciones();
                this.refreshSocios();
            }
        } catch (error) {
            console.error('Error importing backup:', error);
            this.showToast('Error al importar backup', 'error');
        }
    }
}

// Initialize app
const app = new CajaDeCristalApp();
window.addEventListener('DOMContentLoaded', () => app.init());
