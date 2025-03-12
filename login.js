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
        const response = await fetch(`${API_URL}/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
        
        if (!response.ok) {
            throw new Error('Erro ao tentar fazer login.');
        }

        const message = await response.text(); // Corrigido para pegar string
        console.log("Resposta do backend:", message);

        if (message.includes("Login bem-sucedido")) {
            localStorage.setItem('username', username);
            window.location.href = 'tela-principal.html'; // Ajuste conforme sua estrutura
        } else {
            alert('Usuário ou senha incorretos.');
        }
    } catch (error) {
        console.error('Erro ao tentar logar:', error);
        alert('Erro de conexão.');
    }
}
