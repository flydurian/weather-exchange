export const MAX_FAVORITES = 10;
export const FAVORITES_KEY = 'weatherAppFavorites';

export const CURRENCY_MAP: { [key: string]: string } = {
    'JP': 'JPY', 'KR': 'KRW', 'CN': 'CNY', 'HK': 'HKD', 'SG': 'SGD', 'TH': 'THB', 'VN': 'VND', 'IN': 'INR', 'ID': 'IDR', 'MY': 'MYR', 'PH': 'PHP',
    'US': 'USD', 'CA': 'CAD', 'MX': 'MXN',
    'GB': 'GBP', 'CH': 'CHF', 'SE': 'SEK', 'NO': 'NOK', 'DK': 'DKK', 'CZ': 'CZK', 'PL': 'PLN', 'HU': 'HUF', 'TR': 'TRY',
    'AD': 'EUR', 'AT': 'EUR', 'BE': 'EUR', 'CY': 'EUR', 'EE': 'EUR', 'FI': 'EUR', 'FR': 'EUR', 'DE': 'EUR', 'GR': 'EUR', 'IE': 'EUR', 'IT': 'EUR', 'LV': 'EUR', 'LT': 'EUR', 'LU': 'EUR', 'MT': 'EUR', 'MC': 'EUR', 'NL': 'EUR', 'PT': 'EUR', 'SM': 'EUR', 'SK': 'EUR', 'SI': 'EUR', 'ES': 'EUR', 'VA': 'EUR', 'EU': 'EUR',
    'AU': 'AUD', 'NZ': 'NZD',
    'BR': 'BRL',
    'ZA': 'ZAR',
};

export const ICON_MAP: { [key: string]: string } = {
    "01d": "Sun", "01n": "Moon",
    "02d": "CloudSun", "02n": "CloudMoon",
    "03d": "Cloud", "03n": "Cloud",
    "04d": "Cloudy", "04n": "Cloudy",
    "09d": "CloudRain", "09n": "CloudRain",
    "10d": "CloudDrizzle", "10n": "CloudDrizzle",
    "11d": "CloudLightning", "11n": "CloudLightning",
    "13d": "Snowflake", "13n": "Snowflake",
    "50d": "Wind", "50n": "Wind",
};