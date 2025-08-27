
document.addEventListener('DOMContentLoaded', () => {
    const endpointSelect = document.getElementById('endpoint-select');
    const paramsContainer = document.getElementById('params-container');
    const fetchButton = document.getElementById('fetch-button');
    const resultContainer = document.getElementById('result');

    const API_BASE_URL = 'http://localhost:8080'; // The base URL of the backend API

    let endpoints = [];

    // Fetch the list of endpoints from the backend
    fetch(`${API_BASE_URL}/api`)
        .then(response => response.json())
        .then(data => {
            endpoints = data.endpoints;
            populateEndpointSelect();
            // Trigger change event to load params for the first endpoint
            endpointSelect.dispatchEvent(new Event('change'));
        })
        .catch(error => {
            resultContainer.textContent = `Error fetching endpoints: ${error.message}`;
        });

    function populateEndpointSelect() {
        endpoints.forEach(endpoint => {
            const option = document.createElement('option');
            option.value = endpoint;
            option.textContent = endpoint;
            endpointSelect.appendChild(option);
        });
    }

    endpointSelect.addEventListener('change', () => {
        const selectedEndpoint = endpointSelect.value;
        const endpointName = selectedEndpoint.split('/').pop(); // Get the last part of the path
        const params = getParamsForEndpoint(endpointName);
        createParamInputs(params);
    });

    function createParamInputs(params) {
        paramsContainer.innerHTML = ''; // Clear previous params
        params.forEach(param => {
            const paramDiv = document.createElement('div');
            paramDiv.classList.add('param');

            const label = document.createElement('label');
            label.textContent = param;
            paramDiv.appendChild(label);

            const input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('name', param);
            paramDiv.appendChild(input);

            paramsContainer.appendChild(paramDiv);
        });
    }

    fetchButton.addEventListener('click', () => {
        const selectedEndpoint = endpointSelect.value;
        const paramInputs = paramsContainer.querySelectorAll('input');
        const queryParams = new URLSearchParams();

        paramInputs.forEach(input => {
            if (input.value) {
                queryParams.set(input.name, input.value);
            }
        });

        const queryString = queryParams.toString();
        const fetchUrl = `${API_BASE_URL}${selectedEndpoint}${queryString ? '?' + queryString : ''}`;

        resultContainer.textContent = 'Fetching data...';

        fetch(fetchUrl)
            .then(response => response.json())
            .then(data => {
                resultContainer.textContent = JSON.stringify(data, null, 2);
            })
            .catch(error => {
                resultContainer.textContent = `Error: ${error.message}`;
            });
    });

    function getParamsForEndpoint(endpointName) {
        // This logic is based on the backend API structure
        switch (endpointName) {
            case 'history':
                return ['exchange', 'symbol', 'interval', 'limit'];
            case 'aggregated-history':
                return ['symbol', 'interval', 'limit'];
            case 'coin-list':
                return ['ex'];
            case 'exchange-list':
                return ['symbol', 'range'];
            case 'global-history':
            case 'top-account-history':
            case 'top-position-history':
            case 'ohlc-history':
                return ['exchange', 'symbol', 'interval', 'limit'];
            case 'coins-markets':
                return ['exchanges', 'page_num', 'page_size'];
            case 'pairs-markets':
            case 'spot-pairs-markets':
                return ['symbol'];
            default:
                return [];
        }
    }
});
