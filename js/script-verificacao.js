// ============ Helpers ============
const norm = s => (s || '').trim();
const normLower = s => norm(s).toLowerCase();
const isEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(norm(e));
const genCode6 = () => String(Math.floor(100000 + Math.random() * 900000));
const maskEmail = (email='') => {
  const [u, d] = (email||'').split('@');
  if (!u || !d) return email;
  return `${u.slice(0,2)}${u.length>2 ? '*'.repeat(u.length-2) : ''}@${d}`;
};
function toast(el, msg, tipo='error', ms=1800){
  if(!el) return;
  el.textContent = msg;
  el.className = `feedback-message ${tipo}`;
  el.style.display = 'block';
  setTimeout(()=> el.style.display = 'none', ms);
}

// ============ EmailJS (opcional) ============
// Configure por variáveis globais (window.EMAILJS_PUBLIC_KEY, etc.) ou via localStorage:
// localStorage.setItem('EMAILJS_PUBLIC_KEY', 'seu_public_key')
// localStorage.setItem('EMAILJS_SERVICE_ID', 'seu_service_id')
// localStorage.setItem('EMAILJS_TEMPLATE_ID', 'seu_template_id')
const EMAILJS_PUBLIC_KEY  = (window.EMAILJS_PUBLIC_KEY  || localStorage.getItem('EMAILJS_PUBLIC_KEY')  || '').trim();
const EMAILJS_SERVICE_ID  = (window.EMAILJS_SERVICE_ID  || localStorage.getItem('EMAILJS_SERVICE_ID')  || '').trim();
const EMAILJS_TEMPLATE_ID = (window.EMAILJS_TEMPLATE_ID || localStorage.getItem('EMAILJS_TEMPLATE_ID') || '').trim();

function emailJsReady(){
  return typeof window.emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID;
}

try { if (emailJsReady()) window.emailjs.init(EMAILJS_PUBLIC_KEY); } catch {}

async function sendCodeViaEmail(toEmail, code){
  if (!emailJsReady()) return { ok:false, reason:'not_configured' };
  try {
    const params = { to_email: toEmail, verification_code: code };
    await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
    return { ok:true };
  } catch (e) {
    return { ok:false, reason: e?.message || 'send_failed' };
  }
}

// ============ Elementos ============
const feedback        = document.getElementById('feedback-message');
const inputEmail      = document.getElementById('email-verificacao');
const inputCodigo     = document.getElementById('codigo');
const btnEnviarCodigo = document.getElementById('btnEnviarCodigo');
const btnConfirmar    = document.getElementById('btnConfirmar');
const aviso2FA        = document.getElementById('aviso-2fa');

// ============ Estado & Config ============
const params      = new URLSearchParams(location.search);
const loginParam  = norm(params.get('login'));  
const redirectUrl = norm(params.get('returnUrl') || localStorage.getItem('redirectAfterLogin') || 'index.php');

let usuarios      = [];
try { usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]'); } catch { usuarios = []; }

const CODE_TTL_MS    = 5 * 60 * 1000; // 5 min
const COOLDOWN_MS    = 30 * 1000;     // 30 s
const MAX_TENTATIVAS = 5;

const challKey   = login => `verify:${login}`;
const saveChall  = (login, obj) => localStorage.setItem(challKey(login), JSON.stringify(obj));
const loadChall  = login => { try { return JSON.parse(localStorage.getItem(challKey(login)) || 'null'); } catch { return null; } };
const clearChall = login => localStorage.removeItem(challKey(login));

let countdownInterval = null;

// ============ UX: contador mm:ss ============
function startCountdownUI(login){
  if (countdownInterval) clearInterval(countdownInterval);
  const c = loadChall(login);
  if (!c || !c.expireAt){
    if (aviso2FA) aviso2FA.textContent = '';
    return;
  }
  function tick(){
    const left = c.expireAt - Date.now();
    if (left <= 0){
      aviso2FA.textContent = 'Código expirado. Peça um novo.';
      clearInterval(countdownInterval);
      countdownInterval = null;
      return;
    }
    const mm = String(Math.floor(left/60000)).padStart(2,'0');
    const ss = String(Math.floor((left%60000)/1000)).padStart(2,'0');
    aviso2FA.textContent = `Enviamos um código para ${maskEmail(c.email)} — expira em ${mm}:${ss}`;
  }
  tick();
  countdownInterval = setInterval(tick, 1000);
}

