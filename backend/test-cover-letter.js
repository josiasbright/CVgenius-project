require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

const API_URL = 'http://localhost:3000/api';
let authCookie = '';

async function request(method, endpoint, data = null, responseType = 'json') {
  const config = {
    method,
    url: `${API_URL}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      ...(authCookie && { 'Cookie': authCookie })
    },
    responseType,
    ...(data && { data })
  };
  const response = await axios(config);
  if (response.headers['set-cookie']) {
    authCookie = response.headers['set-cookie'][0].split(';')[0];
  }
  return response.data;
}

async function testCoverLetter() {
  try {
    console.log('📝 Test Module Lettres de Motivation\n');

    // 1. Login
    await request('POST', '/auth/login', {
      email: 'test@cvgenius.com',
      password: 'test123'
    });
    console.log('✅ Connecté\n');

    // 2. Récupérer le premier CV
    const cvs = await request('GET', '/cvs');
    if (cvs.cvs.length === 0) {
      console.log('❌ Aucun CV trouvé. Crée un CV d\'abord.');
      return;
    }
    const cvId = cvs.cvs[0].id;
    console.log(`✅ CV trouvé (ID: ${cvId})\n`);

    // 3. Créer une lettre (NOUVELLE URL)
    console.log('📄 Création lettre de motivation...');
    const letter = await request('POST', `/cover-letters/cv/${cvId}`, {
      targetCompany: 'Google France',
      targetPosition: 'Développeur Full Stack',
      companyType: 'startup',
      jobOfferText: `
        Nous recherchons un développeur Full Stack avec :
        - Maîtrise Node.js et React
        - Expérience Scrum
        - Capacité à piloter des projets
        - Anglais courant
      `
    });
    console.log('✅ Lettre créée (ID:', letter.coverLetter.id, ')\n');

    // 4. Récupérer la lettre
    const fetchedLetter = await request('GET', `/cover-letters/${letter.coverLetter.id}`);
    console.log('📖 Contenu généré :');
    console.log('-----------------------------------');
    const content = typeof fetchedLetter.coverLetter.content === 'string'
      ? JSON.parse(fetchedLetter.coverLetter.content)
      : fetchedLetter.coverLetter.content;
    console.log('Paragraphe 1:', content.paragraphe1);
    console.log('Paragraphe 2:', content.paragraphe2);
    console.log('-----------------------------------\n');

    // 5. Générer le PDF
    console.log('📄 Génération PDF...');
    const pdfData = await request(
      'POST', 
      `/cover-letters/${letter.coverLetter.id}/generate-pdf`, 
      null, 
      'arraybuffer'
    );
    fs.writeFileSync('Lettre_Test.pdf', pdfData);
    console.log('✅ PDF généré : Lettre_Test.pdf\n');

    // 6. Liste des lettres du CV (NOUVELLE URL)
    const letters = await request('GET', `/cover-letters/cv/${cvId}`);
    console.log(`✅ Lettres pour ce CV : ${letters.count}\n`);

    // 7. Modifier la lettre
    console.log('📝 Modification de la lettre...');
    await request('PUT', `/cover-letters/${letter.coverLetter.id}`, {
      targetCompany: 'Amazon France'
    });
    console.log('✅ Lettre modifiée\n');

    // 8. Supprimer la lettre
    console.log('🗑️ Suppression de la lettre...');
    await request('DELETE', `/cover-letters/${letter.coverLetter.id}`);
    console.log('✅ Lettre supprimée\n');

    console.log('================================================');
    console.log('🎉 TOUS LES TESTS RÉUSSIS !');
    console.log('================================================');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.response) {
      console.error('Détails:', error.response.data);
    }
  }
}

testCoverLetter();