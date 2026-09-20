import { IS_DEMO_BUILD } from "../config";
import { getKasTransaksi } from "../data/demoKasStorage";
import { API_BASE_URL, API_KEY } from "../config/secret";

export type KasSummary = {
  saldo: number;
  uangMasuk: number;
  uangKeluar: number;
};

export async function getKasSummary(): Promise<KasSummary> {

  if (IS_DEMO_BUILD) {
    const list = await getKasTransaksi();
    
    let uangMasuk = 0;
    let uangKeluar = 0;

    for (const item of list) {
      if (item.tipe === 'Masuk') {
        uangMasuk += item.jumlah;
      } else if (item.tipe === 'Keluar') {
        uangKeluar += item.jumlah;
      }

    }
    
    const saldo = uangMasuk - uangKeluar;
    
    return {saldo, uangMasuk,uangKeluar}
  }


  const response = await fetch(`${API_BASE_URL}/webhook/get-kas-summary`, {
    method: 'GET',
    headers: {
      'x-api-key': API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error('Gagal mengambil ringkasan kas');
  }

  return await response.json();
}