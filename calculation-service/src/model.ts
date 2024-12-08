import * as mongoose from "mongoose";

const TradeData = new mongoose.Schema(
    {
        buyPrice: { type: Number, required: true },
        sellPrice: { type: Number, required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        totalBuyVolume: { type: Number, required: true },
        totalSellVolume: { type: Number, required: true },
        profitOrLoss: { type: Number, required: true },
    },
    { timestamps: true }
);

export default mongoose.model("trade", TradeData);
