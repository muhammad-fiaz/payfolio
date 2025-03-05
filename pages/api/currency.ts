import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

interface CurrencyData {
    currency: string;
    rate: number;
    countryCode: string;
}

const cache: Record<string, { data: CurrencyData; timestamp: number }> = {};
// 1 hour
const COOKIE_NAME = "user_country";

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

const getClientIP = (req: NextApiRequest): string => {
    const forwarded = req.headers["x-forwarded-for"] as string;
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    return req.socket.remoteAddress || "";
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        let ip = getClientIP(req);

        // Handle localhost scenario (Use an external API in development)
        if (!ip || ip === "::1" || ip === "127.0.0.1") {
            console.log(
                `[${new Date().toISOString()}] 🏠 Local environment detected, fetching real IP`
            );
            try {
                const ipResponse = await fetchWithTimeout("https://api64.ipify.org?format=json");
                const ipData = await ipResponse.json();
                ip = ipData.ip;
            } catch (error) {
                console.error("❌ Failed to get real IP in development mode:", error);
            }
        }

        // Check if country is stored in cookies
        const cookies = req.headers.cookie || "";
        const cookieMatch = cookies.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
        const storedCountry = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;

        // If the stored country exists and the IP hasn't changed, return it
        if (storedCountry && cache[ip]) {
            console.log(
                `[${new Date().toISOString()}] 🍪 Returning stored country from cookies: ${storedCountry}`
            );
            return res.status(200).json({ countryCode: storedCountry, source: "cookie" });
        }

        console.log(`[${new Date().toISOString()}] 🔄 Fetching fresh currency data for IP: ${ip}`);

        // Fetch location-based currency data
        const response = await fetchWithTimeout(`https://ipapi.co/${ip}/json/`);
        if (!response.ok) {
            console.error(`[${new Date().toISOString()}] ❌ HTTP error: ${response.status}`);
            return res.status(response.status).json({ error: "Failed to fetch currency data" });
        }

        const data = await response.json();
        if (!data.currency || !data.country_code) {
            console.error(`[${new Date().toISOString()}] ❌ Invalid response from IP API`);
            return res.status(500).json({ error: "Invalid data from IP API" });
        }

        const currencyData: CurrencyData = {
            currency: data.currency,
            rate: data.rate || 1,
            countryCode: data.country_code,
        };

        cache[ip] = { data: currencyData, timestamp: Date.now() };

        // Store country in a cookie
        res.setHeader(
            "Set-Cookie",
            serialize(COOKIE_NAME, data.country_code, {
                path: "/",
                httpOnly: false, // Allow access in client-side JavaScript
                maxAge: 60 * 60 * 24 * 7, // 7 days
                sameSite: "lax",
            })
        );

        console.log(
            `[${new Date().toISOString()}] ✅ Fetched and cached currency data for IP: ${ip}, Country: ${data.country_code}`
        );

        res.status(200).json({ ...currencyData, source: "api" });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] ❌ Error fetching currency data:`, error);
        res.status(500).json({ error: "Failed to fetch currency" });
    }
}
