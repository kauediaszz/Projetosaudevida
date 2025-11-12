document.addEventListener('DOMContentLoaded', function () {
  // ===== Verificar login e mostrar/esconder botão logout =====
  var logoutItem = document.getElementById('logout-item');
  var btnLogout = document.getElementById('btn-logout');
  
  function checkLoginStatus() {
    var usuarioLogado = null;
    try {
      usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
    } catch (err) {
      usuarioLogado = null;
    }
    
    if (usuarioLogado && logoutItem) {
      logoutItem.style.display = 'block';
      // Mostra mensagem de boas-vindas
      showWelcomeMessage(usuarioLogado.nomeCompleto);
    } else if (logoutItem) {
      logoutItem.style.display = 'none';
    }
  }

  // ===== Mostrar mensagem de boas-vindas =====
  function showWelcomeMessage(nomeCompleto) {
    var mensagemBoasVindas = document.getElementById('mensagem-boas-vindas');
    var textoBoasVindas = document.getElementById('texto-boas-vindas');
    
    if (mensagemBoasVindas && textoBoasVindas) {
      // Extrai apenas o primeiro nome (até o primeiro espaço)
      var primeiroNome = nomeCompleto ? nomeCompleto.split(' ')[0] : 'Usuário';
      
      // Personaliza a mensagem com o primeiro nome
      textoBoasVindas.textContent = `Bem-vindo, ${primeiroNome}!`;
      
      // Mostra a mensagem
      mensagemBoasVindas.style.display = 'block';
      
      // Auto-fecha após 5 segundos
      setTimeout(function() {
        if (mensagemBoasVindas.style.display !== 'none') {
          var bsAlert = new bootstrap.Alert(mensagemBoasVindas);
          bsAlert.close();
        }
      }, 5000);
    }
  }
  
  // Verificar status ao carregar a página
  checkLoginStatus();
  
  // Função de logout
  function fazerLogout() {
    try {
      localStorage.removeItem('usuarioLogado');
      localStorage.removeItem('redirectAfterLogin');
      localStorage.removeItem('redirectAfterVerify');
      alert('Logout realizado com sucesso!');
      window.location.href = 'pag-login.php';
    } catch (e) {
      console.error('Erro ao fazer logout:', e);
    }
  }
  
  // Event listener para o botão de logout
  if (btnLogout) {
    btnLogout.addEventListener('click', function(e) {
      e.preventDefault();
      // Mostra o modal personalizado
      var modalLogout = new bootstrap.Modal(document.getElementById('modalLogout'));
      modalLogout.show();
    });
  }
  
  // Event listener para confirmar logout no modal
  var confirmLogoutBtn = document.getElementById('confirmLogout');
  if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener('click', function() {
      // Fecha o modal e executa logout
      var modalLogout = bootstrap.Modal.getInstance(document.getElementById('modalLogout'));
      modalLogout.hide();
      fazerLogout();
    });
  }

  // ===== Tema claro/escuro =====
  var themeToggleButton = document.getElementById('theme-toggle');
  var body = document.body;

  try {
    if (localStorage.getItem('theme') === 'dark') {
      body.classList.add('dark-mode');
    }
  } catch (e) {}

  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', function () {
      body.classList.toggle('dark-mode');
      var isDark = body.classList.contains('dark-mode');
      try {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      } catch (e) {}
    });
  }

  // ===== Botão "Agendar" -> se não logado, manda pro login e arma o pós-verificação =====
  var btnAgendar = document.getElementById('btnAgendar');
  if (btnAgendar) {
    btnAgendar.addEventListener('click', function (e) {
      e.preventDefault();
      var destino = 'pag-agendamento.php';

      // marca intenção de navegação pós-login e pós-verificação
      try {
        localStorage.setItem('redirectAfterLogin', destino);
        localStorage.setItem('redirectAfterVerify', destino);
      } catch (e) {}

      // decide se precisa logar
      var usuarioLogado = null;
      try {
        usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
      } catch (err) {
        usuarioLogado = null;
      }

      if (!usuarioLogado) {
        // vai pro login
        window.location.href = 'pag-login.php';
      } else {
        // já logado: vai direto ao formulário
        window.location.href = destino;
      }
    });
  }

  // ===== Acessibilidade =====
  var fonteSlider = document.getElementById('fonte-slider');
  var fonteTamanho = document.getElementById('fonte-tamanho');
  var acessibilidadeContainer = document.getElementById('acessibilidade-container');
  var btnAcessibilidade = document.getElementById('btn-acessibilidade');
  var btnFecharAcessibilidade = document.getElementById('btn-fechar-acessibilidade');
  var temaTexto = document.getElementById('tema-texto');

  var seletorTexto = 'p, a, li, h1, h2, h3, h4, h5, h6, button, label, input, textarea, small, span';
  function aplicarTamanhoFonte(px) {
    var nodes = document.querySelectorAll(seletorTexto);
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].style.fontSize = px + 'px';
    }
  }

  function atualizarTextoTheme() {
    if (temaTexto) {
      temaTexto.textContent = body.classList.contains('dark-mode') ? 'Escuro' : 'Claro';
    }
  }

  if (fonteSlider && fonteTamanho) {
    var salvo = '16';
    try {
      salvo = localStorage.getItem('tamanhoFonte') || fonteSlider.value || '16';
    } catch (e) {}

    aplicarTamanhoFonte(salvo);
    fonteSlider.value = salvo;
    fonteTamanho.textContent = salvo + 'px';

    fonteSlider.addEventListener('input', function () {
      var novo = fonteSlider.value;
      aplicarTamanhoFonte(novo);
      fonteTamanho.textContent = novo + 'px';
      try {
        localStorage.setItem('tamanhoFonte', novo);
      } catch (e) {}
    });
  }

  if (btnAcessibilidade && acessibilidadeContainer) {
    btnAcessibilidade.addEventListener('click', function () {
      var visivel = acessibilidadeContainer.style.display === 'block';
      acessibilidadeContainer.style.display = visivel ? 'none' : 'block';
      atualizarTextoTheme();
    });
  }

  if (btnFecharAcessibilidade && acessibilidadeContainer) {
    btnFecharAcessibilidade.addEventListener('click', function () {
      acessibilidadeContainer.style.display = 'none';
    });
  }

  // Atualizar texto do tema quando mudar
  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', function () {
      setTimeout(atualizarTextoTheme, 100);
    });
  }

  // ===== Navbar: rolagem suave =====
  function scrollToWithOffset(selector, offset) {
    var el = document.querySelector(selector);
    if (!el) return;
    var y = el.getBoundingClientRect().top + window.pageYOffset - (offset || 0);
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  var headerEl = document.querySelector('header');
  function getOffset() {
    return headerEl ? headerEl.offsetHeight + 8 : 0;
  }

  function closeNavbarIfOpen() {
    var nav = document.getElementById('navbarNav');
    if (nav && nav.classList.contains('show') && window.bootstrap) {
      var bsCollapse = bootstrap.Collapse.getOrCreateInstance(nav);
      bsCollapse.hide();
    }
  }

  var linkTopo = document.querySelector('a.nav-link[href="#topo"]');
  if (linkTopo) {
    linkTopo.addEventListener('click', function (e) {
      if (e && e.preventDefault) e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      closeNavbarIfOpen();
    });
  }

  var linkSobre = document.querySelector('a.nav-link[href="#sobre-nos"]');
  if (linkSobre) {
    linkSobre.addEventListener('click', function (e) {
      if (e && e.preventDefault) e.preventDefault();
      scrollToWithOffset('#sobre-nos', getOffset());
      closeNavbarIfOpen();
    });
  }

  var linkDuvidas = document.querySelector('a.nav-link[href="#duvidas"]');
  if (linkDuvidas) {
    linkDuvidas.addEventListener('click', function (e) {
      if (e && e.preventDefault) e.preventDefault();
      scrollToWithOffset('#duvidas', getOffset());
      closeNavbarIfOpen();
    });
  }
});
