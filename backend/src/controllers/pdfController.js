const { getPdfGenerator } = require('../utils/pdfGenerator');
const Cv = require('../models/Cv');
const CvDataMapper = require('../utils/cvDataMapper');

async function generate(req, res) {
    try {
        const cvId = req.params.id;
        const userId = req.userId;
        
        const cv = await Cv.findById(cvId, userId);

        if (!cv) {
            return res.status(404).json({
                success: false,
                error: 'CV non trouvé ou accès refusé'
            });
        }

        const mappedData = CvDataMapper.mapForTemplate(cv);

        const pdfGenerator = getPdfGenerator();
        const pdfBuffer = await pdfGenerator.generateFromTemplate(cv, mappedData);

        const safeName = `${mappedData.firstname}_${mappedData.lastname}_CV`.replace(/\s+/g, '_');
        
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
            'Content-Disposition': `attachment; filename="${safeName}.pdf"`,
            'Cache-Control': 'no-cache'
        });

        return res.send(pdfBuffer);

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Une erreur est survenue lors de la génération du PDF',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
async function preview(req, res) {
    return generate(req, res);
}
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