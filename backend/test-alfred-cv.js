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

async function createAlfredCv() {
  try {
    console.log('🎨 Création du CV style Alfred Bernard\n');
    
    // Login
    await request('POST', '/auth/login', {
      email: 'test@cvgenius.com',
      password: 'test123'
    });
    
    // Créer un CV
    const cv = await request('POST', '/cvs', {
      title: 'CV Alfred Bernard',
      cvData: {
        personal_info: {
          first_name: 'Alfred',
          last_name: 'Bernard',
          job_title: 'Informaticien',
          email: 'hello@reallygreatsite.com',
          phone: '+123-456-7890',
          address: 'Paris, France',
          website: 'www.reallygreatsite.com'
        },
        education: [
          {
            institution: 'École Amédé Autran, Paris, France',
            degree: 'Master en Informatique',
            start_date: '2010',
            end_date: '2012'
          },
          {
            institution: 'École Amédé Autran, Paris, France',
            degree: 'Licence en Informatique',
            start_date: '2007',
            end_date: '2010'
          }
        ],
        skills: [
          'Langages de programmation',
          'Bases de données',
          'Systèmes d\'exploitation',
          'Excellentes compétences en résolution de problèmes et en dépannage'
        ],
        languages: ['Anglais - courant', 'Espagnol - intermédiaire'],
        hobbies: ['Technologie', 'Photographie', 'Lecture'],
        experiences: [
          {
            position: 'Développeur Full Stack',
            company: 'Messagem, Paris, France',
            start_date: 'Février 2017',
            end_date: 'Présent',
            is_current: true,
            tasks: [
              'Développement et maintenance d\'applications web',
              'Collaboration avec les équipes de conception pour créer des interfaces utilisateur intuitives.',
              'Optimisation des performances des applications et correction des bugs.',
              'Mise en place de tests automatisés pour assurer la qualité du code.'
            ]
          },
          {
            position: 'Administrateur système et réseau',
            company: 'Audio Stream - Lyon, France',
            start_date: 'Août 2013',
            end_date: 'Janvier 2017',
            tasks: [
              'Gestion des infrastructures réseaux et des serveurs.',
              'Mise en place de solutions de sécurité.',
              'Surveillance des performances système et résolution des incidents techniques.',
              'Participation à la planification et à la mise en œuvre de projets d\'infrastructure.'
            ]
          }
        ]
      },
      templateName: 'alfred-style',
      themeColor: '#2D2D2D'
    });
    
    console.log('✅ CV créé (ID:', cv.cv.id, ')\n');
    
    // Générer le PDF
    console.log('📄 Génération du PDF...');
    const pdfData = await request('POST', `/pdf/generate/${cv.cv.id}`, null, 'arraybuffer');
    
    fs.writeFileSync('CV_Alfred_Bernard.pdf', pdfData);
    console.log('✅ PDF généré : CV_Alfred_Bernard.pdf\n');
    
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

createAlfredCv();