import { Button, Box } from '@mui/material'; // Add Box import
import jsPDF from 'jspdf';
import Papa from 'papaparse';

const ExportButton = ({ selectedDate, timeframe, data }) => {
  const handleExport = (format) => {
    const exportData = data.map((d) => ({
      date: d.date,
      volatility: d.volatility || 'N/A',
      liquidity: d.liquidity || 'N/A',
      
      performance: d.performance?.change?.toFixed(2) || 'N/A',
    }));

    if (format === 'csv') {
      const csv = Papa.unparse(exportData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `market_data_${selectedDate || 'all'}.csv`;
      link.click();
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      doc.text('Market Seasonality Data', 10, 10);
      exportData.forEach((d, i) => {
        doc.text(
          `${d.date}: Volatility=${d.volatility}, Liquidity=${d.liquidity}, Change=${d.performance}%`,
          10,
          20 + i * 10
        );
      });
      doc.save(`market_data_${selectedDate || 'all'}.pdf`);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Button onClick={() => handleExport('csv')} variant="contained" sx={{ mr: 1 }}>
        Export CSV
      </Button>
      <Button onClick={() => handleExport('pdf')} variant="contained">
        Export PDF
      </Button>
    </Box>
  );
};

export default ExportButton;