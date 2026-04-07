/**
 * 🎯 PDF Controller - CVGenius
 * Gère la logique de récupération et d'envoi des documents PDF
 */

const { getPdfGenerator } = require('../utils/pdfGenerator');
const Cv = require('../models/Cv');
const CvDataMapper = require('../utils/cvDataMapper');

/**
 * 📄 POST /api/pdf/generate/:id
 * Récupère les données, les mappe et génère le PDF final
 */
async function generate(req, res) {
    const startTime = Date.now();
    
    try {
        const cvId = req.params.id;
        const userId = req.userId; // Récupéré via authMiddleware

        console.log(`🚀 Début génération PDF pour CV ID: ${cvId}`);

        // 1️⃣ RÉCUPÉRATION : On cherche le CV dans PostgreSQL
        // On passe userId pour vérifier que le CV appartient bien au demandeur
        const cv = await Cv.findById(cvId, userId);

        if (!cv) {
            console.warn(`⚠️ CV ${cvId} non trouvé pour l'user ${userId}`);
            return res.status(404).json({
                success: false,
                error: 'CV non trouvé ou accès refusé'
            });
        }

        // 2️⃣ MAPPING : On transforme les données SQL (cv_data) en variables pour le Template
        // C'est ici que first_name devient firstname pour ton template Alfred
        const mappedData = CvDataMapper.mapForTemplate(cv);

        // 3️⃣ GÉNÉRATION : On demande au moteur Puppeteer de fabriquer le PDF
        const pdfGenerator = getPdfGenerator();
        const pdfBuffer = await pdfGenerator.generateFromTemplate(cv, mappedData);

        // 4️⃣ ENVOI : On prépare les headers et on envoie le flux de données
        const duration = Date.now() - startTime;
        console.log(`✅ PDF généré avec succès en ${duration}ms (${pdfBuffer.length} bytes)`);

        // Nom du fichier sécurisé
        const safeName = `${mappedData.firstname}_${mappedData.lastname}_CV`.replace(/\s+/g, '_');
        
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
            'Content-Disposition': `attachment; filename="${safeName}.pdf"`,
            'Cache-Control': 'no-cache'
        });

        return res.send(pdfBuffer);

    } catch (error) {
        console.error('❌ Erreur critique dans pdfController:', error);
        
        return res.status(500).json({
            success: false,
            error: 'Une erreur est survenue lors de la génération du PDF',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * 👁️ GET /api/pdf/preview/:id
 * Même logique que generate mais pour l'affichage dans le navigateur
 */
async function preview(req, res) {
    // On réutilise la fonction generate car elle gère déjà l'envoi du buffer
    return generate(req, res);
}

/**
 * 🧪 GET /api/pdf/test
 * Vérifie que le service Puppeteer est vivant
 */
async function test(req, res) {
    try {
        const pdfGenerator = getPdfGenerator();
        const pdfBuffer = await pdfGenerator.generateTestPdf();
        
        res.set({ 'Content-Type': 'application/pdf' });
        return res.send(pdfBuffer);
    } catch (error) {
        return res.status(500).json({ error: 'Test échoué', message: error.message });
    }
}

module.exports = {
    generate,
    preview,
    test
};