const PDFDocument = require('pdfkit');

/**
 * وظيفة توليد ملف PDF
 */
const generatePDF = (data, res) => {
    const doc = new PDFDocument({ margin: 50 });

    // إعداد الرد ليكون ملف PDF جاهز للتحميل
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=estimation_report.pdf');

    doc.pipe(res);

    // --- محتوى الملف ---
    doc.fontSize(22).fillColor('#1d4ed8').text('Smart Construction Estimator', { align: 'center' });
    doc.moveDown();
    doc.strokeColor('#cccccc').moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    doc.fontSize(12).fillColor('black').text(`Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Budget Type: ${data.budget_type.toUpperCase()}`);
    doc.text(`Exchange Rate: ${data.exchange_rate_used} DZD`);
    doc.moveDown();

    doc.fontSize(16).text('Détails des Matériaux:', { underline: true });
    data.detail_materiaux.forEach(mat => {
        doc.fontSize(11).text(`- ${mat.material_name}: ${mat.subtotal_dzd} DZD`);
    });

    doc.moveDown();
    doc.fontSize(18).fillColor('#1d4ed8').text(`Total Global: ${data.total_budget_dzd} DZD`, { align: 'right' });

    doc.end();
};

module.exports = { generatePDF };