import type { RiwayatItem } from "../api/kasHistoryApi";
import type { Order } from "../api/ordersApi";
import type { ChatLog } from "../api/chatHistoryApi";
import { relativeJakartaTimestamp } from "../utils/jakartaDate";

export const seedKasTransaksi: RiwayatItem[] = [
    {
        timestamp: '2026-09-10T07:30:00.000Z',
        tipe: 'Masuk',
        kategori: 'Modal',
        jumlah: 350000,
        keterangan: 'Pemasukan hari ini',
    },
    {
        timestamp: '2026-09-10T08:30:00.000Z',
        tipe: 'Keluar',
        kategori: 'Belanja Bahan Baku',
        jumlah: 250000,
        keterangan: 'Belanja Bahan Hari ini',
    },
    {
        timestamp: '2026-09-11T08:45:00.000Z',
        tipe: 'Masuk',
        kategori: 'Modal',
        jumlah: 350000,
        keterangan: 'Pemasukan hari ini',
    },
    {
        timestamp: '2026-09-11T09:00:00.000Z',
        tipe: 'Keluar',
        kategori: 'Belanja Bahan Baku',
        jumlah: 250000,
        keterangan: 'Belanja Bahan',
    },
    {
        timestamp: '2026-09-11T09:45:00.000Z',
        tipe: 'Keluar',
        kategori: 'Lain-lain',
        jumlah: 25000,
        keterangan: 'Gaji Karyawan',
    },
]

export const seedOrders: Order[] = [
    {
        id: 'demo-order-1',
        createdAt: relativeJakartaTimestamp(3, 7, 0),
        customerName: 'budi',
        phoneNumber: '6281234500007',
        orderText: 'Nasi Uduk x 10, Gorengan Tempe x 5, Gorengan Tahu x 5',
        itemCount: 20,
        totalPrice: 100000,
        status: "Selesai",
    },
    {
        id: 'demo-order-2',
        createdAt: relativeJakartaTimestamp(3, 7, 0),
        customerName: 'bu Ret',
        phoneNumber: '6281234500009',
        orderText: 'Nasi Uduk x 20, Lontong Sayur x 20, Gorengan Tahu x 10, Gorengan Tempe x 10',
        itemCount: 60,
        totalPrice: 400000,
        status: "Selesai",
    },
    {
        id: 'demo-order-3',
        createdAt: relativeJakartaTimestamp(2, 7, 0),
        customerName: 'owo',
        phoneNumber: '6281234500002',
        orderText: 'Nasi Uduk x 5',
        itemCount: 5,
        totalPrice: 40000,
        status: "Baru",
    },
    {
        id: 'demo-order-4',
        createdAt: relativeJakartaTimestamp(0, 7, 0),
        customerName: 'bu nis',
        phoneNumber: '6281234500001',
        orderText: 'Nasi Uduk x 10, Gorengan Pisang x 5, Gorengan Tahu x 5',
        itemCount: 20,
        totalPrice: 100000,
        status: "Baru",
    },
    {
        id: 'demo-order-5',
        createdAt: relativeJakartaTimestamp(0, 7, 0),
        customerName: 'ilham',
        phoneNumber: '6281234500010',
        orderText: 'Nasi Uduk x 2',
        itemCount: 2,
        totalPrice: 16000,
        status: "Baru",
    },
]

export const seedChatHistory: ChatLog[] = [
    {
        Timestamp: '2026-09-10T10:00:00.000Z',
        phoneNumber: '6281234500007',
        customerName: 'Budi',
        messageIn: 'Halo, mau pesan nasi uduk 5 porsi ada?',
        messageOut: 'Halo kak! Ada, mau pakai ayam atau telur? Totalnya nanti Rp40.000 untuk 5 porsi polos ya',
    },
    {
        Timestamp: '2026-09-10T10:00:00.000Z',
        phoneNumber: '6281234500007',
        customerName: 'Juh',
        messageIn: 'Oke besok saya mesen nasi uduknya 3 sama tahu gorengnya 8 ya',
        messageOut: 'Siap, Kak! 😊 Untuk pesanan Nasi Uduk 3 porsi dan Gorengan 8 buahnya.',
    },
    {
        Timestamp: '2026-09-11T09:00:00.000Z',
        phoneNumber: '6281234500008',
        customerName: 'Lani',
        messageIn: 'Halo assalamualaikum, selamat siang, saya mau mesen ya buat besok jam 6 saya ambil, nasi uduknya 4 sama lontong sayurnya 10 aja, sambelnya di pisah aja ya',
        messageOut: 'Waalaikumussalam! Halo, selamat siang! Siap, pesanan untuk besok jam 6 pagi sudah saya catat ya, nanti sambalnya kita pisah. Boleh saya tahu nama Kakak untuk pemesanannya? 😊',
    },
    {
        Timestamp: '2026-09-11T09:00:00.000Z',
        phoneNumber: '6281234500001',
        customerName: 'Roma',
        messageIn: 'Halo, mau pesan nasi uduk 8 porsi ada?',
        messageOut: 'Halo kak! Ada, mau pakai telur? Totalnya nanti Rp64.000 untuk 8 porsi polos ya',
    },
]