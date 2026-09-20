import { useState,useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { getOrders, Order, updateOrderStatus } from '../api/ordersApi';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { useOverdue } from '../context/OverdueContext';
import { formatDate } from '../utils/formatDate';
import { filterByDatePreset,FilterPreset } from '../utils/dateFilter';

const ONE_HOUR_MS = 60 *60 * 1000;

function countOverdueOrders(orders: Order[]): number {
  const now = new Date().getTime();

  return orders.filter((order) => {
    const orderTime = new Date(order.createdAt).getTime();
    const elapsed = now - orderTime;
    return order.status === 'Baru' && elapsed > ONE_HOUR_MS;
  }).length;
}

function InboxScreen() {
    const { setOverdueCount } = useOverdue();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterPreset>('semua');

    useEffect (() => {
      loadOrders();
    }, []);
    
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

  return (
    <View style={styles.container}>
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
        renderItem={({ item }) => (

          
            <View style={styles.card}>
                <View  style={styles.cardHeader}>
                    <Text style={styles.customerName}>{item.customerName}</Text>

                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                </View>
              
                <Text style={styles.orderText}>{item.orderText}</Text>

                <View style={styles.footerRow}>
                  <Text style={styles.price}>Rp{item.totalPrice.toLocaleString('id-ID')}</Text>
                  <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
                </View>

                {item.status === 'Baru' && (
                  <TouchableOpacity 
                    style={styles.confirmButton}
                    onPress={() => handleConfirm(item.id)}
                  >
                    <Text style={styles.confirmButtonText}>Tandai Selesai</Text>
                  </TouchableOpacity>
                )}
            </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    ...layout.cardShadow
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
  },
  price: {
    marginTop: 4,
    fontWeight: 'bold',
  },
  statusBadge : {
    backgroundColor: colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: 'bold'
  },
  confirmButton: {
  backgroundColor: colors.success,
  paddingVertical: 8,
  borderRadius: 6,
  marginTop: 8,
  alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.surface,
    fontWeight: 'bold',
  },
});

export default InboxScreen;