<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="img/favicon-16x16.png" type="image/x-icon">
    <link rel="stylesheet" href="css/style-cadastro.css">
    <title>Saúde & Vida</title>
</head>

<body>

    <!-- Container para exibir mensagens de feedback -->
    <div id="feedback-message" class="feedback-message"></div>
    
    <div class="outer-container">
        <div class="main-cadastro">
            <h1>CADASTRO</h1>
            <div class="form-container">
                <form id="form-cadastro">
                    <div class="textfield">
                        
                        <div class="field full">
                            <label for="usuario">Nome Completo:</label>
                            <input type="text" id="nome-completo" name="nome-completo" placeholder="Ex: Fernanda da Silva Lima" required>
                        </div>

                        <div class="field full">
                            <label for="usuario">Nome Materno Completo:</label>
                            <input type="text" id="nome-materno" name="nome-materno" placeholder="Ex: Maria da Silva lima" required>
                        </div>
                    
                        <div  class="field">
                            <label for="data_nascimento">Data de nascimento:</label>
                            <input type="date" id="data_nascimento" name="data_nascimento" required>
                        </div>

                        <div  class="field">
                            <label for="sexo">Sexo:</label>
                            <select id="sexo" required>
                                <option value="">-- Selecione --</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                    
                        
                        <div  class="field">
                            <label for="senha">CPF:</label>
                            <input type="text" id="cpf" name="cpf" placeholder="Ex: 000.000.000-00" required>
                        </div>
                        
                        <div  class="field">
                            <label for="celular">Celular:</label>
                            <input type="text" id="celular" name="celular" placeholder="Ex: (+55)DD-XXXXXXXX" required>
                        </div>

                        <div  class="field">
                            <label for="Telefone">Telefone Fixo:</label>
                            <input type="text" id="telefone" name="telefone" placeholder="Ex: (+55)DD-XXXXXXXX" required>
                        </div>
                        
                        <div  class="field">
                            <label for="E-mail">E-mail:</label>
                            <input type="email" id="email" name="email" placeholder="Ex: exemplo@email.com" required>
                        </div>

                        <div class="field full">
                            <label for="cep">Cep:</label>
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
                            <input type="text" id="bairro" name="bairro" placeholder="Copacabana" required>
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
                        
                        <div  class="field full">
                            <label for="login">Login:</label>
                            <input type="text" id="login" name="login" placeholder="Ex: Nandaa" required>
                        </div>
                        
                        <div  class="field">
                            <label for="senha">Senha:</label>
                            <input type="password" id="senha" name="senha" placeholder="Ex: abcdefgh"  required>
                        </div>
                        
                        <div  class="field">
                            <label for="confirmar_senha">Confirmar Senha:</label>
                            <input type="password" id="confirmar_senha" name="confirmar_senha" placeholder="Ex: abcdefgh" required>
                        </div>
                    
                    </div >
                    <div class="botoes">
                            <button type="submit" class="btn-cadastro">Cadastrar</button>
                            <button type="button" id="btn-limpar" class="btn-cadastro">Limpar Tudo</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="js/script-cadastro.js"></script>
</body>
</html>
