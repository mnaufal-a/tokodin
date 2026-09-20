import { IS_DEMO_BUILD } from "../config";
import { getOrders as getOrdersFromStorage, saveOrders } from "../data/demoOrdersStorage";
import { API_BASE_URL, API_KEY } from "../config/secret";

export type OrderStatus = 'Baru' | 'Selesai';

export interface Order {
    id: string;
    createdAt: string;
    customerName: string;
    phoneNumber: string;
    orderText: string;
    itemCount: number;
    totalPrice: number;
    status: OrderStatus;
}


export async function getOrders(): Promise<Order[]> {

    if (IS_DEMO_BUILD) {
        return await getOrdersFromStorage();
    }

    const response = await fetch(`${API_BASE_URL}/webhook/get-orders`, {
        method: 'GET',
        headers: {
            'x-api-key': API_KEY,
        },
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil data pesanan');
    }

    const data = await response.json();
    return data.orders;
}

export async function updateOrderStatus(orderId: string, newStatus: string) {

    if (IS_DEMO_BUILD) {
        const list = await getOrdersFromStorage();

        const newOrder = list.find(order => order.id === orderId)

        if (newOrder) {
            newOrder.status = newStatus as OrderStatus
        }

        await saveOrders(list);

        return {success: true}
    }

    const response = await fetch(`${API_BASE_URL}/webhook/update-order-status`, {
        method : 'POST',
        headers: {
            'x-api-key': API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            orderId: orderId,
            newStatus: newStatus,
        }),
    });

    if (!response.ok) {
        throw new Error('Gagal mengupdate status!')
    }

    return await response.json()
}