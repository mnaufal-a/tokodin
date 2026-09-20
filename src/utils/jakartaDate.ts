export function toJakartaDateKey(isoTimestamp: string): string {
    const date = new Date(isoTimestamp);
    const jakartaMs = date.getTime() + 7 * 60 * 60 * 1000;
    const jakartaDate = new Date(jakartaMs);
    return jakartaDate.toISOString().slice(0, 10);
}

export function toJakartaMonthKey(isoTimestamp: string): string {
    return toJakartaDateKey(isoTimestamp).slice(0, 7)
}