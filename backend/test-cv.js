// ================================================
// TEST DES CV
// ================================================

require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:3000/api';
let authCookie = '';

async function request(method, endpoint, data = null) {
  try {
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
  } catch (error) {
    if (error.response) {
      throw error;
    }
    throw error;
  }
}

async function runTests() {
  try {
    console.log('🧪 Tests des CV\n');
    console.log('================================================\n');
    
    // Login
    console.log('🔑 Login...');
    await request('POST', '/auth/login', {
      email: 'test@cvgenius.com',
      password: 'test123'
    });
    console.log('✅ Connecté\n');
    
    // Test 1: Récupérer tous les CV
    console.log('📋 Test 1: GET /api/cvs');
    const allCvs = await request('GET', '/cvs');
    console.log(`✅ ${allCvs.count} CV trouvés\n`);
    
    // Test 2: Créer un CV
    console.log('➕ Test 2: POST /api/cvs');
    const newCv = await request('POST', '/cvs', {
      title: 'Mon nouveau CV Test',
      cvData: {
        personal_info: {
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          job_title: 'Développeur Test'
        },
        skills: ['JavaScript', 'Node.js'],
        experiences: [],
        education: []
      },
      templateName: 'modern',
      themeColor: '#3B82F6'
    });
    console.log(`✅ CV créé (ID: ${newCv.cv.id})\n`);
    
    const cvId = newCv.cv.id;
    
    // Test 3: Récupérer un CV
    console.log(`📄 Test 3: GET /api/cvs/${cvId}`);
    const cv = await request('GET', `/cvs/${cvId}`);
    console.log(`✅ CV récupéré: ${cv.cv.title}\n`);
    
    // Test 4: Mettre à jour un CV
    console.log(`✏️ Test 4: PUT /api/cvs/${cvId}`);
    await request('PUT', `/cvs/${cvId}`, {
      title: 'CV Test Modifié'
    });
    console.log('✅ CV mis à jour\n');
    
    // Test 5: Partager un CV
    console.log(`🔗 Test 5: POST /api/cvs/${cvId}/share`);
    const share = await request('POST', `/cvs/${cvId}/share`);
    console.log(`✅ Lien public: ${share.publicUrl}\n`);
    
    // Test 6: Accéder au CV public
    console.log(`🌐 Test 6: GET /api/public/cv/${share.publicSlug}`);
    const publicCv = await request('GET', `/public/cv/${share.publicSlug}`);
    console.log(`✅ CV public accessible\n`);
    
    // Test 7: Supprimer un CV
    console.log(`🗑️ Test 7: DELETE /api/cvs/${cvId}`);
    await request('DELETE', `/cvs/${cvId}`);
    console.log('✅ CV supprimé\n');
    
    console.log('================================================');
    console.log('✅ TOUS LES TESTS CV RÉUSSIS !');
    console.log('================================================');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    process.exit(1);
  }
}

runTests();