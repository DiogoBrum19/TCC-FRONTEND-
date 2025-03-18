// Adiciona um ouvinte de evento para o envio do formulário

document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();  // Previne o comportamento padrão de recarregar a página ao enviar o formulário

    // Coleta os valores dos campos do formulário
    const formData = {
        username: document.getElementById('regUsername').value,
        email: document.getElementById('email').value,
        password: document.getElementById('regPassword').value,
        country: document.getElementById('country').value.trim(), // Adicionado campo de país
        plataformType: document.getElementById('platform').value.trim().toUpperCase() // Transforma em maiúsculas
    };

    // Valida a plataforma (deve corresponder ao enum PlataformType do backend)
    const validPlatforms = ['PC', 'PS5', 'PS4', 'XBOX'];
    if (!validPlatforms.includes(formData.plataformType)) {
        document.getElementById('message').textContent = "Plataforma inválida! Digite uma das opções: PC, PS5, PS4, XBOX.";
        document.getElementById('message').style.color = 'red';
        return;
    }

    // Busca a lista de jogos disponíveis no backend para permitir seleção pelo usuário
    try {
        const gamesResponse = await fetch('http://localhost:8080/game');
        if (!gamesResponse.ok) {
            throw new Error('Falha ao obter lista de jogos');
        }
        const games = await gamesResponse.json();
        console.log("Jogos disponíveis:", games);

        // Simula seleção de jogos favoritos pelo usuário (pode ser ajustado com checkboxes no HTML futuramente)
        const favoriteGames = games.slice(0, 2).map(game => ({ name: game.name })); // Pegando os dois primeiros jogos como exemplo
        formData.favoriteGames = favoriteGames;
    } catch (error) {
        console.error('Erro ao buscar jogos:', error);
        document.getElementById('message').textContent = "Erro ao carregar jogos disponíveis.";
        document.getElementById('message').style.color = 'red';
        return;
    }

    // Exibe a mensagem de carregamento
    document.getElementById('message').textContent = "Enviando...";

    // Exibe no console para depuração
    console.log('Dados do formulário:', formData);

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
