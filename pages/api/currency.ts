import { NextApiRequest, NextApiResponse } from "next";

interface CurrencyData {
    currency: string;
    rate: number;
    countryCode: string;
}

const cache: { [key: string]: { data: CurrencyData; timestamp: number } } = {};
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const fetchWithTimeout = (url: string, options: RequestInit = {}, timeout = 10000) => {
    return new Promise<Response>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("Request timed out")), timeout);

        fetch(url, options)
            .then((response) => {
                clearTimeout(timer);
                resolve(response);
            })
            .catch((err) => {
                clearTimeout(timer);
                reject(err);
            });
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Extract user's IP address
        const ip =
            (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress;
        if (!ip) {
            console.log(`[${new Date().toISOString()}] ❌ Unable to determine IP address`);
            return res.status(400).json({ error: "Unable to determine IP address" });
        }

        const cacheKey = `currencyData-${ip}`; // Unique cache per user
        const cachedData = cache[cacheKey];

        if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
            console.log(
                `[${new Date().toISOString()}] ✅ Serving currency data from cache for IP: ${ip}`
            );
            return res.status(200).json({ ...cachedData.data, source: "cache" });
        }

        // Fetch location-based currency data
        console.log(`[${new Date().toISOString()}] 🔄 Fetching fresh currency data for IP: ${ip}`);
        const response = await fetchWithTimeout("https://ipapi.co/json/");
        if (!response.ok) {
            console.error(
                `[${new Date().toISOString()}] ❌ HTTP error! Status: ${response.status} - ${response.statusText}`
            );
            return res.status(response.status).json({ error: "Failed to fetch currency data" });
        }

        const data = await response.json();
        if (!data.currency || !data.country_code) {
            console.error(`[${new Date().toISOString()}] ❌ Invalid data received from IP API`);
            return res.status(500).json({ error: "Invalid data received from IP API" });
        }

        const currencyData: CurrencyData = {
            currency: data.currency,
            rate: data.rate || 1,
            countryCode: data.country_code,
        };

        cache[cacheKey] = { data: currencyData, timestamp: Date.now() };

        console.log(
            `[${new Date().toISOString()}] ✅ Successfully fetched and cached currency data for IP: ${ip}`
        );

        res.status(200).json({ ...currencyData, source: "api" });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] ❌ Failed to fetch currency:`, error);
        res.status(500).json({ error: "Failed to fetch currency" });
    }
}
