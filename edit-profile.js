document.addEventListener('DOMContentLoaded', function () {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const editButton = document.getElementById('editButton');
    const saveButton = document.getElementById('saveButton');
    const cancelButton = document.getElementById('cancelButton');
    const backToMainButton = document.getElementById('backToMain');

    if (!user) {
        alert('Usuário não autenticado. Faça login novamente.');
        window.location.href = 'login.html';
        return;
    }

    // Preencher os campos do formulário com os dados do usuário
    document.getElementById('editUsername').value = user.username || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('country').value = user.country || '';
    document.getElementById('platform').value = user.platform || '';

    // Carregar os jogos favoritos
    carregarJogos();

    // Função para carregar os jogos disponíveis no formulário
    async function carregarJogos() {
        try {
            const gamesResponse = await fetch('http://localhost:8080/game');
            if (!gamesResponse.ok) throw new Error('Falha ao obter lista de jogos');
            
            const games = await gamesResponse.json();
            console.log("Jogos disponíveis:", games);

            // Adiciona os jogos ao select
            const gamesSelect = document.getElementById('favoriteGames');
            gamesSelect.innerHTML = ''; // Limpa o select

            games.forEach(game => {
                const option = document.createElement('option');
                option.value = game.name; // Nome do jogo
                option.textContent = game.name; // Exibe o nome do jogo

                // Verifica se o jogo está nos favoritos do usuário
                if (user.favoriteGames && user.favoriteGames.includes(game.name)) {
                    option.selected = true;
                }

                gamesSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao buscar jogos:', error);
            document.getElementById('message').textContent = "Erro ao carregar jogos disponíveis.";
            document.getElementById('message').style.color = 'red';
        }
    }

    // Evento para clicar em "Editar"
    editButton.addEventListener('click', function () {
        // Mostrar botões "Salvar" e "Cancelar"
        saveButton.style.display = 'inline-block';
        cancelButton.style.display = 'inline-block';

        // Ocultar botão "Editar"
        editButton.style.display = 'none';

        // Habilitar campos para edição
        document.getElementById('editUsername').disabled = false;
        document.getElementById('email').disabled = false;
        document.getElementById('country').disabled = false;
        document.getElementById('platform').disabled = false;
        document.getElementById('favoriteGames').disabled = false;
    });

    // Evento para clicar em "Salvar"
    saveButton.addEventListener('click', function () {
        const updatedUser = {
            username: document.getElementById('editUsername').value,
            email: document.getElementById('email').value,
            country: document.getElementById('country').value,
            platform: document.getElementById('platform').value,
            favoriteGames: Array.from(document.getElementById('favoriteGames').selectedOptions).map(option => option.value)
        };

        fetch(`http://localhost:8080/player/${user.username}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        })
        .then(response => response.json())
        .then(updatedData => {
            alert('Perfil atualizado com sucesso!');
            sessionStorage.setItem('user', JSON.stringify(updatedData));
            window.location.href = 'perfil.html';
        })
        .catch(error => {
            alert('Erro ao atualizar perfil. Tente novamente.');
            console.error('Erro na atualização do perfil:', error);
        });
    });

    // Evento para clicar em "Cancelar"
    cancelButton.addEventListener('click', function () {
        // Recarregar a página para restaurar os valores originais
        location.reload();
    });

    // Evento para voltar à tela principal
    backToMainButton.addEventListener('click', function () {
        window.location.href = 'tela-principal.html';
    });
});
