document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:3000'; // The base URL of the Node.js backend API

    // Chart.js instance
    let priceChart = null;

    // Fetch data and update the dashboard
    function updateDashboard() {
        fetch(`${API_BASE_URL}/api/liquidation-history?exchange=BINANCE&symbol=BTC&interval=h1&limit=100`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const priceData = data.data;
                    const latestData = priceData[priceData.length - 1];

                    // Update stats
                    document.getElementById('current-price').textContent = `$${latestData.price.toLocaleString()}`;
                    document.getElementById('high-price').textContent = `$${Math.max(...priceData.map(d => d.price)).toLocaleString()}`;
                    document.getElementById('low-price').textContent = `$${Math.min(...priceData.map(d => d.price)).toLocaleString()}`;
                    document.getElementById('volume').textContent = latestData.volume.toLocaleString();

                    // Update chart
                    updateChart(priceData);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    // Initialize or update the Chart.js chart
    function updateChart(priceData) {
        const ctx = document.getElementById('price-chart').getContext('2d');
        const labels = priceData.map(d => new Date(d.createTime).toLocaleTimeString());
        const prices = priceData.map(d => d.price);

        if (priceChart) {
            priceChart.data.labels = labels;
            priceChart.data.datasets[0].data = prices;
            priceChart.update();
        } else {
            priceChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'BTC Price (USD)',
                        data: prices,
                        borderColor: '#1a73e8',
                        backgroundColor: 'rgba(26, 115, 232, 0.1)',
                        fill: true,
                        tension: 0.4, // Make the line smooth
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Time'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Price (USD)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    // Initial load and periodic updates
    updateDashboard();
    setInterval(updateDashboard, 60000); // Update every minute
});