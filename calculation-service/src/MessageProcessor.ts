import { MarketMessage, TradeMessage, IPnL } from "./types";
import { saveTradeMessage, fetchTradeMessage, flushTradeMessage, savePnl, getOpenPosition, setOpenPosition } from "./db";

class MessageProcessor {
    constructor() {}

    async processTradeMessage(tradeMessage: TradeMessage): Promise<void> {
        try {
            await saveTradeMessage(tradeMessage);
        } catch (error) {
            console.error("Error saving trade message:", error);
        }
    }

    async processMarketMessage(marketMessage: MarketMessage): Promise<void> {
        const startTime = new Date(marketMessage.startTime);
        const endTime = new Date(marketMessage.endTime);

        const tradeMessages = await fetchTradeMessage(startTime, endTime);

        const pnl = this.calculatePnl(marketMessage, tradeMessages);

        const savePnlData: IPnL = { startTime: marketMessage.startTime, endTime: marketMessage.endTime, pnl };

        // Save PNL
        await savePnl(savePnlData);

        const buyVolume = this.calculateBuyVolume(tradeMessages);
        const sellVolume = this.calculateSellVolume(tradeMessages);
        const lastOpenPosition = await getOpenPosition();
        const currentOpenPosition = this.roundToTwo(lastOpenPosition + buyVolume - sellVolume);

        // Save open posistion
        await setOpenPosition(currentOpenPosition);

        // Flush trade messages
        await flushTradeMessage();

        console.log("Market message processed!");
    }

    calculateBuyVolume(tradeMessage: TradeMessage[]): number {
        return tradeMessage.filter((trade) => trade.tradeType === "BUY").reduce((acc, trade) => acc + trade.volume, 0);
    }

    calculateSellVolume(tradeMessage: TradeMessage[]): number {
        return tradeMessage.filter((trade) => trade.tradeType === "SELL").reduce((acc, trade) => acc + trade.volume, 0);
    }

    calculatePnl(marketMessage: MarketMessage, tradeMessage: TradeMessage[]): number {
        const buyVolume = this.calculateBuyVolume(tradeMessage);
        const sellVolume = this.calculateSellVolume(tradeMessage);

        return this.roundToTwo(sellVolume * marketMessage.sellPrice - buyVolume * marketMessage.buyPrice);
    }

    roundToTwo(value: number): number {
        return Math.round(value * 100) / 100;
    }
}

export const messageProcessor = new MessageProcessor();
