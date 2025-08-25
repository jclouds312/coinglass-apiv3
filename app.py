import dash
from dash import dcc
from dash import html
import plotly.express as px
import pandas as pd
import plotly.graph_objects as go
import os
from coinglass_api.api import CoinglassAPIv3, CoinglassAPIError, CoinglassRequestError, RateLimitExceededError
from flask import jsonify # Import jsonify

app = dash.Dash(__name__)

# Initialize Coinglass API
api_key = os.environ.get('COINGLASS_API_KEY')
if not api_key:
    raise ValueError("COINGLASS_API_KEY environment variable not set.")

cg_api = CoinglassAPIv3(api_key)

app.layout = html.Div(children=[
    html.H1(children='Coinglass Dashboard'),

    html.Div([
        dcc.Graph(
 id='ohlc-graph',
        ),
    ], style={'width': '49%', 'display': 'inline-block', 'padding': '0 20'}),

 html.Div([
        dcc.Graph(
 id='liquidation-heatmap-graph',
        ),
    ], style={'width': '49%', 'display': 'inline-block', 'padding': '0 20'}),

    dcc.Interval(
        id='interval-component',
 interval=10*1000, # in milliseconds (update every 10 seconds)
        n_intervals=0
    )
])

@app.callback(dash.Output('ohlc-graph', 'figure'),
              dash.Input('interval-component', 'n_intervals'))
def update_ohlc_graph(n):
    try:
        # Get OHLC history data
        ohlc_df = cg_api.ohlc_history(exchange="Binance", symbol="BTCUSDT", interval="1h", limit=100)
        
        if not ohlc_df.empty:
            fig = go.Figure(data=[go.Candlestick(x=ohlc_df.index,
                open=ohlc_df['o'],
                high=ohlc_df['h'],
                low=ohlc_df['l'],
                close=ohlc_df['c'])])
            
            fig.update_layout(title="BTCUSDT OHLC History (Binance, 1h)", xaxis_title="Time", yaxis_title="Price (USD)")
            return fig
        else:
            return go.Figure().update_layout(title="No OHLC data available") # Return an empty figure

    except (CoinglassAPIError, CoinglassRequestError, RateLimitExceededError) as e:
        print(f"API error updating OHLC graph: {e}")
        return go.Figure().update_layout(title=f"Error: {e}") # Display error on the graph


@app.callback(dash.Output('liquidation-heatmap-graph', 'figure'),
              dash.Input('interval-component', 'n_intervals'))
def update_liquidation_heatmap_graph(n):
 try:
        # Get liquidation heatmap data
        liq_heatmap_data = cg_api.liquidation_heatmap_model2(exchange="Binance", symbol="BTCUSDT", range="12h")
        # Process data for heatmap - assuming 'liquidations' key contains the relevant DataFrame
        if 'liquidations' in liq_heatmap_data and not liq_heatmap_data['liquidations'].empty:
            liq_df = liq_heatmap_data['liquidations']
            fig = px.density_heatmap(liq_df, x="price", y="liquidation_value", title="BTCUSDT Liquidation Heatmap (12h)")
            return fig
        else:
            return px.scatter(title="No liquidation data available") # Return an empty scatter plot or similar

    except (CoinglassAPIError, CoinglassRequestError, RateLimitExceededError) as e:
        print(f"API error updating graph: {e}")
        return px.scatter(title=f"Error: {e}") # Display error on the graph

# New Endpoint for Liquidation Data (JSON) with parameters
@app.server.route('/liquidation_data/<exchange>/<symbol>/<range>/<interval>/<limit>') # Use app.server.route for Flask routes
def get_liquidation_data(exchange, symbol, range, interval, limit):
    try:
        # Convert limit to integer
        limit_int = int(limit)

        liq_heatmap_data = cg_api.liquidation_heatmap_model2(
            exchange=exchange,
            symbol=symbol,
            range=range,
            interval=interval,
            limit=limit_int # Use the integer limit
        )

        if 'liquidations' in liq_heatmap_data and not liq_heatmap_data['liquidations'].empty:
            liq_df = liq_heatmap_data['liquidations']
            # Convert DataFrame to a list of dictionaries for JSON serialization
            return jsonify(liq_df.to_dict('records'))
        else:
            return jsonify({"message": "No liquidation data available for the given parameters"}), 404

    except ValueError:
        return jsonify({"error": "Invalid limit parameter. Must be an integer."}), 400
    except (CoinglassAPIError, CoinglassRequestError, RateLimitExceededError) as e:
        print(f"API error fetching liquidation data: {e}")
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run_server(host='0.0.0.0', port=8050, debug=True) # Make the server accessible externally