import { useState, useEffect } from "react";
import { layout } from '../theme/layout'
import { getKasHistory } from "../api/kasHistoryApi";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from "react-native";
import { KasHistoryResponse } from "../api/kasHistoryApi";
import { formatDate } from "../utils/formatDate";
import { colors } from "../theme/colors";


export default function LaporanScreen() {
    const [mode, setMode] = useState<'harian' | 'bulanan'>('harian');
    const [tanggal, setTanggal] = useState(new Date());
    const [data, setData] = useState<KasHistoryResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDatePicker, setShowDatePicker] = useState(false);

    function geserTanggal(arah : 'mundur' | 'maju') {
        const tanggalBaru = new Date(tanggal);
        const pengali = arah === 'mundur' ? -1 : 1;

        if (mode === 'harian') {
            tanggalBaru.setDate(tanggalBaru.getDate() + pengali);
        } else {
            tanggalBaru.setMonth(tanggalBaru.getMonth() + pengali);
        }

        setTanggal(tanggalBaru);
    }

    function handleConfirmDate({ date }: { date: Date | undefined }) {
        setShowDatePicker(false);
        if (date) {
            setTanggal(date);
        }
    }

    useEffect(() => {
        async function fechData() {
            setIsLoading(true);
            try {
                if (mode === 'harian') {
                    const tanggalString = tanggal.toISOString().split('T')[0];
                    const result = await getKasHistory({mode: 'harian', tanggal: tanggalString});
                    setData(result);
                } else {
                    const tahun = tanggal.getFullYear();
                    const bulan = String(tanggal.getMonth() + 1).padStart(2, '0');
                    const result = await getKasHistory({mode: 'bulanan', bulan: `${tahun}-${bulan}`});
                    setData(result);
                }
            } catch (error) {
                console.log('Gagal mengambil data Laporan:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fechData();
    }, [mode, tanggal]);

    function getDaftarTanggal() {
        const tahun = tanggal.getFullYear();
        const bulan = tanggal.getMonth();
        const jumlahHari = new Date(tahun, bulan + 1, 0).getDate();

        return Array.from({ length: jumlahHari }, (_, i) => i + 1);
    }

    const namaBulan = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    return (
        <>
            <ScrollView style={styles.container}>
                
                <Text style={styles.title}>Laporan Warung Anda</Text>

                <View 
                    style={styles.toggleContainer}
                >
                    <TouchableOpacity 
                        onPress={() => setMode('harian')}
                        style={[styles.toggleButton, mode === 'harian' && styles.toggleButtonActive]}
                    >
                        <Text style={[styles.toggleText, mode === 'harian' && styles.toggleTextActive]}>Harian</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => setMode('bulanan')}
                        style={[styles.toggleButton, mode === 'bulanan' && styles.toggleButtonActive]}    
                    >
                        <Text style={[styles.toggleText, mode === 'bulanan' && styles.toggleTextActive]}>Bulanan</Text>
                    </TouchableOpacity>
                </View>

                {/* placeholder navigasi tanggal */}
                <View style={styles.dateNav}>
                    <TouchableOpacity onPress={() => geserTanggal('mundur')}>
                        <Text style={styles.dateNavArrow}>{'<'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() =>  setShowDatePicker(true) }>
                        <Text style={styles.dateNavText}>
                            {mode === 'harian'
                                ? tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                                : tanggal.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
                            }
                        </Text>

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => geserTanggal('maju')}>
                        <Text style={styles.dateNavArrow}>{'>'}</Text>
                    </TouchableOpacity>

                </View>

                {/* Ringkasan */}
                <View style={styles.summaryRow}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Saldo</Text>
                        <Text style={styles.summaryValue}>Rp {(data?.saldo ?? 0).toLocaleString('id-ID')}</Text>
                    </View>
                </View>

                <View style={styles.summaryRow}>
                    <View style={[styles.summaryCardHalf, { backgroundColor: colors.success + '20' }]}>
                        <Text style={styles.summaryLabelSmall}>Uang Masuk</Text>
                        <Text style={[styles.summaryValueSmall, { color: colors.success }]}>
                            Rp {(data?.uangMasuk ?? 0).toLocaleString('id-ID')}
                        </Text>
                    </View>

                    <View style={[styles.summaryCardHalf, { backgroundColor: colors.error + '20' }]}>
                        <Text style={styles.summaryLabelSmall}>Uang Keluar</Text>
                        <Text style={[styles.summaryValueSmall, { color: colors.error }]}>
                            Rp {(data?.uangKeluar ?? 0).toLocaleString('id-ID')}
                        </Text>
                    </View>
                </View>

                {/* Riwayat */}
                <Text style={styles.sectionTitle}>Riwayat Transaksi</Text>

                {isLoading && <Text style={styles.emptyText}>Memuat data...</Text>}

                {!isLoading && (!data || data.riwayat.length === 0) && (
                    <Text style={styles.emptyText}>Belum ada Transaksi</Text>
                )}

                {data?.riwayat.map((item, index) => (
                    <View key={index} style={styles.riwayatCard}>
                        <View>
                            <Text style={styles.riwayatKeterangan}>{item.keterangan || 'Tanpa Keterangan'}</Text>
                            <Text style={styles.riwayatKategori}>{item.kategori}</Text>
                        </View>

                        <View style={styles.riwayatKanan}>
                            <Text style={styles.riwayatTanggal}>{formatDate(item.timestamp)}</Text>
                            <Text style={[
                                styles.riwayatJumlah,
                                { color: item.tipe === 'Masuk' ? colors.success : colors.error }
                            ]}>
                                { item.tipe === 'Masuk' ? '+' : '-'} Rp {item.jumlah.toLocaleString('id-ID')}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {showDatePicker && (
                <View style={styles.modalOverlay}>
                    <TouchableOpacity 
                        style={StyleSheet.absoluteFill} 
                        onPress={() => setShowDatePicker(false)} 
                    />
                    <View style={styles.modalContent}>

                        {mode === 'harian' ? (
                            <>
                                <Text style={styles.modalTitle}>
                                    {tanggal.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                </Text>
                                
                                <View style={styles.calendarGrid}>
                                    {getDaftarTanggal().map((hari) => (
                                        <TouchableOpacity 
                                        key={hari}
                                        style={styles.calendarDay}
                                        onPress={() => {
                                            const tangalBaru = new Date(tanggal);
                                            tangalBaru.setDate(hari);
                                            setTanggal(tangalBaru);
                                            setShowDatePicker(false);
                                        }}
                                        >
                                            <Text style={styles.calendarDayText}>{hari}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            
                            </>           
                        ) : (
                            <>
                                <View style={styles.yearNav}>
                                    <TouchableOpacity onPress={() => {
                                        const tanggalBaru = new Date(tanggal);
                                        tanggalBaru.setFullYear(tanggalBaru.getFullYear() - 1);
                                        setTanggal(tanggalBaru);
                                    }}>
                                        <Text style={styles.dateNavArrow}>{'<'}</Text>
                                    </TouchableOpacity>

                                    <Text style={styles.modalTitle}>{tanggal.getFullYear()}</Text>

                                    <TouchableOpacity onPress={() => {
                                        const tanggalBaru = new Date(tanggal);
                                        tanggalBaru.setFullYear(tanggalBaru.getFullYear() + 1);
                                        setTanggal(tanggalBaru);
                                    }}>
                                        <Text style={styles.dateNavArrow}>{'>'}</Text>
                                    </TouchableOpacity>

                                </View>

                                <View style={styles.monthGrid}>
                                    {namaBulan.map((nama, index) => (
                                        <TouchableOpacity
                                            key={nama}
                                            style={styles.monthItem} 
                                            onPress={() => {
                                                const tanggalBaru = new Date(tanggal);
                                                tanggalBaru.setMonth(index);
                                                setTanggal(tanggalBaru);
                                                setShowDatePicker(false);
                                        }}>
                                            <Text style={styles.calendarDayText}>{nama}</Text>
                                        </TouchableOpacity>
                                    ))}    
                                </View>                           
                            </>
                        )}
                    </View>
                </View>
            )}

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 16,
        textAlign: 'center'
    },
    toggleContainer: {
        flexDirection: 'row',
        borderRadius: layout.cardRadius,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#cccc',
        marginBottom: 16,
    },
    toggleButton: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
        backgroundColor: colors.surface,
    },
    toggleButtonActive: {
        backgroundColor: colors.primary,
    },
    toggleText: {
        color: colors.textDark,
        fontWeight: '600',
    },
    toggleTextActive: {
        color: colors.surface,
    },
    dateNav: {
        backgroundColor: '#e2faff',
        borderRadius: layout.cardRadius,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        ...layout.cardShadow
    },
    dateNavArrow: {
        fontSize: 26,
        fontWeight: 'bold',
        color: colors.primary,
        paddingHorizontal: 12,
        
    },
    dateNavText: {
        color: colors.textDark,
        fontWeight: 'bold',
    },
    summaryRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: layout.cardRadius,
        padding: 16,
        ...layout.cardShadow,
    },
    summaryLabel: {
        color: colors.textDark,
        opacity: 0.6,
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary,
    },
    summaryCardHalf: {
        flex: 1,
        borderRadius: layout.cardRadius,
        padding: 16,
    },
    summaryLabelSmall: {
        color: colors.textDark,
        opacity: 0.7,
        marginBottom: 4,
        fontSize: 13,
    },
    summaryValueSmall: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textDark,
        marginTop: 8,
        marginBottom: 12,
    },
    emptyText: {
        textAlign: 'center',
        color: colors.textDark,
        opacity: 0.5,
        paddingVertical: 24,
    },
    riwayatCard: {
        backgroundColor: colors.surface,
        borderRadius: layout.cardRadius,
        padding: 16,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...layout.cardShadow,
    },
    riwayatKeterangan: {
        fontWeight: '600',
        color: colors.textDark,
        marginBottom: 2,
    },
    riwayatKategori: {
        color: colors.textDark,
        opacity: 0.5,
        fontSize: 13,
    },
    riwayatKanan: {
        alignItems: 'flex-end'
    },
    riwayatTanggal: {
        fontWeight: '600',
        fontSize: 13,
    },
    riwayatJumlah: {
        fontWeight: 'bold',
        fontSize: 15,
    },
        modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderRadius: layout.cardRadius,
        padding: 20,
        width: '85%',
        ...layout.cardShadow,
    },
    modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 16,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    calendarDay: {
        width: '14.28%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarDayText: {
        color: colors.textDark,
    },
    yearNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    },
    monthGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    monthItem: {
        width: '33.33%',
        paddingVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
});