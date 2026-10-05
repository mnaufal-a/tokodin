import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InboxScreen from '../screens/InboxScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ChatHistoryScreen from '../screens/ChatHistoryScreen';
import KasEntryScreen from '../screens/KasEntryScreen';
import LaporanScreen from '../screens/LaporanScreen';
import AccountScreen from '../screens/AccountScreen';
import { Home, MessageCircle, Inbox, BarChart3, User } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useOverdue } from '../context/OverdueContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';

const Tab = createBottomTabNavigator();
const DashboardStack = createNativeStackNavigator();

function HeaderLogo() {
  return (
    <Image
      source={require('../assets/logo.png')}
      style={{ width: 32, height: 32, marginRight: 14, borderRadius: 8 }}
    />
  );
}

function DashboardTabIcon({ color, size }: { color: string; size: number }) {
  return <Home color={color} size={size}/>
}

function InboxTabIcon({ color, size }: { color: string; size: number }) {
  return <Inbox color={color} size={size}/>
}

function LaporanTabIcon({ color, size }: {color: string; size: number}) {
  return <BarChart3 color={color} size={size}/>
}

function ChatHistoryTabIcon({ color, size }: { color: string; size: number }) {
  return <MessageCircle color={color} size={size}/>
}

function AkunTabIcon({ color, size }: { color: string; size: number}) {
  return <User color={color} size={size}/>
}


function DashboardStackNavigator() {
  return (
    <DashboardStack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: colors.primary},
        headerTintColor: colors.surface,
        headerTitleStyle: {fontWeight: 'bold'}
      }}
    >
      <DashboardStack.Screen
        name='DashboardMain'
        component={DashboardScreen}
        options={{ title: 'Statistik Harian', headerRight: HeaderLogo}}
      />

      <DashboardStack.Screen
        name='KasEntry'
        component={KasEntryScreen}
        options={{ title: 'Catat Kas' }}
      />
    </DashboardStack.Navigator>
  )
}

function AppNavigator() {
  const { overdueCount } = useOverdue();

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName='Beranda'
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.surface,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textDark,
          tabBarStyle: {
            backgroundColor: colors.surface,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold'
          },
          headerRight: HeaderLogo
        }}
      >

        <Tab.Screen
          name="Riwayat"
          component={ChatHistoryScreen}
          options={{
            headerShown: true,
            title: 'Riwayat',
            tabBarIcon: ChatHistoryTabIcon,
          }}
        />

        <Tab.Screen
          name="Pesan"
          component={InboxScreen}
          options={{
            headerShown: true,
            title: 'Pesan',
            tabBarIcon: InboxTabIcon,
            tabBarBadge: overdueCount > 0 ? overdueCount : undefined,
          }}
        />

        <Tab.Screen
          name="Beranda"
          component={DashboardStackNavigator}
          options={{
            title: 'Beranda',
            tabBarIcon: DashboardTabIcon,
          }}
        />

        <Tab.Screen
          name="Laporan"
          component={LaporanScreen}
          options={{
            headerShown: true,
            title: 'Laporan',
            tabBarIcon: LaporanTabIcon,
          }}
        />

        <Tab.Screen
          name="Akun"
          component={AccountScreen}
          options={{
            headerShown: true,
            title: 'Akun',
            tabBarIcon: AkunTabIcon,
          }}
        />

      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;