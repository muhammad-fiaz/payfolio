import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const lastModified = new Date().toISOString();

    const paths = ["", "privacy-policy", "terms-of-service", "refund-policy"];

    return paths.map((path) => ({
        url: `${baseUrl}/${path}`.replace(/\/$/, ""),
        lastModified,
    }));
}
