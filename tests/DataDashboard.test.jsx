import { render, screen } from '@testing-library/react';
import DataDashboard from '../components/DataDashboard';

describe('DataDashboard', () => {
  test('renders modal with date details', () => {
    const data = [{ date: '2025-07-26', performance: { open: 50000, high: 51000, low: 49000, close: 50500 }, volatility: [50000, 51000], liquidity: 1000 }];
    render(<DataDashboard date="2025-07-26" data={data} />);
    expect(screen.getByText(/Details for 2025-07-26/)).toBeInTheDocument();
    expect(screen.getByText(/Open: 50000/)).toBeInTheDocument();
  });
});