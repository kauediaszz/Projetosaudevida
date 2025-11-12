// ========================= Helpers =========================
const onlyDigits = (s) => (s || '').replace(/\D/g, '');
const norm       = (s) => (s || '').trim();
const lower      = (s) => norm(s).toLowerCase();

function validarNome(nome){ return /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{8,60}$/.test(nome); }
function validarSexo(v){ return ['Feminino','Masculino','Outro'].includes(v); }
function validarEmail(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(norm(e)); }
function validarCEP(cep){ return /^\d{5}-?\d{3}$/.test(cep); }
// >>> Separa fixo e celular
function validarTelefoneFixoBR(t){   // (+55)DD-XXXXXXXX  (8 dígitos)
  return /^\(\+55\)\d{2}-\d{8}$/.test(t);
}
function validarCelularBR(t){        // (+55)DD-XXXXXXXXX (9 dígitos)
  return /^\(\+55\)\d{2}-\d{9}$/.test(t);
}
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

// Banner superior
const feedbackMessage = document.getElementById('feedback-message');
function mostrarFeedback(msg, tipo='success', ms=2500){
  if(!feedbackMessage) return;
  feedbackMessage.textContent = msg;
  feedbackMessage.className = `feedback-message ${tipo}`;
  feedbackMessage.style.display = 'block';
  setTimeout(()=> feedbackMessage.style.display='none', ms);
}

// ========================= UI Inline (erros) =========================
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
const formCadastro   = document.getElementById('form-cadastro');

const inputNome      = document.getElementById('nome-completo');
const inputMaterno   = document.getElementById('nome-materno');
const inputNasc      = document.getElementById('data_nascimento');
const inputSexo      = document.getElementById('sexo');
const inputCPF       = document.getElementById('cpf');
const inputEmail     = document.getElementById('email');
const inputCelular   = document.getElementById('celular');
const inputTelefone  = document.getElementById('telefone');
const inputCEP       = document.getElementById('cep');
const inputLogr      = document.getElementById('logradouro');
const inputNumero    = document.getElementById('numero_casa');
const inputCompl     = document.getElementById('complemento');
const inputBairro    = document.getElementById('bairro');
const inputCidade    = document.getElementById('cidade');
const inputEstado    = document.getElementById('estado');
const inputLogin     = document.getElementById('login');
const inputSenha     = document.getElementById('senha');
const inputConfirmar = document.getElementById('confirmar_senha');

const CAMPOS = [
  'nome-completo','nome-materno','data_nascimento','sexo',
  'cpf','celular','telefone','email',
  'cep','logradouro','numero_casa','complemento','bairro','cidade','estado',
  'login','senha','confirmar_senha'
];

// ========================= Validação em tempo real =========================
function estaValidoAgora(el){
  const raw = el.value || '';
  const value = norm(raw);
  let vazio = !value;

  if(el.id==='celular' || el.id==='telefone'){
    const semPrefixo = raw.replace(/^\(\+55\)/, '');
    const digits = semPrefixo.replace(/\D/g,'');
    vazio = digits.length === 0;
  }
  if(vazio) return false;

  switch(el.id){
    case 'nome-completo':
    case 'nome-materno': return validarNome(value);
    case 'sexo':         return validarSexo(value);
    case 'cpf':          return validarCPF(value);
    case 'email':        return validarEmail(value);
    case 'celular':      return validarCelularBR(value);     // <<< celular 9
    case 'telefone':     return validarTelefoneFixoBR(value);// <<< fixo 8
    case 'cep':          return validarCEP(value);
    case 'numero_casa':  return /^\d+$/.test(value);
    case 'login':        return validarLogin(value);
    case 'senha':        return validarSenha(value);
    case 'confirmar_senha': return value === norm(inputSenha.value);
    default: return true;
  }
}

