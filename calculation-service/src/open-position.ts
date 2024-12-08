import Kafka from "node-rdkafka";
import { toMarketMessage, toTradeMessage } from "./transformation";

let buyVolume = 0;
let sellVolume = 0;
export function getOpenPosition() {
    return buyVolume - sellVolume;
}

const topics = ["market", "trades"]; // Topics to subscribe

const consumerConfig = {
    "group.id": "calculation-service",
    "metadata.broker.list": "kafka:9092",
};

const consumer = new Kafka.KafkaConsumer(consumerConfig, {});

export const startConsumer = () => {
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
    console.log("++++++++++++++++++++++++++++++here");
    consumer.subscribe(topics);
    consumer.consume();
});

consumer.on("data", (data) => {
    if (!data.value) {
        throw new Error("Invalid message");
    }

    const message = JSON.parse(data.value.toString());
    console.log("Received message:", message);

    if (message.messageType === "market") {
        const marketMessage = toMarketMessage(message);
        console.log("Processed Market Message:", marketMessage);
    } else if (message.messageType === "trades") {
        const tradeMessage = toTradeMessage(message);

        if (tradeMessage.tradeType === "BUY") {
            buyVolume += tradeMessage.volume;
        } else if (tradeMessage.tradeType === "SELL") {
            sellVolume += tradeMessage.volume;
        } else {
            console.error("Invalid trade type:", tradeMessage.tradeType);
        }

        console.log("Trade Processed. Buy Volume:", buyVolume, "Sell Volume:", sellVolume);
    } else {
        console.warn("Unknown message type:", message.messageType);
    }
});

consumer.on("event.error", (err) => {
    console.error("Kafka consumer error:", err);
});

consumer.on("disconnected", (event) => {
    console.warn("Kafka consumer disconnected:", event);
});

