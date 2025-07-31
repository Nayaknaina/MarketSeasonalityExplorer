import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Filters from './Filters';
import ThemeSelector from './ThemeSelector';
import CalendarComponent from './CalendarComponent';
import ExportButton from './ExportButton';
import useWebSocketData from '../lib/binanceWebSocket';

const HomeClient = ({ cryptoPair, setCryptoPair }) => {
  const [timeframe, setTimeframe] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(null);
  const { orderbookData } = useWebSocketData(cryptoPair);

  console.log('HomeClient - cryptoPair:', cryptoPair); // Debug log

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Market Seasonality Explorer
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Filters
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          cryptoPair={cryptoPair}
          setCryptoPair={setCryptoPair}
        />
        <ThemeSelector />
      </Box>
      <CalendarComponent
        orderbookData={orderbookData}
        timeframe={timeframe}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        cryptoPair={cryptoPair}  // Make sure this is passed
      />
      <ExportButton data={orderbookData} selectedDate={selectedDate} />
    </Box>
  );
};

export default HomeClient;