function validarCampoAoVivo(el){
  const raw = el.value || '';
  const value = norm(raw);
  let vazio = !value;

  if(el.id==='celular' || el.id==='telefone'){
    const semPrefixo = raw.replace(/^\(\+55\)/, '');
    const digits = semPrefixo.replace(/\D/g,'');
    vazio = digits.length === 0;
  }
  if(vazio){ showFieldError(el.id,'Preencha este campo'); return false; }

  let msg = '';
  switch(el.id){
    case 'nome-completo':
    case 'nome-materno':
      if(!validarNome(value)) msg='Use de 8 a 60 letras (pode ter espaços).'; break;
    case 'sexo':
      if(!validarSexo(value)) msg='Selecione uma opção.'; break;
    case 'cpf':
      if(!validarCPF(value)) msg='CPF inválido.'; break;
    case 'email':
      if(!validarEmail(value)) msg='E-mail inválido.'; break;
    case 'celular':
      if(!validarCelularBR(value)) msg='Formato: (+55)DD-XXXXXXXXX'; break;  // 9 dígitos
    case 'telefone':
      if(!msg && !validarTelefoneFixoBR(value)) msg='Formato: (+55)DD-XXXXXXXX'; break; // 8 dígitos
    case 'cep':
      if(!validarCEP(value)) msg='CEP inválido. Use #####-###.'; break;
    case 'numero_casa':
      if(!/^\d+$/.test(value)) msg='Número deve ser numérico.'; break;
    case 'login':
      if(!validarLogin(value)) msg='Login: exatamente 6 letras.'; break;
    case 'senha':
      if(!validarSenha(value)) msg='Senha: exatamente 8 letras.';
      else { if(inputConfirmar?.value) validarCampoAoVivo(inputConfirmar); }
      break;
    case 'confirmar_senha':
      if(value !== norm(inputSenha.value)) msg='As senhas não coincidem.'; break;
  }
  if(msg){ showFieldError(el.id,msg); return false; }
  clearFieldError(el.id); return true;
}

