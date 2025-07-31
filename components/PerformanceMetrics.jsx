import { Box, Typography } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const PerformanceMetrics = ({ data }) => {
  const { change } = data || {};

  // Only render if change is a valid number
  if (typeof change !== 'number' || isNaN(change)) {
    return null; // Don't render anything if there's no data
  }

  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
      {isNeutral ? (
        <Typography sx={{ color: '#999' }}>Neutral</Typography>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', color: isPositive ? '#4caf50' : '#f44336' }}>
          {isPositive ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
          <Typography>{Math.abs(change).toFixed(2)}%</Typography>
        </Box>
      )}
    </Box>
  );
};

export default PerformanceMetrics;