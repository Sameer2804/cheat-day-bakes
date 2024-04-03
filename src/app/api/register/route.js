import { User } from "@/app/models/User";
import mongoose from "mongoose";

export async function POST(req) {
    const body = await req.json();
    mongoose.connect(process.env.MONGO_URL);

    try {
        const createdUser = await User.create(body);
        
        return new Response(JSON.stringify(createdUser), { status: 200 });
    } catch (error) {
        const errorsToSend = {
            errors: [],
            status: 400, // Default to a bad request status
        };

        const user = await User.findOne({ email: body.email });

        if (error instanceof mongoose.Error.ValidationError) {
            // Accumulate validation errors
            const validationErrors = Object.values(error.errors).map(err => err.message);
            errorsToSend.errors.push(...validationErrors);
        }

        if (user) {
            // Handle duplicate key error (e.g., user already exists)
            errorsToSend.errors.push("Email already in use.");
        }

        // If there are no recognized errors, it's an unexpected server error
        if (errorsToSend.errors.length === 0) {
            errorsToSend.errors.push("Internal Server Error");
            errorsToSend.status = 500; // Change status to Internal Server Error
        }

        // Send all accumulated errors in a single response
        return new Response(JSON.stringify({ error: errorsToSend.errors }), { status: errorsToSend.status });
    }
}
