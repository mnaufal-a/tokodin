import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RiwayatItem } from "../api/kasHistoryApi";
import { seedKasTransaksi } from "./seedData";

const KAS_KEY = 'demo_kas_transaksi';

export async function saveKasTransaksi(list: RiwayatItem[]): Promise<void> {
    try {
        const teks = JSON.stringify(list)
        await AsyncStorage.setItem(KAS_KEY, teks)
    } catch(error) {
        console.error('Gagal menyimpan kas ke storage!', error)
    }
}

export async function getKasTransaksi(): Promise<RiwayatItem[]> {
    try {
        const teks = await AsyncStorage.getItem(KAS_KEY)

        if (teks === null) {
            return seedKasTransaksi;
        }

        return JSON.parse(teks);
    } catch(error) {
        console.error('Gagal baca kas dari storage!', error)
        return []
    }
}