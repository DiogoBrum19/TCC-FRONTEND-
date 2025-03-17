// Adiciona um ouvinte de evento para o envio do formulário
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();  // Previne o comportamento padrão de recarregar a página ao enviar o formulário

    // Coleta os valores dos campos do formulário
    const formData = {
        username: document.getElementById('regUsername').value,
        email: document.getElementById('email').value,
        password: document.getElementById('regPassword').value,
        platform: document.getElementById('platform').value.trim()  // Remove espaços extras
    };

    // Valida a plataforma (aceita PC, PS5, PS4, XBOX)
    const validPlatforms = ['PC', 'PS5', 'PS4', 'XBOX'];  // Usando as opções com a inicial maiúscula
    if (!validPlatforms.includes(formData.platform)) {
        document.getElementById('message').textContent = "Plataforma inválida! Digite uma das opções: PC, PS5, PS4, XBOX.";
        document.getElementById('message').style.color = 'red';
        return;  // Impede o envio do formulário se a plataforma for inválida
    }

    // Exibe a mensagem de carregamento ou espera do backend
    document.getElementById('message').textContent = "Enviando...";

    // Exibe no console para verificar o valor da plataforma
    console.log('Form Data:', formData);  // Verifique o valor de formData aqui

    // Envia os dados para o backend com uma requisição POST
    fetch('http://localhost:8080/player/cadastrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  // Especifica que os dados são em formato JSON
        },
        body: JSON.stringify(formData)  // Transforma o objeto formData em uma string JSON
    })
    .then(response => {
        // Se a resposta do backend for bem-sucedida, converta-a para JSON
        if (!response.ok) {
            throw new Error('Falha na requisição');
        }
        return response.json();
    })
    .then(data => {
        // Caso o cadastro seja bem-sucedido, mostra a mensagem de sucesso
        document.getElementById('message').textContent = "Cadastro realizado com sucesso!";
        document.getElementById('message').style.color = 'green';
    })
    .catch(error => {
        // Se ocorrer um erro, mostra a mensagem de erro
        document.getElementById('message').textContent = "Erro ao cadastrar jogador.";
        document.getElementById('message').style.color = 'red';
        console.error('Erro no cadastro:', error);
    });
});
