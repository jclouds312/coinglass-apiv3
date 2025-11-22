
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-link');
    const contents = document.querySelectorAll('.tab-content');
    const apiKeyInput = document.getElementById('api-key-input');
    const saveApiKeyBtn = document.getElementById('save-api-key');
    const showApiKeyCheckbox = document.getElementById('show-api-key');
    const technicalAnalysisGaugeCtx = document.getElementById('technical-analysis-gauge').getContext('2d');
    const hamburgerBtn = document.querySelector('.hamburger-button');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    // Hamburger menu logic
    hamburgerBtn.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
    });

    window.addEventListener('click', (e) => {
        if (!hamburgerBtn.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });

    // Dropdown menu tab switching
    dropdownMenu.addEventListener('click', (e) => {
        if (e.target.matches('[data-tab]')) {
            const tab = e.target.dataset.tab;
            tabs.forEach(item => item.classList.remove('active'));
            contents.forEach(content => content.classList.remove('active'));
            document.getElementById(tab).classList.add('active');
            dropdownMenu.classList.remove('show');
        }
    });

    // Tab switching logic
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(item => item.classList.remove('active'));
            contents.forEach(content => content.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // Save API key
    saveApiKeyBtn.addEventListener('click', () => {
        const apiKey = apiKeyInput.value;
        if (apiKey) {
            fetch('/api/save-key', { // Assuming an endpoint to save the key
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiKey }),
            })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    alert('API Key guardada con éxito.');
                    fetchData(); // Fetch data once the key is saved
                } else {
                    alert('Error al guardar la API Key.');
                }
            });
        }
    });

    // Show/Hide API key
    showApiKeyCheckbox.addEventListener('change', () => {
        if (showApiKeyCheckbox.checked) {
            apiKeyInput.type = 'text';
        } else {
            apiKeyInput.type = 'password';
        }
    });

    // Technical Analysis Gauge
    const gauge = new Chart(technicalAnalysisGaugeCtx, {
        type: 'doughnut',
        data: {
            labels: ['Venta Fuerte', 'Venta', 'Neutral', 'Compra', 'Compra Fuerte'],
            datasets: [{
                data: [0, 0, 100, 0, 0], // Initial state
                backgroundColor: ['#f44336', '#ff9800', '#ffeb3b', '#4caf50', '#2196f3'],
                borderWidth: 0,
                circumference: 180, // Half circle
                rotation: 270, // Start from the bottom
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });

    // Fetch data from Coinglass
    function fetchData() {
        fetch('/api/liquidation-history?exchange=Binance&symbol=BTC&interval=h1&limit=10')
            .then(response => response.json())
            .then(apiData => {
                if(apiData.success) {
                    const latestData = apiData.data[apiData.data.length - 1];
                    // Example of updating the gauge. You need to define how to interpret the data.
                    // This is just a placeholder logic.
                    const { price, volume } = latestData;
                    let sell = 0, neutral = 0, buy = 0;
                    if (volume > 16000000) {
                        buy = 20;
                    } else if (volume < 15500000) {
                        sell = 20;
                    } else {
                        neutral = 20;
                    }
                    updateGauge(sell, neutral, buy);
                } else {
                    console.log('Failed to fetch data, using mock data or showing error.');
                    // Keep initial state or show error message
                }
            });
    }

    // Update gauge based on analysis
    function updateGauge(sell, neutral, buy) {
        const total = sell + neutral + buy;
        if(total === 0) return;
        const sellPercentage = (sell / total) * 100;
        const neutralPercentage = (neutral / total) * 100;
        const buyPercentage = (buy / total) * 100;

        document.getElementById('sell-value').textContent = sell;
        document.getElementById('neutral-value').textContent = neutral;
        document.getElementById('buy-value').textContent = buy;

        // Update chart data
        gauge.data.datasets[0].data = [sell, 0, neutral, 0, buy]; // Simplified for 5 sections
        gauge.update();
    }

    // Initial data fetch
    fetchData();
});
