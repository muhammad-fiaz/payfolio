import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CryptoPaymentModal from "@/components/CryptoPaymentModal";

interface TipFormUIProps {
    selectedCoffees: number;
    customCoffee: number;
    name: string;
    message: string;
    amount: number | "";
    successMessage: string;
    loading: boolean;
    tooltipVisible: boolean;
    currency: string;
    currencyOptions: string[];
    errors: { coffee: string; name: string; amount: string };
    showErrorPopup: boolean;
    errorMessage: string;
    cryptoOpen: boolean;
    setTooltipVisible: (v: boolean) => void;
    handleCoffeeSelection: (v: number) => void;
    handleCustomCoffeeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    setCryptoOpen: (v: boolean) => void;
    setName: (v: string) => void;
    setMessage: (v: string) => void;
    setAmount: (v: number | "") => void;
    setCurrency: (v: string) => void;
    setErrors: (v: { coffee: string; name: string; amount: string }) => void;
    setShowErrorPopup: (v: boolean) => void;
}

export function TipFormUI(props: TipFormUIProps) {
    const {
        selectedCoffees,
        customCoffee,
        name,
        message,
        amount,
        successMessage,
        loading,
        tooltipVisible,
        currency,
        currencyOptions,
        errors,
        showErrorPopup,
        errorMessage,
        cryptoOpen,
        setTooltipVisible,
        handleCoffeeSelection,
        handleCustomCoffeeChange,
        handleSubmit,
        setCryptoOpen,
    } = props;

    return (
        <section className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-xl mx-auto px-2 py-6 sm:px-4 sm:py-12">
                {/* Heading with Help Icon */}
                <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
                    <h2 className="text-lg font-semibold text-black dark:text-white">
                        Buy Muhammad Fiaz a coffee
                    </h2>
                    {/* Help Icon with Tooltip */}
                    <div className="relative">
                        <Button
                            id="help-icon"
                            variant="outline"
                            className="flex items-center justify-center w-6 h-6 text-sm font-bold text-black bg-gray-300 rounded-full focus:bg-gray-400"
                            onFocus={() => setTooltipVisible(true)}
                            onBlur={() => setTooltipVisible(false)}
                            onMouseEnter={() => setTooltipVisible(true)}
                            onMouseLeave={() => setTooltipVisible(false)}
                        >
                            ?
                        </Button>
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
                    <div className="flex flex-row flex-nowrap justify-center items-center gap-2 md:gap-4 w-full py-2">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={36}
                            height={36}
                            className="w-9 h-9 md:w-12 md:h-12"
                        />
                        <span className="text-xl md:text-2xl font-semibold text-black">×</span>
                        {[1, 3, 5].map((value: number) => (
                            <Button
                                key={value}
                                type="button"
                                variant={selectedCoffees === value ? "default" : "outline"}
                                className={`px-3 py-2 md:px-5 md:py-2 rounded-full font-semibold text-base md:text-lg ${selectedCoffees === value ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
                                onClick={() => handleCoffeeSelection(value)}
                            >
                                {value}
                            </Button>
                        ))}
                        <input
                            type="number"
                            min="1"
                            value={customCoffee}
                            onChange={handleCustomCoffeeChange}
                            className="w-14 md:w-20 text-center px-2 py-2 md:px-4 md:py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-base md:text-lg"
                        />
                    </div>
                    {errors.coffee && <span className="text-red-500 text-sm">{errors.coffee}</span>}
                    {/* Name Input */}
                    <div>
                        <input
                            type="text"
                            placeholder="Name or @yoursocialhandle"
                            value={name}
                            onChange={(e) => props.setName(e.target.value)}
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
                            onChange={(e) => props.setMessage(e.target.value)}
                            className="mt-2 block w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    {/* Amount and Currency Input */}
                    <div className="flex space-x-2">
                        <input
                            type="number"
                            min="1"
                            step="1"
                            placeholder={`Amount or Cost per Coffee (${currency})`}
                            value={amount}
                            onChange={(e) => {
                                props.setAmount(parseFloat(e.target.value) || "");
                                props.setErrors({ ...errors, amount: "" });
                            }}
                            className="mt-2 block w-3/4 px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <select
                            value={currency}
                            onChange={(e) => props.setCurrency(e.target.value)}
                            className="mt-2 block w-1/4 px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            {currencyOptions.map((currencyOption: string) => (
                                <option key={currencyOption} value={currencyOption}>
                                    {currencyOption}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.amount && <span className="text-red-500 text-sm">{errors.amount}</span>}
                    {/* Tip Button */}
                    <Button
                        type="submit"
                        className="w-full py-3 px-5 bg-indigo-600 text-white font-semibold rounded-xl"
                        disabled={loading}
                    >
                        {loading
                            ? "Processing..."
                            : `Tip ${(selectedCoffees * (amount as number) || 0).toFixed(2)} (${currency})`}
                    </Button>
                    {successMessage && (
                        <p className="text-green-600 text-sm text-center">{successMessage}</p>
                    )}
                    <div className="w-full mb-2">
                        <p className="text-center text-sm text-gray-600 mb-2">
                            Want to tip cryptocurrency?
                        </p>
                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full py-2 px-5 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-500 transition"
                            onClick={() => setCryptoOpen(true)}
                        >
                            Tip with Crypto
                        </Button>
                    </div>
                    {cryptoOpen && (
                        <CryptoPaymentModal
                            open={cryptoOpen}
                            onClose={() => setCryptoOpen(false)}
                        />
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
                        <Button
                            onClick={() => props.setShowErrorPopup(false)}
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </section>
    );
}
