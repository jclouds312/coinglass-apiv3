
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-link');
    const contents = document.querySelectorAll('.tab-content');
    const apiKeyInput = document.getElementById('api-key-input');
    const saveApiKeyBtn = document.getElementById('save-api-key');
    const showApiKeyCheckbox = document.getElementById('show-api-key');
    const technicalAnalysisGaugeCtx = document.getElementById('technical-analysis-gauge').getContext('2d');

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
            // Here you would typically send the API key to the backend to be stored securely
            console.log('API Key saved:', apiKey);
            alert('API Key guardada con éxito.');
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
                data: [10, 15, 20, 25, 30],
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

    // Update gauge based on analysis
    function updateGauge(sell, neutral, buy) {
        const total = sell + neutral + buy;
        const sellPercentage = (sell / total) * 100;
        const neutralPercentage = (neutral / total) * 100;
        const buyPercentage = (buy / total) * 100;

        document.getElementById('sell-value').textContent = sell;
        document.getElementById('neutral-value').textContent = neutral;
        document.getElementById('buy-value').textContent = buy;

        let pointerValue = 50; // Default to neutral
        if (buy > sell) {
            pointerValue = 50 + (buy / (buy + sell)) * 50;
        } else if (sell > buy) {
            pointerValue = 50 - (sell / (buy + sell)) * 50;
        }

        // This is a simplified logic for the needle. A real implementation might be more complex.
        const needle = {
            id: 'needle',
            afterDatasetDraw(chart, args, options) {
                const { ctx, data } = chart;
                const angle = Math.PI * (pointerValue / 100) - Math.PI / 2;

                const x = chart.getDatasetMeta(0).data[0].x;
                const y = chart.getDatasetMeta(0).data[0].y;

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle);
                ctx.beginPath();
                ctx.moveTo(0, -5);
                ctx.lineTo(80, 0);
                ctx.lineTo(0, 5);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
                ctx.restore();
            }
        };

        gauge.config.plugins = [needle];
        gauge.update();
    }

    // Initial gauge update
    updateGauge(7, 8, 11);
});
