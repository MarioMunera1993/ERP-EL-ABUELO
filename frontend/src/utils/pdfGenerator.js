import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = (sale) => {
    const doc = new jsPDF();

    // Configuración de Estilos
    const primaryColor = [29, 78, 216]; // Blue 700
    const margin = 20;

    // Encabezado
    doc.setFontSize(22);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text("FERRETERÍA EL ABUELO", margin, 25);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text("NIT: 900.123.456-7", margin, 32);
    doc.text("Dirección: Calle Falsa 123, Ciudad", margin, 37);
    doc.text("Teléfono: 300 123 4567", margin, 42);

    // Información de la Factura (Derecha)
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("FACTURA DE VENTA", 120, 25);

    doc.setFontSize(12);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`${sale.invoiceNumber}`, 120, 32);

    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text(`Fecha: ${sale.date}`, 120, 38);
    doc.text(`Vendedor: ${sale.sellerName}`, 120, 43);

    // Información del Cliente
    doc.setDrawColor(230);
    doc.line(margin, 52, 190, 52);

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("CLIENTE:", margin, 62);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(sale.clientName, margin, 68);
    doc.text(`NIT/CC: ${sale.clientTaxId}`, margin, 73);

    // Detalle de Productos
    const tableData = sale.details.map(item => [
        item.productName,
        item.quantity,
        `$${item.unitPrice.toLocaleString()}`,
        item.discount > 0 ? `-$${item.discount.toLocaleString()}` : '-',
        `${item.ivaPercentage}%`,
        `$${item.lineTotal.toLocaleString()}`
    ]);

    autoTable(doc, {
        startY: 85,
        head: [['Producto', 'Cant.', 'Precio Unit.', 'Dcto.', 'IVA', 'Subtotal']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: primaryColor, halign: 'center' },
        columnStyles: {
            1: { halign: 'center' },
            2: { halign: 'right' },
            3: { halign: 'right' },
            4: { halign: 'center' },
            5: { halign: 'right' }
        },
        styles: { fontSize: 8 },
        margin: { left: margin, right: margin }
    });

    // Sección de Totales (Corregida alineación para evitar solapamiento)
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 150;
    const totalsXLabel = 120; // Etiqueta comienza aquí
    const totalsXValue = 190; // Valor termina aquí (derecha)

    doc.setDrawColor(240);
    doc.line(totalsXLabel, finalY - 5, totalsXValue, finalY - 5);

    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.setFont("helvetica", "normal");

    doc.text(`SUBTOTAL:`, totalsXLabel, finalY);
    doc.text(`$${sale.subtotal.toLocaleString()}`, totalsXValue, finalY, { align: 'right' });

    doc.text(`IVA:`, totalsXLabel, finalY + 6);
    doc.text(`$${sale.ivaTotal.toLocaleString()}`, totalsXValue, finalY + 6, { align: 'right' });

    doc.text(`DESCUENTO:`, totalsXLabel, finalY + 12);
    doc.setTextColor(220, 38, 38); // Rojo para descuento
    doc.text(`- $${sale.discount.toLocaleString()}`, totalsXValue, finalY + 12, { align: 'right' });

    // Línea final antes del TOTAL
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(totalsXLabel, finalY + 15, totalsXValue, finalY + 15);

    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL A PAGAR:`, totalsXLabel, finalY + 23);
    doc.text(`$${sale.total.toLocaleString()}`, totalsXValue, finalY + 23, { align: 'right' });

    // Pie de página
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Gracias por su compra en Ferretería El Abuelo.", 105, 280, { align: 'center' });
    doc.text("¡Ferretería El Abuelo - Construyendo juntos!", 105, 285, { align: 'center' });

    // Descargar con el número de factura correcto
    doc.save(`${sale.invoiceNumber}.pdf`);
};
