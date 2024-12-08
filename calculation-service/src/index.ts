// YOUR CODE HERE

require("dotenv").config();
import cors from "cors";
import express from "express";
import { connectMongo } from "./db";
import { startConsumer } from "./open-position";

export const app = express();

app.use(cors());

app.get("/health", (_req, res) => {
    res.json({ status: "OK" });
});

function toStreamMessage(data: any) {
    return `data: ${JSON.stringify(data)}\n\n`;
}

const connectDatabases = async () => {
    try {
        const mongoConnection = String(process.env.DATABASE_URL!);
        console.log("+++++++++++++++++++++++++++++", mongoConnection);
        await connectMongo(String(process.env.DATABASE_URL!));
        startConsumer();
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

connectDatabases();
