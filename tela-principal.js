document.addEventListener('DOMContentLoaded', async function () {
    const searchGameInput = document.getElementById('searchGameInput');
    const searchGameResults = document.getElementById('searchGameResults');

    const searchPlayerInput = document.getElementById('searchPlayerInput');
    const searchPlayerResults = document.getElementById('searchPlayerResults');

    const followingList = document.getElementById('followingList');
    let allPlayers = [];
    let currentUsername = "";

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

    async function fetchAllPlayers() {
        try {
            if (allPlayers.length > 0) return; // Não faz sentido carregar novamente

            const response = await fetch("http://localhost:8080/player");
            if (!response.ok) throw new Error("Erro ao buscar jogadores");

            allPlayers = await response.json();
        } catch (error) {
            console.error("Erro ao carregar jogadores:", error);
        }
    }

    await fetchAllPlayers();

    function displayFollowing(following) {
        followingList.innerHTML = '';
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

    async function fetchFollowing() {
        if (!currentUsername) return;
        try {
            const response = await fetch(`http://localhost:8080/follow/${currentUsername}`);
            if (!response.ok) throw new Error("Erro ao buscar jogadores seguidos");

            const following = await response.json();
            displayFollowing(following);
        } catch (error) {
            console.error("Erro ao buscar jogadores seguidos:", error);
        }
    }

    await fetchFollowing();

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
            if (player.username === currentUsername) return;

            const playerCard = document.createElement("div");
            playerCard.classList.add("player-card");

            // Verifica se o jogador já está sendo seguido
            const isFollowing = allPlayers.some(p => p.username === currentUsername && p.following && p.following.includes(player.username));

            playerCard.innerHTML = `
                <h3 onclick="redirectToPlayerProfile('${player.username}')">${player.username}</h3>
                <p>Plataforma: ${player.platform}</p>
                <p>País: ${player.country}</p>
                ${isFollowing ? '' : `<button class="follow-btn" data-username="${player.username}">Seguir</button>`} 
            `;

            searchPlayerResults.appendChild(playerCard);
        });

        document.querySelectorAll(".follow-btn").forEach(button => {
            button.addEventListener("click", function () {
                followPlayer(button.dataset.username);
            });
        });
    }

    function searchGame() {
        const gameName = searchGameInput.value.trim();

        if (gameName === '') {
            searchGameResults.innerHTML = '';
            return;
        }

        searchGameResults.innerHTML = '<p>Carregando...</p>';

        fetch(`http://localhost:8080/matchmaking/filtrar?game=${encodeURIComponent(gameName)}`)
            .then(response => response.json())
            .then(players => {
                searchGameResults.innerHTML = '';

                if (players.length === 0) {
                    searchGameResults.innerHTML = '<p>Nenhum jogador encontrado para este jogo.</p>';
                    return;
                }

                players.forEach(player => {
                    const playerCard = document.createElement('div');
                    playerCard.classList.add('player-card');

                    // Verifica se o jogador já está sendo seguido
                    const isFollowing = allPlayers.some(p => p.username === currentUsername && p.following && p.following.includes(player.username));

                    playerCard.innerHTML = `
                        <h3 onclick="redirectToPlayerProfile('${player.username}')">${player.username}</h3>
                        <p>Plataforma: ${player.platform}</p>
                        <p>País: ${player.country}</p>
                        ${isFollowing ? '' : `<button class="follow-btn" data-username="${player.username}">Seguir</button>`} 
                    `;

                    searchGameResults.appendChild(playerCard);
                });

                document.querySelectorAll(".follow-btn").forEach(button => {
                    button.addEventListener("click", function () {
                        followPlayer(button.dataset.username);
                    });
                });
            })
            .catch(error => {
                console.error('Erro ao buscar jogadores:', error);
                searchGameResults.innerHTML = '<p>Erro ao buscar jogadores. Tente novamente.</p>';
            });
    }

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
            fetchFollowing(); // Atualiza a lista de seguidos após seguir o jogador
        } catch (error) {
            console.error("Erro ao seguir jogador:", error);
        }
    }

    // Função para deixar de seguir um jogador
    async function unfollowPlayer(playerToUnfollowName) {
        if (!currentUsername) {
            alert("Erro: Usuário não autenticado.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/follow/${currentUsername}?playerToUnfollowName=${playerToUnfollowName}`, {
                method: "DELETE", // Usando DELETE para remover o seguimento
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Erro ao deixar de seguir jogador");

            alert(`Você deixou de seguir ${playerToUnfollowName}!`);
            fetchFollowing(); // Atualiza a lista de jogadores seguidos
        } catch (error) {
            console.error("Erro ao deixar de seguir jogador:", error);
        }
    }

    function logout() {
        localStorage.removeItem("username");
        window.location.href = 'login.html';
    }
// Função de redirecionamento para o perfil do jogador
    function redirectToPlayerProfile(username) {
        window.location.href = `player-profile.html?username=${encodeURIComponent(username)}`;
    }

    window.searchGame = searchGame;
    window.searchPlayer = searchPlayer;
    window.logout = logout;
});
