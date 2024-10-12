import user from "@/models/user";
import { comparePassword, generateToken, hashPassword } from "@/libs/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/utils/db_connection";

export default async function registerHandler(req: NextApiRequest, res: NextApiResponse) {
    await connectToDatabase();

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, email, password } = req.body;

    try {
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(404).json({ message: 'User already exist' });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = new user({ username, email, password: hashedPassword });
        await newUser.save();

        return res.status(200).json({ message: "User registered successfully"});

    } catch(err) {
        return res.status(500).json(err);
    }
}