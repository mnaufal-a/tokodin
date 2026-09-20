import { toJakartaDateKey } from "../utils/jakartaDate";
import { IS_DEMO_BUILD } from "../config";
import { getOrders as getOrdersFromStorage } from "../data/demoOrdersStorage";
import { API_BASE_URL, API_KEY } from "../config/secret";


export async function getDailyStats() {

    if (IS_DEMO_BUILD) {
        const list = await getOrdersFromStorage()
        const today = toJakartaDateKey(new Date().toISOString())

        let totalItems = 0;
        let totalRevenue = 0;
        let totalOrders = 0;

        for (const order of list) {
            const tanggalOrder = toJakartaDateKey(order.createdAt);

            if (tanggalOrder === today) {
                totalItems += order.itemCount;
                totalRevenue += order.totalPrice;
                totalOrders += 1;
            }

        }

        return {date: today, totalItems, totalRevenue, totalOrders}

    }


    const response = await fetch(`${API_BASE_URL}/webhook/get-daily-stats`, {
        method: 'GET',
        headers: {
            'x-api-key': API_KEY,
        },
    })

    if (!response.ok) {
        throw new Error('Gagal mengambil data statistik');
    }

    return await response.json()
};