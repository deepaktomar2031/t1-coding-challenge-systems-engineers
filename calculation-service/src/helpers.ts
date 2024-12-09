import { MarketMessage, TradeMessage, IPnL, IOpenPosition } from "./types";
import { getOpenPosition, savePnl, setOpenPosition } from "./db";

const trade = {
    buyVolume: 0,
    sellVolume: 0,
};

let previousMarketMessage: Partial<MarketMessage> = {};
let currentMarketMessage: Partial<MarketMessage> = {};

function resetTradeVolume() {
    trade.buyVolume = 0;
    trade.sellVolume = 0;
}

export async function processMarketMessage(marketMessage: MarketMessage): Promise<void> {
    previousMarketMessage = currentMarketMessage as MarketMessage;
    if (previousMarketMessage.startTime) {
        const pnl = trade.sellVolume * previousMarketMessage.sellPrice! - trade.buyVolume * previousMarketMessage.buyPrice!;

        // Save previous transaction
        await savePnl({
            startTime: previousMarketMessage.startTime,
            endTime: previousMarketMessage.endTime,
            buyVolume: trade.buyVolume,
            sellVolume: trade.sellVolume,
            pnl,
        } as IPnL);

        const lastOpenPosition: number = await getOpenPosition();
        const currentOpenPosition = trade.buyVolume - trade.sellVolume;

        // Save open position
        await setOpenPosition({ openPosition: currentOpenPosition } as IOpenPosition);

        resetTradeVolume();
    }
    currentMarketMessage = marketMessage;
}

export function processTradeMessage(tradeMessage: TradeMessage) {
    if (!currentMarketMessage.startTime) {
        console.warn("Discarding trade message - no active market context");
        return;
    }

    const tradeTime = tradeMessage.time;
    const startTime = currentMarketMessage.startTime;
    const endTime = currentMarketMessage.endTime;

    if (startTime && endTime && tradeTime >= startTime && tradeTime <= endTime) {
        if (tradeMessage.tradeType === "BUY") {
            trade.buyVolume += tradeMessage.volume;
        } else if (tradeMessage.tradeType === "SELL") {
            trade.sellVolume += tradeMessage.volume;
        } else {
            console.error("Invalid trade type:", tradeMessage.tradeType);
        }
    }
}
