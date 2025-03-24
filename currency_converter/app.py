import os
import requests
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Load the API key from environment variable for security
API_KEY = os.getenv('EXCHANGE_API_KEY')
BASE_URL = "https://v6.exchangerate-api.com/v6/{}/latest/USD".format(API_KEY)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/convert', methods=['POST'])
def convert():
    try:
        from_currency = request.form['from_currency']
        to_currency = request.form['to_currency']
        amount = float(request.form['amount'])

        # Fetch conversion rates
        response = requests.get(BASE_URL)
        data = response.json()
        
        if data['result'] != 'success':
            return jsonify({'error': 'Unable to fetch data'}), 400

        conversion_rate = data['conversion_rates'].get(to_currency)

        if not conversion_rate:
            return jsonify({'error': 'Invalid currency'}), 400

        converted_amount = amount * conversion_rate
        return render_template('index.html', converted_amount=converted_amount, from_currency=from_currency, to_currency=to_currency, amount=amount)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
