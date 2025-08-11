/**
 * SVS Navbar Component
 * Gerencia a navbar e menu dropdown
 */
class SVSNavbar {
  constructor() {
    this.botaoMenu = null;
    this.dropdownMenu = null;
    this.overlayMenu = null;
    this.dropdownUsuario = null;
    this.botaoUsuario = null;
    this.menuUsuario = null;
    this.menuAberto = false;
    this.menuUsuarioAberto = false;
    this.moduloAtivo = null;
    
    // Cache do conteúdo original dos menus
    this.conteudosOriginais = new Map();

    // =====================================================
    // BUSCA RÁPIDA - NOVA FUNCIONALIDADE
    // =====================================================
    this.inputBusca = null;
    this.botaoLimparBusca = null;
    this.contadorResultados = null;
    this.termoBuscaAtual = '';
    this.todosItensMenu = [];

    console.log("🧭 SVS Navbar inicializando...");
  }

  async init() {
    try {
      this.encontrarElementos();
      this.armazenarConteudosOriginais();
      this.configurarEventListeners();
      this.inicializarAcordeon();
      this.configurarNavegacaoTeclado();
      this.inicializarBuscaRapida();
      this.expandirSecaoPadrao();

      console.log("✅ SVS Navbar inicializada");
    } catch (erro) {
      console.error("❌ Erro ao inicializar navbar:", erro);
      throw erro;
    }
  }

  encontrarElementos() {
    this.botaoMenu = document.querySelector(".botao-menu");
    this.dropdownMenu = document.querySelector(".dropdown-menu");
    this.overlayMenu = document.querySelector(".overlay-menu");
    this.dropdownUsuario = document.querySelector(".dropdown-usuario");
    this.botaoUsuario = document.querySelector(".botao-usuario");
    this.menuUsuario = document.querySelector(".menu-usuario");

    // =====================================================
    // ELEMENTOS DA BUSCA RÁPIDA
    // =====================================================
    this.inputBusca = document.querySelector("#busca-rapida-input");
    this.botaoLimparBusca = document.querySelector("#limpar-busca");
    this.contadorResultados = document.querySelector("#contador-resultados");

    if (!this.botaoMenu || !this.dropdownMenu) {
      throw new Error("Elementos essenciais da navbar não encontrados");
    }
  }

  // =====================================================
  // ARMAZENAR CONTEÚDO ORIGINAL - CACHE INTELIGENTE
  // =====================================================
  armazenarConteudosOriginais() {
    const secoesMenu = document.querySelectorAll(".secao-menu");
    
    secoesMenu.forEach((secao) => {
      const cabecalho = secao.querySelector(".cabecalho-secao-menu");
      const conteudo = secao.querySelector(".conteudo-menu");
      
      if (cabecalho && conteudo) {
        const nomeSecao = this.getNomeSecao(secao);
        
        // Armazena o HTML original do conteúdo
        this.conteudosOriginais.set(nomeSecao, {
          html: conteudo.outerHTML,
          elemento: conteudo.cloneNode(true)
        });
        
        console.log(`💾 Conteúdo da seção ${nomeSecao} armazenado no cache`);
      }
    });

    // =====================================================
    // INDEXAR TODOS OS ITENS PARA BUSCA - DO CACHE ORIGINAL
    // =====================================================
    this.indexarItensParaBuscaDoCache();
  }

  configurarEventListeners() {
    this.botaoMenu.addEventListener("click", (e) => {
      e.stopPropagation();
      this.alternarMenu();
    });

    if (this.botaoUsuario) {
      this.botaoUsuario.addEventListener("click", (e) => {
        e.stopPropagation();
        this.alternarMenuUsuario();
      });
    }

    if (this.overlayMenu) {
      this.overlayMenu.addEventListener("click", () => {
        this.fecharMenu();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.menuUsuarioAberto) {
          this.fecharMenuUsuario();
        } else if (this.menuAberto) {
          this.fecharMenu();
        }
      }
    });

    document.addEventListener("click", (e) => {
      if (
        this.menuUsuarioAberto &&
        this.dropdownUsuario &&
        !this.dropdownUsuario.contains(e.target)
      ) {
        this.fecharMenuUsuario();
      }

      if (
        this.menuAberto &&
        !this.dropdownMenu.contains(e.target) &&
        !this.botaoMenu.contains(e.target)
      ) {
        this.fecharMenu();
      }
    });

