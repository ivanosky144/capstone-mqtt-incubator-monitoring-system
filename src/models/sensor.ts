import mongoose, { Schema } from "mongoose";

export interface Sensor extends mongoose.Document {
    location: string
}

const SensorSchema = new mongoose.Schema<Sensor>(
    {
        location: {
            type: String
        }
    }
);

export default mongoose.models.Sensor || mongoose.model<Sensor>("Sensor", SensorSchema);

