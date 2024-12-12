import { Producer, ProducerGlobalConfig, AdminClient } from "node-rdkafka";
import { StreamProcessor } from "./StreamProcessor";
import { RawMarketMessage, RawTradeMessage, Topic } from "./types";
import { topics } from "./constant";

type RawMessage = RawMarketMessage | RawTradeMessage;

const producerConfig: ProducerGlobalConfig = { "metadata.broker.list": "kafka:9092", dr_cb: true };

const adminConfig = { "metadata.broker.list": "kafka:9092", "client.id": "admin" };

const producer = new Producer(producerConfig);

producer.on("event.error", (err) => {
    console.error("Error from producer:", err);
});

producer.on("ready", async () => {
    console.log("Kafka Producer is ready");
    await createKafkaTopics(topics);
    fetchStreamAndProduce()
        .then(() => {
            console.log("Stream processing completed");
        })
        .catch((error) => {
            console.error("Stream processing failed:", error);
        });
});

function onMessage(message: RawMessage) {
    producer.produce(message.messageType, null, Buffer.from(JSON.stringify(message)), null, Date.now());
}

async function fetchStreamAndProduce() {
    const response = await fetch("https://t1-coding-challenge-9snjm.ondigitalocean.app/stream");

    if (!response.ok) {
        console.error("Failed to fetch stream:", response.statusText);
        return;
    }

    if (!response.body) {
        console.error("Response body is null");
        return;
    }

    const streamProcessor = new StreamProcessor(onMessage);

    await streamProcessor.processStream(response.body);

    console.log("Streaming ended");
    producer.disconnect();
}

async function createKafkaTopics(topics: Topic[]) {
    const adminClient = AdminClient.create(adminConfig);

    const createTopic = (topicName: string, partitions: number, replicationFactor: number) => {
        return new Promise<void>((resolve, reject) => {
            adminClient.createTopic({ topic: topicName, num_partitions: partitions, replication_factor: replicationFactor }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("Topic created:", topicName);
                    resolve();
                }
            });
        });
    };

    try {
        await Promise.allSettled(topics.map(({ topic, partitions, replicationFactor }) => createTopic(topic, partitions, replicationFactor)));
        console.log("Topics created successfully.");
    } catch (error) {
        console.error("Error creating topics:", error);
    }
}

producer.connect({}, (err, metaData) => {
    if (err) {
        console.error("Error connecting to Kafka:", err);
        return;
    }

    console.log("Connected to Kafka:", metaData);
});
