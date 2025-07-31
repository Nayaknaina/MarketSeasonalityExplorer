import { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ThemeSelector = () => {
  const [currentTheme, setCurrentTheme] = useState('default');

  useEffect(() => {
    const root = document.documentElement;
    if (currentTheme === 'high-contrast') {
      root.style.setProperty('--primary-color', '#000');
      root.style.setProperty('--background-color', '#fff');
      root.style.setProperty('--text-color', '#000');
      root.style.setProperty('--component-bg', '#fff');
      root.style.setProperty('--border-color', '#000');
    } else if (currentTheme === 'colorblind') {
      root.style.setProperty('--primary-color', '#004d40');
      root.style.setProperty('--background-color', '#e0f2f1');
      root.style.setProperty('--text-color', '#00251a');
      root.style.setProperty('--component-bg', '#b2dfdb');
      root.style.setProperty('--border-color', '#004d40');
    } else {
      root.style.setProperty('--primary-color', '#1976d2');
      root.style.setProperty('--background-color', '#fff');
      root.style.setProperty('--text-color', '#333');
      root.style.setProperty('--component-bg', '#fff');
      root.style.setProperty('--border-color', '#ddd');
    }
  }, [currentTheme]);

  return (
    <FormControl sx={{ minWidth: 120, mb: 2, bgcolor: 'var(--component-bg)' }}>
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