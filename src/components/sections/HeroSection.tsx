"use client";

import { useState } from "react";
import Image from "next/image";
export default function TipForm() {
    const [selectedCoffees, setSelectedCoffees] = useState<number>(0);
    const [customCoffee, setCustomCoffee] = useState<number >(10);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [amount, setAmount] = useState<number | "">("");
    const [successMessage, setSuccessMessage] = useState("");

    // Validation Errors
    const [errors, setErrors] = useState({
        coffee: "",
        name: "",
        amount: "",
    });

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

    const handleSubmit = (e: React.FormEvent) => {
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

        if (!amount || amount < 1) {
            newErrors.amount = "Amount must be at least $1.";
            isValid = false;
        }

        setErrors(newErrors);

        if (!isValid) return;

        const totalAmount = selectedCoffees * (amount as number);

        setSuccessMessage(
            `🎉 Thank you, ${name.trim()}! You've tipped ${selectedCoffees} coffee(s) ($${totalAmount.toFixed(2)})`
        );
    };

    return (
        <section className="flex flex-col items-center justify-center min-h-screen relative px-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md mx-auto bg-opacity-90">
                {/* Heading with Help Icon */}
                <div className="flex items-center space-x-2 mb-4">
                    <h2 className="text-lg font-semibold text-black dark:text-white">Buy Muhammad Fiaz a coffee</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Coffee Selection */}
                    <div className="flex justify-center items-center space-x-4">
                        <Image src="/logo.png" alt="Logo" width={100} height={100} className="w-12 h-12" />
                        <span className="text-2xl font-semibold text-black">×</span>

                        {/* Coffee Buttons */}
                        {[1, 3, 5].map((value) => (
                            <button
                                key={value}
                                type="button"
                                className={`px-5 py-3 rounded-full font-medium hover:bg-gray-300 ${
                                    selectedCoffees === value ? "bg-indigo-600 text-white" : "bg-gray-200 text-black"
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
                            max="99"
                            value={customCoffee}
                            onChange={handleCustomCoffeeChange}
                            className="w-20 text-center px-3 py-3 border rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                    </div>
                    {errors.coffee && <span className="text-red-500 text-sm text-center">{errors.coffee}</span>}

                    {/* Name Input */}
                    <div>
                        <input
                            type="text"
                            placeholder="Name or @yoursocialhandle"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setErrors({ ...errors, name: "" });
                            }}
                            className="mt-2 block w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                            step="0.01"
                            placeholder="Amount per Coffee ($)"
                            value={amount}
                            onChange={(e) => {
                                setAmount(parseFloat(e.target.value) || "");
                                setErrors({ ...errors, amount: "" });
                            }}
                            className="mt-2 block w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.amount && <span className="text-red-500 text-sm">{errors.amount}</span>}
                    </div>

                    {/* Tip Button */}
                    <button
                        type="submit"
                        className="w-full py-3 px-5 bg-indigo-600 text-white font-semibold rounded-xl shadow-md transition-all duration-200 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 active:scale-95"
                    >
                        Tip
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-3">Payments go directly to Muhammad Fiaz.</p>
                    {successMessage && <p className="text-green-600 text-sm mt-2 text-center">{successMessage}</p>}
                </form>
            </div>
        </section>
    );
}
