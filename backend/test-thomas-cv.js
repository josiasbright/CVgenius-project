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

async function createThomasCv() {
  try {
    console.log('🎨 Création du CV style Thomas Garcia\n');
    
    // Login
    await request('POST', '/auth/login', {
      email: 'test@cvgenius.com',
      password: 'test123'
    });
    
    // Créer un CV
    const cv = await request('POST', '/cvs', {
      title: 'CV Thomas Garcia',
      cvData: {
        personal_info: {
          first_name: 'Thomas',
          last_name: 'Garcia',
          job_title: 'Ingénieur',
          email: 'hello@reallygreatsite.com',
          phone: '123-456-7890',
          address: '123 Anywhere St., AnyCity',
          summary: 'Déterminé, sérieux, autonome et conscient du travail qui m\'attend, je suis persuadé que je serais un élément moteur au sein de votre structure !'
        },
        education: [
          {
            institution: 'École ingénieur',
            degree: 'Master spécialisé en technique',
            start_date: '2022',
            end_date: '2024'
          },
          {
            institution: 'École 1',
            degree: 'Licence commerce vente',
            start_date: '2020',
            end_date: '2022'
          },
          {
            institution: 'Lycée 2',
            degree: 'Bts communication',
            start_date: '2019',
            end_date: '2020'
          },
          {
            institution: 'Lycée 1',
            degree: 'Bac scientifique (spécialité mathématiques)',
            start_date: '2017',
            end_date: '2019'
          }
        ],
        skills: [
  'Node.js',
  'React',
  'PostgreSQL',
  'Docker',
  'API REST',
  'Scrum'
],
        languages: ['Arabe - Bilingue', 'Anglais - Niveau scolaire', 'Espagnol - Niveau scolaire'],
        hobbies: ['Sports', 'Voyages'],
        experiences: [
          {
            position: 'Chargé de communication & marketing',
            company: 'Durance Média',
            start_date: '12/12/2024',
            end_date: 'Présent',
            is_current: true,
            tasks: [
              'Lancement complet d\'une marque',
              'Community manager : gestion des réseaux sociaux',
              'RP (communiqués et dossiers de presse)',
              'Print (roll up, adhésifs, catalogue)'
            ]
          },
          {
            position: 'Assistante marketing service support',
            company: 'Bio&Bon',
            start_date: '12/12/2024',
            end_date: '12/12/2024',
            tasks: [
              'Salons / Forums',
              'Organisation des visites lycées pour les chargés de recrutement'
            ]
          },
          {
            position: 'Chargée de communication',
            company: 'Fitissimo',
            start_date: '12/12/2024',
            end_date: '12/12/2024',
            tasks: [
              'Réalisation kakémonos, banderoles, affiches.',
              'Mise en place d\'un jeu concours : prospection des lots'
            ]
          }
        ]
      },
      templateName: 'thomas-style',
      themeColor: '#2B2B2B'
    });
    
    console.log('✅ CV créé (ID:', cv.cv.id, ')\n');
    
    // Générer le PDF
    console.log('📄 Génération du PDF...');
    const pdfData = await request('POST', `/pdf/generate/${cv.cv.id}`, null, 'arraybuffer');
    
    fs.writeFileSync('CV_Thomas_Garcia.pdf', pdfData);
    console.log('✅ PDF généré : CV_Thomas_Garcia.pdf\n');
    
    console.log('================================================');
    console.log('🎉 SUCCÈS !');
    console.log('================================================');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.response) {
      console.error('Data:', error.response.data);
    }
  }
}

createThomasCv();