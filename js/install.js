/* ============================================
   PWA INSTALLATION
   Caja de Cristal PWA
   ============================================ */

let deferredPrompt;
const installButton = document.getElementById('btn-install-app');

// Capturar el evento beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevenir que el navegador muestre su propio prompt
    e.preventDefault();
    
    // Guardar el evento para usarlo más tarde
    deferredPrompt = e;
    
    // Mostrar el botón de instalación
    installButton.style.display = 'block';
    
    console.log('✅ PWA installable');
});

// Manejar el click en el botón de instalación
installButton.addEventListener('click', async () => {
    if (!deferredPrompt) {
        console.log('⚠️ deferredPrompt no disponible');
        return;
    }

    // Mostrar el prompt de instalación
    deferredPrompt.prompt();

    // Esperar la respuesta del usuario
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`User response: ${outcome}`);

    if (outcome === 'accepted') {
        console.log('✅ PWA instalada');
        app.showToast('¡Aplicación instalada correctamente!', 'success');
    } else {
        console.log('❌ Instalación cancelada');
    }

    // Limpiar el prompt usado
    deferredPrompt = null;
    installButton.style.display = 'none';
});

// Detectar cuando la app ha sido instalada
window.addEventListener('appinstalled', () => {
    console.log('✅ PWA installed');
    app.showToast('¡Caja de Cristal instalada!', 'success');
    installButton.style.display = 'none';
    deferredPrompt = null;
});

// Ocultar el botón si ya está en modo standalone
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
    installButton.style.display = 'none';
    console.log('✅ Running in standalone mode');
}
