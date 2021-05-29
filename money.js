const fromSelect = document.querySelector('[name="from_currency"]');
const fromInput = document.querySelector('[name="from_amount"]');
const toSelect = document.querySelector('[name="to_currency"]');
const toEl = document.querySelector('.to_amount');
const form = document.querySelector('.app form');
// const endpiont = 'https://api.exchangeratesapi.io/latest';
// const endpiont = 'https://api.exchangeratesapi.io/v1/latest';

const endpoint = 'http://api.exchangeratesapi.io/v1/latest?access_key=3677750b35a5518ce50a0afc605f6e94';
const ratesByBase = {};

const currencies = {
    EUR: 'Euro',
    PLN: 'Polish Zloty',
    USD: 'United States Dollar',
    AUD: 'Australian Dollar',
    BGN: 'Bulgarian Lev',
    BRL: 'Brazilian Real',
    CAD: 'Canadian Dollar',
    CHF: 'Swiss Franc',
    CNY: 'Chinese Yuan',
    CZK: 'Czech Republic Koruna',
    DKK: 'Danish Krone',
    GBP: 'British Pound Sterling',
    HKD: 'Hong Kong Dollar',
    HRK: 'Croatian Kuna',
    HUF: 'Hungarian Forint',
    IDR: 'Indonesian Rupiah',
    ILS: 'Israeli New Sheqel',
    INR: 'Indian Rupee',
    JPY: 'Japanese Yen',
    KRW: 'South Korean Won',
    MXN: 'Mexican Peso',
    MYR: 'Malaysian Ringgit',
    NOK: 'Norwegian Krone',
    NZD: 'New Zealand Dollar',
    PHP: 'Philippine Peso',
    RON: 'Romanian Leu',
    RUB: 'Russian Ruble',
    SEK: 'Swedish Krona',
    SGD: 'Singapore Dollar',
    THB: 'Thai Baht',
    TRY: 'Turkish Lira',
    ZAR: 'South African Rand',
  };
  
//   export default currencies;

function generateOptions(options) {
    // console.log(options);
    return Object.entries(options).map(([currencyCode, currencyName]) => 
    {
        // console.log(currencyCode, currencyName);
        // result => USD United States Dollar

        return `<option value="${currencyCode}">${currencyCode} - ${currencyName}</option>`
    }).join('');  
};

async function fetchRates(base = 'EUR') {
    const res = await fetch(`${endpoint}`);
    // const res = await fetch(`${endpiont}?base=${base}`);
    const rates = await res.json();
    // console.log(rates);
    // {success: true, timestamp: 1622306824, base: "EUR", date: "2021-05-29", rates: {…}}
    // base: "EUR"
    // date: "2021-05-29"
    // rates: {AED: 4.478573, AFN: 95.651047, ALL: 123.271544, AMD: 634.816981, ANG: 2.188009, …}
    // success: true
    // timestamp: 1622306824
    // __proto__: Object
    return rates;
}

// from = 'EUR' only now, I can't pay from API
async function convert(amount, from, to) {
    // we could fetch the rates each time 
    // first check if we even have the rates to convert from that currency
    if(!ratesByBase[from]) {
        // console.log(`Oh no, we don't have ${from} to convert to ${to}. So gets go get it!`);
        const rates = await fetchRates(from);
        // console.log(rates);
        // store them for next time
        ratesByBase[from] = rates;
       }
       // convert that amount that they passed it
       const rate = ratesByBase[from].rates[to];
       // console.log(rate); => 4,484146
       const convertedAmount = rate * amount;
    //    console.log(convertedAmount) => 44,84146
    //    console.log(`${amount} ${from} is ${convertedAmount} in ${to}`);
       return convertedAmount;
}

function formatCurrency(amount, currency) {
    return Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

async function handleInput(e) {
    // console.log(e.target);
    // console.log(e.currentTarget);
    const rawAmount = await convert(fromInput.value, fromSelect.value, toSelect.value);
    // console.log(rawAmount);
    toEl.textContent = formatCurrency(rawAmount, toSelect.value);
}

const optionsHTML = generateOptions(currencies);
// console.log(optionsHTML);

fromSelect.innerHTML = optionsHTML;
toSelect.innerHTML = optionsHTML;

form.addEventListener('input', handleInput);