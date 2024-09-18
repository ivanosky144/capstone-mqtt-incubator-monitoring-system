import mongoose from "mongoose";

export interface SensorReading extends mongoose.Document {
    temperature: number
    humidity: number
}

const SensorReadingSchema = new mongoose.Schema<SensorReading>({
    temperature: {
        type: Number,
        required: true
    },
    humidity: {
        type: Number,
        required: true
    }
});

export default mongoose.models.SensorReading || mongoose.model<SensorReading>("SensorReading", SensorReadingSchema);