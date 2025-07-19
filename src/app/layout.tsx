import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import React from "react";
import AuthProvider from "@/utils/AuthProvider";

const Navbar = dynamic(() => import("@/components/Navbar"));

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Support My Works! | Muhammad Fiaz",
    description:
        "Support my work by making a small contribution. Every donation helps me continue creating and improving my projects.",
    keywords: [
        "donation",
        "support",
        "Muhammad Fiaz",
        "portfolio",
        "crypto",
        "fiat",
        "razorpay",
        "binance",
        "open source",
        "tip",
        "web development",
    ],
    authors: [{ name: "Muhammad Fiaz", url: "https://muhammadfiaz.com" }],
    publisher: "Muhammad Fiaz",
    icons: {
        icon: "/favicon.webp",
    },
    openGraph: {
        title: "Support My Works! | Muhammad Fiaz",
        description:
            "Support my work by making a small contribution. Every donation helps me continue creating and improving my projects.",
        url: "https://pay.muhammadfiaz.com/",
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
        title: "Support My Works! | Muhammad Fiaz",
        description:
            "Support my work by making a small contribution. Every donation helps me continue creating and improving my projects.",
        images: ["https://pay.muhammadfiaz.com/logo.png"],
    },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className="h-screen overflow-hidden">
            <head>
                {/* Preload background image for performance */}
                <link
                    rel="preload"
                    href="/assets/background.avif"
                    as="image"
                    type="image/avif"
                    media="(min-width: 1px)"
                />
            </head>
            <body
                className={`bg-gray-100 bg-[url('/assets/background.avif')] bg-cover bg-center bg-no-repeat bg-fixed h-screen overflow-hidden ${geistSans.variable} ${geistMono.variable} antialiased min-h-screen relative`}
            >
                <AuthProvider>
                    <Navbar />
                    <main className="min-h-screen">{children}</main>
                </AuthProvider>
            </body>
        </html>
    );
}
