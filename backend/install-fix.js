/**
 * 🔧 Script d'Installation Automatique
 * 
 * Ce script applique automatiquement toutes les corrections
 * pour résoudre l'erreur de timeout PDF
 * 
 * Usage: node install-fix.js
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function createBackup(filePath) {
  const backupPath = `${filePath}.backup-${Date.now()}`;
  try {
    await fs.copyFile(filePath, backupPath);
    log(`✅ Backup créé: ${backupPath}`, 'green');
    return backupPath;
  } catch (error) {
    log(`⚠️  Impossible de créer le backup: ${error.message}`, 'yellow');
    return null;
  }
}

async function installPuppeteer() {
  log('\n📦 Vérification de Puppeteer...', 'blue');
  
  try {
    // Vérifier si Puppeteer est installé
    require.resolve('puppeteer');
    const version = require('puppeteer/package.json').version;
    log(`✅ Puppeteer ${version} déjà installé`, 'green');
    return true;
  } catch {
    log('⚠️  Puppeteer non trouvé, installation...', 'yellow');
    
    try {
      execSync('npm install puppeteer --save', { stdio: 'inherit' });
      log('✅ Puppeteer installé avec succès', 'green');
      return true;
    } catch (error) {
      log('❌ Échec installation Puppeteer', 'red');
      log('   Installe-le manuellement: npm install puppeteer', 'yellow');
      return false;
    }
  }
}

async function updatePackageJson() {
  log('\n📝 Mise à jour de package.json...', 'blue');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  
  if (!await fileExists(packagePath)) {
    log('⚠️  package.json non trouvé dans le répertoire courant', 'yellow');
    return false;
  }

  try {
    const packageContent = await fs.readFile(packagePath, 'utf-8');
    const packageJson = JSON.parse(packageContent);

    // Ajouter des scripts utiles
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    packageJson.scripts['test:pdf'] = 'node diagnostic-pdf.js';
    packageJson.scripts['dev'] = 'nodemon src/server.js';

    await fs.writeFile(packagePath, JSON.stringify(packageJson, null, 2));
    log('✅ package.json mis à jour', 'green');
    return true;
  } catch (error) {
    log(`⚠️  Erreur mise à jour package.json: ${error.message}`, 'yellow');
    return false;
  }
}

async function createDirectories() {
  log('\n📁 Création des répertoires...', 'blue');
  
  const dirs = [
    'src/utils',
    'src/controllers',
    'src/templates',
    'logs',
  ];

  for (const dir of dirs) {
    const dirPath = path.join(process.cwd(), dir);
    try {
      await fs.mkdir(dirPath, { recursive: true });
      log(`✅ Répertoire créé: ${dir}`, 'green');
    } catch (error) {
      if (error.code !== 'EEXIST') {
        log(`⚠️  Erreur création ${dir}: ${error.message}`, 'yellow');
      }
    }
  }
}

async function createEnvExample() {
  log('\n🔐 Création du fichier .env.example...', 'blue');
  
  const envExample = `
# Configuration CVGenius
NODE_ENV=development
PORT=3000

# PDF Generation
PDF_TIMEOUT=45000
PDF_MAX_PAGES=10
PDF_FORMAT=A4

# Puppeteer
PUPPETEER_HEADLESS=true
PUPPETEER_ARGS=--no-sandbox,--disable-setuid-sandbox,--disable-dev-shm-usage

# Logging
LOG_LEVEL=info
`.trim();

  const envPath = path.join(process.cwd(), '.env.example');
  
  try {
    await fs.writeFile(envPath, envExample);
    log('✅ .env.example créé', 'green');
    log('   Copie-le en .env et personnalise les valeurs', 'blue');
  } catch (error) {
    log(`⚠️  Erreur création .env.example: ${error.message}`, 'yellow');
  }
}

async function installFixes() {
  log('\n', 'reset');
  log('════════════════════════════════════════════', 'magenta');
  log('🔧 INSTALLATION DES CORRECTIONS PDF', 'magenta');
  log('════════════════════════════════════════════', 'magenta');
  log('\n', 'reset');

  const steps = [
    {
      name: 'Vérification de Puppeteer',
      action: installPuppeteer,
    },
    {
      name: 'Création des répertoires',
      action: createDirectories,
    },
    {
      name: 'Mise à jour de package.json',
      action: updatePackageJson,
    },
    {
      name: 'Création de .env.example',
      action: createEnvExample,
    },
  ];

  const results = [];

  for (const step of steps) {
    try {
      const success = await step.action();
      results.push({ name: step.name, success });
    } catch (error) {
      log(`❌ Erreur: ${error.message}`, 'red');
      results.push({ name: step.name, success: false });
    }
  }

  // Instructions finales
  log('\n', 'reset');
  log('════════════════════════════════════════════', 'magenta');
  log('📋 PROCHAINES ÉTAPES', 'magenta');
  log('════════════════════════════════════════════', 'magenta');
  log('\n', 'reset');

  log('1️⃣  Copie les fichiers corrigés:', 'blue');
  log('   - pdfGenerator-fixed.js → src/utils/pdfGenerator.js', 'yellow');
  log('   - pdfController-fixed.js → src/controllers/pdfController.js', 'yellow');
  log('', 'reset');

  log('2️⃣  Lance le diagnostic:', 'blue');
  log('   npm run test:pdf', 'yellow');
  log('   ou: node diagnostic-pdf.js', 'yellow');
  log('', 'reset');

  log('3️⃣  Redémarre ton serveur:', 'blue');
  log('   npm start', 'yellow');
  log('', 'reset');

  log('4️⃣  Teste la génération:', 'blue');
  log('   http://localhost:3000/api/pdf/test', 'yellow');
  log('', 'reset');

  log('════════════════════════════════════════════', 'magenta');
  log('✅ Installation terminée !', 'green');
  log('════════════════════════════════════════════', 'magenta');
  log('\n', 'reset');

  // Résumé
  const successCount = results.filter(r => r.success).length;
  log(`📊 Résultat: ${successCount}/${results.length} étapes réussies`, 
    successCount === results.length ? 'green' : 'yellow');

  if (successCount < results.length) {
    log('\n⚠️  Certaines étapes ont échoué, mais tu peux continuer manuellement.', 'yellow');
  }

  log('\n💡 Consulte README-SOLUTION.md pour plus d\'infos\n', 'blue');
}

// Point d'entrée
if (require.main === module) {
  installFixes()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('\n❌ Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { installFixes };