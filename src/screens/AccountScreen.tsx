import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { layout } from "../theme/layout"
import { Linking } from "react-native";

export default function AccountScreen() {
    const [namaWarung, setNamaWarung] = useState('');
    const [alamat, setAlamat] = useState('');
    const [noHp, setNoHp] = useState('');

    function hubungiWa() {
        const nomor = '6281511004406';
        const pesan = encodeURIComponent('Halo, Saya mau tanya soal fitur automasi WhatsApp untuk Warung/Toko saya');
        Linking.openURL(`https://wa.me/${nomor}?text=${pesan}`);
    }

    function hubungiEmail() {
        const nomor = '6281511004406';
        const pesan = encodeURIComponent('Halo, Saya mau tanya soal fitur automasi Email untuk Warung/Toko saya');
        Linking.openURL(`https://wa.me/${nomor}?text=${pesan}`);
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Akun</Text>

            <Text style={styles.sectionTitle}>⚠️ Saat Ini Aplikasi Masih Mode Demo !!! ⚠️</Text>
            <Text style={styles.featureTitle}>⚠️ Klik Tombol Ajukan Fitur agar kami menyempurnakan Aplikasi sesuai kebutuhan anda ⚠️</Text>

            <Text style={styles.sectionTitle}>🏪 Informasi Warung</Text>
            <View style={styles.card}>
                <Text style={styles.label}>Nama Warung</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Contoh: Warung Nasi Uduk"
                    value={namaWarung}
                    onChangeText={setNamaWarung}
                />

                <Text style={styles.label}>Alamat Warung</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Alamat Lengkap Warung anda"
                    value={alamat}
                    onChangeText={setAlamat}
                    multiline
                />

                <Text style={styles.label}>No.Hp / WhatsApp</Text>
                <TextInput
                    style={styles.input}
                    placeholder="08*********"
                    value={noHp}
                    onChangeText={setNoHp}
                    keyboardType="phone-pad"
                />

                <TouchableOpacity style={styles.submitButton} onPress={() => {}}>
                    <Text style={styles.submitText}>Simpan Info</Text>
                </TouchableOpacity>

            </View>


            <Text style={styles.sectionTitle}>🌟 Fitur Automasi !!!</Text>
            
            <View style={styles.featureCard}>
                <Text style={styles.featureTitle}>🤖 Automasi WhatsApp</Text>
                <Text style={styles.featureDesc}>
                    Balas Otomatis pesanan pelanggan anda lewat WhatsApp pakai AI, 24 jam nonstop!.
                </Text>
                <Text style={styles.featureStatus}>Status: Belum Aktif</Text>
                <TouchableOpacity style={styles.featureButton} onPress={hubungiWa}>
                    <Text style={styles.featureButtonText}>Ajukan Fitur Ini!</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.featureCard}>
                <Text style={styles.featureTitle}>📧 Automasi Email</Text>
                <Text style={styles.featureDesc}>
                    Terima Laporan harian dan Konfirmasi pesanan otomatis lewat email, tanpa perlu buka Aplikasi!.
                </Text>
                <Text style={styles.featureStatus}>Status: Belum Aktif</Text>
                <TouchableOpacity style={styles.featureButton} onPress={hubungiEmail}>
                    <Text style={styles.featureButtonText}>Ajukan Fitur Ini!</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>ℹ️ Tentang Aplikasi</Text>

            <View style={styles.card}>
                <Text style={styles.appName}>TokoDin</Text>
                <Text style={styles.appVersion}>Versi 1.0.0</Text>
                <Text style={styles.appDesc}>
                    Aplikasi kasir & manajemen kas untuk UMKM Indonesia. Dibuat khusus untuk membantu pemilik warung mengelola transaksi harian dengan mudah.
                </Text>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 8,
    },
    sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 12,
    marginTop: 6,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        ...layout.cardShadow
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textDark,
        marginBottom: 6,
        marginTop: 17,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: layout.cardRadius,
        padding: 12,
        fontSize: 15,
        backgroundColor: colors.background,
        ...layout.cardShadow,
    },
    submitButton: {
        backgroundColor: colors.primary,
        borderRadius: layout.cardRadius,
        padding: 14,
        alignItems: 'center',
        marginTop: 20,
        ...layout.cardShadow
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
        ...layout.cardShadow
    },
    featureTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.textDark,
        marginBottom: 6,
    },
    featureDesc: {
        fontSize: 13,
        color: colors.textDark,
        opacity: 0.7,
        marginBottom: 8,
    },
    featureStatus: {
        fontSize: 12,
        color: colors.error,
        fontWeight: '600',
        marginBottom: 12,
    },
    featureButton: {
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: layout.cardRadius,
        padding: 10,
        alignItems: 'center',
    },
    featureButtonText: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 13,
    },
    appName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
    },
    appVersion: {
        fontSize: 12,
        color: colors.textDark,
        opacity: 0.5,
        marginBottom: 12,
    },
    appDesc: {
        fontSize: 13,
        color: colors.textDark,
        opacity: 0.7,
        lineHeight: 20,
    },
});