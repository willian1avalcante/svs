/**
 * Sistema SPA (Single Page Application) para o SVS
 * RESPONSABILIDADE: APENAS roteamento e navegação
 */
class SVS_SPA {
    constructor() {
        this.currentModule = null;
        this.contentArea = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.contentArea = document.getElementById('content-area');
            this.setupEventListeners();
            this.detectCurrentModule();
        });
    }

    setupEventListeners() {
        // Event listener para botões do menu com data-module
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-module]')) {
                e.preventDefault();
                const module = e.target.getAttribute('data-module');
                this.loadModule(module);
            }
        });

        // Event listener para formulários SPA
        document.addEventListener('submit', (e) => {
            // Identifica formulários que devem ser processados via SPA
            if (e.target.classList.contains('ad-form')) {
                e.preventDefault();
                this.handleModuleForm(e.target);
            }
        });
    }

    detectCurrentModule() {
        // Detecta módulo baseado na URL inicial (caso chegue via link direto)
        const path = window.location.pathname;
        if (path.includes('/ad')) {
            this.currentModule = 'ad';
            this.setActiveMenuItem('ad');
        } else {
            // Carrega tela inicial padrão
            this.showWelcomeScreen();
        }
    }

    async loadModule(moduleName) {
        try {
            // Mostra loading
            this.showLoading();

            // Atualiza estado visual do menu
            this.updateMenuState(moduleName);

            // Faz requisição AJAX para carregar o módulo
            const response = await fetch(`/${moduleName}`, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (response.ok) {
                const html = await response.text();
                
                // Extrai apenas o conteúdo da área de módulo
                const contentArea = this.extractModuleContent(html);
                
                // Atualiza o conteúdo
                this.contentArea.innerHTML = contentArea;

                // Inicializa o módulo (dispara evento para o módulo se inicializar)
                this.initializeModule(moduleName);
                this.currentModule = moduleName;

            } else {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

        } catch (error) {
            console.error('Erro ao carregar módulo:', error);
            this.showError(`Erro ao carregar módulo ${moduleName}. Verifique a conexão.`);
        }
    }

    extractModuleContent(html) {
        // Extrai apenas o conteúdo da section content-area
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const moduleContent = doc.querySelector('.content-area');
        
        if (moduleContent) {
            return moduleContent.innerHTML;
        }
        
        // Se não encontrar content-area, retorna o HTML completo
        return html;
    }

    async handleModuleForm(form) {
        try {
            this.showLoading();

            const formData = new FormData(form);
            
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (response.ok) {
                const html = await response.text();
                const contentArea = this.extractModuleContent(html);
                
                // Atualiza apenas o conteúdo
                this.contentArea.innerHTML = contentArea;
                
                // Reinicializa o módulo
                this.initializeModule(this.currentModule);

            } else {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

        } catch (error) {
            console.error('Erro ao processar formulário:', error);
            this.showError('Erro ao processar formulário. Tente novamente.');
        }
    }

    updateMenuState(moduleName) {
        // Remove classe active de todos os botões
        document.querySelectorAll('.menu-button-inline').forEach(btn => {
            btn.classList.remove('active');
        });

        // Adiciona classe active no botão selecionado
        this.setActiveMenuItem(moduleName);
    }

    setActiveMenuItem(moduleName) {
        const button = document.querySelector(`[data-module="${moduleName}"]`);
        if (button) {
            button.classList.add('active');
        }
    }

    initializeModule(moduleName) {
        // Dispara evento customizado para que cada módulo se inicialize
        const event = new CustomEvent('moduleLoaded', {
            detail: { moduleName: moduleName }
        });
        document.dispatchEvent(event);

        console.log(`📦 Módulo ${moduleName} carregado - evento 'moduleLoaded' disparado`);
    }

    showWelcomeScreen() {
        if (this.contentArea) {
            this.contentArea.innerHTML = `
                <div class="welcome-message">
                    <h1>Sistema de Vendas Skymsen</h1>
                    <p>Selecione uma opção no menu lateral para começar.</p>
                    <div class="welcome-stats">
                        <div class="stat-card">
                            <h3>Módulos Disponíveis</h3>
                            <span class="stat-number">8</span>
                        </div>
                        <div class="stat-card">
                            <h3>Sistema</h3>
                            <span class="stat-text">SVS v2.0</span>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    showLoading() {
        if (this.contentArea) {
            this.contentArea.innerHTML = `
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <p>Carregando...</p>
                </div>
            `;
        }
    }

    showError(message) {
        if (this.contentArea) {
            this.contentArea.innerHTML = `
                <div class="error-container">
                    <div class="error-icon">⚠️</div>
                    <h3>Erro</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="btn btn-primary">
                        Recarregar Página
                    </button>
                </div>
            `;
        }
    }
}

// Inicializa o sistema SPA
window.svsApp = new SVS_SPA();