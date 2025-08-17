import type { GeoData, WeatherData, ExchangeData } from '../types';

const EXCHANGE_RATE_CACHE_KEY = 'exchangeRateCache';
const EXCHANGE_RATE_CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

const handleApiResponse = async <T,>(response: Response): Promise<T> => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown API error occurred.' }));
        throw new Error(errorData.error || `Request failed with status: ${response.status}`);
    }
    return response.json();
};

export const getWeatherDataByCity = async (identifier: string): Promise<WeatherData> => {
    const response = await fetch(`/.netlify/functions/getWeatherData?city=${encodeURIComponent(identifier)}`);
    return handleApiResponse<WeatherData>(response);
};

export const getReverseGeoData = async (lat: number, lon: number): Promise<GeoData | null> => {
    const response = await fetch(`/.netlify/functions/getReverseGeoData?lat=${lat}&lon=${lon}`);
    const data = await handleApiResponse<GeoData[]>(response);
    return data.length > 0 ? data[0] : null;
};

export const getExchangeRateData = async (): Promise<ExchangeData> => {
    try {
        const cachedItem = localStorage.getItem(EXCHANGE_RATE_CACHE_KEY);
        if (cachedItem) {
            const { timestamp, data } = JSON.parse(cachedItem);
            if (Date.now() - timestamp < EXCHANGE_RATE_CACHE_DURATION_MS) {
                return data as ExchangeData;
            }
        }
    } catch (error) {
        console.error("Failed to read exchange rate cache:", error);
    }
    
    const response = await fetch(`/.netlify/functions/getExchangeRate`);
    const newData = await handleApiResponse<ExchangeData>(response);

    try {
        const cacheItem = {
            timestamp: Date.now(),
            data: newData,
        };
        localStorage.setItem(EXCHANGE_RATE_CACHE_KEY, JSON.stringify(cacheItem));
    } catch (error) {
        console.error("Failed to write to exchange rate cache:", error);
    }

    return newData;
};
