import type { Handler, HandlerEvent } from "@netlify/functions";
import { handleGeminiResponse, weatherSchema } from "./utils";

export const handler: Handler = async (event: HandlerEvent) => {
    // Handle CORS preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            },
            body: ''
        };
    }

    const city = event.queryStringParameters?.city;

    if (!city) {
        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            },
            body: JSON.stringify({ error: "City parameter is required." }),
        };
    }

    const prompt = `As of ${new Date().toUTCString()}, provide the most current and accurate 5-day weather forecast with 3-hour intervals for the city "${city}".
    The response must exactly match the provided JSON schema.
    - The 'city' object in the response should contain the accurately identified city name, country code, and coordinates.
    - Generate realistic and consistent weather data based on the current time.
    - Create exactly 40 forecast list items.
    - Use OpenWeatherMap icon codes (e.g., '01d', '10n').
    - Weather descriptions must be in Korean.`;

    return handleGeminiResponse(prompt, weatherSchema);
};
