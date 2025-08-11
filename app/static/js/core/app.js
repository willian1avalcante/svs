/**
 * SVS App - Controlador Principal da Aplicação
 */
class SVSApp {
    constructor() {
        this.moduloAtual = null;
        this.navbar = null;
        this.carregadorModulos = null;
        this.roteador = null;
        this.inicializado = false;
        this.config = window.SVS_CONFIG || {};

        console.log('🚀 SVS App inicializando...');
    }

    async init() {
        try {
            this.esconderCarregamento();

            await this.carregarNavbar();
            await this.inicializarRoteador();
            await this.inicializarCarregadorModulos();

            this.configurarEventosGlobais();
            this.tratarRotaInicial();

            this.inicializado = true;
            console.log('✅ SVS App inicializado com sucesso');

            this.emitirEvento('app:pronto');

        } catch (erro) {
            console.error('❌ Erro ao inicializar SVS App:', erro);
            this.esconderCarregamento();
            this.mostrarErro('Erro ao carregar a aplicação. Recarregue a página.');
        }
    }

    async carregarNavbar() {
        try {
            const resposta = await fetch('/menu');
            if (!resposta.ok) {
                throw new Error(`Erro ao carregar navbar: ${resposta.status}`);
            }

            const htmlNavbar = await resposta.text();

            const containerNavbar = document.getElementById('navbar-container');
            if (!containerNavbar) {
                throw new Error('Container da navbar não encontrado');
            }

            containerNavbar.innerHTML = htmlNavbar;

            await new Promise(resolve => setTimeout(resolve, 100));

            if (window.SVSNavbar) {
                this.navbar = new window.SVSNavbar();
                await this.navbar.init();
            } else {
                throw new Error('Classe SVSNavbar não encontrada');
            }

            console.log('✅ Navbar carregada');
        } catch (erro) {
            console.error('❌ Erro ao carregar navbar:', erro);
            throw erro;
        }
    }

    async inicializarRoteador() {
        try {
            if (window.svsApp) {
                this.roteador = window.svsApp;
                console.log('✅ Roteador inicializado');
            } else {
                console.log('⚠️ Roteador não encontrado');
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
                throw new Error('Classe ModuleLoader não encontrada');
            }
        } catch (erro) {
            console.error('❌ Erro ao inicializar carregador de módulos:', erro);
            throw erro;
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
            console.error('❌ Carregador de módulos não inicializado');
            return;
        }

        try {
            this.mostrarCarregamento(`Carregando ${nomeModulo}...`);

            if (this.navbar && this.navbar.menuAberto) {
                this.navbar.fecharMenu();
            }

            const modulo = await this.carregadorModulos.load(nomeModulo);
            this.moduloAtual = modulo;

            if (this.navbar) {
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
        const textoCarregamento = estadoCarregamento ? estadoCarregamento.querySelector('p') : null;

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
            alert(mensagem);
        }
    }

    emitirEvento(nomeEvento, dados = null) {
        const evento = new CustomEvent(nomeEvento, { detail: dados });
        window.dispatchEvent(evento);
    }
}

// Instância global
window.SVSApp = new SVSApp();