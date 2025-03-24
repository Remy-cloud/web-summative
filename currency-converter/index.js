document.addEventListener('DOMContentLoaded', function() {
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');
    const convertButton = document.getElementById('convert-button');
    const swapButton = document.getElementById('swap-button');
    const resultDiv = document.getElementById('result');
    const resultAmount = document.getElementById('result-amount');
    const resultText = document.getElementById('result-text');
    const errorMessage = document.getElementById('error-message');
    const loadingDiv = document.getElementById('loading');
    
    // Common currencies to show at the top of the list
    const commonCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'];
    
    // Fallback currency data in case API fails
    const fallbackCurrencies = {
        'USD': 'US Dollar',
        'EUR': 'Euro',
        'GBP': 'British Pound',
        'JPY': 'Japanese Yen',
        'CAD': 'Canadian Dollar',
        'AUD': 'Australian Dollar',
        'CHF': 'Swiss Franc',
        'CNY': 'Chinese Yuan',
        'INR': 'Indian Rupee',
        'NZD': 'New Zealand Dollar',
        'SGD': 'Singapore Dollar',
        'HKD': 'Hong Kong Dollar',
        'MXN': 'Mexican Peso',
        'BRL': 'Brazilian Real',
        'ZAR': 'South African Rand',
        'SEK': 'Swedish Krona',
        'NOK': 'Norwegian Krone',
        'DKK': 'Danish Krone',
        'PLN': 'Polish Zloty',
        'RUB': 'Russian Ruble'
    };
    
    // Fallback exchange rates (relative to USD)
    const fallbackRates = {
        'USD': 1,
        'EUR': 0.92,
        'GBP': 0.79,
        'JPY': 150.59,
        'CAD': 1.36,
        'AUD': 1.52,
        'CHF': 0.90,
        'CNY': 7.24,
        'INR': 83.12,
        'NZD': 1.64,
        'SGD': 1.35,
        'HKD': 7.82,
        'MXN': 16.73,
        'BRL': 5.05,
        'ZAR': 18.41,
        'SEK': 10.42,
        'NOK': 10.71,
        'DKK': 6.87,
        'PLN': 3.94,
        'RUB': 92.50
    };
    
    // Try multiple API endpoints
    async function fetchCurrencies() {
        const apiEndpoints = [
            'https://open.er-api.com/v6/latest/USD',
            'https://api.exchangerate.host/latest',
            'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json'
        ];
        
        let success = false;
        
        // Try each endpoint until one works
        for (const endpoint of apiEndpoints) {
            if (success) break;
            
            try {
                console.log(`Trying API endpoint: ${endpoint}`);
                const response = await fetch(endpoint);
                const data = await response.json();
                
                let currencies = {};
                
                // Parse response based on API format
                if (endpoint.includes('open.er-api.com')) {
                    currencies = data.rates;
                    currencies['USD'] = 1; // Add base currency
                } else if (endpoint.includes('exchangerate.host')) {
                    currencies = data.rates;
                    currencies[data.base] = 1; // Add base currency
                } else if (endpoint.includes('fawazahmed0')) {
                    currencies = data.usd;
                }
                
                if (Object.keys(currencies).length > 0) {
                    populateDropdowns(currencies);
                    success = true;
                    console.log('Successfully loaded currencies from API');
                } else {
                    throw new Error('No currencies found in API response');
                }
            } catch (error) {
                console.error(`Error with endpoint ${endpoint}:`, error);
            }
        }
        
        // If all APIs fail, use fallback data
        if (!success) {
            console.log('All APIs failed, using fallback currency data');
            populateDropdowns(fallbackCurrencies);
        }
    }
    
    // Populate dropdowns with currency data
    function populateDropdowns(currencies) {
        // Clear existing options
        fromCurrencySelect.innerHTML = '';
        toCurrencySelect.innerHTML = '';
        
        // Get currency codes and sort them
        const currencyCodes = Object.keys(currencies);
        
        // Sort currencies with common ones at the top
        const sortedCurrencies = currencyCodes.sort((a, b) => {
            const aIsCommon = commonCurrencies.includes(a);
            const bIsCommon = commonCurrencies.includes(b);
            
            if (aIsCommon && !bIsCommon) return -1;
            if (!aIsCommon && bIsCommon) return 1;
            return a.localeCompare(b);
        });
        
        // Add options to dropdowns
        sortedCurrencies.forEach(code => {
            const option = document.createElement('option');
            option.value = code;
            
            // Display format depends on what data we have
            if (typeof currencies[code] === 'string') {
                option.textContent = `${code} - ${currencies[code]}`;
            } else {
                option.textContent = code;
            }
            
            const optionClone = option.cloneNode(true);
            
            fromCurrencySelect.appendChild(option);
            toCurrencySelect.appendChild(optionClone);
        });
        
        // Set default values
        fromCurrencySelect.value = 'USD';
        toCurrencySelect.value = 'EUR';
    }
    
    // Convert currency using API or fallback
    async function convertCurrency() {
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        
        // Validate input
        if (isNaN(amount) || amount <= 0) {
            showError('Please enter a valid amount');
            return;
        }
        
        hideError();
        showLoading();
        hideResult();
        
        // Try multiple API endpoints for conversion
        const apiEndpoints = [
            `https://open.er-api.com/v6/latest/${fromCurrency}`,
            `https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`,
            `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${fromCurrency.toLowerCase()}/${toCurrency.toLowerCase()}.json`
        ];
        
        let success = false;
        
        // Try each endpoint until one works
        for (const endpoint of apiEndpoints) {
            if (success) break;
            
            try {
                console.log(`Trying conversion API: ${endpoint}`);
                const response = await fetch(endpoint);
                const data = await response.json();
                
                let convertedAmount, rate;
                
                // Parse response based on API format
                if (endpoint.includes('open.er-api.com')) {
                    rate = data.rates[toCurrency];
                    convertedAmount = amount * rate;
                } else if (endpoint.includes('exchangerate.host')) {
                    convertedAmount = data.result;
                    rate = data.info.rate;
                } else if (endpoint.includes('fawazahmed0')) {
                    rate = data[toCurrency.toLowerCase()];
                    convertedAmount = amount * rate;
                }
                
                if (convertedAmount && rate) {
                    displayResult(convertedAmount, rate, fromCurrency, toCurrency);
                    success = true;
                } else {
                    throw new Error('Invalid conversion data');
                }
            } catch (error) {
                console.error(`Error with conversion endpoint ${endpoint}:`, error);
            }
        }
        
        // If all APIs fail, use fallback rates
        if (!success) {
            console.log('All conversion APIs failed, using fallback rates');
            
            // Convert using fallback rates (converting through USD as base)
            const fromRate = fallbackRates[fromCurrency] || 1;
            const toRate = fallbackRates[toCurrency] || 1;
            
            // Convert to USD first, then to target currency
            const amountInUSD = amount / fromRate;
            const convertedAmount = amountInUSD * toRate;
            const rate = toRate / fromRate;
            
            displayResult(convertedAmount, rate, fromCurrency, toCurrency);
        }
        
        hideLoading();
    }
    
    // Display conversion result
    function displayResult(convertedAmount, rate, fromCurrency, toCurrency) {
        resultAmount.textContent = `${convertedAmount.toFixed(2)} ${toCurrency}`;
        resultText.textContent = `1 ${fromCurrency} = ${rate.toFixed(6)} ${toCurrency}`;
        showResult();
    }
    
    // Swap currencies
    function swapCurrencies() {
        const tempCurrency = fromCurrencySelect.value;
        fromCurrencySelect.value = toCurrencySelect.value;
        toCurrencySelect.value = tempCurrency;
        
        // If there's a result showing, update it
        if (resultDiv.classList.contains('active')) {
            convertCurrency();
        }
    }
    
    // Helper functions
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
    
    function hideError() {
        errorMessage.style.display = 'none';
    }
    
    function showResult() {
        resultDiv.classList.add('active');
    }
    
    function hideResult() {
        resultDiv.classList.remove('active');
    }
    
    function showLoading() {
        loadingDiv.style.display = 'block';
    }
    
    function hideLoading() {
        loadingDiv.style.display = 'none';
    }
    
    // Event listeners
    convertButton.addEventListener('click', convertCurrency);
    swapButton.addEventListener('click', swapCurrencies);
    
    // Initialize
    fetchCurrencies();
    
    // Allow Enter key to trigger conversion
    amountInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            convertCurrency();
        }
    });
});