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

    // HEADER
    doc.setFontSize(20);
    doc.setTextColor(0, 150, 255);
    doc.text('💎 CAJA DE CRISTAL', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('SISTROVIAL.LEGAL Peritos & Abogados', 105, 28, { align: 'center' });

    // DATE & TITLE
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`Reporte Mensual - ${getMonthName(mes)}`, 105, 40, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleString('es-CO')}`, 105, 46, { align: 'center' });

    // LINE
    doc.setDrawColor(200);
    doc.line(20, 50, 190, 50);

    // RESUMEN EJECUTIVO
    let y = 60;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('RESUMEN EJECUTIVO', 20, y);
    
    y += 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    doc.text(`Total Ingresos:`, 30, y);
    doc.setTextColor(0, 150, 0);
    doc.text(formatMoney(ingresos), 100, y);
    
    y += 7;
    doc.setTextColor(0);
    doc.text(`Total Egresos:`, 30, y);
    doc.setTextColor(200, 0, 0);
    doc.text(formatMoney(egresos), 100, y);
    
    y += 7;
    doc.setTextColor(0);
    doc.setFont(undefined, 'bold');
    doc.text(`Balance del Mes:`, 30, y);
    doc.setTextColor(balance >= 0 ? 0 : 200, balance >= 0 ? 150 : 0, 0);
    doc.text(formatMoney(balance), 100, y);

    // ESTADO DE CAJA
    y += 15;
    doc.setTextColor(0);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('ESTADO DE CAJA', 20, y);
    
    y += 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    doc.text(`Caja Real:`, 30, y);
    doc.text(formatMoney(stats.cajaReal), 100, y);
    
    y += 7;
    doc.text(`Pendientes:`, 30, y);
    doc.text(formatMoney(stats.pendientes), 100, y);
    
    y += 7;
    doc.text(`Deuda Socios:`, 30, y);
    doc.text(formatMoney(stats.deudaSocios), 100, y);

    // TRANSACCIONES
    y += 15;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('TRANSACCIONES DEL MES', 20, y);
    
    y += 8;
    doc.setFontSize(9);
    
    // Table headers
    doc.setFont(undefined, 'bold');
    doc.text('Fecha', 20, y);
    doc.text('Concepto', 45, y);
    doc.text('Categoría', 100, y);
    doc.text('Monto', 150, y);
    
    y += 5;
    doc.line(20, y, 190, y);
    
    // Table rows
    doc.setFont(undefined, 'normal');
    transacciones.slice(0, 20).forEach(t => {
        y += 7;
        
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        
        doc.text(t.fecha, 20, y);
        doc.text(t.concepto.substring(0, 20), 45, y);
        doc.text(t.categoria, 100, y);
        doc.setTextColor(t.tipo === 'ingreso' ? 0 : 200, t.tipo === 'ingreso' ? 150 : 0, 0);
        doc.text(formatMoney(t.monto), 150, y);
        doc.setTextColor(0);
    });

    // ESTADO DE SOCIOS
    if (y > 200) {
        doc.addPage();
        y = 20;
    } else {
        y += 15;
    }

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('ESTADO DE SOCIOS', 20, y);
    
    y += 8;
    doc.setFontSize(9);
    
    // Socios headers
    doc.setFont(undefined, 'bold');
    doc.text('Socio', 20, y);
    doc.text('Deuda', 100, y);
    doc.text('Estado', 150, y);
    
    y += 5;
    doc.line(20, y, 190, y);
    
    // Socios rows
    doc.setFont(undefined, 'normal');
    socios.forEach(s => {
        y += 7;
        
        doc.text(`${s.avatar} ${s.nombre}`, 20, y);
        doc.text(formatMoney(s.deuda), 100, y);
        
        const estado = s.deuda === 0 ? '🟢 Al Día' : 
                       s.deuda < 500000 ? '🟡 Parcial' : 
                       '🔴 Pendiente';
        doc.text(estado, 150, y);
    });

    // HASH & FOOTER
    const hashData = { mes, transacciones: transacciones.length, balance };
    const hash = await calculateHash(hashData);
    
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Hash de Integridad: ${hash.substring(0, 32)}...`, 20, 280);
    doc.text('MES AUDITADO Y CERRADO', 105, 287, { align: 'center' });
    
    // Save PDF
    doc.save(`Reporte-${mes}.pdf`);
}
