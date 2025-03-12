const API_URL = 'http://localhost:8080/player';
const GAMES_API_URL = 'http://localhost:8080/games'; // API para buscar jogos

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) registerForm.addEventListener('submit', register);

    // Carregar os jogos disponíveis
    loadGames();
});

async function loadGames() {
    try {
        const response = await fetch(GAMES_API_URL);
        if (response.ok) {
            const games = await response.json();
            const selectElement = document.getElementById('favoriteGames');
            
            // Limpar as opções existentes
            selectElement.innerHTML = '';
            
            // Adicionar opções de jogos
            games.forEach(game => {
                const option = document.createElement('option');
                option.value = game.id;
                option.textContent = game.name;
                selectElement.appendChild(option);
            });
        } else {
            console.error('Erro ao carregar os jogos.');
        }
    } catch (error) {
        console.error('Erro de rede ao buscar os jogos:', error);
    }
}

async function register(event) {
    event.preventDefault();
    
    const data = {
        username: document.getElementById('regUsername').value,
        email: document.getElementById('email').value,
        password: document.getElementById('regPassword').value,
        location: document.getElementById('location').value,
        plataformType: document.getElementById('plataformType').value,
        gamingTimePreferences: document.getElementById('gamingTimePreferences').value.split(','),
        favoriteGames: Array.from(document.getElementById('favoriteGames').selectedOptions).map(option => ({
            id: option.value  // **Ajustado para enviar um objeto, se necessário**
        }))
    };

    try {
        const response = await fetch(`${API_URL}/cadastrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'index.html'; // Redirecionar após o cadastro
        } else {
            if (response.status === 409) {
                alert('Este email já está registrado.');
            } else {
                alert('Erro ao cadastrar. Tente novamente.');
            }
        }
    } catch (error) {
        console.error('Erro ao realizar cadastro:', error);
        alert('Erro de conexão. Tente novamente.');
    }
}
