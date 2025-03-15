const API_URL = 'http://localhost:8080/player';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', login);
});

async function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    try {
        const response = await fetch(`${API_URL}/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
            method: "GET",
            credentials: "include" // 🔥 Enables session cookies
        });

        const data = await response.text();

        if (response.ok && data.includes("bem-sucedido")) {
            alert("Login realizado com sucesso!");
            window.location.href = "tela-principal.html";
        } else {
            alert("Credenciais inválidas.");
        }
    } catch (error) {
        alert("Erro ao conectar com o servidor.");
    }
}
