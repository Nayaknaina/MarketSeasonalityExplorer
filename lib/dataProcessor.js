import { format } from 'date-fns';

export const processOrderbookData = (data) => {
  const bids = data.bids || [];
  const asks = data.asks || [];

  const volatility = calculateVolatility(bids, asks);
  const liquidity = calculateLiquidity(bids, asks);
  const performance = calculatePerformance(bids, asks);

  return {
    date: new Date().toISOString().split('T')[0],
    volatility,
    liquidity,
    performance: {
      open: bids[0]?.[0] || 0,
      high: Math.max(...bids.map(([p]) => parseFloat(p)), ...asks.map(([p]) => parseFloat(p))),
      low: Math.min(...bids.map(([p]) => parseFloat(p)), ...asks.map(([p]) => parseFloat(p))),
      close: asks[0]?.[0] || 0,
      change: ((asks[0]?.[0] || 0) - (bids[0]?.[0] || 0)) / (bids[0]?.[0] || 1) * 100,
      prices: [...bids, ...asks].map(([p]) => parseFloat(p)),
    },
    prices: [...bids, ...asks].map(([p], i) => ({ price: parseFloat(p), date: `T${i}` })),
    volumes: [...bids, ...asks].map(([, q], i) => ({ volume: parseFloat(q), date: `T${i}` })),
  };
};

const calculateVolatility = (bids, asks) => {
  const prices = [...bids, ...asks].map(([price]) => parseFloat(price));
  if (prices.length === 0) return 0;
  const mean = prices.reduce((sum, p) => sum + p, 0) / prices.length;
  const variance = prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length;
  return Math.sqrt(variance);
};

const calculateLiquidity = (bids, asks) => {
  return [...bids, ...asks].reduce((sum, [, qty]) => sum + parseFloat(qty), 0);
};

const calculatePerformance = (bids, asks) => {
  const bestBid = Math.max(...bids.map(([price]) => parseFloat(price)));
  const bestAsk = Math.min(...asks.map(([price]) => parseFloat(price)));
  return ((bestAsk - bestBid) / bestBid) * 100;
};

// --- New Function for Historical Data ---

const API_BASE_URL = 'https://api.binance.us/api/v3/klines';

/**
 * Fetches historical daily data for a given crypto pair and month.
 * @param {string} cryptoPair - e.g., 'BTC/USD'
 * @param {Date} monthDate - A date within the month to fetch data for.
 * @returns {Promise<Array>} - A promise that resolves to an array of processed daily data.
 */
export const getHistoricalData = async (cryptoPair, monthDate) => {
  if (!cryptoPair) {
    console.log('No cryptoPair provided, returning empty array');
    return [];
  }

  const symbol = cryptoPair.replace('/', '') + 'T';
  const interval = '1d';
  const startTime = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).getTime();
  const endTime = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59).getTime();

  const url = `${API_BASE_URL}?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}&limit=31`;
  console.log('Fetching from URL:', url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Binance API Error:', errorData);
      throw new Error(`Error fetching historical data: ${errorData.msg || response.statusText}`);
    }
    const klines = await response.json();
    console.log('Raw klines data:', klines);

    const processedData = klines.map((kline) => {
      const [openTime, open, high, low, close, volume] = kline;
      const openPrice = parseFloat(open);
      const closePrice = parseFloat(close);
      const change = ((closePrice - openPrice) / openPrice) * 100;

      return {
        date: format(new Date(openTime), 'yyyy-MM-dd'),
        volatility: parseFloat(high) - parseFloat(low),
        liquidity: parseFloat(volume),
        performance: {
          open: openPrice,
          high: parseFloat(high),
          low: parseFloat(low),
          close: closePrice,
          change: change,
        },
        prices: [openPrice, parseFloat(high), parseFloat(low), closePrice].map((p, i) => ({ price: p, date: `T${i}` })),
        volumes: [{ volume: parseFloat(volume), date: 'T0' }],
      };
    });

    console.log('Processed data:', processedData);
    return processedData;
  } catch (error) {
    console.error('Failed to fetch historical data:', error);
    return [];
  }
};