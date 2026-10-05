import { useState,useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { getOrders, Order, updateOrderStatus } from '../api/ordersApi';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { useOverdue } from '../context/OverdueContext';
import { formatRelativeTime } from '../utils/formatDate';
import { filterByDatePreset,FilterPreset } from '../utils/dateFilter';
import { CircleCheck } from 'lucide-react-native/icons';


const ONE_HOUR_MS = 60 *60 * 1000;

function countOverdueOrders(orders: Order[]): number {
  const now = new Date().getTime();

  return orders.filter((order) => {
    const orderTime = new Date(order.createdAt).getTime();
    const elapsed = now - orderTime;
    return order.status === 'Baru' && elapsed > ONE_HOUR_MS;
  }).length;
}

function InboxScreen({ navigation }: { navigation: NavigationProp<any> }) {
    const { setOverdueCount } = useOverdue();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterPreset>('semua');

    useFocusEffect (
      useCallback(() => {
        loadOrders();
      }, [])
    );

    //buat re-tab yang udah aktif
    useEffect(() => {
      const unsubscribe = navigation.addListener('tabPress' as never, () => {
        loadOrders();
      });
      return unsubscribe;
    }, [navigation])
    
    useEffect (() => {
      setOverdueCount(countOverdueOrders(orders));
    }, [orders])

    async function loadOrders() {
        try {
            setLoading(true);
            const data = await getOrders();
            setOrders(data);
            setError(null);
        } catch  {
            setError('Gagal memuat pesanan, coba lagi');
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={colors.primary}/>
            </View>
        )
    }

    if (error) {
        return (
            <View  style={styles.centered}>
                <Text>{error}</Text>
            </View>
        )
    }

    async function handleConfirm(orderId: string) {
      try {
        await updateOrderStatus(orderId, 'Selesai');
        loadOrders();
      } catch  {
        setError('Gagal update status, Coba lagi!');
      }
    }

    const filteredOrders = filterByDatePreset(orders, filter, (order) => (order.createdAt));

    const filterOptions: { value: FilterPreset; label: string } [] = [
      { value: 'hari-ini', label: 'Hari Ini' },
      { value: 'minggu-ini', label: 'Minggu Ini' },
      { value: 'bulan-ini', label: 'Bulan Ini'},
      { value: 'semua', label: 'Semua' },
    ]


    const jumlahBaru = orders.filter(order => order.status === 'Baru').length;

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.screenTitle}>Daftar Pesanan</Text>
        {jumlahBaru > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{jumlahBaru} Baru</Text>
          </View>
        )}
      </View>

      <View style={styles.filterRow}>
        {filterOptions.map((option) => (
          <TouchableOpacity 
            key={option.value}
            onPress={() => setFilter(option.value)}
            style={[
              styles.filterChip,
              filter === option.value && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === option.value && styles.filterChipTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data= {filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isBaru = item.status === 'Baru';

            return (
              <View style={styles.card}>
                  <View  style={styles.cardHeader}>
                      <Text style={styles.customerName}>{item.customerName}</Text>

                      <View style={[
                        styles.statusBadge,
                        isBaru ? styles.statusBadgeBaru : styles.statusBadgeSelesai
                      ]}>
                        <Text style={[
                          styles.statusText,
                          isBaru ? styles.statusTextBaru : styles.statusTextSelesai
                        ]}>
                          ● {item.status}
                        </Text>
                      </View>
                  </View>
                
                  <Text style={styles.orderText}>{item.orderText}</Text>

                  <View style={styles.footerRow}>
                    <View>
                      <Text style={styles.priceLabel}>TOTAL BAYAR</Text>
                      <Text style={styles.price}>Rp{item.totalPrice.toLocaleString('id-ID')}</Text>
                    </View>
                    <Text style={styles.orderDate}>{formatRelativeTime(item.createdAt)}</Text>
                  </View>

                  {item.status === 'Baru' && (
                    <TouchableOpacity 
                      style={styles.confirmButton}
                      onPress={() => handleConfirm(item.id)}
                    >
                      <CircleCheck color={colors.surface} size={18} />
                      <Text style={styles.confirmButtonText}>Tandai Selesai</Text>
                    </TouchableOpacity>
                  )}
              </View>
            )
          }}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  titleRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '500',
    color: colors.textDark,
  },
  countBadge: {
    backgroundColor: colors.pink,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countBadgeText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingVertical: 15,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: colors.surface
  },
  card: {
    backgroundColor: colors.surface,
    margin: 8,
    padding: 16,
    borderRadius: layout.cardRadius,
    ...layout.cardShadowLight,
    ...layout.cardBorder
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  customerName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.textDark,
    marginRight: 12
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center'
  },
  orderDate: {
    fontWeight: '600',
    fontSize: 13,
  },
  orderText: {
    marginTop: 8,
    color: colors.textDark,
    backgroundColor: '#F2F3FF',
    borderRadius: 8,
    padding: 6,
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginTop: 10
  },
  price: {
    marginTop: 4,
    fontWeight: 'bold',
  },
  statusBadge : {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextBaru: {
    color: '#2A1700',
  },
  statusTextSelesai: {
    color: '#2A1700',
  },
  statusBadgeBaru: {
    backgroundColor: '#FFDDB8',
    borderColor: colors.pink
  },
  statusBadgeSelesai: {
    backgroundColor: '#6CF8BB',           
    borderColor: colors.pink,
  },
  confirmButton: {
    backgroundColor: '#006C49',
    paddingVertical: 12,
    borderRadius: 24,        // dari 6 → 24, biar bulat penuh
    marginTop: 8,
    flexDirection: 'row',     // BARU
    justifyContent: 'center', // BARU
    alignItems: 'center',     // BARU
    gap: 8,                   // BARU — jarak icon ke teks
  },
  confirmButtonText: {
    color: colors.surface,
    fontWeight: 'bold',
  },
});

export default InboxScreen;