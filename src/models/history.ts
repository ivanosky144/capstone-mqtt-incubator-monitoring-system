import mongoose, { Schema } from "mongoose";

export interface History extends mongoose.Document {
    max_temperature: number
    min_temperature: number
    min_humidty: number   
    max_humidty: number   
    avg_temperature: number   
    avg_humidity: number   
    date: Date   
    user_id: Schema.Types.ObjectId
}

const HistorySchema = new mongoose.Schema<History>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
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

export default mongoose.models.History || mongoose.model<History>("History", HistorySchema);