// Funções originais mantidas para compatibilidade
function atualiza() {
   document.forms[0].Execucao.value = "";
   document.forms[0].submit();
}

function codigo_item() {
   document.forms[0].Execucao.value = "codigo_item";
   document.forms[0].submit();
}

function codigo_produto() {
   document.forms[0].Execucao.value = "codigo_produto";
   document.forms[0].submit();
}

function codigo_acessorio() {
   document.forms[0].Execucao.value = "codigo_acessorio";
   document.forms[0].submit();
}

function foco(campo) {
   const element = document.querySelector(`[name="${campo}"]`);
   if (element) element.focus();
}

// Módulo AD - Responsável pela lógica específica do módulo
window.AD_Module = {

   // Dados carregados do módulo
   adsData: null,
   clientesData: null,
   transportadorasData: null,
   produtosData: null,

   // Inicializa o módulo AD
   async initialize() {
      console.log('🔄 Inicializando módulo AD...');

      try {
         // Carrega todos os dados necessários para o módulo AD
         await Promise.all([
            this.loadADData(),
            this.loadClientesData(),
            this.loadTransportadorasData(),
            this.loadProdutosData()
         ]);

         // Configura event listeners específicos do módulo
         this.setupEventListeners();

         console.log('✅ Módulo AD inicializado com sucesso');

      } catch (error) {
         console.error('❌ Erro ao inicializar módulo AD:', error);
      }
   },

   // Carrega dados de ADs
   async loadADData() {
      try {
         console.log('📥 Carregando dados de AD...');
         const response = await fetch('/static/data/ad.json');

         if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
         }

         this.adsData = await response.json();
         console.log('✅ Dados de AD carregados:', this.adsData);

         this.populateADSelect();

      } catch (error) {
         console.error('❌ Erro ao carregar dados de AD:', error);
         // Cria dados fictícios para teste
         this.adsData = {
            ads: [
               { codigo: "001", numero: "AD-001", cliente: "Cliente Teste 1" },
               { codigo: "002", numero: "AD-002", cliente: "Cliente Teste 2" }
            ]
         };
         this.populateADSelect();
      }
   },

   // Carrega dados de clientes
   async loadClientesData() {
      try {
         console.log('📥 Carregando dados de clientes...');
         const response = await fetch('/static/data/clientes.json');

         if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
         }

         this.clientesData = await response.json();
         console.log('✅ Dados de clientes carregados:', this.clientesData);

         this.populateClientSelect();

      } catch (error) {
         console.error('❌ Erro ao carregar dados de clientes:', error);
      }
   },

   // Carrega dados de transportadoras
   async loadTransportadorasData() {
      try {
         console.log('📥 Carregando dados de transportadoras...');
         const response = await fetch('/static/data/transportadoras.json');

         if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
         }

         this.transportadorasData = await response.json();
         console.log('✅ Dados de transportadoras carregados:', this.transportadorasData);

         this.populateTransportSelect();

      } catch (error) {
         console.error('❌ Erro ao carregar dados de transportadoras:', error);
      }
   },

   // Carrega dados de produtos
   async loadProdutosData() {
      try {
         console.log('📥 Carregando dados de produtos...');
         const response = await fetch('/static/data/produtos.json');

         if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
         }

         this.produtosData = await response.json();
         console.log('✅ Dados de produtos carregados:', this.produtosData);

      } catch (error) {
         console.error('❌ Erro ao carregar dados de produtos:', error);
      }
   },

   // Popula select de ADs
   populateADSelect() {
      const select = document.getElementById('ad-select');
      if (!select) {
         console.warn('⚠️ Elemento #ad-select não encontrado');
         return;
      }

      if (!this.adsData || !this.adsData.ads) {
         console.warn('⚠️ Dados de AD não disponíveis');
         return;
      }

      // Mantém a primeira opção
      const firstOption = select.firstElementChild;
      select.innerHTML = '';
      select.appendChild(firstOption);

      // Adiciona as ADs
      this.adsData.ads.forEach(ad => {
         const option = document.createElement('option');
         option.value = ad.codigo;
         option.textContent = `${ad.numero} - ${ad.cliente}`;
         select.appendChild(option);
      });

      console.log(`✅ ${this.adsData.ads.length} ADs adicionadas ao select`);
   },

   // Popula select de clientes
   populateClientSelect() {
      const select = document.getElementById('client-select');
      if (!select) {
         console.warn('⚠️ Elemento #client-select não encontrado');
         return;
      }

      if (!this.clientesData || !this.clientesData.clientes) {
         console.warn('⚠️ Dados de clientes não disponíveis');
         return;
      }

      // Mantém a primeira opção
      const firstOption = select.firstElementChild;
      select.innerHTML = '';
      select.appendChild(firstOption);

      // Adiciona os clientes
      this.clientesData.clientes.forEach(cliente => {
         const option = document.createElement('option');
         option.value = cliente.codigo;
         option.textContent = `${cliente.codigo} - ${cliente.razao_social}`;
         select.appendChild(option);
      });

      console.log(`✅ ${this.clientesData.clientes.length} clientes adicionados ao select`);
   },

   // Popula select de transportadoras
   populateTransportSelect() {
      const select = document.getElementById('transp-select');
      if (!select) {
         console.warn('⚠️ Elemento #transp-select não encontrado');
         return;
      }

      if (!this.transportadorasData || !this.transportadorasData.transportadoras) {
         console.warn('⚠️ Dados de transportadoras não disponíveis');
         return;
      }

      // Mantém a primeira opção
      const firstOption = select.firstElementChild;
      select.innerHTML = '';
      select.appendChild(firstOption);

      // Adiciona as transportadoras
      this.transportadorasData.transportadoras.forEach(transp => {
         const option = document.createElement('option');
         option.value = transp.codigo;
         option.textContent = `${transp.codigo} - ${transp.nome}`;
         select.appendChild(option);
      });

      console.log(`✅ ${this.transportadorasData.transportadoras.length} transportadoras adicionadas ao select`);
   },

   // Configura event listeners específicos do módulo
   setupEventListeners() {
      console.log('🔧 Configurando event listeners...');

      // Busca automática de cliente quando código é digitado
      const clientCodeInput = document.getElementById('client-code');
      if (clientCodeInput) {
         clientCodeInput.addEventListener('blur', (e) => {
            const codigo = e.target.value.trim();
            if (codigo) {
               this.searchClient(codigo);
            }
         });
         console.log('✅ Event listener para client-code configurado');
      } else {
         console.warn('⚠️ Elemento #client-code não encontrado');
      }

      // Busca automática de produto quando código é digitado
      const itemCodeInput = document.getElementById('cd-item');
      if (itemCodeInput) {
         itemCodeInput.addEventListener('blur', (e) => {
            const codigo = e.target.value.trim();
            if (codigo) {
               this.searchProduct(codigo);
            }
         });
         console.log('✅ Event listener para cd-item configurado');
      } else {
         console.warn('⚠️ Elemento #cd-item não encontrado');
      }
   },

   // Busca cliente por código
   searchClient(codigo) {
      if (!this.clientesData || !this.clientesData.clientes) {
         console.warn('⚠️ Dados de clientes não disponíveis para busca');
         return;
      }

      const cliente = this.clientesData.clientes.find(c => c.codigo === codigo);
      if (cliente) {
         console.log('🔍 Cliente encontrado:', cliente);
         this.updateClientInfo(cliente);
      } else {
         console.log('🔍 Cliente não encontrado para código:', codigo);
      }
   },

   // Atualiza informações do cliente na tela
   updateClientInfo(cliente) {
      const elements = {
         address: document.getElementById('client-address'),
         city: document.getElementById('client-city'),
         phone: document.getElementById('client-phone'),
         fax: document.getElementById('client-fax'),
         select: document.getElementById('client-select')
      };

      if (elements.address) elements.address.textContent = cliente.endereco || '-';
      if (elements.city) elements.city.textContent = `${cliente.municipio}-${cliente.uf}`;
      if (elements.phone) elements.phone.textContent = cliente.telefone || '-';
      if (elements.fax) elements.fax.textContent = cliente.fax || '-';
      if (elements.select) elements.select.value = cliente.codigo;

      console.log('✅ Informações do cliente atualizadas na tela');
   },

   // Busca produto por código
   searchProduct(codigo) {
      if (!this.produtosData || !this.produtosData.produtos) {
         console.warn('⚠️ Dados de produtos não disponíveis para busca');
         return;
      }

      const produto = this.produtosData.produtos.find(p => p.codigo === codigo);
      if (produto) {
         console.log('🔍 Produto encontrado:', produto);
         // Aqui você pode atualizar a interface com os dados do produto
      } else {
         console.log('🔍 Produto não encontrado para código:', codigo);
      }
   }
};

// Listener para inicialização via evento SPA
document.addEventListener('moduleLoaded', function (e) {
   if (e.detail.moduleName === 'ad') {
      console.log('🎯 Evento moduleLoaded recebido para AD');
      if (window.AD_Module && typeof window.AD_Module.initialize === 'function') {
         window.AD_Module.initialize();
      }
   }
});

// Auto-inicialização quando o DOM estiver pronto (caso seja carregado diretamente)
document.addEventListener('DOMContentLoaded', function () {
   // Só inicializa se estiver na página do módulo AD
   if (document.querySelector('.ad-module')) {
      console.log('🎯 DOMContentLoaded - Inicializando AD diretamente');
      window.AD_Module.initialize();
   }
});

// Debug manual
window.debugAD = function () {
   console.log('🐛 Debug AD Module:');
   console.log('- AD_Module:', window.AD_Module);
   console.log('- adsData:', window.AD_Module?.adsData);
   console.log('- clientesData:', window.AD_Module?.clientesData);
   console.log('- transportadorasData:', window.AD_Module?.transportadorasData);
   console.log('- produtosData:', window.AD_Module?.produtosData);
};