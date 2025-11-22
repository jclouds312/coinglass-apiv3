
const express = require('express');
const path = require('path');
const fs = require('fs');
const { getLiquidationHistory } = require('./api/api');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public/static')));

// API endpoint
app.get('/api/liquidation-history', getLiquidationHistory);

// Endpoint to save API key
app.post('/api/save-key', (req, res) => {
    const { apiKey } = req.body;
    if (apiKey) {
        // In a real app, you'd want to store this more securely.
        // For this example, we'll write it to a .env file.
        fs.writeFileSync('.env', `COINGLASS_API_KEY=${apiKey}`);
        process.env.COINGLASS_API_KEY = apiKey; // Update the current process
        res.json({ success: true, message: 'API key saved.' });
    } else {
        res.status(400).json({ success: false, message: 'API key is required.' });
    }
});

// Handle all other requests by serving the main HTML file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/static', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
