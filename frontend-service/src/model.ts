import * as mongoose from "mongoose";

const pnlSchema = new mongoose.Schema(
    {
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        pnl: { type: Number, required: true },
    },
    { timestamps: true }
);

export const PnL = mongoose.model("PnLTransaction", pnlSchema);

const openPositionSchema = new mongoose.Schema(
    {
        field: { type: String, required: true },
        value: { type: Number, required: true },
    },
    { timestamps: true, versionKey: false }
);

export const OpenPosition = mongoose.model("OpenPosition", openPositionSchema);
