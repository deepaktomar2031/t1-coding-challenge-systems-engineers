import { Trade, PnL, OpenPosition } from "./model";
import { TradeMessage, IPnL } from "./types";

export async function saveTradeMessage(tradeMessage: TradeMessage): Promise<void> {
    try {
        const transaction = new Trade(tradeMessage);
        await transaction.save();
    } catch (error) {
        console.error("Error saving trade message:", error);
    }
}

export async function fetchTradeMessage(startTime: Date, endTime: Date): Promise<TradeMessage[]> {
    try {
        // startTime and endTime are not required as we're flushing the collection after each market message & pnl calculation
        // but just in case if we want to keep the data for some time then startTime and endTime will be useful
        const tradeMessages = await Trade.find({ time: { $gte: startTime, $lte: endTime } });
        return tradeMessages.map((element) => element.toObject() as TradeMessage);
    } catch (error) {
        console.error("Error fetching trades:", error);
        return [];
    }
}

export async function flushTradeMessage(): Promise<void> {
    try {
        await Trade.deleteMany({});
    } catch (error) {
        console.error("Error flushing trade messages:", error);
    }
}

export async function savePnl(pnlData: IPnL): Promise<void> {
    try {
        const transaction = new PnL(pnlData);
        await transaction.save();
    } catch (error) {
        console.error("Error saving transaction:", error);
    }
}

export async function setOpenPosition(value: number): Promise<void> {
    try {
        await OpenPosition.updateOne({ field: "openPosition" }, { $set: { value: value } }, { upsert: true });
    } catch (error) {
        console.error("Error saving open positions:", error);
    }
}

export async function getOpenPosition(): Promise<number> {
    try {
        const openPosition = await OpenPosition.find({ field: "openPosition" });
        return openPosition[0] ? openPosition[0].value : 0;
    } catch (error) {
        console.error("Error fetching open positions:", error);
        return 0;
    }
}

export async function resetDatabase(): Promise<void> {
    try {
        await Trade.deleteMany({});
        await PnL.deleteMany({});
        await OpenPosition.deleteMany({});
        console.log("Database reset successfully!");
    } catch (error) {
        console.error("Error resetting database:", error);
    }
}
