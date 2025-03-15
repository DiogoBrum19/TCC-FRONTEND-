const API_URL = 'http://localhost:8080/player';

async function register(event) {
    event.preventDefault();

    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const plataformType = document.getElementById('plataformType').value;

    // Verifica se os campos estão preenchidos
    if (!username || !email || !password || !plataformType) {
        alert("Preencha todos os campos antes de continuar.");
        return;
    }

    const data = { username, email, password, plataformType };

    try {
        console.log('Enviando requisição de cadastro...', data);
        const response = await fetch(`${API_URL}/cadastrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        console.log('Resposta do servidor:', response.status);

        if (response.ok) {
            const responseData = await response.json();
            console.log('Cadastro realizado com sucesso!', responseData);
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'index.html'; // Redireciona para a página de login
        } else {
            let errorText = 'Erro desconhecido ao cadastrar. Tente novamente.';
            
            if (response.status === 409) {
                errorText = 'Este email já está registrado.';
            } else if (response.status === 400) {
                errorText = 'Dados inválidos. Verifique as informações e tente novamente.';
            }

            const errorData = await response.text();
            console.error(`Erro ao cadastrar. Status: ${response.status}, Message: ${errorData}`);
            alert(errorText);
        }
    } catch (error) {
        console.error('Erro ao realizar cadastro:', error);
        alert('Erro de conexão. Tente novamente.');
    }
}

// Garante que o evento só será adicionado se o formulário existir
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', register);
    }
});
