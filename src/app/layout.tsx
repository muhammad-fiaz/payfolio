import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import React from "react";
import AuthProvider from "@/utils/AuthProvider";

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
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <link rel={"icon"} href={"/favicon.webp"} />
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-cover bg-center`}
            style={{ backgroundImage: "url('/background.jpg')" }}
        >
        <AuthProvider>

        <Navbar />

        {children}
        </AuthProvider>
        </body>
        </html>
    );
}
