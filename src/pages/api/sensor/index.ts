import { connectToDatabase } from "@/utils/db_connection";
import type { NextApiRequest, NextApiResponse } from "next";
import authMiddleware from "@/middleware/auth_middleware";
import UserSensor from "@/models/UserSensor";
import SensorReading from "@/models/SensorReading";
import mongoose from "mongoose";

async function handleSensorRequest(req: NextApiRequest, res: NextApiResponse) {
    await connectToDatabase();

    switch(req.method) {

        case 'POST':
            return saveSensorReading(req, res);
        case 'GET':
            return getSensorDataHistories(req, res);
        case 'DELETE':
            return deleteSensorDataHistory(req, res);
        default:
            return
    }
}

async function saveSensorReading(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { user_id, sensor_id, temperature, humidity } = req.body;

        if (!user_id || !sensor_id || !temperature || !humidity) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userSensor: any = await UserSensor.findOne({ user_id, sensor_id });
        
        if (!userSensor) {
            return res.status(403).json({ message: "Invalid sensor for this user" });
        }

        const newReading = new SensorReading({
            user_sensor_id: userSensor._id,  
            temperature,
            humidity
        });

        await newReading.save();

        return res.status(201).json({ message: "Sensor data saved successfully" });
    } catch (error) {
        return res.status(500).json({ message: "An internal server error occurred", error });
    }
}


async function getSensorDataHistories(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { user_id } = req.body;

        let data = [];
        for (let i = 1; i < 4; i++) {
            const userSensor = await UserSensor.find({ user_id, sensor_id: i});

            const sensorReading = await SensorReading.find({ user_sensor_id: userSensor });

            data.push(sensorReading);
        }

        return res.status(201).json({ message: "Sensor data histories retrieved successfully" });

    } catch (error) {
        return res.status(500).json(error);
    }
}

async function deleteSensorDataHistory(req: NextApiRequest, res: NextApiResponse) {
    try {
    } catch (error) {
        return res.status(500).json(error);
    }
}

export default handleSensorRequest;
