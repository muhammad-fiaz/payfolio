"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function RefundPolicyPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-transparent px-2 py-8">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-full max-w-[800px] aspect-[210/297] bg-white/80 rounded-2xl shadow-2xl mx-auto flex flex-col items-center p-4 sm:p-8 md:p-12 border border-gray-300 mt-24 md:mt-32"
            >
                <Image
                    src="/logo.png"
                    alt="Payfolio Logo"
                    width={96}
                    height={96}
                    className="mx-auto mb-2"
                />
                <h1 className="text-3xl font-bold text-center mb-6">Refund Policy</h1>
                <div className="space-y-6 text-gray-700 text-base">
                    <p>
                        <strong>Payment Gateways:</strong> All payments are processed securely via
                        trusted third-party gateways such as Razorpay for fiat and Binance for
                        cryptocurrency. We do not store or process payment details directly.
                    </p>
                    <p>
                        <strong>No Refunds:</strong> All payments are final and non-refundable. We
                        do not offer refunds for any completed transactions, including donations,
                        tips, or purchases. Please review your payment carefully before confirming.
                    </p>
                    <p>
                        <strong>Exceptions:</strong> If you believe there has been an error or
                        exception with your payment, please contact us at{" "}
                        <Button variant="link" className="p-0">
                            contact@muhammadfiaz.com
                        </Button>{" "}
                        with your transaction details for review.
                    </p>
                    <p>
                        <strong>Contact:</strong> For any questions or concerns regarding payments,
                        please reach out to{" "}
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
