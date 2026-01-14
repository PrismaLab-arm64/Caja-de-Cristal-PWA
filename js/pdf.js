/* ============================================
   PDF GENERATOR
   Caja de Cristal PWA - using jsPDF
   ============================================ */

async function generatePDF(mes) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Get data
    const transacciones = await db.getTransacciones({ mes });
    const socios = await db.getSocios();
    const stats = await db.getStats();

    // Calculate monthly stats
    const ingresos = transacciones
        .filter(t => t.tipo === 'ingreso')
        .reduce((sum, t) => sum + t.monto, 0);

    const egresos = transacciones
        .filter(t => t.tipo === 'egreso')
        .reduce((sum, t) => sum + t.monto, 0);

    const balance = ingresos - egresos;

    // LOGO (intentar cargar desde URL)
    try {
        const logoImg = await loadImageFromUrl(LOGO_SISTROVIAL);
        doc.addImage(logoImg, 'PNG', 15, 10, 40, 15);
    } catch (error) {
        console.warn('No se pudo cargar el logo:', error);
    }

    // HEADER
    doc.setFontSize(18);
    doc.setTextColor(0, 100, 180);
    doc.text('CAJA DE CRISTAL', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text('SISTROVIAL.LEGAL Peritos & Abogados', 105, 26, { align: 'center' });

    // DATE & TITLE
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`Reporte Mensual - ${getMonthName(mes)}`, 105, 38, { align: 'center' });

    doc.setFontSize(9);
    doc.text(`Generado: ${new Date().toLocaleString('es-CO')}`, 105, 44, { align: 'center' });

    // LINE
    doc.setDrawColor(200);
    doc.line(20, 48, 190, 48);

    // RESUMEN EJECUTIVO
    let y = 56;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('RESUMEN EJECUTIVO', 20, y);
    
    y += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    doc.text(`Total Ingresos:`, 25, y);
    doc.setTextColor(0, 150, 0);
    doc.text(formatMoney(ingresos), 80, y);
    
    y += 6;
    doc.setTextColor(0);
    doc.text(`Total Egresos:`, 25, y);
    doc.setTextColor(200, 0, 0);
    doc.text(formatMoney(egresos), 80, y);
    
    y += 6;
    doc.setTextColor(0);
    doc.setFont(undefined, 'bold');
    doc.text(`Balance del Mes:`, 25, y);
    doc.setTextColor(balance >= 0 ? 0 : 200, balance >= 0 ? 150 : 0, 0);
    doc.text(formatMoney(balance), 80, y);

    // ESTADO DE CAJA
    y += 12;
    doc.setTextColor(0);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('ESTADO DE CAJA', 20, y);
    
    y += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    doc.text(`Caja Real:`, 25, y);
    doc.text(formatMoney(stats.cajaReal), 80, y);
    
    y += 6;
    doc.text(`Pendientes:`, 25, y);
    doc.text(formatMoney(stats.pendientes), 80, y);
    
    y += 6;
    doc.text(`Deuda Socios:`, 25, y);
    doc.text(formatMoney(stats.deudaSocios), 80, y);

    // TRANSACCIONES
    y += 12;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('TRANSACCIONES DEL MES', 20, y);
    
    y += 6;
    doc.setFontSize(9);
    
    // Table headers
    doc.setFont(undefined, 'bold');
    doc.text('Fecha', 20, y);
    doc.text('Concepto', 45, y);
    doc.text('Categoría', 95, y);
    doc.text('Estado', 130, y);
    doc.text('Monto', 160, y);
    
    y += 3;
    doc.line(20, y, 190, y);
    
    // Table rows
    doc.setFont(undefined, 'normal');
    transacciones.slice(0, 25).forEach(t => {
        y += 6;
        
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        
        doc.text(t.fechaFactura || t.fecha || 'N/A', 20, y);
        doc.text(t.concepto.substring(0, 18), 45, y);
        doc.text(t.categoria.substring(0, 12), 95, y);
        doc.text((t.estado || 'N/A').substring(0, 10), 130, y);
        doc.setTextColor(t.tipo === 'ingreso' ? 0 : 200, t.tipo === 'ingreso' ? 150 : 0, 0);
        doc.text(formatMoney(t.monto), 160, y);
        doc.setTextColor(0);
    });

    // ESTADO DE SOCIOS
    if (y > 200) {
        doc.addPage();
        y = 20;
    } else {
        y += 12;
    }

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('ESTADO DE SOCIOS', 20, y);
    
    y += 6;
    doc.setFontSize(9);
    
    // Socios headers
    doc.setFont(undefined, 'bold');
    doc.text('Socio', 20, y);
    doc.text('Deuda', 100, y);
    doc.text('Estado', 150, y);
    
    y += 3;
    doc.line(20, y, 190, y);
    
    // Socios rows
    doc.setFont(undefined, 'normal');
    socios.forEach(s => {
        y += 6;
        
        doc.text(s.nombre, 20, y);
        doc.text(formatMoney(s.deuda), 100, y);
        
        const estado = s.deuda === 0 ? 'Al Día' : 
                       s.deuda < 500000 ? 'Abono Parcial' : 
                       'Pendiente';
        const color = s.deuda === 0 ? [0, 150, 0] : 
                      s.deuda < 500000 ? [255, 170, 0] : 
                      [200, 0, 0];
        doc.setTextColor(...color);
        doc.text(estado, 150, y);
        doc.setTextColor(0);
    });

    // HASH & FOOTER
    const hashData = { mes, transacciones: transacciones.length, balance };
    const hash = await calculateHash(hashData);
    
    doc.setFontSize(7);
    doc.setTextColor(100);
    doc.text(`Hash de Integridad: ${hash.substring(0, 40)}...`, 20, 280);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 100, 0);
    doc.text('✓ MES AUDITADO Y CERRADO', 105, 287, { align: 'center' });
    
    // Save PDF
    doc.save(`Reporte-${mes}-SISTROVIAL.pdf`);
}

// Helper para cargar imágenes desde URL
async function loadImageFromUrl(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}
