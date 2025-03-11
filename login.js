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
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
            throw new Error("Erro ao tentar logar.");
        }

        const data = await response.json();
        
        if (data.message && data.message.includes("bem-sucedido")) {
            alert("Login realizado com sucesso!");
            localStorage.setItem("username", username);
            window.location.href = "tela-principal.html";
        } else {
            alert("Credenciais inválidas.");
        }
    } catch (error) {
        alert(error.message);
    }
}