CAMPOS.forEach(id=>{
  const el = document.getElementById(id); if(!el) return;
  el.addEventListener('blur',   ()=> validarCampoAoVivo(el));
  el.addEventListener('change', ()=> validarCampoAoVivo(el));
  el.addEventListener('input',  ()=> { if(estaValidoAgora(el)) clearFieldError(el.id); });
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
// separa as máscaras
function aplicarMascaraCelular(el){   // 9 dígitos
  let raw = (el.value || '').replace(/^\(\+55\)/,'');
  let d = raw.replace(/\D/g,'');
  if(d.startsWith('55') && d.length>9) d = d.slice(2);
  d = d.slice(0,11); // 2 DDD + 9 número
  if(d.length===0) el.value='(+55)';
  else if(d.length<=2) el.value = `(+55)${d}`;
  else el.value = `(+55)${d.slice(0,2)}-${d.slice(2)}`;
}
function aplicarMascaraTelefoneFixo(el){ // 8 dígitos
  let raw = (el.value || '').replace(/^\(\+55\)/,'');
  let d = raw.replace(/\D/g,'');
  if(d.startsWith('55') && d.length>8) d = d.slice(2);
  d = d.slice(0,10); // 2 DDD + 8 número
  if(d.length===0) el.value='(+55)';
  else if(d.length<=2) el.value = `(+55)${d}`;
  else el.value = `(+55)${d.slice(0,2)}-${d.slice(2)}`;
}

inputCPF.addEventListener('input', (e)=>aplicarMascaraCPF(e.target));
inputCEP.addEventListener('input', (e)=>aplicarMascaraCEP(e.target));
// inicia com prefixo e aplica handlers distintos
if(!inputCelular.value)  inputCelular.value='(+55)';
if(!inputTelefone.value) inputTelefone.value='(+55)';
inputCelular.addEventListener('input', e=>aplicarMascaraCelular(e.target));
inputCelular.addEventListener('blur',  e=>aplicarMascaraCelular(e.target));
inputTelefone.addEventListener('input', e=>aplicarMascaraTelefoneFixo(e.target));
inputTelefone.addEventListener('blur',  e=>aplicarMascaraTelefoneFixo(e.target));

// ========================= ViaCEP =========================
function limparEndereco(){
  inputLogr.value=''; inputBairro.value=''; inputCidade.value=''; inputEstado.value='';
  inputLogr.readOnly = inputBairro.readOnly = inputCidade.readOnly = inputEstado.readOnly = false;
}
async function buscarCEP(cep){
  const limpo = onlyDigits(cep);
  try{
    const resp = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
    if(!resp.ok) throw new Error('HTTP');
    const data = await resp.json();
    if(data.erro) throw new Error('CEP não encontrado');

    inputLogr.value   = data.logradouro || '';
    inputBairro.value = data.bairro     || '';
    inputCidade.value = data.localidade || '';
    inputEstado.value = data.uf         || '';

    inputLogr.readOnly   = !!data.logradouro;
    inputBairro.readOnly = !!data.bairro;
    inputCidade.readOnly = !!data.localidade;
    inputEstado.readOnly = !!data.uf;

    clearFieldError('cep');
    ['logradouro','bairro','cidade','estado'].forEach(id=>{
      const el = document.getElementById(id);
      if(el && norm(el.value)) clearFieldError(id);
    });
  }catch(e){
    limparEndereco();
    showFieldError('cep','Não foi possível buscar o CEP. Preencha o endereço manualmente.');
  }
}

inputCEP.addEventListener('input', ()=>{
  if(onlyDigits(inputCEP.value).length < 8) limparEndereco();
});
inputCEP.addEventListener('blur', async ()=>{
  const cep = norm(inputCEP.value);
  if(!validarCEP(cep)){ limparEndereco(); showFieldError('cep','CEP inválido. Use #####-###.'); return; }
  clearFieldError('cep'); await buscarCEP(cep);
});

// ========================= Validação completa =========================
function validarCadastro(){
  const nomeCompleto = norm(inputNome.value);
  const nomeMaterno  = norm(inputMaterno.value);
  const dataNasc     = norm(inputNasc.value);
  const sexo         = inputSexo.value;

  const cpf          = norm(inputCPF.value);
  const celular      = norm(inputCelular.value);
  const telefone     = norm(inputTelefone.value);
  const email        = norm(inputEmail.value);

  const cep          = norm(inputCEP.value);
  const logradouro   = norm(inputLogr.value);
  const numeroCasa   = norm(inputNumero.value);
  const complemento  = norm(inputCompl.value);
  const bairro       = norm(inputBairro.value);
  const cidade       = norm(inputCidade.value);
  const estado       = norm(inputEstado.value);

  const login        = norm(inputLogin.value);
  const senha        = norm(inputSenha.value);
  const confirmar    = norm(inputConfirmar.value);

  const obrig = [
    ['nome-completo',nomeCompleto],['nome-materno',nomeMaterno],['data_nascimento',dataNasc],['sexo',sexo],
    ['cpf',cpf],['email',email],['celular',celular],['telefone',telefone],
    ['cep',cep],['logradouro',logradouro],['numero_casa',numeroCasa],['complemento',complemento],
    ['bairro',bairro],['cidade',cidade],['estado',estado],['login',login],['senha',senha],['confirmar_senha',confirmar]
  ];
  for(const [id,val] of obrig){
    if(!val){ showFieldError(id,'Preencha este campo'); document.getElementById(id).focus(); return false; }
    clearFieldError(id);
  }

  if(!validarNome(nomeCompleto))      { showFieldError('nome-completo','Use de 8 a 60 letras (pode ter espaços).'); inputNome.focus(); return false; }
  if(!validarNome(nomeMaterno))       { showFieldError('nome-materno','Use de 8 a 60 letras (pode ter espaços).');  inputMaterno.focus(); return false; }
  if(!validarSexo(sexo))              { showFieldError('sexo','Selecione uma opção.'); inputSexo.focus(); return false; }
  if(!validarCPF(cpf))                { showFieldError('cpf','CPF inválido.'); inputCPF.focus(); return false; }
  if(!validarEmail(email))            { showFieldError('email','E-mail inválido.'); inputEmail.focus(); return false; }
  if(!validarCelularBR(celular))      { showFieldError('celular','Formato: (+55)DD-XXXXXXXXX'); inputCelular.focus(); return false; } // 9 dígitos
  if(!validarTelefoneFixoBR(telefone)){ showFieldError('telefone','Formato: (+55)DD-XXXXXXXX'); inputTelefone.focus(); return false; } // 8 dígitos
  if(!validarCEP(cep))                { showFieldError('cep','CEP inválido. Use #####-###.'); inputCEP.focus(); return false; }
  if(!/^\d+$/.test(numeroCasa))       { showFieldError('numero_casa','Número deve ser numérico.'); inputNumero.focus(); return false; }
  if(!validarLogin(login))            { showFieldError('login','Login: exatamente 6 letras.'); inputLogin.focus(); return false; }
  if(!validarSenha(senha))            { showFieldError('senha','Senha: exatamente 8 letras.'); inputSenha.focus(); return false; }
  if(senha !== confirmar)             { showFieldError('confirmar_senha','As senhas não coincidem.'); inputConfirmar.focus(); return false; }

  return true;
}

// ========================= Hash =========================
async function hashSHA256(texto){
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(texto));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,'0')).join('');
}

