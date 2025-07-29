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
    prices: [...bids, ...asks].map(([p]) => ({ price: parseFloat(p), date: new Date().toISOString() })),
    volumes: [...bids, ...asks].map(([, q]) => ({ volume: parseFloat(q), date: new Date().toISOString() })),
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