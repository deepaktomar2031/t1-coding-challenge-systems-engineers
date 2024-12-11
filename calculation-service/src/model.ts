import * as mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
    {
        messageType: { type: String, required: true },
        tradeType: { type: String, required: true },
        volume: { type: Number, required: true },
        time: { type: Date, required: true },
    },
    { timestamps: false, versionKey: false }
);

export const Trade = mongoose.model("Trade", tradeSchema);

const pnlSchema = new mongoose.Schema(
    {
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        pnl: { type: Number, required: true },
    },
    { timestamps: false, versionKey: false }
);

export const PnL = mongoose.model("PnLTransaction", pnlSchema);

const openPositionSchema = new mongoose.Schema(
    {
        field: { type: String, required: true },
        value: { type: Number, required: true },
    },
    { timestamps: false, versionKey: false }
);

export const OpenPosition = mongoose.model("OpenPosition", openPositionSchema);
