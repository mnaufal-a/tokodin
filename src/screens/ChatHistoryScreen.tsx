import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import { View, Text, StyleSheet,ActivityIndicator,FlatList, TouchableOpacity, TextInput } from "react-native";
import { getChatHistory, ChatLog } from "../api/chatHistoryApi";
import { colors } from "../theme/colors";
import { layout } from "../theme/layout";
import { formatRelativeTime } from "../utils/formatDate";
import { filterByDatePreset, FilterPreset } from "../utils/dateFilter";
import { Search } from "lucide-react-native";

function ChatHistoryScreen({ navigation }: { navigation: NavigationProp<any> }) {
    const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterPreset>('semua');
    const [search, setSearch] = useState("");

    useFocusEffect(
        useCallback(() => {
            loadChatHistory();
        }, [])
    )

    //buat re-tab yang udah aktif
    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress' as never, () => {
            loadChatHistory();
        });
        return unsubscribe;
    }, [navigation])

    async function loadChatHistory() {
        try {
            setLoading(true);
            const data = await getChatHistory();
            setChatLogs(data);
            setError(null)
        } catch {
            setError('Gagal memuat riwayat chat, coba lagi!');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary}/>
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

    const matchChat = (log: ChatLog, query: string) => {
        const searchText = query.toLocaleLowerCase();

        return (
            log.customerName?.toLowerCase().includes(searchText) ||

            log.phoneNumber?.toLowerCase().includes(searchText)
        )
    }

    const filteredLogs = filterByDatePreset(
        chatLogs, 
        filter, (log) => log.Timestamp)
        .filter((log) => matchChat(log, search));

    const filterOptions: {value: FilterPreset; label: string} [] = [
        { value: 'hari-ini', label: 'Hari Ini'},
        { value: 'minggu-ini', label: 'Minggu Ini'},
        { value: 'bulan-ini', label: 'Bulan Ini'},
        { value: 'semua', label: 'Semua'},
    ]


    return (
        <View style={styles.container} >
            <View style={styles.searchRow}>
                <Search size={20}/>
                <TextInput
                    style={styles.search}
                    placeholder="Cari nama, nomor HP, atau pesanan..."
                    value={search}
                    onChangeText={setSearch}
                />
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
                data={filteredLogs}
                keyExtractor={(item, index) => `${item.phoneNumber}-${index}`}
                renderItem={({item}) => (
                    <View style={styles.card} >
                        <View style={styles.cardHeader}>
                            <Text style={styles.customerName}>{item.customerName}</Text>
                            <Text style={styles.phoneNumber}>+{item.phoneNumber}</Text>
                        </View>
                        <View style ={styles.messageBubbleIn}>
                            <Text style={styles.messageLabel}>Customer:</Text>
                            <Text style={styles.messageText}>{item.messageIn}</Text>
                        </View>
                        <View style={styles.messageBubbleOut}>
                            <Text style={styles.messageLabel}>Din (AI):</Text>
                            <Text style={styles.messageText}>{item.messageOut}</Text>
                        </View>

                        <Text style={styles.dateText}>{formatRelativeTime(item.Timestamp)}</Text>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: layout.cardRadius,
        padding: 8,
        backgroundColor: colors.surface,
        ...layout.cardBorder,
        ...layout.cardShadowLight,
        margin: 16,
    },
    search: {
        fontSize: 16,
        marginLeft: 6
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: colors.surface,
        margin: 8,
        padding: 16,
        borderRadius: layout.cardRadius,
        ...layout.cardBorder,
        ...layout.cardShadowLight
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    customerName: {
        fontWeight: 'bold',
        fontSize: 16,
        color: colors.textDark,
    },
    phoneNumber: {
        fontSize: 12,
        color: colors.textDark,
    },
    messageBubbleIn: {
        backgroundColor: colors.background,
        padding: 8,
        borderRadius: 6,
        marginBottom: 6,
    },
    messageBubbleOut: {
        backgroundColor: colors.background,
        padding: 8,
        borderRadius: 6,
    },
    messageLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 2,
    },
    messageText: {
        fontSize: 13,
        color: colors.textDark,
    },
    dateText: {
        alignSelf: 'flex-end',
        fontSize: 12,
        marginTop: 6,
        color: colors.textDark,
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
});

export default ChatHistoryScreen;