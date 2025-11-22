
const express = require('express');
const path = require('path');
const { getLiquidationHistory } = require('./api/api');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public/static')));

// API endpoint
app.get('/api/liquidation-history', getLiquidationHistory);

// Handle all other requests by serving the main HTML file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/static', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
