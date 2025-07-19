import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
    try {
        const { amount, currency } = await req.json();
        if (!amount || !currency) {
            return NextResponse.json(
                { error: "Amount and currency are required" },
                { status: 400 }
            );
        }
        const order = await razorpay.orders.create({
            amount,
            currency,
            receipt: `receipt_${Date.now()}`,
        });
        return NextResponse.json(order, { status: 200 });
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
