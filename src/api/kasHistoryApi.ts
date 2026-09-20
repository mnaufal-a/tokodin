import { IS_DEMO_BUILD } from "../config";
import { getKasTransaksi } from "../data/demoKasStorage";
import { toJakartaDateKey, toJakartaMonthKey } from "../utils/jakartaDate";
import { API_BASE_URL, API_KEY } from "../config/secret";

export type KasHistoryResponse = {
    saldo: number;
    uangMasuk: number;
    uangKeluar: number;
    riwayat: RiwayatItem[];
}

export type RiwayatItem = {
    timestamp: string;
    tipe: 'Masuk' | 'Keluar';
    kategori: string;
    jumlah: number;
    keterangan: string;
}

type GetKasHistoryParams = 
    | {mode: 'harian'; tanggal: string}
    | {mode: 'bulanan'; bulan: string};

export async function getKasHistory(params: GetKasHistoryParams): Promise<KasHistoryResponse> {
    if (IS_DEMO_BUILD) {
        
        const list = await getKasTransaksi();

        let uangMasuk = 0;
        let uangKeluar = 0;
        const riwayat : RiwayatItem [] = []; 

        for (const item of list) {
            let cocok = false;

            if (params.mode === 'harian'){
                cocok = toJakartaDateKey(item.timestamp) === params.tanggal
            } else if (params.mode === 'bulanan') {
                cocok = toJakartaMonthKey(item.timestamp) === params.bulan
            }

            if (!cocok) continue;


            if(item.tipe === 'Masuk'){
                uangMasuk += item.jumlah;
            } else if (item.tipe === 'Keluar') {
                uangKeluar += item.jumlah;
            }

            riwayat.push({
                timestamp : item.timestamp,
                tipe: item.tipe,
                kategori: item.kategori,
                jumlah: item.jumlah,
                keterangan: item.keterangan,
            })
        }

        riwayat.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
        
        const saldo = uangMasuk - uangKeluar;

        return {saldo, uangMasuk, uangKeluar, riwayat};
    }

    let queryString = '';

    if (params.mode === 'harian') {
        queryString = `mode=harian&tanggal=${params.tanggal}`;
    } else if (params.mode === 'bulanan') {
        queryString = `mode=bulanan&bulan=${params.bulan}`;
    }

    const response = await fetch(`${API_BASE_URL}/webhook/get-kas-history?${queryString}`, {
        method: 'GET',
        headers: {
            'x-api-key': API_KEY,
        },
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil riwayat kas');
    } 

    return await response.json();
}