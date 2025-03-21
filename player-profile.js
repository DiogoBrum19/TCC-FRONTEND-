document.addEventListener('DOMContentLoaded', async function () {
    let currentUsername = '';
    const playerUsernameElement = document.getElementById('playerUsername');
    const playerPlatformElement = document.getElementById('playerPlatform');
    const playerCountryElement = document.getElementById('playerCountry');
    const playerBioElement = document.getElementById('playerBio');
    const followButton = document.getElementById('followButton');
    const logoutButton = document.getElementById('logoutButton'); // Obtendo o botão de logout
    const backButton = document.getElementById('backButton'); // Obtendo o botão de voltar

    // Função para obter o nome de usuário da URL
    function getUsernameFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('username');
    }

    const usernameToLoad = getUsernameFromUrl();

    if (!usernameToLoad) {
        alert('Erro: Nenhum usuário especificado.');
        return;
    }

    // Função para obter o usuário logado
    async function getLoggedUser() {
        try {
            const storedUsername = localStorage.getItem('username');
            if (!storedUsername) throw new Error('Usuário não autenticado');

            const response = await fetch(`http://localhost:8080/player/username/${storedUsername}`);
            if (!response.ok) throw new Error('Erro ao obter usuário logado');

            const userData = await response.json();
            currentUsername = userData.username;
        } catch (error) {
            console.error('Erro ao buscar usuário logado:', error);
        }
    }

    // Função para carregar as informações do jogador
    async function loadPlayerProfile() {
        try {
            const response = await fetch(`http://localhost:8080/player/username/${usernameToLoad}`);
            if (!response.ok) throw new Error('Erro ao buscar jogador');

            const playerData = await response.json();

            playerUsernameElement.textContent = playerData.username;
            playerPlatformElement.textContent = `Plataforma: ${playerData.platform}`;
            playerCountryElement.textContent = `País: ${playerData.country}`;
            playerBioElement.textContent = `Biografia: ${playerData.bio || 'Sem biografia disponível'}`;

            // Verifica se o jogador já é seguido
            if (currentUsername && playerData.username !== currentUsername) {
                const isFollowing = await checkIfFollowing(playerData.username);
                if (isFollowing) {
                    followButton.textContent = 'Deixar de Seguir';
                } else {
                    followButton.textContent = 'Seguir';
                }
            }

            // Exibe o botão de seguir ou deixar de seguir
            followButton.style.display = 'block';

        } catch (error) {
            console.error('Erro ao carregar perfil do jogador:', error);
            alert('Erro ao carregar perfil do jogador.');
        }
    }

    // Função para verificar se o jogador está sendo seguido
    async function checkIfFollowing(playerUsername) {
        try {
            const response = await fetch(`http://localhost:8080/follow/${currentUsername}`);
            if (!response.ok) throw new Error('Erro ao verificar se segue o jogador');
            const following = await response.json();
            return following.some(player => player.username === playerUsername);
        } catch (error) {
            console.error('Erro ao verificar se segue o jogador:', error);
            return false;
        }
    }

    // Função para seguir ou deixar de seguir o jogador
    async function toggleFollowPlayer() {
        try {
            const response = await fetch(`http://localhost:8080/follow/${currentUsername}?playerToFollowName=${usernameToLoad}`, {
                method: followButton.textContent === 'Seguir' ? 'POST' : 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Erro ao seguir/deixar de seguir jogador');

            if (followButton.textContent === 'Seguir') {
                followButton.textContent = 'Deixar de Seguir';
                alert(`Agora você está seguindo ${usernameToLoad}!`);
            } else {
                followButton.textContent = 'Seguir';
                alert(`Você deixou de seguir ${usernameToLoad}!`);
            }
        } catch (error) {
            console.error('Erro ao seguir/deixar de seguir jogador:', error);
        }
    }

    // Função de logout
    function logout() {
        localStorage.removeItem('username');
        window.location.href = 'login.html'; // Redireciona para a página de login
    }

    // Função de voltar
    function goBack() {
        window.location.href = 'tela-principal.html'; // Redireciona para a página principal
    }

    // Atribuir evento de clique ao botão de logout
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    // Atribuir evento de clique ao botão de voltar
    if (backButton) {
        backButton.addEventListener('click', goBack);
    }

    followButton.addEventListener('click', toggleFollowPlayer);

    await getLoggedUser(); // Obtem o usuário logado
    await loadPlayerProfile(); // Carrega as informações do jogador
});
