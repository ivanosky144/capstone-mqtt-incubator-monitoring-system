import mongoose, { Schema } from "mongoose";

export interface SensorReading extends mongoose.Document {
    user_sensor_id: Schema.Types.ObjectId
    temperature: number
    humidity: number
}

const SensorReadingSchema = new mongoose.Schema<SensorReading>(
    {
        user_sensor_id: {
            type: Schema.Types.ObjectId,
            ref: "UserSensor",
            required: true
        },
        temperature: {
            type: Number,
            required: true
        },
        humidity: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.models.SensorReading || mongoose.model<SensorReading>("SensorReading", SensorReadingSchema);