// Variáveis globais
var startday = new Date();
var clockStart = startday.getTime();

// Função para controlar o timer de desconexão
function initStopwatch() {
  var myTime = new Date();
  var timeNow = myTime.getTime();
  var timeDiff = (timeNow - clockStart) / 60;
  this.diffSecs = 120 - timeDiff / 1000;
  return this.diffSecs;
}

function getSecs() {
  var mySecs = initStopwatch();
  var mySecs1 = "" + mySecs;
  mySecs1 = mySecs1.substring(0, mySecs1.indexOf("."));
  var timespentElement = document.getElementById("timespent");
  if (timespentElement) {
    timespentElement.innerText = "Desconecção em " + mySecs1 + " minutos.";
  }
  window.setTimeout(getSecs, 1000);
}

function atualiza() {
  document.forms[0].submit();
}

function Muda_Tabela(Campo) {
  document.forms[0].submit();
}

// =====================================================
// SISTEMA DE MENU RETRÁTIL MODERNO
// =====================================================

class NavbarMenu {
  constructor() {
    this.menuToggle = null;
    this.menuDropdown = null;
    this.menuOverlay = null;
    this.userDropdown = null;
    this.userButton = null;
    this.userMenu = null;
    this.isMenuOpen = false;
    this.isUserMenuOpen = false;
    this.init();
  }

  init() {
    // Busca elementos do DOM
    this.menuToggle = document.querySelector('.menu-toggle');
    this.menuDropdown = document.querySelector('.menu-dropdown');
    this.menuOverlay = document.querySelector('.menu-overlay');
    this.userDropdown = document.querySelector('.user-dropdown');
    this.userButton = document.querySelector('.user-button');
    this.userMenu = document.querySelector('.user-menu');

    // Configura event listeners
    this.setupEventListeners();
    
    // Inicializa accordion das seções
    this.initAccordion();
    
    // Configura navegação por teclado
    this.setupKeyboardNavigation();

    console.log('🚀 Sistema de navbar inicializado');
  }

