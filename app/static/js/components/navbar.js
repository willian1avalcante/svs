/**
 * SVS Navbar Component - Horizontal Dropdowns
 * Gerencia a navbar horizontal com dropdowns individuais por categoria
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
    
    // Busca por categoria
    this.inputsBusca = new Map();
    this.termoBuscaAtual = new Map();

    console.log("🧭 SVS Navbar Horizontal inicializando...");
  }

  async init() {
    try {
      this.encontrarElementos();
      this.configurarEventListeners();
      this.configurarDropdownsCategorias();
      this.configurarDropdownUsuario();
      this.configurarNavegacaoTeclado();
      this.configurarBuscaPorCategoria();

      console.log("✅ SVS Navbar Horizontal inicializada");
    } catch (erro) {
      console.error("❌ Erro ao inicializar navbar:", erro);
      throw erro;
    }
  }

  encontrarElementos() {
    // Encontrar todas as categorias de menu
    this.categoriasMenu = document.querySelectorAll('.categoria-menu');
    
    // Elementos do usuário
    this.dropdownUsuario = document.querySelector('.dropdown-usuario');
    this.botaoUsuario = document.querySelector('.botao-usuario');
    this.menuUsuario = document.querySelector('.menu-usuario');
    
    // Overlay
    this.overlay = document.querySelector('.overlay-categorias');

    if (this.categoriasMenu.length === 0) {
      throw new Error("Nenhuma categoria de menu encontrada");
    }

    console.log(`📋 Encontradas ${this.categoriasMenu.length} categorias de menu`);
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
    const inputBusca = categoria.querySelector('.input-busca-categoria');
    
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
    
    // Focar no input de busca se existir
    setTimeout(() => {
      if (inputBusca) {
        inputBusca.focus();
      }
    }, 100);
    
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
    
    // Limpar busca da categoria
    this.limparBuscaCategoria(categoria);
    
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
  // BUSCA POR CATEGORIA
  // =====================================================
  configurarBuscaPorCategoria() {
    this.categoriasMenu.forEach((categoria) => {
      const inputBusca = categoria.querySelector('.input-busca-categoria');
      const nomeCategoria = categoria.getAttribute('data-categoria');
      
      if (!inputBusca) return;
      
      // Armazenar referência do input
      this.inputsBusca.set(nomeCategoria, inputBusca);
      
      // Event listener para busca em tempo real
      inputBusca.addEventListener('input', (e) => {
        const termo = e.target.value.trim();
        this.executarBuscaCategoria(categoria, termo);
      });
      
      // Event listener para teclas especiais
      inputBusca.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.limparBuscaCategoria(categoria);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          const primeiroItem = categoria.querySelector('.item-categoria:not(.busca-oculto) .botao-item-categoria');
          if (primeiroItem) {
            primeiroItem.focus();
          }
        }
      });
      
      console.log(`🔍 Busca configurada para categoria: ${nomeCategoria}`);
    });
  }

  executarBuscaCategoria(categoria, termo) {
    const nomeCategoria = categoria.getAttribute('data-categoria');
    const itensCategoria = categoria.querySelectorAll('.item-categoria');
    
    // Armazenar termo atual
    this.termoBuscaAtual.set(nomeCategoria, termo.toLowerCase());
    
    if (termo.length < 2) {
      // Mostrar todos os itens
      itensCategoria.forEach((item) => {
        item.classList.remove('busca-oculto', 'busca-destaque');
        const botao = item.querySelector('.botao-item-categoria');
        if (botao) {
          this.removerDestaqueTermo(botao);
        }
      });
      return;
    }
    
    let itensEncontrados = 0;
    
    itensCategoria.forEach((item) => {
      const botao = item.querySelector('.botao-item-categoria');
      if (!botao) return;
      
      const textoItem = botao.textContent.trim().toLowerCase();
      const termosCustomizados = (item.getAttribute('data-busca') || '').toLowerCase();
      const termosBusca = `${textoItem} ${termosCustomizados}`;
      
      const corresponde = termosBusca.includes(termo.toLowerCase());
      
      if (corresponde) {
        // Mostrar e destacar
        item.classList.remove('busca-oculto');
        item.classList.add('busca-destaque');
        this.destacarTermoEncontrado(botao, termo);
        itensEncontrados++;
      } else {
        // Ocultar
        item.classList.add('busca-oculto');
        item.classList.remove('busca-destaque');
        this.removerDestaqueTermo(botao);
      }
    });
    
    console.log(`🔍 Busca em ${nomeCategoria}: "${termo}" - ${itensEncontrados} resultados`);
  }

  limparBuscaCategoria(categoria) {
    const nomeCategoria = categoria.getAttribute('data-categoria');
    const inputBusca = this.inputsBusca.get(nomeCategoria);
    
    if (inputBusca) {
      inputBusca.value = '';
    }
    
    // Limpar termo armazenado
    this.termoBuscaAtual.delete(nomeCategoria);
    
    // Mostrar todos os itens
    const itensCategoria = categoria.querySelectorAll('.item-categoria');
    itensCategoria.forEach((item) => {
      item.classList.remove('busca-oculto', 'busca-destaque');
      const botao = item.querySelector('.botao-item-categoria');
      if (botao) {
        this.removerDestaqueTermo(botao);
      }
    });
    
    console.log(`🧹 Busca limpa na categoria: ${nomeCategoria}`);
  }

  destacarTermoEncontrado(botaoElemento, termo) {
    if (!botaoElemento) return;
    
    const span = botaoElemento.querySelector('span');
    if (!span) return;

    const textoOriginal = span.getAttribute('data-texto-original') || span.textContent;
    span.setAttribute('data-texto-original', textoOriginal);

    const regex = new RegExp(`(${termo})`, 'gi');
    const textoDestacado = textoOriginal.replace(regex, '<mark class="termo-encontrado">$1</mark>');
    span.innerHTML = textoDestacado;
  }

  removerDestaqueTermo(botaoElemento) {
    if (!botaoElemento) return;
    
    const span = botaoElemento.querySelector('span');
    if (!span) return;

    const textoOriginal = span.getAttribute('data-texto-original');
    if (textoOriginal) {
      span.textContent = textoOriginal;
      span.removeAttribute('data-texto-original');
    }
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
    // Fechar categorias abertas
    this.fecharTodasCategorias();
    
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
      // Se clicou fora das categorias e do usuário
      if (!e.target.closest('.categoria-menu') && !e.target.closest('.dropdown-usuario')) {
        this.fecharTodasCategorias();
        this.fecharMenuUsuario();
      }
    });

    // Tecla ESC fecha tudo
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.fecharTodasCategorias();
        this.fecharMenuUsuario();
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
        if (indiceAtual === 0) {
          // Voltar para o input de busca
          const inputBusca = categoria.querySelector('.input-busca-categoria');
          if (inputBusca) {
            inputBusca.focus();
            return;
          }
        }
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
    }
  }
}

// Export para window global
window.SVSNavbar = SVSNavbar;

// Auto-inicialização quando DOM carrega
document.addEventListener('DOMContentLoaded', () => {
  if (!window.svsNavbar) {
    window.svsNavbar = new SVSNavbar();
    window.svsNavbar.init().catch(console.error);
  }
});