import { MarketMessage, TradeMessage, IPnL, IOpenPosition } from "./types";
import { getOpenPosition, savePnl, setOpenPosition } from "./db";

const trade = {
    buyVolume: 0,
    sellVolume: 0,
};

let currentMarketMessage: Partial<MarketMessage> = {};

function resetTradeVolume() {
    trade.buyVolume = 0;
    trade.sellVolume = 0;
}

function roundToTwo() {
    trade.buyVolume = Number(trade.buyVolume.toFixed(2));
    trade.sellVolume = Number(trade.sellVolume.toFixed(2));
}

export async function processMarketMessage(marketMessage: MarketMessage): Promise<void> {
    const pnl = Number((trade.sellVolume * marketMessage.sellPrice - trade.buyVolume * marketMessage.buyPrice).toFixed(2));

    // Save PnL data
    const savePnlData: IPnL = {
        startTime: marketMessage.startTime,
        endTime: marketMessage.endTime,
        pnl,
    };
    await savePnl(savePnlData);

    const lastOpenPosition: number = await getOpenPosition();
    const currentOpenPosition = lastOpenPosition + trade.buyVolume - trade.sellVolume;

    // Update new open position
    await setOpenPosition({ openPosition: currentOpenPosition } as IOpenPosition);

    resetTradeVolume();
    currentMarketMessage = { startTime: marketMessage.startTime };
}

export function processTradeMessage(tradeMessage: TradeMessage) {
    if (!currentMarketMessage.startTime) {
        console.warn("Discarding trade message");
        return;
    }

    if (tradeMessage.tradeType === "BUY") {
        trade.buyVolume += tradeMessage.volume;
    } else if (tradeMessage.tradeType === "SELL") {
        trade.sellVolume += tradeMessage.volume;
    } else {
        console.error("Invalid trade type:", tradeMessage.tradeType);
    }
    roundToTwo();
}
