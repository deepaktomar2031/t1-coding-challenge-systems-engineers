import Kafka from "node-rdkafka";
import { toMarketMessage, toTradeMessage } from "./transformation";
import { topics } from "./constant";
import { messageProcessor } from "./MessageProcessor";

export async function connectKafka() {
    const kafkaConfig = { "group.id": "calculation-service", "metadata.broker.list": "kafka:9092" };
    const consumer = new Kafka.KafkaConsumer(kafkaConfig, {});

    consumer.on("event.error", (err) => {
        console.error("Kafka consumer error:", err);
    });

    consumer
        .on("ready", () => {
            consumer.subscribe(topics);
            consumer.consume();
        })
        .on("data", async (data) => {
            if (!data.value) {
                throw new Error("Invalid message");
            }

            const message = JSON.parse(data.value.toString());

            if (message.messageType === "trades") {
                const tradeMessage = toTradeMessage(message);
                messageProcessor.processTradeMessage(tradeMessage);
            } else if (message.messageType === "market") {
                const marketMessage = toMarketMessage(message);
                await messageProcessor.processMarketMessage(marketMessage);
            } else {
                console.warn("Unknown message type:", message.messageType);
                throw new Error("Invalid trade type");
            }
        });

    consumer.connect({}, (err, metaData) => {
        if (err) {
            console.error("Error connecting to Kafka:", err);
            return;
        }

        console.log("Connected to Kafka:", metaData);
    });
}
