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

async function createBenjaminCv() {
  try {
    console.log('🎨 Création du CV style Benjamin Leroy\n');
    
    // Login
    await request('POST', '/auth/login', {
      email: 'test@cvgenius.com',
      password: 'test123'
    });
    
    // Créer un CV
    const cv = await request('POST', '/cvs', {
      title: 'CV Benjamin Leroy',
      cvData: {
        personal_info: {
          first_name: 'Benjamin',
          last_name: 'Leroy',
          job_title: '',
          email: 'hello@reallygreatsite.com',
          phone: '+123-456-7890',
          address: '123 Anywhere St., Any City',
          summary: 'Ingénieur aérospatial polyvalent, je dispose d\'une expérience significative dans la modélisation numérique, l\'analyse de performances aérodynamiques et la gestion de projets spatiaux.'
        },
        education: [
          {
            institution: 'École Amédé Autran',
            degree: 'Master en Ingénierie Aérospatiale',
            start_date: '2018',
            end_date: '2020'
          },
          {
            institution: 'École Amédé Autran',
            degree: 'Bachelor en Ingénierie Mécanique',
            start_date: '2015',
            end_date: '2018'
          },
          {
            institution: 'École Amédé Autran',
            degree: 'Baccalauréat',
            start_date: '2015',
            end_date: ''
          }
        ],
        skills: [
          'Conception et modélisation de véhicules spatiaux',
          'Analyse des performances aérodynamiques',
          'Simulation numérique et calcul haute performance',
          'Gestion de projet et management d\'équipe'
        ],
        languages: ['Français', 'Anglais'],
        experiences: [
          {
            position: 'Ingénieur aérospatial - Concordia',
            company: '',
            start_date: '2023',
            end_date: 'Aujourd\'hui',
            is_current: true,
            tasks: [
              'Conception et développement de sous-systèmes pour les satellites de télécommunication.',
              'Gestion de projets de recherche et développement, de la phase de conception à la phase de réalisation, en collaboration avec des partenaires internationaux.',
              'Analyse des performances de vol et optimisation des systèmes pour améliorer l\'efficacité opérationnelle des satellites.'
            ]
          },
          {
            position: 'Ingénieur de recherche en aérospatial - Messagem',
            company: '',
            start_date: '2021',
            end_date: '2023',
            tasks: [
              'Participation à des projets de recherche sur les véhicules hypersoniques et les technologies de propulsion avancées.',
              'Développement de modèles numériques pour simuler les écoulements supersoniques et hypersoniques et évaluer les performances des véhicules.',
              'Publication d\'articles dans des revues spécialisées et présentation des résultats lors de conférences internationales.'
            ]
          },
          {
            position: 'Stagiaire en ingénierie aérospatiale - Nomade',
            company: '',
            start_date: 'Juillet',
            end_date: 'décembre 2020',
            tasks: [
              'Assister les ingénieurs dans l\'analyse de données des missions spatiales, y compris les orbites, les trajectoires et les performances des lanceurs.',
              'Contribuer à la préparation des rapports de mission et à l\'évaluation des performances des systèmes de propulsion.',
              'Acquérir une compréhension pratique des opérations spatiales au sein d\'une organisation internationale.'
            ]
          }
        ]
      },
      templateName: 'benjamin-style',
      themeColor: '#000000'
    });
    
    console.log('✅ CV créé (ID:', cv.cv.id, ')\n');
    
    // Générer le PDF
    console.log('📄 Génération du PDF...');
    const pdfData = await request('POST', `/pdf/generate/${cv.cv.id}`, null, 'arraybuffer');
    
    fs.writeFileSync('CV_Benjamin_Leroy.pdf', pdfData);
    console.log('✅ PDF généré : CV_Benjamin_Leroy.pdf\n');
    
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

createBenjaminCv();