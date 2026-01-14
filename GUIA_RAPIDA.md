# 📱 GUÍA RÁPIDA - Caja de Cristal PWA

## 🚀 ACCESO RÁPIDO

### Link de la App
```
https://prismalab-arm64.github.io/Caja-de-Cristal-PWA/
```

### 🔐 PIN de Acceso
```
621808
```

---

## ⚡ PRIMEROS PASOS

### 1️⃣ Abrir la App
- Ingresa a: https://prismalab-arm64.github.io/Caja-de-Cristal-PWA/
- Verás la pantalla de bienvenida con el logo
- Introduce el PIN: **621808**

### 2️⃣ Dashboard Principal
Verás 3 indicadores principales:
- 💰 **Caja Real:** Saldo total actual
- ⏳ **Pendientes:** Pagos por recibir
- 👥 **Deuda Socios:** Deuda total acumulada

### 3️⃣ Crear tu Primera Transacción
1. Click en **"+ Nueva Transacción"**
2. Selecciona tipo: **Ingreso** o **Egreso**
3. Elige categoría (cambia según el tipo)
4. Escribe el concepto: Ej: "Honorarios caso 123"
5. Ingresa el monto: Ej: 150000 o 150000.50
6. Selecciona fecha y método de pago
7. Click en **"Guardar Transacción"**

---

## 👥 GESTIÓN DE SOCIOS

### Socios Fijos (NO se pueden eliminar)
1. **Ángel Peralta** (M1) - Avatar masculino
2. **Andrea Cano** (F1) - Avatar femenino
3. **Sandra Herrera** (F2) - Avatar femenino

### Agregar Nuevo Socio
1. Ve a la sección **"Socios"**
2. Click en **"+ Nuevo Socio"**
3. Escribe el nombre completo
4. Selecciona un avatar
5. Ingresa deuda inicial (opcional)
6. Click en **"Guardar Socio"**

### 🚦 Semáforo de Skinner (Estado de Deuda)
- 🟢 **Verde (Al Día):** Deuda = $0
- 🟡 **Amarillo (Abono Parcial):** Deuda $1 - $499,999
- 🔴 **Rojo (Pendiente):** Deuda ≥ $500,000

### Eliminar Socio
- Solo se pueden eliminar socios que NO sean fijos
- Click en el botón **"Eliminar"** del socio
- Confirma la acción

---

## 💾 BACKUP DE DATOS

### ⚠️ IMPORTANTE
Los datos se guardan SOLO en tu navegador. Si borras los datos del navegador, SE PERDERÁN.

### Exportar Backup (Recomendado cada semana)
1. Ve a la sección **"Backup"**
2. Click en **"💾 Exportar Backup"**
3. Se descargará un archivo JSON con todos tus datos
4. Guárdalo en un lugar seguro (Google Drive, USB, etc.)

### Importar Backup
1. Ve a la sección **"Backup"**
2. Click en **"📥 Importar Backup"**
3. Selecciona el archivo JSON previamente exportado
4. Confirma la importación
5. Todos tus datos se restaurarán

---

## 🔍 FILTROS Y BÚSQUEDA

### En Transacciones
- **Por Tipo:** Filtrar por Ingresos o Egresos
- **Por Mes:** Seleccionar mes específico
- **Por Búsqueda:** Buscar por concepto o categoría

---

## 📱 INSTALAR LA APP

### Android
1. Abrir en **Chrome**
2. Menú (⋮) → **"Agregar a pantalla de inicio"**
3. Confirmar instalación
4. ¡Listo! Úsala como una app nativa

### iPhone/iPad
1. Abrir en **Safari**
2. Botón "Compartir" (□↑)
3. **"Agregar a pantalla de inicio"**
4. Confirmar instalación
5. ¡Listo! Úsala como una app nativa

### PC (Windows/Mac/Linux)
1. Abrir en **Chrome** o **Edge**
2. Click en el ícono **⊕** en la barra de direcciones
3. **"Instalar"**
4. ¡Listo! Se abrirá como app de escritorio

---

## 🔒 SEGURIDAD

### Bloqueo Automático
- La app se bloquea después de **5 minutos** de inactividad
- Deberás ingresar el PIN nuevamente
- Esto protege tus datos si dejas el dispositivo desatendido

### Cambiar el PIN
Si eres el administrador y quieres cambiar el PIN:
1. Edita el archivo `js/auth.js`
2. Busca la línea donde se valida el PIN
3. Cambia el valor `621808` por tu nuevo PIN
4. Guarda y vuelve a desplegar

---

## ❓ PREGUNTAS FRECUENTES

### ¿Necesito internet para usar la app?
**NO.** La app funciona 100% offline después de la primera carga.

### ¿Mis datos están seguros?
**SÍ.** Todos los datos se almacenan localmente en tu dispositivo. No se envían a ningún servidor externo.

### ¿Puedo usar la app en varios dispositivos?
**SÍ.** Pero los datos NO se sincronizan automáticamente. Debes exportar el backup de un dispositivo e importarlo en el otro.

### ¿Qué pasa si borro los datos del navegador?
**SE PIERDEN LOS DATOS.** Por eso es MUY IMPORTANTE hacer backups regularmente.

### ¿Puedo editar o eliminar transacciones?
**Aún no.** Esta funcionalidad estará disponible en la versión 1.4.0 (próximamente).

### ¿Cuántos socios puedo agregar?
Puedes agregar hasta **5 socios adicionales** (además de los 3 fijos), para un total de **8 socios**.

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### La app no carga / Pantalla negra
1. Cierra completamente el navegador
2. Vuelve a abrir la app
3. Si persiste, limpia la caché del navegador
4. Vuelve a cargar la app

### El PIN no funciona
- Verifica que estés ingresando: **621808**
- Si cambiaste el PIN, usa el nuevo
- Si olvidaste el PIN, contacta al administrador

### Los datos no se guardan
1. Verifica que el navegador permita almacenamiento local
2. No uses modo incógnito/privado
3. Asegúrate de tener espacio disponible en el dispositivo

### La app se cierra sola
Esto es normal después de 5 minutos de inactividad (bloqueo automático por seguridad).

---

## 📞 CONTACTO Y SOPORTE

### Desarrollador
**Ing. John A. Skinner S.**
- Email: johnskinner050@gmail.com

### Cliente
**SISTROVIAL.LEGAL Peritos y Abogados**
- Email: info@sistrovial.legal

---

## 🎯 CONSEJOS ÚTILES

### ✅ Buenas Prácticas
- 💾 Exporta backup cada **semana**
- 📝 Registra transacciones **diariamente**
- 🔍 Revisa el semáforo de socios **semanalmente**
- 🔒 No compartas el PIN con usuarios no autorizados
- 📱 Instala la app para acceso rápido

### ⚠️ Evita
- ❌ No uses modo incógnito (los datos no se guardarán)
- ❌ No borres los datos del navegador sin backup
- ❌ No compartas el PIN públicamente
- ❌ No uses caracteres especiales en nombres de socios

---

## 🎉 ¡LISTO PARA USAR!

Ya conoces lo básico de Caja de Cristal PWA.

**Recuerda:**
- 🔐 PIN: **621808**
- 💾 Backup: **Cada semana**
- 📱 Link: **https://prismalab-arm64.github.io/Caja-de-Cristal-PWA/**

---

**Versión:** 1.3.0  
**Última actualización:** 14 de Enero, 2026  
**Desarrollado por:** Ing. John A. Skinner S.  
**Para:** SISTROVIAL.LEGAL Peritos y Abogados
