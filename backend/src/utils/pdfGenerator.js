/**
 * ================================================
 * PDF GENERATOR - CVGenius
 * ================================================
 * Génère des PDFs pour :
 * - CVs (avec templates Handlebars)
 * - Lettres de motivation (HTML brut)
 * - Documents de test
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const handlebars = require('handlebars');

// ================================================
// HELPERS HANDLEBARS
// ================================================

// Helper pour comparer dans les templates
handlebars.registerHelper('lt', (a, b) => a < b);

// ================================================
// CLASSE PDF GENERATOR
// ================================================

class PdfGenerator {
    constructor() {
        this.browser = null;
        this.isInitialized = false;
    }

    // ================================================
    // INITIALISATION DU NAVIGATEUR
    // ================================================
    async initialize() {
        // Vérifier si le navigateur existe ET est encore connecté
        if (this.isInitialized && this.browser && this.browser.connected) {
            return;
        }

        console.log("🌐 Lancement (ou relance) du navigateur Puppeteer...");
        
        try {
            this.browser = await puppeteer.launch({
                headless: 'new',
                args: [
                    '--no-sandbox', 
                    '--disable-setuid-sandbox', 
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--disable-web-security',
                    '--font-render-hinting=none'
                ],
                timeout: 60000
            });
            
            // Écouter si le navigateur se ferme inopinément
            this.browser.on('disconnected', () => {
                console.warn("⚠️ Puppeteer s'est déconnecté.");
                this.isInitialized = false;
            });

            this.isInitialized = true;
            console.log("✅ Puppeteer initialisé avec succès");
            
        } catch (error) {
            console.error("❌ Échec du lancement de Puppeteer:", error);
            this.isInitialized = false;
            throw error;
        }
    }

    // ================================================
    // GÉNÉRATION PDF DEPUIS TEMPLATE (Pour les CVs)
    // ================================================
    async generateFromTemplate(cv, mappedData) {
        await this.initialize();
        const page = await this.browser.newPage();

        try {
            // Liste des templates réels disponibles
            const validTemplates = [
                'alfred-style', 
                'benjamin-style', 
                'lorna-style', 
                'sacha-style', 
                'sebastian-style', 
                'thomas-style'
            ];

            // Vérifier si le template existe, sinon utiliser thomas-style par défaut
            let templateName = cv.template_name;
            if (!validTemplates.includes(templateName)) {
                console.warn(`⚠️ Template "${templateName}" inconnu. Utilisation de thomas-style.`);
                templateName = 'thomas-style'; 
            }

            console.log(`📄 Génération PDF avec template: ${templateName}`);

            // Chargement du fichier template
            const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
            const templateHtml = await fs.readFile(templatePath, 'utf-8');

            // Compilation Handlebars
            const template = handlebars.compile(templateHtml);
            const finalHtml = template(mappedData);

            // Injection du HTML dans la page
            await page.setContent(finalHtml, {
                waitUntil: 'networkidle0',
                timeout: 60000
            });

            // Attendre que les fonts soient chargées
            await page.evaluateHandle('document.fonts.ready');
            await new Promise(resolve => setTimeout(resolve, 500));

            console.log('🖨️ Génération du PDF CV...');

            // Générer le PDF
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

            console.log('✅ PDF CV généré avec succès');
            return pdfBuffer;

        } catch (error) {
            console.error('❌ Erreur génération PDF depuis template:', error);
            throw error;
        } finally {
            if (page) {
                await page.close();
            }
        }
    }

    // ================================================
    // GÉNÉRATION PDF DEPUIS HTML BRUT (Pour lettres, etc.)
    // ================================================
    async generate(htmlContent, options = {}) {
        await this.initialize();
        const page = await this.browser.newPage();

        try {
            console.log('📝 Génération PDF depuis HTML brut...');

            // Configuration de la page
            await page.setViewport({
                width: 1200,
                height: 1600,
                deviceScaleFactor: 2,
            });

            // Navigation vers page vierge
            await page.goto('about:blank', {
                waitUntil: 'domcontentloaded',
                timeout: 10000,
            });

            // Nettoyer le HTML si nécessaire
            const cleanHtml = this.sanitizeHtml(htmlContent);

            // Injection du HTML
            await page.setContent(cleanHtml, {
                waitUntil: 'networkidle0',
                timeout: 45000,
            });

            // Attendre que les fonts soient chargées
            await page.evaluateHandle('document.fonts.ready');
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('🖨️ Génération du PDF...');

            // Générer le PDF avec les options fournies
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

            console.log('✅ PDF généré avec succès');
            return pdfBuffer;

        } catch (error) {
            console.error('❌ Erreur génération PDF:', error);
            throw new Error(`Échec génération PDF: ${error.message}`);
        } finally {
            if (page) {
                await page.close();
            }
        }
    }

    // ================================================
    // NETTOYAGE DU HTML
    // ================================================
    sanitizeHtml(html) {
        if (!html || typeof html !== 'string') {
            throw new Error('Le HTML fourni est invalide');
        }

        let cleanHtml = html;

        // Supprimer les scripts (sécurité)
        cleanHtml = cleanHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

        // Supprimer les iframes
        cleanHtml = cleanHtml.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

        // Ajouter une structure HTML de base si absente
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

    // ================================================
    // GÉNÉRATION PDF DE TEST
    // ================================================
    async generateTestPdf() {
        console.log('🧪 Génération d\'un PDF de test...');
        
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

    // ================================================
    // NETTOYAGE ET FERMETURE
    // ================================================
    async cleanup() {
        if (this.browser) {
            console.log('🧹 Fermeture du navigateur Puppeteer...');
            try {
                await this.browser.close();
                this.browser = null;
                this.isInitialized = false;
                console.log('✅ Navigateur fermé proprement');
            } catch (error) {
                console.error('⚠️ Erreur lors de la fermeture du navigateur:', error);
            }
        }
    }
}

// ================================================
// SINGLETON - Une seule instance pour toute l'app
// ================================================

const generator = new PdfGenerator();

// ================================================
// FERMETURE PROPRE DU PROCESSUS
// ================================================

process.on('SIGINT', async () => {
    console.log('\n🛑 Arrêt du serveur (SIGINT)...');
    await generator.cleanup();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Arrêt du serveur (SIGTERM)...');
    await generator.cleanup();
    process.exit(0);
});

// ================================================
// EXPORT
// ================================================

module.exports = { 
    getPdfGenerator: () => generator 
};
