document.addEventListener('DOMContentLoaded', async function () {
    const searchGameInput = document.getElementById('searchGameInput');
    const searchGameResults = document.getElementById('searchGameResults');

    const searchPlayerInput = document.getElementById('searchPlayerInput');
    const searchPlayerResults = document.getElementById('searchPlayerResults');

    // Seção para mostrar os jogadores que você está seguindo
    const followingList = document.getElementById('followingList'); // Nova seção para mostrar jogadores seguidos

    let allPlayers = [];
    let currentUsername = "";

    // Buscar usuário logado
    async function getLoggedUser() {
        try {
            const storedUsername = localStorage.getItem("username");
            if (!storedUsername) throw new Error("Usuário não autenticado");

            const response = await fetch(`http://localhost:8080/player/username/${storedUsername}`);
            if (!response.ok) throw new Error("Erro ao obter usuário logado");

            const userData = await response.json();
            currentUsername = userData.username;
        } catch (error) {
            console.error("Erro ao buscar usuário logado:", error);
        }
    }

    await getLoggedUser();

    // Buscar todos os jogadores (usaremos para filtrar localmente)
    async function fetchAllPlayers() {
        try {
            const response = await fetch("http://localhost:8080/player");
            if (!response.ok) throw new Error("Erro ao buscar jogadores");

            allPlayers = await response.json();
        } catch (error) {
            console.error("Erro ao carregar jogadores:", error);
        }
    }

    await fetchAllPlayers();

    // Função para exibir os jogadores que você está seguindo
    function displayFollowing(following) {
        followingList.innerHTML = ''; // Limpa a lista antes de adicionar

        if (following.length === 0) {
            followingList.innerHTML = '<p>Você não está seguindo nenhum jogador.</p>';
            return;
        }

        following.forEach(player => {
            const playerCard = document.createElement('div');
            playerCard.classList.add('player-card');
            playerCard.innerHTML = `
            <h4>${player.username}</h4>
            <button onclick="unfollowPlayer('${player.username}')">Deixar de Seguir</button>
        `;
            followingList.appendChild(playerCard);
        });
    }

    // Buscar jogadores seguidos
    async function fetchFollowing() {
        if (!currentUsername) return;

        try {
            const response = await fetch(`http://localhost:8080/follow/${currentUsername}`); // Supondo que o endpoint /follow/{username} retorne os seguidos
            if (!response.ok) throw new Error("Erro ao buscar jogadores seguidos");

            const following = await response.json();
            displayFollowing(following);
        } catch (error) {
            console.error("Erro ao buscar jogadores seguidos:", error);
        }
    }

    // Chama a função para carregar os jogadores que o usuário está seguindo
    await fetchFollowing();

    // 🔍 Função para pesquisar jogadores por nome (agora filtra localmente)
    function searchPlayer() {
        const playerName = searchPlayerInput.value.trim().toLowerCase();

        if (playerName === '') {
            searchPlayerResults.innerHTML = '';
            return;
        }

        const filteredPlayers = allPlayers.filter(player =>
            player.username.toLowerCase().includes(playerName)
        );

        displayPlayers(filteredPlayers);
    }

    function displayPlayers(players) {
        searchPlayerResults.innerHTML = "";
        players.forEach(player => {
            if (player.username === currentUsername) return; // Evita mostrar o próprio usuário

            const playerCard = document.createElement("div");
            playerCard.classList.add("player-card");

            playerCard.innerHTML = `
                <h3>${player.username}</h3>
                <p>Plataforma: ${player.platform}</p>
                <p>País: ${player.country}</p>
                <button class="follow-btn" data-username="${player.username}">Seguir</button>
            `;

            searchPlayerResults.appendChild(playerCard);
        });

        document.querySelectorAll(".follow-btn").forEach(button => {
            button.addEventListener("click", function () {
                followPlayer(button.dataset.username);
            });
        });
    }

    // 🔍 Função para pesquisar jogadores por jogo favorito (mantém a busca na API)
    function searchGame() {
        const gameName = searchGameInput.value.trim();

        if (gameName === '') {
            searchGameResults.innerHTML = '';
            return;
        }

        fetch(`http://localhost:8080/matchmaking/filtrar?game=${encodeURIComponent(gameName)}`)
            .then(response => response.json())
            .then(players => {
                searchGameResults.innerHTML = '';

                if (players.length === 0) {
                    searchGameResults.innerHTML = '<p>Nenhum jogador encontrado para este jogo.</p>';
                    return;
                }

                players.forEach(player => {
                    const playerElement = document.createElement('div');
                    playerElement.classList.add('player-card');
                    playerElement.innerHTML = `
                        <h3>${player.username}</h3>
                        <p>Plataforma: ${player.platform}</p>
                        <p>País: ${player.country}</p>
                    `;
                    searchGameResults.appendChild(playerElement);
                });
            })
            .catch(error => {
                console.error('Erro ao buscar jogadores:', error);
                searchGameResults.innerHTML = '<p>Erro ao buscar jogadores. Tente novamente.</p>';
            });
    }

    // Seguir jogador
    async function followPlayer(playerToFollowName) {
        if (!currentUsername) {
            alert("Erro: Usuário não autenticado.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/follow/${currentUsername}?playerToFollowName=${playerToFollowName}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Erro ao seguir jogador");

            alert(`Agora você está seguindo ${playerToFollowName}!`);
        } catch (error) {
            console.error("Erro ao seguir jogador:", error);
        }
    }

    // Logout
    function logout() {
        localStorage.removeItem("username");
        window.location.href = 'login.html';
    }

    // Tornar funções acessíveis globalmente
    window.searchGame = searchGame;
    window.searchPlayer = searchPlayer;
    window.logout = logout;
});
