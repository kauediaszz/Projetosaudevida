<?php
session_start();

// 🔒 BLOQUEIO: só permite abrir se estiver logado
if (!isset($_SESSION["usuario_login"])) {
  header("Location: pag-login.php?returnUrl=pag-agendamento.php");
  exit();
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="shortcut icon" href="img/favicon-16x16.png" type="image/x-icon" />
  <link rel="stylesheet" href="css/style-cadastro.css" />
  <title>Saúde & Vida</title>
</head>

<body>
  <!-- feedback flutuante -->
  <div id="feedback-message" class="feedback-message"></div>

  <div class="outer-container">
    <div class="main-cadastro">
      <h1>Agendamento de Consulta</h1>

      <div class="form-container">
        <form id="form-agendamento" method="POST" action="processa-agendamento.php">
          <div class="textfield">

            <div class="field full">
              <label for="nome-completo">Nome Completo:</label>
              <input type="text" id="nome-completo" name="nome-completo"
                     placeholder="Ex: Fernanda Lima Cardoso"
                     value="<?= htmlspecialchars($_SESSION['usuario_nome']) ?>"
                     required />
            </div>

            <div class="field full">
              <label for="responsavel">Nome do Responsável (caso menor de idade):</label>
              <input type="text" id="responsavel" name="responsavel" placeholder="Ex: João da Silva" />
            </div>

            <div class="field">
              <label for="data-nascimento">Data de Nascimento:</label>
              <input type="date" id="data-nascimento" name="data-nascimento" required />
            </div>

            <div class="field">
              <label for="sexo">Sexo:</label>
              <select id="sexo" name="sexo" required>
                <option value="" disabled selected>-- Selecione --</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
                <option value="Não Informar">Prefiro não informar</option>
              </select>
            </div>

            <div class="field">
              <label for="telefone">Telefone:</label>
              <input type="tel" id="telefone" name="telefone" placeholder="Ex: (21) 99999-9999" required />
            </div>

            <div class="field">
              <label for="email">E-mail:</label>
              <input type="email" id="email" name="email" placeholder="Ex: exemplo@email.com" required />
            </div>

            <div class="field">
              <label for="cpf">CPF:</label>
              <input type="text" id="cpf" name="cpf" placeholder="000.000.000-00" required />
            </div>

            <div class="field">
              <label for="especialidade">Especialidade:</label>
              <select id="especialidade" name="especialidade" required>
                <option value="" disabled selected>-- Selecione --</option>
                <option value="Clínico Geral">Clínico Geral</option>
                <option value="Dermatologia">Dermatologia</option>
                <option value="Pediatria">Pediatria</option>
                <option value="Ginecologia">Ginecologia</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div class="field full">
              <label for="horario">Data e Horário da Consulta:</label>
              <input type="datetime-local" id="horario" name="horario" required />
            </div>

          </div>

          <div class="botoes">
            <button type="submit" class="btn-cadastro">Agendar</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <script src="js/script-agendamento.js"></script>
</body>
</html>
