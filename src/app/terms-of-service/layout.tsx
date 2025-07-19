import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | Payfolio",
    description:
        "Read the terms of service for Payfolio, the secure payment platform by Muhammad Fiaz. All payments are final and non-refundable.",
    keywords: [
        "terms of service",
        "Payfolio",
        "Muhammad Fiaz",
        "secure payments",
        "razorpay",
        "binance",
        "crypto",
        "fiat",
        "donation",
        "tip",
    ],
    authors: [{ name: "Muhammad Fiaz", url: "https://muhammadfiaz.com" }],
    publisher: "Muhammad Fiaz",
    openGraph: {
        title: "Terms of Service | Payfolio",
        description:
            "Read the terms of service for Payfolio, the secure payment platform by Muhammad Fiaz.",
        url: "https://pay.muhammadfiaz.com/terms-of-service",
        siteName: "Payfolio",
        images: [
            {
                url: "https://pay.muhammadfiaz.com/logo.png",
                width: 400,
                height: 400,
                alt: "Payfolio Logo",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        site: "@muhammadfiaz_",
        creator: "@muhammadfiaz_",
        title: "Terms of Service | Payfolio",
        description:
            "Read the terms of service for Payfolio, the secure payment platform by Muhammad Fiaz.",
        images: ["https://pay.muhammadfiaz.com/logo.png"],
    },
};

export default function TermsOfServiceLayout({ children }: { children: React.ReactNode }) {
    return children;
}
