import Stripe from "stripe";
import { Injectable } from "@nestjs/common";

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    }

    async createCheckoutSession(courses:any[], amount:number, userId:string) {        
        const sesstion = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: courses.map(course => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: course.title
                    },
                    unit_amount: amount,
                },
                quantity: 1
            })),
            mode: "payment",
            success_url: `${process.env.BASE_URL}/payment/success?sesstion_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.BASE_URL}/payment/cancel`,
            metadata: {
                userId
            }
        });

        return sesstion;
    }
}