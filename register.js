const API_URL = 'http://localhost:8080/player';
async function register(event) {
    event.preventDefault();
    
    const data = {
        username: document.getElementById('regUsername').value,
        email: document.getElementById('email').value,
        password: document.getElementById('regPassword').value,
        location: document.getElementById('location').value,
        plataformType: document.getElementById('plataformType').value,
        gamingTimePreferences: document.getElementById('gamingTimePreferences').value.split(','),
        favoriteGames: Array.from(document.getElementById('favoriteGames').selectedOptions).map(option => ({
            id: option.value  // **Ajustado para enviar um objeto, se necessário**
        }))
    };

    try {
        const response = await fetch(`${API_URL}/cadastrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'index.html'; // Redirecionar após o cadastro
        } else {
            if (response.status === 409) {
                alert('Este email já está registrado.');
            } else {
                alert('Erro ao cadastrar. Tente novamente.');
            }
        }
    } catch (error) {
        console.error('Erro ao realizar cadastro:', error);
        alert('Erro de conexão. Tente novamente.');
    }
}
