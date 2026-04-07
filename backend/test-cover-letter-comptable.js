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

async function testComptable() {
  try {
    console.log('📝 Test Lettre Comptable\n');

    // Login
    await request('POST', '/auth/login', {
      email: 'test@cvgenius.com',
      password: 'test123'
    });

    // Créer CV Comptable
    const cv = await request('POST', '/cvs', {
      title: 'CV Comptable',
      cvData: {
        personal_info: {
          first_name: 'Marie',
          last_name: 'Dubois',
          job_title: 'Comptable',
          email: 'marie.dubois@email.com',
          phone: '06 12 34 56 78',
          address: '15 rue de la Paix, 75001 Paris'
        },
        skills: [
          'Excel avancé',
          'Sage Compta',
          'Fiscalité des entreprises',
          'Analyse financière',
          'Gestion budgétaire'
        ],
        experiences: [
          {
            position: 'Comptable',
            company: 'Cabinet Dupont',
            start_date: '2022',
            end_date: 'Présent',
            is_current: true,
            tasks: [
              'Tenue de la comptabilité générale',
              'Établissement des déclarations fiscales',
              'Reporting financier mensuel'
            ]
          }
        ],
        education: [
          {
            institution: 'Université Paris Dauphine',
            degree: 'Master CCA (Comptabilité Contrôle Audit)',
            start_date: '2020',
            end_date: '2022'
          }
        ],
        languages: ['Français - Langue maternelle', 'Anglais - Courant']
      },
      templateName: 'lorna-style'
    });

    console.log('✅ CV Comptable créé\n');

    // Créer lettre
    const letter = await request('POST', `/cover-letters/cv/${cv.cv.id}`, {
      targetCompany: 'Deloitte France',
      targetPosition: 'Auditeur Financier',
      companyType: 'grande_entreprise',
      jobOfferText: `
        Nous recherchons un auditeur avec :
        - Maîtrise Excel et Sage
        - Connaissance fiscalité
        - Expérience audit
      `
    });

    console.log('✅ Lettre créée\n');

    // Générer PDF
    const pdfData = await request(
      'POST',
      `/cover-letters/${letter.coverLetter.id}/generate-pdf`,
      null,
      'arraybuffer'
    );

    fs.writeFileSync('Lettre_Comptable.pdf', pdfData);
    console.log('✅ PDF : Lettre_Comptable.pdf\n');

    // Afficher contenu
    const fetchedLetter = await request('GET', `/cover-letters/${letter.coverLetter.id}`);
    const content = typeof fetchedLetter.coverLetter.content === 'string'
      ? JSON.parse(fetchedLetter.coverLetter.content)
      : fetchedLetter.coverLetter.content;

    console.log('📖 CONTENU GÉNÉRÉ :');
    console.log('-----------------------------------');
    console.log('P1:', content.paragraphe1);
    console.log('P2:', content.paragraphe2);
    console.log('-----------------------------------\n');

    console.log('🎉 TEST COMPTABLE RÉUSSI !');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.response) console.error('Détails:', error.response.data);
  }
}

testComptable();
