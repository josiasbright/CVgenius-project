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

async function createSachaCv() {
  try {
    console.log('🎨 Création du CV style Sacha Dubois\n');
    
    // Login
    await request('POST', '/auth/login', {
      email: 'test@cvgenius.com',
      password: 'test123'
    });
    
    // Créer un CV
    const cv = await request('POST', '/cvs', {
      title: 'CV Sacha Dubois',
      cvData: {
        personal_info: {
          first_name: 'Sacha',
          last_name: 'Dubois',
          job_title: 'Chargée de projet',
          email: 'hello@reallygreatsite.com',
          phone: '123-456-7890',
          address: '123 Anywhere St., Any City'
        },
        education: [
          {
            institution: 'Really Great School - Any City',
            degree: 'Master en Management',
            start_date: '2016',
            end_date: '2018'
          },
          {
            institution: 'Really Great School - Any City',
            degree: 'Licence en Gestion Administrative',
            start_date: '2013',
            end_date: '2016'
          }
        ],
        skills: [
          'Gestion du temps',
          'Capacités d\'organisation',
          'Communication',
          'Leadership',
          'Logiciels de gestion de projet',
          'Gestion de budget'
        ],
        languages: ['Anglais', 'Allemand'],
        hobbies: ['Lecture', 'Randonnée', 'Gymnastique'],
        experiences: [
          {
            position: 'Chargée de Projet',
            company: 'Really Great Company - Any City',
            start_date: 'Depuis janvier 2020',
            end_date: '',
            is_current: true,
            tasks: [
              'Elaboration du plan de projet et gestion des calendriers',
              'Gestion des ressources et du budget',
              'Gestion des risques (identification des risques, réaction aux imprévus)'
            ]
          },
          {
            position: 'Assistante Chargée de Projet',
            company: 'Really Great Company - Any City',
            start_date: 'Septembre 2018',
            end_date: 'Janvier 2020',
            tasks: [
              'Rédaction des rapports de progression',
              'Participation aux réunions de suivi de projet',
              'Suivi de l\'avancement des projets en collaboration avec les équipes concernées'
            ]
          },
          {
            position: 'Stagiaire Chargée de Projet',
            company: 'Really Great Company - Any City',
            start_date: 'Février 2018',
            end_date: 'Juin 2018',
            tasks: [
              'Aide pour définir les objectifs et les périmètres du projet',
              'Participation à l\'élaboration des plans de projet (échéanciers, jalons et livrables)'
            ]
          }
        ]
      },
      templateName: 'sacha-style',
      themeColor: '#1B4965'
    });
    
    console.log('✅ CV créé (ID:', cv.cv.id, ')\n');
    
    // Générer le PDF
    console.log('📄 Génération du PDF...');
    const pdfData = await request('POST', `/pdf/generate/${cv.cv.id}`, null, 'arraybuffer');
    
    fs.writeFileSync('CV_Sacha_Dubois.pdf', pdfData);
    console.log('✅ PDF généré : CV_Sacha_Dubois.pdf\n');
    
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

createSachaCv();