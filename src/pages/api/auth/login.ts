import { comparePassword, generateToken } from "@/libs/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/utils/db_connection";
import User from "@/models/User";

export default async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
    await connectToDatabase();

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordCorrect = await comparePassword(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = generateToken(existingUser);

        return res.status(200).json({ token: token, message: "Login successful"});

    } catch(err) {
        return res.status(500).json(err);
    }
}