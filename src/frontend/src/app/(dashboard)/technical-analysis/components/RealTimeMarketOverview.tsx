'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const RealTimeMarketOverview = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([
    { symbol: 'SPY', name: 'S&P 500 ETF', price: 445.32, change: 2.15, changePercent: 0.48 },
    { symbol: 'QQQ', name: 'NASDAQ ETF', price: 378.45, change: -1.23, changePercent: -0.32 },
    { symbol: 'DIA', name: 'Dow Jones ETF', price: 356.78, change: 0.89, changePercent: 0.25 },
    { symbol: 'VIX', name: 'Volatility Index', price: 18.45, change: -0.67, changePercent: -3.51 },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => 
        prev.map(item => ({
          ...item,
          price: item.price + (Math.random() - 0.5) * 2,
          change: (Math.random() - 0.5) * 4,
          changePercent: (Math.random() - 0.5) * 2,
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Activity className="mr-2 h-5 w-5 text-blue-600" />
          Real-Time Market Overview
        </h2>
        <div className="flex items-center text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          Live Data
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {marketData.map((item, index) => (
          <motion.div
            key={item.symbol}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">{item.symbol}</span>
              {item.change >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
            <div className="text-sm text-gray-600 mb-2">{item.name}</div>
            <div className="text-lg font-bold text-gray-900">
              ${item.price.toFixed(2)}
            </div>
            <div className={`text-sm font-medium ${
              item.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Market Summary</h3>
        <p className="text-sm text-blue-700">
          Markets showing mixed signals with technology stocks under pressure while defensive sectors gain.
          Volatility remains elevated amid ongoing economic uncertainty.
        </p>
      </div>
    </motion.div>
  );
};

export default RealTimeMarketOverview;