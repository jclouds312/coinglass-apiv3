require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { getLiquidationHistory } = require('./api/api');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use(cors());
app.use(express.json());

app.get('/api/liquidation-history', getLiquidationHistory);

// For any other request, serve the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Node.js backend is running on port ${port}, serving the frontend and providing the API.`);
});
