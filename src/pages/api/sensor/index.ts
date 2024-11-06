import { connectToDatabase } from "@/utils/db_connection";
import type { NextApiRequest, NextApiResponse } from "next";
import authMiddleware from "@/middleware/auth_middleware";
import UserSensor from "@/models/user_sensor";
import SensorReading from "@/models/sensor_reading";
import Stats from "@/models/stats";
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
        const { user_id } = req.query;

        let data = {};
        let analog: any = [];
        let i2c = {};
        for (let i = 1; i <= 5; i++) {
            const userSensor = await UserSensor.find({ user_id: user_id, sensor_id: i});
            const sensorReading = await SensorReading.find({ user_sensor_id: userSensor[0]._id });
            const averageHumidity = sensorReading.reduce((sum, entry) => sum+entry.humidity, 0)/sensorReading.length;
            const averageTemperature = sensorReading.reduce((sum, entry) => sum+entry.temperature, 0)/sensorReading.length;

            const minHumidity = Math.min(...sensorReading.map(entry => entry.humidity));
            const maxHumidity = Math.max(...sensorReading.map(entry => entry.humidity));
            const minTemperature = Math.min(...sensorReading.map(entry => entry.temperature));
            const maxTemperature = Math.max(...sensorReading.map(entry => entry.temperature));

            let stats = {
                avg_hum: averageHumidity.toFixed(2),
                avg_temp: averageTemperature.toFixed(2),
                min_hum: minHumidity,
                max_hum: maxHumidity,
                min_temp: minTemperature,
                max_temp: maxTemperature
            };

            const sensorData = {
                data: sensorReading,
                stats
            };
            
            if (i<5) {
                analog.push(sensorData)
            } else if (i == 5) {
                i2c = sensorData
            }
        }

        data = {
            analog,
            i2c
        }

        return res.status(201).json({ data, message: "Sensor data histories retrieved successfully" });

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
