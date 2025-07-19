"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-transparent px-2 py-8">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-full max-w-[800px] aspect-[210/297] bg-white/80 rounded-2xl shadow-2xl mx-auto flex flex-col items-center p-4 sm:p-8 md:p-12 border border-gray-300 mt-24 md:mt-32"
            >
                <Image src="/logo.png" alt="Logo" width={96} height={96} className="mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-center mb-6">Terms of Service</h1>
                <div className="space-y-6 text-gray-700 text-base">
                    <p>
                        <strong>Payments:</strong> All payments are processed via third-party
                        gateways (Razorpay, Binance). By using this site, you agree that all
                        payments are final and non-refundable. Please review your payment details
                        before confirming.
                    </p>
                    <p>
                        <strong>Data & Privacy:</strong> We collect only the information necessary
                        for payment and communication, including phone number, email address,
                        amount, name, and any message you provide. Your data is handled securely and
                        never shared except as required for payment processing or by law.
                    </p>
                    <p>
                        <strong>Conduct:</strong> Abuse, fraudulent activity, or violation of these
                        terms may result in suspension or termination of access.
                    </p>
                    <p>
                        <strong>Contact:</strong> For any questions or concerns, please contact{" "}
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
