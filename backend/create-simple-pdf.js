const PDFDocument = require('pdfkit');
const fs = require('fs');

// Créer un PDF simple avec PDFKit
const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('test-simple-cv.pdf'));

doc.fontSize(20).text('JEAN DUPONT', 100, 100);
doc.fontSize(12).text('Développeur Full Stack', 100, 130);
doc.text('Email: jean.dupont@email.com', 100, 150);
doc.text('Téléphone: 06 12 34 56 78', 100, 170);

doc.fontSize(16).text('EXPÉRIENCE', 100, 220);
doc.fontSize(12).text('2020-2023 : Développeur chez TechCorp', 100, 250);
doc.text('Développement applications web avec Node.js et React', 100, 270);

doc.fontSize(16).text('FORMATION', 100, 320);
doc.fontSize(12).text('2018-2020 : Master Informatique', 100, 350);

doc.fontSize(16).text('COMPÉTENCES', 100, 400);
doc.fontSize(12).text('JavaScript, Node.js, React, PostgreSQL', 100, 430);

doc.end();

console.log('✅ PDF créé : test-simple-cv.pdf');