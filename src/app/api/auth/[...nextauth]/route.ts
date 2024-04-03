import * as mongoose from "mongoose";
import { User } from "@/app/models/User";
import bcrypt from 'bcrypt';
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/libs/mongoConnect";

const handler = NextAuth({
    secret: process.env.SECRET,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            id: 'credentials',
            credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const {email, password} = credentials;
                mongoose.connect(process.env.MONGO_URL);
                const user = await User.findOne({email});
                const credentialsOK = user && bcrypt.compareSync(password, user.password)

                if (credentialsOK) {
                    console.log(user)
                    return user;
                }

                return null
                
            }
        })
    ]
})

export { handler as GET, handler as POST }