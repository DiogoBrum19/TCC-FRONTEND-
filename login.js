const API_URL = 'http://localhost:8080/player';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', login);
});

async function login(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include' // Permite que cookies/sessões sejam usados pelo backend
        });

        if (!response.ok) {
            throw new Error('Erro ao tentar fazer login.');
        }

        const data = await response.json(); // Supondo que o backend retorna um JSON com status e mensagem
        console.log("Resposta do backend:", data);

        if (data.success) {
            window.location.href = 'tela-principal.html'; // Ajuste conforme sua estrutura
        } else {
            alert('Usuário ou senha incorretos.');
        }
    } catch (error) {
        console.error('Erro ao tentar logar:', error);
        alert('Erro de conexão.');
    }
}
