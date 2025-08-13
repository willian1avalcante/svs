/* filepath: c:\Users\Dayane\Documents\svs\app\static\js\core\app.js */
/**
 * SVS App - Controlador Principal da Aplicação - Versão Otimizada
 */
class SVSApp {
    constructor() {
        this.moduloAtual = null;
        this.navbar = null;
        this.carregadorModulos = null;
        this.roteador = null;
        this.inicializado = false;
        this.navbarCarregada = false;
        this.config = window.SVS_CONFIG || {};

        console.log('🚀 SVS App inicializando...');
    }

    async init() {
        try {
            this.esconderCarregamento();

            // Aguardar DOM estar pronto
            if (document.readyState !== 'complete') {
                await new Promise(resolve => {
                    if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', resolve);
                    } else {
                        resolve();
                    }
                });
            }

            // REMOVER dependência da navbar - inicializar sem ela
            await this.inicializarRoteador();
            await this.inicializarCarregadorModulos();
            this.configurarEventosGlobais();
            this.tratarRotaInicial();

            this.inicializado = true;
            console.log('✅ SVS App inicializado com sucesso (sem navbar)');

            // Tentar carregar navbar de forma assíncrona
            this.carregarNavbarAsync();

            this.emitirEvento('app:pronto');

        } catch (erro) {
            console.error('❌ Erro ao inicializar SVS App:', erro);
            this.esconderCarregamento();
            this.mostrarErro('Erro ao carregar a aplicação. Recarregue a página.');
        }
    }

    async carregarNavbarAsync() {
        try {
            console.log('📡 Carregando navbar assincronamente...');

            // Aguardar um pouco para não bloquear o carregamento inicial
            await new Promise(resolve => setTimeout(resolve, 100));

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 3000);

            const resposta = await fetch('/menu', {
                signal: controller.signal,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'text/html',
                    'Cache-Control': 'max-age=300'
                }
            });

            clearTimeout(timeout);

            if (!resposta.ok) {
                throw new Error(`HTTP ${resposta.status}`);
            }

            const htmlNavbar = await resposta.text();
            const containerNavbar = document.getElementById('navbar-container');

            if (!containerNavbar) {
                throw new Error('Container da navbar não encontrado');
            }

            // Inserir HTML
            containerNavbar.innerHTML = htmlNavbar;

            // Aguardar script da navbar estar disponível
            if (window.SVSNavbar) {
                this.navbar = new window.SVSNavbar();
                await this.navbar.init();
                this.navbarCarregada = true;
            } else {
                // Aguardar script ser carregado
                this.aguardarScriptNavbar();
            }

            console.log('✅ Navbar carregada assincronamente');

        } catch (erro) {
            console.error('❌ Erro ao carregar navbar:', erro);
            this.carregarNavbarFallback();
        }
    }

    aguardarScriptNavbar() {
        const maxTentativas = 20;
        let tentativas = 0;

        const verificar = () => {
            tentativas++;
            
            if (window.SVSNavbar) {
                this.navbar = new window.SVSNavbar();
                this.navbar.init().then(() => {
                    this.navbarCarregada = true;
                    console.log('✅ Navbar inicializada após script carregar');
                });
            } else if (tentativas < maxTentativas) {
                setTimeout(verificar, 250);
            } else {
                console.warn('⚠️ Timeout aguardando script da navbar');
                this.carregarNavbarFallback();
            }
        };

        verificar();
    }

    carregarNavbarFallback() {
        const containerNavbar = document.getElementById('navbar-container');
        if (containerNavbar && !containerNavbar.innerHTML.trim()) {
            containerNavbar.innerHTML = `
                <nav class="navbar-svs">
                    <div class="marca-navbar">
                        <span class="texto-marca">SVS</span>
                    </div>
                    <div class="acoes-navbar">
                        <span style="color: white; font-size: 0.875rem;">Carregando menu...</span>
                    </div>
                </nav>
            `;
        }
    }

    async inicializarRoteador() {
        try {
            if (window.svsApp) {
                this.roteador = window.svsApp;
                console.log('✅ Roteador inicializado');
            } else {
                console.log('⚠️ Roteador não encontrado - continuando sem SPA routing');
            }
        } catch (erro) {
            console.error('❌ Erro ao inicializar roteador:', erro);
        }
    }

    async inicializarCarregadorModulos() {
        try {
            if (window.ModuleLoader) {
                this.carregadorModulos = new window.ModuleLoader();
                console.log('✅ Carregador de módulos inicializado');
            } else {
                console.warn('⚠️ Classe ModuleLoader não encontrada');
            }
        } catch (erro) {
            console.error('❌ Erro ao inicializar carregador de módulos:', erro);
        }
    }

    configurarEventosGlobais() {
        // Navegação por módulos
        document.addEventListener('click', (e) => {
            const botaoModulo = e.target.closest('[data-module]');
            if (botaoModulo) {
                e.preventDefault();
                const nomeModulo = botaoModulo.dataset.module;
                this.carregarModulo(nomeModulo);
            }
        });

        // Ações do sistema
        document.addEventListener('click', (e) => {
            const botaoAcao = e.target.closest('[data-action]');
            if (botaoAcao) {
                e.preventDefault();
                const acao = botaoAcao.dataset.action;
                this.tratarAcao(acao, botaoAcao);
            }
        });

        console.log('✅ Eventos globais configurados');
    }

    async carregarModulo(nomeModulo) {
        if (!this.carregadorModulos) {
            console.warn('⚠️ Carregador de módulos não disponível');
            return;
        }

        try {
            this.mostrarCarregamento(`Carregando ${nomeModulo}...`);

            // Só tentar fechar menu se navbar estiver carregada
            if (this.navbarCarregada && this.navbar && typeof this.navbar.fecharMenu === 'function') {
                this.navbar.fecharMenu();
            }

            const modulo = await this.carregadorModulos.load(nomeModulo);
            this.moduloAtual = modulo;

            // Só definir módulo ativo se navbar estiver carregada
            if (this.navbarCarregada && this.navbar && typeof this.navbar.definirModuloAtivo === 'function') {
                this.navbar.definirModuloAtivo(nomeModulo);
            }

            this.esconderCarregamento();
            console.log(`✅ Módulo ${nomeModulo} carregado`);

        } catch (erro) {
            console.error(`❌ Erro ao carregar módulo ${nomeModulo}:`, erro);
            this.esconderCarregamento();
            this.mostrarErro(`Erro ao carregar o módulo ${nomeModulo}.`);
        }
    }

    async tratarAcao(acao, elemento) {
        switch (acao) {
            case 'logout':
                await this.sairSistema();
                break;
            case 'change-password':
                await this.mudarSenha();
                break;
            default:
                console.warn(`⚠️ Ação desconhecida: ${acao}`);
        }
    }

    async sairSistema() {
        if (confirm('Tem certeza que deseja sair do sistema?')) {
            console.log('🚪 Logout solicitado');
        }
    }

    async mudarSenha() {
        console.log('🔐 Mudança de senha solicitada');
    }

    tratarRotaInicial() {
        const caminho = window.location.pathname;

        if (caminho.includes('/ad')) {
            this.carregarModulo('ad');
        }
    }

    mostrarCarregamento(mensagem = 'Carregando...') {
        const estadoCarregamento = document.getElementById('loading-state');
        const textoCarregamento = estadoCarregamento?.querySelector('p');

        if (textoCarregamento) {
            textoCarregamento.textContent = mensagem;
        }

        if (estadoCarregamento) {
            estadoCarregamento.classList.remove('oculto');
        }
    }

    esconderCarregamento() {
        const estadoCarregamento = document.getElementById('loading-state');
        if (estadoCarregamento) {
            estadoCarregamento.classList.add('oculto');
        }
    }

    mostrarErro(mensagem) {
        console.error('❌', mensagem);

        if (this.config.debug) {
            // Em modo debug, mostrar alert
            alert(mensagem);
        }
    }

    emitirEvento(nomeEvento, dados = null) {
        const evento = new CustomEvent(nomeEvento, { detail: dados });
        window.dispatchEvent(evento);
    }

    // Método público para verificar se navbar está pronta
    isNavbarReady() {
        return this.navbarCarregada;
    }

    // Método para executar ação quando navbar estiver pronta
    whenNavbarReady(callback) {
        if (this.navbarCarregada) {
            callback();
        } else {
            const checkNavbar = () => {
                if (this.navbarCarregada) {
                    callback();
                } else {
                    setTimeout(checkNavbar, 100);
                }
            };
            checkNavbar();
        }
    }
}

// Instância global
window.SVSApp = new SVSApp();