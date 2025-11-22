const axios = require('axios');

// Mock data to be used when the API key is not available
const mockData = {
  "success": true,
  "data": [
    { "price": 67000, "volume": 15000000, "createTime": Date.now() - 3600000 * 5 },
    { "price": 67200, "volume": 16000000, "createTime": Date.now() - 3600000 * 4 },
    { "price": 67100, "volume": 15500000, "createTime": Date.now() - 3600000 * 3 },
    { "price": 67300, "volume": 17000000, "createTime": Date.now() - 3600000 * 2 },
    { "price": 67400, "volume": 18000000, "createTime": Date.now() - 3600000 * 1 }
  ]
};

const getLiquidationHistory = async (req, res) => {
  const apiKey = process.env.COINGLASS_API_KEY;

  // If the API key is missing or is the placeholder, return mock data
  if (!apiKey || apiKey === 'YOUR_API_KEY') {
    console.log('API key not found or is placeholder. Returning mock data.');
    return res.json(mockData);
  }

  try {
    const { exchange, symbol, interval, limit, startTime, endTime } = req.query;

    const response = await axios.get('https://open-api-v3.coinglass.com/api/futures/liquidation/v2/history', {
      headers: {
        'CG-API-KEY': apiKey,
      },
      params: {
        exchange,
        symbol,
        interval,
        limit,
        startTime,
        endTime,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching from Coinglass API:', error.message);
    // If the API call fails, return mock data as a fallback
    res.status(500).json(mockData);
  }
};

module.exports = { getLiquidationHistory };