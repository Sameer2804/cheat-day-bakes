import mongoose, { Schema, model, models } from "mongoose";

const ExtraPriceSchema = new Schema({
    name: String,
    price: Number,
})

const MenuItemSchema = new Schema({
    images: {type: [String]},
    name: {type: String},
    description: {type: String},
    basePrice: {type: Number},
    category: {type: mongoose.Types.ObjectId},
    sizes: {type: [ExtraPriceSchema]},
    toppings: {type: [ExtraPriceSchema]},
    giftBoxOption: {type: Boolean}

}, {timestamps: true})

export const MenuItem = models?.MenuItem || model('MenuItem', MenuItemSchema);