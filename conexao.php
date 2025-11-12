<?php
$servername = "localhost";  // Servidor (localhost no XAMPP)
$username = "root";         // Usuário padrão do MySQL no XAMPP
$password = "";             // Senha (geralmente vazia no XAMPP)
$dbname = "saudevida";      // Nome do seu banco de dados (mude se for outro)

// Criar a conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar se deu erro
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

// Opcional: define charset para evitar problemas com acentos
$conn->set_charset("utf8");
?>
