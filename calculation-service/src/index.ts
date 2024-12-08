// YOUR CODE HERE

require("dotenv").config();
import cors from "cors";
import express from "express";
import { connectMongo } from "./db-config";
import { startKafkaConsumer } from "./kafka-consumer";

export const app = express();

app.use(cors());

function toStreamMessage(data: any) {
    return `data: ${JSON.stringify(data)}\n\n`;
}

const start = async () => {
    try {
        await connectMongo(String(process.env.DATABASE_URL!));
        startKafkaConsumer();
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

start();
