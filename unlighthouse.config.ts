export default {
  // URL base do seu site Flask
  site: 'http://localhost:5000/',
  
  // Configurações do scanner
  scanner: {
    // Incluir apenas as rotas que existem
    include: [
      // '/menu',
      '/ad'
    ],
    
    // Excluir rotas que podem dar problema
    exclude: [
      // '/static/**',     // Arquivos estáticos
      '/favicon.ico',   // Favicon
      '/**/.*',         // Arquivos ocultos
    ],
    
    // Desabilitar crawler para focar apenas no menu
    crawler: false,
    
    // Limitar a apenas uma rota
    maxRoutes: 1,
  },
  
  // Configurações do Lighthouse
  lighthouse: {
    settings: {
      onlyCategories: [
        'performance',
        'accessibility', 
        'best-practices',
        'seo'
      ],
      
      // CONFIGURAR IDIOMA PORTUGUÊS PARA OS RELATÓRIOS
      locale: 'pt-BR',
      
      // Configurações específicas para sistema interno
      formFactor: 'desktop',
      
      // Simular conexão rápida para intranet
      throttling: {
        rttMs: 40,
        throughputKbps: 10240,
        cpuSlowdownMultiplier: 1,
      }
    }
  },
  
  // Configurações de output
  outputPath: './unlighthouse-reports',
  
  // Cache para melhor performance
  cache: true,
  
  // Configurações do servidor de relatórios
  server: {
    port: 5678,
    host: 'localhost'
  }
}