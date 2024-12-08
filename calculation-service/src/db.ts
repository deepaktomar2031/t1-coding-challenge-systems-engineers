// YOUR CODE HERE

import TradeData from "./model";
import { ITrade } from "./types";

export const saveTradeData = async (data: ITrade) => {
    try {
        await TradeData.create(data);
    } catch (error) {
        console.error("Error saving trade data:", error);
    }
};
