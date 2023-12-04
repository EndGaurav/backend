import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
    try {
        const connectedDbInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log("MongoDB Connected !! DB HOST: ",connectedDbInstance.connection.host)
    } catch (error) {
        console.log("MongoDB connection error: ", error);
        process.exit(1);
    }
   
}

export default connectDB;