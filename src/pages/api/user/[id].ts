import { connectToDatabase } from "@/utils/db_connection";
import user from "@/models/user";
import type { NextApiRequest, NextApiResponse } from "next";
import authMiddleware from "@/middleware/auth_middleware";

async function handleUserByIdRequests(req: NextApiRequest, res: NextApiResponse) {
    await connectToDatabase();

    switch(req.method) {
        case 'GET':
            return getUserDetail(req, res);
        case 'PUT':
            return updateUserDetail(req, res);
        default:
            return
    }
}

async function getUserDetail(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const userDetail = await user.findById(id);

    if (!userDetail) {
        return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(userDetail);
}

async function updateUserDetail(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const updatedUser = await user.findByIdAndUpdate(id);

    return res.status(200).json(updatedUser);
}

export default authMiddleware(handleUserByIdRequests);
