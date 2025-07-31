import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const Filters = ({ timeframe, setTimeframe, cryptoPair, setCryptoPair }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <FormControl sx={{ minWidth: 120, bgcolor: 'var(--component-bg)' }}>
        <InputLabel>Timeframe</InputLabel>
        <Select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} label="Timeframe">
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 120, bgcolor: 'var(--component-bg)' }}>
        <InputLabel>Crypto Pair</InputLabel>
        <Select value={cryptoPair} onChange={(e) => setCryptoPair(e.target.value)} label="Crypto Pair">
          <MenuItem value="BTC/USD">BTC/USD</MenuItem>
          <MenuItem value="ETH/USD">ETH/USD</MenuItem>
          <MenuItem value="XRP/USD">XRP/USD</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default Filters;