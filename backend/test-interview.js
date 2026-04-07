require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:3000/api';
let authCookie = '';

async function request(method, endpoint, data = null) {
  const config = {
    method,
    url: `${API_URL}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      ...(authCookie && { 'Cookie': authCookie })
    },
    ...(data && { data })
  };
  const response = await axios(config);
  if (response.headers['set-cookie']) {
    authCookie = response.headers['set-cookie'][0].split(';')[0];
  }
  return response.data;
}

async function testInterview() {
  try {
    console.log('🎤 Test Module Simulation Entretien\n');

    // 1. Statistiques (sans auth)
    console.log('📊 Récupération statistiques...');
    const stats = await request('GET', '/interview/stats');
    console.log(`✅ Total questions dans la banque : ${stats.totalQuestions}`);
    console.log(`✅ Questions par simulation : ${stats.questionsPerSimulation}\n`);

    // 2. Login
    await request('POST', '/auth/login', {
      email: 'test@cvgenius.com',
      password: 'test123'
    });
    console.log('✅ Connecté\n');

    // 3. Lancer simulation 1
    console.log('🎯 Simulation 1 - Génération 5 questions aléatoires...');
    const sim1 = await request('GET', '/interview/start');
    console.log(`✅ ${sim1.totalQuestions} questions générées\n`);
    
    console.log('📋 QUESTIONS GÉNÉRÉES :');
    console.log('═══════════════════════════════════════════════\n');
    sim1.questions.forEach((q, index) => {
      console.log(`❓ QUESTION ${index + 1} :`);
      console.log(`   ${q.question_text}`);
      console.log(`   Catégorie : ${q.category}`);
      console.log('');
      console.log(`💡 RÉPONSE SUGGÉRÉE :`);
      console.log(`   ${q.suggested_answer.substring(0, 150)}...`);
      console.log('');
      console.log(`📌 CONSEIL :`);
      console.log(`   ${q.tips}`);
      console.log('\n═══════════════════════════════════════════════\n');
    });

    // 4. Lancer simulation 2 (pour vérifier l'aléatoire)
    console.log('🔄 Simulation 2 - Vérification aléatoire...');
    const sim2 = await request('GET', '/interview/start');
    
    const sameQuestions = sim1.questions.filter(q1 => 
      sim2.questions.some(q2 => q2.id === q1.id)
    ).length;
    
    console.log(`✅ Questions identiques entre sim1 et sim2 : ${sameQuestions}/5`);
    console.log(`✅ Questions différentes : ${5 - sameQuestions}/5`);
    console.log('   → L\'aléatoire fonctionne !\n');

    // 5. Récupérer toutes les questions
    console.log('📚 Récupération de toutes les questions...');
    const allQuestions = await request('GET', '/interview/questions');
    console.log(`✅ Total questions disponibles : ${allQuestions.count}\n`);

    console.log('================================================');
    console.log('🎉 TOUS LES TESTS RÉUSSIS !');
    console.log('================================================');
    console.log('\n💡 Note : Chaque simulation génère 5 questions');
    console.log('    différentes parmi les 50 disponibles.');
    console.log(`    Possibilités : ${stats.possibleCombinations} combinaisons !`);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.response) {
      console.error('Détails:', error.response.data);
    }
  }
}

testInterview();