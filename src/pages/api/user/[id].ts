import { connectToDatabase } from "@/utils/db_connection";
import type { NextApiRequest, NextApiResponse } from "next";
import authMiddleware from "@/middleware/auth_middleware";
import User from "@/models/User";
import UserSensor from "@/models/UserSensor";


interface UserDetailResponse {
    email: string
    username: string
    password: string    
    sensors: Array<any>
}

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
    const userPersonalDetail = await User.findById(id);

    if (!userPersonalDetail) {
        return res.status(404).json({ message: 'User not found' });
    }

    const userDetail: UserDetailResponse = {
        username: userPersonalDetail.username,
        email: userPersonalDetail.email,
        password: userPersonalDetail.password,
        sensors: []
    }

    const userSensors = await UserSensor.find({ user_id: id});

    userDetail.sensors = userSensors;

    return res.status(200).json(userDetail);
}

async function updateUserDetail(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const updatedUser = await User.findByIdAndUpdate(id);

    return res.status(200).json(updatedUser);
}

export default authMiddleware(handleUserByIdRequests);
