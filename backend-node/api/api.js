const axios = require('axios');

const getLiquidationHistory = async (req, res) => {
  try {
    const { exchange, symbol, interval, limit, startTime, endTime } = req.query;
    const apiKey = process.env.COINGLASS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not found' });
    }

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
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getLiquidationHistory };
