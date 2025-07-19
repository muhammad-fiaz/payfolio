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

interface RazorpayInstance {
    open: () => void;
}

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

declare global {
    interface Window {
        Razorpay: RazorpayConstructor;
    }
}
import { useEffect, useState } from "react";
import countryToCurrency from "@/utils/CurrencyProvider";
import Cookies from "js-cookie";

interface TipFormErrors {
    coffee: string;
    name: string;
    amount: string;
}

export interface UseTipFormReturn {
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
    errors: TipFormErrors;
    showErrorPopup: boolean;
    errorMessage: string;
    cryptoOpen: boolean;
    setSelectedCoffees: (v: number) => void;
    setCustomCoffee: (v: number) => void;
    setName: (v: string) => void;
    setMessage: (v: string) => void;
    setAmount: (v: number | "") => void;
    setSuccessMessage: (v: string) => void;
    setLoading: (v: boolean) => void;
    setTooltipVisible: (v: boolean) => void;
    setCurrency: (v: string) => void;
    setCurrencyOptions: (v: string[]) => void;
    setErrors: (v: TipFormErrors) => void;
    setShowErrorPopup: (v: boolean) => void;
    setErrorMessage: (v: string) => void;
    setCryptoOpen: (v: boolean) => void;
    handleCoffeeSelection: (v: number) => void;
    handleCustomCoffeeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

export function useTipForm(userEmail: string): UseTipFormReturn {
    const [selectedCoffees, setSelectedCoffees] = useState<number>(1);
    const [customCoffee, setCustomCoffee] = useState<number>(1);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [amount, setAmount] = useState<number | "">(10);
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [currency, setCurrency] = useState<string>("USD");
    const [currencyOptions, setCurrencyOptions] = useState<string[]>([]);
    const [errors, setErrors] = useState<TipFormErrors>({ coffee: "", name: "", amount: "" });
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [cryptoOpen, setCryptoOpen] = useState(false);

    useEffect(() => {
        const fetchCurrency = async () => {
            try {
                const storedCurrency = Cookies.get("currency");
                if (storedCurrency) {
                    setCurrency(storedCurrency);
                    return;
                }
                const geoRes = await fetch("https://ipapi.co/json/");
                const geoData = await geoRes.json();
                if (!geoData.country) throw new Error("Failed to retrieve country");
                const countryCode = geoData.country.toUpperCase();
                const detectedCurrency = countryToCurrency[countryCode] || "USD";
                Cookies.set("currency", detectedCurrency, { expires: 7, sameSite: "Lax" });
                setCurrency(detectedCurrency);
            } catch {
                setCurrency("USD");
            }
        };
        fetchCurrency();
        setCurrencyOptions(Object.values(countryToCurrency));
    }, []);

    const handleCoffeeSelection = (value: number) => {
        setSelectedCoffees(value);
        setCustomCoffee(value);
        setErrors({ ...errors, coffee: "" });
    };

    const handleCustomCoffeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(e.target.value) || 0;
        value = Math.max(1, Math.min(99, value));
        setSelectedCoffees(value);
        setCustomCoffee(value);
        setErrors({ ...errors, coffee: "" });
    };

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
            const options = {
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
        } catch {
            setErrorMessage("Something went wrong! Please try again.");
            setShowErrorPopup(true);
        } finally {
            setLoading(false);
        }
    };

    return {
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
        setSelectedCoffees,
        setCustomCoffee,
        setName,
        setMessage,
        setAmount,
        setSuccessMessage,
        setLoading,
        setTooltipVisible,
        setCurrency,
        setCurrencyOptions,
        setErrors,
        setShowErrorPopup,
        setErrorMessage,
        setCryptoOpen,
        handleCoffeeSelection,
        handleCustomCoffeeChange,
        handleSubmit,
    };
}
