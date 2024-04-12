import { Category } from "@/app/models/Category";
import { MenuItem } from "@/app/models/MenuItem";

import mongoose from "mongoose";

export async function POST(req) {
    mongoose.connect(process.env.MONGO_URL);
    const {name} = await req.json();
    const categoryDoc = await Category.create({name});
    return Response.json(categoryDoc);
}

export async function PUT(req) {
    mongoose.connect(process.env.MONGO_URL);
    const {_id, name} = await req.json();
    await Category.updateOne({_id}, {name});
    return Response.json(true);
}

export async function GET(req) {
    mongoose.connect(process.env.MONGO_URL);
    const url = new URL(req.url);
    const categoryInUse = url.searchParams.get('findCategoryInUse');
    if(categoryInUse) {
        const distinctCategoryIds = await MenuItem.distinct('category');
        const categories = await Category.find({ _id: { $in: distinctCategoryIds } });
        return Response.json(categories);
    }
    return Response.json(
        await Category.find()
    )
}

export async function DELETE(req) {
    mongoose.connect(process.env.MONGO_URL);
    const url = new URL(req.url);
    const forbiddenCategoriesToDelete = ['6610b3a2555875c2afaa2ad9', '6610b6e4555875c2afaa2afd', '6610bd0c8a3885d3110a5943']
    const _id = url.searchParams.get('_id');

    if (forbiddenCategoriesToDelete.includes(_id)) {
        // If it is, return an error response or handle it as needed
        return Response.json({ error: 'Cannot delete this category' }, { status: 403 });
    }

    const menuItemExists = await MenuItem.exists({ category: _id });
    if (menuItemExists) {
        return Response.json({ error: 'Cannot delete this category as it is associated with menu items' }, { status: 400 });
    }
    
    await Category.deleteOne({_id})
    return Response.json(true);
}