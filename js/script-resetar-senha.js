// ===== Helpers =====
const norm  = s => (s || "").trim();
const lower = s => norm(s).toLowerCase();
const isEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(norm(e));
// No seu projeto, senha = exatamente 8 letras (mantive a mesma regra)
const validarSenha = s => /^[A-Za-z]{8}$/.test(norm(s));

async function sha256Hex(text) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,"0")).join("");
}

function toast(el, msg, tipo="error", ms=1800){
  if(!el) return;
  el.textContent = msg;
  el.className = `feedback-message ${tipo}`;
  el.style.display = "block";
  setTimeout(()=> el.style.display = "none", ms);
}

// ===== Elementos =====
const feedback   = document.getElementById("feedback-message");
const inputEmail = document.getElementById("email-reset");
const inputNova  = document.getElementById("nova-senha");
const inputConf  = document.getElementById("confirma-senha");
const btnConfirm = document.getElementById("btnConfirmarReset");

// ===== Fun��o de reset de senha =====
async function fazerResetSenha() {
  const email = norm(inputEmail.value);
  const nova  = norm(inputNova.value);
  const conf  = norm(inputConf.value);

  if (!isEmail(email)){
    toast(feedback, "Informe um e-mail v�lido.", "error"); 
    inputEmail.focus(); 
    return false;
  }
  if (!validarSenha(nova)){
    toast(feedback, "Senha deve ter exatamente 8 letras (A-Z).", "error"); 
    inputNova.focus(); 
    return false;
  }
  if (nova !== conf){
    toast(feedback, "As senhas n�o coincidem.", "error"); 
    inputConf.focus(); 
    return false;
  }

  // carrega base
  let usuarios = [];
  try { usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]"); } catch { usuarios = []; }

  // encontra pelo e-mail (case-insensitive)
  const idx = usuarios.findIndex(u => lower(u.email || "") === lower(email));
  if (idx < 0){
    toast(feedback, "E-mail n�o encontrado. Fa�a um cadastro primeiro.", "error", 2200);
    return false;
  }

  // grava nova senha como hash
  try {
    usuarios[idx].senhaHash = await sha256Hex(nova);
  } catch {
    usuarios[idx].senhaHash = "fallback_" + btoa(nova);
  }
  // (opcional) remove senha em texto puro caso exista
  delete usuarios[idx].senha;

  // salva
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  toast(feedback, "Senha redefinida com sucesso!", "success", 1400);
  setTimeout(() => { location.href = "pag-login.php?reset=ok"; }, 900);
  return true;
}

// ===== Eventos =====
// Bot�o de confirmar
btnConfirm?.addEventListener("click", async (e) => {
  e.preventDefault();
  await fazerResetSenha();
});

// Enter nos campos
inputEmail?.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    inputNova.focus();
  }
});

inputNova?.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    inputConf.focus();
  }
});

inputConf?.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    await fazerResetSenha();
  }
});
