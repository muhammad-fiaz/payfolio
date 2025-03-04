import { NextApiRequest, NextApiResponse } from "next";
interface CurrencyData {
    currency: string;
    rate: number;
}

const cache: { [key: string]: { data: CurrencyData; timestamp: number } } = {};
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const fetchWithTimeout = (url: string, options: RequestInit, timeout = 10000) => {
    return new Promise<Response>((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error("Request timed out"));
        }, timeout);

        fetch(url, options)
            .then(response => {
                clearTimeout(timer);
                resolve(response);
            })
            .catch(err => {
                clearTimeout(timer);
                reject(err);
            });
    });
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const cacheKey = "currencyData";
    const cachedData = cache[cacheKey];

    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
        return res.status(200).json(cachedData.data);
    }

    try {
        const response = await fetchWithTimeout("https://ipapi.co/json/", {}, 10000);
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
            return res.status(response.status).json({ error: `Failed to fetch currency: HTTP error! Status: ${response.status}` });
        }

        const data = await response.json();
        cache[cacheKey] = { data, timestamp: Date.now() };
        res.status(200).json(data);
    } catch (error) {
        console.error("Failed to fetch currency:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: `Failed to fetch currency: ${error.message}` });
        } else {
            res.status(500).json({ error: "Failed to fetch currency: Unknown error" });
        }
    }
}