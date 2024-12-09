import Kafka from "node-rdkafka";
import { processMarketMessage, processTradeMessage } from "./helpers";
import { toMarketMessage, toTradeMessage } from "./transformation";
import { topics } from "./constant";

const consumerConfig = {
    "group.id": "calculation-service",
    "metadata.broker.list": "kafka:9092",
};

const consumer = new Kafka.KafkaConsumer(consumerConfig, {});

export const startKafkaConsumer = () => {
    console.log("Connecting to Kafka...");
    consumer.connect({}, (err, metaData) => {
        if (err) {
            console.error("Error connecting to Kafka:", err);
            return;
        }
        console.log("Connected to Kafka:", metaData);
    });
};

consumer.on("ready", () => {
    consumer.subscribe(topics);
    consumer.consume();
});

consumer.on("data", async (data) => {
    if (!data.value) {
        throw new Error("Invalid message");
    }

    const message = JSON.parse(data.value.toString());
    console.log("Received message:", message);

    if (message.messageType === "market") {
        const marketMessage = toMarketMessage(message);
        await processMarketMessage(marketMessage);
    } else if (message.messageType === "trades") {
        const tradeMessage = toTradeMessage(message);
        processTradeMessage(tradeMessage);
    } else {
        console.warn("Unknown message type:", message.messageType);
    }
});

consumer.on("event.error", (err) => {
    console.error("Kafka consumer error:", err);
    console.log("Retrying connection...");
    setTimeout(() => consumer.connect(), 5000);
});

consumer.on("disconnected", (event) => {
    console.warn("Kafka consumer disconnected:", event);
});
