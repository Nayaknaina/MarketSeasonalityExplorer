import { useState, useEffect, useMemo } from 'react';
import useWebSocket from 'react-use-websocket';
import { processOrderbookData } from './dataProcessor';

const useWebSocketData = (cryptoPair) => {
  // Guard clause to prevent crash on initial render if cryptoPair is undefined
  if (!cryptoPair) {
    return { orderbookData: [] };
  }

  const isBrowser = typeof window !== 'undefined';
  const pair = cryptoPair.replace('/', '').toLowerCase();
  const socketUrl = `wss://stream.binance.com:9443/ws/${pair}@depth`;
  console.log(socketUrl);

  const [orderbookData, setOrderbookData] = useState([]);

  const options = useMemo(() => ({
    onOpen: () => {
      console.log(`WebSocket connection opened for ${pair}`);
      setOrderbookData([]); // Clear data only when a new connection successfully opens
    },
    onClose: () => console.log(`WebSocket connection closed for ${pair}`),
    shouldReconnect: (closeEvent) => true,
  }), [pair]);

  const { lastMessage } = isBrowser ? useWebSocket(socketUrl, options) : { lastMessage: null };

  useEffect(() => {
    const dataBuffer = [];

    const interval = setInterval(() => {
      if (dataBuffer.length === 0) return;

      // Process the buffered data
      const latestData = dataBuffer.pop(); // Use the most recent data point for the update
      dataBuffer.length = 0; // Clear the buffer

      const processedData = processOrderbookData(latestData);

      setOrderbookData((prev) => {
        const otherDays = prev.filter((d) => d.date !== processedData.date);
        return [...otherDays, processedData];
      });
    }, 1000); // Update the UI once per second

    if (lastMessage !== null) {
      try {
        const rawData = JSON.parse(lastMessage.data);
        dataBuffer.push({ bids: rawData.b, asks: rawData.a });
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    }

    return () => clearInterval(interval); // Cleanup on unmount
  }, [lastMessage]);

  return { orderbookData };
};

export default useWebSocketData;