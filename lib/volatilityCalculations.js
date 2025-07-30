export const calculateStandardDeviation = (prices) => {
  if (!prices || prices.length === 0) return 0;
  const mean = prices.reduce((sum, p) => sum + p, 0) / prices.length;
  const variance = prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length;
  return Math.sqrt(variance);
};



export const calculateRSI = (prices, period = 14) => {
  if (!prices || prices.length < period) return 0;
  const gains = [];
  const losses = [];
  for (let i = 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains.push(diff);
    else losses.push(Math.abs(diff));
  }
  const avgGain = gains.slice(-period).reduce((sum, g) => sum + g, 0) / period;
  const avgLoss = losses.slice(-period).reduce((sum, l) => sum + l, 0) / period;
  return avgLoss === 0 ? 100 : 100 - (100 / (1 + (avgGain / avgLoss)));
};