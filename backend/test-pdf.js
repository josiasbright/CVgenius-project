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

async function runTest() {
  try {
    console.log('🧪 Test de génération PDF\n');
    
    // Login
    console.log('🔑 Login...');
    await request('POST', '/auth/login', {
      email: 'test@cvgenius.com',
      password: 'test123'
    });
    console.log('✅ Connecté\n');
    
    // Générer le PDF du CV #1
    console.log('📄 Génération du PDF du CV #1...');
    const pdfData = await request('POST', '/pdf/generate/1', null, 'arraybuffer');
    
    // Sauvegarder le PDF
    fs.writeFileSync('CV_Test.pdf', pdfData);
    console.log('✅ PDF généré et sauvegardé : CV_Test.pdf\n');
    
    console.log('================================================');
    console.log('✅ TEST PDF RÉUSSI !');
    console.log('Ouvre CV_Test.pdf pour voir le résultat');
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

runTest();