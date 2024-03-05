const wifi = require('node-wifi');

// Esegui il polling fino a quando la rete desiderata non è disponibile o si preme Ctrl-C
const pollInterval = 2000; // Millisecondi tra i tentativi di connessione
const maxAttempts = 100; // Numero massimo di tentativi


wifi.init({
    iface: null // Lascia iface a null per utilizzare l'interfaccia predefinita
});

let stopPolling = false;
let attempts = 0;

// Gestisci la pressione di Ctrl-C
process.on('SIGINT', () => {
    console.log('\nInterruzione da parte dell\'utente. Uscita...');
    stopPolling = true;
    process.exit();
});

// Funzione per connettersi alla rete WiFi in modo asincrono
async function connectToWiFiAsync(ssid) {
    return new Promise((resolve, reject) => {
        const connectHandler = async () => {
            try {
                await connectToWiFi(ssid);
                resolve();
            } catch (error) {
                reject(error);
            }
        };

        const pollFunction = async () => {
            attempts++;

            if (stopPolling) {
                reject(new Error('Interruzione da parte dell\'utente.'));
                return;
            }

            if (attempts > maxAttempts) {
                reject(new Error(`Impossibile connettersi a ${ssid} dopo ${maxAttempts} tentativi.`));
                return;
            }

            try {
                const networks = await scanForNetworks();
                const foundNetwork = networks.find(network => network.ssid === ssid);

                if (foundNetwork) {
                    connectHandler();
                } else {
                    setTimeout(pollFunction, pollInterval);
                }
            } catch (error) {
                reject(error);
            }
        };

        // Inizia il polling
        pollFunction();
    });
}

// Funzione per ottenere una lista di reti WiFi disponibili
function scanForNetworks() {
    return new Promise((resolve, reject) => {
        wifi.scan((err, networks) => {
            if (err) {
                reject(err);
            } else {
                resolve(networks);
            }
        });
    });
}

// Funzione per connettersi a una rete WiFi
function connectToWiFi(ssid) {
    return new Promise((resolve, reject) => {
        wifi.connect({ ssid }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}


module.exports.TelloWIFIConnect = async function (desiredSSID) {

    //--------------------------------------------------------------
    try {
        console.log(`Attendo la disponibilità della rete "${desiredSSID}"...`);
        await connectToWiFiAsync(desiredSSID);
        console.log(`Connesso a "${desiredSSID}" con successo!`);
    } catch (error) {
        console.error('Errore:', error.message);
    }
    //--------------------------------------------------------------

}