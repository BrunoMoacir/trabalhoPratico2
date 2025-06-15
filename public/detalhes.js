function carregarDetalhesFilme() {
    const filme = JSON.parse(localStorage.getItem('filmeSelecionado'));
  
    if (filme) {
      const container = document.getElementById('detalhes-filme');
      container.innerHTML = `
        <h2 class="mb-3">${filme.titulo}</h2>
        <img src="${filme.imagem_pincipal}" 
             alt="${filme.titulo}" 
             class="img-fluid rounded mb-3 d-block mx-auto" 
             style="max-width: 100%; height: auto;" />
  
        <p><strong>Descrição:</strong> ${filme.descricao}</p>
        <p><strong>Categoria:</strong> ${filme.categoria}</p>
        <p><strong>Autor:</strong> ${filme.autor}</p>
        <p><strong>Data de lançamento:</strong> ${filme.data}</p>
        <p><strong>Conteúdo:</strong> ${filme.conteudo}</p>
  
        ${filme.imagens_complementares.length > 0 ? `
          <h4 class="mt-4">Imagens Complementares</h4>
          <div class="row g-3 mt-2">
            ${filme.imagens_complementares.map(img => `
              <div class="col-12 col-sm-6 col-md-4">
                <img src="${img.src}" alt="${img.descricao}" class="img-fluid rounded w-100">
                <p class="text-light mt-2">${img.descricao}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}
      `;
    } else {
      document.getElementById('detalhes-filme').innerHTML = `<p class="text-danger">Filme não encontrado.</p>`;
    }
  }
  
  window.onload = carregarDetalhesFilme;
  