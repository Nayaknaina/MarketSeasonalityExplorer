import { useState } from 'react';
import dynamic from 'next/dynamic';

// Define HomeClient outside of the Home component to prevent re-creation on render
const HomeClient = dynamic(() => import('../components/HomeClient'), { ssr: false });

export default function Home() {
  const [cryptoPair, setCryptoPair] = useState('BTC/USD'); // Initialize with a default value
  
  console.log('Root - cryptoPair:', cryptoPair); // Debug log

  return (
    <main>
      <HomeClient 
        cryptoPair={cryptoPair}
        setCryptoPair={setCryptoPair}
      />
    </main>
  );
}