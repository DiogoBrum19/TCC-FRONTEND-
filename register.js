document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();  // Previne o comportamento padrão de recarregar a página ao enviar o formulário

    // Coleta os valores dos campos do formulário
    const formData = {
        username: document.getElementById('regUsername').value,
        email: document.getElementById('email').value,
        password: document.getElementById('regPassword').value,
        country: document.getElementById('country').value.trim(),
        plataformType: document.getElementById('platform').value.trim().toUpperCase()
    };

    // Valida a plataforma
    const validPlatforms = ['PC', 'PS5', 'PS4', 'XBOX'];
    if (!validPlatforms.includes(formData.plataformType)) {
        document.getElementById('message').textContent = "Plataforma inválida!";
        document.getElementById('message').style.color = 'red';
        return;
    }

    // Busca os jogos disponíveis
    try {
        const gamesResponse = await fetch('http://localhost:8080/game');
        if (!gamesResponse.ok) {
            throw new Error('Falha ao obter lista de jogos');
        }
        const games = await gamesResponse.json();
        console.log("Jogos disponíveis:", games);

        // Cria dinamicamente as opções do <select> para os jogos
        const gamesSelect = document.getElementById('favoriteGames');
        gamesSelect.innerHTML = '';  // Limpa o select anterior

        games.forEach(game => {
            const option = document.createElement('option');
            option.value = game.name; // Nome do jogo
            option.textContent = game.name; // Exibe o nome do jogo
            gamesSelect.appendChild(option);
        });

        // Depois de carregar a lista de jogos, captura os jogos selecionados
        const selectedGames = Array.from(gamesSelect.selectedOptions).map(option => ({
            name: option.value
        }));

        formData.favoriteGames = selectedGames;

    } catch (error) {
        console.error('Erro ao buscar jogos:', error);
        document.getElementById('message').textContent = "Erro ao carregar jogos disponíveis.";
        document.getElementById('message').style.color = 'red';
        return;
    }

    // Exibe a mensagem de carregamento
    document.getElementById('message').textContent = "Enviando...";

    // Envia os dados para o backend com uma requisição POST
    fetch('http://localhost:8080/player/cadastrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha na requisição');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('message').textContent = "Cadastro realizado com sucesso!";
        document.getElementById('message').style.color = 'green';
    })
    .catch(error => {
        document.getElementById('message').textContent = "Erro ao cadastrar jogador.";
        document.getElementById('message').style.color = 'red';
        console.error('Erro no cadastro:', error);
    });
});
