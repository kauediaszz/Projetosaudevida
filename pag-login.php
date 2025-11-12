<?php
session_start();
include("conexao.php");

// ----- Função de mensagem (toast) -----
function toast($mensagem, $tipo = 'error') {
    $classe = $tipo === 'success' ? 'success' : 'error';
    echo "<div class='feedback-message {$classe}'>{$mensagem}</div>";
}

// ----- Mensagem pós-reset de senha -----
if (isset($_GET['reset']) && $_GET['reset'] === 'ok') {
    toast("Senha alterada com sucesso! Faça login.", "success");
}

// ----- Preenchimento automático de login -----
$login_prefill = isset($_GET['login']) ? htmlspecialchars($_GET['login']) : "";

// ----- Processamento do login -----
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $login = trim($_POST['usuario'] ?? '');
    $senha = trim($_POST['senha'] ?? '');

    if (empty($login) || empty($senha)) {
        toast("Preencha usuário e senha.", "error");
    } else {
        // Verifica se o login existe no banco
        $sql = "SELECT * FROM usuarios WHERE login = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $login);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            toast("Conta não encontrada. Crie uma nova conta.", "error");
            echo "<meta http-equiv='refresh' content='2;url=pag-cadastro.php?novo=" . urlencode($login) . "'>";
        } else {
            $usuario = $result->fetch_assoc();
            if (password_verify($senha, $usuario['senha'])) {
                // Login OK — cria sessão e redireciona
                $_SESSION["usuario_id"] = $usuario["id"];
                $_SESSION["usuario_nome"] = $usuario["nome_completo"];
                $_SESSION["usuario_login"] = $usuario["login"];

                toast("Login realizado com sucesso!", "success");
                echo "<meta http-equiv='refresh' content='1.5;url=pag-agendamento.php'>";
            } else {
                toast("Usuário ou senha inválidos.", "error");
            }
        }
    }
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="shortcut icon" href="img/favicon-16x16.png" type="image/x-icon" />
  <link rel="stylesheet" href="css/style-login.css" />
  <title>Saúde & Vida - Login</title>

  <style>
    /* ----- Estilo das mensagens ----- */
    .feedback-message {
      position: relative;
      top: -20px;
      margin: 0 auto 20px auto;
      text-align: center;
      width: 90%;
      padding: 12px;
      border-radius: 8px;
      font-weight: bold;
      animation: fadeIn 0.5s ease;
    }
    .feedback-message.error {
      background-color: #ffb3b3;
      color: #a30000;
    }
    .feedback-message.success {
      background-color: #c1ffc1;
      color: #006400;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>

<body class="login">
  <div class="main-login">
    <div class="card-login card-split">

      <!-- LADO ESQUERDO -->
      <div class="card-side">
        <div class="logo">
          <img src="img/Logo-menu.png" alt="Logo Saúde e Vida" />
        </div>
        <p>Bem-vindo(a) ao site da nossa clínica</p>
      </div>

      <!-- LADO DIREITO -->
      <div class="card-form">
        <h1>LOGIN</h1>

        <!-- Mensagem de feedback fica acima do formulário -->
        <?php if (!empty($_POST) || isset($_GET['reset'])): ?>
          <div id="msgContainer"></div>
        <?php endif; ?>

        <form method="POST" action="">
          <div class="textfield">
            <label for="usuario">Usuário:</label>
            <input type="text" id="usuario" name="usuario" placeholder="Digite seu login"
                   value="<?= $login_prefill ?>" required />
          </div>

          <div class="textfield">
            <label for="senha">Senha:</label>
            <input type="password" id="senha" name="senha" placeholder="Digite sua senha" required />
          </div>

          <div class="remember-forgot">
            <a href="pag-resetar-senha.php">Esqueci a senha</a>
          </div>

          <button type="submit" class="btn-enviar">Entrar</button>

          <div class="register-link">
            <p>Não tem uma conta? 
              <a id="linkCadastro" href="pag-cadastro.php">Cadastre-se</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Script para ocultar mensagem automaticamente -->
  <script>
    const msg = document.querySelector('.feedback-message');
    if (msg) {
      setTimeout(() => {
        msg.style.opacity = '0';
        msg.style.transition = 'opacity 0.6s ease';
        setTimeout(() => msg.remove(), 600);
      }, 2000);
    }
  </script>
</body>
</html>
