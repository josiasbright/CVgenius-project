// ================================================
// TEST DES ANALYTICS
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
    console.log('🧪 Tests des Analytics\n');
    console.log('================================================\n');
    
    // Login
    console.log('🔑 Login...');
    await request('POST', '/auth/login', {
      email: 'test@cvgenius.com',
      password: 'test123'
    });
    console.log('✅ Connecté\n');
    
    // Test 1: Dashboard
    console.log('📊 Test 1: GET /api/analytics/dashboard');
    const dashboard = await request('GET', '/analytics/dashboard');
    console.log(`✅ ${dashboard.totalCvs} CV | ${dashboard.totalViews} vues | ${dashboard.totalDownloads} downloads\n`);
    
    // Test 2: Stats d'un CV
    console.log('📈 Test 2: GET /api/analytics/cv/1');
    const cvStats = await request('GET', '/analytics/cv/1');
    console.log(`✅ CV: ${cvStats.cvTitle}`);
    console.log(`   Vues: ${cvStats.stats.views}`);
    console.log(`   Downloads: ${cvStats.stats.downloads}\n`);
    
    // Test 3: Activité récente
    console.log('🕐 Test 3: GET /api/analytics/activity');
    const activity = await request('GET', '/analytics/activity?hours=24');
    console.log(`✅ ${activity.activity.length} événements dernières 24h\n`);
    
    console.log('================================================');
    console.log('✅ TOUS LES TESTS ANALYTICS RÉUSSIS !');
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