export interface IPnL {
    startTime: Date;
    endTime: Date;
    pnl: number;
}

export interface IRawPnL {
    startTime: string;
    endTime: string;
    pnl: number;
}

export interface IOpenPosition {
    openPosition: number;
}
