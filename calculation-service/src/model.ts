import * as mongoose from "mongoose";

const pnlSchema = new mongoose.Schema(
    {
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        buyVolume: { type: Number, required: true },
        sellVolume: { type: Number, required: true },
        pnl: { type: Number, required: true },
    },
    { timestamps: true }
);

export const PnL = mongoose.model("PnLTransaction", pnlSchema);

const openPositionSchema = new mongoose.Schema({ openPosition: { type: Number, required: true } }, { timestamps: true });

export const OpenPosition = mongoose.model("OpenPosition", openPositionSchema);
