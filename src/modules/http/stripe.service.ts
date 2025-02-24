import Stripe from "stripe";
import { Injectable } from "@nestjs/common";

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    }

    async createCheckoutSession(courses:any[], amount:number, userId:string) {
        console.log(courses);
        console.log(amount);
        console.log(userId);
        
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
            success_url: `${process.env.BASE_URL}/success?sesstion_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.BASE_URL}/cancel`,
            metadata: {
                userId
            }
        });

        return sesstion;
    }
    
    async verifyRequest() {

    }
}