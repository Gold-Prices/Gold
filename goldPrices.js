const goldConversion = {
    USDToJD: 0.70, 
    Wight: {
        gram: 1,
        RashadiLira: 7.2,
        EnglishLira: 7.98805,
        Ounce: 31.1034786
    },
    Purity: {
        K24: 24 / 24,
        K21: 21 / 24,
        K18: 18 / 24
    }
};

const goldContainer = document.getElementById('gold-container');
const toggleBtn = document.getElementById('toggle-btn');
const timeLabel = document.getElementById('update-time');

function fetchGoldData() {
    fetch('https://api.gold-api.com/price/XAU')
        .then(response => response.json())
        .then(data => {
            const OuncePriceInUsd = data.price;
            const gram24KUsd = OuncePriceInUsd / goldConversion.Wight.Ounce;

            const goldItems = [
                { name: "Gold 24K (1g)", usd: gram24KUsd * goldConversion.Purity.K24 },
                { name: "Gold 21K (1g)", usd: gram24KUsd * goldConversion.Purity.K21 },
                { name: "Gold 18K (1g)", usd: gram24KUsd * goldConversion.Purity.K18 },
                { name: "Rashadi Lira", usd: (gram24KUsd * goldConversion.Purity.K21) * goldConversion.Wight.RashadiLira },
                { name: "English Lira", usd: (gram24KUsd * goldConversion.Purity.K21) * goldConversion.Wight.EnglishLira },
                { name: "Global Ounce", usd: OuncePriceInUsd }
            ];

            // Map USD versions
            const dataUSD = goldItems.map(item => ({
                name: item.name,
                price: item.usd.toFixed(2),
                unit: "$"
            }));

            // Map JOD versions
            const dataJOD = goldItems.map(item => ({
                name: item.name,
                price: (item.usd * goldConversion.USDToJD).toFixed(3),
                unit: "JD"
            }));

            const storeGoldData = {
                USD: dataUSD,
                JOD: dataJOD,
                lastUpdate: new Date().toLocaleTimeString()
            };

            localStorage.setItem('gold_prices', JSON.stringify(storeGoldData));
            
            // Show USD by default
            renderDisplay("USD");
        })
        .catch(error => {
            goldContainer.textContent = "Error loading data.";
            console.error(error);
        });
}

function renderDisplay(currency) {
    const stored = JSON.parse(localStorage.getItem('gold_prices'));
    if (!stored) return;

    const listToDisplay = stored[currency];
    goldContainer.innerHTML = ""; 
    timeLabel.textContent = `Last update: ${stored.lastUpdate}`;

    listToDisplay.forEach(item => {
        const div = document.createElement('div');
        div.className = "gold-item";
        div.innerHTML = `<span>${item.name}</span> <span class="price-val">${item.price} ${item.unit}</span>`;
        goldContainer.appendChild(div);
    });
}

// // Button Toggle Logic
// toggleBtn.addEventListener('click', function() {
//     const currentMode = this.getAttribute('data-mode');
//     const nextMode = currentMode === "USD" ? "JOD" : "USD";
//     const labelMode = currentMode === "USD" ? "USD" : "JOD"; // Text for the button to switch back
    
//     this.setAttribute('data-mode', nextMode);
//     this.textContent = `Switch to ${labelMode}`; 
//     renderDisplay(nextMode);
// });

// // Run
// fetchGoldData();