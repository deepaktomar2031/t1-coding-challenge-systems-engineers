import { IPnL, IRawPnL } from "./types";

export function toRawPnLMessage(raw: IPnL): IRawPnL {
    return {
        startTime: dateToIsoString(raw.startTime),
        endTime: dateToIsoString(raw.endTime),
        pnl: raw.pnl,
    };
}

function dateToIsoString(date: Date): string {
    return date.toISOString().split(".")[0] + "Z";
}
