/* filepath: c:\Users\Dayane\Documents\svs\unlighthouse.config.ts */
export default {
  site: 'http://localhost:5000/',
  
  scanner: {
    include: ['/', '/menu', '/ad'],
    exclude: ['/static/**', '/favicon.ico', '/**/.*', '/health'],
    crawler: true,
    maxRoutes: 5
  },
  
  lighthouse: {
    settings: {
      // FORÇAR DESKTOP EXPLICITAMENTE
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      locale: 'pt-BR',
      formFactor: 'desktop',
      
      // CONFIGURAÇÕES EXPLÍCITAS DE DESKTOP
      screenEmulation: {
        mobile: false,
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        disabled: false
      },
      
      // USER AGENT DESKTOP
      emulatedUserAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      
      // THROTTLING DESKTOP
      throttling: {
        rttMs: 40,
        throughputKbps: 10240,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 10240,
        uploadThroughputKbps: 10240
      },
      
      // CONFIGURAÇÕES ADICIONAIS
      waitUntil: 'networkidle0',
      timeout: 30000,
      
      // DESABILITAR MOBILE EXPLICITAMENTE
      disableDeviceEmulation: false,
      blockedUrlPatterns: [],
      skipAudits: []
    }
  },
  
  // CONFIGURAÇÃO DO UNLIGHTHOUSE
  outputPath: './unlighthouse-reports-desktop',
  cache: false,
  
  server: {
    port: 5678,
    host: 'localhost',
    showBanner: true
  },
  
  debug: true, // ATIVAR para ver logs
  verbose: true
}