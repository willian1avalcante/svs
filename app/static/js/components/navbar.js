/* filepath: c:\Users\Dayane\Documents\svs\app\static\js\components\navbar.js */
/**
 * SVS Navbar Component - Com Dropdown de Resultados
 * Gerencia a navbar horizontal com dropdown de resultados da busca global
 */
class SVSNavbar {
  constructor() {
    this.categoriasMenu = [];
    this.categoriaAberta = null;
    this.dropdownUsuario = null;
    this.botaoUsuario = null;
    this.menuUsuario = null;
    this.menuUsuarioAberto = false;
    this.overlay = null;
    this.moduloAtivo = null;

    // Busca expansível
    this.containerBusca = null;
    this.botaoExpandirBusca = null;
    this.buscaExpandida = null;
    this.botaoRecolherBusca = null;
    this.buscaExpandidaAtiva = false;

    // Busca global com dropdown de resultados
    this.inputBuscaGlobal = null;
    this.botaoLimparBusca = null;
    this.dropdownResultados = null;
    this.listaResultados = null;
    this.contadorResultados = null;
    this.termoBuscaAtual = '';
    this.resultadosBusca = [];
    this.resultadoSelecionado = -1;
    this.dropdownAberto = false;

    console.log("🧭 SVS Navbar com Dropdown de Resultados inicializando...");
  }

  async init() {
    try {
      this.encontrarElementos();
      this.configurarEventListeners();
      this.configurarDropdownsCategorias();
      this.configurarDropdownUsuario();
      this.configurarBuscaGlobal();
      this.configurarNavegacaoTeclado();

      console.log("✅ SVS Navbar com Dropdown de Resultados inicializada");
    } catch (erro) {
      console.error("❌ Erro ao inicializar navbar:", erro);
      throw erro;
    }
  }

  encontrarElementos() {
    // Encontrar todas as categorias de menu
    this.categoriasMenu = document.querySelectorAll('.categoria-menu');

    // Elementos da busca global
    this.inputBuscaGlobal = document.getElementById('busca-global-input');
    this.botaoLimparBusca = document.getElementById('limpar-busca-global');
    this.dropdownResultados = document.getElementById('dropdown-resultados');
    this.listaResultados = document.getElementById('lista-resultados');
    this.contadorResultados = document.getElementById('contador-resultados');

    // Elementos da busca expansível
    this.containerBusca = document.getElementById('container-busca');
    this.botaoExpandirBusca = document.getElementById('botao-expandir-busca');
    this.buscaExpandida = document.getElementById('busca-expandida');
    this.botaoRecolherBusca = document.getElementById('botao-recolher-busca');

    // Elementos do usuário
    this.dropdownUsuario = document.querySelector('.dropdown-usuario');
    this.botaoUsuario = document.querySelector('.botao-usuario');
    this.menuUsuario = document.querySelector('.menu-usuario');

    // Overlay
    this.overlay = document.querySelector('.overlay-categorias');

    if (this.categoriasMenu.length === 0) {
      throw new Error("Nenhuma categoria de menu encontrada");
    }

    if (!this.inputBuscaGlobal) {
      throw new Error("Input de busca global não encontrado");
    }

    if (!this.dropdownResultados) {
      throw new Error("Dropdown de resultados não encontrado");
    }

    if (!this.containerBusca || !this.botaoExpandirBusca) {
      throw new Error("Elementos de busca expansível não encontrados");
    }

    console.log("🔍 Busca expansível encontrada");
    console.log(`📋 Encontradas ${this.categoriasMenu.length} categorias de menu`);
    console.log("🔍 Busca global e dropdown encontrados");
  }

  // =====================================================
  // BUSCA GLOBAL COM DROPDOWN DE RESULTADOS
  // =====================================================
  configurarBuscaGlobal() {
    // Configurar expansão da busca
    this.configurarExpansaoBusca();

    // Event listener para input em tempo real
    this.inputBuscaGlobal.addEventListener('input', (e) => {
      const termo = e.target.value.trim();
      this.executarBuscaGlobal(termo);
    });

    // Event listener para teclas especiais
    this.inputBuscaGlobal.addEventListener('keydown', (e) => {
      this.gerenciarTeclasBusca(e);
    });

    // Focus e blur para controlar dropdown
    this.inputBuscaGlobal.addEventListener('focus', () => {
      if (this.resultadosBusca.length > 0) {
        this.mostrarDropdownResultados();
      }
    });

    // Botão limpar busca
    if (this.botaoLimparBusca) {
      this.botaoLimparBusca.addEventListener('click', () => {
        this.limparBuscaGlobal();
      });
    }

    console.log("🔍 Busca global com expansão configurada");
  }

