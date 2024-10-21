import mongoose, { Schema } from "mongoose";

export interface Stats extends mongoose.Document {
    max_temperature: number
    min_temperature: number
    min_humidty: number   
    max_humidty: number   
    avg_temperature: number   
    avg_humidity: number   
    date: Date   
    user_sensor_id: Schema.Types.ObjectId
}

const StatsSchema = new mongoose.Schema<Stats>(
    {
        user_sensor_id: {
            type: Schema.Types.ObjectId,
            ref: "UserSensor",
            required: true
        },
        max_temperature: {
            type: Number,
        },
        min_temperature: {
            type: Number,
        },
        min_humidty: {
            type: Number,
        },
        max_humidty: {
            type: Number,
        },
        avg_temperature: {
            type: Number,
        },
        avg_humidity: {
            type: Number,
        },
        date: {
            type: Date
        }
    },
    { timestamps: true }
);

export default mongoose.models.Stats || mongoose.model<Stats>("Stats", StatsSchema);