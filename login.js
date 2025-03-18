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

            // Buscar os dados do usuário após o login
            return fetch(`http://localhost:8080/username/${encodeURIComponent(username)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            throw new Error('Credenciais inválidas.');
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar dados do usuário.');
        }
        return response.json();
    })
    .then(userData => {
        console.log('Dados do usuário:', userData);

        // Salvar os dados no sessionStorage para usar na próxima página
        sessionStorage.setItem('user', JSON.stringify(userData));

        // Redirecionar para a página do jogo
        window.location.href = 'tela-principal.html';
    })
    .catch(error => {
        console.error('Erro no login:', error);
        alert(error.message);
    });
});
