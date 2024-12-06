import { 
    loadData, 
    calculateTopOperatingSystems, 
    createOrUpdateOperatingSystemsPieChart,
    calculateTopCommunicationTools,
    createOrUpdateCommunicationToolsPieChart
} from './script.js';

// Fonction exécutée lorsque le DOM est prêt
$(document).ready(function() {

    let operatingSystemsChart = null;
    let communicationToolsChart = null;

    //Fonction : mise à jour du grahique "Systemes d'exploitation"
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


    //Fonction : mise à jour du graphique "Outils de communication"
    async function updateCommunicationToolsChart(continent, devType = '', topN = 5) {
        try {
            const filePath = continent === 'Europe'
                ? './survey_results_WE.json'
                : './survey_results_NA.json';

            const data = await loadData(filePath);
            console.log("dataOutils Com OK",data);

            const toolsData = calculateTopCommunicationTools(data, devType, topN);
            console.log("Données préparées pour le graphique des outils de communication :", toolsData);

            communicationToolsChart = createOrUpdateCommunicationToolsPieChart(communicationToolsChart, toolsData);
        } catch (error) {
            console.error("Erreur lors de la mise à jour du graphique des outils de communication :", error.message);
        }
    }



    /// Gestion des changements du menu déroulant  "Continent"
    document.getElementById('continentSelect').addEventListener('change', (event) => {
        const selectedContinent = event.target.value;

        // Mettre à jour le graphique des systèmes d'exploitation
        const selectedDevType = document.getElementById('devTypeSelect').value;
        const selectedTopCount = parseInt(document.getElementById('topCountSelect').value, 10);
        updateOSChart(selectedContinent, selectedDevType, selectedTopCount);

        // Mettre à jour le graphique des outils de communication
        const communicationDevType = document.getElementById('devType').value;
        const communicationTopN = parseInt(document.getElementById('topNSelect').value, 10);
        updateCommunicationToolsChart(selectedContinent, communicationDevType, communicationTopN);
    });



    //// Gestion des changement "Partie systeme d'exploitation"
    // Gestion des changements du menu déroulant "métier"
    document.getElementById('devTypeSelect').addEventListener('change', () => {
        const selectedContinent = document.getElementById('continentSelect').value;
        const selectedDevType = document.getElementById('devTypeSelect').value;
        const selectedTopCount = parseInt(document.getElementById('topCountSelect').value, 10);
        updateOSChart(selectedContinent, selectedDevType, selectedTopCount);
    });

    // Gestion des changements du menu déroulant "nb technologies (topCount)"
    document.getElementById('topCountSelect').addEventListener('change', () => {
        const selectedContinent = document.getElementById('continentSelect').value;
        const selectedDevType = document.getElementById('devTypeSelect').value;
        const selectedTopCount = parseInt(document.getElementById('topCountSelect').value, 10);
        updateOSChart(selectedContinent, selectedDevType, selectedTopCount);
    });


    //// Gestion des changement "Partie outils de communication"
    // Gestion des changements du menu déroulant "métier"
    document.getElementById('devType').addEventListener('change', () => {
        const continent = document.getElementById('continentSelect').value;
        const devType = document.getElementById('devType').value;
        const topN = parseInt(document.getElementById('topNSelect').value, 10);
        updateCommunicationToolsChart(continent, devType, topN);
    });

    // Gestion des changements du menu déroulant "nb technologies (topN)"
    document.getElementById('topNSelect').addEventListener('change', () => {
        const continent = document.getElementById('continentSelect').value;
        const devType = document.getElementById('devType').value;
        const topN = parseInt(document.getElementById('topNSelect').value, 10);
        updateCommunicationToolsChart(continent, devType, topN);
    });


    // Chargement initial des graphiques (Europe par défaut)
    updateOSChart('Europe', '', 5); // OS, tous métiers, top 5
    updateCommunicationToolsChart('Europe', '', 5);




});
