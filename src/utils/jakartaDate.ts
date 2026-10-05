export function relativeJakartaTimestamp(
    daysAgo: number,
    jamWIB: number,
    menitWIB: number = 0,
): string {
    // 1. Ambil waktu sekarang, geser ke WIB, ambil tanggalnya doang (buang jam)
    const nowWIB = new Date(Date.now() + 7 * 60 * 60 * 1000);
    const tahun = nowWIB.getUTCFullYear();
    const bulan = nowWIB.getUTCMonth();
    const tanggal = nowWIB.getUTCDate();

    // 2. Bikin tanggal target: (hari ini - daysAgo), jam:menit yang diminta, MASIH dianggap WIB
    const targetWIB = new Date(Date.UTC(tahun, bulan, tanggal - daysAgo, jamWIB, menitWIB, 0));

    // 3. Geser balik -7 jam buat dapetin timestamp UTC yang sebenarnya
    const targetUTC = new Date(targetWIB.getTime() - 7 * 60 * 60 * 1000);

    return targetUTC.toISOString();
}

export function toJakartaDateKey(isoTimestamp: string): string {
    const date = new Date(isoTimestamp);
    const jakartaMs = date.getTime() + 7 * 60 * 60 * 1000;
    const jakartaDate = new Date(jakartaMs);
    return jakartaDate.toISOString().slice(0, 10);
}

export function toJakartaMonthKey(isoTimestamp: string): string {
    return toJakartaDateKey(isoTimestamp).slice(0, 7)
}