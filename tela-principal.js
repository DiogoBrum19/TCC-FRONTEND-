document.addEventListener('DOMContentLoaded', async function () {
    const searchGameInput = document.getElementById('searchGameInput');
    const searchGameResults = document.getElementById('searchGameResults');
    const searchPlayerInput = document.getElementById('searchPlayerInput');
    const searchPlayerResults = document.getElementById('searchPlayerResults');
    const followingList = document.getElementById('followingList');
    let allPlayers = [];
    let currentUsername = "";
    let currentUserId = "";  // Variável para armazenar o ID do usuário

    function checkUserLoggedIn() {
        const userData = sessionStorage.getItem('user');
        if (!userData) {
            alert('Você precisa fazer login para acessar esta página!');
            window.location.href = 'index.html';
            return false;
        }
        const parsedUser = JSON.parse(userData);
        currentUsername = parsedUser.username;
        currentUserId = parsedUser.id;
        return true;
    }

    if (!checkUserLoggedIn()) return;

    async function fetchAllPlayers() {
        try {
            if (allPlayers.length > 0) return;
            const response = await fetch("http://localhost:8080/player");
            if (!response.ok) throw new Error("Erro ao buscar jogadores");
            allPlayers = await response.json();
        } catch (error) {
            console.error("Erro ao carregar jogadores:", error);
        }
    }

    await fetchAllPlayers();

    // Função para buscar as informações detalhadas do jogador
    async function fetchPlayerData(username) {
        try {
            const response = await fetch(`http://localhost:8080/player/${username}`);
            if (!response.ok) throw new Error("Erro ao buscar dados do jogador");
            const playerData = await response.json();
            return playerData;
        } catch (error) {
            console.error('Erro ao buscar dados do jogador:', error);
            return null;
        }
    }

    function displayFollowing(following) {
        followingList.innerHTML = '';
        if (following.length === 0) {
            followingList.innerHTML = '<p>Você não está seguindo nenhum jogador.</p>';
            return;
        }
        following.forEach(player => {
            const playerCard = document.createElement('div');
            playerCard.classList.add('player-card');
            
            // Buscando os dados do jogador seguido para exibir
            const followedPlayer = allPlayers.find(p => p.username === player);
    
            // Exibe as informações de plataforma e jogos favoritos
            const platformText = followedPlayer ? followedPlayer.platform : 'Desconhecido';
            const favoriteGamesText = followedPlayer && followedPlayer.favoriteGames.length > 0 
                ? followedPlayer.favoriteGames.map(game => game.name).join(', ') 
                : 'Nenhum jogo favorito';
    
            playerCard.innerHTML = `
                <h4><a href="player-profile.html?username=${encodeURIComponent(player)}">${player}</a></h4>
                <p>Plataforma: ${platformText}</p>
                <p>Jogos Favoritos: ${favoriteGamesText}</p>
                <button onclick="unfollowPlayer('${player}')">Deixar de Seguir</button>
            `;
            followingList.appendChild(playerCard);
        });
    }
    

    async function fetchFollowing() {
        if (!currentUserId) return;
        try {
            const response = await fetch(`http://localhost:8080/follow/${currentUserId}/following`);
            if (!response.ok) throw new Error("Erro ao buscar jogadores seguidos");
            const following = await response.json();
            displayFollowing(following);
        } catch (error) {
            console.error("Erro ao buscar jogadores seguidos:", error);
        }
    }

    await fetchFollowing();

    async function unfollowPlayer(playerToUnfollowName) {
        if (!currentUsername) {
            alert("Erro: Usuário não autenticado.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/unfollow/${currentUsername}?playerToUnfollowName=${playerToUnfollowName}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) throw new Error("Erro ao deixar de seguir jogador");

            alert(`Você deixou de seguir ${playerToUnfollowName}!`);
            fetchFollowing();
        } catch (error) {
            console.error("Erro ao deixar de seguir jogador:", error);
        }
    }

    window.unfollowPlayer = unfollowPlayer;

    window.searchPlayer = function searchPlayer() {
        const playerName = searchPlayerInput.value.trim().toLowerCase();
        if (playerName === '') {
            searchPlayerResults.innerHTML = '';
            return;
        }
        const filteredPlayers = allPlayers.filter(player =>
            player.username.toLowerCase().includes(playerName)
        );
        displayPlayers(filteredPlayers);
    };

    function displayPlayers(players) {
        searchPlayerResults.innerHTML = "";
        players.forEach(player => {
            if (player.username === currentUsername) return;
            const playerCard = document.createElement("div");
            playerCard.classList.add("player-card");
            const isFollowing = allPlayers.some(p => p.username === currentUsername && p.following && p.following.includes(player.username));
            playerCard.innerHTML = `
                <h3><a href="player-profile.html?username=${encodeURIComponent(player.username)}">${player.username}</a></h3>
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
        fetch(`http://localhost:8080/Matchmaking/filtrar?gameName=${encodeURIComponent(gameName)}`)
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
                        <h3><a href="player-profile.html?username=${encodeURIComponent(player.username)}">${player.username}</a></h3>
                        <p>Plataforma: ${player.platform}</p>
                        <p>País: ${player.country}</p>
                        <button class="follow-btn" data-username="${player.username}">Seguir</button>
                    `;
                    searchGameResults.appendChild(playerElement);
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
        if (!currentUserId) {
            alert("Erro: Usuário não autenticado.");
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/follow/${currentUsername}?playerToFollowName=${playerToFollowName}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            if (!response.ok) throw new Error("Erro ao seguir jogador");
            alert(`Agora você está seguindo ${playerToFollowName}!`);
            fetchFollowing();
        } catch (error) {
            console.error("Erro ao seguir jogador:", error);
        }
    }

    function logout() {
        sessionStorage.removeItem("user");
        window.location.href = 'index.html';
    }

    window.searchGame = searchGame;
    window.logout = logout;
});
