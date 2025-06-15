// public/grafico_generos.js

document.addEventListener('DOMContentLoaded', () => {
    // Verifica se filmesFamosos está disponível (vem de app.js)
    if (typeof filmesFamosos !== 'undefined' && filmesFamosos.filmes_famosos) {
        const filmes = filmesFamosos.filmes_famosos;
        const generosCount = {};

        // Processa os filmes para contar cada gênero
        filmes.forEach(filme => {
            const generos = filme.categoria.split(',').map(genero => genero.trim());
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

        const ctx = document.getElementById('generoChart').getContext('2d');

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
        console.error("Dados de filmes não encontrados. Verifique se 'app.js' está carregado corretamente antes de 'grafico_generos.js'.");
    }
});