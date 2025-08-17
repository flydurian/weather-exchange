import { GoogleGenAI, Type } from "@google/genai";
import { HandlerResponse } from "@netlify/functions";

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = "gemini-2.5-flash";

export const handleGeminiResponse = async <T,>(prompt: string, schema: any): Promise<HandlerResponse> => {
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const jsonText = response.text.trim();
        if (!jsonText) {
             return {
                statusCode: 500,
                body: JSON.stringify({ error: "Received an empty response from the AI model." }),
            };
        }
        
        // The Gemini API might return a raw JSON object, not a string.
        const data = typeof jsonText === 'string' ? JSON.parse(jsonText) : jsonText;

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        };

    } catch (error) {
        console.error("Gemini API call failed:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred while contacting the AI model.";
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Gemini API Error: ${message}` }),
        };
    }
};

// Schemas and Constants
export const CURRENCY_MAP: { [key: string]: string } = {
    'JP': 'JPY', 'KR': 'KRW', 'CN': 'CNY', 'HK': 'HKD', 'SG': 'SGD', 'TH': 'THB', 'VN': 'VND', 'IN': 'INR', 'ID': 'IDR', 'MY': 'MYR', 'PH': 'PHP',
    'US': 'USD', 'CA': 'CAD', 'MX': 'MXN',
    'GB': 'GBP', 'CH': 'CHF', 'SE': 'SEK', 'NO': 'NOK', 'DK': 'DKK', 'CZ': 'CZK', 'PL': 'PLN', 'HU': 'HUF', 'TR': 'TRY',
    'AD': 'EUR', 'AT': 'EUR', 'BE': 'EUR', 'CY': 'EUR', 'EE': 'EUR', 'FI': 'EUR', 'FR': 'EUR', 'DE': 'EUR', 'GR': 'EUR', 'IE': 'EUR', 'IT': 'EUR', 'LV': 'EUR', 'LT': 'EUR', 'LU': 'EUR', 'MT': 'EUR', 'MC': 'EUR', 'NL': 'EUR', 'PT': 'EUR', 'SM': 'EUR', 'SK': 'EUR', 'SI': 'EUR', 'ES': 'EUR', 'VA': 'EUR', 'EU': 'EUR',
    'AU': 'AUD', 'NZ': 'NZD',
    'BR': 'BRL',
    'ZA': 'ZAR',
};

export const geoSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "The English name of the city." },
            lat: { type: Type.NUMBER, description: "Latitude of the city." },
            lon: { type: Type.NUMBER, description: "Longitude of the city." },
            country: { type: Type.STRING, description: "The 2-letter ISO 3166-1 alpha-2 country code." },
        },
        required: ["name", "lat", "lon", "country"]
    }
};

export const weatherSchema = {
    type: Type.OBJECT,
    properties: {
        cod: { type: Type.STRING, description: "API response code, should be '200'" },
        message: { type: Type.NUMBER, description: "Internal parameter, should be 0" },
        cnt: { type: Type.NUMBER, description: "Number of forecast items, should be 40" },
        list: {
            type: Type.ARRAY,
            description: "An array of 40 weather forecast items, for every 3 hours over 5 days.",
            items: {
                type: Type.OBJECT,
                properties: {
                    dt: { type: Type.NUMBER, description: "Timestamp in UNIX UTC." },
                    main: {
                        type: Type.OBJECT,
                        properties: {
                            temp: { type: Type.NUMBER, description: "Temperature in Celsius." },
                            feels_like: { type: Type.NUMBER, description: "Feels like temperature in Celsius." },
                            temp_min: { type: Type.NUMBER, description: "Minimum temperature for the period in Celsius." },
                            temp_max: { type: Type.NUMBER, description: "Maximum temperature for the period in Celsius." },
                            pressure: { type: Type.NUMBER, description: "Atmospheric pressure in hPa." },
                            humidity: { type: Type.NUMBER, description: "Humidity in %." },
                        },
                        required: ["temp", "feels_like", "temp_min", "temp_max", "pressure", "humidity"]
                    },
                    weather: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.NUMBER, description: "Weather condition id." },
                                main: { type: Type.STRING, description: "Group of weather parameters (Rain, Snow, etc.)." },
                                description: { type: Type.STRING, description: "Weather condition within the group in Korean." },
                                icon: { type: Type.STRING, description: "OpenWeatherMap weather icon id (e.g., '01d', '10n')." },
                            },
                            required: ["id", "main", "description", "icon"]
                        }
                    },
                    clouds: { type: Type.OBJECT, properties: { all: { type: Type.NUMBER, description: "Cloudiness in %." } } },
                    wind: { type: Type.OBJECT, properties: { speed: { type: Type.NUMBER, description: "Wind speed in meter/sec." }, deg: { type: Type.NUMBER, description: "Wind direction in degrees." } } },
                    visibility: { type: Type.NUMBER, description: "Visibility in meters." },
                    pop: { type: Type.NUMBER, description: "Probability of precipitation (0-1)." },
                    sys: { type: Type.OBJECT, properties: { pod: { type: Type.STRING, description: "'d' for day, 'n' for night." } } },
                    dt_txt: { type: Type.STRING, description: "Date and time in 'YYYY-MM-DD HH:MM:SS' format." },
                },
                required: ["dt", "main", "weather", "clouds", "wind", "visibility", "pop", "sys", "dt_txt"]
            }
        },
        city: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.NUMBER, description: "City ID." },
                name: { type: Type.STRING, description: "City name." },
                coord: { type: Type.OBJECT, properties: { lat: { type: Type.NUMBER }, lon: { type: Type.NUMBER } } },
                country: { type: Type.STRING, description: "Country code (e.g., 'KR', 'US')." },
                population: { type: Type.NUMBER },
                timezone: { type: Type.NUMBER, description: "Shift in seconds from UTC." },
                sunrise: { type: Type.NUMBER, description: "Sunrise time, UNIX, UTC." },
                sunset: { type: Type.NUMBER, description: "Sunset time, UNIX, UTC." },
            },
             required: ["id", "name", "coord", "country", "population", "timezone", "sunrise", "sunset"]
        }
    },
    required: ["cod", "cnt", "list", "city"]
};

const uniqueCurrencies = Array.from(new Set(Object.values(CURRENCY_MAP)));
const exchangeRateProperties = uniqueCurrencies.reduce((acc, currency) => {
    acc[currency] = { type: Type.NUMBER, description: `Rate for ${currency}` };
    return acc;
}, {} as { [key: string]: { type: Type, description: string } });

export const exchangeSchema = {
    type: Type.OBJECT,
    properties: {
        result: { type: Type.STRING, description: "Should be 'success'." },
        documentation: { type: Type.STRING },
        terms_of_use: { type: Type.STRING },
        time_last_update_unix: { type: Type.NUMBER, description: "Last update time, UNIX, UTC." },
        time_last_update_utc: { type: Type.STRING, description: "Last update time string, UTC." },
        time_next_update_unix: { type: Type.NUMBER, description: "Next update time, UNIX, UTC." },
        time_next_update_utc: { type: Type.STRING, description: "Next update time string, UTC." },
        base_code: { type: Type.STRING, description: "Base currency, should be 'KRW'." },
        conversion_rates: {
            type: Type.OBJECT,
            properties: exchangeRateProperties,
            required: uniqueCurrencies
        }
    },
    required: ["result", "time_last_update_utc", "base_code", "conversion_rates"]
};
