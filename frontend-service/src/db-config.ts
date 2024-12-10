import * as mongoose from "mongoose";
mongoose.set("strictQuery", true);

export const connectMongo = async (mongoUrl: string): Promise<void> => {
    try {
        await mongoose.connect(mongoUrl);
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.log("error ", error);
        process.exit(1);
    }
};
