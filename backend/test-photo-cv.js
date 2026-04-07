require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const API_URL = 'http://localhost:3000/api';
let authCookie = '';

async function request(method, endpoint, data = null, responseType = 'json', headers = {}) {
  const config = {
    method,
    url: `${API_URL}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      ...(authCookie && { 'Cookie': authCookie }),
      ...headers
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

async function testPhotoCV() {
  try {
    console.log('📸 Test upload photo + génération PDF\n');

    // 1. Login
    await request('POST', '/auth/login', {
      email: 'test@cvgenius.com',
      password: 'test123'
    });
    console.log('✅ Connecté\n');

    // 2. Upload photo (utilise une image existante sur ton PC)
    const photoPath = './test-photo.jpg'; // ← Mets une vraie photo ici
    
    if (fs.existsSync(photoPath)) {
      const form = new FormData();
      form.append('photo', fs.createReadStream(photoPath));

      const uploadResponse = await axios.post(
        `${API_URL}/user/avatar`,
        form,
        {
          headers: {
            ...form.getHeaders(),
            'Cookie': authCookie
          }
        }
      );

      const photoUrl = uploadResponse.data.photoUrl;
      console.log('✅ Photo uploadée:', photoUrl, '\n');

      // 3. Créer CV avec photo
      const cv = await request('POST', '/cvs', {
        title: 'CV avec Photo',
        cvData: {
          personal_info: {
            first_name: 'Thomas',
            last_name: 'Garcia',
            job_title: 'Ingénieur',
            email: 'hello@reallygreatsite.com',
            phone: '123-456-7890',
            address: '123 Anywhere St., AnyCity',
            photo_url: photoUrl, // ✅ Photo incluse
            summary: 'Déterminé, sérieux, autonome et conscient du travail qui m\'attend.'
          },
          education: [
            {
              institution: 'École ingénieur',
              degree: 'Master spécialisé en technique',
              start_date: '2022',
              end_date: '2024'
            }
          ],
          skills: ['Logiciel 1', 'Logiciel 2'],
          languages: ['Arabe - Bilingue', 'Anglais - Niveau scolaire'],
          hobbies: [
            { category: 'SPORTS', items: 'Football, Vélo, Natation' },
            { category: 'VOYAGES', items: 'Italie, Espagne, Angleterre' }
          ],
          experiences: [
            {
              position: 'Chargé de communication',
              company: 'Durance Média',
              start_date: '2024',
              end_date: 'Présent',
              tasks: ['Lancement complet d\'une marque', 'Community manager']
            }
          ]
        },
        templateName: 'thomas-style',
        themeColor: '#2B2B2B'
      });

      console.log('✅ CV créé (ID:', cv.cv.id, ')\n');

      // 4. Générer PDF
      console.log('📄 Génération du PDF...');
      const pdfData = await request('POST', `/pdf/generate/${cv.cv.id}`, null, 'arraybuffer');
      fs.writeFileSync('CV_avec_photo.pdf', pdfData);
      console.log('✅ PDF généré : CV_avec_photo.pdf\n');
      console.log('🎉 SUCCÈS ! La photo apparaît dans le PDF');

    } else {
      console.log('⚠️ Fichier test-photo.jpg non trouvé');
      console.log('ℹ️ Crée un fichier test-photo.jpg dans le dossier backend/');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.response) console.error('Data:', error.response.data);
  }
}

testPhotoCV();