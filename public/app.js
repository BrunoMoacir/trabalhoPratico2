// app.js

async function carregarFilmes(searchTerm = '') {
    const lista = document.getElementById("filmesLista");
    lista.innerHTML = ''; // Limpar lista existente

    const apiUrl = 'http://localhost:3000/filmes'; // Sempre busca a lista completa do servidor

    console.log(`Buscando filmes da API: ${apiUrl}`); // DEBUG: Sempre busca tudo do servidor

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        let filmes = await response.json(); // Recebe todos os filmes do servidor

        console.log(`Total de filmes recebidos do servidor: ${filmes.length}`); // DEBUG

        // FILTRAGEM NO LADO DO CLIENTE
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            filmes = filmes.filter(filme => {
                return (filme.titulo && filme.titulo.toLowerCase().includes(lowerCaseSearchTerm)) ||
                       (filme.descricao && filme.descricao.toLowerCase().includes(lowerCaseSearchTerm)) ||
                       (filme.categoria && filme.categoria.toLowerCase().includes(lowerCaseSearchTerm));
            });
            console.log(`Filmes filtrados pelo termo "${searchTerm}". Total após filtro: ${filmes.length}`); // DEBUG
        }

        if (filmes.length === 0) {
            lista.innerHTML = "<p class='text-warning text-center w-100'>Nenhum filme encontrado para a sua busca.</p>";
            console.log("Nenhum filme encontrado após o filtro."); // DEBUG
            return;
        }

        filmes.forEach(filme => {
            const col = document.createElement("div");
            col.className = "movie-card-wrapper mb-4";

            col.innerHTML = `
                <div class="card h-100 shadow">
                    <img src="${filme.imagem_pincipal}" class="card-img-top" alt="${filme.titulo}">
                    <div class="card-body">
                        <h5 class="card-title">${filme.titulo}</h5>
                        <p class="card-text">${filme.descricao}</p>
                        <span class="favorite-icon" data-movie-id="${filme.id}" data-is-favorito="${filme.favorito ? 'true' : 'false'}">
                            ${filme.favorito ? '★' : '☆'} </span>
                        <button class="btn btn-danger ver-detalhes" data-filme-id="${filme.id}">Ver detalhes</button>
                    </div>
                </div>
            `;
            lista.appendChild(col);
        });

        // Adiciona event listeners para os botões "Ver detalhes"
        document.querySelectorAll('.ver-detalhes').forEach(button => {
            button.addEventListener('click', (event) => {
                const filmeId = event.target.dataset.filmeId;
                console.log(`Botão 'Ver detalhes' clicado para o filme ID: ${filmeId}`);
                verDetalhes(parseInt(filmeId));
            });
        });

        // NOVO: Adiciona event listeners para os ícones de favorito
        document.querySelectorAll('.favorite-icon').forEach(icon => {
            icon.addEventListener('click', async (event) => {
                const movieId = parseInt(event.target.dataset.movieId);
                const currentStatus = event.target.dataset.isFavorito === 'true';
                await toggleFavorite(movieId, currentStatus, event.target); // Passa o elemento para atualizar sua UI
            });
        });

        console.log(`Filmes carregados e listeners anexados.`);

    } catch (error) {
        console.error("Erro ao carregar filmes:", error);
        lista.innerHTML = "<p class='text-danger text-center w-100'>Não foi possível carregar os filmes no momento. Verifique se o JSON Server está rodando.</p>";
    }
}

// NOVA FUNÇÃO PARA ALTERNAR FAVORITO
async function toggleFavorite(movieId, currentStatus, iconElement) {
    const newStatus = !currentStatus;
    try {
        const response = await fetch(`http://localhost:3000/filmes/${movieId}`, {
            method: 'PATCH', // Usamos PATCH para atualizar apenas o campo 'favorito'
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ favorito: newStatus })
        });

        if (!response.ok) {
            throw new Error(`Erro ao atualizar favorito! Status: ${response.status}`);
        }

        // Atualiza a UI do ícone imediatamente após a atualização bem-sucedida
        iconElement.dataset.isFavorito = newStatus ? 'true' : 'false';
        iconElement.textContent = newStatus ? '★' : '☆'; // Altera a estrela
        // A cor será definida pelo CSS (styles.css) baseado no data-is-favorito

        console.log(`Filme ${movieId} marcado como favorito: ${newStatus}`);

    } catch (error) {
        console.error("Erro ao marcar como favorito:", error);
        alert("Erro ao marcar/desmarcar favorito. Verifique o console.");
    }
}


function verDetalhes(id) {
    console.log(`Função verDetalhes chamada para o ID: ${id}`);
    localStorage.setItem("filmeSelecionadoId", id);
    console.log(`ID ${id} salvo em localStorage. Tentando navegar para detalhes.html...`);
    window.location.href = "detalhes.html";
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoded disparado. Tentando configurar o formulário de busca.");

    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');

    if (!searchForm) {
        console.error("Erro: Formulário de busca (ID 'searchForm') não encontrado no HTML.");
    }
    if (!searchInput) {
        console.error("Erro: Campo de busca (ID 'searchInput') não encontrado no HTML.");
    }

    if (searchForm && searchInput) {
        console.log("Formulário de busca e campo de input encontrados. Anexando listener.");
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const searchTerm = searchInput.value.trim();
            console.log(`Formulário de busca submetido. Termo de busca: "${searchTerm}"`);
            carregarFilmes(searchTerm); // Chama a função carregarFilmes com o termo de busca
        });
    } else {
        console.error("Não foi possível anexar o listener do formulário de busca. Verifique os IDs no HTML.");
    }
});