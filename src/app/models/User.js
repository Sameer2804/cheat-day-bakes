import { Schema, models, model } from "mongoose";
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
    firstName: {type: String},
    lastName: {type: String},
    phone: {type: String},
    email: {type: String, required: true, unique: true},
    password: {
        type: String, 
        required: true,
        validate: {
            validator: function (value) {
                // Check if password has at least 8 characters and contains at least one capital letter
                return /^(?=.*[A-Z]).{8,}$/.test(value);
            },
            message: `Password must be at least 8 characters long and contain at least one capital letter.`
        }
    },

}, {timestamps: true});

UserSchema.post('validate', function(user) {
    const notHashedPassword = user.password;
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(notHashedPassword, salt);
})

export const User = models?.User || model('User', UserSchema);