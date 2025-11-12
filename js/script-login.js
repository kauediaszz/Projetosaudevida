// ========== Helpers ==========
async function sha256Hex(text) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function toast(el, msg, tipo = "error", ms = 2000) {
  if (!el) return;
  el.textContent = msg;
  el.className = `feedback-message ${tipo}`;
  el.style.display = "block";
  setTimeout(() => { el.style.display = "none"; }, ms);
}

// ========== Mensagem pós-reset e preenchimento de login ==========
(() => {
  const qp = new URLSearchParams(location.search);

  // Exibe "Senha alterada" se vier com ?reset=ok
  if (qp.get('reset') === 'ok') {
    const feedback = document.getElementById('feedback-message');
    if (feedback) {
      feedback.textContent = 'Senha alterada com sucesso! Faça login.';
      feedback.className = 'feedback-message success';
      feedback.style.display = 'block';
      setTimeout(() => feedback.style.display = 'none', 2000);
    }
  }

  // Preenche o login se vier com ?login=FULANO
  const prefill = qp.get('login');
  if (prefill) {
    const inputUser = document.getElementById('usuario');
    if (inputUser) inputUser.value = prefill;
  }
})();

// ========== Elementos ==========
const feedback = document.getElementById("feedback-message");
const btnEntrar = document.getElementById("enviar");
const inputUser = document.getElementById("usuario");
const inputPass = document.getElementById("senha");

// ========== Função de login ==========
async function fazerLogin() {
  const loginDigitado = (inputUser?.value || "").trim();
  const senhaDigitada = (inputPass?.value || "").trim();

  if (!loginDigitado || !senhaDigitada) {
    toast(feedback, "Preencha usuário e senha.", "error");
    return;
  }

  // Recupera usuários do localStorage
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

  // Se não há nenhum usuário cadastrado
  if (!Array.isArray(usuarios) || usuarios.length === 0) {
    toast(feedback, "Nenhuma conta encontrada. Faça seu cadastro primeiro.", "error", 2500);
    setTimeout(() => {
      location.href = `pag-cadastro.php?novo=${encodeURIComponent(loginDigitado)}`;
    }, 900);
    return;
  }

  // Busca usuário pelo login (case-insensitive)
  const user = usuarios.find(u => (u.login || "").toLowerCase() === loginDigitado.toLowerCase());

  // Se o usuário não existe
  if (!user) {
    toast(feedback, "Conta não encontrada. Crie uma nova conta.", "error", 2500);
    setTimeout(() => {
      location.href = `pag-cadastro.php?novo=${encodeURIComponent(loginDigitado)}`;
    }, 900);
    return;
  }

  // Confere senha (usa hash se existir)
  let senhaOk = false;
  if (user.senhaHash) {
    const hashDigitada = await sha256Hex(senhaDigitada);
    senhaOk = hashDigitada === user.senhaHash;
  } else if (user.senha) {
    senhaOk = senhaDigitada === user.senha;
  }

  if (!senhaOk) {
    toast(feedback, "Usuário ou senha inválidos.", "error");
    return;
  }

  // Salva sessão atual
  localStorage.setItem("usuarioLogado", JSON.stringify({
    nomeCompleto: user.nomeCompleto,
    login: user.login
  }));

  toast(feedback, "Login realizado com sucesso!", "success", 1200);
  setTimeout(() => {
    const redirect = localStorage.getItem('redirectAfterLogin');
    if (redirect) {
      localStorage.removeItem('redirectAfterLogin');
      location.href = redirect;
    } else {
      location.href = "index.php";
    }
  }, 900);
}

// ========== Eventos de login ==========
// Botão de login
btnEntrar?.addEventListener("click", async (e) => {
  e.preventDefault();
  await fazerLogin();
});

// Enter nos campos de input
inputUser?.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    await fazerLogin();
  }
});

inputPass?.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    await fazerLogin();
  }
});
