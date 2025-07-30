import { useState, useEffect } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { format, addDays, subDays, isToday } from 'date-fns';
import { motion } from 'framer-motion';
import VolatilityHeatmap from './VolatilityHeatmap';
import LiquidityIndicators from './LiquidityIndicators';
import PerformanceMetrics from './PerformanceMetrics';
import DataDashboard from './DataDashboard';
import useWebSocketData from '../lib/binanceWebSocket';


const CalendarComponent = ({ selectedDate, setSelectedDate, timeframe, cryptoPair }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { orderbookData } = useWebSocketData(cryptoPair);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') setCurrentMonth(addDays(currentMonth, 30));
    if (e.key === 'ArrowLeft') setCurrentMonth(subDays(currentMonth, 30));
    if (e.key === 'Enter' && selectedDate) setSelectedDate(selectedDate);
    if (e.key === 'Escape') setSelectedDate(null);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDate, setSelectedDate]);

  const renderDays = () => {
    const daysInMonth = new Array(30).fill(null).map((_, i) => {
      const date = addDays(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1), i);
      const data = orderbookData.find((d) => format(new Date(d.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')) || { volatility: {}, liquidity: {}, performance: {} };
      return { date, data };
    });

    return daysInMonth.map(({ date, data }, index) => (
      <Grid item xs={12} sm={4} md={2} key={index}>
        <Box
          sx={{
            position: 'relative',
            p: 1,
            border: selectedDate === format(date, 'yyyy-MM-dd') ? '2px solid blue' : '1px solid #ddd',
            bgcolor: isToday(date) ? '#e3f2fd' : 'white',
            cursor: 'pointer',
          }}
          onClick={() => setSelectedDate(format(date, 'yyyy-MM-dd'))}
          role="button"
          tabIndex={0}
          aria-label={`Select date ${format(date, 'MMMM d, yyyy')}`}
        >
          <VolatilityHeatmap data={data.volatility} />
          <LiquidityIndicators data={data.liquidity} />
          <PerformanceMetrics data={data.performance} />
          <Typography align="center">{format(date, 'd')}</Typography>
        </Box>
      </Grid>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      suppressHydrationWarning
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          {format(currentMonth, 'MMMM yyyy')}
        </Typography>
        <Grid container spacing={1}>
          {renderDays()}
        </Grid>
        {selectedDate && <DataDashboard date={selectedDate} data={orderbookData} />}
      </Box>
    </motion.div>
  );
};

export default CalendarComponent;