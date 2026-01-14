# 💎 Caja de Cristal PWA - Versión Final

<div align="center">

![Version](https://img.shields.io/badge/version-1.4.0-blue.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-green.svg)
![Security](https://img.shields.io/badge/Security-PIN%20Protected-red.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)

**Sistema de Tesorería Profesional con Seguridad PIN**

*Diseñado y desarrollado por **Ing. John A. Skinner S.***  
*Desarrollado para **SISTROVIAL.LEGAL Peritos & Abogados***

[🌐 Ver Demo](https://prismalab-arm64.github.io/Caja-de-Cristal-PWA/)

</div>

---

## ✨ Novedades de la Versión 1.4.0 - Final

Esta versión incluye los **toques finales profesionales** para producción:

- 🏢 **Créditos en Splash** - Titularidad profesional visible (SISTROVIAL.LEGAL)
- 🚪 **Botón Salir** - Opción para cerrar sesión desde el menú
- 🆕 **Base de Datos Limpia** - Inicia con valores en cero lista para estrenar
- 🔒 **PIN de Seguridad** - Protección con PIN al abrir la app (621808)
- ⏱️ **Auto-lock** - Bloqueo automático después de 5 minutos de inactividad
- ⚠️ **Advertencia de Backup** - Recordatorio visible en el dashboard
- 🛡️ **Protección de Datos** - Información financiera protegida
- ✨ **Socios Fijos Protegidos** - Ángel, Andrea y Sandra no se pueden eliminar
- 📊 **Semáforo Mejorado** - Rangos de deuda claros
- 💵 **Valores Decimales** - Montos con centavos

### 📦 Cambios de Seguridad

1. **Sistema de Autenticación con PIN**
   - PIN requerido al abrir la app
   - Sesión protegida con timeout
   - Bloqueo automático por inactividad
   
2. **Código optimizado**
   - Eliminación de dependencias no esenciales
   - Reducción de archivos JavaScript
   - Mejor manejo de errores

3. **UI mejorada**
   - Navegación más fluida
   - Mejor feedback visual
   - Animaciones optimizadas

---

## 🎯 ¿Qué es Caja de Cristal?

**Caja de Cristal** es una Progressive Web App (PWA) profesional diseñada para gestionar la tesorería de firmas profesionales como **SISTROVIAL.LEGAL Peritos & Abogados**. Desarrollada con tecnologías web modernas, ofrece una experiencia nativa multiplataforma sin necesidad de instalación desde tiendas de aplicaciones.

### ✨ Características Principales

- 💰 **Gestión de Transacciones**
  - Ingresos: Honorarios / Fondos de Terceros
  - Egresos: Operativos / Reembolsables
  - Múltiples métodos de pago
  - Filtros avanzados
  
- 👥 **Gestión de Socios**
  - Hasta 8 socios
  - Semáforo de Skinner (🔴 Pendiente / 🟡 Abono Parcial / 🟢 Al Día)
  - Control de deudas automático
  
- 📊 **Dashboard Inteligente**
  - Caja Real en tiempo real
  - Pendientes de pago
  - Deuda total de socios
  - Últimas transacciones
  
- 💾 **Backup y Restauración**
  - Exportar datos a JSON
  - Importar backups completos
  - Almacenamiento local persistente
  
- 📱 **100% Offline**
  - Service Worker con cache-first strategy
  - Funciona sin conexión a internet
  - Datos persistentes localmente

---

## 🚀 Instalación

### Opción 1: Instalación PWA (Recomendada)

#### **Android / Chrome**
1. Abre el link de la app
2. Toca el botón **"⬇️ INSTALAR APLICACIÓN"**
3. Confirma en el diálogo del navegador
4. ¡Listo! Encontrarás el ícono en tu pantalla de inicio

#### **iOS / Safari**
1. Abre el link de la app
2. Toca el botón de **Compartir** (cuadrado con flecha)
3. Selecciona **"Agregar a pantalla de inicio"**
4. Confirma el nombre y toca **"Agregar"**

#### **Windows / macOS (Chrome/Edge)**
1. Abre el link de la app
2. Haz clic en el ícono **⊕** en la barra de dirección
3. O busca **"Instalar Caja de Cristal"** en el menú del navegador
4. Confirma la instalación

### Opción 2: Uso directo en navegador

Simplemente abre la URL en cualquier navegador moderno: https://prismalab-arm64.github.io/Caja-de-Cristal-PWA/

---

## 📖 Cómo Usar

### 1️⃣ **Dashboard**

Al abrir la app verás:
- **Caja Real**: Balance actual (ingresos - egresos)
- **Pendientes**: Pagos pendientes de realizar
- **Deuda Socios**: Total adeudado por los socios

### 2️⃣ **Transacciones**

1. Haz clic en **"+ Nueva Transacción"**
2. Selecciona el tipo: Ingreso o Egreso
3. Elige la categoría correspondiente
4. Ingresa monto, concepto, fecha y método de pago
5. Guarda

**Filtros disponibles:**
- Por tipo (Ingreso/Egreso)
- Por mes
- Búsqueda de texto

### 3️⃣ **Socios**

1. Haz clic en **"+ Nuevo Socio"**
2. Ingresa nombre y avatar
3. Define deuda inicial (opcional)
4. Guarda

**Semáforo de Skinner:**
- 🟢 **Verde**: $0 (Al Día)
- 🟡 **Amarillo**: $1 - $499,999 (Abono Parcial)
- 🔴 **Rojo**: $500,000+ (Pendiente)

### 4️⃣ **Backup**

**Exportar:**
1. Haz clic en **"💾 Exportar Backup"**
2. Se descargará un archivo JSON con todos tus datos

**Importar:**
1. Haz clic en **"📥 Importar Backup"**
2. Selecciona el archivo JSON de backup
3. Confirma la importación (⚠️ reemplazará los datos actuales)

---

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- HTML5 con semántica avanzada
- CSS3 con variables nativas y animaciones GPU
- Vanilla JavaScript (ES6+)

### **APIs Web Nativas**
- **Service Worker API**: Cache y modo offline
- **localStorage API**: Persistencia local simplificada
- **Web App Manifest**: Instalabilidad PWA
- **Web Audio API**: Sonidos de interfaz

### **Arquitectura**
- Progressive Web App (PWA)
- Offline-first con Service Worker
- localStorage para almacenamiento local
- Event-driven architecture

---

## 📊 Estructura del Proyecto

```
caja-de-cristal-pwa/
├── index.html              # Punto de entrada (simplificado)
├── manifest.json           # Configuración PWA
├── sw.js                   # Service Worker
├── css/
│   └── style.css           # Estilos globales y responsive
├── js/
│   ├── app.js              # Lógica principal (simplificada)
│   ├── db.js               # localStorage Manager (simplificado)
│   ├── sounds.js           # Sistema de sonidos
│   ├── utils.js            # Utilidades
│   └── install.js          # PWA Installation
└── assets/
    ├── icon.svg            # Ícono de la app
    └── icon.png            # Ícono alternativo
```

---

## 🔒 Privacidad y Datos

- ✅ **100% Local**: Todos los datos se guardan en tu dispositivo
- ✅ **Sin Servidores**: No enviamos información a ningún servidor
- ✅ **Sin Tracking**: No usamos analytics ni cookies de terceros
- ✅ **Código Abierto**: Puedes revisar todo el código fuente

---

## 📝 Changelog

### Versión 1.3.0 - Segura (14 de Enero, 2026)
- 🔒 Sistema de autenticación con PIN
- ⏱️ Bloqueo automático por inactividad (5 minutos)
- ⚠️ Advertencia de backup en dashboard
- ✨ Avatares corregidos (Ángel, Andrea, Sandra)
- 🛡️ Protección de socios fijos
- 📊 Semáforo con rangos de deuda claros
- 💵 Valores decimales en montos

### Versión 1.2.0 - Mejoras UX (14 de Enero, 2026)
- ✨ Gestión mejorada de socios
- ✨ Botón eliminar solo en socios adicionales
- ✨ 5 avatares adicionales disponibles
- ✨ Mejor experiencia de usuario

### Versión 1.1.0 - Simplificada (14 de Enero, 2026)
- ✨ Migración de IndexedDB a localStorage
- ✨ Simplificación de código JavaScript
- ✨ Mejor manejo de errores
- ✨ Optimización de rendimiento
- ✨ Reducción de dependencias
- ✅ Pruebas y validación completa

### Versión 1.0.0 - Inicial (13 de Enero, 2026)
- 🎉 Lanzamiento inicial
- ✅ Sistema completo de transacciones
- ✅ Gestión de socios
- ✅ Dashboard con KPIs
- ✅ Backup/Restore
- ✅ PWA con Service Worker

---

## 👨‍💻 Desarrollador

<div align="center">

**Ing. John A. Skinner S.**

Ingeniero de Software especializado en PWAs y desarrollo móvil

📧 Contacto: johnskinner050@gmail.com  
🏢 Cliente: SISTROVIAL.LEGAL Peritos & Abogados

</div>

---

## 📄 Licencia

© 2026 **Ing. John A. Skinner S.** - Todos los derechos reservados.

Este software es de **uso propietario** desarrollado para **SISTROVIAL.LEGAL Peritos & Abogados**.

**Términos de uso:**
- ❌ No se permite la redistribución
- ❌ No se permite la modificación sin autorización
- ❌ No se permite el uso comercial sin licencia
- ✅ Uso exclusivo para SISTROVIAL.LEGAL

© 2026 **Ing. John A. Skinner S.** - Todos los derechos reservados.

Este software es de **uso propietario** desarrollado para **SISTROVIAL.LEGAL**.

---

## 🎯 Cliente

**SISTROVIAL.LEGAL Peritos & Abogados**

- **NIT**: En trámite
- **Dirección**: Calle 15 37L 42
- **Email**: info@sistrovial.legal
- **Moneda**: COP (Peso Colombiano)

---

## 🌟 ¿Te gusta Caja de Cristal?

Si encuentras útil esta aplicación:

- ⭐ Dale una estrella en GitHub
- 🐛 Reporta bugs o sugiere mejoras
- 📢 Compártela con amigos y colegas
- 💬 Deja tu feedback

---

## 🚀 Deployment con GitHub Pages

Esta aplicación está configurada para desplegarse automáticamente con GitHub Pages:

1. Los cambios se pushean a la rama principal
2. GitHub Pages construye y despliega automáticamente
3. La aplicación está disponible en: https://prismalab-arm64.github.io/Caja-de-Cristal-PWA/

---

<div align="center">

**Caja de Cristal** - Sistema de Tesorería Profesional

*Desarrollado con ❤️ usando tecnologías web modernas*

v1.1.0 - 2026

</div>
