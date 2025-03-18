document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();  // Evita o recarregamento da página

    // Coleta os valores do formulário
    const formData = {
        username: document.getElementById('regUsername').value,
        email: document.getElementById('email').value,
        password: document.getElementById('regPassword').value,
        country: document.getElementById('country').value.trim(),
        plataformType: document.getElementById('platform').value.trim().toUpperCase(),
        favoriteGames: [] // Inicializa um array vazio para os jogos favoritos
    };

    // Validação da plataforma
    const validPlatforms = ['PC', 'PS5', 'PS4', 'XBOX'];
    if (!validPlatforms.includes(formData.plataformType)) {
        document.getElementById('message').textContent = "Plataforma inválida!";
        document.getElementById('message').style.color = 'red';
        return;
    }

    // Captura os jogos favoritos selecionados
    const gamesSelect = document.getElementById('favoriteGames');
    const selectedGames = Array.from(gamesSelect.selectedOptions).map(option => option.value);
    formData.favoriteGames = selectedGames; // Adiciona ao formData

    // Exibe mensagem de carregamento
    document.getElementById('message').textContent = "Enviando...";

    // Envia os dados para o backend
    fetch('http://localhost:8080/player/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) throw new Error('Falha na requisição');
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

// Carregar jogos disponíveis assim que a página carregar
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
            gamesSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao buscar jogos:', error);
        document.getElementById('message').textContent = "Erro ao carregar jogos disponíveis.";
        document.getElementById('message').style.color = 'red';
    }
}

// Chama a função ao carregar a página
window.onload = carregarJogos;
