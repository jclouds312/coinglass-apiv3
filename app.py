from flask import Flask, jsonify, request
from coinglass_api import CoinglassAPI
import os

app = Flask(__name__)

# Initialize Coinglass API
api_key = os.environ.get('COINGLASS_API_KEY')
if not api_key:
    raise ValueError("COINGLASS_API_KEY environment variable not set.")

cg_api = CoinglassAPI(api_key)

@app.route('/liquidation_heatmap', methods=['GET'])
def get_liquidation_heatmap():
    exchange = request.args.get('exchange', default='Binance', type=str)
    symbol = request.args.get('symbol', default='BTCUSDT', type=str)
    interval = request.args.get('interval', default='1h', type=str)
    limit = request.args.get('limit', default=100, type=int)

    try:
        data = cg_api.liquidation_heatmap(exchange=exchange, symbol=symbol, interval=interval, limit=limit)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)