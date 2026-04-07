/**
 * 🩺 Script de Diagnostic PDF - CVGenius
 * 
 * Ce script teste ta configuration Puppeteer et identifie les problèmes
 * Lance-le avec: node diagnostic-pdf.js
 */

const puppeteer = require('puppeteer');
const os = require('os');
const fs = require('fs').promises;
const path = require('path');

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

// Tests à effectuer
const tests = [];

// Test 1: Vérifier que Puppeteer est installé
tests.push({
  name: 'Installation de Puppeteer',
  async run() {
    try {
      const puppeteerVersion = require('puppeteer/package.json').version;
      log(`✅ Puppeteer ${puppeteerVersion} installé`, 'green');
      return { success: true, version: puppeteerVersion };
    } catch (error) {
      log('❌ Puppeteer n\'est pas installé', 'red');
      log('   Installe-le avec: npm install puppeteer', 'yellow');
      return { success: false, error: error.message };
    }
  }
});

// Test 2: Vérifier les ressources système
tests.push({
  name: 'Ressources Système',
  async run() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsagePercent = (usedMem / totalMem * 100).toFixed(1);

    log(`💻 Système: ${os.platform()} ${os.arch()}`, 'blue');
    log(`📊 RAM totale: ${(totalMem / 1024 / 1024 / 1024).toFixed(2)} GB`, 'blue');
    log(`📊 RAM utilisée: ${memUsagePercent}%`, 'blue');
    log(`📊 RAM disponible: ${(freeMem / 1024 / 1024).toFixed(0)} MB`, 'blue');

    if (freeMem < 512 * 1024 * 1024) {
      log('⚠️  ATTENTION: Peu de mémoire disponible (< 512 MB)', 'yellow');
      log('   Ferme d\'autres programmes ou augmente la RAM', 'yellow');
      return { success: false, warning: 'Low memory' };
    }

    log('✅ Ressources système OK', 'green');
    return { success: true };
  }
});

// Test 3: Lancer Puppeteer
tests.push({
  name: 'Lancement de Puppeteer',
  async run() {
    let browser = null;
    try {
      log('🚀 Lancement du navigateur...', 'blue');
      const startTime = Date.now();

      browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
        timeout: 30000,
      });

      const launchTime = Date.now() - startTime;
      log(`✅ Navigateur lancé en ${launchTime}ms`, 'green');

      return { success: true, launchTime };
    } catch (error) {
      log('❌ Impossible de lancer le navigateur', 'red');
      log(`   Erreur: ${error.message}`, 'red');
      return { success: false, error: error.message };
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
});

