import { Category } from "@/app/models/Category";
import { MenuItem } from "@/app/models/MenuItem";

import mongoose from "mongoose";

export async function POST(req) {
    mongoose.connect(process.env.MONGO_URL);
    const {name, images} = await req.json();
    if(images[0] == '') {
        return Response.json({ error: 'Must include an image' }, { status: 400 });
    }
    const categoryDoc = await Category.create({name});
    const MenuItemDoc = await MenuItem.create({name, category: '663763607c0a5deda8b70c57', categoryID: categoryDoc._id, images: images[0]}); //All categories
    return Response.json(categoryDoc, MenuItemDoc);
}

export async function PUT(req) {
    mongoose.connect(process.env.MONGO_URL);
    const {_id, name, images} = await req.json();
    if(images[0] == '') {
        return Response.json({ error: 'Must include an image' }, { status: 400 });
    }
    await Category.updateOne({_id}, {name});
    const categoryMenuItem = await MenuItem.findOne({categoryID: _id})
    if (!categoryMenuItem) {
        await MenuItem.create({name, category: '663763607c0a5deda8b70c57', categoryID: _id, images: images[0]}); //All categories
    }
    else {
        await MenuItem.updateOne({categoryID: _id}, {name, images: images[0]});
    }
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
    const forbiddenCategoriesToDelete = ['663763607c0a5deda8b70c57', '663763657c0a5deda8b70c5a', '663763697c0a5deda8b70c5d', '6637636e7c0a5deda8b70c60', '663764337c0a5deda8b710cc', '663764367c0a5deda8b710cf']
    const _id = url.searchParams.get('_id');

    if (forbiddenCategoriesToDelete.includes(_id)) {
        // If it is, return an error response or handle it as needed
        return Response.json({ error: 'Cannot delete this category' }, { status: 403 });
    }

    const menuItemExists = await MenuItem.exists({ category: _id });
    if (menuItemExists) {
        return Response.json({ error: 'Cannot delete this category as it is associated with menu items' }, { status: 400 });
    }

    const categoryMenuItem = await MenuItem.findOne({categoryID: _id})

    if(categoryMenuItem) {
        await MenuItem.deleteOne(categoryMenuItem._id)
    }
    
    await Category.deleteOne({_id})
    return Response.json(true);
}