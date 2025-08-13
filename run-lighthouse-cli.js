/* filepath: c:\Users\Dayane\Documents\svs\run-lighthouse-cli.js */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function runLighthouseCLI() {
  console.log('🚀 Executando Lighthouse CLI para DESKTOP...');
  
  const urls = [
    { url: 'http://localhost:5000/', name: 'home' },
    { url: 'http://localhost:5000/menu', name: 'menu' }
  ];
  
  // Criar diretório
  const reportsDir = './lighthouse-reports-desktop';
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  urls.forEach(({url, name}) => {
    const outputPath = path.join(reportsDir, `lighthouse-desktop-${name}.html`);
    
    console.log(`📋 Analisando: ${url}`);
    
    const lighthouse = spawn('npx', [
      'lighthouse',
      url,
      '--form-factor=desktop',
      '--preset=desktop',
      '--screenEmulation.mobile=false',
      '--screenEmulation.width=1920',
      '--screenEmulation.height=1080',
      '--screenEmulation.deviceScaleFactor=1',
      '--throttling.rttMs=40',
      '--throttling.throughputKbps=10240',
      '--throttling.cpuSlowdownMultiplier=1',
      '--emulated-user-agent=false',
      '--only-categories=accessibility,performance,best-practices,seo',
      '--locale=pt-BR',
      '--output=html',
      `--output-path=${outputPath}`,
      '--chrome-flags=--headless --no-sandbox --window-size=1920,1080'
    ], {
      stdio: 'inherit',
      shell: true
    });
    
    lighthouse.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ Relatório desktop gerado: ${outputPath}`);
      } else {
        console.error(`❌ Erro ao gerar relatório para ${url} (código: ${code})`);
      }
    });
    
    lighthouse.on('error', (error) => {
      console.error(`❌ Erro ao executar lighthouse:`, error.message);
    });
  });
}

runLighthouseCLI();