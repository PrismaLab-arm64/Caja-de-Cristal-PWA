/* ============================================
   AUTH - Sistema de Autenticación con PIN
   Caja de Cristal PWA
   ============================================ */

class AuthSystem {
    constructor() {
        this.PIN_CORRECTO = '621808'; // PIN hardcoded
        this.TIMEOUT_MINUTOS = 5;
        this.lastActivity = Date.now();
        this.isAuthenticated = false;
        this.timeoutInterval = null;
    }

    init() {
        console.log('🔐 Inicializando sistema de autenticación...');
        
        // Ocultar splash primero
        setTimeout(() => {
            const splash = document.getElementById('splash-screen');
            if (splash) {
                splash.style.display = 'none';
                console.log('✅ Splash ocultado');
            }
            
            // Verificar si ya está autenticado en esta sesión
            const sessionAuth = sessionStorage.getItem('auth');
            if (sessionAuth === 'true') {
                console.log('✅ Usuario ya autenticado');
                this.isAuthenticated = true;
                this.hidePinScreen();
                this.startTimeout();
                
                // Inicializar la app
                if (typeof app !== 'undefined' && app.init) {
                    app.init();
                }
            } else {
                console.log('🔒 Mostrando pantalla de PIN');
                this.showPinScreen();
            }
            
            // Detectar actividad del usuario
            this.setupActivityListeners();
        }, 1000); // Esperar 1 segundo para que el DOM cargue completamente
    }

    showPinScreen() {
        const pinScreen = document.getElementById('pin-screen');
        const app = document.getElementById('app');

        console.log('📱 Mostrando pantalla PIN');
        if (app) {
            app.style.display = 'none';
            console.log('  - App ocultado');
        }
        if (pinScreen) {
            pinScreen.style.display = 'flex';
            console.log('  - PIN screen mostrado');
            
            // Enfocar el input
            setTimeout(() => {
                const pinInput = document.getElementById('pin-input');
                if (pinInput) {
                    pinInput.focus();
                    console.log('  - Input enfocado');
                }
            }, 100);
        }
    }

    hidePinScreen() {
        const pinScreen = document.getElementById('pin-screen');
        const app = document.getElementById('app');

        if (pinScreen) pinScreen.style.display = 'none';
        if (app) app.style.display = 'block';
    }

    verificarPIN(pinIngresado) {
        if (pinIngresado === this.PIN_CORRECTO) {
            this.isAuthenticated = true;
            sessionStorage.setItem('auth', 'true');
            this.hidePinScreen();
            this.startTimeout();
            
            // Inicializar la app
            if (typeof app !== 'undefined' && app.init) {
                app.init();
            }
            
            return true;
        } else {
            return false;
        }
    }

    setupActivityListeners() {
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
        events.forEach(event => {
            document.addEventListener(event, () => {
                this.lastActivity = Date.now();
            }, true);
        });
    }

    startTimeout() {
        // Limpiar timeout anterior si existe
        if (this.timeoutInterval) {
            clearInterval(this.timeoutInterval);
        }

        // Verificar cada 30 segundos si ha pasado el tiempo de inactividad
        this.timeoutInterval = setInterval(() => {
            const minutosInactivo = (Date.now() - this.lastActivity) / 1000 / 60;
            
            if (minutosInactivo >= this.TIMEOUT_MINUTOS) {
                this.logout();
            }
        }, 30000); // Verificar cada 30 segundos
    }

    logout() {
        this.isAuthenticated = false;
        sessionStorage.removeItem('auth');
        
        if (this.timeoutInterval) {
            clearInterval(this.timeoutInterval);
        }

        // Mostrar pantalla de PIN
        this.showPinScreen();
        
        // Limpiar el input de PIN
        const pinInput = document.getElementById('pin-input');
        if (pinInput) {
            pinInput.value = '';
        }
    }

    isUserAuthenticated() {
        return this.isAuthenticated;
    }
}

// Instancia global
const auth = new AuthSystem();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setupPinScreen();
});

function setupPinScreen() {
    const pinInput = document.getElementById('pin-input');
    const pinSubmit = document.getElementById('pin-submit');
    const pinError = document.getElementById('pin-error');

    if (!pinInput || !pinSubmit) return;

    // Enfocar automáticamente el input
    pinInput.focus();

    // Permitir solo números
    pinInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        if (e.target.value.length > 6) {
            e.target.value = e.target.value.slice(0, 6);
        }
        // Limpiar error al escribir
        if (pinError) pinError.style.display = 'none';
    });

    // Submit con Enter
    pinInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            verificarPin();
        }
    });

    // Submit con botón
    pinSubmit.addEventListener('click', verificarPin);

    function verificarPin() {
        const pin = pinInput.value.trim();
        
        if (pin.length === 0) {
            mostrarError('Ingresa el PIN');
            return;
        }

        if (pin.length !== 6) {
            mostrarError('El PIN debe tener 6 dígitos');
            return;
        }

        const esValido = auth.verificarPIN(pin);
        
        if (esValido) {
            pinInput.value = '';
            if (pinError) pinError.style.display = 'none';
        } else {
            mostrarError('PIN incorrecto');
            pinInput.value = '';
            pinInput.focus();
            
            // Vibración si está disponible
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
        }
    }

    function mostrarError(mensaje) {
        if (pinError) {
            pinError.textContent = mensaje;
            pinError.style.display = 'block';
        }
    }
}