  setupEventListeners() {
    // Toggle do menu principal
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });
    }

    // Toggle do menu do usuário
    if (this.userButton) {
      this.userButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleUserMenu();
      });
    }

    // Fechar menu clicando no overlay
    if (this.menuOverlay) {
      this.menuOverlay.addEventListener('click', () => {
        this.closeMenu();
      });
    }

    // Fechar menus com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.isUserMenuOpen) {
          this.closeUserMenu();
        } else if (this.isMenuOpen) {
          this.closeMenu();
        }
      }
    });

    // Fechar menus ao clicar fora
    document.addEventListener('click', (e) => {
      // Fechar menu do usuário
      if (this.isUserMenuOpen && 
          !this.userDropdown.contains(e.target)) {
        this.closeUserMenu();
      }
      
      // Fechar menu principal
      if (this.isMenuOpen && 
          !this.menuDropdown.contains(e.target) && 
          !this.menuToggle.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Redimensionamento da janela
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    // Fecha menu do usuário se estiver aberto
    if (this.isUserMenuOpen) {
      this.closeUserMenu();
    }
    
    this.isMenuOpen = true;
    this.menuToggle.classList.add('active');
    this.menuDropdown.classList.add('show');
    this.menuOverlay.classList.add('show');
    
    // Atualiza aria-expanded
    this.menuToggle.setAttribute('aria-expanded', 'true');
    
    // Foca no primeiro item do menu
    setTimeout(() => {
      const firstButton = this.menuDropdown.querySelector('.menu-button-inline');
      if (firstButton) {
        firstButton.focus();
      }
    }, 100);

    console.log('📖 Menu principal aberto');
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.menuToggle.classList.remove('active');
    this.menuDropdown.classList.remove('show');
    this.menuOverlay.classList.remove('show');
    
    // Atualiza aria-expanded
    this.menuToggle.setAttribute('aria-expanded', 'false');
    
    // Retorna foco para o botão toggle
    this.menuToggle.focus();

    console.log('📕 Menu principal fechado');
  }

  toggleUserMenu() {
    if (this.isUserMenuOpen) {
      this.closeUserMenu();
    } else {
      this.openUserMenu();
    }
  }

  openUserMenu() {
    // Fecha menu principal se estiver aberto
    if (this.isMenuOpen) {
      this.closeMenu();
    }
    
    this.isUserMenuOpen = true;
    this.userButton.classList.add('active');
    this.userDropdown.classList.add('show');
    
    // Atualiza aria-expanded
    this.userButton.setAttribute('aria-expanded', 'true');
    
    // Foca no primeiro item do menu do usuário
    setTimeout(() => {
      const firstButton = this.userMenu.querySelector('.user-menu-button');
      if (firstButton) {
        firstButton.focus();
      }
    }, 100);

    console.log('👤 Menu do usuário aberto');
  }

  closeUserMenu() {
    this.isUserMenuOpen = false;
    this.userButton.classList.remove('active');
    this.userDropdown.classList.remove('show');
    
    // Atualiza aria-expanded
    this.userButton.setAttribute('aria-expanded', 'false');
    
    // Retorna foco para o botão do usuário
    this.userButton.focus();

    console.log('👤 Menu do usuário fechado');
  }

  initAccordion() {
    const menuSections = document.querySelectorAll('.menu-section');
    
    menuSections.forEach((section) => {
      const header = section.querySelector('.menu-section-header');
      const content = section.querySelector('.menu-content');
      
      if (header && content) {
        header.addEventListener('click', () => {
          this.toggleSection(section);
        });

        header.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggleSection(section);
          }
        });
      }
    });

    // Expande seção "Cadastro" por padrão (já que removemos a seção Usuário)
    this.expandDefaultSection();
  }

  toggleSection(section) {
    const isExpanded = section.classList.contains('expanded');
    
    // Fecha todas as outras seções
    document.querySelectorAll('.menu-section.expanded').forEach((otherSection) => {
      if (otherSection !== section) {
        otherSection.classList.remove('expanded');
        const otherHeader = otherSection.querySelector('.menu-section-header');
        if (otherHeader) {
          otherHeader.setAttribute('aria-expanded', 'false');
        }
      }
    });
    
    // Toggle da seção atual
    if (isExpanded) {
      section.classList.remove('expanded');
      const header = section.querySelector('.menu-section-header');
      if (header) {
        header.setAttribute('aria-expanded', 'false');
      }
    } else {
      section.classList.add('expanded');
      const header = section.querySelector('.menu-section-header');
      if (header) {
        header.setAttribute('aria-expanded', 'true');
      }
    }
  }

  expandDefaultSection() {
    // Procura pela seção "Cadastro" para expandir por padrão
    const menuSections = document.querySelectorAll('.menu-section');
    let defaultSection = null;
    
    menuSections.forEach((section) => {
      const header = section.querySelector('.menu-section-header');
      if (header && header.textContent.trim() === 'Cadastro') {
        defaultSection = section;
      }
    });
    
    // Se encontrar, expande a seção Cadastro
    if (defaultSection) {
      defaultSection.classList.add('expanded');
      const header = defaultSection.querySelector('.menu-section-header');
      if (header) {
        header.setAttribute('aria-expanded', 'true');
      }
    } else if (menuSections.length > 0) {
      // Se não encontrar, expande a primeira seção
      menuSections[0].classList.add('expanded');
      const header = menuSections[0].querySelector('.menu-section-header');
      if (header) {
        header.setAttribute('aria-expanded', 'true');
      }
    }
  }

  setupKeyboardNavigation() {
    // Navegação no menu principal
    const menuButtons = document.querySelectorAll('.menu-button-inline');
    
    menuButtons.forEach((button, index) => {
      button.addEventListener('keydown', (e) => {
        let targetButton = null;
        
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            targetButton = menuButtons[index + 1] || menuButtons[0];
            break;
            
          case 'ArrowUp':
            e.preventDefault();
            targetButton = menuButtons[index - 1] || menuButtons[menuButtons.length - 1];
            break;
            
          case 'Home':
            e.preventDefault();
            targetButton = menuButtons[0];
            break;
            
          case 'End':
            e.preventDefault();
            targetButton = menuButtons[menuButtons.length - 1];
            break;
        }
        
        if (targetButton) {
          targetButton.focus();
        }
      });
    });

    // Navegação no menu do usuário
    const userMenuButtons = document.querySelectorAll('.user-menu-button');
    
    userMenuButtons.forEach((button, index) => {
      button.addEventListener('keydown', (e) => {
        let targetButton = null;
        
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            targetButton = userMenuButtons[index + 1] || userMenuButtons[0];
            break;
            
          case 'ArrowUp':
            e.preventDefault();
            targetButton = userMenuButtons[index - 1] || userMenuButtons[userMenuButtons.length - 1];
            break;
        }
        
        if (targetButton) {
          targetButton.focus();
        }
      });
    });
  }

  handleResize() {
    // Fecha os menus em telas muito pequenas se estiverem abertos
    if (window.innerWidth < 480) {
      if (this.isMenuOpen) {
        this.closeMenu();
      }
      if (this.isUserMenuOpen) {
        this.closeUserMenu();
      }
    }
  }
}

// =====================================================
// INICIALIZAÇÃO DO SISTEMA
// =====================================================

function inicializarMenu() {
  // Inicializa o sistema de navbar
  window.navbarMenu = new NavbarMenu();
  
  // Inicia o timer de desconexão
  window.setTimeout(getSecs, 1000);
  
  console.log('✅ Sistema de menu inicializado completamente');
}

// Aguarda o DOM carregar para inicializar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarMenu);
} else {
  inicializarMenu();
}