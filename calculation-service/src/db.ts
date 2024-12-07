// YOUR CODE HERE
import * as mongoose from "mongoose";

export const connectMongo = async (mongoUrl: string) => {
    try {
        await mongoose.connect(mongoUrl);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("error ", error);
        process.exit(1);
    }
};
