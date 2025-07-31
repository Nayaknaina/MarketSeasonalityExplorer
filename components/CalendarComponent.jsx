import { useState, useEffect, useMemo } from 'react';
import { Grid, Box, Typography, Tooltip, IconButton, Button } from '@mui/material';
import { format, addDays, subDays, isToday, startOfMonth, endOfMonth, getDaysInMonth, getDay, getWeek, getMonth, getYear, addMonths, subMonths } from 'date-fns';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import VolatilityHeatmap from './VolatilityHeatmap';
import LiquidityIndicators from './LiquidityIndicators';
import PerformanceMetrics from './PerformanceMetrics';
import DataDashboard from './DataDashboard';
import { getHistoricalData } from '../lib/dataProcessor';

const CalendarComponent = ({ orderbookData, timeframe, selectedDate, setSelectedDate, cryptoPair }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [historicalData, setHistoricalData] = useState([]);

  console.log('CalendarComponent - cryptoPair:', cryptoPair); // Debug log

  useEffect(() => {
    const fetchMonthData = async () => {
      if (!cryptoPair) {
        console.log('No cryptoPair provided, skipping fetch');
        return;
      }
      
      console.log('Fetching data for:', cryptoPair, 'month:', format(currentMonth, 'yyyy-MM'));
      const data = await getHistoricalData(cryptoPair, currentMonth);
      console.log('Historical data received:', data);
      setHistoricalData(data || []);
    };

    fetchMonthData();
  }, [currentMonth, cryptoPair]);

  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = [];

    for (let d = start; d <= end; d = addDays(d, 1)) {
      const dateStr = format(d, 'yyyy-MM-dd');
      const history = historicalData.find((item) => item.date === dateStr);
      const live = orderbookData.find((item) => item.date === dateStr);

      // Prioritize live data for today, otherwise use historical data
      const data = isToday(d) && live ? live : history || {};

      days.push({ date: d, dateStr, data });
    }
    console.log('Days in month with data:', days);
    return days;
  }, [currentMonth, historicalData, orderbookData]);

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const renderDays = () => {
    return daysInMonth.map(({ date, dateStr, data }, index) => {
      const hasData = typeof data?.performance?.change === 'number';
      const tooltipTitle = (
        <Box>
          <Typography variant="caption">{dateStr}</Typography>
          {hasData ? (
            <>
              <Typography variant="caption" display="block">Change: {data.performance.change.toFixed(2)}%</Typography>
              <Typography variant="caption" display="block">Volume: {data.liquidity?.toFixed(2)}</Typography>
              <Typography variant="caption" display="block">Volatility: {data.volatility?.toFixed(4)}</Typography>
            </>
          ) : (
            <Typography variant="caption" display="block">No data</Typography>
          )}
        </Box>
      );

      return (
        <Grid item xs={12} sm={4} md={2} key={index}>
          <Tooltip title={tooltipTitle} arrow>
            <Box
              sx={{
                position: 'relative',
                p: 1,
                border: selectedDate === dateStr ? '2px solid blue' : '1px solid #ddd',
                bgcolor: isToday(date) ? '#e3f2fd' : 'white',
                cursor: 'pointer',
                minHeight: '60px',
                transition: 'background-color 0.3s, border-color 0.3s',
              }}
              onClick={() => setSelectedDate(dateStr)}
              onTouchStart={() => setSelectedDate(dateStr)}
              role="button"
              tabIndex={0}
              aria-label={`Select date ${format(date, 'MMMM d, yyyy')}`}
            >
              <VolatilityHeatmap data={data.volatility} />
              <LiquidityIndicators data={data.liquidity} />
              <PerformanceMetrics data={data.performance} />
              <Typography align="center">{format(date, 'd')}</Typography>
            </Box>
          </Tooltip>
        </Grid>
      );
    });
  };

  const renderWeeks = () => {
    const weeks = [];
    let week = [];
    daysInMonth.forEach((day, i) => {
      week.push(day);
      if ((i + 1) % 7 === 0 || i === daysInMonth.length - 1) {
        weeks.push(week);
        week = [];
      }
    });

    return weeks.map((weekData, weekIndex) => {
      const weekNumber = getWeek(weekData[0].date);
      const weekPerformance = weekData.reduce((acc, day) => acc + (day.data?.performance?.change || 0), 0) / weekData.length;
      const weekVolatility = weekData.reduce((acc, day) => acc + (day.data?.volatility || 0), 0) / weekData.length;
      const weekLiquidity = weekData.reduce((acc, day) => acc + (day.data?.liquidity || 0), 0);

      return (
        <Grid item xs={12} key={weekIndex}>
          <Box
            sx={{
              p: 1,
              border: selectedDate === `Week ${weekNumber}` ? '2px solid blue' : '1px solid #ddd',
              bgcolor: 'white',
              cursor: 'pointer',
            }}
            onClick={() => setSelectedDate(`Week ${weekNumber}`)}
            role="button"
            tabIndex={0}
            aria-label={`Select week ${weekNumber}`}
          >
            <Typography variant="h6">Week {weekNumber}</Typography>
            <PerformanceMetrics data={{ change: weekPerformance }} />
            <Typography variant="body2">Avg Volatility: {weekVolatility.toFixed(4)}</Typography>
            <Typography variant="body2">Total Liquidity: {weekLiquidity.toFixed(2)}</Typography>
          </Box>
        </Grid>
      );
    });
  };

  const renderMonths = () => {
    const monthStr = format(currentMonth, 'yyyy-MM');
    const monthPerformance = daysInMonth.reduce((acc, day) => acc + (day.data?.performance?.change || 0), 0) / daysInMonth.length;
    const monthVolatility = daysInMonth.reduce((acc, day) => acc + (day.data?.volatility || 0), 0) / daysInMonth.length;
    const monthLiquidity = daysInMonth.reduce((acc, day) => acc + (day.data?.liquidity || 0), 0);

    return (
      <Grid item xs={12}>
        <Box
          sx={{
            p: 2,
            border: selectedDate === monthStr ? '2px solid blue' : '1px solid #ddd',
            bgcolor: 'white',
            cursor: 'pointer',
          }}
          onClick={() => setSelectedDate(monthStr)}
          role="button"
          tabIndex={0}
          aria-label={`Select month ${format(currentMonth, 'MMMM yyyy')}`}
        >
          <Typography variant="h5">{format(currentMonth, 'MMMM yyyy')}</Typography>
          <PerformanceMetrics data={{ change: monthPerformance }} />
          <Typography variant="body2">Avg Volatility: {monthVolatility.toFixed(4)}</Typography>
          <Typography variant="body2">Total Liquidity: {monthLiquidity.toFixed(2)}</Typography>
        </Box>
      </Grid>
    );
  };

  const renderHeader = () => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <IconButton onClick={handlePrevMonth} aria-label="Previous month">
        <ChevronLeft />
      </IconButton>
      <Typography variant="h5">{format(currentMonth, 'MMMM yyyy')}</Typography>
      <IconButton onClick={handleNextMonth} aria-label="Next month">
        <ChevronRight />
      </IconButton>
    </Box>
  );

  return (
    <Box>
      {renderHeader()}
      <Grid container spacing={1}>
        {timeframe === 'daily' && renderDays()}
        {timeframe === 'weekly' && renderWeeks()}
        {timeframe === 'monthly' && renderMonths()}
      </Grid>
      {selectedDate && (
        <DataDashboard
          isOpen={!!selectedDate}
          onClose={() => setSelectedDate(null)}
          data={daysInMonth.find(d => d.dateStr === selectedDate)?.data || {}}
          timeframe={timeframe}
        />
      )}
    </Box>
  );
};

export default CalendarComponent;