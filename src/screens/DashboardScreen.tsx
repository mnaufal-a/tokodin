import { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { getDailyStats } from '../api/dailyStatsApi';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { getWeeklyStats, WeeklyStatItem } from '../api/weeklyStatsApi';
import { BarChart } from 'react-native-gifted-charts';
import { KasSummary, getKasSummary } from '../api/kasSummaryApi';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { TrendingUp, TrendingDown, ClipboardList, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react-native/icons';
import { formatDateShort } from '../utils/formatDate';

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

    useEffect(() => {
      const unsubscribe = navigation.getParent()?.addListener('tabPress' as never , () => {
        loadStats();
      })
      return unsubscribe;
    }, [navigation])

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

    function roundUpToNice(value: number): number {
      if (value <= 0) return 100000;
      const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
      return Math.ceil(value / magnitude) * magnitude;
    }

    // cari nilai tertinggi di weekltstats
    const maxValue = Math.max(...weeklyStats.map(item => item.value))


    /// bikin array, trs ksh frontcolor per item
    const weeklyStatsWithColor = weeklyStats.map(item => ({
      ...item,
      frontColor: item.value === maxValue ? colors.primaryDark : colors.pink
    }))

    const rataRata = stats.totalOrders > 0 
     ? stats.totalRevenue / stats.totalOrders
     : 0;


  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.dateText}>{stats.date}</Text> */}

      <View style={styles.saldoCard} >
        <View style={styles.saldoHeaderRow}>
          <Text style={styles.saldoLabel}>SALDO KAS ANDA</Text>
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>Hari ini, {formatDateShort(stats.date)}</Text>
          </View>
        </View>
        <Text style={styles.saldoValue}>
          Rp {kasSummary.saldo.toLocaleString('id-ID')}
        </Text>

        <View style={styles.kasRow}>
            <View style={styles.kasItem}>
                <View style={styles.kasItemRow}>
                  <TrendingUp color={colors.surface} size={14}/>
                  <Text style={styles.kasItemLabel}>Uang Masuk</Text>
                </View>
                <Text style={[styles.kasItemValue, styles.kasMasuk]}>
                  Rp {kasSummary.uangMasuk.toLocaleString('id-ID')}
                </Text>
            </View>

            <View style={styles.kasItem}>
                <View style={styles.kasItemRow}>
                  <TrendingDown color={colors.surface} size={14}/>
                  <Text style={styles.kasItemLabel}>Uang Keluar</Text>
                </View>
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
          <View style={styles.quickIcon}>
            <Plus color={'#00714D'} style={styles.Plus}/>
            <ArrowRight />
          </View>
          <View style={styles.quickText}>
            <Text style={styles.quickActionText}>+ Uang Masuk </Text>
            <Text>Catat Pemasukan</Text>
          </View>
        </TouchableOpacity>   

        <TouchableOpacity
          style={[styles.quickActionButton, styles.quickActionKeluar]}
          onPress={() => navigation.navigate('KasEntry', {tipe: 'Keluar'})}
        >
          <View style={styles.quickIcon}>
            <Minus color={'#93000A'} style={styles.Minus}/>
            <ArrowRight />
          </View>
          <View style={styles.quickText}>
            <Text style={styles.quickActionText}>- Uang Keluar</Text>
            <Text>Catat Pengeluaran</Text>
          </View>
        </TouchableOpacity>   
      </View>

      <View style={styles.orderStatsRow}>

        <View style={[styles.statCard, styles.statCardHalf]}>
          <View style={styles.statLabelRow}>
            <Text style={styles.statLabel}>Total Pesanan</Text>
            <ClipboardList color={colors.textMuted} size={20} style={styles.iconLabel}/>
          </View>
          <Text style={styles.statValue}>{stats.totalOrders}</Text>
        </View>

        <View style={[styles.statCard, styles.statCardHalf]}>
          <View style={styles.statLabelRow}>
            <Text style={styles.statLabel}>Total Item Terjual</Text>
            <ShoppingBag color={colors.textMuted} size={20} style={styles.iconLabelB}/>
          </View>
          <Text style={styles.statValue}>{stats.totalItems}</Text>
        </View>

      </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Pendapatan</Text>
          <Text style={[styles.statValue, styles.revenue]}>             
            Rp{stats.totalRevenue.toLocaleString('id-ID')}
          </Text>
          <Text style={styles.statSubText}>Rata-rata: Rp{rataRata.toLocaleString('id-ID')}/pesanan</Text>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.statLabel}>Tren Pendapatan 7 Hari</Text>
          <BarChart
            data={weeklyStatsWithColor}
            disableScroll={true}
            maxValue={roundUpToNice(maxValue)}
            noOfSections={5}
            yAxisLabelPrefix='Rp'
            frontColor={colors.primary}
            barWidth={10}
            spacing={22}
            initialSpacing={10}
            endSpacing={10}
            roundedTop
            yAxisLabelWidth={60}
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
  saldoValue: {
    color: colors.surface,
    fontSize: 42,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 16,
  },
  kasRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
    paddingTop: 12,
    gap: 20
  },
  kasItem: {
    flex: 1,
  },
  kasItemRow: {
    flexDirection: 'row',
    gap: 6
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
  iconLabel: {
    
  },
  iconLabelB: {
    
  },
  statCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: layout.cardRadius,
    marginBottom: 12,
    ...layout.cardBorder,
    ...layout.cardShadowLight
  },
  statCardHalf: {
    flex: 1,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statLabel: {
    color: colors.textDark,
    fontSize: 12,
    
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
  statSubText: {
    color: colors.textMuted,
    marginTop: 8,
  },
  chartCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: layout.cardRadius,
    marginBottom: 16,
    ...layout.cardBorder,
    ...layout.cardShadowLight
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
    paddingHorizontal: 16,
    ...layout.cardBorder,
    ...layout.cardShadowLight
  },
  quickActionMasuk: {
    backgroundColor: colors.surface,
  },
  quickActionKeluar: {
    backgroundColor: colors.surface,
  },
  quickActionText: {
    color: colors.textDark,
    fontWeight: 'bold',
    fontSize: 16,
  },
  quickIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  Plus: {
    backgroundColor: '#6CF8BB',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  Minus: {
    backgroundColor: '#FFDAD6',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  quickText: {
    
  },
  saldoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,   // ganti dari jarak lama, kasih ruang lebih lega
  },
  saldoLabel: {
    color: colors.surface,
    fontSize: 12,
    opacity: 0.9,
    fontWeight: 'bold',
    textTransform: 'uppercase',   // BARU
    letterSpacing: 0.5,            // BARU — kasih jarak antar huruf
  },
  dateBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dateBadgeText: {
    color: colors.surface,
    fontSize: 11,
    fontWeight: '600',
  },
});

export default DashboardScreen;