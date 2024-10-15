import { connectToDatabase } from "@/utils/db_connection";
import type { NextApiRequest, NextApiResponse } from "next";
import authMiddleware from "@/middleware/auth_middleware";
import UserSensor from "@/models/UserSensor";
import SensorReading from "@/models/SensorReading";

async function handleSensorByIdRequest(req: NextApiRequest, res: NextApiResponse) {
    await connectToDatabase();

    switch(req.method) {

        default:
            return
    }
}


export default authMiddleware(handleSensorByIdRequest);
