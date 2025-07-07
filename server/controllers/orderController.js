//place order COD : /api/order/cod

import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Stripe from "stripe";
import User from "../models/User.js";


export const placeOrderCOD = async (req, res) => {
    try {
        const { items, address } = req.body;
        const userId = req.userId; // Get userId from auth middleware
        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid Data" })

        }

        //calc amunt using items


        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        }, 0)

        // add tax charge(2%)
        amount += Math.floor(amount * 0.02)


        // crateing new order data
        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",

        });
        return res.json({ success: true, message: "Order Placed Successfully" })
    }
    catch (error) {
        return res.json({ success: false, message: error.message });

    }
}


// get the order by user id :/api/order/user

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;

        const orders = await Order.find({ userId }).populate("items.product");

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.log("Error fetching user orders:", error);
        res.status(500).json({ success: false, message: "Error fetching user orders" });
    }
};



//get all order (for seller / admin) : /api/order/seller


export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: false }]
        }).populate("items.product address").sort({ createdAt: -1 });
        res.json({ success: true, orders });

    }
    catch (error) {
        res.json({ success: false, message: error.message })


    }
}
//place order stripe /api/order/stripe

export const placeOrderStripe = async (req, res) => {
    try {
        const { items, address } = req.body;
        const userId = req.userId; // Get userId from auth middleware
        const { origin } = req.headers;
        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid Data" })

        }

        //calc amunt using items
        let productData = [];

        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            })
            return (await acc) + product.offerPrice * item.quantity;
        }, 0)

        // add tax charge(2%)
        amount += Math.floor(amount * 0.02)


        // crateing new order data
        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",

        });


        //strpie gateway
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        //create line items for stripe

        const line_items = productData.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,

                    },
                    unit_amount: (item.price + item.price * 0.02) * 100
                },
                quantity: item.quantity,
            }

        })
        //create session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        })
        return res.json({ success: true, url: session.url });


    }
    catch (error) {
        return res.json({ success: false, message: error.message });

    }
}


//stripe webhooks to verify payments action : /stripe

export const stripeWebhooks = async (request, response) => {

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers['stripe-signature'];
    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    }
    catch (error) {
        response.status(400).send(`WebHook Error : ${error.message}`);
    }
    switch (event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            //getting session metadata

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });
            const { orderId, userId } = session.data[0].metadata;

            //mark payment as paid

            await Order.findByIdAndUpdate(orderId, { isPaid: true })
            //clear user cart
            await User.findByIdAndUpdate(userId, { cartItems: {} });
            break;

        }
        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            //getting session metadata

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });
            const { orderId} = session.data[0].metadata;

            //mark payment as paid

            await Order.findByIdAndDelete(orderId)
            break;
        }
        default:
            console.error(`Unhandled event type ${event.type}`);
            break;
    }
    response.json({recieved:true})
}

//handle tehe event
