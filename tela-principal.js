document.addEventListener('DOMContentLoaded', async function () {
    const searchGameInput = document.getElementById('searchGameInput');
    const searchGameResults = document.getElementById('searchGameResults');
    const searchPlayerInput = document.getElementById('searchPlayerInput');
    const searchPlayerResults = document.getElementById('searchPlayerResults');
    const followingList = document.getElementById('followingList');
    let allPlayers = [];
    let currentUsername = "";
    let currentUserId = "";  // Variável para armazenar o ID do usuário

    // Verificação de login com sessionStorage
    function checkUserLoggedIn() {
        const userData = sessionStorage.getItem('user');
        if (!userData) {
            alert('Você precisa fazer login para acessar esta página!');
            window.location.href = 'index.html'; // Redireciona para a página de login
            return false;
        }
        const parsedUser = JSON.parse(userData);
        currentUsername = parsedUser.username; // Definindo o username do usuário logado
        currentUserId = parsedUser.id;         // Armazenando o ID do usuário
        return true;
    }

    // Só executa se o usuário estiver logado
    if (!checkUserLoggedIn()) return;

    // Função para buscar todos os jogadores
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

    // Função para exibir os jogadores seguidos
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
                <h4>${player}</h4>  <!-- Exibe o nome do jogador -->
                <button onclick="unfollowPlayer('${player}')">Deixar de Seguir</button>  <!-- Chama a função de parar de seguir -->
            `;
            followingList.appendChild(playerCard);
        });
    }

    // Função para buscar os jogadores seguidos
    async function fetchFollowing() {
        if (!currentUserId) return; // Verifica se o ID do usuário está disponível
        try {
            // Usando o ID do usuário para buscar os jogadores seguidos
            const response = await fetch(`http://localhost:8080/follow/${currentUserId}/following`);
            if (!response.ok) throw new Error("Erro ao buscar jogadores seguidos");

            const following = await response.json();
            displayFollowing(following);
        } catch (error) {
            console.error("Erro ao buscar jogadores seguidos:", error);
        }
    }

    // Chama a função para buscar os jogadores seguidos quando a página carrega
    await fetchFollowing();

    async function unfollowPlayer(playerToUnfollowName) {
        if (!currentUsername) {
            alert("Erro: Usuário não autenticado.");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8080/unfollow/${currentUsername}?playerToUnfollowName=${playerToUnfollowName}`, {
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
    

    // Registra a função globalmente para ser chamada no evento onclick
    window.unfollowPlayer = unfollowPlayer;

    // A função searchPlayer precisa ser definida globalmente para o evento oninput
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

            // Verifica se o jogador já está sendo seguido
            const isFollowing = allPlayers.some(p => p.username === currentUsername && p.following && p.following.includes(player.username));

            playerCard.innerHTML = `
                    <h3>${player.username}</h3>
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

    async function followPlayer(playerToFollowName) {
        if (!currentUserId) {
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
            fetchFollowing(); // Atualiza a lista de jogadores seguidos
        } catch (error) {
            console.error("Erro ao seguir jogador:", error);
        }
    }

    function logout() {
        sessionStorage.removeItem("user"); // Alterei de localStorage para sessionStorage
        window.location.href = 'index.html'; // Redireciona para o login
    }

    window.searchGame = searchGame;
    window.logout = logout;
});
