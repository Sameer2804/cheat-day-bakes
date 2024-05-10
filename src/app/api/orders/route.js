import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route"
import { Order } from "@/app/models/Order";
import { UserInfo } from "@/app/models/UserInfo";

export async function GET(req) {
    mongoose.connect(process.env.MONGO_URL);

    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    let isAdmin = false;

    const url = new URL(req.url);
    const isDateOnly = url.searchParams.get('dateOnly');

    if(isDateOnly) {
        const orders = await Order.find({ paid: true, status: { $ne: 'cancelled' } }, 'collectionDateTime');
        return new Response(JSON.stringify(orders), { headers: { "Content-Type": "application/json" } });
    }

    const _id = url.searchParams.get('_id')
    if(_id){
        return Response.json( await Order.findById(_id) )
    }

    if (userEmail) {
        const userInfo = await UserInfo.findOne({email: userEmail});
        if (userInfo) {
            isAdmin = userInfo.admin;
        }
    }

    if (isAdmin) {
        return Response.json( await Order.find() )
    }

    if (userEmail) {
        return Response.json( await Order.find( {email: userEmail} ))
    }

}

export async function PUT(req) {
    mongoose.connect(process.env.MONGO_URL);
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    let isAdmin = false;

    if (userEmail) {
        const userInfo = await UserInfo.findOne({email: userEmail});
        if (userInfo) {
            isAdmin = userInfo.admin;
        }
    }

    const url = new URL(req.url);
    const _id = url.searchParams.get('_id');
    const newStatus = await req.json();

    try {
        
        if(!isAdmin) {
            return Response.json({ error: 'Only admins can perform this action' }, { status: 401 });
        }

        if(newStatus === 'cancelled') {
            await Order.findByIdAndUpdate(_id, {status: newStatus})
        }
        else if(newStatus === 'completed') {
            await Order.findByIdAndUpdate(_id, {status: newStatus})

        }
        else if(newStatus === 'in progress') {
            await Order.findByIdAndUpdate(_id, {status: newStatus})
        }
        
        return Response.json(true);

    } catch (error) {
        return Response.json({ error: 'An error has occured' }, { status: 500 });
    }
}