import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
    orderNumber: {type: Number},
    email: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    phone: {type: String},
    collectionDateTime: {type: Date},
    cartProducts: {type: Object},
    paid: {type: Boolean, default: false},
    discountAmount: {type: Number},
    status: {type: String, default: 'in progress'}
}, {timestamps: true});

export const Order = models?.Order || model('Order', OrderSchema)