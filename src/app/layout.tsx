import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import React from "react";
import AuthProvider from "@/utils/AuthProvider";

const Navbar = dynamic(() => import(/* webpackPrefetch: true */ "@/components/Navbar"), {});

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
    icons: {
        icon: "/favicon.webp",
    },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-100 bg-[url('/background.avif')] bg-cover bg-center bg-no-repeat`}
            >
                <AuthProvider>
                    <Navbar />
                    <main className="flex-grow">{children}</main>
                </AuthProvider>
            </body>
        </html>
    );
}
