import type { NextApiRequest, NextApiResponse } from "next";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { amount, currency } = req.body;

        if (!amount || !currency) {
            return res.status(400).json({ error: "Amount and currency are required" });
        }

        const order = await razorpay.orders.create({
            amount,
            currency,
            receipt: `receipt_${Date.now()}`,
        });

        res.status(200).json(order);
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
}
