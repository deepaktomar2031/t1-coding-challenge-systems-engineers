import { PnL, OpenPosition } from "./model";
import { IPnL, IOpenPosition } from "./types";

export async function fetchPnL(): Promise<IPnL[]> {
    try {
        const pnl = await PnL.find({});
        return pnl;
    } catch (error) {
        console.error("Error fetching pnl:", error);
        return [];
    }
}

export async function fetchOpenPosition(): Promise<number> {
    try {
        const openPosition: IOpenPosition[] = await OpenPosition.find({ type: "openPosition" });
        return openPosition[0] ? openPosition[0].value : 0;
    } catch (error) {
        console.error("Error fetching open positions:", error);
        return 0;
    }
}
