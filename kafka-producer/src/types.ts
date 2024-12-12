export interface RawMarketMessage {
    messageType: "market";
    buyPrice: string;
    sellPrice: string;
    startTime: string;
    endTime: string;
}

export interface RawTradeMessage {
    messageType: "trades";
    tradeType: "BUY" | "SELL";
    volume: string;
    time: string; // ISO 8601 format: "2024-01-01T19:00:00.000+00:00"
}

export interface Topic {
    topic: "market" | "trades";
    partitions: number;
    replicationFactor: number;
}
