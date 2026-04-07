// ================================================
// COVER LETTER CONTROLLER - Gestion lettres
// ================================================

const CoverLetter = require('../models/CoverLetter');
const Cv = require('../models/Cv');
const CoverLetterGenerator = require('../utils/coverLetterGenerator');
const { getPdfGenerator } = require('../utils/pdfGenerator');

class CoverLetterController {

  // ================================================
  // CREATE FROM CV - Créer lettre depuis CV
  // ================================================
  static async createFromCv(req, res, next) {
    try {
      const userId = req.userId;
      const cvId = parseInt(req.params.cvId);
      const {
        targetCompany,
        targetPosition,
        companyType,
        jobOfferText
      } = req.body;

      // Validation
      if (!targetCompany || !targetPosition || !companyType) {
        return res.status(400).json({
          error: 'Entreprise cible, poste et type entreprise requis'
        });
      }

      if (!['startup', 'pme', 'grande_entreprise'].includes(companyType)) {
        return res.status(400).json({
          error: 'Type entreprise invalide (startup, pme, grande_entreprise)'
        });
      }

      // Vérifier que le CV existe et appartient à l'user
      const cv = await Cv.findById(cvId, userId);
      if (!cv) {
        return res.status(404).json({
          error: 'CV non trouvé'
        });
      }

      // Générer le contenu de la lettre
      const content = CoverLetterGenerator.generate(cv.cv_data, {
        targetCompany,
        targetPosition,
        companyType,
        jobOfferText
      });

      // Titre automatique
      const title = `Lettre ${targetCompany} - ${targetPosition}`;

      // Créer la lettre
      const coverLetter = await CoverLetter.create(cvId, userId, {
        title,
        targetCompany,
        targetPosition,
        companyType,
        jobOfferText,
        content,
        templateName: 'classique'
      });

      res.status(201).json({
        message: 'Lettre de motivation générée avec succès',
        coverLetter: coverLetter
      });

    } catch (error) {
      next(error);
    }
  }

  // ================================================
  // GET ALL BY CV - Toutes les lettres d'un CV
  // ================================================
  static async getAllByCv(req, res, next) {
    try {
      const userId = req.userId;
      const cvId = parseInt(req.params.cvId);

      const letters = await CoverLetter.findByCvId(cvId, userId);

      res.json({
        count: letters.length,
        coverLetters: letters
      });

    } catch (error) {
      next(error);
    }
  }

  // ================================================
  // GET ALL BY USER - Toutes les lettres de l'user
  // ================================================
  static async getAllByUser(req, res, next) {
    try {
      const userId = req.userId;

      const letters = await CoverLetter.findByUserId(userId);

      res.json({
        count: letters.length,
        coverLetters: letters
      });

    } catch (error) {
      next(error);
    }
  }

  // ================================================
  // GET ONE - Une lettre spécifique
  // ================================================
  static async getOne(req, res, next) {
    try {
      const userId = req.userId;
      const id = parseInt(req.params.id);

      const letter = await CoverLetter.findById(id, userId);

      if (!letter) {
        return res.status(404).json({
          error: 'Lettre non trouvée'
        });
      }

      res.json({
        coverLetter: letter
      });

    } catch (error) {
      next(error);
    }
  }

  // ================================================
  // UPDATE - Modifier une lettre
  // ================================================
  static async update(req, res, next) {
    try {
      const userId = req.userId;
      const id = parseInt(req.params.id);
      const updates = req.body;

      const letter = await CoverLetter.update(id, userId, updates);

      if (!letter) {
        return res.status(404).json({
          error: 'Lettre non trouvée'
        });
      }

      res.json({
        message: 'Lettre mise à jour avec succès',
        coverLetter: letter
      });

    } catch (error) {
      next(error);
    }
  }

  // ================================================
  // DELETE - Supprimer une lettre
  // ================================================
  static async delete(req, res, next) {
    try {
      const userId = req.userId;
      const id = parseInt(req.params.id);

      const deleted = await CoverLetter.delete(id, userId);

      if (!deleted) {
        return res.status(404).json({
          error: 'Lettre non trouvée'
        });
      }

      res.json({
        message: 'Lettre supprimée avec succès'
      });

    } catch (error) {
      next(error);
    }
  }

