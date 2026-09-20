import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { getDailyStats } from '../api/dailyStatsApi';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { getWeeklyStats, WeeklyStatItem } from '../api/weeklyStatsApi';
import { BarChart } from 'react-native-gifted-charts';
import { KasSummary, getKasSummary } from '../api/kasSummaryApi';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

type DashboardStackParamList = {
  DashboardMain: undefined;
  KasEntry: { tipe: 'Masuk' | 'Keluar' } | undefined;
};

type Props = NativeStackScreenProps<DashboardStackParamList, 'DashboardMain'>;  

function DashboardScreen({ navigation }: Props) {
    type DailyStats = {
      date: string;
      totalOrders: number;
      totalItems: number;
      totalRevenue: number;
    }

    const [stats, setStats] = useState<DailyStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [weeklyStats, setWeeklyStats] = useState<WeeklyStatItem[]>([]);
    const [kasSummary, setKasSummary] = useState<KasSummary | null>(null);

    useFocusEffect(
      useCallback(() => {
        loadStats();
      }, [])
    );

    async function loadStats() {
        try{
            setLoading(true);
            const [dailyData, weeklyData, kasSummaryData] = await Promise.all([
              getDailyStats(),
              getWeeklyStats(),
              getKasSummary(),
            ]);
            setStats(dailyData);
            setWeeklyStats(weeklyData);
            setKasSummary(kasSummaryData);
            setError(null);
        } catch {
            setError('Gagal memuat statistik, Coba lagi!');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        )
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>{error}</Text>
            </View>
        )
    }

    if (!stats) {
      return null;
    }

    if (!kasSummary) {
      return null;
    }

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.dateText}>{stats.date}</Text> */}

      <View style={styles.saldoCard} >
        <Text style={styles.saldoLabel}>Saldo Hari ini</Text>
        <Text style={styles.saldoValue}>
          Rp {kasSummary.saldo.toLocaleString('id-ID')}
        </Text>

        <View style={styles.kasRow}>
            <View style={styles.kasItem}>
                <Text style={styles.kasItemLabel}>Uang Masuk</Text>
                <Text style={[styles.kasItemValue, styles.kasMasuk]}>
                  Rp {kasSummary.uangMasuk.toLocaleString('id-ID')}
                </Text>
            </View>

            <View style={styles.kasItem}>
                <Text style={styles.kasItemLabel}>Uang Keluar</Text>
                <Text style={[styles.kasItemValue, styles.kasKeluar]}>
                  Rp {kasSummary.uangKeluar.toLocaleString('id-ID')}
                </Text>
            </View>
        </View>
      </View>

      <View style={styles.quickActionsRow}>
        <TouchableOpacity
          style={[styles.quickActionButton, styles.quickActionMasuk]}
          onPress={() => navigation.navigate('KasEntry', {tipe: 'Masuk'})}
        >
          <Text style={styles.quickActionText}>+ Uang Masuk</Text>
        </TouchableOpacity>   

        <TouchableOpacity
          style={[styles.quickActionButton, styles.quickActionKeluar]}
          onPress={() => navigation.navigate('KasEntry', {tipe: 'Keluar'})}
        >
          <Text style={styles.quickActionText}>- Uang Keluar</Text>
        </TouchableOpacity>   
      </View>

      <View style={styles.orderStatsRow}>

        <View style={[styles.statCard, styles.statCardHalf]}>
          <Text style={styles.statLabel}>Total Pesanan</Text>
          <Text style={styles.statValue}>{stats.totalOrders}</Text>
        </View>

        <View style={[styles.statCard, styles.statCardHalf]}>
          <Text style={styles.statLabel}>Total Item Terjual</Text>
          <Text style={styles.statValue}>{stats.totalItems}</Text>
        </View>

      </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Pendapatan</Text>
          <Text style={[styles.statValue, styles.revenue]}>
            Rp{stats.totalRevenue.toLocaleString('id-ID')}
          </Text>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.statLabel}>Tren Pendapatan 7 Hari</Text>
          <BarChart
            data={weeklyStats}
            frontColor={colors.primary}
            barWidth={16}
            spacing={25}
            initialSpacing={10}
            endSpacing={10}
            roundedTop
            noOfSections={4}
            yAxisLabelWidth={45}
            yAxisTextStyle={{ color: colors.textDark}}
            xAxisLabelTextStyle={{ color: colors.textDark }}
          />
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 16,
  },
  saldoCard: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  saldoLabel: {
    color: colors.surface,
    fontSize: 14,
    opacity: 0.9,
    fontWeight: 'bold',
  },
  saldoValue: {
    color: colors.surface,
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 16,
  },
  kasRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
    paddingTop: 12,
  },
  kasItem: {
  flex: 1,
  },
  kasItemLabel: {
    color: colors.surface,
    fontSize: 12,
    opacity: 0.9,
    fontWeight: 'bold',
  },
  kasItemValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  kasMasuk: {
    color: '#fafcfb',
  },
  kasKeluar: {
    color: '#fafcfb',
  },
  orderStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: layout.cardRadius,
    marginBottom: 12,
    ...layout.cardShadow
  },
  statCardHalf: {
    flex: 1,
  },
  statLabel: {
    color: colors.textDark,
    fontSize: 14,
    marginBottom: 15,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textDark,
    marginTop: 4,
  },
  revenue: {
    color: colors.success,
  },
  chartCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: layout.cardRadius,
    marginBottom: 16,
    ...layout.cardShadow,
  },
  quickActionsRow: {
  flexDirection: 'row',
  gap: 12,
  marginBottom: 16,
  },
  quickActionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickActionMasuk: {
    backgroundColor: colors.success,
  },
  quickActionKeluar: {
    backgroundColor: '#DC2626',
  },
  quickActionText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default DashboardScreen;