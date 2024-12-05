import { 
    loadData, 
    treatData,
    calculateAverageByExperience, 
    createOrUpdateExperienceChart,
    calculateAverageByEducation,
    createOrUpdateEducationChart
} from './script.js';

let experienceChart = null;
let educationChart = null;

// Fonction pour mettre à jour le graphique des expériences
async function updateExperienceChart(continent) {
    try {
        const filePath = continent === 'Europe'
            ? './survey_results_WE.json'
            : './survey_results_NA.json';

        const data = await loadData(filePath);
        const averages = calculateAverageByExperience(data);

        experienceChart = createOrUpdateExperienceChart(experienceChart, averages);
    } catch (error) {
        console.error("Erreur détectée :", error.message);
    }
}

// Fonction pour mettre à jour le graphique des niveaux d'études
async function updateEducationChart(continent) {
    try {
        const filePath = continent === 'Europe'
            ? './survey_results_WE.json'
            : './survey_results_NA.json';

        const data = await loadData(filePath);
        const averages = calculateAverageByEducation(data);

        educationChart = createOrUpdateEducationChart(educationChart, averages);
    } catch (error) {
        console.error("Erreur détectée :", error.message);
    }
}

// Écouter les changements dans la liste déroulante
document.getElementById('continentSelect').addEventListener('change', (event) => {
    const continent = event.target.value;
    // Charger les données du continent
    // traiter les données obtenues
    const filePath = continent === 'Europe'
            ? './survey_results_WE.json'
            : './survey_results_NA.json';

    const rawdata = loadData(filePath);
    const data = treatData(rawdata)
    updateExperienceChart(data);
    updateEducationChart(data);
});

// Charger les graphiques initiaux (Europe par défaut)
const filePath = './survey_results_WE.json';

const rawdata = loadData(filePath);
const data = treatData(rawdata)
updateExperienceChart('Europe');
updateEducationChart('Europe');
