import { Box } from '@mui/material';

const VolatilityHeatmap = ({ data }) => {
  const getColor = (volatility) => {
    if (!volatility) return '#fff';
    if (volatility < 10) return '#4caf50'; // Low: Green
    if (volatility < 20) return '#ffeb3b'; // Medium: Yellow
    return '#f44336'; // High: Red
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.3,
        bgcolor: getColor(data),
      }}
    />
  );
};

export default VolatilityHeatmap;