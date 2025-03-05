"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import countryToCurrency from "@/utils/CurrencyProvider";
import Cookies from "js-cookie";

declare global {
    interface Window {
        Razorpay: {
            new (options: RazorpayOptions): {
                open: () => void;
            };
        };
    }
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    image: string;
    order_id: string;
    handler: () => void;
    prefill: {
        name: string;
        email?: string;
    };
    theme: {
        color: string;
    };
}

export default function TipForm() {
    const { data: session } = useSession();
    const userEmail = session?.user?.email || "";
    const [selectedCoffees, setSelectedCoffees] = useState<number>(1);
    const [customCoffee, setCustomCoffee] = useState<number>(1);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [amount, setAmount] = useState<number | "">(10);
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [currency, setCurrency] = useState<string>("USD");
    useEffect(() => {
        const fetchCurrency = async () => {
            try {
                // Check if currency exists in cookies
                const storedCurrency = Cookies.get("currency");
                if (storedCurrency) {
                    setCurrency(storedCurrency);
                    return;
                }

                // Fetch country info from IP
                const geoRes = await fetch("https://ipapi.co/json/");
                const geoData = await geoRes.json();

                if (!geoData.country) {
                    throw new Error("Failed to retrieve country");
                }

                const countryCode = geoData.country.toUpperCase(); // Ensure uppercase
                const detectedCurrency = countryToCurrency[countryCode] || "USD";

                // Store currency in a cookie (expires in 7 days)
                Cookies.set("currency", detectedCurrency, { expires: 7, sameSite: "Lax" });

                setCurrency(detectedCurrency);
            } catch (error) {
                console.error("Error fetching currency:", error);
                setCurrency("USD"); // Default fallback
            }
        };

        fetchCurrency();
    }, []);

    // Validation Errors
    const [errors, setErrors] = useState({
        coffee: "",
        name: "",
        amount: "",
    });

    // Load Razorpay SDK dynamically
    const loadRazorpayScript = async () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
            }

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleCoffeeSelection = (value: number) => {
        setSelectedCoffees(value);
        setCustomCoffee(value);
        setErrors({ ...errors, coffee: "" });
    };

    const handleCustomCoffeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(e.target.value) || 0;
        value = Math.max(1, Math.min(99, value)); // Limit input range
        setSelectedCoffees(value);
        setCustomCoffee(value);
        setErrors({ ...errors, coffee: "" });
    };
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors = { coffee: "", name: "", amount: "" };
        let isValid = true;

        if (selectedCoffees === 0) {
            newErrors.coffee = "Please select at least one coffee.";
            isValid = false;
        }

        if (!name.trim()) {
            newErrors.name = "Name is required.";
            isValid = false;
        }

        const totalAmount = selectedCoffees * (amount as number);
        const minAmount = 100;

        if (!amount || totalAmount * 100 < minAmount) {
            newErrors.amount = `Minimum amount allowed is ₹1.00 (100 paise).`;
            isValid = false;
        }

        setErrors(newErrors);
        if (!isValid) return;

        setLoading(true);

        try {
            const res = await fetch("/api/razorpay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: totalAmount * 100, currency }),
            });
            if (!res.ok) throw new Error("Failed to fetch payment details");

            const data = await res.json();
            if (!data.id) {
                setErrorMessage("Failed to initiate payment");
                setShowErrorPopup(true);
                setLoading(false);
                return;
            }

            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                setErrorMessage("Razorpay SDK failed to load. Please refresh the page.");
                setShowErrorPopup(true);
                setLoading(false);
                return;
            }

            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: totalAmount * 100,
                currency: currency,
                name: "Buy Me a Coffee",
                description: `Tipping ${selectedCoffees} coffee(s) to Muhammad Fiaz`,
                image: "/logo.png",
                order_id: data.id,
                handler: function () {
                    setSuccessMessage(`🎉 Thank you, ${name.trim()}! Payment Successful.`);
                },
                prefill: {
                    name: name,
                    email: userEmail,
                },
                theme: {
                    color: "#6366f1",
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error("Payment error:", error);
            setErrorMessage("Something went wrong! Please try again.");
            setShowErrorPopup(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
                {/* Heading with Help Icon */}
                <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
                    <h2 className="text-lg font-semibold text-black dark:text-white">
                        Buy Muhammad Fiaz a coffee
                    </h2>

                    {/* Help Icon with Tooltip */}
                    <div className="relative">
                        <button
                            id="help-icon"
                            className="flex items-center justify-center w-6 h-6 text-sm font-bold text-black bg-gray-300 rounded-full focus:bg-gray-400"
                            onFocus={() => setTooltipVisible(true)}
                            onBlur={() => setTooltipVisible(false)}
                            onMouseEnter={() => setTooltipVisible(true)}
                            onMouseLeave={() => setTooltipVisible(false)}
                        >
                            ?
                        </button>

                        {tooltipVisible && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 text-sm text-black bg-white border border-gray-300 rounded-md shadow-lg transition-opacity duration-200">
                                It&#39;s a friendly metaphor, not real coffee. Each &#34;coffee&#34;
                                is {currency}{" "}
                                {(selectedCoffees * (amount as number) || 0).toFixed(2)} and you can
                                buy as many as you like.
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Coffee Selection */}
                    <div className="flex justify-center items-center space-x-4">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={40}
                            height={40}
                            className="w-10 h-10 sm:w-12 sm:h-12"
                        />
                        <span className="text-2xl font-semibold text-black">×</span>

                        {/* Coffee Buttons */}
                        {[1, 3, 5].map((value) => (
                            <button
                                key={value}
                                type="button"
                                className={`px-4 py-2 sm:px-5 sm:py-3 rounded-full font-medium ${
                                    selectedCoffees === value
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-200"
                                }`}
                                onClick={() => handleCoffeeSelection(value)}
                            >
                                {value}
                            </button>
                        ))}

                        {/* Custom Amount */}
                        <input
                            type="number"
                            min="1"
                            value={customCoffee}
                            onChange={handleCustomCoffeeChange}
                            className="w-20 text-center px-3 py-3 border rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                    </div>
                    {errors.coffee && <span className="text-red-500 text-sm">{errors.coffee}</span>}

                    {/* Name Input */}
                    <div>
                        <input
                            type="text"
                            placeholder="Name or @yoursocialhandle"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full px-4 py-3 border rounded-xl"
                        />
                        {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                    </div>

                    {/* Message Input */}
                    <div>
                        <textarea
                            rows={3}
                            placeholder="Say something nice..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="mt-2 block w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    {/* Amount Input */}
                    <div>
                        <input
                            type="number"
                            min="1"
                            step="1"
                            placeholder={`Amount or Cost per Coffee (${currency})`}
                            value={amount}
                            onChange={(e) => {
                                setAmount(parseFloat(e.target.value) || "");
                                setErrors({ ...errors, amount: "" });
                            }}
                            className="mt-2 block w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.amount && (
                            <span className="text-red-500 text-sm">{errors.amount}</span>
                        )}
                    </div>

                    {/* Tip Button */}
                    <button
                        type="submit"
                        className="w-full py-3 px-5 bg-indigo-600 text-white font-semibold rounded-xl"
                        disabled={loading}
                    >
                        {loading
                            ? "Processing..."
                            : `Tip ${(selectedCoffees * (amount as number) || 0).toFixed(2)} (${currency})`}
                    </button>

                    {successMessage && (
                        <p className="text-green-600 text-sm text-center">{successMessage}</p>
                    )}
                    <p className="text-center text-sm text-gray-500 mt-3">
                        Payments go directly to{" "}
                        <Link href={"https://github.com/muhammad-fiaz"} className={"text-blue-500"}>
                            {" "}
                            Muhammad Fiaz.
                        </Link>
                    </p>
                </form>
            </div>
            {/* Error Popup Modal */}
            {showErrorPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80 text-center border border/black/20">
                        <h3 className="text-lg font-semibold text-red-600">Payment Failed</h3>
                        <p className="text-gray-600 mt-2">{errorMessage}</p>
                        <button
                            onClick={() => setShowErrorPopup(false)}
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
