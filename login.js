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

    console.log('Tentando login com:', { username, password });

    // Faz a requisição para a API de login
    fetch(`http://localhost:8080/player/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha na autenticação. Verifique suas credenciais.');
        }
        return response.text();
    })
    .then(data => {
        if (data === "Login bem-sucedido!") {
            console.log('Usuário autenticado:', { username, password });
            alert('Login bem-sucedido!');
            window.location.href = 'pagina-jogo.html';
        } else {
            alert('Credenciais inválidas.');
        }
    })
    .catch(error => {
        console.error('Erro no login:', error);
        alert('Erro ao tentar autenticar o usuário. Tente novamente mais tarde.');
    });
});
