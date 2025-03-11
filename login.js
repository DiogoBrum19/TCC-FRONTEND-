const API_URL = 'http://localhost:8080/player';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', login);
});

async function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const response = await fetch(`${API_URL}/login?username=${username}&password=${password}`);
    const message = await response.text();
    
    if (message.includes('bem-sucedido')) {
        alert('Login realizado com sucesso!');
        localStorage.setItem('username', username);
        window.location.href = 'players.html';
    } else {
        alert('Credenciais inválidas.');
    }
}