  configurarExpansaoBusca() {
    // Clique no botão expandir
    this.botaoExpandirBusca.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.expandirBusca();
    });

    // Clique no botão recolher
    if (this.botaoRecolherBusca) {
      this.botaoRecolherBusca.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.recolherBusca();
      });
    }

    // Teclas para recolher busca
    this.inputBuscaGlobal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.inputBuscaGlobal.value === '') {
        this.recolherBusca();
      }
    });

    // Blur - recolher se não houver conteúdo e não há dropdown aberto
    this.inputBuscaGlobal.addEventListener('blur', (e) => {
      // Delay para permitir cliques em botões
      setTimeout(() => {
        if (!this.inputBuscaGlobal.value &&
          !this.dropdownAberto &&
          !document.activeElement.closest('.busca-global')) {
          this.recolherBusca();
        }
      }, 150);
    });

    console.log("🔧 Expansão da busca configurada");
  }

  expandirBusca() {
    if (this.buscaExpandidaAtiva) return;

    console.log("📈 Expandindo busca para esquerda");

    // Fechar outros dropdowns
    this.fecharTodasCategorias();
    this.fecharMenuUsuario();

    // Marcar como expandida
    this.containerBusca.classList.add('expandido');
    this.buscaExpandida.classList.add('ativa');
    this.buscaExpandidaAtiva = true;

    // Verificar se há espaço suficiente à esquerda
    this.verificarEspacoEsquerda();

    // Focar no input após a animação de expansão
    setTimeout(() => {
      this.inputBuscaGlobal.focus();
      this.buscaExpandida.classList.remove('animando');
    }, 250);

    // Adicionar efeito de destaque
    this.adicionarDestaqueLupa();
  }

  verificarEspacoEsquerda() {
    if (window.innerWidth <= 768) return; // Skip no mobile

    const busca = this.buscaExpandida;
    const rect = busca.getBoundingClientRect();
    const larguraExpandida = 400; // Largura quando expandida

    // Se expandir à esquerda vai sair da tela
    if (rect.right - larguraExpandida < 20) {
      console.log("⚠️ Pouco espaço à esquerda, ajustando largura");
      const larguraMaxima = Math.max(250, rect.right - 40);
      busca.style.setProperty('--largura-maxima', `${larguraMaxima}px`);
    } else {
      busca.style.removeProperty('--largura-maxima');
    }
  }

  recolherBusca() {
    if (!this.buscaExpandidaAtiva) return;

    console.log("📉 Recolhendo busca");

    // Limpar busca primeiro
    this.limparBuscaGlobal();

    // Animar recolhimento
    this.buscaExpandida.classList.remove('ativa');

    setTimeout(() => {
      this.containerBusca.classList.remove('expandido');
      this.buscaExpandidaAtiva = false;
    }, 250); // Tempo ajustado

    // Remover destaque
    this.removerDestaqueLupa();
  }

  adicionarDestaqueLupa() {
    // Adicionar destaque sutil no botão quando há busca ativa
    if (this.inputBuscaGlobal.value) {
      this.botaoExpandirBusca.classList.add('destaque');
    }
  }

  removerDestaqueLupa() {
    this.botaoExpandirBusca.classList.remove('destaque');
  }

  gerenciarTeclasBusca(e) {
    switch (e.key) {
      case 'Escape':
        if (this.inputBuscaGlobal.value === '') {
          this.recolherBusca();
        } else {
          this.limparBuscaGlobal();
        }
        break;

      case 'Enter':
        e.preventDefault();
        this.executarResultadoSelecionado();
        break;

      case 'ArrowDown':
        e.preventDefault();
        this.navegarResultados(1);
        break;

      case 'ArrowUp':
        e.preventDefault();
        this.navegarResultados(-1);
        break;

      case 'Home':
        e.preventDefault();
        this.selecionarPrimeiroResultado();
        break;

      case 'End':
        e.preventDefault();
        this.selecionarUltimoResultado();
        break;
    }
  }

  executarBuscaGlobal(termo) {
    this.termoBuscaAtual = termo.toLowerCase();

    // Mostrar/esconder botão limpar
    if (this.botaoLimparBusca) {
      if (termo.length > 0) {
        this.botaoLimparBusca.classList.add('visivel');
      } else {
        this.botaoLimparBusca.classList.remove('visivel');
      }
    }

    if (termo.length < 2) {
      this.esconderDropdownResultados();
      this.resultadosBusca = [];
      return;
    }

    console.log(`🔍 Buscando globalmente: "${termo}"`);

    this.resultadosBusca = [];
    this.resultadoSelecionado = -1;

    // Buscar em todas as categorias
    this.categoriasMenu.forEach((categoria) => {
      const nomeCategoria = categoria.getAttribute('data-categoria');
      const nomeCategoriaFormatado = this.formatarNomeCategoria(nomeCategoria);
      const itensCategoria = categoria.querySelectorAll('.item-categoria');

      itensCategoria.forEach((item) => {
        const botao = item.querySelector('.botao-item-categoria');
        if (!botao) return;

        const textoItem = botao.textContent.trim();
        const textoItemLower = textoItem.toLowerCase();
        const termosCustomizados = (item.getAttribute('data-busca') || '').toLowerCase();
        const termosBusca = `${textoItemLower} ${termosCustomizados}`;

        if (termosBusca.includes(this.termoBuscaAtual)) {
          // Obter ícone
          const icone = botao.querySelector('i');
          const classeIcone = icone ? icone.className : 'fas fa-cube';

          // Obter dados de navegação
          const dataModule = botao.getAttribute('data-module');
          const dataTarget = botao.getAttribute('data-target');
          const dataAction = botao.getAttribute('data-action');

          this.resultadosBusca.push({
            nome: textoItem,
            categoria: nomeCategoriaFormatado,
            icone: classeIcone,
            elemento: botao,
            dataModule: dataModule,
            dataTarget: dataTarget,
            dataAction: dataAction
          });
        }
      });
    });

    // Ordenar resultados por relevância (começa com o termo primeiro)
    this.resultadosBusca.sort((a, b) => {
      const aComeca = a.nome.toLowerCase().startsWith(this.termoBuscaAtual);
      const bComeca = b.nome.toLowerCase().startsWith(this.termoBuscaAtual);

      if (aComeca && !bComeca) return -1;
      if (!aComeca && bComeca) return 1;

      return a.nome.localeCompare(b.nome);
    });

    this.renderizarResultados();
    this.mostrarDropdownResultados();

    console.log(`✅ Busca concluída: ${this.resultadosBusca.length} resultados`);
  }

  formatarNomeCategoria(categoria) {
    const mapaCategorias = {
      'cadastro': 'Cadastro',
      'consultas': 'Consultas',
      'precos': 'Listas de Preços',
      'selecoes': 'Seleções'
    };

    return mapaCategorias[categoria] || categoria;
  }

  renderizarResultados() {
    if (!this.listaResultados) return;

    // Limpar lista
    this.listaResultados.innerHTML = '';

    if (this.resultadosBusca.length === 0) {
      this.listaResultados.classList.add('vazia');
      this.atualizarContadorResultados(0);
      return;
    }

    this.listaResultados.classList.remove('vazia');

    // Renderizar cada resultado
    this.resultadosBusca.forEach((resultado, index) => {
      const itemElement = this.criarElementoResultado(resultado, index);
      this.listaResultados.appendChild(itemElement);
    });

    this.atualizarContadorResultados(this.resultadosBusca.length);
  }

  criarElementoResultado(resultado, index) {
    const item = document.createElement('div');
    item.className = 'item-resultado';
    item.setAttribute('role', 'option');
    item.setAttribute('data-index', index);

    // Destacar termo encontrado no nome
    const nomeDestacado = this.destacarTermoNoTexto(resultado.nome, this.termoBuscaAtual);

    item.innerHTML = `
      <div class="icone-resultado">
        <i class="${resultado.icone}"></i>
      </div>
      <div class="conteudo-resultado">
        <div class="nome-resultado">${nomeDestacado}</div>
        <div class="categoria-resultado">${resultado.categoria}</div>
      </div>
    `;

    // Event listeners para o item
    item.addEventListener('click', () => {
      this.executarResultado(resultado);
    });

    item.addEventListener('mouseenter', () => {
      this.selecionarResultado(index);
    });

    return item;
  }

  destacarTermoNoTexto(texto, termo) {
    if (!termo) return texto;

    const regex = new RegExp(`(${termo})`, 'gi');
    return texto.replace(regex, '<span class="resultado-termo-encontrado">$1</span>');
  }

  mostrarDropdownResultados() {
    if (!this.dropdownResultados) return;

    this.dropdownResultados.classList.add('visivel');
    this.inputBuscaGlobal.setAttribute('aria-expanded', 'true');
    this.dropdownAberto = true;

    console.log("📋 Dropdown de resultados mostrado");
  }

  esconderDropdownResultados() {
    if (!this.dropdownResultados) return;

    this.dropdownResultados.classList.remove('visivel');
    this.inputBuscaGlobal.setAttribute('aria-expanded', 'false');
    this.dropdownAberto = false;
    this.resultadoSelecionado = -1;

    console.log("📋 Dropdown de resultados escondido");
  }

  atualizarContadorResultados(total) {
    if (!this.contadorResultados) return;

    if (total === 0 && this.termoBuscaAtual.length >= 2) {
      this.contadorResultados.textContent = 'Nenhum resultado encontrado';
    } else if (total > 0) {
      const textoResultado = total === 1 ? 'resultado' : 'resultados';
      this.contadorResultados.textContent = `${total} ${textoResultado} encontrado${total > 1 ? 's' : ''}`;
    } else {
      this.contadorResultados.textContent = '';
    }
  }

  // =====================================================
  // NAVEGAÇÃO NOS RESULTADOS
  // =====================================================
  navegarResultados(direcao) {
    if (this.resultadosBusca.length === 0) return;

    const novoIndice = this.resultadoSelecionado + direcao;

    if (novoIndice >= 0 && novoIndice < this.resultadosBusca.length) {
      this.selecionarResultado(novoIndice);
    } else if (direcao > 0 && this.resultadoSelecionado === this.resultadosBusca.length - 1) {
      // Voltar para o primeiro
      this.selecionarResultado(0);
    } else if (direcao < 0 && this.resultadoSelecionado <= 0) {
      // Ir para o último
      this.selecionarResultado(this.resultadosBusca.length - 1);
    }
  }

  selecionarResultado(index) {
    // Remover seleção anterior
    const itemAnterior = this.listaResultados.querySelector('.item-resultado.destacado');
    if (itemAnterior) {
      itemAnterior.classList.remove('destacado');
    }

    this.resultadoSelecionado = index;

    // Adicionar nova seleção
    const novoItem = this.listaResultados.querySelector(`[data-index="${index}"]`);
    if (novoItem) {
      novoItem.classList.add('destacado');

      // Scroll para o item visível
      novoItem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }

  selecionarPrimeiroResultado() {
    if (this.resultadosBusca.length > 0) {
      this.selecionarResultado(0);
    }
  }

  selecionarUltimoResultado() {
    if (this.resultadosBusca.length > 0) {
      this.selecionarResultado(this.resultadosBusca.length - 1);
    }
  }

  executarResultadoSelecionado() {
    if (this.resultadoSelecionado >= 0 && this.resultadosBusca[this.resultadoSelecionado]) {
      const resultado = this.resultadosBusca[this.resultadoSelecionado];
      this.executarResultado(resultado);
    }
  }

  executarResultado(resultado) {
    console.log(`⚡ Executando resultado: ${resultado.nome} (${resultado.categoria})`);

    // Marcar como ativo
    this.definirModuloAtivo(resultado.elemento);

    // Executar ação
    if (resultado.dataModule) {
      this.navegarParaModulo(resultado.dataModule);
    } else if (resultado.dataAction === 'navigate' && resultado.dataTarget) {
      this.navegarParaTarget(resultado.dataTarget);
    }

    // Recolher busca após execução
    setTimeout(() => {
      this.recolherBusca();
    }, 100);
  }

  limparBuscaGlobal() {
    this.inputBuscaGlobal.value = '';
    this.termoBuscaAtual = '';
    this.resultadosBusca = [];
    this.resultadoSelecionado = -1;

    if (this.botaoLimparBusca) {
      this.botaoLimparBusca.classList.remove('visivel');
    }

    this.esconderDropdownResultados();
    this.inputBuscaGlobal.focus();

    console.log("🧹 Busca global limpa");
  }

  // =====================================================
  // CONFIGURAR DROPDOWNS DAS CATEGORIAS
  // =====================================================
  configurarDropdownsCategorias() {
    this.categoriasMenu.forEach((categoria, index) => {
      const botaoCategoria = categoria.querySelector('.botao-categoria');
      const dropdownCategoria = categoria.querySelector('.dropdown-categoria');
      const nomeCategoria = categoria.getAttribute('data-categoria');

      if (!botaoCategoria || !dropdownCategoria) {
        console.warn(`⚠️ Categoria ${nomeCategoria} incompleta`);
        return;
      }

      // Event listener para o botão da categoria
      botaoCategoria.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.alternarCategoria(categoria);
      });

      // Event listener para teclas
      botaoCategoria.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.alternarCategoria(categoria);
        } else if (e.key === 'Escape') {
          this.fecharTodasCategorias();
        }
      });

      // Configurar cliques nos itens
      this.configurarItensCategoria(categoria);

      console.log(`🔧 Categoria ${nomeCategoria} configurada`);
    });
  }

  configurarItensCategoria(categoria) {
    const itensCategoria = categoria.querySelectorAll('.botao-item-categoria');

    itensCategoria.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const dataModule = item.getAttribute('data-module');
        const dataAction = item.getAttribute('data-action');
        const dataTarget = item.getAttribute('data-target');

        // Marcar como ativo
        this.definirModuloAtivo(item);

        // Executar ação
        if (dataModule) {
          this.navegarParaModulo(dataModule);
        } else if (dataAction === 'navigate' && dataTarget) {
          this.navegarParaTarget(dataTarget);
        }

        // Fechar dropdown após seleção
        this.fecharTodasCategorias();
      });

      // Navegação por teclado nos itens
      item.addEventListener('keydown', (e) => {
        this.gerenciarNavegacaoItens(e, categoria);
      });
    });
  }

  // =====================================================
  // CONTROLE DE ABERTURA/FECHAMENTO
  // =====================================================
  alternarCategoria(categoria) {
    const estaAberta = categoria.classList.contains('aberta');

    if (estaAberta) {
      this.fecharCategoria(categoria);
    } else {
      // Fechar outras categorias primeiro
      this.fecharTodasCategorias();
      this.abrirCategoria(categoria);
    }
  }

  abrirCategoria(categoria) {
    const nomeCategoria = categoria.getAttribute('data-categoria');
    const botaoCategoria = categoria.querySelector('.botao-categoria');

    console.log(`📂 Abrindo categoria: ${nomeCategoria}`);

    // Marcar como aberta
    categoria.classList.add('aberta');
    botaoCategoria.setAttribute('aria-expanded', 'true');

    // Mostrar overlay
    if (this.overlay) {
      this.overlay.classList.add('mostrar');
    }

    // Guardar referência da categoria aberta
    this.categoriaAberta = categoria;

    console.log(`✅ Categoria ${nomeCategoria} aberta`);
  }

  fecharCategoria(categoria) {
    if (!categoria) return;

    const nomeCategoria = categoria.getAttribute('data-categoria');
    const botaoCategoria = categoria.querySelector('.botao-categoria');

    console.log(`📁 Fechando categoria: ${nomeCategoria}`);

    // Marcar como fechada
    categoria.classList.remove('aberta');
    botaoCategoria.setAttribute('aria-expanded', 'false');

    // Se for a categoria atualmente aberta, limpar referência
    if (this.categoriaAberta === categoria) {
      this.categoriaAberta = null;

      // Esconder overlay se não há mais categorias abertas
      if (this.overlay) {
        this.overlay.classList.remove('mostrar');
      }
    }

    console.log(`✅ Categoria ${nomeCategoria} fechada`);
  }

  fecharTodasCategorias() {
    this.categoriasMenu.forEach((categoria) => {
      this.fecharCategoria(categoria);
    });

    // Garantir que overlay seja escondido
    if (this.overlay) {
      this.overlay.classList.remove('mostrar');
    }

    this.categoriaAberta = null;
    console.log("📁 Todas as categorias fechadas");
  }

  // =====================================================
  // DROPDOWN DO USUÁRIO
  // =====================================================
  configurarDropdownUsuario() {
    if (!this.botaoUsuario) return;

    this.botaoUsuario.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.alternarMenuUsuario();
    });

    this.botaoUsuario.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.alternarMenuUsuario();
      }
    });

    // Configurar itens do menu do usuário
    const botoesMenuUsuario = document.querySelectorAll('.botao-menu-usuario');
    botoesMenuUsuario.forEach((botao) => {
      botao.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const action = botao.getAttribute('data-action');
        if (action === 'logout') {
          this.sairSistema();
        } else if (action === 'change-password') {
          this.alterarSenha();
        }

        this.fecharMenuUsuario();
      });
    });

    console.log("👤 Dropdown do usuário configurado");
  }

  alternarMenuUsuario() {
    if (this.menuUsuarioAberto) {
      this.fecharMenuUsuario();
    } else {
      this.abrirMenuUsuario();
    }
  }

  abrirMenuUsuario() {
    // Fechar categorias abertas e dropdown de busca
    this.fecharTodasCategorias();
    this.esconderDropdownResultados();

    this.menuUsuarioAberto = true;
    this.botaoUsuario.classList.add('ativo');
    this.dropdownUsuario.classList.add('mostrar');
    this.botaoUsuario.setAttribute('aria-expanded', 'true');

    setTimeout(() => {
      const primeiroBotao = this.menuUsuario.querySelector('.botao-menu-usuario');
      if (primeiroBotao) {
        primeiroBotao.focus();
      }
    }, 100);

    console.log("👤 Menu do usuário aberto");
  }

  fecharMenuUsuario() {
    this.menuUsuarioAberto = false;
    this.botaoUsuario.classList.remove('ativo');
    this.dropdownUsuario.classList.remove('mostrar');
    this.botaoUsuario.setAttribute('aria-expanded', 'false');

    console.log("👤 Menu do usuário fechado");
  }

  // =====================================================
  // EVENT LISTENERS GLOBAIS
  // =====================================================
  configurarEventListeners() {
    // Clique no overlay fecha tudo
    if (this.overlay) {
      this.overlay.addEventListener('click', () => {
        this.fecharTodasCategorias();
        this.fecharMenuUsuario();
      });
    }

    // Clique fora fecha dropdowns
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.categoria-menu') &&
        !e.target.closest('.dropdown-usuario') &&
        !e.target.closest('.busca-global')) {
        this.fecharTodasCategorias();
        this.fecharMenuUsuario();
        this.esconderDropdownResultados();

        // Recolher busca se não há conteúdo
        if (this.buscaExpandidaAtiva && !this.inputBuscaGlobal.value) {
          this.recolherBusca();
        }
      }
    });

    // Tecla ESC fecha tudo
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.fecharTodasCategorias();
        this.fecharMenuUsuario();
        this.esconderDropdownResultados();

        // Se busca expandida mas vazia, recolher
        if (this.buscaExpandidaAtiva && !this.inputBuscaGlobal.value) {
          this.recolherBusca();
        }
      }
    });

    // Responsividade
    window.addEventListener('resize', () => {
      this.tratarRedimensionamento();
    });

    console.log("🎧 Event listeners globais configurados");
  }

  // =====================================================
  // NAVEGAÇÃO POR TECLADO
  // =====================================================
  configurarNavegacaoTeclado() {
    // Navegação entre categorias com setas
    this.categoriasMenu.forEach((categoria, index) => {
      const botaoCategoria = categoria.querySelector('.botao-categoria');

      botaoCategoria.addEventListener('keydown', (e) => {
        let proximoIndex = -1;

        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            proximoIndex = index > 0 ? index - 1 : this.categoriasMenu.length - 1;
            break;

          case 'ArrowRight':
            e.preventDefault();
            proximoIndex = index < this.categoriasMenu.length - 1 ? index + 1 : 0;
            break;

          case 'Home':
            e.preventDefault();
            proximoIndex = 0;
            break;

          case 'End':
            e.preventDefault();
            proximoIndex = this.categoriasMenu.length - 1;
            break;
        }

        if (proximoIndex >= 0) {
          const proximoBotao = this.categoriasMenu[proximoIndex].querySelector('.botao-categoria');
          if (proximoBotao) {
            proximoBotao.focus();
          }
        }
      });
    });

    console.log("⌨️ Navegação por teclado configurada");
  }

  gerenciarNavegacaoItens(e, categoria) {
    const itensVisiveis = categoria.querySelectorAll('.item-categoria:not(.busca-oculto) .botao-item-categoria');
    const itemAtual = e.target;
    const indiceAtual = Array.from(itensVisiveis).indexOf(itemAtual);

    let proximoItem = null;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        proximoItem = itensVisiveis[indiceAtual + 1] || itensVisiveis[0];
        break;

      case 'ArrowUp':
        e.preventDefault();
        proximoItem = itensVisiveis[indiceAtual - 1] || itensVisiveis[itensVisiveis.length - 1];
        break;

      case 'Home':
        e.preventDefault();
        proximoItem = itensVisiveis[0];
        break;

      case 'End':
        e.preventDefault();
        proximoItem = itensVisiveis[itensVisiveis.length - 1];
        break;
    }

    if (proximoItem) {
      proximoItem.focus();
    }
  }

  // =====================================================
  // NAVEGAÇÃO E AÇÕES
  // =====================================================
  navegarParaModulo(modulo) {
    console.log(`🚀 Navegando para módulo: ${modulo}`);

    // Usar o sistema de rotas do SPA
    if (window.SVSRouter) {
      window.SVSRouter.navigateTo(`/${modulo}`);
    } else {
      // Fallback para sistema legado
      this.submeterFormularioLegado(modulo);
    }
  }

  navegarParaTarget(target) {
    console.log(`🎯 Navegando para target: ${target}`);

    // Submeter formulário legado
    this.submeterFormularioLegado(target);
  }

  submeterFormularioLegado(escolha) {
    const form = document.getElementById('legacy-form');
    const inputEscolha = document.getElementById('legacy-escolha');

    if (form && inputEscolha) {
      inputEscolha.value = escolha;
      form.submit();
    }
  }

  definirModuloAtivo(botaoItem) {
    // Remover ativo de todos
    document.querySelectorAll('.botao-item-categoria.ativo').forEach((btn) => {
      btn.classList.remove('ativo');
    });

    // Adicionar ativo ao clicado
    botaoItem.classList.add('ativo');

    const modulo = botaoItem.getAttribute('data-module') ||
      botaoItem.getAttribute('data-target') ||
      botaoItem.textContent.trim();

    this.moduloAtivo = modulo;
    console.log(`✅ Módulo ativo: ${modulo}`);
  }

  sairSistema() {
    console.log("🚪 Saindo do sistema...");

    const form = document.getElementById('legacy-form');
    const inputSair = document.getElementById('legacy-sair');

    if (form && inputSair) {
      inputSair.value = 'true';
      form.submit();
    }
  }

  alterarSenha() {
    console.log("🔑 Alterando senha...");

    const form = document.getElementById('legacy-form');
    const inputSenha = document.getElementById('legacy-senha');

    if (form && inputSenha) {
      inputSenha.value = 'true';
      form.submit();
    }
  }

  // =====================================================
  // RESPONSIVIDADE
  // =====================================================
  tratarRedimensionamento() {
    if (window.innerWidth < 768) {
      // Em telas pequenas, fechar dropdowns abertos
      this.fecharTodasCategorias();
      this.fecharMenuUsuario();
      this.esconderDropdownResultados();

      // Não recolher busca no mobile se há conteúdo
      if (this.buscaExpandidaAtiva && !this.inputBuscaGlobal.value) {
        this.recolherBusca();
      }
    }
  }
}

// =====================================================
// EXPORTAÇÃO E INICIALIZAÇÃO
// =====================================================

// Export para window global
window.SVSNavbar = SVSNavbar;

// Auto-inicialização quando DOM carrega
document.addEventListener('DOMContentLoaded', () => {
  if (!window.svsNavbar) {
    window.svsNavbar = new SVSNavbar();
    window.svsNavbar.init().catch(console.error);
  }
});