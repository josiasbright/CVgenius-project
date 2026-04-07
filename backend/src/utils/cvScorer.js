// ================================================
// CV SCORER - Algorithme de scoring ATS
// ================================================

class CvScorer {

  // ================================================
  // ANALYZE - Analyse complète du CV
  // ================================================
  static analyze(text, numPages) {
    const analysis = {
      lengthOk: false,
      hasKeywords: false,
      hasDates: false,
      hasSections: false,
      hasContact: false,
      noComplexTables: true,
      readableFont: true,
      fewImages: true
    };

    const recommendations = [];
    let score = 0;

    // Nettoyer le texte
    const cleanText = text.toLowerCase();

    // ================================================
    // CRITÈRE 1 : Longueur (10 points)
    // ================================================
    if (numPages >= 1 && numPages <= 2) {
      analysis.lengthOk = true;
      score += 10;
    } else {
      recommendations.push(
        numPages > 2 
          ? 'Réduisez votre CV à 2 pages maximum pour faciliter la lecture.'
          : 'Développez votre CV pour atteindre au moins 1 page complète.'
      );
    }

    // ================================================
    // CRITÈRE 2 : Mots-clés métier (20 points)
    // ================================================
    const keywords = [
      'expérience', 'compétence', 'formation', 'projet',
      'réalisation', 'mission', 'responsabilité', 'résultat',
      'développement', 'gestion', 'analyse', 'management'
    ];

    const foundKeywords = keywords.filter(kw => cleanText.includes(kw));
    
    if (foundKeywords.length >= 4) {
      analysis.hasKeywords = true;
      score += 20;
    } else {
      recommendations.push('Utilisez des verbes d\'action et mots-clés professionnels (expérience, compétences, projets, réalisations).');
    }

    // ================================================
    // CRITÈRE 3 : Dates présentes (15 points)
    // ================================================
    const datePatterns = [
      /\d{4}/g,                    // 2020
      /\d{2}\/\d{4}/g,             // 01/2020
      /\d{4}\s*-\s*\d{4}/g,        // 2020 - 2023
      /(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{4}/gi
    ];

    const hasDates = datePatterns.some(pattern => pattern.test(text));

    if (hasDates) {
      analysis.hasDates = true;
      score += 15;
    } else {
      recommendations.push('Ajoutez des dates claires pour vos expériences et formations (format : MM/AAAA ou AAAA - AAAA).');
    }

    // ================================================
    // CRITÈRE 4 : Sections structurées (15 points)
    // ================================================
    const sections = [
      /exp[ée]rience/i,
      /formation/i,
      /comp[ée]tence/i,
      /parcours/i
    ];

    const foundSections = sections.filter(section => section.test(text));

    if (foundSections.length >= 2) {
      analysis.hasSections = true;
      score += 15;
    } else {
      recommendations.push('Structurez votre CV avec des sections claires : Expérience, Formation, Compétences.');
    }

    // ================================================
    // CRITÈRE 5 : Coordonnées complètes (10 points)
    // ================================================
    const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text);
    const hasPhone = /(\+33|0)[1-9](\s?\d{2}){4}/.test(text.replace(/\s/g, ''));

    if (hasEmail && hasPhone) {
      analysis.hasContact = true;
      score += 10;
    } else {
      if (!hasEmail) recommendations.push('Ajoutez votre adresse email.');
      if (!hasPhone) recommendations.push('Ajoutez votre numéro de téléphone.');
    }

    // ================================================
    // CRITÈRE 6 : Pas de tableaux complexes (10 points)
    // ================================================
    // Détection approximative : beaucoup de caractères | ou _
    const tableIndicators = (text.match(/\|/g) || []).length;
    
    if (tableIndicators < 20) {
      analysis.noComplexTables = true;
      score += 10;
    } else {
      recommendations.push('Évitez les tableaux complexes, privilégiez des listes à puces simples.');
    }

    // ================================================
    // CRITÈRE 7 : Texte lisible (10 points)
    // ================================================
    // Si ratio texte/longueur est correct (pas que des caractères spéciaux)
    const alphaNumRatio = (text.match(/[a-zA-Z0-9]/g) || []).length / text.length;
    
    if (alphaNumRatio > 0.7) {
      analysis.readableFont = true;
      score += 10;
    } else {
      recommendations.push('Assurez-vous que votre CV utilise une police lisible et standard.');
    }

    // ================================================
    // CRITÈRE 8 : Peu d'images/logos (10 points)
    // ================================================
    // Difficile à détecter dans le texte extrait
    // On assume OK par défaut (bonus)
    analysis.fewImages = true;
    score += 10;

    // ================================================
    // RETOUR
    // ================================================
    return {
      score: Math.min(score, 100), // Cap à 100
      analysis,
      recommendations: recommendations.length > 0 
        ? recommendations 
        : ['Votre CV est bien optimisé pour les ATS !']
    };
  }

  // ================================================
  // GET STRENGTHS - Points forts détectés
  // ================================================
  static getStrengths(analysis) {
    const strengths = [];

    if (analysis.lengthOk) strengths.push('Longueur optimale (1-2 pages)');
    if (analysis.hasKeywords) strengths.push('Mots-clés professionnels présents');
    if (analysis.hasDates) strengths.push('Dates clairement indiquées');
    if (analysis.hasSections) strengths.push('Structure claire et organisée');
    if (analysis.hasContact) strengths.push('Coordonnées complètes');
    if (analysis.noComplexTables) strengths.push('Format compatible ATS');
    if (analysis.readableFont) strengths.push('Texte lisible');

    return strengths.length > 0 
      ? strengths 
      : ['Continuez vos efforts pour optimiser votre CV'];
  }

  // ================================================
  // GET WEAKNESSES - Points à améliorer
  // ================================================
  static getWeaknesses(analysis) {
    const weaknesses = [];

    if (!analysis.lengthOk) weaknesses.push('Longueur du CV');
    if (!analysis.hasKeywords) weaknesses.push('Mots-clés métier insuffisants');
    if (!analysis.hasDates) weaknesses.push('Dates peu visibles');
    if (!analysis.hasSections) weaknesses.push('Structure à améliorer');
    if (!analysis.hasContact) weaknesses.push('Coordonnées incomplètes');
    if (!analysis.noComplexTables) weaknesses.push('Tableaux complexes détectés');

    return weaknesses;
  }
}

module.exports = CvScorer;