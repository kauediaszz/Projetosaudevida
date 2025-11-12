// ========================= Helpers =========================
const onlyDigits = (s) => (s || '').replace(/\D/g, '');
const norm       = (s) => (s || '').trim();
const lower      = (s) => norm(s).toLowerCase();

function validarNome(nome){ return /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{8,60}$/.test(nome); }
function validarSexo(v){ return ['Feminino','Masculino','Outro'].includes(v); }
function validarEmail(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(norm(e)); }
function validarCEP(cep){ return /^\d{5}-?\d{3}$/.test(cep); }
function validarTelefoneFixoBR(t){ return /^\(\+55\)\d{2}-\d{8}$/.test(t); }
function validarCelularBR(t){ return /^\(\+55\)\d{2}-\d{9}$/.test(t); }
function validarLogin(l){ return /^[A-Za-z]{6}$/.test(l); }
function validarSenha(s){ return /^[A-Za-z]{8}$/.test(s); }

function validarCPF(cpf) {
  cpf = onlyDigits(cpf);
  if (!/^\d{11}$/.test(cpf)) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  let soma = 0;
  for (let i=0;i<9;i++) soma += parseInt(cpf[i]) * (10 - i);
  let dv1 = 11 - (soma % 11); dv1 = dv1 > 9 ? 0 : dv1;
  soma = 0;
  for (let i=0;i<10;i++) soma += parseInt(cpf[i]) * (11 - i);
  let dv2 = 11 - (soma % 11); dv2 = dv2 > 9 ? 0 : dv2;
  return dv1 === parseInt(cpf[9]) && dv2 === parseInt(cpf[10]);
}

// ========================= UI =========================
const feedbackMessage = document.getElementById('feedback-message');
function mostrarFeedback(msg, tipo='success', ms=2500){
  if(!feedbackMessage) return;
  feedbackMessage.textContent = msg;
  feedbackMessage.className = `feedback-message ${tipo}`;
  feedbackMessage.style.display = 'block';
  setTimeout(()=> feedbackMessage.style.display='none', ms);
}

function getFieldContainerByInput(el){ return el.closest('.field') || el.parentElement; }
function ensureErrorSpan(container){
  let span = container.querySelector('.error-msg');
  if(!span){ span = document.createElement('span'); span.className = 'error-msg'; container.appendChild(span); }
  return span;
}
function showFieldError(id, message){
  const el = document.getElementById(id);
  if(!el) return;
  const c = getFieldContainerByInput(el);
  c.classList.remove('is-valid');
  c.classList.add('is-invalid');
  ensureErrorSpan(c).textContent = message || 'Campo inválido';
  el.setCustomValidity(message || 'Campo inválido');
}
function clearFieldError(id){
  const el = document.getElementById(id);
  if(!el) return;
  const c = getFieldContainerByInput(el);
  c.classList.remove('is-invalid');
  c.classList.add('is-valid');
  const span = c.querySelector('.error-msg'); if(span) span.textContent = '';
  el.setCustomValidity('');
}

// ========================= Campos =========================
const formCadastro = document.getElementById('form-cadastro');
const CAMPOS = [
  'nome_completo','nome_materno','data_nascimento','sexo',
  'cpf','celular','telefone','email',
  'cep','logradouro','numero_casa','complemento','bairro','cidade','estado',
  'login','senha','confirmar_senha'
];

// ========================= Validação em tempo real =========================
function validarCampoAoVivo(el){
  const value = norm(el.value);
  if(!value){ showFieldError(el.id,'Preencha este campo'); return false; }

  let msg = '';
  switch(el.id){
    case 'nome_completo':
    case 'nome_materno':
      if(!validarNome(value)) msg='Use de 8 a 60 letras (pode ter espaços).'; break;
    case 'sexo':
      if(!validarSexo(value)) msg='Selecione uma opção.'; break;
    case 'cpf':
      if(!validarCPF(value)) msg='CPF inválido.'; break;
    case 'email':
      if(!validarEmail(value)) msg='E-mail inválido.'; break;
    case 'celular':
      if(!validarCelularBR(value)) msg='Formato: (+55)DD-XXXXXXXXX'; break;
    case 'telefone':
      if(!validarTelefoneFixoBR(value)) msg='Formato: (+55)DD-XXXXXXXX'; break;
    case 'cep':
      if(!validarCEP(value)) msg='CEP inválido. Use #####-###.'; break;
    case 'numero_casa':
      if(!/^\d+$/.test(value)) msg='Número deve ser numérico.'; break;
    case 'login':
      if(!validarLogin(value)) msg='Login: exatamente 6 letras.'; break;
    case 'senha':
      if(!validarSenha(value)) msg='Senha: exatamente 8 letras.'; break;
    case 'confirmar_senha':
      const senha = norm(document.getElementById('senha').value);
      if(value !== senha) msg='As senhas não coincidem.'; break;
  }
  if(msg){ showFieldError(el.id,msg); return false; }
  clearFieldError(el.id); return true;
}

