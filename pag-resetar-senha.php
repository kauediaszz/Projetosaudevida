<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <link rel="shortcut icon" href="img/favicon-16x16.png" type="image/x-icon" />
  <!-- Reusa o mesmo CSS da tela de login/verificação -->
  <link rel="stylesheet" href="css/style-login.css" />
  <title>Esqueci a Senha — Saúde & Vida</title>
  <style>
    /* Deixa o formulário mais compacto para esta página */
    .card-form { padding-top: 70px; }
    .card-form h1 { top: 24px; }
    .textfield.compacto input { max-width: 420px; }
    .btn-enviar { margin-top: 12px; }
    .register-link { margin-top: 6px; }
  </style>
</head>
<body class="login">
  <div class="main-login">
    <div class="card-login card-split">
      <!-- Lado esquerdo -->
      <div class="card-side">
        <div class="logo">
          <img src="img/Logo-menu.png" alt="Logo Saúde e Vida" />
        </div>
        <p>Vamos te ajudar a redefinir sua senha</p>
      </div>

      <!-- Lado direito -->
      <div class="card-form">
        <h1>ESQUECI A SENHA</h1>

        <div id="feedback-message" class="feedback-message"></div>

        <div class="textfield compacto">
          <label for="email-reset">E-mail cadastrado:</label>
          <input type="email" id="email-reset" placeholder="seu@email.com" />
        </div>

        <div class="textfield compacto">
          <label for="nova-senha">Nova senha (8 letras):</label>
          <input type="password" id="nova-senha" placeholder="Ex: abcdefgh" />
        </div>

        <div class="textfield compacto">
          <label for="confirma-senha">Confirmar nova senha:</label>
          <input type="password" id="confirma-senha" placeholder="Repita a senha" />
        </div>

        <button id="btnConfirmarReset" class="btn-enviar">Confirmar</button>

        <div class="register-link">
          <p>Lembrou a senha? <a href="pag-login.php">Voltar ao login</a></p>
        </div>
      </div>
    </div>
  </div>

  <script src="js/script-resetar-senha.js"></script>
</body>
</html>
