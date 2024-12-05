import { 
    loadData, 
    calculateAverageByExperience, 
    createOrUpdateExperienceChart, 
    calculateAverageByEducation, 
    createOrUpdateEducationChart, 
    calculateTopOperatingSystems, 
    createOrUpdateOperatingSystemsPieChart,
    calculateTopCommunicationTools,
    createOrUpdateCommunicationToolsPieChart
} from './script.js';

let experienceChart = null;
let educationChart = null;
let operatingSystemsChart = null;
let communicationToolsChart = null;


async function updateCharts(continent) {
    try {
        const filePath = continent === 'Europe'
            ? './survey_results_WE.json'
            : './survey_results_NA.json';

        // Charger les données
        const data = await loadData(filePath);

        // Mettre à jour le graphique des expériences
        const experienceData = calculateAverageByExperience(data);
        experienceChart = createOrUpdateExperienceChart(experienceChart, experienceData);

        // Mettre à jour le graphique des niveaux d'études
        const educationData = calculateAverageByEducation(data);
        educationChart = createOrUpdateEducationChart(educationChart, educationData);
    } catch (error) {
        console.error("Erreur lors de la mise à jour des graphiques :", error.message);
    }
}

async function updateOSChart(continent, devType = '', topCount = 5) {
    try {
        const filePath = continent === 'Europe'
            ? './survey_results_WE.json'
            : './survey_results_NA.json';

        const data = await loadData(filePath);

        // Calculer les systèmes d'exploitation les plus utilisés
        const osData = calculateTopOperatingSystems(data, devType, topCount);

        // Mettre à jour ou créer le graphique
        operatingSystemsChart = createOrUpdateOperatingSystemsPieChart(operatingSystemsChart, osData);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du graphique des systèmes d'exploitation :", error.message);
    }
}

async function updateCommunicationToolsChart(continent, devType = '', topN = 5) {
    try {
        const filePath = continent === 'Europe'
            ? './survey_results_WE.json'
            : './survey_results_NA.json';

        const data = await loadData(filePath);

        const toolsData = calculateTopCommunicationTools(data, devType, topN);
        console.log("Données préparées pour le graphique des outils de communication :", toolsData);

        communicationToolsChart = createOrUpdateCommunicationToolsPieChart(communicationToolsChart, toolsData);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du graphique des outils de communication :", error.message);
    }
}



/// Gestion des changements dans le menu déroulant pour le continent
document.getElementById('continentSelect').addEventListener('change', (event) => {
    const selectedContinent = event.target.value;

    // Mettre à jour les graphiques principaux (expérience et niveaux d'études)
    updateCharts(selectedContinent);

    // Mettre à jour le graphique des systèmes d'exploitation
    const selectedDevType = document.getElementById('devTypeSelect').value;
    const selectedTopCount = parseInt(document.getElementById('topCountSelect').value, 10);
    updateOSChart(selectedContinent, selectedDevType, selectedTopCount);

    // Mettre à jour le graphique des outils de communication
    const communicationDevType = document.getElementById('devType').value;
    const communicationTopN = parseInt(document.getElementById('topNSelect').value, 10);
    updateCommunicationToolsChart(selectedContinent, communicationDevType, communicationTopN);
});

// Gestion des changements dans le menu déroulant pour le métier des systèmes d'exploitation
document.getElementById('devTypeSelect').addEventListener('change', () => {
    const selectedContinent = document.getElementById('continentSelect').value;
    const selectedDevType = document.getElementById('devTypeSelect').value;
    const selectedTopCount = parseInt(document.getElementById('topCountSelect').value, 10);
    updateOSChart(selectedContinent, selectedDevType, selectedTopCount);
});

// Gestion des changements dans le menu déroulant pour le nombre de technologies (topCount) des systèmes d'exploitation
document.getElementById('topCountSelect').addEventListener('change', () => {
    const selectedContinent = document.getElementById('continentSelect').value;
    const selectedDevType = document.getElementById('devTypeSelect').value;
    const selectedTopCount = parseInt(document.getElementById('topCountSelect').value, 10);
    updateOSChart(selectedContinent, selectedDevType, selectedTopCount);
});

// Gestion des changements dans le menu déroulant pour le métier des outils de communication
document.getElementById('devType').addEventListener('change', () => {
    const continent = document.getElementById('continentSelect').value;
    const devType = document.getElementById('devType').value;
    const topN = parseInt(document.getElementById('topNSelect').value, 10);
    updateCommunicationToolsChart(continent, devType, topN);
});

// Gestion des changements dans le menu déroulant pour le nombre de technologies (topN) des outils de communication
document.getElementById('topNSelect').addEventListener('change', () => {
    const continent = document.getElementById('continentSelect').value;
    const devType = document.getElementById('devType').value;
    const topN = parseInt(document.getElementById('topNSelect').value, 10);
    updateCommunicationToolsChart(continent, devType, topN);
});


// Chargement initial des graphiques (Europe par défaut)
updateCharts('Europe'); // Expérience et niveaux d'études
updateOSChart('Europe', '', 5); // OS, tous métiers, top 5
updateCommunicationToolsChart('Europe', '', 5);



