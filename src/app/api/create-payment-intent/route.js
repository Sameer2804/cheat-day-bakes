import { MenuItem } from "@/app/models/MenuItem";
import mongoose from "mongoose";
const stripe = require('stripe')(process.env.STRIPE_SK);

export async function POST(req) {
    mongoose.connect(process.env.MONGO_URL);

    const { cartProducts } = await req.json();

    let totalPrice = 0;

    for (const cartProduct of cartProducts) {
        const productInfo = await MenuItem.findById(cartProduct._id);
        let productPrice = (productInfo.basePrice * cartProduct.quantity);
        if (cartProduct.size) {
            const size = productInfo.sizes.find(size => size._id.toString() === cartProduct.size._id.toString());
            productPrice += (size.price * cartProduct.quantity);
        }
        if (cartProduct.toppings?.length > 0){
            for (const cartProductTopping of cartProduct.toppings) {
                const topping = productInfo.toppings.find(topping => topping._id.toString() === cartProductTopping._id.toString())
                productPrice += (topping.price * cartProduct.quantity);
            }
        }
        if (cartProduct.giftBox) {
            productPrice += (1.50 * cartProduct.quantity);
        }
        totalPrice += productPrice
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalPrice * 100,
            currency: "gbp",
            //receipt_email: email, //add email here
            automatic_payment_methods: {
              enabled: true,
            },
            metadata: {
                order_id: null,
              },
        });

        return Response.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        return Response.json({ error: "Failed to create payment intent" });
    }
}
