// TEST RAPIDE DES MODELS
require('dotenv').config();
const User = require('./src/models/User');
const Cv = require('./src/models/Cv');
const Analytics = require('./src/models/Analytics');

async function testModels() {
  try {
    console.log('🧪 Test des Models...\n');
    
    // Test User
    console.log('📊 Nombre d\'utilisateurs:', await User.count());
    const user = await User.findByEmail('test@cvgenius.com');
    console.log('👤 User test:', user ? user.email : 'Non trouvé');
    
    // Test Cv
    console.log('\n📊 Nombre de CV:', await Cv.count());
    const cvs = await Cv.findByUserId(1);
    console.log('📄 CV de l\'user #1:', cvs.length);
    
    // Test Analytics
    const stats = await Analytics.getStatsByCvId(1);
    console.log('\n📈 Stats CV #1:', stats);
    
    console.log('\n✅ Tests terminés !');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

testModels();