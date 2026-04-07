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

async function createLornaCv() {
  try {
    console.log('🎨 Création du CV style Lorna\n');

    await request('POST', '/auth/login', {
      email: 'test@cvgenius.com',
      password: 'test123'
    });

    const cv = await request('POST', '/cvs', {
      title: 'CV Lorna Alvarado',
      cvData: {
        personal_info: {
          first_name: 'Lorna',
          last_name: 'Alvarado',
          job_title: 'Web Development',
          email: 'hello@reallygreatsite.com',
          phone: '123-456-7890',
          address: '123 Anywhere St., Any City',
          website: 'www.reallygreatsite.com',
          summary: 'I am a qualified and professional web developer with five years of experience in database administration and website design. Strong creative and analytical skills. Team player with an eye for detail.'
        },
        education: [
          {
            institution: 'UNIVERSITY OF REALLY GREAT',
            degree: 'Bachelor of IT, Major in Technology',
            start_date: '2014',
            end_date: '2016'
          },
          {
            institution: 'REALLY GREAT ACADEMY',
            degree: 'Bachelor of IT, Major in Technology',
            start_date: '2013',
            end_date: '2014'
          },
          {
            institution: 'REALLY GREAT ACADEMY',
            degree: 'Bachelor of IT, Major in Technology',
            start_date: '2011',
            end_date: '2013'
          }
        ],
        skills: [
          'Web Design',
          'Design Thinking',
          'Wireframe Creation',
          'Front End Coding',
          'Backend Tech',
          'Problem-Solving',
          'Computer Literacy',
          'Project Management Tools',
          'Strong Communication'
        ],
        languages: ['English', 'Spanish'],
        experiences: [
          {
            position: 'APPLICATIONS DEVELOPER',
            company: 'Really Great Company',
            start_date: '2016',
            end_date: 'PRESENT',
            is_current: true,
            tasks: [
              'Database administration and website design',
              'Built the logic for a streamlined ad-serving platform that scaled',
              'Educational institutions and Blackboard online classroom management'
            ]
          },
          {
            position: 'WEB CONTENT MANAGER',
            company: 'Really Great Company',
            start_date: '2014',
            end_date: '2016',
            tasks: [
              'Database administration and website design',
              'Built the logic for a streamlined ad-serving platform that scaled',
              'Educational institutions and Blackboard online classroom management'
            ]
          },
          {
            position: 'WEB CONTENT MANAGER',
            company: 'Really Great Company',
            start_date: '2012',
            end_date: '2014',
            tasks: [
              'Database administration and website design',
              'Built the logic for a streamlined ad-serving platform that scaled',
              'Educational institutions and Blackboard online classroom management'
            ]
          }
        ],
        references: [
          {
            name: 'HARUMI KOBAYASHI',
            position: 'Wardiere Inc. / CEO',
            phone: '123-456-7890',
            email: 'hello@reallygreatsite.com'
          },
          {
            name: 'BAILEY DUPONT',
            position: 'Wardiere Inc. / CEO',
            phone: '123-456-7890',
            email: 'hello@reallygreatsite.com'
          }
        ]
      },
      templateName: 'lorna-style',
      themeColor: '#000000'
    });

    console.log('✅ CV créé (ID:', cv.cv.id, ')\n');

    console.log('📄 Génération du PDF...');
    const pdfData = await request('POST', `/pdf/generate/${cv.cv.id}`, null, 'arraybuffer');

    fs.writeFileSync('CV_Lorna_Alvarado.pdf', pdfData);
    console.log('✅ PDF généré : CV_Lorna_Alvarado.pdf\n');
    console.log('🎉 SUCCÈS !');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.response) console.error('Data:', error.response.data);
  }
}

createLornaCv();
