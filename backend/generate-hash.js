// ================================================
// GÉNÉRER UN HASH BCRYPT
// ================================================

require('dotenv').config();
const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'test123';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('================================================');
  console.log('Mot de passe :', password);
  console.log('Hash bcrypt  :', hash);
  console.log('================================================');
  console.log('\nCopie ce hash et mets-le dans ta base de données :');
  console.log(`\nUPDATE users SET password = '${hash}' WHERE email = 'test@cvgenius.com';`);
  console.log('\n');
}

generateHash();