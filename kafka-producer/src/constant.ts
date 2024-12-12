import { Topic } from "./types";

export const topics: Topic[] = [
    { topic: "market", replicationFactor: 1, partitions: 3 },
    { topic: "trades", replicationFactor: 1, partitions: 3 },
];
