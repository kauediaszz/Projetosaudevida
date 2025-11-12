<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="shortcut icon" href="img/favicon-16x16.png" type="image/x-icon" />
  <link rel="stylesheet" href="css/style-login.css" />
  <title>Saúde & Vida</title>
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

        <div class="form-fields">
          <!-- Feedback -->
          <div id="feedback-message" class="feedback-message"></div>

          <!-- Usuário -->
          <div class="textfield">
            <label for="usuario">Usuário:</label>
            <input type="text" id="usuario" name="usuario" placeholder="Digite seu login" />
          </div>

          <!-- Senha -->
          <div class="textfield">
            <label for="senha">Senha:</label>
            <input type="password" id="senha" name="senha" placeholder="Digite sua senha" />
          </div>

          <!-- Opção -->
          <div class="remember-forgot"><a href="pag-resetar-senha.php">Esqueci a senha</a>
          </div>

          <!-- Botão -->
          <button id="enviar" class="btn-enviar">Entrar</button>

          <!-- Link de cadastro -->
          <div class="register-link">
            <p>Não tem uma conta? <a id="linkCadastro" href="pag-cadastro.php">Cadastre-se</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script src="js/script-login.js"></script>
</body>
</html>

