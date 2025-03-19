document.addEventListener('DOMContentLoaded', function () {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const editButton = document.getElementById('editButton');
    const saveButton = document.getElementById('saveButton');
    const cancelButton = document.getElementById('cancelButton');

    // Se não estiver autenticado, redireciona para o login
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
    document.getElementById('bio').value = user.bio || '';

    // Carregar os jogos favoritos e marcar os jogos já selecionados
    fetch('http://localhost:8080/game')
        .then(response => response.json())
        .then(games => {
            const gamesSelect = document.getElementById('favoriteGames');
            games.forEach(game => {
                const option = document.createElement('option');
                option.value = game;
                option.textContent = game;
                if (user.favoriteGames.includes(game)) {
                    option.selected = true;
                }
                gamesSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar jogos:', error));

    // Ação de clicar no botão de editar
    editButton.addEventListener('click', function () {
        // Mostra os botões de salvar e cancelar
        saveButton.style.display = 'inline-block';
        cancelButton.style.display = 'inline-block';

        // Desabilita o botão de editar
        editButton.style.display = 'none';

        // Torna os campos editáveis
        document.getElementById('editUsername').disabled = false;
        document.getElementById('email').disabled = false;
        document.getElementById('country').disabled = false;
        document.getElementById('platform').disabled = false;
        document.getElementById('bio').disabled = false;
        document.getElementById('favoriteGames').disabled = false;
    });

    // Ação de clicar no botão de salvar
    saveButton.addEventListener('click', function () {
        const updatedUser = {
            username: document.getElementById('editUsername').value,
            email: document.getElementById('email').value,
            country: document.getElementById('country').value,
            platform: document.getElementById('platform').value,
            bio: document.getElementById('bio').value,
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

    // Ação de clicar no botão de cancelar
    cancelButton.addEventListener('click', function () {
        // Redireciona para a página do perfil sem salvar as mudanças
        window.location.href = 'perfil.html';
    });
});
