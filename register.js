const API_URL = 'http://localhost:8080/player';

async function register(event) {
    event.preventDefault();

    // Coleta apenas os dados necessários (nome, email, senha e plataforma)
    const data = {
        username: document.getElementById('regUsername').value,
        email: document.getElementById('email').value,
        password: document.getElementById('regPassword').value,
        plataformType: document.getElementById('plataformType').value,
    };

    console.log('Dados enviados:', data); // Log para verificar os dados

    try {
        console.log('Iniciando a requisição fetch...');
        const response = await fetch(`${API_URL}/cadastrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        console.log('Resposta do servidor:', response.status); // Log para status da resposta

        if (response.ok) {
            const responseData = await response.json();  // Se a resposta for OK, obtenha a resposta JSON
            console.log('Cadastro realizado com sucesso!', responseData); // Log de sucesso
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'index.html'; // Redirecionar após o cadastro
        } else {
            let errorText = 'Erro desconhecido ao cadastrar. Tente novamente.';
            if (response.status === 409) {
                errorText = 'Este email já está registrado.';
            } else if (response.status === 400) {
                errorText = 'Dados inválidos. Verifique as informações e tente novamente.';
            }

            const errorData = await response.text();  // Pega a mensagem de erro, se houver
            console.error(`Erro ao cadastrar. Status: ${response.status}, Message: ${errorData}`);
            alert(errorText);
        }
    } catch (error) {
        console.error('Erro ao realizar cadastro:', error); // Erro de conexão ou outro
        alert('Erro de conexão. Tente novamente.');
    }
}

// Adicionar o evento no submit do formulário (garantir que a função seja chamada ao enviar)
document.getElementById('registerForm').addEventListener('submit', register);
