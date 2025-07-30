import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { processOrderbookData } from './dataProcessor';

const useWebSocketData = (cryptoPair) => {
  const pair = cryptoPair.replace('/', '').toLowerCase();
  const { lastMessage } = useWebSocket(`wss://stream.binance.com:9443/ws/${pair}@depth`);
  const [orderbookData, setOrderbookData] = useState([]);

  
  useEffect(() => {
    setOrderbookData([]);
  }, [cryptoPair]);

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const data = JSON.parse(lastMessage.data);
        const processedData = processOrderbookData(data);
        setOrderbookData((prev) => [...prev, processedData].slice(-30));
      } catch (error) {
        console.error('WebSocket data parsing error:', error);
      }
    }
  }, [lastMessage]);

  return { orderbookData };
};

export default useWebSocketData;