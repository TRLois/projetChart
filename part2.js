import { 
    loadData, 
    calculateAverageByPCloud,
    createOrUpdatePCloud,
    calculateAverageByFrameworks,
    createOrUpdateFrameworks
} from './script.js';

$(document).ready(function () {
    let plateformeCloudChart = null;
    let frameworksDevWebChart = null;
    let allData = []; // Variable pour stocker toutes les données

    // Fonction pour mettre à jour les graphiques en fonction du pays ou de tous les pays
    async function updateCharts(continent, country = "") {
        try {
            // Filtrer les données (si un pays est sélectionné)
            const data = country 
                ? allData.filter(entry => entry.Country === country) 
                : allData; // Sinon, prendre toutes les données
            
            if (!data || !data.length) {
                console.error('Pas de données disponibles.');
                return;
            }

            console.log(`Données chargées pour ${country || "tous les pays"}.`);

            // 1. Mettre à jour le graphique des plateformes Cloud
            const pCloudData = calculateAverageByPCloud(data);
            console.log('Données pour plateformes Cloud:', pCloudData);
            plateformeCloudChart = createOrUpdatePCloud(plateformeCloudChart, pCloudData);

            // 2. Mettre à jour le graphique des frameworks
            const frameworksData = calculateAverageByFrameworks(data);
            console.log('Données pour frameworks:', frameworksData);
            frameworksDevWebChart = createOrUpdateFrameworks(frameworksDevWebChart, frameworksData);

            console.log("Graphiques mis à jour avec succès.");
        } catch (error) {
            console.error("Erreur lors de la mise à jour des graphiques :", error.message);
        }
    }

    // Fonction pour mettre à jour les pays en fonction du continent sélectionné
    function updateCountrySelect(continent) {
        const filePath = continent === 'Europe'
            ? './survey_results_WE.json'
            : './survey_results_NA.json';

        loadData(filePath).then(data => {
            allData = data; // Stocker les données globales
            const countries = [...new Set(data.map(entry => entry.Country))]; // Extraire les pays uniques
            const countrySelect = document.getElementById('countrySelect');
            countrySelect.innerHTML = ''; // Réinitialiser la liste des pays
            const defaultOption = document.createElement('option');
            defaultOption.value = ""; // Valeur par défaut (tous les pays)
            defaultOption.textContent = "Tous les pays";
            countrySelect.appendChild(defaultOption);
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                countrySelect.appendChild(option);
            });
            // Mettre à jour les graphiques avec les moyennes globales
            updateCharts(continent);
            console.log("Mise à jour initiale avec les moyennes globales réussie.");
        }).catch(error => {
            console.error('Erreur lors du chargement des données pour le continent:', error);
        });
    }

    // Gestion du changement de continent
    $('#continentSelect').on('change', function () {
        const selectedContinent = $(this).val();
        updateCountrySelect(selectedContinent);
        console.log("Changement de continent géré avec succès.");
    });

    // Gestion du changement de pays
    $('#countrySelect').on('change', function () {
        const selectedCountry = $(this).val();
        const selectedContinent = $('#continentSelect').val();
        updateCharts(selectedContinent, selectedCountry);
        console.log("Changement de pays géré avec succès.");
    });

    // Charger les pays et afficher les moyennes globales pour le continent par défaut (Europe)
    updateCountrySelect('Europe');
});