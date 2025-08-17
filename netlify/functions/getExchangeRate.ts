import type { Handler } from "@netlify/functions";
import { handleGeminiResponse, exchangeSchema, CURRENCY_MAP } from "./utils";

export const handler: Handler = async () => {
    const uniqueCurrencies = Array.from(new Set(Object.values(CURRENCY_MAP)));
    const prompt = `As of ${new Date().toUTCString()}, provide the latest real-time currency exchange rates with KRW (South Korean Won) as the base currency. Provide rates for all of the following currencies: ${uniqueCurrencies.join(', ')}.`;

    return handleGeminiResponse(prompt, exchangeSchema);
};
