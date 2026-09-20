
import { IS_DEMO_BUILD } from "../config";
import { getKasTransaksi, saveKasTransaksi } from "../data/demoKasStorage";
import { API_BASE_URL, API_KEY } from "../config/secret";

export type KasEntryInput = {
    tipe: 'Masuk' | 'Keluar';
    kategori: string;
    jumlah: number;
    keterangan: string;
}

export type KasEntryResponse = {
    success: boolean;
    errors?: string[];
}

export async function addKasEntry(entry: KasEntryInput): Promise<KasEntryResponse> {

    if (IS_DEMO_BUILD) {
        const error : string [] = [];
        const tipdeValid = [ 'Masuk', 'Keluar'];
        const kategoriValid = ['Modal', 'Belanja Bahan Baku', 'Operasional', 'Lain-lain'];

        if (!tipdeValid.includes(entry.tipe)){
            error.push('Tipe Harus "Masuk" atau "Keluar"!')
        }
        
        if (!kategoriValid.includes(entry.kategori)) {
            error.push('Kategori Tidak Valid!');
        }

        if (typeof entry.jumlah !== 'number' || entry.jumlah <= 0) {
            error.push('Jumlah harus berupa angka dan Harus lebih dari 0 !');
        }

        if (error.length > 0){
            return {success : false, errors: error };
        }
        
        const list = await getKasTransaksi();

        list.push({
            timestamp: new Date().toISOString(),
            tipe: entry.tipe,
            kategori: entry.kategori,
            jumlah: entry.jumlah,
            keterangan: entry.keterangan,
        })

        await saveKasTransaksi(list)

        return { success: true }

    }


    const response = await fetch(`${API_BASE_URL}/webhook/add-kas-entry`, {
        method: 'POST',
        headers: {
            'x-api-key': API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
    });
    
    return await response.json();
}