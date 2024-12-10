require("dotenv").config();
import cors from "cors";
import express from "express";
import { connectMongo } from "./db-config";
import { resetDatabase } from "./db";
import { startKafkaConsumer } from "./kafka-consumer";

export const app = express();
app.use(cors());

const start = async () => {
    try {
        await connectMongo(String(process.env.DATABASE_URL!));
        await resetDatabase();
        startKafkaConsumer();
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

start();
