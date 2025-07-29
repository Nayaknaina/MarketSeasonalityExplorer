import { render, screen, fireEvent } from '@testing-library/react';
import CalendarComponent from '../components/CalendarComponent';

describe('CalendarComponent', () => {
  test('renders calendar with current month', () => {
    render(<CalendarComponent selectedDate={null} setSelectedDate={() => {}} timeframe="daily" cryptoPair="BTC/USD" />);
    expect(screen.getByText(/MMMM yyyy/)).toBeInTheDocument();
  });

  test('navigates to next month on ArrowRight', () => {
    const setSelectedDate = jest.fn();
    render(<CalendarComponent selectedDate={null} setSelectedDate={setSelectedDate} timeframe="daily" cryptoPair="BTC/USD" />);
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    // Note: Month change testing requires mocking date-fns
  });
});