const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const handlebars = require('handlebars');

handlebars.registerHelper('lt', (a, b) => a < b);

class PdfGenerator {
    constructor() {
        this.browser = null;
        this.isInitialized = false;
    }

    async initialize() {
    if (this.isInitialized && this.browser && this.browser.connected) {
        return;
    }
    
    try {
        const launchOptions = {
            headless: 'new',
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-web-security',
                '--font-render-hinting=none',
                '--single-process'
            ],
            timeout: 60000
        };

        // Sur Render, utiliser le Chrome système
        if (process.env.NODE_ENV === 'production') {
            launchOptions.executablePath = '/usr/bin/chromium-browser' 
                || '/usr/bin/chromium'
                || '/usr/bin/google-chrome';
        }

        this.browser = await puppeteer.launch(launchOptions);
        
        this.browser.on('disconnected', () => {
            this.isInitialized = false;
        });
        this.isInitialized = true;
    } catch (error) {
        this.isInitialized = false;
        throw error;
    }
}
    async generateFromTemplate(cv, mappedData) {
        await this.initialize();
        const page = await this.browser.newPage();
        try {
            const validTemplates = [
                'alfred-style', 
                'benjamin-style', 
                'lorna-style', 
                'sacha-style', 
                'sebastian-style', 
                'thomas-style'
            ];
            let templateName = cv.template_name;
            if (!validTemplates.includes(templateName)) {
                templateName = 'thomas-style'; 
            }
            const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
            const templateHtml = await fs.readFile(templatePath, 'utf-8');
            const template = handlebars.compile(templateHtml);
            const finalHtml = template(mappedData);
            await page.setContent(finalHtml, {
                waitUntil: 'networkidle0',
                timeout: 60000
            });
            await page.evaluateHandle('document.fonts.ready');
            await new Promise(resolve => setTimeout(resolve, 500));
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: { 
                    top: '0', 
                    right: '0', 
                    bottom: '0', 
                    left: '0' 
                }
            });
            return pdfBuffer;
        } catch (error) {
            throw error;
        } finally {
            if (page) {
                await page.close();
            }
        }
    }
    async generate(htmlContent, options = {}) {
        await this.initialize();
        const page = await this.browser.newPage();
        try {
            await page.setViewport({
                width: 1200,
                height: 1600,
                deviceScaleFactor: 2,
            });
            await page.goto('about:blank', { waitUntil: 'domcontentloaded', timeout: 10000 });
            const cleanHtml = this.sanitizeHtml(htmlContent);
            await page.setContent(cleanHtml, {
                waitUntil: 'networkidle0',
                timeout: 45000,
            });
            await page.evaluateHandle('document.fonts.ready');
            await new Promise(resolve => setTimeout(resolve, 1000));
            const pdfBuffer = await page.pdf({
                format: options.format || 'A4',
                printBackground: true,
                margin: {
                    top: options.marginTop || '20mm',
                    right: options.marginRight || '15mm',
                    bottom: options.marginBottom || '20mm',
                    left: options.marginLeft || '15mm',
                },
                preferCSSPageSize: false,
                displayHeaderFooter: false,
            });
            return pdfBuffer;
        } catch (error) {
            throw new Error(`Échec génération PDF: ${error.message}`);
        } finally {
            if (page) {
                await page.close();
            }
        }
    }
    sanitizeHtml(html) {
        if (!html || typeof html !== 'string') {
            throw new Error('Le HTML fourni est invalide');
        }
        let cleanHtml = html;
        cleanHtml = cleanHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        cleanHtml = cleanHtml.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
        if (!cleanHtml.includes('<!DOCTYPE') && !cleanHtml.includes('<html')) {
            cleanHtml = `
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                </head>
                <body>
                    ${cleanHtml}
                </body>
                </html>
            `;
        }
        return cleanHtml;
    }
    async generateTestPdf() {
        const testHtml = `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Test PDF - CVGenius</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        padding: 40px; 
                        background: white;
                        color: #2c3e50;
                    }
                    h1 { 
                        color: #2563eb; 
                        margin-bottom: 20px;
                        font-size: 32pt;
                    }
                    p { 
                        line-height: 1.6; 
                        margin-bottom: 15px;
                        font-size: 11pt;
                    }
                    .info-box {
                        background: #eff6ff;
                        padding: 20px;
                        border-radius: 8px;
                        border-left: 4px solid #2563eb;
                        margin-top: 30px;
                    }
                    .success {
                        color: #059669;
                        font-weight: 600;
                    }
                </style>
            </head>
            <body>
                <h1>Test de Génération PDF - CVGenius</h1>
                
                <p class="success">✅ Si vous voyez ce message, la génération PDF fonctionne parfaitement !</p>
                
                <p><strong>Date et heure:</strong> ${new Date().toLocaleString('fr-FR')}</p>
                
                <div class="info-box">
                    <p><strong>Système de génération PDF:</strong></p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li>Puppeteer initialisé avec succès</li>
                        <li>Templates Handlebars fonctionnels</li>
                        <li>Génération HTML brut opérationnelle</li>
                        <li>Timeout optimisé (45 secondes)</li>
                    </ul>
                </div>
                
                <p style="margin-top: 30px; font-size: 9pt; color: #6b7280;">
                    CVGenius © ${new Date().getFullYear()} - Système de génération PDF optimisé
                </p>
            </body>
            </html>
        `;

        return await this.generate(testHtml, {
            format: 'A4',
            marginTop: '20mm',
            marginRight: '20mm',
            marginBottom: '20mm',
            marginLeft: '20mm',
        });
    }
    async cleanup() {
        if (this.browser) {
            try {
                await this.browser.close();
                this.browser = null;
                this.isInitialized = false;
            } catch (error) {}
        }
    }
}
const generator = new PdfGenerator();
process.on('SIGINT', async () => {
    await generator.cleanup();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    await generator.cleanup();
    process.exit(0);
});
module.exports = { 
    getPdfGenerator: () => generator 
};