    window.addEventListener("resize", () => {
      this.tratarRedimensionamento();
    });
  }

  alternarMenu() {
    if (this.menuAberto) {
      this.fecharMenu();
    } else {
      this.abrirMenu();
    }
  }

  abrirMenu() {
    if (this.menuUsuarioAberto) {
      this.fecharMenuUsuario();
    }

    this.menuAberto = true;
    this.botaoMenu.classList.add('ativo');
    this.dropdownMenu.classList.add('mostrar');

    if (this.overlayMenu) {
      this.overlayMenu.classList.add('mostrar');
    }

    this.botaoMenu.setAttribute('aria-expanded', 'true');

    // Focar na busca quando abrir o menu
    setTimeout(() => {
      if (this.inputBusca) {
        this.inputBusca.focus();
      } else {
        const primeiroBotao = this.dropdownMenu.querySelector('.botao-item-menu');
        if (primeiroBotao) {
          primeiroBotao.focus();
        }
      }
    }, 100);

    console.log('📖 Menu principal aberto');
  }

  fecharMenu() {
    this.menuAberto = false;
    this.botaoMenu.classList.remove("ativo");
    this.dropdownMenu.classList.remove("mostrar");
    if (this.overlayMenu) {
      this.overlayMenu.classList.remove("mostrar");
    }

    this.botaoMenu.setAttribute("aria-expanded", "false");
    this.botaoMenu.focus();

    // Limpar busca quando fechar menu
    this.limparBusca();

    console.log("📕 Menu principal fechado");
  }

  alternarMenuUsuario() {
    if (this.menuUsuarioAberto) {
      this.fecharMenuUsuario();
    } else {
      this.abrirMenuUsuario();
    }
  }

  abrirMenuUsuario() {
    if (this.menuAberto) {
      this.fecharMenu();
    }

    this.menuUsuarioAberto = true;
    this.botaoUsuario.classList.add("ativo");
    this.dropdownUsuario.classList.add("mostrar");

    this.botaoUsuario.setAttribute("aria-expanded", "true");

    setTimeout(() => {
      const primeiroBotao = this.menuUsuario.querySelector(
        ".botao-menu-usuario"
      );
      if (primeiroBotao) {
        primeiroBotao.focus();
      }
    }, 100);

    console.log("👤 Menu do usuário aberto");
  }

  fecharMenuUsuario() {
    this.menuUsuarioAberto = false;
    this.botaoUsuario.classList.remove("ativo");
    this.dropdownUsuario.classList.remove("mostrar");

    this.botaoUsuario.setAttribute("aria-expanded", "false");
    this.botaoUsuario.focus();

    console.log("👤 Menu do usuário fechado");
  }

  // =====================================================
  // BUSCA RÁPIDA - FUNCIONALIDADE PRINCIPAL
  // =====================================================
  inicializarBuscaRapida() {
    if (!this.inputBusca) {
      console.log("⚠️ Input de busca não encontrado");
      return;
    }

    // Event listener para input em tempo real
    this.inputBusca.addEventListener('input', (e) => {
      const termo = e.target.value.trim();
      this.executarBusca(termo);
    });

    // Event listener para limpar busca
    if (this.botaoLimparBusca) {
      this.botaoLimparBusca.addEventListener('click', () => {
        this.limparBusca();
      });
    }

    // Keyboard shortcuts
    this.inputBusca.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.limparBusca();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const primeiroItemVisivel = document.querySelector('.item-menu:not(.busca-oculto) .botao-item-menu');
        if (primeiroItemVisivel) {
          primeiroItemVisivel.focus();
        }
      }
    });

    console.log("🔍 Busca rápida inicializada");
  }

  // =====================================================
  // INDEXAÇÃO INTELIGENTE - DO CACHE ORIGINAL
  // =====================================================
  indexarItensParaBuscaDoCache() {
    this.todosItensMenu = [];
    
    // ← MUDANÇA PRINCIPAL: Buscar nos elementos do CACHE, não do DOM
    this.conteudosOriginais.forEach((dadosCache, nomeSecao) => {
      const elementoCache = dadosCache.elemento;
      const itensMenu = elementoCache.querySelectorAll('.item-menu');
      
      itensMenu.forEach((item) => {
        const botao = item.querySelector('.botao-item-menu');
        const textoItem = botao ? botao.textContent.trim() : '';
        const termosCustomizados = item.getAttribute('data-busca') || '';
        
        // Criar índice de busca combinando todos os termos
        const termosBusca = [
          textoItem.toLowerCase(),
          termosCustomizados.toLowerCase(),
          nomeSecao.toLowerCase()
        ].join(' ');

        this.todosItensMenu.push({
          elementoCache: item.cloneNode(true), // ← Elemento do cache
          texto: textoItem,
          secao: nomeSecao,
          termosBusca: termosBusca,
          dataModule: botao ? botao.getAttribute('data-module') : null,
          dataAction: botao ? botao.getAttribute('data-action') : null,
          dataTarget: botao ? botao.getAttribute('data-target') : null,
          dataBusca: termosCustomizados
        });
      });
    });

    this.atualizarContadorResultados(this.todosItensMenu.length);
    console.log(`📇 ${this.todosItensMenu.length} itens indexados do cache para busca`);
  }

  executarBusca(termo) {
    this.termoBuscaAtual = termo.toLowerCase();
    
    if (termo.length < 2) {
      this.mostrarTodosItens();
      return;
    }

    let itensEncontrados = [];
    let secoesComResultados = new Set();

    // ← MUDANÇA: Buscar nos dados do cache, não no DOM atual
    this.todosItensMenu.forEach((itemCache) => {
      const corresponde = itemCache.termosBusca.includes(this.termoBuscaAtual);
      
      if (corresponde) {
        itensEncontrados.push(itemCache);
        secoesComResultados.add(itemCache.secao);
      }
    });

    // ← NOVA ESTRATÉGIA: Abrir seções e filtrar apenas os resultados
    document.querySelectorAll('.secao-menu').forEach((secao) => {
      const nomeSecao = this.getNomeSecao(secao);
      
      if (secoesComResultados.has(nomeSecao)) {
        secao.classList.remove('busca-oculta');
        
        // Abrir seção se não estiver aberta
        if (!secao.classList.contains('expandida')) {
          this.abrirSecao(secao);
        }
        
        // Após abrir, filtrar os itens dentro dela
        setTimeout(() => {
          this.filtrarItensNaSecao(secao, termo);
        }, 100);
        
      } else {
        secao.classList.add('busca-oculta');
        this.fecharSecao(secao);
      }
    });

    // Atualizar contador e botão limpar
    this.atualizarContadorResultados(itensEncontrados.length);
    this.atualizarBotaoLimpar(termo.length > 0);

    console.log(`🔍 Busca por "${termo}": ${itensEncontrados.length} resultados em ${secoesComResultados.size} seções`);
  }

  // =====================================================
  // NOVA FUNÇÃO: FILTRAR ITENS DENTRO DA SEÇÃO
  // =====================================================
  filtrarItensNaSecao(secao, termo) {
    const nomeSecao = this.getNomeSecao(secao);
    const itensDOM = secao.querySelectorAll('.item-menu');
    
    itensDOM.forEach((itemDOM) => {
      const botao = itemDOM.querySelector('.botao-item-menu');
      if (!botao) return;
      
      const textoItem = botao.textContent.trim();
      const termosCustomizados = itemDOM.getAttribute('data-busca') || '';
      
      const termosBusca = [
        textoItem.toLowerCase(),
        termosCustomizados.toLowerCase(),
        nomeSecao.toLowerCase()
      ].join(' ');
      
      const corresponde = termosBusca.includes(this.termoBuscaAtual);
      
      if (corresponde) {
        // Mostrar item e destacar
        itemDOM.classList.remove('busca-oculto');
        itemDOM.classList.add('busca-destaque');
        
        // Destacar termo encontrado no texto
        this.destacarTermoEncontrado(botao, termo);
      } else {
        // Ocultar item
        itemDOM.classList.add('busca-oculto');
        itemDOM.classList.remove('busca-destaque');
        
        // Remover destaque do termo
        this.removerDestaqueTermo(botao);
      }
    });
  }

  mostrarTodosItens() {
    // Remover todas as classes de busca
    document.querySelectorAll('.item-menu').forEach((item) => {
      item.classList.remove('busca-oculto', 'busca-destaque');
      const botao = item.querySelector('.botao-item-menu');
      if (botao) {
        this.removerDestaqueTermo(botao);
      }
    });

    document.querySelectorAll('.secao-menu').forEach((secao) => {
      secao.classList.remove('busca-oculta');
    });

    this.atualizarContadorResultados(this.todosItensMenu.length);
    this.atualizarBotaoLimpar(false);
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

  limparBusca() {
    if (this.inputBusca) {
      this.inputBusca.value = '';
    }
    this.termoBuscaAtual = '';
    this.mostrarTodosItens();
    console.log("🧹 Busca limpa");
  }

  atualizarContadorResultados(quantidade) {
    if (this.contadorResultados) {
      this.contadorResultados.textContent = `${quantidade} ${quantidade === 1 ? 'item' : 'itens'}`;
      
      if (quantidade > 0 && this.termoBuscaAtual.length >= 2) {
        this.contadorResultados.classList.add('com-resultados');
      } else {
        this.contadorResultados.classList.remove('com-resultados');
      }
    }
  }

  atualizarBotaoLimpar(mostrar) {
    if (this.botaoLimparBusca) {
      if (mostrar) {
        this.botaoLimparBusca.classList.add('visivel');
      } else {
        this.botaoLimparBusca.classList.remove('visivel');
      }
    }
  }

  // =====================================================
  // CONTROLE DE ACCORDION - SOLUÇÃO COMPORTAMENTAL
  // =====================================================
  inicializarAcordeon() {
    const secoesMenu = document.querySelectorAll(".secao-menu");

    secoesMenu.forEach((secao, index) => {
      const cabecalho = secao.querySelector(".cabecalho-secao-menu");
      
      if (cabecalho) {
        console.log(`🔧 Inicializando seção ${index + 1}: ${this.getNomeSecao(secao)}`);
        
        // REMOVER TODOS OS CONTEÚDOS INICIALMENTE
        this.removerConteudoSecao(secao);

        cabecalho.addEventListener("click", () => {
          console.log(`👆 Clique na seção: ${this.getNomeSecao(secao)}`);
          this.alternarSecao(secao);
        });

        cabecalho.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.alternarSecao(secao);
          }
        });
      }
    });
  }

  alternarSecao(secao) {
    const expandida = secao.classList.contains("expandida");
    console.log(`🔄 Alternando seção ${this.getNomeSecao(secao)} - Estado atual: ${expandida ? 'EXPANDIDA' : 'FECHADA'}`);

    // Durante busca, não fechar outras seções
    if (!this.termoBuscaAtual) {
      // Fechar todas as outras seções APENAS se não estivermos buscando
      document.querySelectorAll(".secao-menu").forEach((outraSecao) => {
        if (outraSecao !== secao) {
          this.fecharSecao(outraSecao);
        }
      });
    }

    // Então alternar a seção atual
    if (expandida) {
      this.fecharSecao(secao);
    } else {
      this.abrirSecao(secao);
    }
  }

  abrirSecao(secao) {
    const cabecalho = secao.querySelector(".cabecalho-secao-menu");
    const nomeSecao = this.getNomeSecao(secao);

    if (!cabecalho) return;

    console.log(`📂 ABRINDO seção: ${nomeSecao}`);

    // Marcar como expandida
    secao.classList.add("expandida");
    cabecalho.setAttribute("aria-expanded", "true");
    
    // CRIAR E INSERIR O CONTEÚDO DO CACHE
    this.inserirConteudoSecao(secao);

    console.log(`✅ Seção ${nomeSecao} ABERTA - elemento inserido no DOM`);
  }

  fecharSecao(secao) {
    const cabecalho = secao.querySelector(".cabecalho-secao-menu");
    const nomeSecao = this.getNomeSecao(secao);

    if (!cabecalho) return;

    console.log(`📁 FECHANDO seção: ${nomeSecao}`);

    // Marcar como fechada
    secao.classList.remove("expandida");
    cabecalho.setAttribute("aria-expanded", "false");
    
    // REMOVER COMPLETAMENTE O CONTEÚDO DO DOM
    this.removerConteudoSecao(secao);

    console.log(`✅ Seção ${nomeSecao} FECHADA - elemento removido do DOM`);
  }

  // =====================================================
  // MANIPULAÇÃO DIRETA DO DOM - CORE DA SOLUÇÃO
  // =====================================================
  inserirConteudoSecao(secao) {
    const nomeSecao = this.getNomeSecao(secao);
    const conteudoCache = this.conteudosOriginais.get(nomeSecao);
    
    if (!conteudoCache) {
      console.error(`❌ Conteúdo da seção ${nomeSecao} não encontrado no cache`);
      return;
    }

    // Verificar se já existe conteúdo (evitar duplicação)
    const conteudoExistente = secao.querySelector(".conteudo-menu");
    if (conteudoExistente) {
      console.log(`⚠️ Seção ${nomeSecao} já possui conteúdo, removendo antes`);
      conteudoExistente.remove();
    }

    // Criar novo elemento do cache
    const novoConteudo = conteudoCache.elemento.cloneNode(true);
    
    // Inserir no DOM após o cabeçalho
    const cabecalho = secao.querySelector(".cabecalho-secao-menu");
    if (cabecalho) {
      cabecalho.insertAdjacentElement('afterend', novoConteudo);
      console.log(`➕ Conteúdo da seção ${nomeSecao} inserido no DOM`);
      
      // Se houver busca ativa, aplicar filtro imediatamente
      if (this.termoBuscaAtual.length >= 2) {
        setTimeout(() => {
          this.filtrarItensNaSecao(secao, this.termoBuscaAtual);
        }, 50);
      }
    }
  }

  removerConteudoSecao(secao) {
    const nomeSecao = this.getNomeSecao(secao);
    const conteudo = secao.querySelector(".conteudo-menu");
    
    if (conteudo) {
      conteudo.remove();
      console.log(`➖ Conteúdo da seção ${nomeSecao} removido do DOM`);
    } else {
      console.log(`✅ Seção ${nomeSecao} já estava sem conteúdo`);
    }
  }

  getNomeSecao(secao) {
    const cabecalho = secao.querySelector(".cabecalho-secao-menu span");
    return cabecalho ? cabecalho.textContent.trim() : 'Desconhecida';
  }

  expandirSecaoPadrao() {
    // Aguardar um pouco para garantir que tudo carregou
    setTimeout(() => {
      const secoesMenu = document.querySelectorAll(".secao-menu");
      let secaoPadrao = null;

      // Procurar pela seção "Cadastro"
      secoesMenu.forEach((secao) => {
        const cabecalho = secao.querySelector(".cabecalho-secao-menu");
        if (cabecalho && cabecalho.textContent.trim() === "Cadastro") {
          secaoPadrao = secao;
        }
      });

      // Se não encontrar "Cadastro", pegar a primeira seção
      if (!secaoPadrao && secoesMenu.length > 0) {
        secaoPadrao = secoesMenu[0];
      }

      // Expandir a seção padrão
      if (secaoPadrao) {
        console.log(`🎯 Expandindo seção padrão: ${this.getNomeSecao(secaoPadrao)}`);
        this.abrirSecao(secaoPadrao);
      }
    }, 500);
  }

  configurarNavegacaoTeclado() {
    // Delegar evento para botões que podem ser criados dinamicamente
    document.addEventListener("keydown", (e) => {
      const botaoAtivo = document.activeElement;
      
      if (botaoAtivo && botaoAtivo.classList.contains("botao-item-menu")) {
        const botoesMenu = document.querySelectorAll(".botao-item-menu:not(.busca-oculto)");
        const indiceAtual = Array.from(botoesMenu).indexOf(botaoAtivo);
        let botaoDestino = null;

        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            botaoDestino = botoesMenu[indiceAtual + 1] || botoesMenu[0];
            break;

          case "ArrowUp":
            e.preventDefault();
            if (indiceAtual === 0 && this.inputBusca) {
              // Voltar para o input de busca
              this.inputBusca.focus();
              return;
            }
            botaoDestino = botoesMenu[indiceAtual - 1] || botoesMenu[botoesMenu.length - 1];
            break;

          case "Home":
            e.preventDefault();
            if (this.inputBusca) {
              this.inputBusca.focus();
            } else {
              botaoDestino = botoesMenu[0];
            }
            break;

          case "End":
            e.preventDefault();
            botaoDestino = botoesMenu[botoesMenu.length - 1];
            break;
        }

        if (botaoDestino) {
          botaoDestino.focus();
        }
      }
    });

    const botoesMenuUsuario = document.querySelectorAll(".botao-menu-usuario");

    botoesMenuUsuario.forEach((botao, indice) => {
      botao.addEventListener("keydown", (e) => {
        let botaoDestino = null;

        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            botaoDestino =
              botoesMenuUsuario[indice + 1] || botoesMenuUsuario[0];
            break;

          case "ArrowUp":
            e.preventDefault();
            botaoDestino =
              botoesMenuUsuario[indice - 1] ||
              botoesMenuUsuario[botoesMenuUsuario.length - 1];
            break;
        }

        if (botaoDestino) {
          botaoDestino.focus();
        }
      });
    });
  }

  definirModuloAtivo(nomeModulo) {
    document.querySelectorAll(".botao-item-menu.ativo").forEach((btn) => {
      btn.classList.remove("ativo");
    });

    const botaoModulo = document.querySelector(`[data-module="${nomeModulo}"]`);
    if (botaoModulo) {
      botaoModulo.classList.add("ativo");
    }

    this.moduloAtivo = nomeModulo;
    console.log(`✅ Módulo ativo: ${nomeModulo}`);
  }

  tratarRedimensionamento() {
    if (window.innerWidth < 480) {
      if (this.menuAberto) {
        this.fecharMenu();
      }
      if (this.menuUsuarioAberto) {
        this.fecharMenuUsuario();
      }
    }
  }
}

// Export para window global
window.SVSNavbar = SVSNavbar;