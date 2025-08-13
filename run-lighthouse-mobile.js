/* filepath: c:\Users\Dayane\Documents\svs\run-lighthouse-mobile.js */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function runLighthouseMobile() {
  console.log('📱 Executando Lighthouse CLI para MOBILE...');
  
  const urls = [
    { url: 'http://localhost:5000/', name: 'home' },
    { url: 'http://localhost:5000/menu', name: 'menu' }
  ];
  
  // Criar diretório para relatórios mobile
  const reportsDir = './lighthouse-reports-mobile';
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  urls.forEach(({url, name}, index) => {
    const outputPath = path.join(reportsDir, `lighthouse-mobile-${name}-${new Date().toISOString().slice(0,10)}.html`);
    
    console.log(`📋 Analisando (Mobile): ${url}`);
    
    // Delay entre execuções para não sobrecarregar
    setTimeout(() => {
      const lighthouse = spawn('npx', [
        'lighthouse',
        url,
        
        // CONFIGURAÇÕES MOBILE (sem preset inválido)
        '--form-factor=mobile',
        '--screenEmulation.mobile=true',
        '--screenEmulation.width=360',
        '--screenEmulation.height=640',
        '--screenEmulation.deviceScaleFactor=2',
        '--emulated-user-agent=Mozilla/5.0 (Linux; Android 11; SM-A205U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.5414.118 Mobile Safari/537.36',
        
        // THROTTLING MOBILE (simulando 4G)
        '--throttling.rttMs=150',
        '--throttling.throughputKbps=1638',
        '--throttling.requestLatencyMs=150',
        '--throttling.downloadThroughputKbps=1638',
        '--throttling.uploadThroughputKbps=750',
        '--throttling.cpuSlowdownMultiplier=4',
        
        // CATEGORIAS E AUDITORIA
        '--only-categories=accessibility,performance,best-practices,seo,pwa',
        '--locale=pt-BR',
        
        // CONFIGURAÇÕES DE OUTPUT
        '--output=html',
        '--output=json',
        `--output-path=${outputPath}`,
        
        // FLAGS DO CHROME PARA MOBILE
        '--chrome-flags=--headless --no-sandbox --disable-gpu --disable-dev-shm-usage --disable-setuid-sandbox --no-first-run --no-zygote --window-size=360,640',
        
        // CONFIGURAÇÕES ADICIONAIS
        '--disable-storage-reset',
        '--max-wait-for-fcp=15000',
        '--max-wait-for-load=35000',
        '--skip-audits=uses-http2'
        
      ], {
        stdio: 'inherit',
        shell: true
      });
      
      lighthouse.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ Relatório mobile gerado: ${outputPath}`);
          
          // Gerar relatório JSON também
          const jsonPath = outputPath.replace('.html', '.json');
          console.log(`📊 Dados JSON salvos em: ${jsonPath}`);
          
        } else {
          console.error(`❌ Erro ao gerar relatório mobile para ${url} (código: ${code})`);
        }
      });
      
      lighthouse.on('error', (error) => {
        console.error(`❌ Erro ao executar lighthouse mobile:`, error.message);
      });
      
    }, index * 5000); // 5s delay entre cada URL
  });
}

// Verificar se o servidor está rodando
function checkServer() {
  const { execSync } = require('child_process');
  
  try {
    execSync('curl -f http://localhost:5000/health', { stdio: 'ignore' });
    console.log('✅ Servidor Flask detectado em localhost:5000');
    return true;
  } catch (error) {
    console.error('❌ Servidor Flask não está rodando em localhost:5000');
    console.log('💡 Execute: python app.py');
    return false;
  }
}

// Executar
if (checkServer()) {
  runLighthouseMobile();
} else {
  process.exit(1);
}