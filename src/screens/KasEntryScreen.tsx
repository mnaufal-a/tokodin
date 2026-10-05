import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { addKasEntry, KasEntryInput } from "../api/kasApi";
import { colors } from "../theme/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { layout } from "../theme/layout";

const KATEGORI_LIST = ['Modal', 'Belanja Bahan Baku', 'Operasional', 'Lain-lain'];

type DashboardStackParamList = {
    DashboardMain : undefined;
    KasEntry : { tipe: 'Masuk' | 'Keluar' } | undefined;
};

type Props = NativeStackScreenProps<DashboardStackParamList, 'KasEntry'>;

function KasEntryScreen({ navigation, route }: Props) {
    const [tipe, setTipe] = useState<'Masuk' | 'Keluar'>(route.params?.tipe ?? 'Masuk');
    const [kategori, setKategori] = useState('Modal');
    const [jumlah, setJumlah] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [submitting, setSubmitting] = useState(false);

    function formatRupiah(angka: string): string {
        const angkaBersih = angka.replace(/\D/g, '');
        if (!angkaBersih) return '';
        return Number(angkaBersih).toLocaleString('id-ID');
    }

    function handleJumlahChange(text: string) {
        const angkaBersih = text.replace(/\D/g, '');
        setJumlah(angkaBersih);
    }

    async function handleSubmit() {
        const jumlahNumber = Number(jumlah);

        if (!jumlah || isNaN(jumlahNumber) || jumlahNumber <= 0) {
            Alert.alert('Data belum lengkap!', 'Nominal harus diisi lebih dari 0!')
            return;
        }


        const entry: KasEntryInput = {
            tipe,
            kategori,
            jumlah: jumlahNumber,
            keterangan,
        };

        try {
            setSubmitting(true)
            const result = await addKasEntry(entry);

            if (result.success) {
                Alert.alert('Berhasil', 'Transaksi kas sudah berhasil disimpan', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                ]);
        
            } else {
                Alert.alert('Gagal', result.errors?.join('\n') ?? 'terjadi Kesalahan');
            }
        } catch {
            Alert.alert('Gagal', 'Tidak bisa terhubung ke server');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label}>Tipe Transaksi</Text>
            <View style={styles.row}>
                <TouchableOpacity 
                    style={[styles.toggleButton, tipe === 'Masuk' && styles.toggleActiveMasuk]}
                    onPress={() => setTipe('Masuk')}
                >
                    <Text style={[styles.toggleText, tipe === 'Masuk' && styles.toggleTextActive]}>Masuk</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.toggleButton, tipe === 'Keluar' && styles.toggleActiveKeluar]}
                    onPress={() => setTipe('Keluar')}
                >
                    <Text style={[styles.toggleText, tipe === 'Keluar' && styles.toggleTextActive]}>Keluar</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Kategori</Text>
            <View style={styles.wrapRow}>
                {KATEGORI_LIST.map((item) => (
                    <TouchableOpacity 
                        key={item}
                        style={[styles.kategoriButton, kategori === item && styles.kategoriActive]}
                        onPress={() => setKategori(item)}
                    >
                        <Text style={[styles.kategoriText, kategori === item && styles.kategoriTextActive]}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            
            <View style={styles.card}>

                <Text style={styles.label}>Nominal (Rp)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Contoh: 50.000"
                    keyboardType="numeric"
                    value={formatRupiah(jumlah)}
                    onChangeText={handleJumlahChange}
                />

                <Text style={styles.label}>Keterangan</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="Contoh: Beli Gas 1 tabung"
                    value={keterangan}
                    onChangeText={setKeterangan}
                />

                <TouchableOpacity 
                    style={[styles.submitButton, submitting && styles.submitDisabled]}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    <Text style={styles.submitText}>
                        {submitting ? 'Menyimpan...' : `Simpan ${tipe}`}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  card: {
        backgroundColor: colors.surface,
        borderRadius: layout.cardRadius,
        padding: 16,
        marginBottom: 24,
        marginTop: 16,
        ...layout.cardBorder,
        ...layout.cardShadowLight
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: layout.cardRadius,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.textDark,
    ...layout.cardShadowLight
  },
  toggleActiveMasuk: {
    backgroundColor: colors.success,
    borderColor: colors.success,        
  },
  toggleActiveKeluar: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  toggleText: {
    color: colors.textDark,
    fontWeight: 'bold',
  },
  toggleTextActive: {
    color: colors.surface,
  },
  kategoriButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    ...layout.cardShadowLight
  },
  kategoriActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  kategoriText: {
    color: colors.primary,
    fontSize: 13,
  },
  kategoriTextActive: {
    color: colors.surface,
  },
  input: {
    borderRadius: layout.cardRadius,
    padding: 12,
    fontSize: 16,
    borderColor: colors.border,
    borderWidth: 1,
    backgroundColor: colors.background,
    ...layout.cardShadowLight
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: layout.cardRadius,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default KasEntryScreen;