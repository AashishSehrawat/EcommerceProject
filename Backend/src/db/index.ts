import mongoose from "mongoose"

const DBName = "Ecommerce-yt";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DBName}`);
        console.log("Mongodb Connected: ", connectionInstance.connection.host);
    } catch (error) {
        console.log("Mongodb connection failed: ", error);
        process.exit(1);
    }
}

export default connectDB;
