const PDFDocument = require('pdfkit');
const path = require('path');

function generateCertificate(studentName, courseName, completionDate) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ layout: 'landscape', size: 'A4', margin: 0 });
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      // Background with gradient-like effect
      doc.rect(0, 0, pageWidth, pageHeight).fill('#f8fafc');

      // Border
      doc.rect(20, 20, pageWidth - 40, pageHeight - 40).lineWidth(3).stroke('#0ea5e9');
      doc.rect(25, 25, pageWidth - 50, pageHeight - 50).lineWidth(1).stroke('#38bdf8');

      // Top decorative line
      doc.moveTo(60, 65).lineTo(pageWidth - 60, 65).lineWidth(2).stroke('#0ea5e9');

      // Certificate title
      doc.fontSize(14).fillColor('#64748b').font('Helvetica-Bold')
        .text('CERTIFICATE OF COMPLETION', 0, 80, { align: 'center', width: pageWidth });

      // Awarded to
      doc.fontSize(12).fillColor('#94a3b8').font('Helvetica')
        .text('This is to certify that', 0, 120, { align: 'center', width: pageWidth });

      // Student name
      doc.fontSize(32).fillColor('#0f172a').font('Helvetica-Bold')
        .text(studentName, 0, 150, { align: 'center', width: pageWidth });

      // Has completed
      doc.fontSize(12).fillColor('#94a3b8').font('Helvetica')
        .text('has successfully completed the course', 0, 200, { align: 'center', width: pageWidth });

      // Course name
      doc.fontSize(24).fillColor('#0ea5e9').font('Helvetica-Bold')
        .text(courseName, 0, 230, { align: 'center', width: pageWidth });

      // Description
      doc.fontSize(11).fillColor('#64748b').font('Helvetica')
        .text('through City Building Engineering Company Ltd\'s professional training program.', 0, 270, { align: 'center', width: pageWidth });

      // Completion date
      const formattedDate = completionDate ? new Date(completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      doc.fontSize(11).fillColor('#64748b').font('Helvetica')
        .text(`Date: ${formattedDate}`, 0, 310, { align: 'center', width: pageWidth });

      // Bottom decorative line
      doc.moveTo(60, pageHeight - 100).lineTo(pageWidth - 60, pageHeight - 100).lineWidth(2).stroke('#0ea5e9');

      // Signature line
      doc.fontSize(10).fillColor('#0f172a').font('Helvetica')
        .text('___________________________', 80, pageHeight - 80);
      doc.fontSize(10).fillColor('#64748b').font('Helvetica')
        .text('Authorized Signature', 80, pageHeight - 65, { width: 200 });

      // Company info
      doc.fontSize(14).fillColor('#0f172a').font('Helvetica-Bold')
        .text('City Building Engineering Company Ltd', 0, pageHeight - 80, { align: 'right', width: pageWidth - 80 });
      doc.fontSize(9).fillColor('#64748b').font('Helvetica')
        .text('Kigali, Rwanda | Professional Software Training', 0, pageHeight - 60, { align: 'right', width: pageWidth - 80 });

      // Certificate ID
      const certId = 'CBE-' + Date.now().toString(36).toUpperCase();
      doc.fontSize(8).fillColor('#94a3b8').font('Helvetica')
        .text(`Certificate ID: ${certId}`, 0, 40, { align: 'center', width: pageWidth });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generateCertificate };
