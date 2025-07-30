import { useState, useEffect } from 'react'; // Add this import
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ThemeSelector = () => {
  const [currentTheme, setCurrentTheme] = useState('default');

  
  useEffect(() => {
    const root = document.documentElement;
    if (currentTheme === 'high-contrast') {
      root.style.setProperty('--primary-color', '#000');
      root.style.setProperty('--background-color', '#fff');
    } else if (currentTheme === 'colorblind') {
      root.style.setProperty('--primary-color', '#004d40');
      root.style.setProperty('--background-color', '#e0f2f1');
    } else {
      root.style.setProperty('--primary-color', '#1976d2');
      root.style.setProperty('--background-color', '#fff');
    }
  }, [currentTheme]);

  return (
    <FormControl sx={{ minWidth: 120, mb: 2 }}>
      <InputLabel>Theme</InputLabel>
      <Select value={currentTheme} onChange={(e) => setCurrentTheme(e.target.value)} label="Theme">
        <MenuItem value="default">Default</MenuItem>
        <MenuItem value="high-contrast">High Contrast</MenuItem>
        <MenuItem value="colorblind">Colorblind-Friendly</MenuItem>
      </Select>
    </FormControl>
  );
};

export default ThemeSelector;