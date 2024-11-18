// Charger les données JSON
export async function loadData(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Erreur lors du chargement du fichier : ${filePath}`);
        return await response.json();
    } catch (error) {
        console.error('Erreur :', error);
        return [];
    }
}

// Fonction pour compter les occurrences des monnaies
export function countCurrencies(data) {
    const currencyCounts = {};

    data.forEach(entry => {
        const currency = entry.Currency?.split('\t')[0]; // Récupère le code de la devise
        if (currency) {
            currencyCounts[currency] = (currencyCounts[currency] || 0) + 1;
        }
    });

    return currencyCounts;
}

// Créer ou mettre à jour le graphique avec Chart.js
export function createOrUpdateCurrencyChart(chart, currencyCounts) {
    const labels = Object.keys(currencyCounts); // Noms des monnaies
    const data = Object.values(currencyCounts); // Occurrences des monnaies

    if (chart) {
        // Mettre à jour un graphique existant
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.update();
    } else {
        // Créer un nouveau graphique
        const ctx = document.getElementById('currencyChart').getContext('2d');
        return new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Nombre d\'utilisations des monnaies',
                    data: data,
                    backgroundColor: [
                        'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'cyan'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    },
                    tooltip: {
                        enabled: true
                    }
                }
            }
        });
    }
}