// ========================= Submit =========================
formCadastro.addEventListener('submit', async (e)=>{
  e.preventDefault();

  // valida inline para apontar o primeiro
  let primeiroInvalido = null;
  CAMPOS.forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    const ok = validarCampoAoVivo(el);
    if(!ok && !primeiroInvalido) primeiroInvalido = el;
  });
  if(primeiroInvalido){ primeiroInvalido.focus(); return; }

  if(!validarCadastro()) return;

  // checa duplicados
  let usuarios = [];
  try { usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]'); } catch(e){ usuarios = []; }

  const login = lower(inputLogin.value);
  const email = lower(inputEmail.value);
  const cpf   = onlyDigits(inputCPF.value);

  const dupLogin = usuarios.find(u => lower(u.login) === login);
  if(dupLogin){ showFieldError('login','Este login já está em uso.'); inputLogin.focus(); return; }

  const dupEmail = usuarios.find(u => lower(u.email||'') === email);
  if(dupEmail){ showFieldError('email','Este e-mail já está em uso.'); inputEmail.focus(); return; }

  const dupCPF   = usuarios.find(u => onlyDigits(u.cpf||'') === cpf);
  if(dupCPF){ showFieldError('cpf','Este CPF já está cadastrado.'); inputCPF.focus(); return; }

  // hash da senha
  let senhaHash;
  try { senhaHash = await hashSHA256(norm(inputSenha.value)); }
  catch { senhaHash = 'fallback_' + btoa(norm(inputSenha.value)); }

  const payload = {
    nomeCompleto:   norm(inputNome.value),
    dataNascimento: norm(inputNasc.value),
    sexo:           inputSexo.value,
    nomeMaterno:    norm(inputMaterno.value),
    cpf:            cpf,
    email:          norm(inputEmail.value),
    celular:        norm(inputCelular.value),
    telefone:       norm(inputTelefone.value),
    endereco: {
      logradouro: norm(inputLogr.value),
      numero:     norm(inputNumero.value),
      complemento:norm(inputCompl.value),
      bairro:     norm(inputBairro.value),
      cidade:     norm(inputCidade.value),
      estado:     norm(inputEstado.value),
      cep:        norm(inputCEP.value),
    },
    login: norm(inputLogin.value),
    senhaHash,
    verified: false
  };

  // salva (com backend ou localStorage – fallback)
  try{
    const resp = await fetch('/api/usuarios', {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)
    });
    if(!resp.ok) throw new Error('HTTP '+resp.status);
    mostrarFeedback('Usuário cadastrado! Direcionando para a verificação...', 'success');
  }catch{
    usuarios.push(payload);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    mostrarFeedback('Usuário cadastrado! Direcionando para a verificação...', 'success');
  }

  setTimeout(()=>{
    window.location.href = `pag-verificacao.php?login=${encodeURIComponent(payload.login)}`;
  }, 1000);
});

// ========================= Botão "Limpar tudo" =========================
document.getElementById('btn-limpar')?.addEventListener('click', ()=>{
  formCadastro.reset();
  CAMPOS.forEach(id=>{
    const el = document.getElementById(id); if(!el) return;
    const c = getFieldContainerByInput(el);
    c.classList.remove('is-invalid','is-valid');
    const span = c.querySelector('.error-msg'); if(span) span.textContent = '';
    el.setCustomValidity('');
  });
  inputLogr.readOnly = inputBairro.readOnly = inputCidade.readOnly = inputEstado.readOnly = false;
  inputCelular.value = '(+55)'; 
  inputTelefone.value = '(+55)';
  mostrarFeedback('Formulário limpo.','success');
});
