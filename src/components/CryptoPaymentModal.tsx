"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CryptoPaymentModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
            <div className="bg-white/90 rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-md sm:max-w-lg flex flex-col items-center relative mx-2 sm:mx-0">
                <Button
                    className="absolute top-2 right-2 text-gray-500 text-2xl sm:text-xl"
                    variant="ghost"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </Button>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center">
                    Binance Crypto Payment
                </h3>
                <Image
                    src="/pay-crypto.png"
                    alt="Binance Pay QR"
                    width={220}
                    height={220}
                    className="w-40 sm:w-48 h-auto rounded-lg mb-3"
                />
                <p className="text-center text-gray-700 mb-2 text-sm sm:text-base">
                    Binance Pay is a secure and fast way to send crypto payments worldwide. To tip
                    Muhammad Fiaz with crypto, simply scan the QR code above using the{" "}
                    <Link
                        href="https://www.binance.com/activity/referral-entry/CPA?ref=CPA_00ZH2NZKPZ"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 underline font-semibold"
                    >
                        Binance Pay
                    </Link>{" "}
                    app. Your support is appreciated and helps keep this project running!
                    <br />
                    <span className="block mt-2 text-green-600 font-semibold">
                        If you are new to Binance,{" "}
                        <Link
                            href="https://www.binance.com/activity/referral-entry/CPA?ref=CPA_00ZH2NZKPZ"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-700 underline font-bold"
                        >
                            download here
                        </Link>{" "}
                        and get a $100 joining bonus for free!
                    </span>
                </p>
                <Link
                    href="https://app.binance.com/qr/dplk88793485795846acab2aa58522755913"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition w-full text-center sm:w-auto"
                >
                    Open Binance Pay QR
                </Link>
            </div>
        </div>
    );
}
