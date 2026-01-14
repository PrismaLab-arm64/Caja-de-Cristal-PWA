# 💎 Caja de Cristal PWA

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-green.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)

**Sistema de Tesorería Profesional**

*Diseñado y desarrollado por **Ing. John A. Skinner S.***

[🌐 Ver Demo](#) | [📱 Instalar PWA](#instalación) | [📖 Documentación](#)

</div>

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
  
- 📄 **Reportes PDF**
  - Resumen ejecutivo mensual
  - Tabla de transacciones
  - Estado de socios con semáforo
  - Hash de integridad SHA-256
  - Sello "MES AUDITADO Y CERRADO"
  
- 💾 **Backup y Restauración**
  - Exportar datos a JSON
  - Importar backups completos
  - Almacenamiento local con IndexedDB
  
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

Simplemente abre la URL en cualquier navegador moderno.

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
2. Ingresa nombre y avatar (emoji)
3. Define deuda inicial (opcional)
4. Guarda

**Semáforo de Skinner:**
- 🟢 **Verde**: $0 (Al Día)
- 🟡 **Amarillo**: $1 - $499,999 (Abono Parcial)
- 🔴 **Rojo**: $500,000+ (Pendiente)

### 4️⃣ **Reportes**

1. Selecciona el mes a reportar
2. Haz clic en **"Generar Reporte PDF"**
3. El PDF se descargará automáticamente

**Contenido del reporte:**
- Resumen ejecutivo mensual
- Tabla de transacciones
- Estado de socios
- Hash de integridad
- Sello de cierre de mes

### 5️⃣ **Backup**

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
- **IndexedDB API**: Persistencia local
- **Web App Manifest**: Instalabilidad PWA
- **Crypto API**: Hashes SHA-256

### **Librerías**
- **jsPDF**: Generación de reportes PDF

### **Arquitectura**
- Progressive Web App (PWA)
- Offline-first con Service Worker
- IndexedDB para almacenamiento local
- Event-driven architecture

---

## 📊 Estructura del Proyecto

```
caja-de-cristal-pwa/
├── index.html              # Punto de entrada
├── manifest.json           # Configuración PWA
├── sw.js                   # Service Worker
├── css/
│   └── style.css           # Estilos globales y responsive
├── js/
│   ├── app.js              # Lógica principal
│   ├── db.js               # IndexedDB Manager
│   ├── pdf.js              # Generación de PDFs
│   ├── utils.js            # Utilidades
│   └── install.js          # PWA Installation
└── assets/
    └── icon.svg            # Ícono de la app
```

---

## 🔒 Privacidad y Datos

- ✅ **100% Local**: Todos los datos se guardan en tu dispositivo
- ✅ **Sin Servidores**: No enviamos información a ningún servidor
- ✅ **Sin Tracking**: No usamos analytics ni cookies de terceros
- ✅ **Código Abierto**: Puedes revisar todo el código fuente

---

## 👨‍💻 Autor

<div align="center">

**Ing. John A. Skinner S.**

Ingeniero de Software especializado en PWAs y desarrollo móvil

📧 Contacto: johnskinner050@gmail.com  
🏢 Cliente: SISTROVIAL.LEGAL Peritos & Abogados

</div>

---

## 📄 Licencia

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

<div align="center">

**Caja de Cristal** - Sistema de Tesorería Profesional

*Desarrollado con ❤️ usando tecnologías web modernas*

v1.0.0 - 2026

</div>
