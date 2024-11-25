// Charger les données JSON
export async function loadData(filePath) {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Erreur lors du chargement du fichier : ${filePath}`);
    return await response.json();
}

// Constantes globales
export const MAX_SALARY = 1_000_000; // Salaire maximum réaliste


// Taux de conversion pour toutes les devises présentes dans le fichier
const exchangeRates = {
    GBP: 1.17, EUR: 1.00, CHF: 1.03, PLN: 0.21, USD: 0.95, CAD: 0.69,
    CUP: 0.04, XPF: 0.0084, IRR: 0.000022, FJD: 0.42, GIP: 1.17, UAH: 0.026,
    ZAR: 0.054, ALL: 0.009, CDF: 0.00045, AND: 1.00, AED: 0.26, FKP: 1.17,
    CLP: 0.0011, ZMW: 0.049, BRL: 0.19, DJF: 0.0054, GHS: 0.074, HUF: 0.0027,
    AFN: 0.010, THB: 0.027, AZN: 0.55, AUD: 0.61, TWD: 0.029, YER: 0.0038,
    AWG: 0.51, BAM: 0.51, QAR: 0.26, LAK: 0.000049, PEN: 0.24, BIF: 0.00045,
    SLL: 0.000045, NOK: 0.089, IDR: 0.000061, AMD: 0.0023, ARS: 0.0035,
    COP: 0.00021, UZS: 0.000083, UGX: 0.00025, SAR: 0.25, MYR: 0.20,
    BGN: 0.51, ILS: 0.25, CRC: 0.0015, BBP: 1.17, HKD: 0.12, INR: 0.012,
    CNY: 0.13, JPY: 0.007, BOB: 0.14, NA : 1.00, "EUR European Euro" : 1.00, "ANG Netherlands Antillean guilder" : 0.5280, 
    "AED United Arab Emirates dirham" : 0.2582, "ZMW Zambian kwacha" : 0.0430 
};

// Fonction pour convertir un montant en euros
function convertToEuro(amount, currency) {
    const rate = exchangeRates[currency];
    if (rate) {
        return amount * rate;
    }
    console.warn(`Taux manquant pour la devise : ${currency}`);
    return null; // Si aucun taux n'est disponible
}

export function calculateAverageByExperience(data) {
    const groups = {};

    data.forEach(entry => {
        const experience = entry.YearsCodePro || 'NA';
        const currency = entry.Currency?.split('\t')[0];
        const salary = entry.CompTotal;

        // Vérifier si le salaire est valide et raisonnable
        if (!salary || salary === 'NA' || isNaN(parseFloat(salary)) || parseFloat(salary) > MAX_SALARY) {
            console.warn(`Salaire invalide ou trop élevé ignoré : ${salary}`);
            return;
        }

        const salaryInEuro = convertToEuro(parseFloat(salary), currency);

        if (salaryInEuro !== null && !isNaN(salaryInEuro)) {
            if (!groups[experience]) {
                groups[experience] = { total: 0, count: 0 };
            }
            groups[experience].total += salaryInEuro;
            groups[experience].count++;
        }
    });

    const result = Object.entries(groups).map(([experience, group]) => ({
        experience,
        averageSalary: group.total / group.count
    }));

    console.log(`Moyennes calculées pour l'expérience :`, result);
    return result;
}



export function calculateAverageByEducation(data) {
    const groups = {}; // Regrouper les données par niveau d'études

    data.forEach(entry => {
        const education = entry.EdLevel || 'NA'; // Récupérer le niveau d'études
        const currency = entry.Currency?.split('\t')[0]; // Récupérer la devise
        const salary = entry.CompTotal; // Récupérer le salaire brut

        // Vérifier si le salaire est valide et raisonnable
        if (!salary || salary === 'NA' || isNaN(parseFloat(salary)) || parseFloat(salary) > MAX_SALARY) {
            console.warn(`Salaire invalide ou trop élevé ignoré : ${salary}`);
            return;
        }

        // Convertir le salaire en euros
        const salaryInEuro = convertToEuro(parseFloat(salary), currency);

        if (salaryInEuro !== null && !isNaN(salaryInEuro)) {
            if (!groups[education]) {
                groups[education] = { total: 0, count: 0 };
            }
            groups[education].total += salaryInEuro;
            groups[education].count++;
        }
    });

    // Calculer la moyenne pour chaque niveau d'études
    const result = Object.entries(groups).map(([education, group]) => ({
        education,
        averageSalary: group.total / group.count
    }));

    console.log(`Moyennes calculées pour les niveaux d'études :`, result);
    return result;
}


// Créer ou mettre à jour un graphique avec Chart.js
function createOrUpdateChart(chart, data, labelsKey, valuesKey, chartId, label) {
    const ctx = document.getElementById(chartId).getContext('2d');
    const labels = data.map(d => d[labelsKey]);
    const values = data.map(d => d[valuesKey]);

    if (chart) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = values;
        chart.update();
        return chart;
    } else {
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: label,
                    data: values,
                    backgroundColor: 'blue',
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true
                    }
                }
            }
        });
    }
}

// Fonction pour créer ou mettre à jour le graphique des revenus par expérience
export function createOrUpdateExperienceChart(chart, data) {
    const ctx = document.getElementById('experienceChart').getContext('2d');
    const labels = data.map(d => d.experience);
    const values = data.map(d => d.averageSalary);

    if (chart) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = values;
        chart.update();
        return chart;
    } else {
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Revenu moyen (€)',
                    data: values,
                    backgroundColor: 'blue',
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Années d'expérience", // Légende pour l'axe X
                            font: {
                                size: 14, // Taille de police
                                weight: 'bold', // Style en gras
                            },
                            color: '#333', // Couleur du texte
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Revenu moyen (€)", // Légende pour l'axe Y
                            font: {
                                size: 14, // Taille de police
                                weight: 'bold', // Style en gras
                            },
                            color: '#333', // Couleur du texte
                        },
                        beginAtZero: true, // Commencer l'axe Y à 0
                    },
                },
            },
        });
    }
}


export function createOrUpdateEducationChart(chart, data) {
    const ctx = document.getElementById('educationChart').getContext('2d');
    const labels = data.map(d => d.education);
    const values = data.map(d => d.averageSalary);

    console.log(`Labels :`, labels);
    console.log(`Valeurs :`, values);

    if (chart) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = values;
        chart.update();
        return chart;
    } else {
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Revenu moyen (€)',
                    data: values,
                    backgroundColor: 'green',
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Revenu moyen (€)"
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: "Niveau d'études"
                        }
                    }
                }
            },
        });
    }
}
