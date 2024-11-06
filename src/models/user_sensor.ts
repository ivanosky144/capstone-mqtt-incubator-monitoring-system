import mongoose, { Schema } from "mongoose";

export interface UserSensor extends mongoose.Document {
    user_id: Schema.Types.ObjectId
    sensor_id: Schema.Types.ObjectId
}

const UserSensorSchema = new mongoose.Schema<UserSensor>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        sensor_id: {
            type: Number,
            required: true
        }
    }
);


export default mongoose.models.UserSensor || mongoose.model<UserSensor>("UserSensor", UserSensorSchema);