<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <link rel="shortcut icon" href="img/favicon-16x16.png" type="image/x-icon" />
  <link rel="stylesheet" href="css/style-login.css" />
  <title>Verificação de E-mail — Saúde & Vida</title>
</head>
<body class="login">
  <div class="main-login">
    <div class="card-login card-split">
      
      <!-- Lado esquerdo -->
      <div class="card-side">
        <div class="logo">
          <img src="img/Logo-menu.png" alt="Logo Saúde e Vida" />
        </div>
        <p>Confirme seu e-mail para concluir o cadastro</p>
      </div>

      <!-- Lado direito -->
      <div class="card-form">
        <h1>VERIFICAÇÃO</h1>

        <div id="feedback-message" class="feedback-message"></div>

        <div class="textfield">
          <label for="email-verificacao">E-mail cadastrado:</label>
          <input type="email" id="email-verificacao" placeholder="seu@email.com"/>
          <button id="btnEnviarCodigo" class="btn-enviar btn-codigo">Enviar código</button>
        </div>

        <div class="textfield">
          <label for="codigo">Código recebido:</label>
          <input type="text" id="codigo" placeholder="Digite o código"/>
        </div>

        <div class="remember-forgot" id="aviso-2fa"></div>

        <button id="btnConfirmar" class="btn-enviar">Confirmar</button>

        <div class="register-link">
          <p>Já confirmou antes? <a id="irLogin" href="pag-login.php">Ir para o login</a></p>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>
 <!-- Configurações do EmailJS -->
  <script>
    window.EMAILJS_PUBLIC_KEY = "8Uw6P1YAI82JnT7Kd";
    window.EMAILJS_SERVICE_ID = "service_dsy053g";
    window.EMAILJS_TEMPLATE_ID = "template_1pyc24p";
  </script>
  <script src="js/script-verificacao.js"></script>
</body>
</html>
