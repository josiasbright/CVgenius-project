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

async function createSebastianCv() {
  try {
    console.log('🎨 Création du CV style Sebastian Bennett\n');
    
    // Login
    await request('POST', '/auth/login', {
      email: 'test@cvgenius.com',
      password: 'test123'
    });
    
    // Créer un CV
    const cv = await request('POST', '/cvs', {
      title: 'CV Sebastian Bennett',
      cvData: {
        personal_info: {
          first_name: 'Sebastian',
          last_name: 'Bennett',
          job_title: 'Professional Accountant',
          email: 'hello@reallygreatsite.com',
          phone: '+123-456-7890',
          address: '123 Anywhere St., Any City',
          summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
        },
        education: [
          {
            institution: 'Borcelle University',
            degree: 'Senior Accountant',
            start_date: '2026',
            end_date: '2030',
            field: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
          },
          {
            institution: 'Borcelle University',
            degree: 'Senior Accountant',
            start_date: '2023',
            end_date: '2026',
            field: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
          }
        ],
        skills: [
          'Auditing',
          'Financial Accounting',
          'Auditing',
          'Financial Accounting',
          'Financial Reporting'
        ],
        experiences: [
          {
            position: 'Senior Accountant',
            company: 'Salford & Co.',
            start_date: '2033',
            end_date: '2035',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
          },
          {
            position: 'Financial Accountant',
            company: 'Salford & Co.',
            start_date: '2030',
            end_date: '2033',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
          }
        ]
      },
      templateName: 'sebastian-style',
      themeColor: '#000000'
    });
    
    console.log('✅ CV créé (ID:', cv.cv.id, ')\n');
    
    // Générer le PDF
    console.log('📄 Génération du PDF...');
    const pdfData = await request('POST', `/pdf/generate/${cv.cv.id}`, null, 'arraybuffer');
    
    fs.writeFileSync('CV_Sebastian_Bennett.pdf', pdfData);
    console.log('✅ PDF généré : CV_Sebastian_Bennett.pdf\n');
    
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

createSebastianCv();
