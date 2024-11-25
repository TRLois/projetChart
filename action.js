import fs from 'fs/promises'; // Pour lire et écrire les fichiers
import fetch from 'node-fetch'; // Si votre version de Node.js ne supporte pas fetch, installez avec `npm install node-fetch`

// Charger les données JSON depuis un fichier
async function loadData(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Erreur lors du chargement du fichier : ${filePath}`, error);
        return [];
    }
}

// Sauvegarder les données dans un fichier JSON
async function saveData(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`Les données ont été sauvegardées dans le fichier : ${filePath}`);
    } catch (error) {
        console.error(`Erreur lors de la sauvegarde du fichier : ${filePath}`, error);
    }
}

// Récupérer les taux de change via une API
async function fetchExchangeRates(baseCurrency = 'EUR') {
    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des taux de change.');
        const data = await response.json();
        return data.rates;
    } catch (error) {
        console.error('Erreur lors du chargement des taux de change :', error.message);
        return {};
    }
}

// Convertir les salaires dans une devise donnée (EUR ici)
async function convertCompTotalToEuro(data, rates) {
    return data.map(entry => {
        const currencyCode = entry.Currency?.split('\t')[0]; // Extraire le code devise
        const compTotal = parseFloat(entry.CompTotal);

        if (currencyCode && compTotal && rates[currencyCode]) {
            const compTotalInEuro = compTotal / rates[currencyCode];
            return { ...entry, CompTotalInEuro: compTotalInEuro.toFixed(2) };
        }

        return { ...entry, CompTotalInEuro: null };
    });
}

// Processus complet : charger, convertir et sauvegarder
async function processAndSave(filePath, outputFilePath, rates) {
    const data = await loadData(filePath);
    const convertedData = await convertCompTotalToEuro(data, rates);
    await saveData(outputFilePath, convertedData);
}

// Fonction principale
async function main() {
    try {
        console.log('Récupération des taux de change...');
        const rates = await fetchExchangeRates();

        console.log('Conversion des fichiers JSON...');
        await processAndSave('./survey_results_WE.json', './survey_results_WE_converted.json', rates);
        await processAndSave('./survey_results_NA.json', './survey_results_NA_converted.json', rates);

        console.log('Conversion terminée : Les fichiers ont été mis à jour avec les salaires en euros.');
    } catch (error) {
        console.error('Erreur lors de l\'exécution :', error.message);
    }
}

// Exécuter le script principal
main();
