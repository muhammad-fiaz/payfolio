"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-transparent px-2 py-8">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-full max-w-[800px] aspect-[210/297] bg-white/80 rounded-2xl shadow-2xl mx-auto flex flex-col items-center p-4 sm:p-8 md:p-12 border border-gray-300 mt-24 md:mt-32"
            >
                <Image src="/logo.png" alt="Logo" width={96} height={96} className="mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-center mb-6">Privacy Policy</h1>
                <div className="space-y-6 text-gray-700 text-base">
                    <p>
                        <strong>Data Collection:</strong> We collect only the information necessary
                        to process your payments and provide our services. This may include your
                        phone number, email address, payment amount, name (if provided), and any
                        message you voluntarily submit.
                    </p>
                    <p>
                        <strong>Usage:</strong> Your data is used solely for authentication, payment
                        processing, and communication regarding your transactions. We do not sell,
                        share, or disclose your information to third parties except as required by
                        law or payment processors.
                    </p>
                    <p>
                        <strong>Security:</strong> All data is stored securely and handled with
                        strict confidentiality. We use trusted third-party gateways (Razorpay,
                        Binance) for payment processing and do not store sensitive payment details.
                    </p>
                    <p>
                        <strong>Contact:</strong> For privacy concerns or data requests, please
                        contact{" "}
                        <Button variant="link" className="p-0">
                            contact@muhammadfiaz.com
                        </Button>
                        .
                    </p>
                </div>
            </motion.div>
        </main>
    );
}
