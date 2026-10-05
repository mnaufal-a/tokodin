import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Linking, Alert } from "react-native";
import { colors } from "../theme/colors";
import { layout } from "../theme/layout"
import { Mail, Sparkles, MessageCircle, Save, Heart } from "lucide-react-native/icons";
import { CircleAlert } from "lucide-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Warna lavender untuk kotak ikon & pill. Nanti pindahkan ke colors.ts sebagai token.
const LAVENDER = '#EAEDFF';

export default function AccountScreen() {
    const [namaWarung, setNamaWarung] = useState('');
    const [alamat, setAlamat] = useState('');
    const [noHp, setNoHp] = useState('');

    function hubungiWa() {
        const nomor = '6281511004406';
        let teksPesan;

        if (namaWarung && namaWarung.trim() !== '') {
            teksPesan =`Halo, saya dari ${namaWarung}.

Alamat: ${alamat}
No. HP: ${noHp}

Saya ingin menanyakan mengenai fitur automasi WhatsApp untuk warung/toko saya. Apakah bisa dijelaskan mengenai fitur yang tersedia, cara kerja, serta persyaratan dan biaya yang diperlukan?

Terima kasih.`
        } else {
            teksPesan = 'Halo, Saya mau tanya soal fitur automasi WhatsApp untuk Warung/Toko saya'
        }

        const pesan = encodeURIComponent(teksPesan);
        Linking.openURL(`https://wa.me/${nomor}?text=${pesan}`);
    }

    function hubungiEmail() {
        const nomor = '6281511004406';
        let teksPesan;

        if (namaWarung && namaWarung.trim() !== '') {
            teksPesan = `Halo, Saya dari ${namaWarung} dengan alamat: ${alamat} (No. Hp: ${noHp}), mau tanya soal fitur automasi Email untuk warung/toko saya `;
        } else {
            teksPesan = 'Halo, Saya mau tanya soal fitur automasi Email untuk Warung/Toko saya'
        }

        const pesan = encodeURIComponent(teksPesan);
        Linking.openURL(`https://wa.me/${nomor}?text=${pesan}`);
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                const objek = await AsyncStorage.getItem('infoWarung')

                if (objek !== null) {
                    const parsedData = JSON.parse(objek);
                    
                    setNamaWarung(parsedData.namaWarung)

                    setAlamat(parsedData.alamat)

                    setNoHp(parsedData.noHp)
                }

            } catch (error) {
                console.error("Gagal menyimpan data warung", error)
            }
        }
        
        loadData();
    }, [])

    async function simpanInfo() {
        if (namaWarung.trim() === ''){
            Alert.alert('Data belum lengkap!', 'Nama warung harus diisi dulu');
            return
        }

        if(alamat === '') {
            Alert.alert('Data belum lengkap!', 'Alamat warung harus diisi dulu')
            return
        }

        const jumlahNumber = Number(noHp);

        if (!noHp || isNaN(jumlahNumber) || jumlahNumber <= 0) {
            Alert.alert('Data belum lengkap!', 'Nomor harus diisi lebih dari 0!')
            return;
        }

        try {
            const data = {namaWarung, alamat, noHp}
            await AsyncStorage.setItem('infoWarung', JSON.stringify(data))
            Alert.alert('Tersimpan', 'info warung berhasil disimpan')
        } catch (error) {
            console.error('Gagal menyimpan data warung', error)
        }
    } 

    return (
        <ScrollView style={styles.container}>

            <View style={styles.containerTitle}>
                <Text style={styles.title}>Profil & Akun TokoDin</Text>
                <Text style={styles.altTitle}>Kelola data gerai dan pantau fitur operasional warung</Text>
            </View>

            {/* Banner mode demo */}
            <View style={styles.demoBanner}>
                <View style={styles.demoIcon}>
                    <CircleAlert color={colors.primary} size={18} />
                </View>
                <View style={styles.demoTextWrap}>
                    <Text style={styles.demoTitle}>Mode Demo Berjalan</Text>
                    <Text style={styles.demoDesc}>
                        Saat ini aplikasi masih mode demo. Klik tombol Ajukan Fitur agar kami menyempurnakan aplikasi sesuai kebutuhan Anda.
                    </Text>
                </View>
            </View>

            <View style={styles.akunTitle}>
                <Text style={styles.sectionTitle}>Informasi Warung</Text>
                <Text style={styles.sectionTag}>IDENTITAS GERAI</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.labelInput}>
                    <Text style={styles.label}>Nama Warung</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Contoh: Warung Nasi Uduk"
                        value={namaWarung}
                        onChangeText={setNamaWarung}
                    />
                </View>

                <View style={styles.labelInput}>
                    <Text style={styles.label}>Alamat Warung</Text>
                    <TextInput
                        style={[styles.input, styles.inputMultiline]}
                        placeholder="Alamat Lengkap Warung anda"
                        value={alamat}
                        onChangeText={setAlamat}
                        multiline
                    />
                </View>

                <View style={styles.labelInput}>
                    <Text style={styles.label}>No.Hp / WhatsApp</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="08*********"
                        value={noHp}
                        onChangeText={setNoHp}
                        keyboardType="phone-pad"
                    />
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={() => {simpanInfo()}}>
                    <Save color={colors.surface} size={20} />
                    <Text style={styles.submitText}>Simpan Info</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.akunTitle}>
                <Text style={styles.sectionTitle}>Fitur Automasi</Text>
                <Text style={styles.sectionTag}>EKSPANSI TOKO</Text>
            </View>

            <View style={styles.featureCard}>
                <View style={styles.featureRow}>
                    <View style={styles.featureRowIcon}>
                        <MessageCircle size={18} color={colors.textDark} />
                    </View>
                    <View style={styles.featureTextWrap}>
                        <Text style={styles.featureTitle}>Automasi WhatsApp</Text>
                        <Text style={styles.featureSubtitle}>Balasan Otomatis Pesanan</Text>
                    </View>
                    <View style={styles.pill}>
                        <Text style={styles.pillText}>Belum Aktif</Text>
                    </View>
                </View>
                <Text style={styles.featureDesc}>
                    Balas Otomatis pesanan pelanggan anda lewat WhatsApp pakai AI, 24 jam nonstop!.
                </Text>
                <TouchableOpacity style={styles.featureButton} onPress={hubungiWa}>
                    <Sparkles color={colors.primary} size={16} />
                    <Text style={styles.featureButtonText}>Ajukan Fitur Ini!</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.featureCard}>
                <View style={styles.featureRow}>
                    <View style={styles.featureRowIcon}>
                        <Mail size={18} color={colors.textDark} />
                    </View>
                    <View style={styles.featureTextWrap}>
                        <Text style={styles.featureTitle}>Automasi Email</Text>
                        <Text style={styles.featureSubtitle}>Laporan Harian</Text>
                    </View>
                    <View style={styles.pill}>
                        <Text style={styles.pillText}>Belum Aktif</Text>
                    </View>
                </View>
                <Text style={styles.featureDesc}>
                    Terima Laporan harian dan Konfirmasi pesanan otomatis lewat email, tanpa perlu buka Aplikasi!.
                </Text>
                <TouchableOpacity style={styles.featureButton} onPress={hubungiEmail}>
                    <Sparkles color={colors.primary} size={16} />
                    <Text style={styles.featureButtonText}>Ajukan Fitur Ini!</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.akunTitle}>
                <Text style={styles.sectionTitle}>Tentang Aplikasi</Text>
                <Text style={styles.sectionTag}>INFO SISTEM</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.aboutRow}>
                    <View style={styles.aboutName}>
                        <View style={styles.dot} />
                        <Text style={styles.appName}>TokoDin</Text>
                    </View>
                    <View style={styles.pill}>
                        <Text style={styles.pillText}>Versi 1.0.0</Text>
                    </View>
                </View>
                <Text style={styles.appDesc}>
                    Aplikasi kasir & manajemen kas untuk UMKM Indonesia. Dibuat khusus untuk membantu pemilik warung mengelola transaksi harian dengan mudah.
                </Text>
                <View style={styles.madeWith}>
                    <Heart size={16} color={colors.primary} />
                    <Text style={styles.madeWithText}>Dibuat dengan bangga untuk memajukan UMKM Indonesia.</Text>
                </View>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 16,
    },
    containerTitle: {
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
    },
    altTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textMuted,
    },
    demoBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        backgroundColor: colors.pink,
        borderRadius: layout.cardRadius,
        padding: 16,
        marginBottom: 16,
    },
    demoIcon: {
        backgroundColor: colors.surface,
        borderRadius: 999,
        padding: 6,
    },
    demoTextWrap: {
        flex: 1,
        gap: 4,
    },
    demoTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.primaryDark,
    },
    demoDesc: {
        fontSize: 13,
        lineHeight: 20,
        color: colors.primaryDark,
    },
    akunTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: colors.textDark,
    },
    sectionTag: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 1,
        color: colors.textMuted,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: layout.cardRadius,
        padding: 16,
        marginBottom: 24,
        ...layout.cardBorder,
        ...layout.cardShadowLight
    },
    labelInput: {
        gap: 4,
        marginBottom: 10
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textDark,
    },
    input: {
        borderWidth: 1,
        borderRadius: layout.cardRadius,
        borderColor: colors.border,
        padding: 12,
        fontSize: 15,
        backgroundColor: colors.background,
    },
    inputMultiline: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: colors.primary,
        borderRadius: layout.cardRadius,
        padding: 18,
        alignItems: 'center',
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6
    },
    submitText: {
        color: colors.surface,
        fontWeight: 'bold',
        fontSize: 15,
    },
    featureCard: {
        backgroundColor: colors.surface,
        borderRadius: layout.cardRadius,
        padding: 16,
        marginBottom: 12,
        ...layout.cardBorder,
        ...layout.cardShadowLight
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12
    },
    featureRowIcon: {
        backgroundColor: LAVENDER,
        borderRadius: 12,
        padding: 8
    },
    featureTextWrap: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.textDark,
    },
    featureSubtitle: {
        fontSize: 12,
        color: colors.textMuted,
    },
    featureDesc: {
        fontSize: 13,
        color: colors.textMuted,
        marginBottom: 16,
    },
    featureButton: {
        backgroundColor: colors.pink,
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6
    },
    featureButtonText: {
        color: colors.primary,
        fontWeight: '500',
        fontSize: 13,
    },
    pill: {
        backgroundColor: LAVENDER,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    pillText: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.5,
        color: colors.textDark,
    },
    aboutRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    aboutName: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
    },
    appName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.textDark,
    },
    appDesc: {
        fontSize: 13,
        color: colors.textMuted,
        lineHeight: 20,
    },
    madeWith: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 16,
    },
    madeWithText: {
        flex: 1,
        fontSize: 13,
        color: colors.textDark,
    },
});
