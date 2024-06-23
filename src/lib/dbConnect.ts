import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

export const connectToDb = async (): Promise<void> => {
    if (connection.isConnected) {
        console.log("Already, connected")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URL!)

        connection.isConnected = db.connections[0].readyState;

        console.log("Database connected successfully")

    } catch (error) {
        console.log(error, "error in connect database")

        process.exit(1)
    }
}