// Test 4: Test de génération PDF simple
tests.push({
  name: 'Génération PDF Simple',
  async run() {
    let browser = null;
    let page = null;

    try {
      log('📄 Test de génération PDF...', 'blue');
      const startTime = Date.now();

      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      page = await browser.newPage();

      const simpleHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Test</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { color: #333; }
          </style>
        </head>
        <body>
          <h1>Test PDF Simple</h1>
          <p>Si vous voyez ce PDF, la génération fonctionne ! ✅</p>
        </body>
        </html>
      `;

      await page.goto('about:blank');
      await page.setContent(simpleHtml, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      const pdfBuffer = await page.pdf({ format: 'A4' });
      const genTime = Date.now() - startTime;

      // Sauvegarder le PDF de test
      const outputPath = path.join(process.cwd(), 'test-simple.pdf');
      await fs.writeFile(outputPath, pdfBuffer);

      log(`✅ PDF simple généré en ${genTime}ms`, 'green');
      log(`   Fichier sauvegardé: ${outputPath}`, 'green');

      return { success: true, genTime, size: pdfBuffer.length };
    } catch (error) {
      log('❌ Échec génération PDF simple', 'red');
      log(`   Erreur: ${error.message}`, 'red');
      return { success: false, error: error.message };
    } finally {
      if (page) await page.close();
      if (browser) await browser.close();
    }
  }
});

// Test 5: Test avec HTML complexe
tests.push({
  name: 'Génération PDF Complexe',
  async run() {
    let browser = null;
    let page = null;

    try {
      log('📄 Test avec HTML complexe...', 'blue');
      const startTime = Date.now();

      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      page = await browser.newPage();

      // HTML plus complexe (simule un vrai CV)
      const complexHtml = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>CV Test</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              padding: 30px;
              color: #333;
            }
            .header {
              border-bottom: 3px solid #007bff;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            h1 { font-size: 32pt; color: #2c3e50; }
            h2 { 
              font-size: 16pt; 
              color: #007bff; 
              margin-top: 20px;
              margin-bottom: 10px;
            }
            .section { margin-bottom: 25px; }
            .item { margin-bottom: 15px; }
            .company { font-weight: 600; }
            .period { color: #666; font-style: italic; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>John Doe</h1>
            <p>Développeur Full Stack</p>
            <p>john@example.com | +33 6 12 34 56 78</p>
          </div>

          <div class="section">
            <h2>Expérience Professionnelle</h2>
            ${Array.from({ length: 5 }, (_, i) => `
              <div class="item">
                <h3>Poste ${i + 1}</h3>
                <p class="company">Entreprise ${i + 1}</p>
                <p class="period">2020 - 2024</p>
                <p>Description de l'expérience avec plusieurs lignes de texte pour tester le rendu et la pagination du PDF.</p>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2>Formation</h2>
            <div class="item">
              <h3>Master Informatique</h3>
              <p class="company">Université de Paris</p>
              <p class="period">2018 - 2020</p>
            </div>
          </div>

          <div class="section">
            <h2>Compétences</h2>
            <p>JavaScript, Python, React, Node.js, Docker, AWS</p>
          </div>
        </body>
        </html>
      `;

      await page.goto('about:blank');
      await page.setContent(complexHtml, {
        waitUntil: 'networkidle0',
        timeout: 45000,  // Timeout plus long pour HTML complexe
      });

      await page.evaluateHandle('document.fonts.ready');
      await new Promise(resolve => setTimeout(resolve, 500));

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
      });

      const genTime = Date.now() - startTime;

      // Sauvegarder le PDF de test
      const outputPath = path.join(process.cwd(), 'test-complexe.pdf');
      await fs.writeFile(outputPath, pdfBuffer);

      log(`✅ PDF complexe généré en ${genTime}ms`, 'green');
      log(`   Taille: ${(pdfBuffer.length / 1024).toFixed(2)} KB`, 'green');
      log(`   Fichier sauvegardé: ${outputPath}`, 'green');

      if (genTime > 20000) {
        log('⚠️  Génération lente (> 20s) - Optimisation recommandée', 'yellow');
      }

      return { success: true, genTime, size: pdfBuffer.length };
    } catch (error) {
      log('❌ Échec génération PDF complexe', 'red');
      log(`   Erreur: ${error.message}`, 'red');

      if (error.message.includes('timeout')) {
        log('', 'red');
        log('💡 CONSEILS POUR RÉSOUDRE LE TIMEOUT:', 'yellow');
        log('   1. Augmente le timeout à 60000 (60s)', 'yellow');
        log('   2. Inline tous les styles CSS', 'yellow');
        log('   3. Supprime les scripts et iframes', 'yellow');
        log('   4. Convertis les images en base64', 'yellow');
        log('   5. Simplifie le HTML si trop complexe', 'yellow');
      }

      return { success: false, error: error.message };
    } finally {
      if (page) await page.close();
      if (browser) await browser.close();
    }
  }
});

// Test 6: Test avec ressources externes (pour détecter les problèmes)
tests.push({
  name: 'Détection Ressources Externes',
  async run() {
    let browser = null;
    let page = null;

    try {
      log('🔍 Test détection ressources externes...', 'blue');

      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      page = await browser.newPage();

      const requests = [];
      page.on('request', req => {
        if (req.url() !== 'about:blank') {
          requests.push({
            url: req.url(),
            type: req.resourceType(),
          });
        }
      });

      const htmlWithExternal = `
        <!DOCTYPE html>
        <html>
        <head>
          <link rel="stylesheet" href="https://cdn.example.com/style.css">
        </head>
        <body>
          <img src="https://example.com/logo.png">
          <script src="https://cdn.example.com/script.js"></script>
        </body>
        </html>
      `;

      await page.goto('about:blank');
      await page.setContent(htmlWithExternal, {
        waitUntil: 'networkidle2',
        timeout: 10000,
      }).catch(() => {
        // On s'attend à ce que ça timeout
      });

      if (requests.length > 0) {
        log('⚠️  Ressources externes détectées:', 'yellow');
        requests.forEach(req => {
          log(`   - ${req.type}: ${req.url}`, 'yellow');
        });
        log('   Ces ressources peuvent causer des timeouts !', 'yellow');
        return { success: false, warning: 'External resources found', requests };
      } else {
        log('✅ Aucune ressource externe détectée', 'green');
        return { success: true };
      }
    } catch (error) {
      // C'est normal que ce test timeout
      return { success: true, note: 'Test completed (timeout expected)' };
    } finally {
      if (page) await page.close();
      if (browser) await browser.close();
    }
  }
});

// Fonction principale
async function runDiagnostics() {
  log('', 'reset');
  log('════════════════════════════════════════════', 'magenta');
  log('🩺  DIAGNOSTIC PDF - CVGenius', 'magenta');
  log('════════════════════════════════════════════', 'magenta');
  log('', 'reset');

  const results = [];

  for (const test of tests) {
    log(`\n▶ Test: ${test.name}`, 'blue');
    log('─'.repeat(50), 'blue');

    try {
      const result = await test.run();
      results.push({ name: test.name, ...result });
    } catch (error) {
      log(`❌ Erreur inattendue: ${error.message}`, 'red');
      results.push({ name: test.name, success: false, error: error.message });
    }

    await new Promise(resolve => setTimeout(resolve, 1000)); // Pause entre les tests
  }

  // Résumé final
  log('\n', 'reset');
  log('════════════════════════════════════════════', 'magenta');
  log('📊  RÉSUMÉ DU DIAGNOSTIC', 'magenta');
  log('════════════════════════════════════════════', 'magenta');
  log('', 'reset');

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  results.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    const color = result.success ? 'green' : 'red';
    log(`${icon} ${result.name}`, color);
  });

  log('', 'reset');
  log(`Total: ${passed}/${tests.length} tests réussis`, passed === tests.length ? 'green' : 'yellow');

  if (failed > 0) {
    log('', 'reset');
    log('💡 RECOMMANDATIONS:', 'yellow');
    log('', 'reset');

    if (results[0].success === false) {
      log('1. Installe Puppeteer: npm install puppeteer', 'yellow');
    }
    if (results[1].success === false) {
      log('2. Libère de la mémoire ou augmente la RAM', 'yellow');
    }
    if (results.some(r => r.error && r.error.includes('timeout'))) {
      log('3. Consulte le guide GUIDE_RESOLUTION_TIMEOUT.md', 'yellow');
      log('4. Augmente les timeouts et inline les styles CSS', 'yellow');
    }
  } else {
    log('', 'reset');
    log('🎉 Toutes les vérifications sont passées !', 'green');
    log('Tu peux maintenant générer des PDFs sans problème.', 'green');
  }

  log('', 'reset');
  log('════════════════════════════════════════════', 'magenta');
  log('', 'reset');

  // Sauvegarder les résultats dans un fichier JSON
  const reportPath = path.join(process.cwd(), 'diagnostic-report.json');
  await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
  log(`📝 Rapport complet sauvegardé: ${reportPath}`, 'blue');
}

// Lancer le diagnostic
if (require.main === module) {
  runDiagnostics()
    .then(() => {
      log('\n✅ Diagnostic terminé\n', 'green');
      process.exit(0);
    })
    .catch(error => {
      log('\n❌ Erreur lors du diagnostic:', 'red');
      console.error(error);
      process.exit(1);
    });
}

module.exports = { runDiagnostics };