import { Box } from '@mui/material';

const LiquidityIndicators = ({ data }) => {
  const getPattern = (liquidity) => {
    if (!liquidity) return 'none';
    if (liquidity < 1000) return 'url(#stripes)';
    if (liquidity < 5000) return 'url(#dots)';
    return 'url(#gradient)';
  };

  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <svg width="0" height="0">
        <defs>
          <pattern id="stripes" patternUnits="userSpaceOnUse" width="4" height="4">
            <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="#000" strokeWidth="1" />
          </pattern>
          <pattern id="dots" patternUnits="userSpaceOnUse" width="4" height="4">
            <circle cx="2" cy="2" r="1" fill="#000" />
          </pattern>
          <linearGradient id="gradient">
            <stop offset="0%" style={{ stopColor: '#00f' }} />
            <stop offset="100%" style={{ stopColor: '#0ff' }} />
          </linearGradient>
        </defs>
      </svg>
      <Box sx={{ height: '10px', bgcolor: getPattern(data) }} />
    </Box>
  );
};

export default LiquidityIndicators;