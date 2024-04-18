import { MenuItem } from "@/app/models/MenuItem";
import mongoose from "mongoose";
import { Order } from "@/app/models/Order";
import { getServerSession } from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route"
const stripe = require('stripe')(process.env.STRIPE_SK);

export async function POST(req) {
    mongoose.connect(process.env.MONGO_URL);

    const { userDetails, cartProducts } = await req.json();
    const session = await getServerSession(authOptions);
    const loggedInEmail = session?.user?.email;

    function generateOrderNumber() {
        const randomNumber = Math.floor(Math.random() * 1000);
        const timestamp = Date.now();
        return `${timestamp}${randomNumber}`;
    }
    
    const orderNumber = generateOrderNumber()

    const orderDoc = await Order.create({
        orderNumber,
        loggedInEmail,
        ...userDetails,
        cartProducts,
        paid: false
    })

    const stripeLineItems = [];

    for (const cartProduct of cartProducts) {
        const productName = cartProduct.name;

        const productInfo = await MenuItem.findById(cartProduct._id);
        let productPrice = (productInfo.basePrice);
        if (cartProduct.size) {
            const size = productInfo.sizes.find(size => size._id.toString() === cartProduct.size._id.toString());
            productPrice += (size.price);
        }
        if (cartProduct.toppings?.length > 0){
            for (const cartProductTopping of cartProduct.toppings) {
                const topping = productInfo.toppings.find(topping => topping._id.toString() === cartProductTopping._id.toString())
                productPrice += (topping.price);
            }
        }
        if (cartProduct.giftBox) {
            productPrice += (1.50);
        }
        
        stripeLineItems.push({
            quantity: cartProduct.quantity,
            price_data: {
                currency: 'GBP',
                product_data: {
                    name: `${productName}${cartProduct.size ? ' (' + cartProduct.size.name + ')' : ''}`,
                    metadata: {
                        size: cartProduct.size?.name,
                        toppings: cartProduct.toppings?.map(topping => topping.name).join(', '),
                        giftBox: cartProduct.giftBox
                    },
                    description: (cartProduct.toppings && cartProduct.toppings.length > 0) ? `Toppings: ${cartProduct.toppings.map(topping => topping.name).join(', ')}` : ' ',
                },
                unit_amount: productPrice * 100,
            }
        })
        
    }

    const stripeSession = await stripe.checkout.sessions.create({
        line_items: stripeLineItems,
        mode: 'payment',
        customer_email: userDetails.email,
        success_url: process.env.NEXTAUTH_URL + 'orders/' + orderDoc._id.toString() + '?clear-cart=1',
        cancel_url: process.env.NEXTAUTH_URL + 'checkout?cancelled=1',
        metadata: {orderId: orderDoc._id.toString()},
        payment_intent_data: {
            metadata: {orderId: orderDoc._id.toString()},
        },
        allow_promotion_codes: true,

    })

    return Response.json(stripeSession.url);

}
