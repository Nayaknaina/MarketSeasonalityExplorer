import { Modal, Box, Typography, Divider } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { calculateStandardDeviation, calculateRSI } from '../lib/volatilityCalculations';

const DataDashboard = ({ date, data }) => {
  const selectedData = data.find((d) => d.date === date) || {};
  const chartData = (selectedData.prices || []).map((price, i) => ({ date: `T${i}`, price }));
  const volumeData = (selectedData.volumes || []).map((volume, i) => ({ date: `T${i}`, volume }));

  return (
    <Modal open={!!date} onClose={() => {}}>
      <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 2, maxWidth: 600, mx: 'auto', mt: 10, overflowY: 'auto' }}>
        <Typography variant="h6">Details for {date}</Typography>
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