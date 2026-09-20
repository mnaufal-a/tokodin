import AppNavigator from './src/navigation/AppNavigator';
import { OverdueProvider } from './src/context/OverdueContext';
import { registerTranslation } from 'react-native-paper-dates';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

registerTranslation('id', {
  save: 'Simpan',
  selectSingle: 'Pilih tanggal',
  selectMultiple: 'Pilih tanggal',
  selectRange: 'Pilih periode',
  notAccordingToDateFormat: (inputFormat) => `Format tanggal harus ${inputFormat}`,
  mustBeHigherThan: (date) => `Harus setelah ${date}`,
  mustBeLowerThan: (date) => `Harus sebelum ${date}`,
  mustBeBetween: (startDate, endDate) => `Harus di antara ${startDate} - ${endDate}`,
  dateIsDisabled: 'Tanggal tidak diizinkan',
  previous: 'Sebelumnya',
  next: 'Selanjutnya',
  typeInDate: 'Ketik tanggal',
  pickDateFromCalendar: 'Pilih tanggal dari kalender',
  close: 'Tutup',
  hour: '',
  minute: '',
});

function App() {
  
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <OverdueProvider>
          <AppNavigator />
        </OverdueProvider>
      </PaperProvider>

    </SafeAreaProvider>
    
  )
}

export default App;