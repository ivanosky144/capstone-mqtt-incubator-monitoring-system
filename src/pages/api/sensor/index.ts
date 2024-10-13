import { connectToDatabase } from "@/utils/db_connection";
import user from "@/models/user";
import type { NextApiRequest, NextApiResponse } from "next";
import authMiddleware from "@/middleware/auth_middleware";

async function handleSensorReadingRequest(req: NextApiRequest, res: NextApiResponse) {
    await connectToDatabase();

    switch(req.method) {

        case 'POST':
            return saveSensorReading(req, res);
        default:
            return
    }
}

async function saveSensorReading(req: NextApiRequest, res: NextApiResponse) {
    try {
    } catch (error) {
        return res.status(500).json(error);
    }
}


export default authMiddleware(handleSensorReadingRequest);
