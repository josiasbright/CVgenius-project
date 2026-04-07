const PDFParser = require('pdf2json');

function testPDF2JSON() {
  const pdfParser = new PDFParser();

  pdfParser.on('pdfParser_dataError', (err) => {
    console.error('❌ Erreur:', err.parserError);
  });

  pdfParser.on('pdfParser_dataReady', (pdfData) => {
    console.log('✅ PDF parsé avec succès !');
    console.log('📊 Nombre de pages:', pdfData.Pages.length);
    
    let text = '';
    pdfData.Pages.forEach((page, index) => {
      console.log(`\nPage ${index + 1}:`, page.Texts?.length || 0, 'éléments');
      
      if (page.Texts) {
        page.Texts.forEach(textItem => {
          if (textItem.R && textItem.R[0] && textItem.R[0].T) {
            text += decodeURIComponent(textItem.R[0].T) + ' ';
          }
        });
      }
    });

    console.log('\n📝 Texte extrait:');
    console.log(text.substring(0, 300));
    console.log('\n✅ Total:', text.length, 'caractères');
  });

  pdfParser.loadPDF('test-simple-cv.pdf');
}

testPDF2JSON();