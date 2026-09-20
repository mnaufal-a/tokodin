import { IS_DEMO_BUILD } from "../config";
import { getOrders as getOrdersFromStorage } from "../data/demoOrdersStorage";
import { toJakartaDateKey } from "../utils/jakartaDate";
import { API_BASE_URL, API_KEY } from "../config/secret";

const namaHari = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function getJakartaDayLabel(isoTimestamp: string): string {
    const date = new Date(isoTimestamp)
    const jakartaDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    return namaHari[jakartaDate.getUTCDay()]
}


export type WeeklyStatItem = {
    value: number;
    label: string;
};

export async function getWeeklyStats(): Promise<WeeklyStatItem[]> {

    if (IS_DEMO_BUILD) {
        const list = await getOrdersFromStorage();

        const kerangka : { dateKey: string; label: string; value: number; }[] = [];

        for (let i = 6; i >= 0; i--) {

            const targetIso = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString();
            kerangka.push({
                dateKey: toJakartaDateKey(targetIso),
                label: getJakartaDayLabel(targetIso),
                value: 0,
            })
        }

        for (const order of list) {

            if (order.status !== 'Selesai') continue;

            const hariCocok = kerangka.find(hari => hari.dateKey === toJakartaDateKey(order.createdAt));

            if (hariCocok) {
                hariCocok.value += order.totalPrice
            }
        }

        return kerangka.map(hari => ({ value: hari.value, label: hari.label}))
    }

    const response = await fetch(`${API_BASE_URL}/webhook/get-weekly-stats`, {
        method: 'GET',
        headers: {
            'x-api-key': API_KEY,
        },
    })

    if (!response.ok) {
        throw new Error('Gagal mengambil data statistik mingguan!');
    }

    return await response.json()
}