// Captura o formulário de login
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Captura os dados do formulário
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validação simples dos campos
    if (!username || !password) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    // Cria o objeto de dados para enviar para a API
    const loginData = {
        username: username,
        password: password
    };

    // Faz a requisição para a API de login
    fetch('http://localhost:8080/player/login?username=' + username + '&password=' + password, {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json' // Pode ser necessário dependendo de como a API é configurada
        }
    })
    .then(response => {
        if (!response.ok) {
            // Se a resposta não for bem-sucedida, lança um erro
            throw new Error('Falha na autenticação. Verifique suas credenciais.');
        }
        return response.text(); // Se a resposta for ok, continua o processamento
    })
    .then(data => {
        if (data === "Login bem-sucedido!") {
            alert('Login bem-sucedido!');
            // Redireciona para a página de jogo
            window.location.href = 'pagina-jogo.html';  // Redireciona para pagina-jogo.html
        } else {
            alert('Credenciais inválidas.');
        }
    })
    .catch(error => {
        console.error('Erro no login:', error);
        alert('Erro ao tentar autenticar o usuário. Tente novamente mais tarde.');
    });
});