// ============ Resolver usuário ============
function resolveUser(){
  if (loginParam){
    const u = usuarios.find(x => normLower(x.login) === normLower(loginParam));
    if (u) return u;
  }
  const e = normLower(inputEmail.value);
  if (e){
    const u = usuarios.find(x => normLower(x.email || '') === e);
    if (u) return u;
  }
  return null;
}

// ============ Enviar código ============
btnEnviarCodigo?.addEventListener('click', () => {
  const user = resolveUser();
  if (!user){
    toast(feedback, 'Usuário não encontrado. Faça o cadastro primeiro.', 'error');
    return;
  }

  const typed = norm(inputEmail.value);
  if (!isEmail(typed)){
    if (isEmail(user.email)){
      inputEmail.value = user.email;
    } else {
      toast(feedback, 'Informe um e-mail válido.', 'error');
      inputEmail.focus();
      return;
    }
  }

  const email = isEmail(user.email) ? user.email : typed;
  const existing = loadChall(user.login) || {};
  if (existing.sendCooldownUntil && Date.now() < existing.sendCooldownUntil){
    const left = Math.ceil((existing.sendCooldownUntil - Date.now())/1000);
    toast(feedback, `Aguarde ${left}s para reenviar.`, 'error');
    return;
  }

  const code = genCode6();
  const chal = {
    code,
    expireAt: Date.now() + CODE_TTL_MS,
    email,
    attemptsLeft: MAX_TENTATIVAS,
    sendCooldownUntil: Date.now() + COOLDOWN_MS
  };
  saveChall(user.login, chal);
  startCountdownUI(user.login);

  // Tenta envio real via EmailJS; se não configurado, mantém modo DEMO
  (async () => {
    const result = await sendCodeViaEmail(email, code);
    if (result.ok){
      if (aviso2FA) aviso2FA.textContent = `Enviamos um código para ${maskEmail(email)}.`;
      toast(feedback, 'Código enviado por e-mail!', 'success');
    } else {
      if (aviso2FA) aviso2FA.textContent = `Enviamos um código para ${maskEmail(email)}. (DEMO: ${code})`;
      console.log('DEMO – código de verificação:', code);
      if (result.reason === 'not_configured'){
        toast(feedback, 'Código gerado localmente. Configure EmailJS para envio real.', 'success');
      } else {
        toast(feedback, 'Falha ao enviar e-mail. Use o código DEMO acima.', 'error');
      }
    }
  })();
});

// ============ Confirmar ============
btnConfirmar?.addEventListener('click', () => {
  const user = resolveUser();
  if (!user){
    toast(feedback, 'Usuário não encontrado. Faça o cadastro.', 'error');
    return;
  }

  const chal = loadChall(user.login);
  if (!chal){
    toast(feedback, 'Nenhum código foi gerado. Clique em "Enviar código".', 'error');
    return;
  }

  if (Date.now() > chal.expireAt){
    clearChall(user.login);
    startCountdownUI(user.login);
    toast(feedback, 'Código expirado. Peça outro.', 'error');
    return;
  }

  const code = norm(inputCodigo.value);
  if (!code){
    toast(feedback, 'Digite o código.', 'error');
    inputCodigo.focus();
    return;
  }

  if (code !== chal.code){
    chal.attemptsLeft = typeof chal.attemptsLeft === 'number' ? chal.attemptsLeft - 1 : (MAX_TENTATIVAS - 1);
    if (chal.attemptsLeft <= 0){
      clearChall(user.login);
      toast(feedback, 'Muitas tentativas. Gere um novo código.', 'error');
      return;
    }
    saveChall(user.login, chal);
    toast(feedback, `Código incorreto. Restam ${chal.attemptsLeft} tentativas.`, 'error');
    return;
  }

  // Marca como verificado
  try {
    const db = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const i = db.findIndex(x => normLower(x.login) === normLower(user.login));
    if (i >= 0){
      db[i].verified = true;
      if (isEmail(inputEmail.value)) db[i].email = norm(inputEmail.value);
      localStorage.setItem('usuarios', JSON.stringify(db));
      
      // Salva o usuário como logado após verificação bem-sucedida
      localStorage.setItem("usuarioLogado", JSON.stringify({
        nomeCompleto: user.nomeCompleto,
        login: user.login,
        email: isEmail(inputEmail.value) ? norm(inputEmail.value) : user.email
      }));
    }
  } catch {}

  clearChall(user.login);
  if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }

  toast(feedback, 'E-mail verificado com sucesso!', 'success', 1200);

  // Redireciona: volta para o returnUrl, se houver
  setTimeout(() => {
    localStorage.removeItem('redirectAfterLogin');
    location.href = redirectUrl;
  }, 1000);
});
