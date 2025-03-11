const API_URL = 'http://localhost:8080/player'; // A URL da sua API
const userId = 'id_do_usuario'; // Substitua pelo ID do usuário, pode vir de um login ou do localStorage

// Quando a página for carregada
document.addEventListener('DOMContentLoaded', async () => {
    // Carregar os dados do perfil
    const response = await fetch(`${API_URL}/${userId}`);
    if (response.ok) {
        const user = await response.json();
        document.getElementById('username').value = user.username;
        document.getElementById('email').value = user.email;
        document.getElementById('favoriteGames').value = user.favoriteGames.join(', ');
        document.getElementById('platform').value = user.platform;
        document.getElementById('bio').value = user.bio;
    } else {
        alert('Erro ao carregar os dados do perfil.');
    }

    // Adicionar evento de submit para salvar as alterações
    const form = document.getElementById('editProfileForm');
    form.addEventListener('submit', updateProfile);
});

// Função para atualizar o perfil
async function updateProfile(event) {
    event.preventDefault();

    const updatedData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        favoriteGames: document.getElementById('favoriteGames').value.split(',').map(game => game.trim()),
        platform: document.getElementById('platform').value,
        bio: document.getElementById('bio').value
    };

    // Enviar os dados atualizados para a API
    const response = await fetch(`${API_URL}/update/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    });

    if (response.ok) {
        alert('Perfil atualizado com sucesso!');
    } else {
        alert('Erro ao atualizar perfil.');
    }
}
