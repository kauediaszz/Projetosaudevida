document.addEventListener('DOMContentLoaded', () => {
  const formAgendamento = document.getElementById('form-agendamento');
  const feedbackMessage = document.getElementById('feedback-message');

  function onlyDigits(s) { return (s || '').replace(/\D/g, ''); }
  function validarEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((email||'').trim()); }
  function validarCPF(cpf) {
    cpf = onlyDigits(cpf);
    if (!/^\d{11}$/.test(cpf)) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
    let dv1 = 11 - (soma % 11); dv1 = dv1 > 9 ? 0 : dv1;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
    let dv2 = 11 - (soma % 11); dv2 = dv2 > 9 ? 0 : dv2;
    return dv1 === parseInt(cpf[9]) && dv2 === parseInt(cpf[10]);
  }
  function validarTelefone(tel) { return /^\(\+55\)\d{2}-\d{8}$/.test((tel||'').trim()); } // fixo 8 dígitos

  function getFieldContainerByInput(el) { return el.closest('.field') || el.parentElement; }
  function ensureErrorSpan(container) {
    let span = container.querySelector('.error-msg');
    if (!span) { span = document.createElement('span'); span.className = 'error-msg'; container.appendChild(span); }
    return span;
  }
  function showFieldError(inputId, message) {
    const el = document.getElementById(inputId);
    if (!el) return;
    const container = getFieldContainerByInput(el);
    container.classList.remove('is-valid');
    container.classList.add('is-invalid');
    const span = ensureErrorSpan(container);
    span.textContent = message || 'Campo inválido';
    el.setCustomValidity(message || 'Campo inválido');
  }
  function clearFieldError(inputId) {
    const el = document.getElementById(inputId);
    if (!el) return;
    const container = getFieldContainerByInput(el);
    container.classList.remove('is-invalid');
    container.classList.add('is-valid');
    const span = container.querySelector('.error-msg');
    if (span) span.textContent = '';
    el.setCustomValidity('');
  }

  function calcularIdadeDetalhada(dataNascimento) {
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();

    let anos = hoje.getFullYear() - nascimento.getFullYear();
    let meses = hoje.getMonth() - nascimento.getMonth();
    let dias = hoje.getDate() - nascimento.getDate();

    if (meses < 0 || (meses === 0 && dias < 0)) {
      anos--;
      meses += (meses < 0 ? 12 : 0);
    }
    if (dias < 0) {
      const mesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
      dias += mesAnterior.getDate();
      meses--;
      if (meses < 0) { meses = 11; anos--; }
    }
    return { anos, meses, dias };
  }

  function validarAgendamento() {
    const nome = document.getElementById('nome-completo').value.trim();
    const responsavel = document.getElementById('responsavel').value.trim();
    const dataNasc = document.getElementById('data-nascimento').value;
    const sexo = document.getElementById('sexo').value;
    const telefone = document.getElementById('telefone').value.trim();
    const email = document.getElementById('email').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const especialidade = document.getElementById('especialidade').value;
    const horario = document.getElementById('horario').value;

    if (!nome) { showFieldError('nome-completo', 'Preencha este campo'); return false; }
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]{8,60}$/.test(nome)) { showFieldError('nome-completo', 'Use de 8 a 60 letras.'); return false; }
    clearFieldError('nome-completo');

    if (!dataNasc) { showFieldError('data-nascimento', 'Preencha este campo'); return false; }
    clearFieldError('data-nascimento');

    if (!cpf) { showFieldError('cpf', 'Preencha este campo'); return false; }
    if (!validarCPF(cpf)) { showFieldError('cpf', 'CPF inválido.'); return false; }
    clearFieldError('cpf');

    if (!telefone) { showFieldError('telefone', 'Preencha este campo'); return false; }
    if (!validarTelefone(telefone)) { showFieldError('telefone', 'Formato: (+55)DD-XXXXXXXX'); return false; }
    clearFieldError('telefone');

    if (!email) { showFieldError('email', 'Preencha este campo'); return false; }
    if (!validarEmail(email)) { showFieldError('email', 'E-mail inválido.'); return false; }
    clearFieldError('email');

    if (!sexo) { showFieldError('sexo', 'Selecione uma opção'); return false; }
    clearFieldError('sexo');

    if (!especialidade) { showFieldError('especialidade', 'Selecione uma especialidade'); return false; }
    clearFieldError('especialidade');

    if (!horario) { showFieldError('horario', 'Escolha um horário'); return false; }
    clearFieldError('horario');

    const idade = calcularIdadeDetalhada(dataNasc);
    if (idade.anos < 18 && !responsavel) {
      showFieldError('responsavel', 'Obrigatório para menores de 18 anos.');
      return false;
    } else {
      clearFieldError('responsavel');
    }

    return true;
  }

  formAgendamento.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validarAgendamento()) return;

    feedbackMessage.textContent = 'Consulta agendada com sucesso!';
    feedbackMessage.className = 'feedback-message success';
    feedbackMessage.style.display = 'block';

    setTimeout(() => {
      // final do funil: volta para a tela principal
      window.location.href = 'index.php';
    }, 1200);
  });

  const CAMPOS = [
    'nome-completo','responsavel','data-nascimento','sexo',
    'telefone','email','cpf','especialidade','horario'
  ];
  CAMPOS.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', () => validarAgendamento());
    el.addEventListener('change', () => validarAgendamento());
  });
});
