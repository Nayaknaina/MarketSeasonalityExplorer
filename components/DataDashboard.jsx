import { Modal, Box, Typography, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { calculateStandardDeviation, calculateRSI } from '../lib/volatilityCalculations';

const DataDashboard = ({ date, data, timeframe, onClose }) => {
  const selectedData = data.find((d) => d.date === date) || {};
  const chartData = (selectedData.prices || []).map((price, i) => ({ date: `T${i}`, price }));
  const volumeData = (selectedData.volumes || []).map((volume, i) => ({ date: `T${i}`, volume }));

  return (
    <Modal open={!!date} onClose={onClose}>
      <Box sx={{ position: 'relative', p: 4, bgcolor: 'white', borderRadius: 2, maxWidth: 600, mx: 'auto', mt: 10, overflowY: 'auto' }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6">Details for {date} ({timeframe})</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography>Open: {selectedData.performance?.open || 'N/A'}</Typography>
        <Typography>High: {selectedData.performance?.high || 'N/A'}</Typography>
        <Typography>Low: {selectedData.performance?.low || 'N/A'}</Typography>
        <Typography>Close: {selectedData.performance?.close || 'N/A'}</Typography>
        <Typography>Volume: {selectedData.liquidity || 'N/A'}</Typography>
        <Typography>Volatility: {calculateStandardDeviation(selectedData.volatility || [])}</Typography>
        <Typography>RSI: {calculateRSI(selectedData.performance?.prices || [])}</Typography>
        <LineChart width={500} height={300} data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
        </LineChart>
        <BarChart width={500} height={300} data={volumeData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="volume" fill="#82ca9d" />
        </BarChart>
      </Box>
    </Modal>
  );
};

export default DataDashboard;