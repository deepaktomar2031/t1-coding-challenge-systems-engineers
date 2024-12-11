require("dotenv").config();
import { connectMongo } from "./db-config";
import { connectKafka } from "./kafka";
import { resetDatabase } from "./db";

const start = async () => {
    try {
        await connectMongo(String(process.env.DATABASE_URL!));
        await resetDatabase();
        await connectKafka();
    } catch (error) {
        console.error("Error in starting service", error);
    }
};

start();
