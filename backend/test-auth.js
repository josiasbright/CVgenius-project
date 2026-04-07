// ================================================
// TEST DE L'AUTHENTIFICATION - VERSION DEBUG
// ================================================

// ✅ TOUJOURS EN PREMIER
require('dotenv').config();

const axios = require('axios');

const API_URL = 'http://localhost:3000/api/auth';
const SERVER_URL = 'http://localhost:3000';

// Stocker le cookie pour les requêtes suivantes
let authCookie = '';

// ================================================
// VÉRIFIER SI LE SERVEUR EST DÉMARRÉ
// ================================================
async function checkServer() {
  try {
    await axios.get(SERVER_URL);
    return true;
  } catch (error) {
    return false;
  }
}

// ================================================
// HELPER : Faire une requête avec cookie
// ================================================
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
    
    console.log(`\n🔍 Requête: ${method} ${endpoint}`);
    if (data) {
      console.log('📤 Body:', JSON.stringify(data, null, 2));
    }
    
    const response = await axios(config);
    
    console.log(`📥 Status: ${response.status}`);
    console.log('📥 Réponse:', JSON.stringify(response.data, null, 2));
    
    // Récupérer le cookie si présent
    if (response.headers['set-cookie']) {
      authCookie = response.headers['set-cookie'][0].split(';')[0];
      console.log('🍪 Cookie:', authCookie);
    }
    
    return response.data;
    
  } catch (error) {
    if (error.response) {
      // Erreur HTTP (400, 401, 500, etc.)
      console.error(`\n❌ ${error.response.status}:`, error.response.data);
      throw error;
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n❌ ERREUR: Impossible de se connecter au serveur');
      console.error('👉 Le serveur est-il démarré ? (npm run dev)\n');
      throw new Error('Serveur non démarré');
    }
    
    console.error('\n❌ ERREUR:', error.message);
    throw error;
  }
}

// ================================================
// TESTS
// ================================================

async function runTests() {
  try {
    console.log('🧪 Tests d\'authentification\n');
    console.log('================================================\n');
    
    // Vérifier que le serveur est démarré
    console.log('🔍 Vérification du serveur...');
    const serverRunning = await checkServer();
    
    if (!serverRunning) {
      console.error('❌ ERREUR: Le serveur n\'est pas démarré !');
      console.error('\n👉 Ouvre un autre terminal et lance:');
      console.error('   cd backend');
      console.error('   npm run dev\n');
      console.error('Puis relance ce test.\n');
      process.exit(1);
    }
    
    console.log('✅ Serveur accessible\n');
    console.log('================================================\n');
    
    // Test 1: Register
    console.log('📝 Test 1: Register (nouvel utilisateur)');
    const randomEmail = `test${Date.now()}@cvgenius.com`;
    
    const registerResponse = await request('POST', '/register', {
      email: randomEmail,
      password: 'test123456',
      firstName: 'Test',
      lastName: 'User'
    });
    
    console.log('\n✅ Test 1 RÉUSSI\n');
    
    // Test 2: Login
    console.log('================================================\n');
    console.log('🔑 Test 2: Login (utilisateur existant)');
    
    const loginResponse = await request('POST', '/login', {
      email: 'test@cvgenius.com',
      password: 'test123'
    });
    
    console.log('\n✅ Test 2 RÉUSSI\n');
    
    // Test 3: Me
    console.log('================================================\n');
    console.log('👤 Test 3: Me (utilisateur connecté)');
    
    const meResponse = await request('GET', '/me');
    
    console.log('\n✅ Test 3 RÉUSSI\n');
    
    // Test 4: Logout
    console.log('================================================\n');
    console.log('🚪 Test 4: Logout');
    
    const logoutResponse = await request('POST', '/logout');
    authCookie = '';
    
    console.log('\n✅ Test 4 RÉUSSI\n');
    
    console.log('================================================');
    console.log('✅ TOUS LES TESTS DE BASE RÉUSSIS !');
    console.log('================================================');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ ERREUR DANS LES TESTS:', error.message);
    
    if (error.response) {
      console.error('\n📥 Réponse du serveur:');
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.stack) {
      console.error('\n📚 Stack trace:');
      console.error(error.stack);
    }
    
    process.exit(1);
  }
}

// ================================================
// LANCER LES TESTS
// ================================================

runTests();