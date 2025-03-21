document.addEventListener('DOMContentLoaded', function () {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const editButton = document.getElementById('editButton');
    const saveButton = document.getElementById('saveButton');
    const cancelButton = document.getElementById('cancelButton');
    const backToMainButton = document.getElementById('backToMain');
    const platformInput = document.getElementById('platform');
    if (!user) {
        alert('Usuário não autenticado. Faça login novamente.');
        window.location.href = 'login.html';
        return;
    }

    // Preencher os campos do formulário com os dados do usuário
    document.getElementById('editUsername').value = user.username || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('country').value = user.country || '';
    platformInput.value = user.platform || '';
    document.getElementById('bio').value = user.bio || '';

    // Carregar os jogos favoritos
    carregarJogos();

    async function carregarJogos() {
        try {
            const gamesResponse = await fetch('http://localhost:8080/game');
            if (!gamesResponse.ok) throw new Error('Falha ao obter lista de jogos');

            const games = await gamesResponse.json();
            console.log("Jogos disponíveis:", games);

            const gamesSelect = document.getElementById('favoriteGames');
            gamesSelect.innerHTML = '';

            games.forEach(game => {
                const option = document.createElement('option');
                option.value = game.name;
                option.textContent = game.name;

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

    editButton.addEventListener('click', function () {
        saveButton.style.display = 'inline-block';
        cancelButton.style.display = 'inline-block';
        editButton.style.display = 'none';

        document.getElementById('editUsername').disabled = false;
        document.getElementById('email').disabled = false;
        document.getElementById('country').disabled = false;
        platformInput.disabled = false;
        document.getElementById('favoriteGames').disabled = false;
    });

    saveButton.addEventListener('click', function () {
        const updatedUser = {
            username: document.getElementById('editUsername').value,
            email: document.getElementById('email').value,
            country: document.getElementById('country').value,
            platform: platformInput.value,
            favoriteGames: Array.from(document.getElementById('favoriteGames').selectedOptions).map(option => ({
                name: option.value
            }))
        };

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password && password === confirmPassword) {
            updatedUser.password = password;
        } else if (password && password !== confirmPassword) {
            alert('As senhas não coincidem. Tente novamente.');
            return;
        }

        if (!updatedUser.username || !updatedUser.email || !updatedUser.country || !updatedUser.platform) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

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
            window.location.href = 'tela-principal.html';
        })
        .catch(error => {
            alert('Erro ao atualizar perfil. Tente novamente.');
            console.error('Erro na atualização do perfil:', error);
        });
    });

    cancelButton.addEventListener('click', function () {
        window.location.reload();
    });

    backToMainButton.addEventListener('click', function () {
        window.location.href = 'tela-principal.html';
    });
   
});
