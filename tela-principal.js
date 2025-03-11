const API_URL = 'http://localhost:8080'; // URL base da API
const searchPlayerInput = document.getElementById('searchPlayerInput');
const searchGameInput = document.getElementById('searchGameInput');
const searchPlayerResults = document.getElementById('searchPlayerResults');
const searchGameResults = document.getElementById('searchGameResults');
const followingList = document.getElementById('followingList');

// Função para buscar jogadores
async function searchPlayer() {
    const query = searchPlayerInput.value.trim();
    if (!query) {
        searchPlayerResults.innerHTML = ''; // Limpar resultados se não houver pesquisa
        return;
    }

    try {
        const response = await fetch(`${API_URL}/players/search?name=${query}`);
        const players = await response.json();

        if (players.length > 0) {
            displaySearchPlayerResults(players);
        } else {
            searchPlayerResults.innerHTML = '<p>Usuário não encontrado</p>';
        }
    } catch (error) {
        console.error('Erro ao buscar jogadores:', error);
        searchPlayerResults.innerHTML = '<p>Erro ao buscar jogadores</p>';
    }
}

// Exibe os resultados da pesquisa de jogadores
function displaySearchPlayerResults(players) {
    searchPlayerResults.innerHTML = '';
    players.forEach(player => {
        const playerItem = document.createElement('div');
        playerItem.classList.add('player-item');
        playerItem.innerHTML = `
            <p>${player.username}</p>
            <button onclick="followPlayer(${player.id})">Seguir</button>
        `;
        searchPlayerResults.appendChild(playerItem);
    });
}

// Função para seguir jogador
async function followPlayer(playerId) {
    try {
        const response = await fetch(`${API_URL}/players/follow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ playerId })
        });

        if (response.ok) {
            alert('Você começou a seguir o jogador!');
            loadFollowingList(); // Atualiza a lista de jogadores seguidos
        } else {
            alert('Erro ao seguir jogador');
        }
    } catch (error) {
        console.error('Erro ao seguir jogador:', error);
    }
}

// Função para carregar jogadores seguidos
async function loadFollowingList() {
    try {
        const response = await fetch(`${API_URL}/players/following`);
        const followedPlayers = await response.json();

        followingList.innerHTML = '';
        followedPlayers.forEach(player => {
            const playerItem = document.createElement('li');
            playerItem.textContent = player.username;
            followingList.appendChild(playerItem);
        });
    } catch (error) {
        console.error('Erro ao carregar jogadores seguidos:', error);
    }
}

// Carrega a lista de jogadores seguidos assim que a página é carregada
window.onload = loadFollowingList;

// Função para buscar jogos
async function searchGame() {
    const query = searchGameInput.value.trim();
    if (!query) {
        searchGameResults.innerHTML = ''; // Limpar resultados se não houver pesquisa
        return;
    }

    try {
        const response = await fetch(`${API_URL}/games/search?name=${query}`);
        const games = await response.json();

        if (games.length > 0) {
            displaySearchGameResults(games);
        } else {
            searchGameResults.innerHTML = '<p>Jogo não encontrado</p>';
        }
    } catch (error) {
        console.error('Erro ao buscar jogos:', error);
        searchGameResults.innerHTML = '<p>Erro ao buscar jogos</p>';
    }
}

// Exibe os resultados da pesquisa de jogos
function displaySearchGameResults(games) {
    searchGameResults.innerHTML = '';
    games.forEach(game => {
        const gameItem = document.createElement('div');
        gameItem.classList.add('game-item');
        gameItem.innerHTML = `
            <p>${game.name}</p>
            <button onclick="viewPlayersForGame(${game.id})">Ver jogadores</button>
        `;
        searchGameResults.appendChild(gameItem);
    });
}

// Função para ver jogadores que marcaram o jogo como favorito
async function viewPlayersForGame(gameId) {
    try {
        const response = await fetch(`${API_URL}/games/${gameId}/players`);
        const players = await response.json();

        if (players.length > 0) {
            alert(`Jogadores que escolheram o jogo: ${players.map(player => player.username).join(', ')}`);
        } else {
            alert('Nenhum jogador selecionou esse jogo');
        }
    } catch (error) {
        console.error('Erro ao buscar jogadores para o jogo:', error);
        alert('Erro ao buscar jogadores para o jogo');
    }
}

// Função de logout
function logout() {
    // Implementar lógica de logout aqui
    alert('Saindo...');
}
