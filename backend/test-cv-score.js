require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3000/api';

async function testCvScore() {
  try {
    console.log('📊 Test Module CV Scoring\n');

    // 1. Statistiques
    console.log('📈 Récupération statistiques...');
    const stats = await axios.get(`${API_URL}/cv-score/stats`);
    console.log(`✅ Total analyses : ${stats.data.totalAnalyses}`);
    console.log(`✅ Score moyen : ${stats.data.averageScore}/100\n`);

    // 2. Vérifier qu'un CV PDF existe
  const testFiles = [
  'test-simple-cv.pdf',  // ← Nouveau PDF simple
  'CV_Thomas_Garcia.pdf',
  'CV_Lorna_Alvarado.pdf'
];

    let cvFile = null;
    for (const file of testFiles) {
      if (fs.existsSync(file)) {
        cvFile = file;
        break;
      }
    }

    if (!cvFile) {
      console.log('⚠️  Aucun PDF de test trouvé.');
      console.log('💡 Génère d\'abord un CV avec : node test-thomas-cv.js');
      console.log('   Puis relance ce test.\n');
      return;
    }

    console.log(`📄 Utilisation du fichier : ${cvFile}\n`);

    // 3. Analyser le CV
    console.log('🔍 Analyse en cours...');
    const form = new FormData();
    form.append('cv', fs.createReadStream(cvFile));

    const analyzeResponse = await axios.post(
      `${API_URL}/cv-score/analyze`,
      form,
      { headers: form.getHeaders() }
    );

    console.log('\n═══════════════════════════════════════════════');
    console.log('📊 RÉSULTAT ANALYSE');
    console.log('═══════════════════════════════════════════════');
    console.log(`🎯 SCORE ATS : ${analyzeResponse.data.score}/100\n`);
    
    console.log('✅ POINTS FORTS :');
    analyzeResponse.data.strengths.forEach(s => console.log(`   • ${s}`));
    
    if (analyzeResponse.data.weaknesses && analyzeResponse.data.weaknesses.length > 0) {
      console.log('\n⚠️  POINTS À AMÉLIORER :');
      analyzeResponse.data.weaknesses.forEach(w => console.log(`   • ${w}`));
    }
    
    console.log('\n💡 RECOMMANDATIONS :');
    analyzeResponse.data.recommendations.forEach(r => console.log(`   → ${r}`));
    console.log('═══════════════════════════════════════════════\n');

    const analysisId = analyzeResponse.data.analysisId;

    // 4. Récupérer résultat
    console.log('🔍 Récupération du résultat sauvegardé...');
    const getResponse = await axios.get(`${API_URL}/cv-score/${analysisId}`);
    console.log(`✅ Analyse ID ${getResponse.data.id} récupérée\n`);

    // 5. Statistiques mises à jour
    const stats2 = await axios.get(`${API_URL}/cv-score/stats`);
    console.log('📈 Statistiques mises à jour :');
    console.log(`   Total analyses : ${stats2.data.totalAnalyses}`);
    console.log(`   Score moyen : ${stats2.data.averageScore}/100\n`);

    console.log('================================================');
    console.log('🎉 MODULE CV SCORING FONCTIONNEL !');
    console.log('================================================');
    console.log('\n💡 Le CV a été analysé avec succès.');
    console.log(`   Score obtenu : ${analyzeResponse.data.score}/100`);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.response) {
      console.error('Détails:', error.response.data);
    }
  }
}

testCvScore();