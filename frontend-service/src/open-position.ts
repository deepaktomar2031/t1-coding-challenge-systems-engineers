import { fetchOpenPosition } from "./db";

export async function getOpenPosition(): Promise<number> {
    return await fetchOpenPosition();
}
