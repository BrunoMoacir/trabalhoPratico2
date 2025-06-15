document.addEventListener('DOMContentLoaded', async () => {
    let filmes = [];
    const chartErrorElement = document.getElementById('chartError');
    const generoChartCanvas = document.getElementById('generoChart');

    try {
        const response = await fetch('http://localhost:3000/filmes');
        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        filmes = await response.json();
    } catch (error) {
        console.error("Erro ao carregar filmes para o gráfico:", error);
        if (chartErrorElement) {
            chartErrorElement.style.display = 'block'; // Mostra a mensagem de erro
        }
        if (generoChartCanvas) {
            generoChartCanvas.style.display = 'none'; // Esconde o canvas do gráfico
        }
        return; // Impede a criação do gráfico se os dados não puderem ser carregados
    }

    if (filmes && filmes.length > 0) {
        const generosCount = {};

        // Processa os filmes para contar cada gênero
        filmes.forEach(filme => {
            // Garante que a categoria é uma string antes de split
            const categoriasStr = String(filme.categoria || '');
            const generos = categoriasStr.split(',').map(genero => genero.trim());
            generos.forEach(genero => {
                if (genero) { // Garante que não há gêneros vazios
                    generosCount[genero] = (generosCount[genero] || 0) + 1;
                }
            });
        });

        const labels = Object.keys(generosCount);
        const data = Object.values(generosCount);

        // Gera cores dinamicamente para o gráfico
        const backgroundColors = [];
        const borderColors = [];
        const dynamicColors = function() {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            return `rgba(${r},${g},${b},0.7)`;
        };

        for (let i = 0; i < labels.length; i++) {
            const color = dynamicColors();
            backgroundColors.push(color);
            borderColors.push(color.replace('0.7', '1')); // Borda mais sólida
        }

        const ctx = generoChartCanvas.getContext('2d');

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Número de Filmes',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Permite que o gráfico se ajuste melhor ao container
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: 'white' // Cor do texto da legenda
                        }
                    },
                    title: {
                        display: true,
                        text: 'Distribuição de Filmes por Gênero',
                        color: 'white' // Cor do título do gráfico
                    }
                }
            }
        });
    } else {
        if (chartErrorElement) {
            chartErrorElement.textContent = "Nenhum dado de filme disponível para gerar o gráfico.";
            chartErrorElement.style.display = 'block';
        }
        if (generoChartCanvas) {
            generoChartCanvas.style.display = 'none';
        }
    }
});