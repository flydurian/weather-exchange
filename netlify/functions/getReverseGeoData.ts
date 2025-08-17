import type { Handler, HandlerEvent } from "@netlify/functions";
import { handleGeminiResponse, geoSchema } from "./utils";

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

    const lat = event.queryStringParameters?.lat;
    const lon = event.queryStringParameters?.lon;

    if (!lat || !lon) {
        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            },
            body: JSON.stringify({ error: "Latitude and longitude parameters are required." }),
        };
    }

    const prompt = `Provide geocoding information for the coordinates latitude: ${lat}, longitude: ${lon}. Return only a single, most relevant result in an array.`;
    
    return handleGeminiResponse(prompt, geoSchema);
};
