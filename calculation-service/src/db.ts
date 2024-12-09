import { PnL, OpenPosition } from "./model";
import { IPnL, IOpenPosition } from "./types";

export async function savePnl(pnlData: IPnL): Promise<void> {
    try {
        const transaction = new PnL(pnlData);
        await transaction.save();
        console.log("Transaction saved successfully!");
    } catch (error) {
        console.error("Error saving transaction:", error);
    }
}

export async function setOpenPosition(openPosition: IOpenPosition): Promise<void> {
    try {
        await OpenPosition.updateOne({}, openPosition, { upsert: true });
        console.log("Open position saved successfully!");
    } catch (error) {
        console.error("Error saving open positions:", error);
    }
}

export async function getOpenPosition(): Promise<number> {
    try {
        const openPosition = await OpenPosition.find({});
        console.log("++++++++++++++++++++++++++openPosition", openPosition);

        return openPosition[0] ? openPosition[0].openPosition : 0;
    } catch (error) {
        console.error("Error fetching open positions:", error);
        return 0;
    }
}

export async function resetDatabase(): Promise<void> {
    try {
        await PnL.deleteMany({});
        await OpenPosition.deleteMany({});
        console.log("Database reset successfully!");
    } catch (error) {
        console.error("Error resetting database:", error);
    }
}
