import mongoose from "mongoose";

const databaseUri = process.env.NEXT_PUBLIC_DATABASE_CONNECTION || "";

export async function connectToDatabase() {
    try {
        if (!databaseUri) {
            throw new Error("[err]: Please add mongodb connection string inside your local environtmnet");
        }        
        await mongoose.connect(databaseUri);

        console.log("[message]: Connected to database");
    } catch (error) {
        console.log(`[err]: Error connecting to database - ${error}`);
    }

}