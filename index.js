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
    
    // Fetch available currencies and populate dropdowns
    async function fetchCurrencies() {
        try {
            const response = await fetch('https://api.exchangerate.host/symbols');
            const data = await response.json();
            
            if (data.success) {
                const currencies = data.symbols;
                
                // Sort currencies with common ones at the top
                const sortedCurrencies = Object.keys(currencies).sort((a, b) => {
                    const aIsCommon = commonCurrencies.includes(a);
                    const bIsCommon = commonCurrencies.includes(b);
                    
                    if (aIsCommon && !bIsCommon) return -1;
                    if (!aIsCommon && bIsCommon) return 1;
                    return a.localeCompare(b);
                });
                
                // Populate dropdowns
                sortedCurrencies.forEach(currency => {
                    const option = document.createElement('option');
                    option.value = currency;
                    option.textContent = `${currency} - ${currencies[currency].description}`;
                    
                    const optionClone = option.cloneNode(true);
                    
                    fromCurrencySelect.appendChild(option);
                    toCurrencySelect.appendChild(optionClone);
                });
                
                // Set default values
                fromCurrencySelect.value = 'USD';
                toCurrencySelect.value = 'EUR';
            } else {
                throw new Error('Failed to fetch currencies');
            }
        } catch (error) {
            showError('Failed to load currencies. Please try again later.');
            console.error(error);
        }
    }
    
    // Convert currency
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
        
        try {
            const response = await fetch(`https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`);
            const data = await response.json();
            
            if (data.success) {
                const convertedAmount = data.result;
                const rate = data.info.rate;
                
                resultAmount.textContent = `${convertedAmount.toFixed(2)} ${toCurrency}`;
                resultText.textContent = `1 ${fromCurrency} = ${rate.toFixed(6)} ${toCurrency}`;
                
                showResult();
            } else {
                throw new Error('Conversion failed');
            }
        } catch (error) {
            showError('Failed to convert currency. Please try again later.');
            console.error(error);
        } finally {
            hideLoading();
        }
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