CAMPOS.forEach(id=>{
  const el = document.getElementById(id);
  if(!el) return;
  el.addEventListener('blur', ()=> validarCampoAoVivo(el));
  el.addEventListener('input', ()=> validarCampoAoVivo(el));
});

// ========================= Máscaras =========================
function aplicarMascaraCEP(el){
  let v = onlyDigits(el.value).slice(0,8);
  el.value = v.length>5 ? `${v.slice(0,5)}-${v.slice(5)}` : v;
}
function aplicarMascaraCPF(el){
  let v = onlyDigits(el.value).slice(0,11);
  if (v.length>9) el.value = `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6,9)}-${v.slice(9)}`;
  else if (v.length>6) el.value = `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6)}`;
  else if (v.length>3) el.value = `${v.slice(0,3)}.${v.slice(3)}`;
  else el.value = v;
}
function aplicarMascaraCelular(el){
  let d = onlyDigits(el.value).slice(0,11);
  if(d.length<=2) el.value = `(+55)${d}`;
  else el.value = `(+55)${d.slice(0,2)}-${d.slice(2)}`;
}
function aplicarMascaraTelefoneFixo(el){
  let d = onlyDigits(el.value).slice(0,10);
  if(d.length<=2) el.value = `(+55)${d}`;
  else el.value = `(+55)${d.slice(0,2)}-${d.slice(2)}`;
}

document.getElementById('cpf').addEventListener('input', e=>aplicarMascaraCPF(e.target));
document.getElementById('cep').addEventListener('input', e=>aplicarMascaraCEP(e.target));
document.getElementById('celular').addEventListener('input', e=>aplicarMascaraCelular(e.target));
document.getElementById('telefone').addEventListener('input', e=>aplicarMascaraTelefoneFixo(e.target));

// ========================= ViaCEP =========================
async function buscarCEP(cep){
  const limpo = onlyDigits(cep);
  try{
    const resp = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
    const data = await resp.json();
    if(data.erro) throw new Error('CEP não encontrado');
    document.getElementById('logradouro').value = data.logradouro || '';
    document.getElementById('bairro').value     = data.bairro || '';
    document.getElementById('cidade').value     = data.localidade || '';
    document.getElementById('estado').value     = data.uf || '';
    clearFieldError('cep');
  }catch{
    showFieldError('cep','Não foi possível buscar o CEP.');
  }
}

document.getElementById('cep').addEventListener('blur', async ()=>{
  const cep = norm(document.getElementById('cep').value);
  if(validarCEP(cep)) await buscarCEP(cep);
});

// ========================= Validação Final =========================
function validarCadastro(){
  for(const id of CAMPOS){
    const el = document.getElementById(id);
    if(!el) continue;
    if(!validarCampoAoVivo(el)){
      el.focus();
      return false;
    }
  }
  return true;
}

// ========================= Envio para PHP =========================
formCadastro.addEventListener('submit', (e)=>{
  if(!validarCadastro()){
    e.preventDefault(); // só bloqueia se for inválido
    mostrarFeedback('Verifique os campos destacados.', 'error');
  }
});

// ========================= Botão "Limpar Tudo" =========================
document.getElementById('btn-limpar')?.addEventListener('click', ()=>{
  formCadastro.reset();
  CAMPOS.forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    const c = getFieldContainerByInput(el);
    c.classList.remove('is-invalid','is-valid');
    const span = c.querySelector('.error-msg'); if(span) span.textContent = '';
    el.setCustomValidity('');
  });
  mostrarFeedback('Formulário limpo.','success');
});
