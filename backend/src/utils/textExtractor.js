const fs = require('fs').promises;
const mammoth = require('mammoth');
const path = require('path');
const PDFParser = require('pdf2json');

class TextExtractor {
  static async extract(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.pdf') {
      return await this.extractFromPdf(filePath);
    } else if (ext === '.docx') {
      return await this.extractFromDocx(filePath);
    } else {
      throw new Error('Format non supporté');
    }
  }
  static async extractFromPdf(filePath) {
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();
      pdfParser.on('pdfParser_dataError', (err) => {
        reject(new Error('Impossible d\'extraire le texte du PDF'));
      });
      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        let text = '';
        pdfData.Pages.forEach(page => {
          if (page.Texts) {
            page.Texts.forEach(textItem => {
              if (textItem.R && textItem.R[0] && textItem.R[0].T) {
                try {
                  text += decodeURIComponent(textItem.R[0].T) + ' ';
                } catch (e) {
                  text += textItem.R[0].T + ' ';
                }
              }
            });
          }
        });

        resolve({
          text: this.cleanText(text),
          numPages: pdfData.Pages.length,
          info: { format: 'PDF' }
        });
      });
      pdfParser.loadPDF(filePath);
    });
  }
  static async extractFromDocx(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      const text = result.value;
      const wordsCount = text.split(/\s+/).length;
      const estimatedPages = Math.ceil(wordsCount / 500);

      return {
        text: this.cleanText(text),
        numPages: estimatedPages,
        info: { format: 'DOCX' }
      };
    } catch (error) {
      throw new Error('Impossible d\'extraire le texte du DOCX');
    }
  }
  static cleanText(text) {
    if (!text) return '';
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
}

module.exports = TextExtractor;