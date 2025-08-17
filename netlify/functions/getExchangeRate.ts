import type { Handler } from "@netlify/functions";
import { handleGeminiResponse, exchangeSchema, CURRENCY_MAP } from "./utils";

export const handler: Handler = async (event) => {
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

    const uniqueCurrencies = Array.from(new Set(Object.values(CURRENCY_MAP)));
    const prompt = `As of ${new Date().toUTCString()}, provide the latest real-time currency exchange rates with KRW (South Korean Won) as the base currency. Provide rates for all of the following currencies: ${uniqueCurrencies.join(', ')}.`;

    return handleGeminiResponse(prompt, exchangeSchema);
};
