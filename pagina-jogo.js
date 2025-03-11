// pagina-jogo.js
const gameTitle = document.getElementById('gameTitle');
const usersList = document.getElementById('usersList');
const gameId = new URLSearchParams(window.location.search).get('gameId');
const API_URL = `http://localhost:8080/games/${gameId}/users`; // URL da API para buscar os usuários

async function loadGamePage() {
    const response = await fetch(`http://localhost:8080/games/${gameId}`);
    const game = await response.json();
    gameTitle.textContent = game.name;
    
    const usersResponse = await fetch(API_URL);
    const users = await usersResponse.json();
    
    displayUsers(users);
}

// Exibir a lista de usuários
function displayUsers(users) {
    usersList.innerHTML = '';
    
    if (users.length === 0) {
        usersList.innerHTML = '<li>Nenhum usuário encontrado.</li>';
        return;
    }

    users.forEach(user => {
        const listItem = document.createElement('li');
        listItem.textContent = user.username;
        usersList.appendChild(listItem);
    });
}

// Chama a função para carregar os dados da página do jogo
loadGamePage();
