// favoritos.js

// Função para carregar e exibir apenas os filmes favoritos
async function carregarFavoritos() {
    const lista = document.getElementById("filmesFavoritosLista");
    lista.innerHTML = ''; // Limpa a lista antes de adicionar os filmes

    const apiUrl = 'http://localhost:3000/filmes'; // Busca todos os filmes do servidor

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        let filmes = await response.json(); // Recebe todos os filmes

        // Filtra APENAS os filmes que têm a propriedade 'favorito' como true
        const filmesFavoritos = filmes.filter(filme => filme.favorito === true);

        if (filmesFavoritos.length === 0) {
            lista.innerHTML = "<p class='text-warning text-center w-100'>Você ainda não marcou nenhum filme como favorito.</p>";
            return;
        }

        filmesFavoritos.forEach(filme => {
            const col = document.createElement("div");
            col.className = "movie-card-wrapper mb-4"; // Reutiliza a classe CSS para o wrapper do card

            col.innerHTML = `
                <div class="card h-100 shadow">
                    <img src="${filme.imagem_pincipal}" class="card-img-top" alt="${filme.titulo}">
                    <div class="card-body">
                        <h5 class="card-title">${filme.titulo}</h5>
                        <p class="card-text">${filme.descricao}</p>
                        <span class="favorite-icon" data-movie-id="${filme.id}" data-is-favorito="${filme.favorito ? 'true' : 'false'}">
                            ${filme.favorito ? '★' : '☆'}
                        </span>
                        <button class="btn btn-danger ver-detalhes" data-filme-id="${filme.id}">Ver detalhes</button>
                    </div>
                </div>
            `;
            lista.appendChild(col);
        });

        document.querySelectorAll('.ver-detalhes').forEach(button => {
            button.addEventListener('click', (event) => {
                const filmeId = event.target.dataset.filmeId;
                verDetalhes(parseInt(filmeId));
            });
        });

        document.querySelectorAll('.favorite-icon').forEach(icon => {
            icon.addEventListener('click', async (event) => {
                const movieId = parseInt(event.target.dataset.movieId);
                const currentStatus = event.target.dataset.isFavorito === 'true';
                await toggleFavorite(movieId, currentStatus, event.target);
                carregarFavoritos(); // Recarrega a lista para remover o filme se desfavoritado
            });
        });

    } catch (error) {
        console.error("Erro ao carregar filmes favoritos:", error);
        lista.innerHTML = "<p class='text-danger text-center w-100'>Não foi possível carregar seus filmes favoritos. Verifique se o JSON Server está rodando.</p>";
    }
}

// Reutiliza a função verDetalhes (copiada de app.js)
function verDetalhes(id) {
    localStorage.setItem("filmeSelecionadoId", id);
    window.location.href = "detalhes.html";
}

// Reutiliza a função toggleFavorite (copiada de app.js)
async function toggleFavorite(movieId, currentStatus, iconElement) {
    const newStatus = !currentStatus;
    try {
        const response = await fetch(`http://localhost:3000/filmes/${movieId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ favorito: newStatus })
        });

        if (!response.ok) {
            throw new Error(`Erro ao atualizar favorito! Status: ${response.status}`);
        }

        iconElement.dataset.isFavorito = newStatus ? 'true' : 'false';
        iconElement.textContent = newStatus ? '★' : '☆';

    } catch (error) {
        console.error("Erro ao marcar como favorito:", error);
        alert("Erro ao marcar/desmarcar favorito. Verifique o console.");
    }
}

// Chama a função principal quando a página é carregada
document.addEventListener('DOMContentLoaded', carregarFavoritos);