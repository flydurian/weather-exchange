import { GoogleGenerativeAI } from "@google/generative-ai";
import { HandlerResponse } from "@netlify/functions";

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const handleGeminiResponse = async <T,>(prompt: string, schema: any): Promise<HandlerResponse> => {
    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.1,
                topK: 1,
                topP: 1,
                maxOutputTokens: 8192,
            },
        });

        const response = await result.response;
        const text = response.text();
        
        if (!text) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Received an empty response from the AI model." }),
            };
        }
        
        // Try to parse the response as JSON
        let data;
        try {
            data = JSON.parse(text);
        } catch (parseError) {
            // If parsing fails, try to extract JSON from the response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    data = JSON.parse(jsonMatch[0]);
                } catch (secondParseError) {
                    return {
                        statusCode: 500,
                        body: JSON.stringify({ 
                            error: "Failed to parse AI response as JSON.",
                            rawResponse: text.substring(0, 500)
                        }),
                    };
                }
            } else {
                return {
                    statusCode: 500,
                    body: JSON.stringify({ 
                        error: "AI response is not in valid JSON format.",
                        rawResponse: text.substring(0, 500)
                    }),
                };
            }
        }

        return {
            statusCode: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            },
            body: JSON.stringify(data),
        };

    } catch (error) {
        console.error("Gemini API call failed:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred while contacting the AI model.";
        return {
            statusCode: 500,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            },
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
    type: "array",
    items: {
        type: "object",
        properties: {
            name: { type: "string", description: "The English name of the city." },
            lat: { type: "number", description: "Latitude of the city." },
            lon: { type: "number", description: "Longitude of the city." },
            country: { type: "string", description: "The 2-letter ISO 3166-1 alpha-2 country code." },
        },
        required: ["name", "lat", "lon", "country"]
    }
};

export const weatherSchema = {
    type: "object",
    properties: {
        cod: { type: "string", description: "API response code, should be '200'" },
        message: { type: "number", description: "Internal parameter, should be 0" },
        cnt: { type: "number", description: "Number of forecast items, should be 40" },
        list: {
            type: "array",
            description: "An array of 40 weather forecast items, for every 3 hours over 5 days.",
            items: {
                type: "object",
                properties: {
                    dt: { type: "number", description: "Timestamp in UNIX UTC." },
                    main: {
                        type: "object",
                        properties: {
                            temp: { type: "number", description: "Temperature in Celsius." },
                            feels_like: { type: "number", description: "Feels like temperature in Celsius." },
                            temp_min: { type: "number", description: "Minimum temperature for the period in Celsius." },
                            temp_max: { type: "number", description: "Maximum temperature for the period in Celsius." },
                            pressure: { type: "number", description: "Atmospheric pressure in hPa." },
                            humidity: { type: "number", description: "Humidity in %." },
                        },
                        required: ["temp", "feels_like", "temp_min", "temp_max", "pressure", "humidity"]
                    },
                    weather: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "number", description: "Weather condition id." },
                                main: { type: "string", description: "Group of weather parameters (Rain, Snow, etc.)." },
                                description: { type: "string", description: "Weather condition within the group in Korean." },
                                icon: { type: "string", description: "OpenWeatherMap weather icon id (e.g., '01d', '10n')." },
                            },
                            required: ["id", "main", "description", "icon"]
                        }
                    },
                    clouds: { type: "object", properties: { all: { type: "number", description: "Cloudiness in %." } } },
                    wind: { type: "object", properties: { speed: { type: "number", description: "Wind speed in meter/sec." }, deg: { type: "number", description: "Wind direction in degrees." } } },
                    visibility: { type: "number", description: "Visibility in meters." },
                    pop: { type: "number", description: "Probability of precipitation (0-1)." },
                    sys: { type: "object", properties: { pod: { type: "string", description: "'d' for day, 'n' for night." } } },
                    dt_txt: { type: "string", description: "Date and time in 'YYYY-MM-DD HH:MM:SS' format." },
                },
                required: ["dt", "main", "weather", "clouds", "wind", "visibility", "pop", "sys", "dt_txt"]
            }
        },
        city: {
            type: "object",
            properties: {
                id: { type: "number", description: "City ID." },
                name: { type: "string", description: "City name." },
                coord: { type: "object", properties: { lat: { type: "number" }, lon: { type: "number" } } },
                country: { type: "string", description: "Country code (e.g., 'KR', 'US')." },
                population: { type: "number" },
                timezone: { type: "number", description: "Shift in seconds from UTC." },
                sunrise: { type: "number", description: "Sunrise time, UNIX, UTC." },
                sunset: { type: "number", description: "Sunset time, UNIX, UTC." },
            },
             required: ["id", "name", "coord", "country", "population", "timezone", "sunrise", "sunset"]
        }
    },
    required: ["cod", "cnt", "list", "city"]
};

const uniqueCurrencies = Array.from(new Set(Object.values(CURRENCY_MAP)));
const exchangeRateProperties = uniqueCurrencies.reduce((acc, currency) => {
    acc[currency] = { type: "number", description: `Rate for ${currency}` };
    return acc;
}, {} as { [key: string]: { type: string, description: string } });

export const exchangeSchema = {
    type: "object",
    properties: {
        result: { type: "string", description: "Should be 'success'." },
        documentation: { type: "string" },
        terms_of_use: { type: "string" },
        time_last_update_unix: { type: "number", description: "Last update time, UNIX, UTC." },
        time_last_update_utc: { type: "string", description: "Last update time string, UTC." },
        time_next_update_unix: { type: "number", description: "Next update time, UNIX, UTC." },
        time_next_update_utc: { type: "string", description: "Next update time string, UTC." },
        base_code: { type: "string", description: "Base currency, should be 'KRW'." },
        conversion_rates: {
            type: "object",
            properties: exchangeRateProperties,
            required: uniqueCurrencies
        }
    },
    required: ["result", "time_last_update_utc", "base_code", "conversion_rates"]
};
