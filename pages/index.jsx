import { useState } from 'react';
import { Container, Box } from '@mui/material';
import CalendarComponent from '../components/CalendarComponent';
import Filters from '../components/Filters';
import ThemeSelector from '../components/ThemeSelector';
import ExportButton from '../components/ExportButton';
import useWebSocketData from '../lib/binanceWebSocket';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeframe, setTimeframe] = useState('daily');
  const [cryptoPair, setCryptoPair] = useState('BTC/USD');
  const { orderbookData } = useWebSocketData(cryptoPair);

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Filters timeframe={timeframe} setTimeframe={setTimeframe} cryptoPair={cryptoPair} setCryptoPair={setCryptoPair} />
        <ThemeSelector />
        <CalendarComponent selectedDate={selectedDate} setSelectedDate={setSelectedDate} timeframe={timeframe} cryptoPair={cryptoPair} orderbookData={orderbookData} />
        <ExportButton selectedDate={selectedDate} timeframe={timeframe} data={orderbookData} />
      </Box>
    </Container>
  );
}