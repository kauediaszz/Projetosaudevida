<?php
include("conexao.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Recebe os dados do formulário
    $nome_completo = $_POST['nome_completo'];
    $nome_materno = $_POST['nome_materno'];
    $data_nascimento = $_POST['data_nascimento'];
    $sexo = $_POST['sexo'];
    $cpf = $_POST['cpf'];
    $celular = $_POST['celular'];
    $telefone = $_POST['telefone'];
    $email = $_POST['email'];
    $cep = $_POST['cep'];
    $logradouro = $_POST['logradouro'];
    $numero_casa = $_POST['numero_casa'];
    $bairro = $_POST['bairro'];
    $complemento = $_POST['complemento'];
    $cidade = $_POST['cidade'];
    $estado = $_POST['estado'];
    $login = $_POST['login'];
    $senha = $_POST['senha'];
    $confirmar_senha = $_POST['confirmar_senha'];

    // Verifica se as senhas coincidem
    if ($senha !== $confirmar_senha) {
        echo "<script>alert('As senhas não conferem!'); window.history.back();</script>";
        exit;
    }

    // Criptografa a senha antes de salvar
    $senha_cripto = password_hash($senha, PASSWORD_DEFAULT);

    // Prepara o comando SQL
    $sql = "INSERT INTO usuarios (
                nome_completo, nome_materno, data_nascimento, sexo, cpf, celular, telefone, email,
                cep, logradouro, numero_casa, bairro, complemento, cidade, estado, login, senha
            ) VALUES (
                '$nome_completo', '$nome_materno', '$data_nascimento', '$sexo', '$cpf', '$celular', '$telefone', '$email',
                '$cep', '$logradouro', '$numero_casa', '$bairro', '$complemento', '$cidade', '$estado', '$login', '$senha_cripto'
            )";

    // Executa o insert
    if ($conn->query($sql) === TRUE) {
        echo "<script>alert('Usuário cadastrado com sucesso!'); window.location='pag-login.php';</script>";
    } else {
        echo "<script>alert('Erro ao cadastrar: " . $conn->error . "');</script>";
    }
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="img/favicon-16x16.png" type="image/x-icon">
    <link rel="stylesheet" href="css/style-cadastro.css">
    <title>Saúde & Vida - Cadastro</title>
</head>

<body>
    <div id="feedback-message" class="feedback-message"></div>

    <div class="outer-container">
        <div class="main-cadastro">
            <h1>CADASTRO</h1>
            <div class="form-container">
                <form id="form-cadastro" action="pag-cadastro.php" method="POST">
                    <div class="textfield">

                        <div class="field full">
                            <label for="nome_completo">Nome Completo:</label>
                            <input type="text" id="nome_completo" name="nome_completo" placeholder="Ex: Fernanda da Silva Lima" required>
                        </div>

                        <div class="field full">
                            <label for="nome_materno">Nome Materno Completo:</label>
                            <input type="text" id="nome_materno" name="nome_materno" placeholder="Ex: Maria da Silva Lima" required>
                        </div>

                        <div class="field">
                            <label for="data_nascimento">Data de Nascimento:</label>
                            <input type="date" id="data_nascimento" name="data_nascimento" required>
                        </div>

                        <div class="field">
                            <label for="sexo">Sexo:</label>
                            <select id="sexo" name="sexo" required>
                                <option value="">-- Selecione --</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>

                        <div class="field">
                            <label for="cpf">CPF:</label>
                            <input type="text" id="cpf" name="cpf" placeholder="Ex: 000.000.000-00" required>
                        </div>

                        <div class="field">
                            <label for="celular">Celular:</label>
                            <input type="text" id="celular" name="celular" placeholder="Ex: (+55)DD-XXXXXXXX" required>
                        </div>

                        <div class="field">
                            <label for="telefone">Telefone Fixo:</label>
                            <input type="text" id="telefone" name="telefone" placeholder="Ex: (+55)DD-XXXXXXXX">
                        </div>

                        <div class="field">
                            <label for="email">E-mail:</label>
                            <input type="email" id="email" name="email" placeholder="Ex: exemplo@email.com" required>
                        </div>

                        <div class="field full">
                            <label for="cep">CEP:</label>
                            <input type="text" id="cep" name="cep" placeholder="Ex: 22041-001" required>
                        </div>

                        <div class="field">
                            <label for="logradouro">Logradouro:</label>
                            <input type="text" id="logradouro" name="logradouro" placeholder="Ex: Rua das Flores" required>
                        </div>

                        <div class="field">
                            <label for="numero_casa">N°:</label>
                            <input type="text" id="numero_casa" name="numero_casa" placeholder="Ex: 123" required>
                        </div>

                        <div class="field">
                            <label for="bairro">Bairro:</label>
                            <input type="text" id="bairro" name="bairro" placeholder="Ex: Copacabana" required>
                        </div>

                        <div class="field">
                            <label for="complemento">Complemento:</label>
                            <input type="text" id="complemento" name="complemento" placeholder="Ex: Apt 45">
                        </div>

                        <div class="field">
                            <label for="cidade">Cidade:</label>
                            <input type="text" id="cidade" name="cidade" placeholder="Ex: Rio de Janeiro" required>
                        </div>

                        <div class="field">
                            <label for="estado">Estado:</label>
                            <input type="text" id="estado" name="estado" placeholder="Ex: Rio de Janeiro" required>
                        </div>

                        <div class="field full">
                            <label for="login">Login:</label>
                            <input type="text" id="login" name="login" placeholder="Ex: Nandaa" required>
                        </div>

                        <div class="field">
                            <label for="senha">Senha:</label>
                            <input type="password" id="senha" name="senha" placeholder="Ex: abcdefgh" required>
                        </div>

                        <div class="field">
                            <label for="confirmar_senha">Confirmar Senha:</label>
                            <input type="password" id="confirmar_senha" name="confirmar_senha" placeholder="Ex: abcdefgh" required>
                        </div>

                    </div>

                    <div class="botoes">
                        <button type="submit" class="btn-cadastro">Cadastrar</button>
                        <button type="reset" id="btn-limpar" class="btn-cadastro">Limpar Tudo</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="js/script-cadastro.js"></script>
</body>
</html>
