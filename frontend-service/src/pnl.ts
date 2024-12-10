import { IRawPnL } from "./types";
import { fetchPnL } from "./db";
import { toRawPnLMessage } from "./transformation";

export async function getPnls(): Promise<IRawPnL[]> {
    const result = await fetchPnL();
    return result.map(toRawPnLMessage);
}
