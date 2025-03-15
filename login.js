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
        const response = await fetch(`${API_URL}/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
            method: "GET"
        });

        const data = await response.text(); // Seu backend retorna apenas um texto (String)

        if (data.includes("bem-sucedido")) {
            alert("Login realizado com sucesso!");
            window.location.href = "tela-principal.html";
        } else {
            alert("Credenciais inválidas.");
        }
    } catch (error) {
        alert("Erro ao conectar com o servidor.");
    }
}
