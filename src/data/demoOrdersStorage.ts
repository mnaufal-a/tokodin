import type { Order } from "../api/ordersApi";
import  AsyncStorage  from "@react-native-async-storage/async-storage";
import { seedOrders } from "./seedData";

const ORDERS_KEY = 'demo_orders';

export async function saveOrders(list: Order[]): Promise<void> {
    try {
        const teks = JSON.stringify(list)
        await AsyncStorage.setItem(ORDERS_KEY, teks);
    } catch (error) {
        console.error('Gagal Menyimpan Ke Storage!', error )
    }
}

export async function getOrders(): Promise<Order[]> {
    try {
        const teks = await AsyncStorage.getItem(ORDERS_KEY)

        if (teks === null) {
            return seedOrders
        }

        return JSON.parse(teks)
    } catch (error) {
        console.error('Gagal baca orders dari storage!', error)
        return []
    }
}