  // ================================================
  // GENERATE PDF - Générer PDF de la lettre
  // ================================================
  static async generatePdf(req, res, next) {
    try {
      const userId = req.userId;
      const id = parseInt(req.params.id);

      console.log(`🚀 Génération PDF lettre ${id}...`);

      // 1️⃣ Récupérer la lettre
      const letter = await CoverLetter.findById(id, userId);

      if (!letter) {
        return res.status(404).json({
          error: 'Lettre non trouvée'
        });
      }

      // 2️⃣ Parser le contenu si c'est une string JSON
      const content = typeof letter.content === 'string' 
        ? JSON.parse(letter.content) 
        : letter.content;

      // 3️⃣ Générer le HTML de la lettre
      const htmlContent = generateCoverLetterHtml(letter, content);

      console.log(`📏 Taille HTML: ${htmlContent.length} caractères`);

      // 4️⃣ Obtenir le générateur PDF (singleton)
      const pdfGenerator = getPdfGenerator();

      // 5️⃣ Générer le PDF avec timeout optimisé
      const pdfBuffer = await Promise.race([
        pdfGenerator.generate(htmlContent, { format: 'A4' }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout génération PDF lettre')), 60000)
        ),
      ]);

      if (!pdfBuffer || pdfBuffer.length === 0) {
        throw new Error('Le PDF généré est vide');
      }

      console.log(`✅ PDF lettre généré (${pdfBuffer.length} bytes)`);

      // 6️⃣ Retourner le PDF
      const filename = `Lettre_${(letter.target_company || 'Motivation').replace(/\s/g, '_')}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.send(pdfBuffer);

    } catch (error) {
      console.error('❌ Erreur génération PDF lettre:', error);
      next(error);
    }
  }
}

// ================================================
// ================================================
// HELPER : Générer le HTML d'une lettre
// ================================================
function generateCoverLetterHtml(letter, content) {
  console.log('📝 Structure du contenu reçu:', Object.keys(content));

  // Coordonnées restructurées (objet au lieu de string)
  const coordonnees = content.coordonnees || {};
  
  const fullName = coordonnees.fullName || 'Candidat';
  const address = coordonnees.address || '';
  const email = coordonnees.email || '';
  const phone = coordonnees.phone || '';
  const city = coordonnees.city || '';

  // Extraire l'en-tête
  const entete = content.entete || {};
  const targetCompany = entete.company || letter.target_company || 'Entreprise';
  const dateStr = entete.date || new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long', 
    year: 'numeric'
  });
  
  // Date formatée : "À Lomé, le 15 mars 2026"
  const cityForDate = entete.city || city || '';
  const formattedDate = cityForDate 
    ? `À ${cityForDate}, le ${dateStr}`
    : dateStr;
  
  const subject = entete.objet || `Candidature pour le poste de ${letter.target_position}`;

  // Ville/pays de l'entreprise (extrait du CV ou de la lettre)
  const companyLocation = letter.company_location || '';

  // Extraire les paragraphes
  const paragraphe1 = content.paragraphe1 || '';
  const paragraphe2 = content.paragraphe2 || '';
  const paragraphe3 = content.paragraphe3 || '';
  const paragraphe4 = content.paragraphe4 || '';
  const signature = content.signature || fullName;

  console.log('✅ Données extraites:', {
    fullName,
    email: email ? '✅' : '❌',
    phone: phone ? '✅' : '❌',
    address: address ? '✅' : '❌',
    city: city ? '✅' : '❌',
    targetCompany,
    formattedDate
  });

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lettre de Motivation - ${escapeHtml(fullName)}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 11pt;
          line-height: 1.8;
          color: #2c3e50;
          background: white;
          padding: 50px 70px;
        }
        
        /* Expéditeur */
        .sender {
          margin-bottom: 40px;
        }
        
        .sender h2 {
          font-size: 14pt;
          color: #1a1a1a;
          margin-bottom: 4px;
          font-weight: 600;
        }
        
        .sender p {
          font-size: 10pt;
          color: #6b7280;
          line-height: 1.5;
          margin-bottom: 2px;
        }
        
        /* Destinataire */
        .recipient {
          margin-bottom: 30px;
        }
        
        .recipient h3 {
          font-size: 11pt;
          font-weight: 600;
          margin-bottom: 3px;
          color: #1f2937;
        }
        
        .recipient p {
          font-size: 10pt;
          color: #6b7280;
        }
        
        /* Date (sous le destinataire) */
        .date-location {
          text-align: right;
          font-size: 10pt;
          color: #6b7280;
          font-style: italic;
          margin-bottom: 30px;
        }
        
        /* Objet */
        .subject {
          font-weight: 600;
          margin-bottom: 25px;
          font-size: 11pt;
        }
        
        /* Contenu */
        .content {
          text-align: justify;
          margin-bottom: 35px;
        }
        
        .content p {
          margin-bottom: 18px;
        }
        
        .salutation {
          margin-bottom: 15px;
        }
        
        /* Signature */
        .signature {
          margin-top: 50px;
        }
        
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <!-- Coordonnées expéditeur -->
      <div class="sender">
        <h2>${escapeHtml(fullName)}</h2>
        ${address ? `<p>${escapeHtml(address)}</p>` : ''}
        ${email ? `<p>${escapeHtml(email)}</p>` : ''}
        ${phone ? `<p>${escapeHtml(phone)}</p>` : ''}
      </div>
      
      <!-- Destinataire -->
      <div class="recipient">
        <h3>${escapeHtml(targetCompany)}</h3>
        ${companyLocation ? `<p>${escapeHtml(companyLocation)}</p>` : ''}
      </div>
      
      <!-- Date (position traditionnelle française) -->
      <div class="date-location">
        <p>${formattedDate}</p>
      </div>
      
      <!-- Objet -->
      <p class="subject">Objet : ${escapeHtml(subject)}</p>
      
      <!-- Contenu de la lettre -->
      <div class="content">
        <p class="salutation">Madame, Monsieur,</p>
        
        ${paragraphe1 ? `<p>${escapeHtml(paragraphe1)}</p>` : ''}
        
        ${paragraphe2 ? `<p>${escapeHtml(paragraphe2)}</p>` : ''}
        
        ${paragraphe3 ? `<p>${escapeHtml(paragraphe3)}</p>` : ''}
        
        ${paragraphe4 ? `<p>${escapeHtml(paragraphe4)}</p>` : ''}
      </div>
      
      <!-- Signature -->
      <div class="signature">
        <p>Cordialement,</p>
        <p><strong>${escapeHtml(signature)}</strong></p>
      </div>
    </body>
    </html>
  `;
}



// ================================================
// HELPER : Échapper HTML
// ================================================
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.toString().replace(/[&<>"']/g, char => map[char]);
}

module.exports = CoverLetterController;