/* filepath: c:\Users\Dayane\Documents\svs\compare-reports.js */
const fs = require('fs');
const path = require('path');

function compareReports() {
  console.log('📊 Comparando relatórios Desktop vs Mobile...');
  
  const desktopDir = './lighthouse-reports-desktop';
  const mobileDir = './lighthouse-reports-mobile';
  
  if (!fs.existsSync(desktopDir) || !fs.existsSync(mobileDir)) {
    console.error('❌ Execute primeiro os audits desktop e mobile');
    return;
  }
  
  // Função para extrair scores de um arquivo JSON
  function extractScores(jsonPath) {
    try {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      return {
        performance: Math.round(data.categories.performance.score * 100),
        accessibility: Math.round(data.categories.accessibility.score * 100),
        bestPractices: Math.round(data.categories['best-practices'].score * 100),
        seo: Math.round(data.categories.seo.score * 100),
        pwa: data.categories.pwa ? Math.round(data.categories.pwa.score * 100) : 'N/A',
        fcp: Math.round(data.audits['first-contentful-paint'].numericValue),
        lcp: Math.round(data.audits['largest-contentful-paint'].numericValue),
        cls: data.audits['cumulative-layout-shift'].numericValue.toFixed(3),
        tbt: Math.round(data.audits['total-blocking-time'].numericValue)
      };
    } catch (error) {
      console.error(`Erro ao ler ${jsonPath}:`, error.message);
      return null;
    }
  }
  
  // Buscar arquivos JSON mais recentes
  const desktopFiles = fs.readdirSync(desktopDir).filter(f => f.endsWith('.json'));
  const mobileFiles = fs.readdirSync(mobileDir).filter(f => f.endsWith('.json'));
  
  if (desktopFiles.length === 0 || mobileFiles.length === 0) {
    console.error('❌ Arquivos JSON não encontrados. Execute lighthouse com output JSON');
    return;
  }
  
  // Pegar arquivo mais recente de cada
  const latestDesktop = desktopFiles.sort().pop();
  const latestMobile = mobileFiles.sort().pop();
  
  const desktopScores = extractScores(path.join(desktopDir, latestDesktop));
  const mobileScores = extractScores(path.join(mobileDir, latestMobile));
  
  if (!desktopScores || !mobileScores) {
    console.error('❌ Erro ao extrair scores dos relatórios');
    return;
  }
  
  console.log('\n📊 COMPARAÇÃO DESKTOP vs MOBILE');
  console.log('=' .repeat(50));
  console.log(`${'Métrica'.padEnd(20)} ${'Desktop'.padEnd(10)} ${'Mobile'.padEnd(10)} ${'Diferença'.padEnd(10)}`);
  console.log('-'.repeat(50));
  
  const metrics = [
    ['Performance', 'performance'],
    ['Accessibility', 'accessibility'],
    ['Best Practices', 'bestPractices'],
    ['SEO', 'seo'],
    ['PWA', 'pwa'],
    ['FCP (ms)', 'fcp'],
    ['LCP (ms)', 'lcp'],
    ['CLS', 'cls'],
    ['TBT (ms)', 'tbt']
  ];
  
  metrics.forEach(([label, key]) => {
    const desktop = desktopScores[key];
    const mobile = mobileScores[key];
    
    let diff = 'N/A';
    if (typeof desktop === 'number' && typeof mobile === 'number') {
      diff = mobile - desktop;
      if (key === 'performance' || key === 'accessibility' || key === 'bestPractices' || key === 'seo') {
        diff = diff > 0 ? `+${diff}` : `${diff}`;
      } else {
        diff = diff > 0 ? `+${diff}` : `${diff}`;
      }
    }
    
    console.log(`${label.padEnd(20)} ${String(desktop).padEnd(10)} ${String(mobile).padEnd(10)} ${String(diff).padEnd(10)}`);
  });
  
  console.log('\n💡 RECOMENDAÇÕES MOBILE:');
  if (mobileScores.performance < desktopScores.performance) {
    console.log('📱 Performance mobile está menor - otimizar para conexões lentas');
  }
  if (mobileScores.lcp > 2500) {
    console.log('📱 LCP muito alto no mobile - otimizar carregamento crítico');
  }
  if (mobileScores.fcp > 1800) {
    console.log('📱 FCP muito alto no mobile - inlinear CSS crítico');
  }
  if (parseFloat(mobileScores.cls) > 0.1) {
    console.log('📱 CLS alto no mobile - verificar layout shifts');
  }
}

compareReports();