import mongoose from "mongoose";

export interface UserSensor extends mongoose.Document {
    user_id: string
    sensor_id: number
}

const UserSensorSchema = new mongoose.Schema<UserSensor>({
    user_id: {
        type: String,
        required: true
    },
    sensor_id: {
        type: Number,
        required: true
    }
});


export default mongoose.models.UserSensor || mongoose.model<UserSensor>("UserSensor", UserSensorSchema);