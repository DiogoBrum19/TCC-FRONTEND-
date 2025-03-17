// Captura o formulário de login
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Captura os dados do formulário
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Cria o objeto de dados para enviar para a API
    const loginData = {
        username: username,
        password: password
    };

    // Faz a requisição para a API de login
    fetch('http://localhost:8080/player/login?username=' + username + '&password=' + password, {
        method: 'GET', // Ou 'POST' dependendo de como você configurar seu backend
        headers: {
            'Content-Type': 'application/json' // Pode ser necessário dependendo de como a API é configurada
        }
    })
    .then(response => response.text()) // Aqui, se a resposta for uma simples string
    .then(data => {
        if (data === "Login bem-sucedido!") {
            alert('Login bem-sucedido!');
            
            // Redireciona para a página de jogo após o login bem-sucedido
            window.location.href = 'pagina-jogo.html';  // Redireciona para pagina-jogo.html
        } else {
            alert('Credenciais inválidas.');
        }
    })
    .catch(error => {
        console.error('Erro no login:', error);
        alert('Erro ao tentar autenticar o usuário.');
    });
});
