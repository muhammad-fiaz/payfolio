import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import geoip from "geoip-country";
import countryToCurrency from "@/utils/CurrencyProvider";

interface CurrencyData {
    currency: string;
    rate: number;
    countryCode: string;
}

const cache: Record<string, { data: CurrencyData; timestamp: number }> = {};
const COOKIE_NAME = "user_country";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const ip = req.query.ip as string; // Get IP from client-side request

        if (!ip) {
            console.error("❌ No IP provided");
            return res.status(400).json({ error: "IP address is required" });
        }

        console.log(`🔄 Fetching country for Client IP: ${ip}`);

        // Get country from `geoip-country`
        const geoData = geoip.lookup(ip);
        if (!geoData || !geoData.country) {
            console.error("❌ Failed to determine country from IP.");
            return res.status(500).json({ error: "Could not determine country" });
        }

        const countryCode = geoData.country;
        const currency = countryToCurrency[countryCode] || "USD";

        const currencyData: CurrencyData = {
            currency,
            rate: 1,
            countryCode,
        };

        cache[ip] = { data: currencyData, timestamp: Date.now() };

        // Store country in a cookie
        res.setHeader(
            "Set-Cookie",
            serialize(COOKIE_NAME, countryCode, {
                path: "/",
                httpOnly: false,
                maxAge: 60 * 60 * 24 * 7, // 7 days
                sameSite: "lax",
            })
        );

        console.log(`✅ Fetched and cached country data for IP: ${ip}, Country: ${countryCode}`);

        res.status(200).json({ ...currencyData, source: "geoip-country" });
    } catch (error) {
        console.error("❌ Error fetching country data:", error);
        res.status(500).json({ error: "Failed to fetch country" });
    }
}
