/* filepath: c:\Users\Dayane\Documents\svs\run-desktop-lighthouse-fixed.js */
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

async function runDesktopLighthouse() {
  console.log('🚀 Iniciando análise DESKTOP com Lighthouse...');
  
  let chrome;
  try {
    chrome = await chromeLauncher.launch({
      chromeFlags: [
        '--headless',
        '--no-sandbox', 
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--window-size=1920,1080'
      ]
    });
    
    console.log(`📊 Chrome iniciado na porta ${chrome.port}`);
    
    const urls = [
      { url: 'http://localhost:5000/', name: 'home' },
      { url: 'http://localhost:5000/menu', name: 'menu' }
    ];
    
    // CONFIGURAÇÃO MAIS EXPLÍCITA PARA DESKTOP
    const options = {
      logLevel: 'info',
      output: 'html',
      onlyCategories: ['accessibility', 'performance', 'best-practices', 'seo'],
      port: chrome.port,
      
      // CONFIGURAÇÕES EXPLÍCITAS DE DESKTOP
      formFactor: 'desktop',
      throttling: {
        rttMs: 40,
        throughputKbps: 10240,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 10240,
        uploadThroughputKbps: 10240
      },
      screenEmulation: {
        mobile: false,
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        disabled: false
      },
      emulatedUserAgent: false, // USAR USER AGENT DO CHROME REAL
      
      // CONFIGURAÇÕES ADICIONAIS
      disableDeviceEmulation: false,
      locale: 'pt-BR'
    };

    // Criar diretório para relatórios
    const reportsDir = './lighthouse-reports-desktop';
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    for (const {url, name} of urls) {
      console.log(`📋 Analisando: ${url}`);
      
      try {
        // USAR FUNÇÃO LIGHTHOUSE CORRETA
        const runnerResult = await lighthouse(url, options);
        
        if (!runnerResult || !runnerResult.report) {
          throw new Error('Lighthouse não retornou relatório válido');
        }
        
        const reportHtml = runnerResult.report;
        
        const fileName = `lighthouse-desktop-${name}.html`;
        const filePath = path.join(reportsDir, fileName);
        
        fs.writeFileSync(filePath, reportHtml);
        console.log(`✅ Relatório desktop gerado: ${filePath}`);
        
        // Extrair scores
        const lhr = runnerResult.lhr;
        if (lhr && lhr.categories) {
          const accessibilityScore = Math.round(lhr.categories.accessibility.score * 100);
          const performanceScore = Math.round(lhr.categories.performance.score * 100);
          
          console.log(`♿ Acessibilidade: ${accessibilityScore}%`);
          console.log(`⚡ Performance: ${performanceScore}%`);
          console.log(`📱 Form Factor: ${lhr.configSettings.formFactor || 'unknown'}`);
          console.log(`📺 Viewport: ${lhr.configSettings.screenEmulation?.width}x${lhr.configSettings.screenEmulation?.height}`);
        }
        
      } catch (error) {
        console.error(`❌ Erro ao analisar ${url}:`, error.message);
        console.error(error.stack);
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    console.error(error.stack);
  } finally {
    if (chrome) {
      await chrome.kill();
      console.log('🔚 Chrome fechado');
    }
  }
}

runDesktopLighthouse().catch(console.error);