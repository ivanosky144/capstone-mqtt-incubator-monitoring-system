import mongoose from "mongoose";

export interface Sensor extends mongoose.Document {
    sensor_id: number
    location: string
}

const SensorSchema = new mongoose.Schema<Sensor>({
    sensor_id: {
        type: Number,
        required: true
    },
    location: {
        type: String
    }
});

export default mongoose.models.Sensor || mongoose.model<Sensor>("Sensor", SensorSchema);

