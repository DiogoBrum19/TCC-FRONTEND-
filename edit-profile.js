document.addEventListener('DOMContentLoaded', function () {
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (!user) {
        alert('Usuário não autenticado. Faça login novamente.');
        window.location.href = 'login.html';
        return;
    }

    // Preencher o formulário com os dados do usuário
    document.getElementById('editUsername').value = user.username || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('country').value = user.country || '';
    document.getElementById('platform').value = user.platform || '';
    document.getElementById('bio').value = user.bio || '';

    // Carregar jogos favoritos e marcar os já selecionados
    fetch('http://localhost:8080/game') // Ajuste o endpoint conforme necessário
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

    // Captura o evento de envio do formulário de edição
    document.getElementById('editProfileForm').addEventListener('submit', function (event) {
        event.preventDefault();

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
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao atualizar perfil.');
            }
            return response.json();
        })
        .then(updatedData => {
            alert('Perfil atualizado com sucesso!');
            sessionStorage.setItem('user', JSON.stringify(updatedData));
            window.location.href = 'perfil.html';
        })
        .catch(error => {
            console.error('Erro na atualização do perfil:', error);
            alert('Erro ao atualizar perfil. Tente novamente.');
        });
    });
});
