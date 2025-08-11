/**
 * SVS Module Loader
 * Carrega módulos dinamicamente
 */
class ModuleLoader {
  constructor() {
    this.loadedModules = new Map();
    this.cache = new Map();
    
    console.log('📦 Module Loader inicializando...');
  }

  /**
   * Carrega um módulo
   */
  async load(moduleName) {
    try {
      // Verifica se já está em cache
      if (this.cache.has(moduleName)) {
        const cachedModule = this.cache.get(moduleName);
        this.renderModule(moduleName, cachedModule.html);
        return cachedModule;
      }

      // Faz requisição para carregar o módulo
      const response = await fetch(`/${moduleName}`, {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'text/html'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      
      // Extrai o conteúdo do módulo
      const moduleContent = this.extractModuleContent(html);
      
      // Cria objeto do módulo
      const moduleObj = {
        name: moduleName,
        html: moduleContent,
        loadedAt: new Date(),
        isActive: true
      };

      // Adiciona ao cache
      this.cache.set(moduleName, moduleObj);
      this.loadedModules.set(moduleName, moduleObj);

      // Renderiza o módulo
      this.renderModule(moduleName, moduleContent);

      // Inicializa scripts específicos do módulo
      await this.initializeModuleScripts(moduleName);

      console.log(`✅ Módulo ${moduleName} carregado e inicializado`);
      return moduleObj;

    } catch (error) {
      console.error(`❌ Erro ao carregar módulo ${moduleName}:`, error);
      throw error;
    }
  }

  /**
   * Extrai conteúdo do módulo do HTML
   */
  extractModuleContent(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Procura por diferentes possíveis containers
    let content = doc.querySelector('.content-area');
    if (!content) {
      content = doc.querySelector('main');
    }
    if (!content) {
      content = doc.querySelector('#content-area');
    }
    if (!content) {
      content = doc.querySelector('.module-content');
    }

    if (content) {
      return content.innerHTML;
    }

    // Se não encontrar containers específicos, retorna o body
    const body = doc.querySelector('body');
    if (body) {
      return body.innerHTML;
    }

    // Fallback: retorna o HTML completo
    return html;
  }

  /**
   * Renderiza módulo no container
   */
  renderModule(moduleName, html) {
    const moduleContainer = document.getElementById('module-container');
    if (!moduleContainer) {
      throw new Error('Container de módulos não encontrado');
    }

    // Atualiza o conteúdo
    moduleContainer.innerHTML = html;

    // Adiciona classe para identificar módulo ativo
    moduleContainer.className = `module-container module-${moduleName}`;

    // Dispara evento de módulo renderizado
    const event = new CustomEvent('moduleRendered', {
      detail: { moduleName, html }
    });
    document.dispatchEvent(event);
  }

  /**
   * Inicializa scripts específicos do módulo
   */
  async initializeModuleScripts(moduleName) {
    try {
      // Tenta carregar script específico do módulo
      const scriptPath = `/static/js/${moduleName}.js`;
      
      // Verifica se já foi carregado
      if (document.querySelector(`script[src="${scriptPath}"]`)) {
        console.log(`📜 Script ${moduleName} já carregado`);
        return;
      }

      // Carrega dinamicamente
      const script = document.createElement('script');
      script.src = scriptPath;
      script.onload = () => {
        console.log(`📜 Script ${moduleName} carregado`);
      };
      script.onerror = () => {
        console.log(`📜 Nenhum script específico para módulo ${moduleName}`);
      };
      document.head.appendChild(script);

    } catch (error) {
      // Não é um erro crítico se o módulo não tiver script específico
      console.log(`📜 Nenhum script específico para módulo ${moduleName}`);
    }

    // Dispara evento genérico de módulo carregado
    const event = new CustomEvent('moduleLoaded', {
      detail: { moduleName }
    });
    document.dispatchEvent(event);
  }

  /**
   * Remove módulo do cache
   */
  clearCache(moduleName = null) {
    if (moduleName) {
      this.cache.delete(moduleName);
      this.loadedModules.delete(moduleName);
      console.log(`🗑️ Cache do módulo ${moduleName} limpo`);
    } else {
      this.cache.clear();
      this.loadedModules.clear();
      console.log('🗑️ Todo cache de módulos limpo');
    }
  }

  /**
   * Lista módulos carregados
   */
  getLoadedModules() {
    return Array.from(this.loadedModules.keys());
  }

  /**
   * Verifica se módulo está carregado
   */
  isLoaded(moduleName) {
    return this.loadedModules.has(moduleName);
  }

  /**
   * Obtém informações do módulo
   */
  getModuleInfo(moduleName) {
    return this.loadedModules.get(moduleName) || null;
  }
}

// Export para window global (compatibilidade)
window.ModuleLoader = ModuleLoader;